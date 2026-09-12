const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('utils/tagFolderKeyboard.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports: exportsObject });
const move = (code, over, ids = [1, 2, 999]) => exportsObject.folderCoordinates({ code, preventDefault() {} }, { context: {
  over: over == null ? null : { id: over },
  droppableContainers: { getEnabled: () => ids.map(id => ({ id })) },
  droppableRects: new Map([[1, { left: 0, top: 0, width: 100, height: 40 }], [2, { left: 110, top: 0, width: 100, height: 40 }], [999, { left: 0, top: 50, width: 100, height: 40 }]]),
  collisionRect: { width: 60, height: 30 },
} });
test('first arrow chooses the first or last folder from the tag row', () => {
  assert.equal(move('ArrowRight').x, 20);
  assert.equal(move('ArrowLeft').y, 55);
});
test('arrows reach wrapped rows and the unassigned folder', () => {
  assert.equal(move('ArrowDown', 2).y, 55);
  assert.equal(move('ArrowRight', 999).x, 20);
  assert.equal(move('ArrowUp', 1).y, 55);
});
test('non-navigation keys and missing drop targets do not move a tag', () => {
  assert.equal(move('Escape', 1), undefined);
  assert.equal(move('ArrowRight', 1, []), undefined);
  assert.equal(move('ArrowRight', 1, [99]), undefined);
});
