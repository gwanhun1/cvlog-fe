const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const code = ts.transpileModule(fs.readFileSync('hooks/useTagDragState.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
function setup(mutate = async () => {}) {
  const calls = [], states = [], errors = [];
  let refetches = 0;
  const exports = {};
  vm.runInNewContext(code, {
    exports, console: { error() {} }, document: { body: { style: {} } },
    require: name => {
      if (name === 'react') return {
        useCallback: fn => fn, useMemo: fn => fn(), useRef: value => ({ current: value }),
        useState: initial => { const index = states.push(initial) - 1; return [initial, value => { states[index] = typeof value === 'function' ? value(states[index]) : value; }]; },
      };
      if (name === '@tanstack/react-query') return { useQueryClient: () => ({ refetchQueries: async () => { refetches++; } }) };
      if (name === 'service/hooks/List') return { usePutTagsFolder: () => ({ mutateAsync: async params => { calls.push(params); await mutate(params); } }) };
      if (name === 'components/Shared') return { useToast: () => ({ showToast: message => errors.push(message) }) };
      throw new Error(name);
    },
  });
  const hook = exports.useTagDragState([{ id: 1, name: 'AI', tags: [{ id: 7, name: 'codex' }] }, { id: 999, name: '미할당', tags: [] }]);
  return { hook, calls, states, errors, refetches: () => refetches };
}
const drop = (over, active = '1-7') => ({ active: { id: active }, over: over === null ? null : { id: over } });
test('outside, same folder and malformed drops never write', async () => {
  const state = setup();
  for (const target of [null, 1, 'invalid']) await state.hook.handleDragEnd(drop(target));
  assert.equal(state.calls.length, 0);
});
test('unassigned drop writes once and reconciles the folder query', async () => {
  const state = setup();
  await state.hook.handleDragEnd(drop(999));
  assert.equal(state.calls[0].tag_id, 7);
  assert.equal(state.calls[0].folder_id, 999);
  assert.equal(state.refetches(), 1);
  assert.equal(state.states[2].length, 0);
});
test('pending tag cannot be submitted twice', async () => {
  let release;
  const state = setup(() => new Promise(resolve => { release = resolve; }));
  const pending = state.hook.handleDragEnd(drop(999));
  await state.hook.handleDragEnd(drop(999));
  assert.equal(state.calls.length, 1);
  assert.equal(state.states[2].length, 1);
  release();
  await pending;
  assert.equal(state.states[2].length, 0);
});
test('failure removes optimistic move and reports error; retry is possible', async () => {
  const state = setup(async () => { throw new Error('offline'); });
  await state.hook.handleDragEnd(drop(999));
  assert.equal(state.states[2].length, 0);
  assert.equal(state.errors.length, 1);
  await state.hook.handleDragEnd(drop(999));
  assert.equal(state.calls.length, 2);
});
