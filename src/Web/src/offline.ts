import {Injectable, inject, signal} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, catchError, from, of, switchMap, tap, throwError} from 'rxjs';

type StoredResponse={key:string;scope:string;body:unknown;status:number;statusText:string;headers:[string,string][];storedAt:number};
type StoredBody={kind:'empty'|'json'|'text'|'blob'|'form-data';value?:unknown;entries?:{name:string;value:string|Blob;fileName?:string}[]};
type QueuedMutation={id?:number;scope:string;method:string;url:string;headers:[string,string][];body:StoredBody;createdAt:number};

const DB_NAME='finance-inzicht-offline';
const DB_VERSION=1;
const RESPONSES='responses';
const MUTATIONS='mutations';

function requestResult<T>(request:IDBRequest<T>):Promise<T>{return new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
function transactionDone(transaction:IDBTransaction):Promise<void>{return new Promise((resolve,reject)=>{transaction.oncomplete=()=>resolve();transaction.onerror=()=>reject(transaction.error);transaction.onabort=()=>reject(transaction.error)})}

function openDatabase():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const database=request.result;
      if(!database.objectStoreNames.contains(RESPONSES)){
        const responses=database.createObjectStore(RESPONSES,{keyPath:'key'});
        responses.createIndex('scope','scope');
      }
      if(!database.objectStoreNames.contains(MUTATIONS)){
        const mutations=database.createObjectStore(MUTATIONS,{keyPath:'id',autoIncrement:true});
        mutations.createIndex('scope','scope');
      }
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
}

function tokenScope():string{
  const token=localStorage.getItem('finance-token');
  if(!token)return'anonymous';
  try{const user=JSON.parse(localStorage.getItem('finance-offline-user')||'null');if(user?.id)return String(user.id)}catch{}
  try{
    const payload=JSON.parse(decodeURIComponent(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')).split('').map(character=>'%'+('00'+character.charCodeAt(0).toString(16)).slice(-2)).join('')));
    return String(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']||payload.sub||payload.email||token.slice(-24));
  }catch{return token.slice(-24)}
}

function responseKey(request:HttpRequest<unknown>,scope=tokenScope()){return scope+'::'+request.urlWithParams}
function isApi(request:HttpRequest<unknown>){return request.url.startsWith('/api/v1/')}
function isAuthenticationWrite(request:HttpRequest<unknown>){return request.url.includes('/auth/login')||request.url.includes('/auth/bootstrap')}
function isConnectionFailure(error:unknown){return error instanceof HttpErrorResponse&&(error.status===0||error.status===502||error.status===503||error.status===504)}

async function serializeBody(body:unknown):Promise<StoredBody>{
  if(body==null)return{kind:'empty'};
  if(body instanceof FormData){
    const entries:{name:string;value:string|Blob;fileName?:string}[]=[];
    body.forEach((value,name)=>entries.push(typeof value==='string'?{name,value}:{name,value,fileName:value.name}));
    return{kind:'form-data',entries};
  }
  if(body instanceof Blob)return{kind:'blob',value:body};
  if(typeof body==='string')return{kind:'text',value:body};
  return{kind:'json',value:body};
}

function deserializeBody(body:StoredBody):BodyInit|undefined{
  if(body.kind==='empty')return undefined;
  if(body.kind==='form-data'){
    const form=new FormData();
    for(const entry of body.entries||[])typeof entry.value==='string'?form.append(entry.name,entry.value):form.append(entry.name,entry.value,entry.fileName);
    return form;
  }
  if(body.kind==='json')return JSON.stringify(body.value);
  return body.value as BodyInit;
}

@Injectable({providedIn:'root'})
export class OfflineService{
  readonly online=signal(navigator.onLine);
  readonly pending=signal(0);
  readonly syncVersion=signal(0);
  private database=openDatabase();
  private flushing=false;

  constructor(){
    this.updatePending();
    window.addEventListener('offline',()=>this.online.set(false));
    window.addEventListener('online',()=>{this.online.set(true);this.flush()});
    window.setInterval(()=>{if(navigator.onLine&&this.pending())this.flush()},15000);
  }

  scope(){return tokenScope()}
  markOnline(){const changed=!this.online();this.online.set(true);if(changed)this.flush()}
  markOffline(){this.online.set(false)}

  async cache(request:HttpRequest<unknown>,response:HttpResponse<unknown>){
    try{
      const database=await this.database,transaction=database.transaction(RESPONSES,'readwrite');
      const headers:[string,string][]=[];response.headers.keys().forEach(name=>headers.push([name,response.headers.get(name)||'']));
      transaction.objectStore(RESPONSES).put({key:responseKey(request),scope:this.scope(),body:response.body,status:response.status,statusText:response.statusText,headers,storedAt:Date.now()} satisfies StoredResponse);
      await transactionDone(transaction);
    }catch(error){console.warn('Could not cache offline response',error)}
  }

  async cached(request:HttpRequest<unknown>):Promise<HttpResponse<unknown>|null>{
    try{
      const stored=await this.readResponse(responseKey(request))||await this.offlineFallback(request);
      return stored?new HttpResponse({body:await this.applyPendingChanges(stored.body,request),status:stored.status,statusText:stored.statusText,url:request.urlWithParams}):null;
    }catch(error){console.warn('Could not read offline response',error);return null}
  }

  async enqueue(request:HttpRequest<unknown>){
    const body=await serializeBody(request.body);
    const database=await this.database,transaction=database.transaction(MUTATIONS,'readwrite');
    const headers:[string,string][]=[];
    request.headers.keys().filter(name=>name.toLowerCase()!=='authorization'&&name.toLowerCase()!=='content-length').forEach(name=>headers.push([name,request.headers.get(name)||'']));
    transaction.objectStore(MUTATIONS).add({scope:this.scope(),method:request.method,url:request.urlWithParams,headers,body,createdAt:Date.now()} satisfies QueuedMutation);
    await transactionDone(transaction);
    await this.updatePending();
  }

  async flush(){
    if(this.flushing||!navigator.onLine||!localStorage.getItem('finance-token'))return;
    this.flushing=true;
    let completed=0;
    try{
      const database=await this.database,scope=this.scope(),read=database.transaction(MUTATIONS,'readonly');
      const queued=(await requestResult(read.objectStore(MUTATIONS).getAll()) as QueuedMutation[]).filter(item=>item.scope===scope).sort((a,b)=>(a.id||0)-(b.id||0));
      for(const mutation of queued){
        const headers=new Headers(mutation.headers);headers.set('Authorization','Bearer '+localStorage.getItem('finance-token'));
        if(mutation.body.kind==='json'&&!headers.has('Content-Type'))headers.set('Content-Type','application/json');
        const response=await fetch(mutation.url,{method:mutation.method,headers,body:deserializeBody(mutation.body)});
        if(response.status===401||response.status===403)break;
        if(!response.ok&&response.status>=500){this.markOffline();break}
        const remove=database.transaction(MUTATIONS,'readwrite');remove.objectStore(MUTATIONS).delete(mutation.id!);await transactionDone(remove);completed++;
      }
      if(completed){await this.updatePending();this.syncVersion.update(value=>value+1)}
      if(queued.length===completed||completed)this.online.set(true);
    }catch(error){this.markOffline();console.warn('Could not synchronize offline changes',error)}
    finally{this.flushing=false}
  }

  rememberUser(user:unknown){localStorage.setItem('finance-offline-user',JSON.stringify(user));this.updatePending()}
  rememberedUser<T=unknown>():T|null{try{return JSON.parse(localStorage.getItem('finance-offline-user')||'null')}catch{return null}}
  forgetUser(){localStorage.removeItem('finance-offline-user');this.updatePending()}

  private async readResponse(key:string){
    const database=await this.database,transaction=database.transaction(RESPONSES,'readonly');
    return await requestResult(transaction.objectStore(RESPONSES).get(key) as IDBRequest<StoredResponse|undefined>);
  }

  private async offlineFallback(request:HttpRequest<unknown>):Promise<StoredResponse|undefined>{
    const url=new URL(request.urlWithParams,location.origin),scope=this.scope();
    if(url.pathname==='/api/v1/transactions'){
      const stored=await this.readResponse(scope+'::/api/v1/transactions?page=1&pageSize=200');
      const body=stored?.body as any;if(!stored||!Array.isArray(body?.items))return undefined;
      const value=(name:string)=>url.searchParams.get(name)||'',needle=value('search').toLocaleLowerCase();
      const items=body.items.filter((item:any)=>(!value('accountId')||item.bankAccountId===value('accountId'))&&(!value('category')||item.category===value('category'))&&(!value('subcategory')||item.subcategory===value('subcategory'))&&(!value('direction')||(value('direction')==='credit'?item.creditDebitIndicator===0:item.creditDebitIndicator===1))&&(!value('dateFrom')||String(item.bookingDate).slice(0,10)>=value('dateFrom'))&&(!value('dateTo')||String(item.bookingDate).slice(0,10)<=value('dateTo'))&&(!value('minAmount')||Number(item.amount)>=Number(value('minAmount')))&&(!value('maxAmount')||Number(item.amount)<=Number(value('maxAmount')))&&(!needle||[item.counterpartyName,item.counterpartyIban,item.remittanceInformation,item.additionalInformation,item.entryReference,item.accountServicerReference].some(text=>String(text||'').toLocaleLowerCase().includes(needle))));
      return{...stored,body:{...body,items,total:items.length}};
    }
    if(url.pathname==='/api/v1/analytics/month'&&url.searchParams.has('month')){
      const month=url.searchParams.get('month')!,year=month.slice(0,4),stored=await this.readResponse(scope+'::/api/v1/analytics/month?year='+year);
      const body=stored?.body as any;if(!stored||!Array.isArray(body?.groups))return undefined;
      const groups=body.groups.map((group:any)=>{const transactions=(group.transactions||[]).filter((item:any)=>String(item.bookingDate).startsWith(month));return{...group,transactions,count:transactions.length,total:transactions.reduce((sum:number,item:any)=>sum+Number(item.amount),0)}}).filter((group:any)=>group.count);
      const total=(direction:string)=>groups.filter((group:any)=>group.direction===direction).reduce((sum:number,group:any)=>sum+group.total,0),incoming=total('Incoming'),outgoing=total('Outgoing');
      const lastDay=String(new Date(Number(year),Number(month.slice(5,7)),0).getDate()).padStart(2,'0');
      return{...stored,body:{...body,month,year:Number(year),isYear:false,from:month+'-01',to:month+'-'+lastDay,incoming,outgoing,net:incoming-outgoing,transferIn:total('Transfer in'),transferOut:total('Transfer out'),transactionCount:groups.reduce((sum:number,group:any)=>sum+group.count,0),groups}};
    }
    return undefined;
  }

  private async applyPendingChanges(original:unknown,request:HttpRequest<unknown>){
    const database=await this.database,transaction=database.transaction(MUTATIONS,'readonly'),scope=this.scope();
    const queued=(await requestResult(transaction.objectStore(MUTATIONS).getAll()) as QueuedMutation[]).filter(item=>item.scope===scope);
    if(!queued.length)return original;
    let body:any;try{body=structuredClone(original)}catch{return original}
    if(request.url.startsWith('/api/v1/transactions')&&Array.isArray(body?.items)){
      for(const mutation of queued.filter(item=>/\/api\/v1\/transactions\/[^/]+\/category/.test(item.url)&&item.body.kind==='json')){
        const id=mutation.url.split('/')[4],change=mutation.body.value as any,target=body.items.find((item:any)=>item.id===id),iban=target?.counterpartyIban;
        for(const item of body.items)if(item.id===id||(change.applyToIban&&iban&&item.counterpartyIban===iban)){item.category=change.category;item.subcategory=change.subcategory;item.categorySource=change.applyToIban?1:2}
      }
    }
    if(request.url.startsWith('/api/v1/analytics/overview')&&Array.isArray(body?.accounts)){
      for(const mutation of queued.filter(item=>/\/api\/v1\/accounts\/[^/]+$/.test(item.url)&&item.body.kind==='json')){
        const account=body.accounts.find((item:any)=>item.id===mutation.url.split('/')[4]);if(account)Object.assign(account,mutation.body.value);
      }
    }
    if(request.url==='/api/v1/admin/users'&&Array.isArray(body)){
      for(const mutation of queued.filter(item=>item.url==='/api/v1/admin/users'&&item.method==='POST'&&item.body.kind==='json'))body.push({id:'offline-'+mutation.id,...(mutation.body.value as object),isActive:true});
      for(const mutation of queued.filter(item=>/\/api\/v1\/admin\/users\/[^/]+$/.test(item.url)&&item.method==='PUT'&&item.body.kind==='json')){const user=body.find((item:any)=>item.id===mutation.url.split('/')[5]);if(user)Object.assign(user,mutation.body.value)}
    }
    if(request.url==='/api/v1/imports'&&Array.isArray(body)){
      for(const mutation of queued.filter(item=>item.url==='/api/v1/imports'&&item.body.kind==='form-data')){const file=mutation.body.entries?.find(entry=>entry.name==='file');body.unshift({id:'offline-'+mutation.id,originalFileName:file?.fileName||'Offline import',status:0,createdAtUtc:new Date(mutation.createdAt).toISOString(),transactionCount:0,warningCount:0})}
    }
    return body;
  }

  private async updatePending(){
    try{
      const database=await this.database,transaction=database.transaction(MUTATIONS,'readonly'),scope=this.scope();
      const all=await requestResult(transaction.objectStore(MUTATIONS).getAll()) as QueuedMutation[];
      this.pending.set(all.filter(item=>item.scope===scope).length);
    }catch{this.pending.set(0)}
  }
}

function offlineAcknowledgement(request:HttpRequest<unknown>){
  if(request.url.startsWith('/api/v1/imports'))return{offline:true,queued:true,count:1};
  if(request.url.includes('/category'))return{offline:true,queued:true,affected:1};
  return typeof request.body==='object'&&request.body!==null?{...(request.body as object),offline:true,queued:true}:{offline:true,queued:true};
}

export const offlineInterceptor:HttpInterceptorFn=(request:HttpRequest<unknown>,next:HttpHandlerFn):Observable<HttpEvent<unknown>>=>{
  const offline=inject(OfflineService);
  if(!isApi(request))return next(request);
  if(request.method==='GET'&&!navigator.onLine){
    offline.markOffline();
    return from(offline.cached(request)).pipe(switchMap(cached=>cached?of(cached):next(request)));
  }
  if(request.method!=='GET'&&!isAuthenticationWrite(request)&&!navigator.onLine){
    offline.markOffline();
    return from(offline.enqueue(request)).pipe(switchMap(()=>of(new HttpResponse({body:offlineAcknowledgement(request),status:202,statusText:'Queued for synchronization',url:request.urlWithParams}))));
  }
  return next(request).pipe(
    tap(event=>{if(event instanceof HttpResponse){offline.markOnline();if(request.method==='GET')offline.cache(request,event)}}),
    catchError(error=>{
      if(!isConnectionFailure(error))return throwError(()=>error);
      offline.markOffline();
      if(request.method==='GET')return from(offline.cached(request)).pipe(switchMap(cached=>cached?of(cached):throwError(()=>error)));
      if(!isAuthenticationWrite(request))return from(offline.enqueue(request)).pipe(switchMap(()=>of(new HttpResponse({body:offlineAcknowledgement(request),status:202,statusText:'Queued for synchronization',url:request.urlWithParams}))));
      return throwError(()=>error);
    })
  );
};
