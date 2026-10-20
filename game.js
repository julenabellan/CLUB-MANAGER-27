const form5=(id,w=1e9)=>{const r=G.res.filter(x=>x[0]<w&&(x[2]==id||x[3]==id)).slice(-5).map(x=>{const d=x[2]==id?x[4]-x[5]:x[5]-x[4];return d>0?'v':d<0?'d':'e'}),L={v:'V',e:'E',d:'D'};return `<div class="fm" title="Últimos 5 partidos">${'<i></i>'.repeat(5-r.length)}${r.map(c=>`<i class="${c}">${L[c]}</i>`).join('')}</div>`};
const lgi=l=>l==3?'img/CC.png':`img/LOGO%20${l}A.png`;
const lgl=(l,s=28)=>`<img class="lgl" height="${s}" src="${lgi(l)}" alt="" onerror="this.style.display='none'">`;
const CRN=["cluc fc g.png", "CRAKOVIA CF G.png", "Campo.png", "GACKO.png", "as club g.png", "KFK.png", "BERLIN FC.png", "Paris CF.png", "Gacko Portugal.png", "NUBE.png", "blue wordl club g.png", "SPAIN CLUB.png", "ENGLAND CLUB.png", "leizpig fc.png", "Creg Belga.png", "Spartak Belgrade.png", "LONDON CLUB.png", "Creg Croata.png", "Holland Team.png", "Moscu fc g.png", "Italica FC.png", "Germanya FS.png", "Warsaw KP.png", "MILANO SP.png", "Zürich Aktiv.png", "CLUC B.png", "France Club.png", "Bratislava Fighters.png", "PUSKAS SPORTOS.png", "mac manchester.png", "VICTORIA ISTANBUL.png", "SOLIKSON ISLANDIA.png", "LAC LIVERPOOL.png", "KFK B.png", "DINAMO ROTTERDAM.png", "Cardiff Cambrian FC.png", "RIBERA LEVANTINA.png", "SOLIKSON IRLANDES.png", "IBERICA.png", "SKÄRHOLM AFC.png", "JAPAN FC.png", "BASILEA FF.png", "MIQAREM.png", "NYHAVN.png"];
const crest=(i,s=28)=>`<img class="cr" width="${s}" height="${s}" src="img/${encodeURIComponent(CRN[i])}" alt="" onerror="this.style.visibility='hidden'">`;
const PN={P:'POR',D:'DEF',M:'MED',F:'DEL'},FORM={'4-3-3':[1,4,3,3],'4-3-3 (1)':[1,4,3,3],'4-3-3 (2)':[1,4,3,3],'4-4-2':[1,4,4,2],'4-4-2 (1)':[1,4,4,2],'4-4-2 (2)':[1,4,4,2],'3-5-2':[1,3,5,2],'3-5-2 (1)':[1,3,5,2],'3-5-2 (2)':[1,3,5,2],'4-5-1':[1,4,5,1],'4-5-1 (1)':[1,4,5,1],'4-5-1 (2)':[1,4,5,1],'5-3-2':[1,5,3,2],'5-3-2 (1)':[1,5,3,2],'5-3-2 (2)':[1,5,3,2],'3-4-3':[1,3,4,3],'3-4-3 (1)':[1,3,4,3],'3-4-3 (2)':[1,3,4,3],'5-4-1':[1,5,4,1],'5-4-1 (1)':[1,5,4,1],'5-4-1 (2)':[1,5,4,1],'5-2-3':[1,5,2,3],'5-2-3 (1)':[1,5,2,3],'5-2-3 (2)':[1,5,2,3],'4-2-3-1':[1,4,5,1],'4-1-4-1':[1,4,5,1],'4-3-1-2':[1,4,4,2]},LGN={1:'Liga Superstar One',2:'Liga Superstar 2'},REL=3,PRO=3,NW=46,NWL={1:38,2:46},KEY='cm27c';
/* Sistema de posiciones: grupo (P/D/M/F) + posición concreta (POR/CT/LD/LI/MCD/MC/MP/II/ID/EI/ED/DC) + alternativas.
   Jugar en su posición o en una alternativa apenas penaliza; en otra, según compatibilidad (muy bien .96 · bastante bien .92 · bien .88 · resto .80). Un MP juega de MC sin penalización (1). */
const FPD={P:'POR',D:'CT',M:'MC',F:'DC'},FGR=s=>s=='POR'?'P':'CT LD LI'.includes(s)?'D':s=='EI'||s=='ED'||s=='DC'?'F':'M',
FSL={'4-3-3':'LI CT CT LD|MC MCD MC|EI DC ED','4-3-3 (1)':'LI CT CT LD|MCD MC MCD|EI DC ED','4-3-3 (2)':'LI CT CT LD|MP MC MP|EI DC ED','4-4-2':'LI CT CT LD|II MC MC ID|DC DC','4-4-2 (1)':'LI CT CT LD|II MCD MP ID|DC DC','4-4-2 (2)':'LI CT CT LD|II MCD MCD ID|DC DC','3-5-2':'CT CT CT|II MC MCD MC ID|DC DC','3-5-2 (1)':'CT CT CT|II MCD MC MCD ID|DC DC','3-5-2 (2)':'CT CT CT|II MP MC MP ID|DC DC','4-5-1':'LI CT CT LD|II MC MP MC ID|DC','4-5-1 (1)':'LI CT CT LD|II MCD MC MCD ID|DC','4-5-1 (2)':'LI CT CT LD|II MP MC MP ID|DC','5-3-2':'LI CT CT CT LD|MC MCD MC|DC DC','5-3-2 (1)':'LI CT CT CT LD|MCD MC MCD|DC DC','5-3-2 (2)':'LI CT CT CT LD|MP MC MP|DC DC','3-4-3':'CT CT CT|II MC MC ID|EI DC ED','3-4-3 (1)':'CT CT CT|II MCD MCD ID|EI DC ED','3-4-3 (2)':'CT CT CT|II MC MP ID|EI DC ED','5-4-1':'LI CT CT CT LD|II MC MC ID|DC','5-4-1 (1)':'LI CT CT CT LD|II MCD MCD ID|DC','5-4-1 (2)':'LI CT CT CT LD|II MC MP ID|DC','5-2-3':'LI CT CT CT LD|MCD MC|EI DC ED','5-2-3 (1)':'LI CT CT CT LD|MCD MCD|EI DC ED','5-2-3 (2)':'LI CT CT CT LD|MC MP|EI DC ED','4-2-3-1':'LI CT CT LD|MCD MCD II MP ID|DC','4-1-4-1':'LI CT CT LD|MCD II MC MC ID|DC','4-3-1-2':'LI CT CT LD|MCD MC MC MP|DC DC'},
VG=.96,BA=.92,BI=.88,
COMPAT={CT:{LD:VG,LI:VG,MCD:BI},LD:{CT:VG,ID:BA},LI:{CT:VG,II:BA},MCD:{CT:BI,MC:VG},MC:{MCD:VG,MP:VG,II:BA,ID:BA},MP:{MC:1,DC:VG,EI:BI,ED:BI,II:BI,ID:BI},II:{MP:BA,EI:VG},ID:{MP:BA,ED:VG},EI:{II:VG,DC:VG},ED:{ID:VG,DC:VG},DC:{EI:BA,ED:BA,MP:BI,MCD:BI}},
fslots=f=>['POR'].concat(...FSL[f].split('|').map(x=>x.split(' '))),
fit=(p,s)=>{const f=p.fp||FPD[p.pos];if(s=='POR'||f=='POR')return f==s?1:.4;if(f==s)return 1;if(p.alt&&p.alt.includes(s))return .98;const c=COMPAT[f];return c&&c[s]||.8},
PL=p=>p.fp||PN[p.pos],
OY={MP:-22,MCD:22,LI:-8,LD:-8,CT:6,DC:-8},ROY=s=>'--oy:'+(OY[s]|0)+'px',
fmPick=t=>{const ks=Object.keys(FORM),bs=[...new Set(ks.map(f=>f.split(' ')[0]))],cb=t.form.split(' ')[0],vs=ks.filter(f=>f.split(' ')[0]==cb),o=S.fmo;
 return `<div class="pn fmp"><div class="fmr"><span class="fml">Formación</span><button class="fmt${o?' open':''}" data-fmo="1"><b>${cb}</b><i class="chv"></i></button></div>${o?`<div class="fmlist">${bs.map(b=>`<button class="fmc${b==cb?' on':''}" data-fm="${b}">${b}</button>`).join('')}</div>`:''}${vs.length>1?`<div class="fmr"><span class="fml">Variante</span>${vs.map((f,k)=>`<button class="fmc fmv${f==t.form?' on':''}" data-fm="${f}"><b>${k?'Variante '+k:'Base'}</b><small>${FSL[f].split('|')[1]}</small></button>`).join('')}</div>`:''}</div>`}

FC=(p,s)=>{const h=Math.max(0,Math.min(145,(fit(p,s)-.78)/.2*145));return `hsl(${Math.round(h)},80%,50%)`};/* color según encaje: verde = su posición, amarillo/naranja = parecida, rojo = muy distinta */
function fixPos(){/* migra partidas antiguas: recupera posiciones de la base de datos o las deduce */G.T.forEach((t,i)=>t.pl.forEach(p=>{if(p.fp)return;const d=D[i]&&D[i].p.find(x=>x[1]==p.n);p.fp=d&&d[6]||FPD[p.pos];p.alt=d&&d[7]||[]}));/* renombra MI/MD antiguos a II/ID */const rn=x=>x=='MI'?'II':x=='MD'?'ID':x;G.T.forEach(t=>t.pl.forEach(p=>{p.fp=rn(p.fp);p.alt=(p.alt||[]).map(rn)}))}
/* Dorsales: sin repetir en el equipo, al azar pero con lógica por posición (1 portero titular, 2-5 defensas, 6/8/10 medios, 7/9/11 delanteros...).
   Los mejores jugadores eligen primero los números "nobles"; los menores de 20 años llevan números altos. Se guardan en p.num y no cambian. */
const NUMT={POR:[[1],[13],[12,25,22],[30,31,40,41]],CT:[[4,5],[3,2,15],[23,12,14,22,24],[26,28,32,34,36]],LD:[[2],[12,22,20],[26,27,29],[33,35]],LI:[[3],[15,17,21],[28,29,31],[34,36]],
 MCD:[[6,5],[4,14,16],[18,20,24],[26,28,30]],MC:[[8,6,14],[16,18,20,21],[22,24,25],[27,29,33]],MP:[[10],[8,17,21],[14,16,20],[27,32,37]],
 II:[[11,7,17],[19,21,23],[25,27],[30,34]],ID:[[7,17,11],[19,21,23],[25,27],[30,34]],EI:[[11,7,17,19],[21,23,25],[27,29],[31,35]],ED:[[7,17,11,19],[21,23,25],[27,29],[31,35]],DC:[[9],[19,18,20],[10,24,25],[27,30,32,38]]};
function assignNums(t){const used=new Set();let ch=false;
 t.pl.forEach(p=>{if(Number.isInteger(p.num)&&p.num>=1&&p.num<=99&&!used.has(p.num))used.add(p.num);else if(p.num!=null){delete p.num;ch=true}});
 t.pl.filter(p=>p.num==null).sort((a,b)=>b.ovr-a.ovr).forEach(p=>{
  let ti=NUMT[p.fp||FPD[p.pos]]||NUMT[FPD[p.pos]];if(p.age<=19)ti=ti.slice(2).concat(ti.slice(0,2));
  let n=null;for(const tier of ti){const f=tier.filter(x=>!used.has(x));if(f.length){n=f[Math.floor(Math.random()*f.length)];break}}
  if(n==null){const f=[];for(let x=2;x<=60;x++)if(!used.has(x))f.push(x);n=f.length?f[Math.floor(Math.random()*f.length)]:99}
  p.num=n;used.add(n);ch=true});return ch}
const $=s=>document.querySelector(s),R=(a,b)=>a+Math.random()*(b-a),ef=p=>p.ovr*(1-.001*(p.fa|0)),av=a=>a.length?a.reduce((s,p)=>s+ef(p),0)/a.length:50;
let G=null,S={tab:'home',lg:1,sel:{lg:1,t:null}};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(G))}catch(e){}};
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}};
const ids=l=>G.T.filter(t=>t.lg==l).map(t=>t.id),nm=i=>G.T[i].n;
function newGame(name,tid){G={mgr:name,me:tid,season:2027,week:0,conf:60,fans:60,feed:[],fs:0,seen:0,T:D.map((t,i)=>({id:i,n:t.n,c:t.c,lg:t.l,form:FORM[t.f]?t.f:'4-3-3',pl:t.p.map(p=>({n:p[1],nat:p[2],age:p[3],pos:p[0],fp:p[6]||FPD[p[0]],alt:p[7]||[],ovr:p[4],pot:p[5],g:0,a:0,yc:0,pj:0,fa:0}))}))};startSeason();feedStart(1);}
function startSeason(){G.week=0;G.res=[];G.last=null;G.T.forEach(t=>{t.pts=t.pj=t.gf=t.gc=t.w=t.d=t.l=0;t.pl.forEach(p=>{p.g=0;p.a=0;p.yc=0;p.pj=0;p.fa=0;p.cg=0;p.ca=0});assignNums(t);if(t.id!=G.me||!t.man)auto(t)});G.fx={1:rounds(ids(1)),2:rounds(ids(2))};G.cc=ccBuild();setObj();save();}
function rounds(a){a=a.slice().sort(()=>Math.random()-.5);const n=a.length,m=n-1,H=[];for(let r=0;r<m;r++){const x=[r%2?[a[r],a[m]]:[a[m],a[r]]];for(let k=1;k<n/2;k++){const p=a[(r+k)%m],q=a[(r-k+m)%m];x.push(k%2?[p,q]:[q,p])}H.push(x)}return H.concat(H.map(r=>r.map(([h,b])=>[b,h])))}
const slots=f=>{const a=FORM[f],o=[];'PDMF'.split('').forEach((c,i)=>{for(let k=0;k<a[i];k++)o.push(c)});return o},mean=a=>a.reduce((s,v)=>s+v,0)/a.length,rt=(p,s)=>ef(p)*fit(p,s);
function auto(t){const f=FORM[t.form],used=new Set(),lu=[],ix=t.pl.map((p,i)=>i),by=(a,b)=>ef(t.pl[b])-ef(t.pl[a]);
 fslots(t.form).forEach(s=>{let b=-1,bv=-1;ix.forEach(i=>{if(used.has(i))return;const p=t.pl[i],v=ef(p)*fit(p,s)+(p.pos==FGR(s)?15:0);if(v>bv){bv=v;b=i}});if(b>=0){lu.push(b);used.add(b)}});
 const r=ix.filter(i=>!used.has(i)),gk=r.filter(i=>t.pl[i].pos=='P').sort(by).slice(0,1);
 t.lu=lu;t.bn=gk.concat(r.filter(i=>!gk.includes(i)).sort(by).slice(0,7-gk.length))}
function xi(t){if(!t.lu||t.lu.length!=11||t.lu.some(i=>!t.pl[i]))auto(t);if(!t.bn)auto(t);return t.lu.map(i=>t.pl[i])}
function str(t){const x=xi(t),sp=slots(t.form),fs=fslots(t.form),r=x.map((p,i)=>rt(p,fs[i])),g=c=>{const a=r.filter((_,i)=>sp[i]==c);return a.length?mean(a):50},m=g('M'),f=g('F');return{a:.55*f+.35*m+.1*g('D'),d:.45*g('D')+.3*g('P')+.25*m,o:mean(r)}}
/* fatiga por minutos: titular 90' suma cansancio; quien sale antes (o entra) lo nota proporcionalmente; quien no juega descansa más.
   Los equipos de la IA hacen cambios automáticos (1-5) entre el 46' y el 86'. */
const fat=(t,ai,sc,cd)=>{const x=new Set(t.lu),out={},inn={},f=m=>R(5,9)*m/90-3*(90-m)/90,lastEv={};t.asb=[];
 (sc||[]).forEach(s=>{lastEv[s[0]]=Math.max(lastEv[s[0]]|0,s[1]);if(s[2])lastEv[s[2]]=Math.max(lastEv[s[2]]|0,s[1])});(cd||[]).forEach(c=>{lastEv[c[0]]=Math.max(lastEv[c[0]]|0,c[1])});
 if(ai&&t.bn&&t.bn.length){const n=Math.min(5,1+pois(2));
  for(let k=0;k<n;k++){const c=t.lu.filter(i=>t.pl[i].pos!='P'&&out[i]==null).sort((a,b)=>(t.pl[b].fa|0)-(t.pl[a].fa|0));if(!c.length)break;
   const s=c[Math.floor(Math.random()*Math.min(c.length,4))],bc=t.bn.filter(i=>t.pl[i]&&inn[i]==null&&t.pl[i].pos!='P'),bb=bc.find(i=>t.pl[i].pos==t.pl[s].pos)??bc[0];if(bb==null)break;
   const lo=Math.max(46,(lastEv[t.pl[s].n]|0)+1);if(lo>86)continue;const m=Math.round(R(lo,86));out[s]=m;inn[bb]=90-m;t.asb.push([s,bb,m])}}
 t.pl.forEach((p,i)=>{let d;if(x.has(i)){p.pj=(p.pj|0)+1;d=f(out[i]??90)}else if(inn[i]!=null){p.pj=(p.pj|0)+1;d=f(inn[i])}else d=-12;
  p.fa=Math.max(0,Math.min(100,Math.round((p.fa|0)+d)))})};
function pois(l){const L=Math.exp(-l);let k=0,p=1;do{k++;p*=Math.random()}while(p>L);return k-1}
function scorers(t,n){const x=xi(t),sp=slots(t.form),c=typeof tacOf=='function'?tacOf(t):{},ti=c.tk!=null?t.lu.indexOf(c.tk):-1,
 W=f=>x.map((p,i)=>(f[sp[i]]||0)*ef(p)/70),
 pk=(w,ex)=>{const v=w.map((q,i)=>i==ex?0:q),T=v.reduce((a,b)=>a+b,0);let r=Math.random()*T,j=0;while(j<v.length-1&&r>v[j]){r-=v[j];j++}return j},
 base=W({F:6.6,M:2.9,D:.65,P:0}),hd=W({F:3.5,M:1,D:2.8,P:0}),as0=W({F:3,M:4,D:1.4,P:.05}),
 pP=.07,pF=.05+(c.sp=='fa'?.05:0),pC=.09+(c.sp=='co'?.06:0),o=[];
 for(let i=0;i<n;i++){const q=Math.random();let ty='n',j,as=null;
  if(q<pP)ty='pe';else if(q<pP+pF)ty='fa';else if(q<pP+pF+pC)ty='co';
  if(ty=='pe'||ty=='fa')j=ti>=0&&sp[ti]!='P'&&Math.random()<.75?ti:pk(base);
  else if(ty=='co'){j=pk(hd,ti);const k=ti>=0&&ti!=j&&Math.random()<.85?ti:pk(as0,j);if(k!=j)as=k}
  else{j=pk(base);if(Math.random()<.72){const k=pk(as0,j);if(k!=j)as=k}}
  x[j].g++;let an=null;if(as!=null){x[as].a=(x[as].a|0)+1;an=x[as].n}
  o.push([x[j].n,Math.floor(R(1,91)),an,ty])}
 return o.sort((a,b)=>a[1]-b[1])}
function cards(t){const x=xi(t),sp=slots(t.form),w=x.map((p,i)=>({D:3.5,M:2.7,F:1.3,P:.3}[sp[i]])),T=w.reduce((a,b)=>a+b,0),n=Math.min(4,pois(1.6)),c={},o=[];
 for(let i=0;i<n;i++){let r=Math.random()*T,j=0;while(j<w.length-1&&r>w[j]){r-=w[j];j++}if((c[j]|0)>=1)continue;c[j]=1;x[j].yc=(x[j].yc|0)+1;o.push([x[j].n,Math.floor(R(3,90))])}return o}
function upd(t,f,c){t.pj++;t.gf+=f;t.gc+=c;if(f>c){t.w++;t.pts+=3}else if(f==c){t.d++;t.pts++}else t.l++}
function simW(){let mine=null;G.wsc=[];G.T.forEach(t=>{if(t.id!=G.me||!t.man)auto(t)});[1,2].forEach(l=>(G.fx[l][G.week]||[]).forEach(([h,a])=>{const H=G.T[h],A=G.T[a],sh=str(H),sa=str(A),hg=pois(Math.max(.25,1.55+(sh.a-sa.d+tacMx(sh,sa)[0])/22)),ag=pois(Math.max(.2,1.1+(sa.a-sh.d+tacMx(sh,sa)[1])/22)),s1=scorers(H,hg),s2=scorers(A,ag),c1=cards(H),c2=cards(A);G.wsc.push([h,a,s1,s2]);if(h==G.me||a==G.me)G.pre={[h]:H.pl.map(p=>p.fa|0),[a]:A.pl.map(p=>p.fa|0)};fat(H,h!=G.me,s1,c1);fat(A,a!=G.me,s2,c2);upd(H,hg,ag);upd(A,ag,hg);const r=[G.week,l,h,a,hg,ag];G.res.push(r);if(h==G.me||a==G.me){mine={r,sc:[...s1.map(s=>[h,...s]),...s2.map(s=>[a,...s])].sort((x,y)=>x[2]-y[2]),cd:[...c1.map(c=>[h,...c]),...c2.map(c=>[a,...c])].sort((x,y)=>x[2]-y[2])};G.last=mine;const d=h==G.me?hg-ag:ag-hg;G.conf=Math.max(0,Math.min(100,G.conf+(d>0?3:d<0?-2:0)));G.fans=Math.max(0,Math.min(100,(G.fans??60)+(d>0?(d>2?4:3):d<0?(d<-2?-4:-3):h==G.me?-1:1)))}}));try{genFeed(G.week)}catch(e){console.error(e)}G.week++;if(G.week>=NW)endSeason();return mine}
function simWeek(){if(G.week>=NW)return;const my=G.T[G.me].lg,mine=simW();if(G.week>=NWL[my]&&G.week<NW)while(G.week>=NWL[my]&&G.week<NW)simW();save();return mine}
const tab=l=>G.T.filter(t=>t.lg==l).sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf);
function setObj(){const me=G.T[G.me],l=me.lg,n=G.T.filter(t=>t.lg==l).length,rk=G.T.filter(t=>t.lg==l).map(t=>str(t).o).sort((a,b)=>b-a).findIndex(o=>o<=str(me).o),q=21*(n-1-rk)/(n-1),k=(n-1)*2/42;
 G.obj=[{t:'pos',v:l==1?Math.min(n-REL,rk+4):(rk<4?3:Math.min(16,rk+4))},{t:'gf',v:Math.round((36+q*.9)*k)},{t:'w',v:Math.round((10+q*.45)*k)}];G.objLg=l;G.objN=n}
const myPos=()=>tab(G.T[G.me].lg).findIndex(t=>t.id==G.me)+1;
function objVal(o){const me=G.T[G.me];return o.t=='pos'?myPos():o.t=='gf'?me.gf:me.w}
const objOk=o=>o.t=='pos'?objVal(o)<=o.v:objVal(o)>=o.v;
function objTxt(o){return o.t=='pos'?(G.objLg==1&&o.v>=G.objN-REL?'Evitar el descenso':G.objLg==2&&o.v<=3?'Lograr el ascenso (top 3)':'Terminar entre los '+o.v+' primeros'):o.t=='gf'?'Marcar al menos '+o.v+' goles':'Ganar al menos '+o.v+' partidos'}
function endSeason(){try{ccFinish()}catch(e){console.error(e)}const t1=tab(1),t2=tab(2),me=G.T[G.me],pos=myPos(),met=G.obj.filter(objOk).length,rel=t1.slice(-REL),pro=t2.slice(0,PRO);
 G.conf=Math.max(0,Math.min(100,G.conf+(met>=2?15:met==1?0:-20)));G.fans=Math.max(0,Math.min(100,(G.fans??60)+(met>=2?8:met==1?0:-8)));
 G.sum={season:G.season,champ:t1[0].n,pro:pro.map(t=>t.n),rel:rel.map(t=>t.n),pos,lg:me.lg,met,tot:G.obj.length,fired:G.conf<=0,cc:ccChamp(),sc:G.T.filter(t=>t.lg==me.lg).flatMap(t=>t.pl.map(p=>[p.n,t.n,lgG(p)])).sort((a,b)=>b[2]-a[2])[0]};
 rel.forEach(t=>t.lg=2);pro.forEach(t=>t.lg=1);
 G.T.forEach(t=>t.pl.forEach(p=>{p.age++;p.ovr=Math.round(p.age<=24?Math.min(p.pot,p.ovr+R(0,4)):p.age>31?p.ovr-R(0,3):p.ovr+R(-1.5,1.5));p.pot=Math.max(p.pot,p.ovr)}));
 G.season++;startSeason();try{feedSeason(G.sum)}catch(e){console.error(e)}G.pend=1}
/* UI */
const E=(s,o)=>{const e=document.createElement('div');e.innerHTML=s;return e};
function stTeams(l){return D.map((t,i)=>({i,t})).filter(x=>x.t.l==l).map(x=>({i:x.i,n:x.t.n,c:x.t.c,o:Math.round(av(x.t.p.map(p=>({ovr:p[4]})).sort((a,b)=>b.ovr-a.ovr).slice(0,14)))})).sort((a,b)=>b.o-a.o)}
function renderStart(){const s=S.sel,sv=load();document.body.dataset.lg=s.lg;$('#stc').innerHTML=`<h1>Club Manager <span>27</span></h1><p class="mu">Elige liga y club. Lleva a tu equipo a lo más alto de las ligas Superstar.</p>
${sv?`<div class="pn"><b>Partida guardada:</b> ${sv.mgr} · ${sv.T[sv.me].n} · temporada ${sv.season}, jornada ${sv.week}/${NWL[sv.T[sv.me].lg]} <button class="p" id="co" style="margin-left:8px">Continuar</button></div>`:''}
<div class="pn"><label>Nombre del entrenador<br><input id="mg" value="${sv?sv.mgr:''}" placeholder="Tu nombre" maxlength="24"></label>
<p class="seg" style="margin:14px 0 4px"><button data-l="1" class="${s.lg==1?'on':''}">${lgl(1,40)}<span>${LGN[1]}</span></button><button data-l="2" class="${s.lg==2?'on':''}">${lgl(2,40)}<span>${LGN[2]}</span></button></p>
<div class="tl">${stTeams(s.lg).map(t=>`<button data-t="${t.i}" class="${s.t===t.i?'on':''}"><span class="tn">${crest(t.i,36)}<span>${t.n}<br><span class="mu sm">${t.c}</span></span></span><b class="cn" style="font-size:22px">${t.o}</b></button>`).join('')}</div>
<button class="p" id="go" ${s.t===null?'disabled':''}>Empezar partida</button></div>`;
 document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{s.lg=+b.dataset.l;s.t=null;renderStart()});
 document.querySelectorAll('.tl button').forEach(b=>b.onclick=()=>{s.t=+b.dataset.t;renderStart()});
 $('#go').onclick=()=>{newGame($('#mg').value.trim()||'Míster',s.t);enter()};if(sv)$('#co').onclick=()=>{G=sv;fixPos();enter()}}
function enter(){fdInit();$('#st').style.display='none';$('#ap').style.display='block';render();if(G.pend)season()}
function render(){const me=G.T[G.me],p=Math.round(G.conf);$('#hc').innerHTML=crest(G.me,40)+'<span>'+me.n+'</span>';document.body.dataset.lg=me.lg;$('#hs').innerHTML=`${lgl(me.lg,52)}<span><b class="hln">${LGN[me.lg]}</b><br>Temporada ${G.season} · Jornada ${Math.min(G.week+1,NWL[me.lg])}/${NWL[me.lg]}</span>`;
 $('#nv').innerHTML=[['home','Inicio'],['soc','Redes'],['tab','Clasificación'],['sq','Plantilla'],['obj','Oficina']].map(([k,l])=>`<button data-k="${k}" class="${S.tab==k?'on':''}">${l}${k=='soc'&&S.tab!='soc'&&G.fs>(G.seen|0)?`<span class="bd">${Math.min(99,G.fs-(G.seen|0))}</span>`:''}</button>`).join('');
 document.querySelectorAll('#nv button').forEach(b=>b.onclick=()=>{S.tab=b.dataset.k;if(S.tab!='soc')S.socOpen=false;if(S.tab=='obj')S.of=null;if(S.tab=='sq')S.sq=null;render();scrollTo(0,0)});
 $('#mn').innerHTML=V[S.tab]();bind()}
const sc=(h,a)=>`<div class="sc">${h} - ${a}</div>`;
const nxt=()=>G.fx[G.T[G.me].lg][G.week].find(m=>m.includes(G.me));
const V={
home(){const ccm=ccNext(),m=ccm?ccm.m:nxt(),me=G.T[G.me],o=m[0]==G.me?m[1]:m[0];
 const nx=`<div class="pn nx${ccm?' cc':''}"><div class="nxh">${lgl(ccm?3:me.lg,30)}<h3>${ccm?'Champions Cup':'Próximo partido'}</h3><span class="mu sm">${ccm?ccm.lbl:'Jornada '+(G.week+1)}</span></div><div class="nxv"><div class="nxt">${crest(G.me,96)}<b>${me.n}</b>${form5(G.me)}<span class="mu sm">Media ${Math.round(str(me).o)}</span></div><div class="nxm"><span class="cn">VS</span><small>${ccm&&ccm.neu?'Campo neutral':m[0]==G.me?'En casa':'Fuera'}</small></div><div class="nxt"><span class="rvc" data-rv="${o}" role="button" tabindex="0" title="Ver alineación de ${nm(o)}">${crest(o,96)}</span><b>${nm(o)}</b>${form5(o)}<span class="mu sm">Media ${Math.round(str(G.T[o]).o)}</span></div></div><button class="p nxb" id="bs">⚽ Jugar partido</button></div>`;
 return `<div class="hm"><div class="side">${nx}</div>${feedHome()}</div>`},
soc(){return feedFull()},
cal(){const me=G.T[G.me],rows=G.fx[me.lg].map((r,w)=>{const m=r.find(x=>x.includes(G.me)),x=G.res.find(z=>z[0]==w&&(z[2]==G.me||z[3]==G.me)),h=m[0]==G.me,o=h?m[1]:m[0];let c='';if(x){const d=h?x[4]-x[5]:x[5]-x[4];c=d>0?'ok':d<0?'ko':''}return `<tr class="${w==G.week?'me':''}"><td>${w+1}</td><td>${h?'Casa':'Fuera'}</td><td><span class="tn">${crest(o,22)}${nm(o)}</span></td><td class="n ${c}"><b>${x?x[4]+' - '+x[5]:'—'}</b></td></tr>`}).join('');return `<div class="pn sx"><table><tr><th>J</th><th></th><th>Rival</th><th class="n">Resultado</th></tr>${rows}</table></div>`},
tab(){const l=S.lg;if(l==3)return ccSeg(3)+ccView();const t=tab(l),n=t.length;return `${ccSeg(l)}<div class="lgbn">${lgl(l,64)}<div><h2>${LGN[l]}</h2><span class="mu sm">Temporada ${G.season} · Jornada ${Math.min(G.week,NWL[l])}/${NWL[l]}</span></div></div><div class="pn sx lgt${S.tx?' open':''}"><table><tr><th>#</th><th>Equipo</th><th class="n">PJ</th><th class="n xc">G</th><th class="n xc">E</th><th class="n xc">P</th><th class="n xc">GF</th><th class="n xc">GC</th><th class="n">DG</th><th class="n">Pts</th></tr>${t.map((x,i)=>`<tr class="${x.id==G.me?'me':''}"><td class="${l==1&&i==0?'z1':l==1&&i>=n-REL?'z3':l==2&&i<PRO?'z2':''}">${i+1}</td><td><span class="tn">${crest(x.id,22)}<span class="tnm">${x.n}</span></span></td><td class="n">${x.pj}</td><td class="n xc">${x.w}</td><td class="n xc">${x.d}</td><td class="n xc">${x.l}</td><td class="n xc">${x.gf}</td><td class="n xc">${x.gc}</td><td class="n">${x.gf-x.gc}</td><td class="n"><b>${x.pts}</b></td></tr>`).join('')}</table></div><p class="sm mu">👆 Toca la tabla para ${S.tx?'verla simplificada':'ver todas las columnas'}.</p><p class="sm mu">${l==1?'Dorado: campeón · Rojo: descienden '+REL:'Verde: ascienden '+PRO+' · No hay descensos'}</p>`},
sq(){return sqm()},
obj(){const k=S.of;return k?back('o','Oficina',OFS.find(x=>x[0]==k)[1])+OV[k]():hubOf()}};
const OFS=[['obj','Objetivos'],['est','Club'],['gol','Estadísticas'],['cal','Calendario']];
const OV={
obj(){return `<div class="pn"><h3>Objetivos de la directiva · Temporada ${G.season}</h3>${G.obj.map(o=>`<div style="margin:12px 0"><div style="display:flex;justify-content:space-between"><span>${objTxt(o)}</span><b class="${objOk(o)?'ok':'mu'}">${o.t=='pos'?myPos()+'º':objVal(o)+' / '+o.v}</b></div></div>`).join('')}<p class="sm mu">Cumplir 2 o más objetivos sube la confianza; si llega a 0% te despiden.</p></div><div class="pn"><h3>Reglas de las ligas</h3><p class="sm">${LGN[1]}: gana 1 campeón y descienden ${REL}.<br>${LGN[2]}: ascienden ${PRO}, sin descensos.</p></div>`},
est(){const me=G.T[G.me],l=G.last,cf=Math.round(G.conf),fn=Math.round(G.fans??60),tn=v=>v<30?'bad':v<55?'mid':'good',fa=Math.round(xi(me).reduce((s,p)=>s+(p.fa|0),0)/11),rb=l?(l.r[2]==G.me?l.r[4]-l.r[5]:l.r[5]-l.r[4]):0,rl=rb>0?'v':rb<0?'d':'e';
 return `<div class="g2"><div class="pn es"><h3>Último resultado</h3>${l?`<div class="lr"><span class="tn"><span class="rb ${rl}">${rl.toUpperCase()}</span>${crest(l.r[2],22)}<small>${nm(l.r[2])}</small></span><b class="rs">${l.r[4]} - ${l.r[5]}</b><span class="tn r"><small>${nm(l.r[3])}</small>${crest(l.r[3],22)}</span></div><p class="gl mu">${l.cl||'J'+(l.r[0]+1)}${l.sc.length?' · ⚽ '+l.sc.map(s=>s[1]+' '+s[2]+"'"+(s[3]?' (as. '+s[3]+')':'')).join(' · '):' · Sin goles'}</p>`:'<p class="mu sm">Todavía no has jugado. Pulsa «Jugar partido».</p>'}<h3 style="margin-top:12px">Forma</h3>${form5(G.me)}</div>
 <div class="pn es"><h3>Estado del club</h3><div class="mt"><span>Directiva</span><div class="bar"><i class="${tn(cf)}" style="width:${cf}%"></i></div><b>${cf}%</b></div><div class="mt"><span>Afición</span><div class="bar"><i class="${tn(fn)}" style="width:${fn}%"></i></div><b>${fn}%</b></div><div class="mt"><span>Fatiga</span><div class="bar"><i class="${tn(100-fa)}" style="width:${fa}%"></i></div><b>${fa}%</b></div><p class="sm mu">${myPos()}º en ${LGN[me.lg]} · ${me.w}V ${me.d}E ${me.l}D · ${me.gf} GF / ${me.gc} GC</p></div></div>`},
gol(){const me=G.T[G.me],l=me.lg,pl=G.T.filter(t=>t.lg==l).flatMap(t=>t.pl.map(p=>({p,t}))),
 lst=f=>`<table>${pl.filter(x=>f(x.p)>0).sort((a,b)=>f(b.p)-f(a.p)).slice(0,10).map((x,i)=>`<tr class="${x.t.id==G.me?'me':''}"><td class="n mu">${i+1}</td><td>${x.p.n}</td><td><span class="tn">${crest(x.t.id,18)}<span class="mu sm">${x.t.n}</span></span></td><td class="n"><b>${f(x.p)}</b></td></tr>`).join('')||'<tr><td class="mu">Sin datos todavía</td></tr>'}</table>`;
 return `<div class="lgbn">${lgl(l,64)}<div><h2>${LGN[l]}</h2><span class="mu sm">Estadísticas de la temporada ${G.season}</span></div></div><div class="g2"><div class="pn sx"><h3>⚽ Goleadores</h3>${lst(lgG)}</div><div class="pn sx"><h3>🅰️ Asistentes</h3>${lst(lgA)}</div></div><div class="pn sx"><h3>🟨 Más amarillas</h3>${lst(p=>p.yc|0)}</div>`},
cal(){return V.cal()}};
function bind(){document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{S.lg=+b.dataset.l;render()});document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{const[k,v]=b.dataset.nav.split(':');if(k=='o')S.of=v||null;else S.sq=v||null;S.pk=null;render();scrollTo(0,0)});document.querySelectorAll('[data-s]').forEach(h=>h.onclick=()=>{const k=h.dataset.s;if(S.ps==k)S.pd=-(S.pd||1);else{S.ps=k;S.pd=k=='n'||k=='pos'?1:-1}render()});if(S.tab=='sq'&&S.sq=='ali')sqBind();fdBind();document.querySelectorAll('[data-rv]').forEach(e=>e.onclick=()=>rivalView(+e.dataset.rv,{pre:1}));const pb=$('#bs');if(pb)pb.onclick=playMatch;const lt=$('.lgt');if(lt)lt.onclick=()=>{S.tx=!S.tx;render()}}
const SQM=[['ali','Alineación'],['jug','Jugadores']];
function sqm(){const k=S.sq;return k?back('q','Plantilla',SQM.find(x=>x[0]==k)[1])+(k=='ali'?sqv():plv()):hubSq()}
const back=(k,root,label)=>`<div class="bkr"><button class="bk" data-nav="${k}:">← ${root}</button><h2>${label}</h2></div>`;
const hcd=(nav,k,ico,t,sub,big,lb)=>`<button class="hcd k-${k}" data-nav="${nav}"><span class="gh">${ico}</span><span class="hx"><small>${lb}</small><b class="hbg">${big}</b><h3>${t}</h3><span class="hsb">${sub}</span></span><span class="hgo">›</span></button>`;
function hubSq(){const t=G.T[G.me],x=xi(t),fa=Math.round(x.reduce((s,p)=>s+(p.fa|0),0)/11),tp=t.pl.slice().sort((a,b)=>(b.g|0)-(a.g|0))[0];
 return `<div class="hub">${hcd('q:ali','ali','📋','Alineación',`Media del once ${Math.round(str(t).o)} · Cansancio ${fa}%`,t.form,'Formación')}${hcd('q:jug','jug','👥','Jugadores',tp&&(tp.g|0)>0?`Máximo goleador: ${tp.n} (${tp.g})`:'Toda la plantilla, ordénala como quieras',t.pl.length,'Plantilla')}</div>`}
function hubOf(){const me=G.T[G.me],l=me.lg,met=G.obj.filter(objOk).length,pl=G.T.filter(t=>t.lg==l).flatMap(t=>t.pl.map(p=>({p,t}))).sort((a,b)=>lgG(b.p)-lgG(a.p))[0],m=nxt(),o=m[0]==G.me?m[1]:m[0],hg=pl&&lgG(pl.p)>0;
 return `<div class="hub">${hcd('o:obj','obj','🎯','Objetivos',objTxt(G.obj[0]),met+'/'+G.obj.length,'Directiva')}${hcd('o:est','est','🏟️','Club',`Afición ${Math.round(G.fans??60)}% · ${myPos()}º en ${LGN[l]}`,Math.round(G.conf)+'%','Confianza')}${hcd('o:gol','gol','📊','Estadísticas',hg?`Pichichi: ${pl.p.n} (${pl.t.n})`:'Goleadores, asistentes y tarjetas',hg?lgG(pl.p)+' goles':'—','Liga')}${hcd('o:cal','cal','📅','Calendario',`Próximo: ${m[0]==G.me?'en casa ante':'fuera ante'} ${nm(o)}`,'J'+(G.week+1),'Jornada')}</div>`}
function plv(){const t=G.T[G.me],o='PDMF',val={pos:p=>o.indexOf(p.pos),n:p=>p.n,pj:p=>p.pj|0,g:p=>p.g|0,a:p=>p.a|0},ks=val[S.ps]?S.ps:'pos',dr=S.pd||1,
 rows=t.pl.slice().sort((a,b)=>{const va=val[ks](a),vb=val[ks](b),c=typeof va=='string'?va.localeCompare(vb):va-vb;return c*dr||o.indexOf(a.pos)-o.indexOf(b.pos)||b.ovr-a.ovr||a.n.localeCompare(b.n)}),
 th=(k,l,c)=>`<th class="${c}${ks==k?' on':''}" data-s="${k}">${l}${ks==k?(dr>0?' ▲':' ▼'):''}</th>`;
 return `<div class="pn ptb"><table class="plt"><thead><tr>${th('pos','Posición','')}${th('n','Nombre','')}${th('pj','Jug.','n')}${th('g','Goles','n')}${th('a','Asist.','n')}</tr></thead><tbody>${rows.map(p=>`<tr><td class="ppo ${p.pos}">${PL(p)}</td><td class="nm">${p.n}</td><td class="n">${p.pj|0}</td><td class="n">${p.g|0}</td><td class="n">${p.a|0}</td></tr>`).join('')}</tbody></table></div><p class="sm mu">Toca la leyenda de arriba para ordenar (otra vez para invertir). Las estadísticas se reinician cada temporada.</p>`}
function sqv(){const t=G.T[G.me];xi(t);const sp=slots(t.form),fsp=fslots(t.form),inb=new Set(t.bn),inx=new Set(t.lu),ln=p=>p.n.split(' ').slice(1).join(' ')||p.n;
 const fb=p=>{const f=p.fa|0;return `<i class="fb" title="Cansancio ${f}%"><u class="${f>66?'hi':f>33?'md':'lo'}" style="width:${Math.max(6,f)}%"></u></i>`};
 const card=i=>{const p=t.pl[t.lu[i]];return `<div class="sl fit${S.pk=='x:'+i?' pk':''}" style="--fc:${FC(p,fsp[i])};${ROY(fsp[i])}" draggable="true" data-l="x:${i}"><span class="ps slp ${FGR(fsp[i])}">${fsp[i]}</span><span class="ov">${Math.round(ef(p))}</span><b>${ln(p)}</b>${fb(p)}</div>`};
 const row=(i,l)=>{const p=t.pl[i];return `<div class="pr${S.pk==l?' pk':''}" draggable="true" data-l="${l}"><span class="ps ${p.pos}">${PL(p)}</span><span class="pnm">${p.n}</span><span class="mu sm">${p.age}a</span><b>${Math.round(ef(p))}</b>${fb(p)}</div>`};
 const rs=t.pl.map((p,i)=>i).filter(i=>!inx.has(i)&&!inb.has(i)).sort((a,b)=>'PDMF'.indexOf(t.pl[a].pos)-'PDMF'.indexOf(t.pl[b].pos)||t.pl[b].ovr-t.pl[a].ovr);
 return `${fmPick(t)}<div class="pn sqh"><button id="au" class="${t.man?'':'p'}">Auto</button><span class="mu sm">Media del once <b>${Math.round(str(t).o)}</b> · Arrastra o toca dos jugadores para intercambiarlos · Barra = cansancio (verde fresco, rojo agotado): los cansados rinden menos · Rojo = fuera de posición</span></div>
<div class="g2 sq"><div class="pn pit">${['F','M','D','P'].map(c=>`<div class="rw">${sp.map((s,i)=>s==c?card(i):'').join('')}</div>`).join('')}</div><div><div class="pn zn" data-z="b"><h3>Banquillo <small>${t.bn.length}/7</small></h3>${t.bn.map((i,j)=>row(i,'b:'+j)).join('')||'<p class="mu sm">Arrastra aquí jugadores</p>'}</div><div class="pn zn" data-z="r"><h3>Reservas</h3>${rs.map(i=>row(i,'r:'+i)).join('')}</div></div></div>`}
const gl=(t,l)=>{const [k,v]=l.split(':'),n=+v;return k=='x'?t.lu[n]:k=='b'?t.bn[n]:n},sl=(t,l,val)=>{const [k,v]=l.split(':'),n=+v;if(k=='x')t.lu[n]=val;else if(k=='b')t.bn[n]=val};
function mv(a,b){const t=G.T[G.me];if(!a||!b||a==b)return;const va=gl(t,a),vb=gl(t,b);sl(t,a,vb);sl(t,b,va);t.man=true;save()}
function zone(a,z){const t=G.T[G.me],[k,v]=a.split(':'),n=+v;if(z=='b'&&k=='r'&&t.bn.length<7)t.bn.push(n);else if(z=='r'&&k=='b')t.bn.splice(n,1);else return;t.man=true;save()}
function sqBind(){document.querySelectorAll('[data-l^="x:"],[data-l^="b:"],[data-l^="r:"]').forEach(e=>{const l=e.dataset.l;
 e.onclick=()=>{if(S.pk&&S.pk!=l){mv(S.pk,l);S.pk=null}else S.pk=S.pk==l?null:l;render()};
 e.ondragstart=ev=>{ev.dataTransfer.setData('text/plain',l);S.pk=null};e.ondragover=ev=>ev.preventDefault();
 e.ondrop=ev=>{ev.preventDefault();ev.stopPropagation();mv(ev.dataTransfer.getData('text/plain'),l);render()}});
 document.querySelectorAll('[data-z]').forEach(e=>{e.ondragover=ev=>ev.preventDefault();e.ondrop=ev=>{ev.preventDefault();zone(ev.dataTransfer.getData('text/plain'),e.dataset.z);render()};e.onclick=ev=>{if(ev.target==e&&S.pk){zone(S.pk,e.dataset.z);S.pk=null;render()}}});
 document.querySelectorAll('[data-fm]').forEach(b=>b.onclick=()=>{const t=G.T[G.me];t.form=b.dataset.fm;auto(t);S.pk=null;S.fmo=false;save();render()});document.querySelectorAll('[data-fmo]').forEach(b=>b.onclick=()=>{S.fmo=!S.fmo;render()});
 $('#au').onclick=()=>{const t=G.T[G.me];t.man=false;auto(t);S.pk=null;save();render()}}
/* Alineación del rival (solo lectura, mismo estilo que la tuya). Se abre al pulsar su escudo en Inicio o en el partido.
   o.pre: antes del partido, recalcula el once probable con el cansancio actual (igual que hará la simulación); o.fa(p,i): cansancio a mostrar (en directo); o.onClose: al cerrar con la cruz. */
function rivalView(id,o){o=o||{};const t=G.T[id];if(o.pre&&id!=G.me)auto(t);xi(t);const lu=o.lu||t.lu,bn=o.bn||t.bn,old=$('#rvw');if(old)old.remove();
 const fsp=fslots(t.form),ln=p=>p.n.split(' ').slice(1).join(' ')||p.n,sp=slots(t.form),
 V=t.pl.map((p,i)=>o.fa?{...p,fa:o.fa(p,i)}:p),
 fb=p=>{const f=p.fa|0;return `<i class="fb" title="Cansancio ${f}%"><u class="${f>66?'hi':f>33?'md':'lo'}" style="width:${Math.max(6,f)}%"></u></i>`},
 xs=lu.map(i=>V[i]),me=Math.round(mean(xs.map((p,i)=>rt(p,fsp[i])))),fa=Math.round(xs.reduce((s,p)=>s+(p.fa|0),0)/11),
 card=i=>{const p=V[lu[i]];return `<div class="sl fit" style="--fc:${FC(p,fsp[i])};${ROY(fsp[i])}">${o.bd?`<div class="bds">${o.bd(p)}</div>`:''}<span class="ps slp ${FGR(fsp[i])}">${fsp[i]}</span><span class="ov">${Math.round(ef(p))}</span><b>${ln(p)}</b>${fb(p)}</div>`},
 row=i=>{const p=V[i],ou=o.out&&o.out.has(i);return `<div class="pr${ou?' outt':''}"><span class="ps ${p.pos}">${PL(p)}</span><span class="pnm">${p.n}${ou?' <em>sale</em>':''}</span>${o.bd?`<span class="bdr">${o.bd(p)}</span>`:''}<span class="mu sm">${p.age}a</span><b>${Math.round(ef(p))}</b>${fb(p)}</div>`},
 d=document.createElement('div');d.id='rvw';
 d.innerHTML=`<div class="rvb"><div class="rvh">${crest(id,48)}<div><h3>${t.n}</h3><span class="mu sm">${t.form} · Media del once <b>${me}</b> · Cansancio <b>${fa}%</b></span></div><button class="rvx" aria-label="Cerrar">✕</button></div>
<p class="mu sm" style="margin:0">Barra = cansancio (verde fresco, rojo agotado) · Rojo en la ficha = fuera de posición</p>
<div class="pn pit">${['F','M','D','P'].map(c=>`<div class="rw">${sp.map((s,i)=>s==c?card(i):'').join('')}</div>`).join('')}</div>
<div class="pn zn"><h3>Banquillo <small>${bn.length}</small></h3>${bn.map(row).join('')||'<p class="mu sm">Sin suplentes</p>'}</div></div>`;
 document.body.appendChild(d);
 const cl=()=>{d.remove();if(o.onClose)o.onClose()};d.querySelector('.rvx').onclick=cl;d.onclick=e=>{if(e.target==d)cl()}}
function modal(h){$('#mdc').innerHTML=h+'<p style="margin:16px 0 0"><button class="p" id="ok">Continuar</button></p>';$('#md').style.display='flex';$('#ok').onclick=()=>{$('#md').style.display='none';if(G.pend){G.pend=0;save()}}}
function season(){const s=G.sum;modal(`<h2>Fin de temporada ${s.season}</h2><p>Campeón de ${LGN[1]}: <b>${s.champ}</b></p>${s.cc?`<p>Campeón de la <b>Champions Cup</b>: <b>${s.cc}</b></p>`:''}<p>Tu equipo terminó <b>${s.pos}º</b> en ${LGN[s.lg]} y cumplió <b>${s.met}/${s.tot}</b> objetivos.</p><p class="sm">Ascienden: ${s.pro.join(', ')}<br>Descienden: ${s.rel.join(', ')}</p>${s.sc?`<p class="sm">Pichichi de tu liga: ${s.sc[0]} (${s.sc[1]}), ${s.sc[2]} goles</p>`:''}${s.fired?'<p class="ko"><b>La directiva te ha despedido.</b> Empieza una nueva partida.</p>':'<p class="sm mu">Los jugadores han envejecido un año y la nueva temporada está lista.</p>'}`);
 if(s.fired)$('#ok').onclick=()=>{try{localStorage.removeItem(KEY)}catch(e){}location.reload()}}
function playMatch(){const fin=()=>{render();if(G.pend)season()},c=ccPlayNext();
 if(c){bcIntro(c,()=>liveMatch(c,()=>{const h=ccAfter(c);fin();if(h)modal(h)}));return}
 const m=simWeek();if(m)bcIntro(m,()=>liveMatch(m,fin));else fin()}
renderStart();
