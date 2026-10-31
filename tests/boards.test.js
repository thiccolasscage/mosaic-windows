// Several boards per device, plus the views and undo working on each.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { APP, launch, openApp, addText, saved, menu } = require('./helpers');

let browser; before(async () => { browser = await launch(); }); after(() => browser.close());
const old = { version:2, groups:[{ id:'ungrouped', name:'Ungrouped', tileIds:['a1', 'a2'] }], tiles:{
  a1:{ id:'a1', kind:'link', url:'https://example.com', title:'Ex', added:1 },
  a2:{ id:'a2', kind:'note', url:'', title:'Old note', added:1 } } };
const current = page => page.$eval('#selBoard', s => ({ id:s.value, name:s.options[s.selectedIndex].text }));
const ls = page => page.evaluate(() => ({ ...localStorage }));

test('boards: new, switch, reload, export name, rename, delete', async () => {
  const { page, errors } = await openApp(browser, { seed:old });
  assert.deepEqual(await current(page), { id:'main', name:'My board' });
  assert.equal(await page.locator('.tile').count(), 2);
  page.answer = 'Fresh start';
  await page.selectOption('#selBoard', '+new');
  assert.equal((await current(page)).name, 'Fresh start');
  assert.match(await page.textContent('#stats'), /^0 items/);
  await addText(page, 'https://github.com\n- [ ] a todo');
  const freshId = (await current(page)).id;
  let store = await ls(page);
  assert.equal(Object.keys(JSON.parse(store['mosaicPeek.b.' + freshId]).tiles).length, 2);
  assert.equal(Object.keys(JSON.parse(store['mosaicPeek.v1']).tiles).length, 2, 'the first board is untouched');
  await menu(page, 'btnUndoImport'); await page.waitForTimeout(150);
  assert.match(await page.textContent('#stats'), /^0 items/, 'undo works on the new board');
  await addText(page, 'https://github.com');
  await page.selectOption('#selBoard', 'main');
  assert.equal(await page.locator('.tile').count(), 2);
  await page.reload();
  assert.equal((await current(page)).id, 'main');
  await page.selectOption('#selBoard', freshId); await page.reload();
  assert.equal((await current(page)).id, freshId);
  await page.click('#menu summary');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#btnExport')]);
  assert.match(dl.suggestedFilename(), /^mosaic-peek-fresh-start-\d{4}-\d\d-\d\d\.json$/);
  page.answer = 'Renamed';
  await page.selectOption('#selBoard', '+rename');
  assert.equal((await current(page)).name, 'Renamed');
  await page.selectOption('#selBoard', '+delete'); await page.waitForTimeout(150);
  store = await ls(page);
  assert.equal(store['mosaicPeek.b.' + freshId], undefined);
  assert.equal((await current(page)).id, 'main');
  await page.selectOption('#selBoard', '+delete'); await page.waitForTimeout(150);
  assert.match(await page.textContent('#toast'), /only board/);
  assert.ok((await ls(page))['mosaicPeek.v1'], 'the last board is never deleted');
  assert.deepEqual(errors, []);
});

test('a board made in another tab shows up in the list', async () => {
  const { ctx, page } = await openApp(browser);
  const p2 = await ctx.newPage(); p2.on('dialog', d => d.accept('Other tab'));
  await p2.goto(APP); await p2.selectOption('#selBoard', '+new'); await page.waitForTimeout(300);
  assert.ok((await page.$$eval('#selBoard option', os => os.map(o => o.text))).includes('Other tab'));
  assert.equal((await current(page)).id, 'main');
});

test('wall and tree views render', async () => {
  const { page, errors } = await openApp(browser, { seed:old });
  await page.click('[data-view=wall]'); await page.waitForTimeout(300);
  assert.ok(await page.locator('.wtile').count() > 0);
  await page.click('[data-view=tree]');
  assert.equal(await page.locator('.trow').count(), 2);
  await page.click('[data-view=mosaic]');
  assert.deepEqual(errors, []);
});
