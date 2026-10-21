const CACHE='blok-ustasi-v5';
const CORE=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  // Yazı tipleri: ilk açılışta indirilir, sonra hep önbellekten
  if(u.host.endsWith('fonts.googleapis.com')||u.host.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n}).catch(()=>new Response('',{status:504})))));return}
  if(u.origin!==location.origin)return;
  // Oyun dosyaları: internet varsa güncelini al, yoksa önbellekten aç
  e.respondWith(fetch(e.request).then(n=>{const cp=n.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return n}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
