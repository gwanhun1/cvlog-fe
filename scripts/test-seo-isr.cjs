// Production-mode regression: build an isolated checkout against a mock API,
// verify HTML/XML and real ISR behavior across an outage and recovery.
// Takes about 6 minutes (including the sitemap's actual 300-second TTL).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

const root = path.resolve(__dirname, '..');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'logme-seo-isr-'));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let outage = false;
let revision = 1;
let failures = 0;
let next;
const makePost = id => ({
  id, title: `SEO fixture ${id} revision ${revision}`, content: `Verified body ${id} revision ${revision}`,
  public_status: true, created_at: '2026-09-01T00:00:00.000Z', updated_at: `2026-09-0${revision}T00:00:00.000Z`,
  tags: [], user: { id: 1, name: 'Fixture author', username: 'fixture', profile_image: null },
  view_count: 0, like_count: 0, is_liked: false,
});
const api = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://fixture');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control');
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  const send = (status, data) => { res.statusCode = status; res.end(JSON.stringify(data)); };
  if (outage && url.pathname.startsWith('/posts/')) {
    failures++;
    return send(503, { success: false });
  }
  if (url.pathname === '/posts/public/sitemap') {
    return send(200, { success: true, data: { posts: Array.from({ length: 20 }, (_, i) => {
      const { id, title, public_status, created_at, updated_at } = makePost(i + 1);
      return { id, title, public_status, created_at, updated_at };
    }) } });
  }
  const list = url.pathname.match(/^\/posts\/public\/page\/(\d+)$/);
  if (list) {
    const page = Number(list[1]);
    if (page > 2) return send(400, { success: false });
    const posts = Array.from({ length: 10 }, (_, i) => makePost((2 - page) * 10 + 10 - i));
    return send(200, { success: true, data: { posts, maxPage: 2 } });
  }
  const detail = url.pathname.match(/^\/posts\/(\d+)$/);
  if (detail) {
    const id = Number(detail[1]);
    if (id === 98) return send(403, { success: false });
    if (id === 99) return send(404, { success: false });
    return send(200, { success: true, data: { post: makePost(id), prevPostInfo: null, nextPostInfo: null } });
  }
  if (url.pathname === '/posts/popular') return send(200, { success: true, data: [] });
  return send(200, { success: true, data: [] });
});

async function main() {
  await new Promise(resolve => api.listen(0, '127.0.0.1', resolve));
  const apiUrl = `http://127.0.0.1:${api.address().port}`;
  fs.cpSync(root, directory, {
    recursive: true,
    filter: source => !path.basename(source).startsWith('.env') && !['node_modules', '.git', '.next', '.vercel', '.yarn', '.env', '.env.local', '.env.production', '.env.development', '.env.test'].includes(path.basename(source)),
  });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'dir');
  const env = { ...process.env, API_SERVER_URL: apiUrl, NEXT_PUBLIC_API_BASE_URL: apiUrl, NEXT_PUBLIC_VERCEL_ENV: 'preview', NEXT_TELEMETRY_DISABLED: '1' };
  const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
  const build = spawn(process.execPath, [nextBin, 'build'], { cwd: directory, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let buildLog = '';
  build.stdout.on('data', data => { buildLog += data; });
  build.stderr.on('data', data => { buildLog += data; });
  const [code] = await once(build, 'exit');
  fs.writeFileSync(path.join(directory, 'build-test.log'), buildLog);
  assert.equal(code, 0, buildLog);
  console.log('PASS production build', directory);
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, '.next/prerender-manifest.json'), 'utf8'));
  assert.equal(manifest.routes['/sitemap.xml'].initialRevalidateSeconds, 300);
  const listener = http.createServer();
  await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve));
  const port = listener.address().port;
  await new Promise(resolve => listener.close(resolve));
  const url = `http://127.0.0.1:${port}`;
  const log = fs.createWriteStream(path.join(directory, 'runtime-test.log'));
  next = spawn(process.execPath, [nextBin, 'start', '-p', String(port)], { cwd: directory, env, stdio: ['ignore', 'pipe', 'pipe'] });
  next.stdout.pipe(log); next.stderr.pipe(log);
  const read = async pathname => {
    const response = await fetch(url + pathname, { redirect: 'manual' });
    return { response, body: await response.text() };
  };
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try { await read('/robots.txt'); ready = true; break; } catch { await sleep(200); }
  }
  assert.ok(ready, 'Next server did not start');
  console.log('BROWSER_TEST_URL', url);
  const sitemap = await read('/sitemap.xml');
  assert.equal(sitemap.response.status, 200);
  assert.match(sitemap.response.headers.get('content-type'), /application\/xml/);
  assert.equal((sitemap.body.match(/<url>/g) || []).length, 23);
  const first = await read('/article');
  assert.match(first.body, /href="\/article\/page\/2"/);
  assert.match(first.body, /href="\/article\/content\/20"/);
  const second = await read('/article/page/2');
  assert.equal(second.response.status, 200);
  assert.match(second.body, /rel="canonical" href="https:\/\/logme.cloud\/article\/page\/2"/);
  assert.match(second.body, /href="\/article\/content\/1"/);
  assert.match(second.body, /rel="prev"/);
  assert.doesNotMatch(second.body, /rel="next"/);
  const redirect = await read('/article/page/1');
  assert.equal(redirect.response.status, 308);
  assert.equal(redirect.response.headers.get('location'), '/article');
  for (const pathname of ['/article/page/0', '/article/page/02', '/article/page/3', '/article/content/99', '/article/content/20junk']) {
    assert.equal((await read(pathname)).response.status, 404, pathname);
  }
  const privatePost = await read('/article/content/98');
  assert.match(privatePost.body, /name="robots" content="noindex, nofollow"/);
  assert.doesNotMatch(privatePost.body, /Verified body 98/);
  const detail = await read('/article/content/20');
  assert.equal(detail.response.status, 200);
  assert.match(detail.body, /Verified body 20 revision 1/);
  console.log('PASS initial XML, SSR article links, canonicals, pagination, 404 and private content');
  // Use the actual production revalidation interval; no test-only source changes.
  for (let elapsed = 0; elapsed < 310; elapsed += 10) {
    await sleep(10000);
    if ((elapsed + 10) % 50 === 0) console.log(`Waiting for real sitemap TTL: ${elapsed + 10}/310 seconds`);
  }
  outage = true;
  for (const pathname of ['/sitemap.xml', '/article', '/article/page/2', '/article/content/20']) {
    const stale = await read(pathname);
    assert.equal(stale.response.status, 200, pathname);
  }
  await sleep(2000);
  assert.ok(failures >= 4, 'expired routes must attempt regeneration');
  assert.equal((await read('/sitemap.xml')).body, sitemap.body, 'sitemap must retain the complete previous XML');
  assert.match((await read('/article')).body, /SEO fixture 20 revision 1/);
  assert.match((await read('/article/page/2')).body, /SEO fixture 10 revision 1/);
  assert.match((await read('/article/content/20')).body, /Verified body 20 revision 1/);
  assert.equal((await read('/article/content/97')).response.status, 500, 'uncached outage must not masquerade as a successful empty article');
  console.log('PASS upstream outage retains cached sitemap/list/detail and uncached detail fails honestly');
  outage = false; revision = 2;
  const expected = [['/sitemap.xml', '2026-09-02'], ['/article', 'SEO fixture 20 revision 2'], ['/article/page/2', 'SEO fixture 10 revision 2'], ['/article/content/20', 'Verified body 20 revision 2']];
  for (const [pathname, marker] of expected) {
    let recovered = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      if ((await read(pathname)).body.includes(marker)) { recovered = true; break; }
      await sleep(1000);
    }
    assert.ok(recovered, `${pathname} must regenerate after upstream recovery`);
  }
  console.log('PASS all routes recover after upstream recovery');
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (next) next.kill('SIGTERM');
  await new Promise(resolve => api.close(resolve));
  console.log('Test artifacts:', directory);
});
