// Never lose a board: reload, unreadable saved data, failed saves, export and restore, backup reminder.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { launch, openApp, addText, saved, menu, restore, KEY } = require('./helpers');

let browser; before(async () => { browser = await launch(); }); after(() => browser.close());

test('reload keeps the board', async () => {
  const { page } = await openApp(browser);
  await addText(page, 'https://github.com\n- [ ] a todo');
  await page.reload();
  assert.equal(await page.locator('.tile').count(), 2);
});

test('unreadable saved data is kept, not overwritten', async () => {
  const { page, errors } = await openApp(browser, { seed:'{"groups": [ broken' });
  assert.ok(await page.isVisible('#warn'));
  assert.match(await page.textContent('#warn'), /couldn't be read/);
  await addText(page, 'https://github.com');
  const keys = await page.evaluate(() => Object.keys(localStorage));
  const copy = keys.find(k => k.startsWith('mosaicPeek.v1.unreadable.'));
  assert.ok(copy, 'a copy key exists');
  assert.equal(await page.evaluate(k => localStorage.getItem(k), copy), '{"groups": [ broken');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#warn [data-act="dl-unreadable"]')]);
  assert.equal(fs.readFileSync(await dl.path(), 'utf8'), '{"groups": [ broken');
  assert.deepEqual(errors, []);
});

test('a failing save shows a lasting warning until a save works', async () => {
  const { page } = await openApp(browser);
  await page.evaluate(k => {
    const real = Storage.prototype.setItem;
    window.__fail = true;
    Storage.prototype.setItem = function(key, v){ if (window.__fail && key === k) throw new DOMException('The quota has been exceeded.', 'QuotaExceededError'); return real.call(this, key, v); };
  }, KEY);
  await addText(page, 'https://github.com');
  await page.waitForTimeout(3500); // longer than a toast
  assert.ok(await page.isVisible('#warn'));
  assert.match(await page.textContent('#warn'), /Saving failed/);
  await page.evaluate(() => { window.__fail = false; });
  await addText(page, 'https://codepen.io');
  assert.equal(await page.isVisible('#warn'), false, await page.textContent('#warn'));
});

test('export, clear and restore gives back an identical board', async () => {
  const { page } = await openApp(browser);
  await addText(page, 'title,url,note,group\nGit,https://github.com,code,Dev\n,- [x] shipped,,\nPen,codepen.io,,Art');
  const before = await saved(page);
  await page.click('#menu summary');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#btnExport')]);
  const file = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
  await menu(page, 'btnClear');
  assert.equal(Object.keys((await saved(page)).tiles).length, 0);
  const after = await restore(page, file);
  assert.deepEqual(after.tiles, before.tiles);
  assert.deepEqual(after.groups, before.groups);
});

test('weekly backup reminder shows once a board has 5 items, and Export clears it', async () => {
  const { page } = await openApp(browser);
  await addText(page, 'https://a.example\nhttps://b.example\nhttps://c.example\nhttps://d.example');
  assert.equal(await page.isVisible('#warn'), false, await page.textContent('#warn'));
  await addText(page, 'https://e.example');
  assert.match(await page.textContent('#warn'), /not exported yet/);
  await Promise.all([page.waitForEvent('download'), page.click('#warn [data-act="export"]')]);
  assert.equal(await page.isVisible('#warn'), false, await page.textContent('#warn'));
  // "Remind me next week" also hides it
  await page.evaluate(() => localStorage.removeItem('mosaicPeek.exports')); await page.reload();
  assert.ok(await page.isVisible('#warn'));
  await page.click('#warn [data-act="snooze"]');
  assert.equal(await page.isVisible('#warn'), false, await page.textContent('#warn'));
  await page.reload();
  assert.equal(await page.isVisible('#warn'), false, await page.textContent('#warn'));
});
