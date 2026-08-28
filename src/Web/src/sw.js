const SHELL_CACHE='finance-inzicht-shell-v3';
const CORE=['/','/index.html','/manifest.webmanifest'];

async function cacheApplicationShell(){
  const cache=await caches.open(SHELL_CACHE);
  const response=await fetch('/index.html',{cache:'no-store'});
  if(!response.ok)throw new Error('Could not load the application shell');
  const html=await response.clone().text();
  await cache.put('/index.html',response.clone());
  await cache.put('/',response);
  const paths=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match=>new URL(match[1],self.location.origin)).filter(url=>url.origin===self.location.origin&&!url.pathname.startsWith('/api/')).map(url=>url.pathname);
  await Promise.allSettled([...new Set([...CORE,...paths])].map(path=>cache.add(path)));
}

self.addEventListener('install',event=>event.waitUntil(cacheApplicationShell().then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('finance-inzicht-shell-')&&key!==SHELL_CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{if(response.ok)caches.open(SHELL_CACHE).then(cache=>cache.put('/index.html',response.clone()));return response}).catch(async()=>await caches.match('/index.html')||Response.error()));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok)caches.open(SHELL_CACHE).then(cache=>cache.put(request,response.clone()));return response})));
});
