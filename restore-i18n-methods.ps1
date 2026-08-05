$path='E:\Finance-Inzicht\src\Web\src\main.ts';$text=[IO.File]::ReadAllText($path)
$marker='  changeOverviewMonth(event:Event)'
$idx=$text.IndexOf($marker)
if($idx -lt 0){throw 'Change month marker missing'}
$methods=@'
  ngOnInit(){this.loadCategories();this.showDashboard()}
  showDashboard(){this.tab.set('dashboard');this.loading.set(true);this.error.set('');this.http.get<Analytics>('/api/v1/analytics/overview',{params:{months:this.dashboardMonths()}}).subscribe({next:x=>{this.analytics.set(x);this.loading.set(false)},error:x=>{this.error.set(x.error?.detail||this.t('loadDashboardError'));this.loading.set(false)}})}
  setDashboardPeriod(months:number){this.dashboardMonths.set(months);this.dashboardInsight.set(null);this.showDashboard()}
  periodLabel(){return this.dashboardMonths()===1?this.t('thisMonth'):this.dashboardMonths()+' '+this.t('months')}
  inspectKpi(title:string,value:number,currency:string,detail:string,ledger:any){this.dashboardInsight.set({title,value:this.money(value,currency),detail,ledger})}
  inspectCount(title:string,value:number,detail:string,ledger:any){this.dashboardInsight.set({title,value:value.toLocaleString(this.language()==='nl'?'nl-NL':'en-NL'),detail,ledger})}
  inspectMonth(m:Point,currency:string){this.dashboardInsight.set({title:this.monthLabel(m.period!),value:this.signedMoney(m.net,currency),detail:this.t('incoming')+' '+this.money(m.income,currency)+' / '+this.t('outgoing')+' '+this.money(m.expenses,currency),ledger:{period:m.period}})}
  inspectNamed(item:Named,type:string,currency:string,ledger:any){this.dashboardInsight.set({title:this.categoryText(item.name),value:this.money(item.total,currency),detail:type+' / '+item.count+' '+this.t('transactions').toLowerCase(),ledger})}
  inspectDay(day:any,currency:string){this.dashboardInsight.set({title:new Date(day.date+'T00:00:00').toLocaleDateString(this.language()==='nl'?'nl-NL':'en-NL'),value:this.money(day.value,currency),detail:this.t('dailyExpenseActivity')+' / '+(day.count||0)+' '+this.t('transactions').toLowerCase(),ledger:{from:day.date,to:day.date,direction:'debit'}})}
  inspectAccount(account:any){this.dashboardInsight.set({title:account.displayName||account.accountName||this.t('account'),value:this.money(account.balance,account.currency),detail:this.maskIban(account.iban),ledger:{accountId:account.id}})}
  openInsightLedger(filter:any){this.resetLedgerFilters();if(filter.accountId)this.ledgerAccountId.set(filter.accountId);if(filter.category)this.ledgerFilterCategory.set(filter.category);if(filter.search)this.ledgerSearch.set(filter.search);if(filter.direction)this.ledgerDirection.set(filter.direction);if(filter.from)this.ledgerFrom.set(filter.from);if(filter.to)this.ledgerTo.set(filter.to);if(filter.period){this.ledgerFrom.set(filter.period+'-01');this.ledgerTo.set(new Date(Number(filter.period.slice(0,4)),Number(filter.period.slice(5,7)),0).toISOString().slice(0,10))}if(!filter.from&&!filter.period&&this.analytics()?.rangeStart)this.ledgerFrom.set(this.analytics()!.rangeStart!);this.loadLedger()}
  refresh(){this.tab()==='dashboard'?this.showDashboard():this.tab()==='imports'?this.loadImports():this.tab()==='monthly'?this.loadMonthlyOverview():this.loadTransactions()}
  money(value:number|null|undefined,currency='EUR'){if(value==null)return '—';if(currency==='MIXED')return new Intl.NumberFormat(this.language()==='nl'?'nl-NL':'en-NL',{maximumFractionDigits:2}).format(value)+' mixed';return new Intl.NumberFormat(this.language()==='nl'?'nl-NL':'en-NL',{style:'currency',currency:currency||'EUR'}).format(value)}
  signedMoney(v:number,c:string){return (v>=0?'+':'')+this.money(v,c)}
  shortMax(rows:Point[]){return Math.max(1,...rows.flatMap(x=>[x.income,x.expenses]))}
  barHeight(v:number,rows:Point[]){return Math.max(2,v/this.shortMax(rows)*100)}
  monthLabel(v:string){return new Date(v+'-01T00:00:00').toLocaleDateString(this.language()==='nl'?'nl-NL':'en-NL',{month:'short'})}
  total(rows:Named[]){return rows.reduce((a,b)=>a+b.total,0)}
  color(i:number){return this.colors[i%this.colors.length]}
  donut(rows:Named[]){let p=0;const sum=this.total(rows)||1;return `conic-gradient(${rows.slice(0,8).map((x,i)=>{const s=p;p+=x.total/sum*100;return `${this.color(i)} ${s}% ${p}%`}).join(',')})`}
  linePoints(rows:{balance:number}[]){const vals=rows.map(x=>x.balance),min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;return rows.map((x,i)=>`${i/(rows.length-1||1)*800},${205-(x.balance-min)/range*185}`).join(' ')}
  areaPoints(rows:{balance:number}[]){return `0,220 ${this.linePoints(rows)} 800,220`}
  heatDays(rows:{date:string;value:number;count?:number}[]){const map=new Map(rows.map(x=>[x.date,x]));const max=Math.max(1,...rows.map(x=>x.value));const end=new Date((this.analytics()?.dataAsOf||new Date().toISOString().slice(0,10))+'T00:00:00');const start=new Date((this.analytics()?.rangeStart||end.toISOString().slice(0,10))+'T00:00:00');const days=Math.max(1,Math.round((end.getTime()-start.getTime())/86400000)+1),out=[];for(let i=days-1;i>=0;i--){const d=new Date(end);d.setDate(end.getDate()-i);const key=this.localDate(d),item=map.get(key),value=item?.value||0;out.push({date:key,value,count:item?.count||0,level:value===0?0:Math.min(4,Math.ceil(value/max*4))})}return out}
  percentOf(v:number,rows:Named[]){return v/Math.max(1,...rows.map(x=>x.total))*100}
  initials(v:string){return v.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
  maskIban(v?:string){return v?v.slice(0,4)+' •••• '+v.slice(-4):this.t('noIban')}
  upload(e:Event){const f=(e.target as HTMLInputElement).files?.[0];if(!f)return;this.busy.set(true);this.message.set('');const form=new FormData();form.append('file',f);this.http.post<any>('/api/v1/imports',form).subscribe({next:r=>{this.busy.set(false);this.message.set(r.count.toLocaleString()+' '+this.t('newImport'));setTimeout(()=>this.loadImports(),1200)},error:x=>{this.busy.set(false);this.message.set(x.error?.error||x.error?.detail||this.t('uploadFailed')+' ('+(x.status||'network')+')')}})}
  loadCategories(){this.http.get<CategoryGroup[]>('/api/v1/categories').subscribe(x=>this.categoryGroups.set(x))}
  subcategories(category:string){return this.categoryGroups().find(x=>x.name===category)?.subcategories||['Other']}
  categorySourceLabel(source?:number){return source===2?this.t('manual'):source===1?this.t('ibanRule'):this.t('automaticRecognition')}
  saveCategory(transaction:Tx,category:string,subcategory:string,applyToIban:boolean){this.http.put<any>('/api/v1/transactions/'+transaction.id+'/category',{category,subcategory,applyToIban}).subscribe({next:r=>{if(applyToIban&&transaction.counterpartyIban){for(const item of this.transactions())if(item.counterpartyIban===transaction.counterpartyIban){item.category=category;item.subcategory=subcategory;item.categorySource=1}}else{transaction.category=category;transaction.subcategory=subcategory;transaction.categorySource=2}this.transactions.set([...this.transactions()]);this.categoryMessage.set(r.affected+' '+this.t('categorySaved'))},error:x=>this.categoryMessage.set(x.error?.error||this.t('categorySaveError'))})}
  showAccounts(){this.tab.set('accounts');if(!this.analytics())this.showDashboard();else this.accountMessage.set('')}
  saveAccount(account:any,displayName:string,accountKind:string){this.http.put<any>('/api/v1/accounts/'+account.id,{displayName,accountKind:Number(accountKind)}).subscribe({next:updated=>{account.displayName=updated.displayName;account.accountKind=updated.accountKind;this.analytics.set({...this.analytics()!});this.accountMessage.set(this.t('accountSaved'))},error:x=>this.accountMessage.set(x.error?.error||this.t('accountSaveError'))})}
  flowHeight(value:number,rows:Point[]){const max=Math.max(1,...rows.flatMap(x=>[x.externalIncoming||0,x.externalOutgoing||0,x.transferIn||0,x.transferOut||0]));return value===0?0:Math.max(3,value/max*100)}
  loadMonthlyOverview(month?:string){this.tab.set('monthly');this.loading.set(true);const params:any={};if(month||this.overviewMonth())params.month=month||this.overviewMonth();this.http.get<any>('/api/v1/analytics/month',{params}).subscribe({next:x=>{this.monthlyOverview.set(x);this.overviewMonth.set(x.month);this.loading.set(false)},error:()=>{this.error.set(this.t('loadMonthlyError'));this.loading.set(false)}})}
'@
$text=$text.Insert($idx,$methods)
[IO.File]::WriteAllText($path,$text,[Text.UTF8Encoding]::new($false))
