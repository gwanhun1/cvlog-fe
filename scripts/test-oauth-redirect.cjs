const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');
const storage = new Map();
const mod = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('utils/oauth.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, {
  exports: mod.exports, URLSearchParams, URL,
  process: { env: { NEXT_PUBLIC_GITHUB_ID: 'test-client', NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'google-client' } },
  window: { location: { origin: 'https://logme.cloud' }, crypto: { randomUUID } },
  sessionStorage: { setItem: (key, value) => storage.set(key, value) },
});
const oauth = mod.exports;
test('GitHub reconnect uses registered login callback and a distinct stored link state', () => {
  const link = new URL(oauth.buildLinkUrl('github', oauth.GITHUB_SYNC_SCOPE));
  assert.equal(link.searchParams.get('redirect_uri'), 'https://logme.cloud/join');
  assert.equal(link.searchParams.get('scope'), 'read:user public_repo');
  assert.equal(link.searchParams.get('state'), storage.get(oauth.LINK_STATE_KEY));
  assert.ok(oauth.isGithubLinkState(link.searchParams.get('state')));
  assert.equal(oauth.parseProviderFromState(link.searchParams.get('state')), 'github');
});
test('ordinary login stays separate and preserves previously granted scopes', () => {
  const login = new URL(oauth.buildLoginUrl('github'));
  assert.equal(login.searchParams.get('redirect_uri'), 'https://logme.cloud/join');
  assert.equal(login.searchParams.has('scope'), false);
  assert.equal(oauth.isGithubLinkState(login.searchParams.get('state')), false);
  assert.equal(login.searchParams.get('state'), storage.get(oauth.LOGIN_STATE_KEY));
});
test('other providers retain their callback and malformed link states are rejected', () => {
  assert.equal(new URL(oauth.buildLinkUrl('google')).searchParams.get('redirect_uri'), 'https://logme.cloud/github/callback');
  for (const state of [undefined, ['github.link.abc'], 'google.link.abc', 'github.link.', 'github.link.abc/def']) {
    assert.equal(oauth.isGithubLinkState(state), false);
  }
});

test('return destination rejects external, callback and malformed paths', () => {
  for (const path of ['https://evil.test', '//evil.test', '/\\evil.test', '/login', '/join?code=x', '/github/callback']) assert.equal(oauth.safeReturnPath(path), '/workspace');
  assert.equal(oauth.safeReturnPath('/resume?draft=1'), '/resume?draft=1');
});
