const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
function setup() {
  const storage = new Map();
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('utils/draftStorage.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, { exports, localStorage: {
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  } });
  return { ...exports, storage };
}
test('empty and whitespace-only drafts are never stored; clearing removes old content and timestamp', () => {
  for (const key of ['logme_draft_new', 'logme_draft_edit_12']) {
    const { saveLocalDraft, storage, hasArticleDraftContent } = setup();
    for (const empty of [{ title: '', content: '', tags: [] }, { title: ' \n', content: '\t', tags: [' '] }]) {
      saveLocalDraft(key, { title: 'previous draft', content: '', tags: [] });
      assert.equal(hasArticleDraftContent(empty, key), false);
      assert.equal(saveLocalDraft(key, empty), true);
      assert.equal(storage.size, 0);
    }
  }
});
test('title-only, body-only and tag-only drafts remain recoverable', () => {
  for (const key of ['logme_draft_new', 'logme_draft_edit_12']) {
    for (const draft of [{ title: 'Title', content: '', tags: [] }, { title: '', content: 'Body', tags: [] }, { title: '', content: '', tags: ['typescript'] }]) {
      const { saveLocalDraft, storage, hasArticleDraftContent } = setup();
      assert.equal(hasArticleDraftContent(draft, key), true);
      assert.equal(saveLocalDraft(key, draft), true);
      assert.deepEqual(JSON.parse(storage.get(key)), draft);
      assert.ok(storage.has(`${key}_updated_at`));
    }
  }
});
test('default new-article template is empty, but the same text in an edited article is content', () => {
  const { hasArticleDraftContent } = setup();
  const draft = { title: '', content: ' # Hello world\n', tags: [] };
  assert.equal(hasArticleDraftContent(draft, 'logme_draft_new'), false);
  assert.equal(hasArticleDraftContent(draft, 'logme_draft_edit_12'), true);
  assert.equal(hasArticleDraftContent({ ...draft, tags: ['tag'] }, 'logme_draft_new'), true);
});
test('non-article storage retains its existing behavior', () => {
  const { saveLocalDraft, storage } = setup();
  saveLocalDraft('logme_resume_v2', {});
  assert.equal(storage.get('logme_resume_v2'), '{}');
});
