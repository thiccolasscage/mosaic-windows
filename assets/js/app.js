(() => {
'use strict';
const KEY = 'mosaicPeek.v1';
const UNGROUPED = 'ungrouped';
const MICROLINK = u => `https://api.microlink.io/?url=${encodeURIComponent(u)}&screenshot=true&meta=false`;
const FAVICON = d => `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=64`;
const CONCURRENCY = 2;

// ---------- state ----------
// state = { groups:[{id,name,tileIds:[]}], tiles:{id:{id,url,title,shot,peek:'none'|'ok'|'fail'|'limited',added}} }
let state = load();
function blank(){ return { version:1, groups:[{id:UNGROUPED,name:'Ungrouped',tileIds:[]}], tiles:{} }; }
function load(){
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.groups && s.tiles) return sanitize(s); } catch(e){}
  return blank();
}
function sanitize(s){
  if (!s.groups.find(g=>g.id===UNGROUPED)) s.groups.unshift({id:UNGROUPED,name:'Ungrouped',tileIds:[]});
  const seen = new Set();
  for (const g of s.groups){ g.tileIds = (g.tileIds||[]).filter(id => s.tiles[id] && !seen.has(id) && seen.add(id)); }
  for (const id of Object.keys(s.tiles)) if (!seen.has(id)) s.groups.find(g=>g.id===UNGROUPED).tileIds.push(id);
  for (const t of Object.values(s.tiles)) if (t.peek === 'pending') t.peek = 'none';
  return s;
}
let saveT; function save(){ clearTimeout(saveT); saveT = setTimeout(()=>{ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){ toast('Save failed: '+e.message); } }, 80); }
const uid = () => Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4);

// ---------- url helpers ----------
function normalize(raw){
  let s = String(raw||'').trim().replace(/^["'<(]+|[">),;']+$/g,'');
  if (!s) return null;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) { if (!/^[\w-]+(\.[\w-]+)+/.test(s)) return null; s = 'https://' + s; }
  let u; try { u = new URL(s); } catch(e){ return null; }
  if (!/^https?:$/.test(u.protocol)) return null;
  u.hash = '';
  u.hostname = u.hostname.toLowerCase();
  let out = u.toString();
  if (u.pathname === '/' && !u.search) out = out.replace(/\/$/,'');
  return out;
}
const dedupeKey = url => url.replace(/^https?:\/\/(www\.)?/i,'').replace(/\/$/,'').toLowerCase();
const host = url => { try { return new URL(url).hostname.replace(/^www\./,''); } catch(e){ return url; } };
const hue = s => { let h=0; for (const c of s) h=(h*31+c.charCodeAt(0))%360; return h; };
function defaultTitle(url){
  try { const u = new URL(url); const p = u.pathname.replace(/\/$/,''); return host(url) + (p ? p : ''); } catch(e){ return url; }
}

// ---------- parsing ----------
function parseCSVLine(line){
  const out=[]; let cur='', q=false;
  for (let i=0;i<line.length;i++){ const c=line[i];
    if (q){ if (c==='"'){ if (line[i+1]==='"'){cur+='"';i++;} else q=false; } else cur+=c; }
    else if (c==='"') q=true; else if (c===','||c==='\t') { out.push(cur); cur=''; } else cur+=c; }
  out.push(cur); return out;
}
function parseInput(text){
  const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  if (!lines.length) return [];
  const looksCSV = lines.some(l => /[,\t]/.test(l));
  if (!looksCSV) return lines.map(l => ({url:l}));
  const head = parseCSVLine(lines[0]).map(h=>h.trim().toLowerCase());
  let ui = head.findIndex(h => ['url','link','href','address'].includes(h));
  let ti = head.findIndex(h => ['title','name'].includes(h));
  let rows = lines;
  if (ui >= 0) rows = lines.slice(1); else { ui = 0; ti = -1; if (!normalize(parseCSVLine(lines[0])[0])) rows = lines.slice(1); }
  return rows.map(l => { const c = parseCSVLine(l); return { url:c[ui], title: ti>=0 ? (c[ti]||'').trim() : '' }; });
}
function addUrls(items, groupId){
  const existing = new Set(Object.values(state.tiles).map(t => dedupeKey(t.url)));
  const g = state.groups.find(x=>x.id===groupId) || state.groups.find(x=>x.id===UNGROUPED);
  let added=0, dup=0, bad=0;
  for (const it of items){
    const url = normalize(it.url);
    if (!url){ bad++; continue; }
    const k = dedupeKey(url);
    if (existing.has(k)){ dup++; continue; }
    existing.add(k);
    const id = uid();
    state.tiles[id] = { id, url, title: it.title || '', shot:'', peek:'none', added: Date.now() };
    g.tileIds.push(id); added++;
  }
  save(); render(); queuePeeks();
  toast(`Added ${added}` + (dup?` · ${dup} duplicate`:'') + (bad?` · ${bad} invalid`:''));
}

// ---------- peeks (Microlink) ----------
const queue = []; let active = 0; let limitedUntil = 0;
function queuePeeks(retry=false){
  for (const t of Object.values(state.tiles)){
    if (t.peek === 'none' || (retry && (t.peek==='fail'||t.peek==='limited'))) { if (!queue.includes(t.id)) { queue.push(t.id); t.peek='queued'; } }
  }
  if (retry) limitedUntil = 0;
  pump(); updateStats();
}
function pump(){
  while (active < CONCURRENCY && queue.length){
    if (Date.now() < limitedUntil){ // rate-limited: mark rest as limited, stop
      while (queue.length){ const t = state.tiles[queue.shift()]; if (t){ t.peek='limited'; refreshTile(t.id); } }
      save(); updateStats(); return;
    }
    const id = queue.shift(); const t = state.tiles[id]; if (!t) continue;
    active++; fetchPeek(t).finally(()=>{ active--; save(); refreshTile(id); updateStats(); pump(); });
  }
}
async function fetchPeek(t){
  t.peek='pending'; refreshTile(t.id);
  try {
    const ctrl = new AbortController(); const to = setTimeout(()=>ctrl.abort(), 25000);
    const r = await fetch(MICROLINK(t.url), { signal: ctrl.signal }); clearTimeout(to);
    if (r.status === 429){ t.peek='limited'; limitedUntil = Date.now() + 10*60*1000; toast('Microlink rate limit hit — showing placeholders. Try ↻ Peeks later.'); return; }
    const j = await r.json().catch(()=>null);
    const shot = j && j.status === 'success' && j.data && j.data.screenshot && j.data.screenshot.url;
    if (shot){ t.shot = shot; t.peek='ok'; }
    else { t.peek = (j && /rate|limit/i.test(j.code||j.message||'')) ? 'limited' : 'fail'; if (t.peek==='limited') limitedUntil = Date.now()+10*60*1000; }
  } catch(e){ t.peek='fail'; }
}

// ---------- render ----------
const board = document.getElementById('board');
let filter = '';
function render(){
  board.innerHTML = '';
  const total = Object.keys(state.tiles).length;
  if (!total && state.groups.length === 1){
    board.innerHTML = '<div class="empty"><p style="font-size:18px">Your wall is empty.</p><p>Click <b>+ Import URLs</b> to paste a list or load a CSV.</p></div>';
  }
  for (const g of state.groups){
    if (g.id===UNGROUPED && !g.tileIds.length && state.groups.length>1 && !total) continue;
    board.appendChild(groupEl(g));
  }
  updateStats(); fillGroupSelect();
}
function groupEl(g){
  const el = document.createElement('section'); el.className='group'; el.dataset.gid=g.id;
  const head = document.createElement('div'); head.className='ghead';
  const name = document.createElement('div'); name.className='name'; name.textContent=g.name;
  const count = document.createElement('span'); count.className='count'; count.textContent = `${g.tileIds.length}`;
  head.append(name, count);
  if (g.id !== UNGROUPED){
    name.title='Double-click to rename';
    name.ondblclick = () => startRename(name, g);
    const ren = btn('Rename', () => startRename(name, g));
    const up = btn('↑', () => moveGroup(g.id,-1)); up.title='Move group up';
    const dn = btn('↓', () => moveGroup(g.id,1)); dn.title='Move group down';
    const openAll = btn('Open all', () => { if (g.tileIds.length>8 && !confirm(`Open ${g.tileIds.length} tabs?`)) return; g.tileIds.forEach(id=>window.open(state.tiles[id].url,'_blank','noopener')); });
    const del = btn('Delete', () => { if (!confirm(`Delete group "${g.name}"? Its tiles move to Ungrouped.`)) return;
      state.groups.find(x=>x.id===UNGROUPED).tileIds.push(...g.tileIds); state.groups = state.groups.filter(x=>x!==g); save(); render(); });
    del.className='danger';
    head.append(document.createElement('span'), up, dn, ren, openAll, del);
    head.children[2].className='spacer';
  }
  const grid = document.createElement('div'); grid.className='grid';
  for (const id of g.tileIds){ const t = state.tiles[id]; if (t && matches(t)) grid.appendChild(tileEl(t)); }
  el.append(head, grid);
  // drop zone
  el.addEventListener('dragover', e => { if (!dragId) return; e.preventDefault(); e.dataTransfer.dropEffect='move'; el.classList.add('over'); });
  el.addEventListener('dragleave', e => { if (!el.contains(e.relatedTarget)) el.classList.remove('over'); });
  el.addEventListener('drop', e => { e.preventDefault(); el.classList.remove('over'); if (!dragId) return;
    const beforeTile = e.target.closest('.tile'); moveTile(dragId, g.id, beforeTile ? beforeTile.dataset.id : null); });
  return el;
}
function matches(t){ if (!filter) return true; return (t.url+' '+(t.title||'')).toLowerCase().includes(filter); }
function btn(label, fn){ const b=document.createElement('button'); b.textContent=label; b.onclick=e=>{e.stopPropagation(); fn();}; return b; }
function startRename(nameEl, g){
  nameEl.contentEditable='true'; nameEl.focus(); document.getSelection().selectAllChildren(nameEl);
  const done = () => { nameEl.contentEditable='false'; const v = nameEl.textContent.trim(); if (v) g.name=v; nameEl.textContent=g.name; save(); fillGroupSelect(); };
  nameEl.onblur = done; nameEl.onkeydown = e => { if (e.key==='Enter'){ e.preventDefault(); nameEl.blur(); } if (e.key==='Escape'){ nameEl.textContent=g.name; nameEl.blur(); } };
}
function moveGroup(id, dir){
  const i = state.groups.findIndex(g=>g.id===id), j = i+dir;
  if (j < 1 || j >= state.groups.length) return; // keep Ungrouped first
  [state.groups[i], state.groups[j]] = [state.groups[j], state.groups[i]]; save(); render();
}
function peekInner(t){
  if (t.peek==='ok' && t.shot) return `<img class="shot" loading="lazy" alt="" src="${esc(t.shot)}" onerror="this.dataset.err=1;window.__mpShotErr&&window.__mpShotErr('${t.id}')">`;
  const st = {none:'', queued:'queued…', pending:'capturing…', fail:'no preview', limited:'preview rate-limited'}[t.peek] || '';
  return `<div class="ph" style="--h:${hue(host(t.url))}"><img alt="" src="${FAVICON(host(t.url))}"><div class="dom">${esc(host(t.url))}</div><div class="st">${st}</div></div>`;
}
function tileEl(t){
  const el = document.createElement('div'); el.className='tile'; el.draggable=true; el.dataset.id=t.id; el.title=t.url;
  el.innerHTML = `<div class="peek">${peekInner(t)}</div>
    <div class="meta"><img alt="" src="${FAVICON(host(t.url))}"><div style="min-width:0;flex:1"><div class="t">${esc(t.title||defaultTitle(t.url))}</div><div class="d">${esc(host(t.url))}</div></div></div>
    <div class="acts"></div>`;
  const acts = el.querySelector('.acts');
  acts.append(
    btn('↗', () => openTile(t.id)),
    btn('✎', () => { const v = prompt('Tile title', t.title||defaultTitle(t.url)); if (v!==null){ t.title=v.trim(); save(); refreshTile(t.id);} }),
    btn('↻', () => { t.peek='none'; t.shot=''; queuePeeks(); }),
    btn('✕', () => { removeTile(t.id); })
  );
  acts.children[0].title='Open in new tab'; acts.children[1].title='Rename'; acts.children[2].title='Re-capture peek'; acts.children[3].title='Remove';
  el.addEventListener('click', e => { if (e.target.closest('.acts')) return; if (Date.now() - lastDragEnd < 300) return; openTile(t.id); });
  el.addEventListener('dragstart', e => { dragId=t.id; el.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain', t.url); });
  el.addEventListener('dragend', () => { el.classList.remove('dragging'); dragId=null; lastDragEnd=Date.now(); document.querySelectorAll('.over,.insert').forEach(x=>x.classList.remove('over','insert')); });
  el.addEventListener('dragover', () => { if (dragId && dragId!==t.id){ document.querySelectorAll('.insert').forEach(x=>x.classList.remove('insert')); el.classList.add('insert'); } });
  el.addEventListener('dragleave', () => el.classList.remove('insert'));
  return el;
}
window.__mpShotErr = id => { const t = state.tiles[id]; if (t){ t.peek='fail'; t.shot=''; save(); refreshTile(id); } };
function refreshTile(id){
  const t = state.tiles[id]; const el = board.querySelector(`.tile[data-id="${id}"]`);
  if (!t || !el) return; el.querySelector('.peek').innerHTML = peekInner(t);
  el.querySelector('.t').textContent = t.title || defaultTitle(t.url);
}
let dragId = null, lastDragEnd = 0;
function moveTile(id, gid, beforeId){
  if (id === beforeId) return;
  for (const g of state.groups) g.tileIds = g.tileIds.filter(x=>x!==id);
  const g = state.groups.find(x=>x.id===gid);
  const i = beforeId ? g.tileIds.indexOf(beforeId) : -1;
  if (i >= 0) g.tileIds.splice(i,0,id); else g.tileIds.push(id);
  save(); render();
}
function removeTile(id){ delete state.tiles[id]; for (const g of state.groups) g.tileIds = g.tileIds.filter(x=>x!==id); save(); render(); }
function openTile(id){ const t = state.tiles[id]; if (t) window.open(t.url, '_blank', 'noopener'); }
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function updateStats(){
  const ts = Object.values(state.tiles);
  const ok = ts.filter(t=>t.peek==='ok').length, busy = ts.filter(t=>t.peek==='queued'||t.peek==='pending').length;
  document.getElementById('stats').textContent = `${ts.length} tiles · ${state.groups.length-1} groups · ${ok} peeks` + (busy?` · ${busy} loading`:'');
}
function fillGroupSelect(){
  const sel = document.getElementById('selGroup'); const v = sel.value;
  sel.innerHTML = state.groups.map(g=>`<option value="${esc(g.id)}">${esc(g.name)}</option>`).join('');
  if (state.groups.find(g=>g.id===v)) sel.value = v;
}
let toastT; function toast(m){ const t=document.getElementById('toast'); t.textContent=m; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'), 2800); }

// ---------- toolbar ----------
const dlg = document.getElementById('dlgImport'), ta = document.getElementById('taImport');
document.getElementById('btnImport').onclick = () => { fillGroupSelect(); dlg.showModal(); ta.focus(); };
document.getElementById('btnCancel').onclick = () => dlg.close();
document.getElementById('btnDoImport').onclick = () => { const items = parseInput(ta.value); if (!items.length){ toast('Nothing to import'); return; } addUrls(items, document.getElementById('selGroup').value); ta.value=''; dlg.close(); };
document.getElementById('btnSample').onclick = () => { ta.value = ['https://github.com','https://news.ycombinator.com','https://developer.mozilla.org/en-US/','https://www.wikipedia.org','https://stackoverflow.com','https://www.youtube.com','https://www.reddit.com','https://www.nytimes.com','https://www.figma.com','https://vercel.com','https://www.notion.so','https://excalidraw.com'].join('\n'); };
document.getElementById('btnCsv').onclick = () => document.getElementById('fileCsv').click();
document.getElementById('fileCsv').onchange = async e => { const f = e.target.files[0]; if (f) ta.value = await f.text(); e.target.value=''; };
document.getElementById('btnNewGroup').onclick = () => { const n = prompt('Group name', 'New group'); if (!n || !n.trim()) return; state.groups.push({id:uid(), name:n.trim(), tileIds:[]}); save(); render(); };
document.getElementById('search').oninput = e => { filter = e.target.value.trim().toLowerCase(); render(); };
const size = document.getElementById('size');
size.oninput = () => { document.documentElement.style.setProperty('--tile', size.value+'px'); localStorage.setItem(KEY+'.size', size.value); };
size.value = localStorage.getItem(KEY+'.size') || 220; size.oninput();
document.getElementById('btnPeeks').onclick = () => queuePeeks(true);
document.getElementById('btnExport').onclick = () => {
  const blob = new Blob([JSON.stringify({...state, exportedAt:new Date().toISOString()}, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `mosaic-peek-${new Date().toISOString().slice(0,10)}.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
};
document.getElementById('btnImportJson').onclick = () => document.getElementById('fileJson').click();
document.getElementById('fileJson').onchange = async e => {
  const f = e.target.files[0]; e.target.value=''; if (!f) return;
  try { const s = JSON.parse(await f.text()); if (!s.groups || !s.tiles) throw new Error('missing groups/tiles');
    if (Object.keys(state.tiles).length && !confirm('Replace the current board with this file?')) return;
    state = sanitize({version:1, groups:s.groups, tiles:s.tiles}); save(); render(); queuePeeks(); toast('Board imported');
  } catch(err){ toast('Import failed: '+err.message); }
};
document.getElementById('btnClear').onclick = () => { if (!confirm('Clear the whole board? (Export first if you want a backup.)')) return; state = blank(); queue.length=0; save(); render(); };
// paste URLs anywhere on the page (outside inputs)
document.addEventListener('paste', e => { if (e.target.closest('input,textarea,[contenteditable=true]')) return; const txt = e.clipboardData.getData('text'); if (txt && /https?:\/\/|\w\.\w/.test(txt)){ e.preventDefault(); addUrls(parseInput(txt), UNGROUPED); } });
window.addEventListener('storage', e => { if (e.key===KEY){ state = load(); render(); } });

render(); queuePeeks();
})();
