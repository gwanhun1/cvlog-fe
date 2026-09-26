const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const compile = (path, imports) => {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, { exports, require: name => name in imports ? imports[name] : require(name) });
  return exports;
};

async function render(content, tags = ['ai', 'mcp', 'claude']) {
  const [markdown, raw, sanitize, slug, gfm] = await Promise.all(
    ['react-markdown', 'rehype-raw', 'rehype-sanitize', 'rehype-slug', 'remark-gfm'].map(name => import(name))
  );
  const state = { selectedTagListAtom: tags.map((name, id) => ({ name, id })) };
  const Component = compile('components/Shared/MarkdownContent/index.tsx', {
    'react-markdown': markdown.default,
    'rehype-raw': raw.default,
    'rehype-sanitize': sanitize.default,
    'rehype-slug': slug.default,
    'remark-gfm': gfm.default,
    'react-code-blocks': { CopyBlock: ({ text }) => React.createElement('pre', null, text) },
    'service/store/useStore': { useStore: selector => selector(state) },
    'styles/utils': { cn: (...args) => args.filter(Boolean).join(' ') },
    'utils/user': { isSameUser: () => false },
    'utils/highlightTagWords': compile('utils/highlightTagWords.ts', {}),
    '../../../styles/markdown.module.scss': {},
    './TocItemsContainer': () => null,
  }).default;
  return renderToStaticMarkup(React.createElement(Component, { content }));
}
const marked = word => new RegExp(`background-color: #[a-f0-9]+">${word}</span>`);

test('highlights mixed-case tags in a paragraph containing a link (reported regression)', async () => {
  const html = await render('MCP 서버를 만들고 Claude 플러그인을 제출했다. AI [공식 발표](https://example.com)');
  for (const word of ['MCP', 'Claude', 'AI']) assert.match(html, marked(word));
  assert.match(html, /href="https:\/\/example.com"/);
});
test('highlights around and inside formatting, links, headings, lists and table cells', async () => {
  const html = await render('# Claude **AI**\n\n- MCP **Claude** *AI* ~~MCP~~ [Claude](https://example.com)\n\n| AI |\n| --- |\n| Claude **MCP** |');
  assert.equal((html.match(/background-color:/g) || []).length, 10);
});
test('respects tag selection and keeps inline and fenced code unhighlighted', async () => {
  const content = 'Claude **MCP** AI `Claude`\n\n```text\nMCP\n```';
  const selected = await render(content, ['claude']);
  assert.equal((selected.match(/background-color:/g) || []).length, 1);
  assert.match(selected, /<code[^>]*>Claude<\/code>/);
  assert.match(selected, /<pre>MCP<\/pre>/);
  assert.doesNotMatch(await render(content, []), /background-color:/);
});

test('matches literal tags and boundaries without corrupting links or escaped HTML', async () => {
  const html = await render('AI daily email ai_tool AI2 한ai & <script>alert(1)</script> [C++](https://example.com/claude) Next.js', ['ai', 'C++', 'Next.js']);
  assert.equal((html.match(/background-color:/g) || []).length, 3);
  assert.match(html, /href="https:\/\/example.com\/claude"/);
  assert.doesNotMatch(html, /<script/);
});
test('uses each selected tag color consistently across mixed text and nested markup', async () => {
  const html = await render('Claude **MCP** [AI](https://example.com) claude mcp ai');
  for (const [word, color] of [['claude', '#93c8f8'], ['mcp', '#7bb9f9'], ['ai', '#60a5fa']]) {
    assert.equal((html.match(new RegExp(`background-color: ${color}">${word}</span>`, 'gi')) || []).length, 2);
  }
});
test('changing selected tags and article content never leaves stale highlights', async () => {
  for (const tags of [['ai', 'mcp', 'claude'], ['mcp'], [], ['claude'], ['ai', 'mcp', 'claude']]) {
    const html = await render('AI **MCP** Claude', tags);
    assert.equal((html.match(/background-color:/g) || []).length, tags.length);
    for (const word of ['AI', 'MCP', 'Claude']) {
      assert.equal(marked(word).test(html), tags.includes(word.toLowerCase()));
    }
  }
  assert.doesNotMatch(await render('다른 글입니다', ['claude']), /background-color:/);
});
