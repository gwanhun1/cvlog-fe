const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('utils/highlightTagWords.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports: exportsObject });
const highlight = (text, tags) => exportsObject.highlightTagWords(text, tags, ['blue', 'red']);
const span = (word, color = 'blue') => `<span style="background-color: ${color}">${word}</span>`;
test('matches standalone tags case-insensitively, including adjacent punctuation', () => {
  assert.equal(highlight('ai AI (ai),ai! failure daily email training', ['ai']),
    `${span('ai')} ${span('AI')} (${span('ai')}),${span('ai')}! failure daily email training`);
});
test('letters, numbers, underscores and combining marks prevent partial matches', () => {
  const text = 'ai2 2ai ai_tool tool_ai 한ai ai한 ai\u0301';
  assert.equal(highlight(text, ['ai']), text);
  assert.equal(highlight('개발 개발자', ['개발']), `${span('개발')} 개발자`);
});
test('supports literal punctuation in tags and prefers the longest match', () => {
  assert.equal(highlight('C++ C++17 Next.js Next.jsx', ['C++', 'Next.js']), `${span('C++')} C++17 ${span('Next.js', 'red')} Next.jsx`);
  assert.equal(highlight('machine learning', ['machine', 'machine learning']), span('machine learning', 'red'));
});
test('escapes user text without matching generated markup or entities', () => {
  assert.equal(highlight('<ai> & span', ['ai', 'span']), `&lt;${span('ai')}&gt; &amp; ${span('span', 'red')}`);
  assert.equal(highlight('& <script>', ['amp']), '&amp; &lt;script&gt;');
  assert.equal(highlight('ai', ['ai', 'ai']), span('ai'));
  assert.equal(highlight('<ai>', ['', '']), '&lt;ai&gt;');
});
