// Shared setup: the app runs from file:// with every outside request blocked unless a test routes it.
const { chromium } = require('playwright');
const path = require('path');
const APP = 'file://' + (process.env.MP_APP || path.join(__dirname, '..', 'index.html'));
const KEY = 'mosaicPeek.v1';

async function launch(){ return chromium.launch(); }

// A fresh page with an empty board. `errors` collects page errors and any Content-Security-Policy refusal.
async function openApp(browser, { seed, route } = {}){
  const ctx = await browser.newContext({ acceptDownloads:true });
  const outside = [];
  await ctx.route(/^https?:/, r => { outside.push(r.request().url()); return route ? route(r) : r.abort(); });
  const page = await ctx.newPage();
  const errors = [], dialogs = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && /Content Security Policy|Refused/i.test(m.text())) errors.push(m.text()); });
  page.answer = null; // what the next prompt() gets
  page.on('dialog', d => { dialogs.push({ type:d.type(), message:d.message() }); d.type() === 'prompt' ? d.accept(page.answer ?? undefined) : d.accept(); });
  await page.goto(APP);
  await page.evaluate(([k, s]) => { localStorage.clear(); if (s) localStorage.setItem(k, typeof s === 'string' ? s : JSON.stringify(s)); }, [KEY, seed || null]);
  await page.reload();
  return { ctx, page, errors, dialogs, outside };
}

// The saved board, after the app's short save delay.
async function saved(page, key = KEY){
  await page.waitForTimeout(150);
  return page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), key);
}
async function addText(page, text){
  await page.click('#btnImport'); await page.fill('#taImport', text); await page.click('#btnDoImport');
  return saved(page);
}
async function addFile(page, name, content, type = 'text/plain'){
  await page.setInputFiles('#fileAny', { name, mimeType:type, buffer:Buffer.from(content) });
  return saved(page);
}
async function restore(page, board){
  await page.setInputFiles('#fileJson', { name:'board.json', mimeType:'application/json', buffer:Buffer.from(JSON.stringify(board)) });
  return saved(page);
}
async function menu(page, id){ await page.click('#menu summary'); await page.click('#' + id); }
const tiles = b => Object.values(b.tiles);

module.exports = { APP, KEY, launch, openApp, saved, addText, addFile, restore, menu, tiles };
