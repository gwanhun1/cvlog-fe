const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Run the actual server helpers with an isolated upstream, without production data.
function setup(get, { deadline = false } = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    vm.runInNewContext(source, {
      exports, Response, AbortController,
      setTimeout: deadline ? (fn) => setTimeout(fn, 20) : setTimeout,
      clearTimeout,
      require(name) {
        if (name === 'axios') return { default: { get } };
        if (name === 'utils/apiUrl') return { getServerApiBaseUrl: () => 'http://fixture' };
        const base = name.startsWith('.') ? path.resolve(path.dirname(file), name) : path.resolve(name);
        return load(`${base}.ts`);
      },
    }, { filename: file });
    return exports;
  }
  return load;
}
const post = (id, extra = {}) => ({ id, title: `Article ${id}`, content: `Body ${id}`, public_status: true, created_at: '2026-09-01T00:00:00Z', updated_at: '2026-09-02T00:00:00Z', tags: [], ...extra });
const listResponse = (posts, maxPage = 1) => ({ status: 200, data: { success: true, data: { posts, maxPage } } });
const detailResponse = (value) => ({ status: 200, data: { success: true, data: { post: value, prevPostInfo: null, nextPostInfo: null } } });
const context = (pid = '71') => ({ params: { pid } });

test('sitemap uses one metadata request and preserves dates and XML-safe images', async () => {
  const requested = [];
  const load = setup(async url => {
    requested.push(url);
    return listResponse([1, 2, 3].map(id => post(id, { title: 'A & B <C>', thumbnail: 'https://example.com/image?a=1&b=2' })));
  });
  const { fetchSitemapPosts, generateSiteMap } = load('server/sitemap.ts');
  const posts = await fetchSitemapPosts();
  assert.deepEqual(requested, ['http://fixture/posts/public/sitemap']);
  const xml = generateSiteMap(posts);
  assert.equal((xml.match(/<url>/g) || []).length, 6);
  assert.match(xml, /article\/content\/3/);
  assert.match(xml, /2026-09-02T00:00:00.000Z/);
  assert.match(xml, /A &amp; B &lt;C&gt;/);
  assert.match(xml, /a=1&amp;b=2/);
  assert.doesNotMatch(xml, /<loc>https:\/\/logme.cloud<\/loc><lastmod>/);
});

test('upstream failure rejects sitemap regeneration instead of publishing a partial document', async () => {
  const load = setup(async () => { throw new Error('upstream unavailable'); });
  await assert.rejects(load('app/sitemap.xml/route.ts').GET(), /upstream unavailable/);
});

test('sitemap rejects malformed, private, duplicate and oversized responses', async () => {
  for (const data of [
    {}, { data: { posts: null } },
    { data: { posts: [post(1, { public_status: false })] } },
    { data: { posts: [post(1), post(1)] } },
    { data: { posts: Array.from({ length: 50001 }, (_, i) => post(i + 1)) } },
  ]) {
    await assert.rejects(setup(async () => ({ status: 200, data }))('server/sitemap.ts').fetchSitemapPosts());
  }
});

test('sitemap shares a bounded deadline and aborts pending upstream calls without retrying', async () => {
  let calls = 0;
  const load = setup((_url, { signal }) => {
    calls++;
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('deadline')), { once: true }));
  }, { deadline: true });
  await assert.rejects(load('server/sitemap.ts').fetchSitemapPosts(), /deadline/);
  assert.equal(calls, 1);
});

test('a genuinely empty public site can generate its static URLs', async () => {
  const load = setup(async () => listResponse([]));
  const response = await load('app/sitemap.xml/route.ts').GET();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Content-Type'), /application\/xml/);
  assert.equal(((await response.text()).match(/<url>/g) || []).length, 3);
});

test('public detail is rendered, missing detail is 404, private detail contains no cached content', async () => {
  const normal = await setup(async () => detailResponse(post(71)))('server/articleDetail.ts').getArticleStaticProps(context());
  assert.equal(normal.props.initialData.post.id, 71);
  const missing = await setup(async () => ({ status: 404 }))('server/articleDetail.ts').getArticleStaticProps(context());
  assert.equal(missing.notFound, true);
  for (const response of [{ status: 403 }, detailResponse(post(71, { public_status: false }))]) {
    const result = await setup(async () => response)('server/articleDetail.ts').getArticleStaticProps(context());
    assert.equal(result.props.initialData, null);
  }
});

test('detail network errors, 429/5xx, and malformed responses propagate so ISR retains good HTML', async () => {
  for (const get of [
    async () => { throw new Error('timeout'); },
    ...[429, 500, 502, 503].map(status => async () => ({ status })),
    async () => ({ status: 200, data: {} }),
    async () => detailResponse(post(72)),
  ]) {
    await assert.rejects(setup(get)('server/articleDetail.ts').getArticleStaticProps(context()));
  }
});

test('invalid article IDs return 404 before making upstream requests', async () => {
  const load = setup(async () => { throw new Error('must not fetch'); });
  for (const pid of ['0', '-1', '71x', '01', '9007199254740992', ['71'], undefined]) {
    const result = await load('server/articleDetail.ts').getArticleStaticProps({ params: { pid } });
    assert.equal(result.notFound, true);
  }
});

test('detail aborts a stalled connection and rejects regeneration without retrying', async () => {
  let calls = 0;
  const load = setup((_url, { signal }) => {
    calls++;
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('deadline')), { once: true }));
  }, { deadline: true });
  await assert.rejects(load('server/articleDetail.ts').getArticleStaticProps(context()), /deadline/);
  assert.equal(calls, 1);
});

test('public list rejects outages and strips author fields that must not enter static props', async () => {
  const load = setup(async () => listResponse([post(71, { user: { id: 1, name: 'Author', refresh_token: 'must-not-leak' } })]));
  const list = await load('server/publicArticles.ts').getPublicArticlePage(1);
  assert.equal(list.posts[0].user.name, 'Author');
  assert.equal(JSON.stringify(list).includes('must-not-leak'), false);
  for (const get of [async () => ({ status: 503 }), async () => ({ status: 200, data: { data: { posts: [] } } })]) {
    await assert.rejects(setup(get)('server/publicArticles.ts').getPublicArticlePage(1));
  }
  assert.equal(await setup(async () => ({ status: 400 }))('server/publicArticles.ts').getPublicArticlePage(99), null);
});

test('archive URLs have strict page numbers and a single first-page canonical', () => {
  const { parseArticlePage, publicArticlePagePath } = setup(() => {})('utils/articlePagination.ts');
  for (const value of ['0', '01', '-1', '2.5', '2junk', '9007199254740992', ['2'], undefined]) {
    assert.equal(parseArticlePage(value), null);
  }
  assert.equal(parseArticlePage('2'), 2);
  assert.equal(publicArticlePagePath(1), '/article');
  assert.equal(publicArticlePagePath(2), '/article/page/2');
});
