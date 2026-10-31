// Screenshots (mocked): Microlink first, thum.io after a rate limit, and private links never leave the device.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { launch, openApp, addText, saved, tiles } = require('./helpers');

let browser; before(async () => { browser = await launch(); }); after(() => browser.close());
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

function mock(){
  let microlink = 0;
  const route = r => {
    const u = r.request().url();
    if (u.startsWith('https://api.microlink.io/')){
      microlink++;
      if (microlink <= 1) return r.fulfill({ contentType:'application/json', body:JSON.stringify({ status:'success', data:{ screenshot:{ url:'https://img.microlink.example/1.png' } } }) });
      return r.fulfill({ status:429, body:'{}' });
    }
    return r.fulfill({ contentType:'image/png', body:PNG }); // screenshots and favicons
  };
  return { route, count:() => microlink };
}

test('a success stores the image; a rate limit stops further Microlink requests', async () => {
  const m = mock();
  const { page, errors } = await openApp(browser, { route:m.route });
  await addText(page, ['https://a.example', 'https://b.example', 'https://c.example', 'https://d.example', 'https://e.example', 'https://f.example'].join('\n'));
  await page.waitForFunction(() => !/loading/.test(document.querySelector('#stats').textContent));
  const b = await saved(page);
  const via = tiles(b).map(t => t.via);
  assert.equal(via.filter(v => v === 'microlink').length, 1);
  assert.equal(via.filter(v => v === 'thum').length, 5);
  assert.ok(tiles(b).every(t => t.peek === 'ok' && t.shot.startsWith('https://')));
  assert.ok(m.count() <= 3, `Microlink asked ${m.count()} times`); // 1 success + at most the in-flight requests when the 429 arrived
  assert.deepEqual(errors, []);
});

test('a private tile and a private group are never sent anywhere', async () => {
  const m = mock();
  const { page, outside } = await openApp(browser, { route:m.route });
  // a private group first, then add links into it
  page.answer = 'Secret';
  await page.click('#btnNewGroup');
  await page.locator('.group', { hasText:'Secret' }).locator('button[title^="Make this group private"]').click();
  await page.click('#btnImport'); await page.fill('#taImport', 'https://secret-group.example/x'); await page.selectOption('#selGroup', { label:'Secret' }); await page.click('#btnDoImport');
  // a single private tile: switch it off before its preview is fetched by importing with the network slow
  await addText(page, 'https://public.example');
  await page.waitForTimeout(500);
  const b = await saved(page);
  const pub = tiles(b).find(t => t.url === 'https://public.example');
  await page.locator(`.tile[data-id="${pub.id}"]`).click();
  await page.click('#pvPriv');
  await page.keyboard.press('Escape');
  const n = outside.length;
  await page.reload(); await page.waitForTimeout(500);
  assert.ok(!outside.some(u => u.includes('secret-group')), outside.filter(u => u.includes('secret')).join('\n'));
  assert.ok(!outside.slice(n).some(u => u.includes('public.example')), 'after it was made private, the public tile is not requested again');
  assert.equal(await page.locator('.tile', { hasText:'secret-group.example' }).locator('.st').textContent(), '🔒 private: no preview');
});
