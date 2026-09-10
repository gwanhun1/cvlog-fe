const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const mod = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('utils/githubContributions.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports: mod.exports, Date, Map, Set });
const { parseContributions, contributionSummary, CONTRIBUTION_COLORS } = mod.exports;
const day = (date, count) => ({ date, count, level: count ? 1 : 0 });
test('parses reordered attributes and non-adjacent tooltips, including comma counts', () => {
  const result = parseContributions('<td data-level="4" id="d1" data-date="2026-08-01"></td><td id="d2" data-date="2026-08-02" data-level="0"></td><tool-tip for="d2">No contributions on August 2nd.</tool-tip><tool-tip for="d1">1,234 contributions on August 1st.</tool-tip>');
  assert.equal(result[0].count, 1234); assert.equal(result[1].count, 0); assert.equal(result[0].level, 4);
});
test('malformed upstream HTML fails visibly instead of inventing empty days', () => {
  assert.throws(() => parseContributions('<td id="d1" data-date="2026-08-01" data-level="4"></td>'));
  assert.throws(() => parseContributions('<html>Rate limit</html>'));
});
test('current streak allows today to be empty but breaks at a missed date', () => {
  const result = contributionSummary([day('2026-09-06', 2), day('2026-09-07', 1), day('2026-09-08', 1), day('2026-09-09', 0)], '2026-09-09');
  assert.equal(result.current, 3); assert.equal(result.longest, 3); assert.equal(result.total, 4);
  assert.equal(contributionSummary([day('2026-09-06', 2), day('2026-09-08', 1)], '2026-09-09').current, 1);
});
test('historical years do not show a stale streak as current, future days excluded', () => {
  const result = contributionSummary([day('2025-12-31', 5), day('2026-10-01', 20)], '2026-09-09');
  assert.equal(result.current, 0); assert.equal(result.total, 5);
});
test('a large outlier does not alter the five fixed GitHub levels', () => {
  assert.equal(CONTRIBUTION_COLORS.length, 5); assert.notEqual(CONTRIBUTION_COLORS[0], CONTRIBUTION_COLORS[1]);
  const result = contributionSummary([day('2026-08-01', 1000), day('2026-08-02', 1)], '2026-09-09');
  assert.equal(result.active, 2); assert.equal(result.months[0].count, 1001);
});
