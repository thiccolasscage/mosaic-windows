// A crafted board file must not run code or open a javascript: link.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('child_process');
const path = require('path');
const { launch, openApp, restore, saved, tiles } = require('./helpers');

let browser; before(async () => { browser = await launch(); }); after(() => browser.close());

const evil = {
  version:2,
  groups:[{ id:`x" onmouseover="window.__pwned=1`, name:'<img src=x onerror="window.__pwned=2">', tileIds:[`a'),window.__pwned=3,('`, 'js', 'img'] }],
  tiles:{
    [`a'),window.__pwned=3,('`]:{ id:`a'),window.__pwned=3,('`, kind:'link', url:'https://example.com', peek:'ok', shot:'https://broken.example/missing.png', via:'microlink' },
    js:{ id:'js', kind:'link', url:'javascript:window.__pwned=4', title:'Click me' },
    img:{ id:'img', kind:'note', title:'<img src=x onerror="window.__pwned=5">', url:'javascript:window.__pwned=6', shot:'javascript:alert(1)' }
  }
};

test('a crafted board triggers no script and no navigation', async () => {
  const { page, errors, dialogs } = await openApp(browser);
  const b = await restore(page, evil);
  await page.waitForTimeout(400); // let the broken screenshot fail and fall back
  assert.equal(await page.evaluate(() => window.__pwned), undefined);
  // every id was replaced with a safe one, and no javascript: link survived
  for (const t of tiles(b)){ assert.match(t.id, /^[A-Za-z0-9_-]{1,40}$/); assert.ok(!/^javascript:/i.test(t.url)); assert.ok(!/^javascript:/i.test(t.shot || '')); }
  for (const g of b.groups) assert.match(g.id, /^[A-Za-z0-9_-]{1,40}$|^ungrouped$/);
  const js = tiles(b).find(t => t.title === 'javascript:window.__pwned=4' || t.title === 'Click me');
  assert.equal(js.kind, 'note'); assert.equal(js.url, '');
  // the titles render as text
  assert.equal(await page.locator('.group .name').filter({ hasText:'<img src=x' }).count(), 1);
  // open every tile in the preview and press Open where it shows
  const url = page.url();
  for (const id of Object.keys(b.tiles)){
    await page.locator(`.tile[data-id="${id}"]`).click();
    if (await page.isVisible('#pvOpen')) await page.click('#pvOpen');
    await page.keyboard.press('Escape');
  }
  await page.mouse.move(5, 300); await page.locator('.group').first().hover();
  assert.equal(page.url(), url);
  assert.equal(await page.evaluate(() => window.__pwned), undefined);
  assert.deepEqual(dialogs.filter(d => d.type === 'alert'), []);
  assert.deepEqual(errors, []);
});

test('the Content-Security-Policy blocks injected inline script', async () => {
  const { page } = await openApp(browser);
  await page.evaluate(() => { const d = document.createElement('div'); d.innerHTML = '<img src="data:," onerror="window.__inline=1"><img src="x:y" onerror="window.__inline=1">'; document.body.append(d); });
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => window.__inline), undefined);
});

test('the policy hash matches the page script', () => {
  execFileSync('node', [path.join(__dirname, '..', 'tools', 'csp-hash.js'), '--check']);
});

test('tile ids from older boards that are already safe are kept', async () => {
  const { page } = await openApp(browser);
  const b = await restore(page, { groups:[{ id:'ungrouped', name:'Ungrouped', tileIds:['abc123'] }], tiles:{ abc123:{ id:'abc123', url:'https://example.com' } } });
  assert.deepEqual(Object.keys(b.tiles), ['abc123']);
});
