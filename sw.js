// Offline copy of the app for the installed Mosaic Peek. Same-site requests go to the network first, so a new
// release shows up on the next online load; the saved copy is only used when the network fails. Screenshots
// and favicons from other sites are left to the browser. Opening the app with ?nosw removes all of this.
const CACHE = 'mosaic-peek-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('mosaic-peek') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => {
    if (res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
    return res;
  }).catch(() => caches.match(r, { ignoreSearch:true }).then(hit => hit || (r.mode === 'navigate' ? caches.match('./') : Response.error()))));
});
