// The installable app, served over http like GitHub Pages: service worker, manifest, offline copy, ?nosw.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http'), fs = require('fs'), path = require('path');
const { launch } = require('./helpers');

const ROOT = path.join(__dirname, '..');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.webmanifest':'application/manifest+json', '.png':'image/png', '.svg':'image/svg+xml' };
let browser, server, base, override = null;
before(async () => {
  browser = await launch();
  server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, path.normalize(p));
    if (!file.startsWith(ROOT) || !fs.existsSync(file)){ res.writeHead(404); return res.end(); }
    let body = fs.readFileSync(file);
    if (override && p === '/index.html') body = override(body.toString());
    res.writeHead(200, { 'content-type':TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control':'no-cache' }); res.end(body);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}/`;
});
after(async () => { await browser.close(); server.close(); });

test('installable, works offline, updates when online, ?nosw removes the offline copy', async () => {
  const ctx = await browser.newContext();
  await ctx.route(u => !u.href.startsWith(base), r => r.abort());
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && /Content Security Policy|Refused/i.test(m.text())) errors.push(m.text()); });
  await page.goto(base);
  assert.ok(await page.$('link[rel=manifest]'));
  assert.ok(await page.evaluate(async () => !!(await navigator.serviceWorker.ready).active));
  await page.reload();
  assert.ok(await page.evaluate(() => !!navigator.serviceWorker.controller));
  const cdp = await ctx.newCDPSession(page);
  assert.deepEqual((await cdp.send('Page.getAppManifest')).errors, []);
  assert.deepEqual((await cdp.send('Page.getInstallabilityErrors')).installabilityErrors, []);
  for (const f of ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'icon.svg']) assert.equal(await page.evaluate(async u => (await fetch(u)).status, f), 200, f);
  assert.equal(await page.$eval('#btnInstall', b => b.hidden), false, 'Install app is offered');
  await page.click('#btnImport'); await page.fill('#taImport', 'https://github.com\n- [ ] offline todo'); await page.click('#btnDoImport'); await page.waitForTimeout(200);
  await ctx.setOffline(true); await page.reload();
  assert.equal(await page.title(), 'Mosaic Peek');
  assert.equal(await page.locator('.tile').count(), 2);
  await ctx.setOffline(false);
  override = html => html.replace('<title>Mosaic Peek</title>', '<title>Mosaic Peek NEW</title>');
  await page.reload();
  assert.equal(await page.title(), 'Mosaic Peek NEW');
  override = null;
  await page.goto(base + '?nosw'); await page.waitForTimeout(800);
  const left = await page.evaluate(async () => ({ regs:(await navigator.serviceWorker.getRegistrations()).length, caches:(await caches.keys()).filter(k => k.startsWith('mosaic-peek')).length }));
  assert.deepEqual(left, { regs:0, caches:0 });
  assert.deepEqual(errors, []);
});

test('no sideways scrolling at phone width', async () => {
  const page = await browser.newPage({ viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  await page.route(u => !u.href.startsWith(base), r => r.abort());
  await page.goto(base);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
});
