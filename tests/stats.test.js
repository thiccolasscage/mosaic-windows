// Local stats: days opened, hand-offs copied, items marked done; the "Mosaic feedback" group is left out.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { launch, openApp, addText, restore } = require('./helpers');

let browser; before(async () => { browser = await launch(); }); after(() => browser.close());
const stats = page => page.evaluate(() => JSON.parse(localStorage.getItem('mosaicPeek.stats')));

test('opening, copying a hand-off and marking done update the counts', async () => {
  const { page, dialogs } = await openApp(browser);
  let s = await stats(page);
  assert.equal(s.days.length, 1);
  await page.reload();
  assert.equal((await stats(page)).days.length, 1, 'the same day counts once');
  const b = await addText(page, 'https://github.com');
  const id = Object.keys(b.tiles)[0];
  await page.locator(`.tile[data-id="${id}"]`).click();
  await page.click('#pvHand'); await page.waitForTimeout(100);
  await page.click('#pvDone'); await page.waitForTimeout(100);
  s = await stats(page);
  assert.equal(s.handoffs.length, 1);
  assert.equal(s.done.length, 1);
  await page.keyboard.press('Escape');
  await page.click('#menu summary'); await page.click('#btnStats');
  const text = dialogs.at(-1).message;
  assert.match(text, /Days you opened it: 1 in the last 7 days/);
  assert.match(text, /Hand-offs copied: 1 in the last 7 days, 1 in the last 30 days, 1 in all/);
  assert.match(text, /Items marked done: 1 in the last 7 days/);
});

test('the Mosaic feedback group is left out', async () => {
  const { page } = await openApp(browser);
  await restore(page, { groups:[{ id:'ungrouped', name:'Ungrouped', tileIds:[] }, { id:'fb', name:'Mosaic feedback', tileIds:['f1'] }], tiles:{ f1:{ id:'f1', kind:'note', title:'Feedback idea' } } });
  await page.locator('.tile[data-id="f1"]').click();
  await page.click('#pvHand'); await page.click('#pvDone'); await page.waitForTimeout(100);
  await page.keyboard.press('Escape');
  await page.locator('.group', { hasText:'Mosaic feedback' }).locator('button', { hasText:'Hand-off' }).click();
  await page.waitForTimeout(100);
  const s = await stats(page);
  assert.equal(s.handoffs.length, 0);
  assert.equal(s.done.length, 0);
});
