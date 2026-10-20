/* ===================== CHAMPIONS CUP =====================
   Competición que reúne a los 44 equipos (Liga Superstar One + Liga Superstar 2).
   Formato (estilo Champions League 2019):
   · Ronda previa: los 24 de la Superstar 2 se emparejan, ida y vuelta -> pasan 12.
   · Fase de grupos: 20 de la Superstar One + 12 de la previa = 32 equipos, 8 grupos de 4, ida y vuelta (6 jornadas). Pasan 2 por grupo.
   · Octavos (1º de grupo vs 2º de otro grupo), cuartos y semifinales a ida y vuelta (gol fuera de casa), final a partido único en campo neutral.
   Las jornadas se intercalan con las de liga (G.week). Requiere: game.js, match.js. Logo: img/CC.png */
LGN[3]='Champions Cup';
const lgG=p=>(p.g|0)-(p.cg|0),lgA=p=>(p.a|0)-(p.ca|0);/* estadísticas SOLO de liga (p.g y p.a incluyen también la Champions Cup) */
const CCST={po:'Ronda previa',gr:'Fase de grupos',r16:'Octavos',qf:'Cuartos',sf:'Semifinales',fi:'Final'},CCL='ABCDEFGH';
/* calendario: 15 jornadas; 'an' = se juega justo ANTES de la jornada de liga número an+1 */
const CCS=[];(()=>{const A=[2,5,8,11,14,17,20,23,25,27,29,31,33,35,37],add=(st,leg,md,lb)=>CCS.push({k:CCS.length,st,leg,md,an:A[CCS.length],lb});
 add('po',0,0,'Ronda previa · Ida');add('po',1,0,'Ronda previa · Vuelta');
 for(let j=0;j<6;j++)add('gr',0,j,'Fase de grupos · Jornada '+(j+1));
 [['r16','Octavos'],['qf','Cuartos'],['sf','Semifinales']].forEach(([s,n])=>{add(s,0,0,n+' · Ida');add(s,1,0,n+' · Vuelta')});
 add('fi',0,0,'Final')})();
let ccBk=null;
const ccShuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const ccTie=(a,b,n=2)=>({a,b,l:Array(n).fill(null),w:null,pen:null,ag:null});
function ccBuild(){const l2=ccShuf(ids(2)),po=[];for(let i=0;i+1<l2.length;i+=2)po.push(ccTie(l2[i],l2[i+1]));return{k:0,po,gr:null,ko:{},res:[],w:null}}
function ccEns(){if(!G.cc)G.cc=G.week>0?{skip:1}:ccBuild();return G.cc}/* partidas antiguas a media temporada: la Champions Cup empieza la temporada siguiente */
/* ---- sorteos ---- */
function ccDraw(pots,strict){const gr=Array.from({length:8},()=>[]);
 for(const pot of pots){const free=ccShuf([0,1,2,3,4,5,6,7]);
  for(const t of ccShuf(pot)){const ok=free.filter(g=>!strict||!gr[g].some(x=>G.T[x].c==G.T[t].c));if(!ok.length)return null;const g=ok[0];gr[g].push(t);free.splice(free.indexOf(g),1)}}
 return gr}/* bombos por media; en un grupo no coinciden equipos del mismo país si es posible */
function ccGrInit(){const c=G.cc;if(c.gr)return;
 const q=ids(1).concat(c.po.map(t=>t.w)),so=q.map(i=>({i,o:str(G.T[i]).o})).sort((x,y)=>y.o-x.o).map(x=>x.i),pots=[0,1,2,3].map(p=>so.slice(p*8,p*8+8));
 let gr=null;for(let n=0;n<500&&!gr;n++)gr=ccDraw(pots,true);if(!gr)gr=ccDraw(pots,false);
 c.gr={g:gr,fx:gr.map(t=>rounds(t))};
 try{ccPost('marca',`🏆 Sorteo de la Champions Cup: ya están los 8 grupos de la fase de grupos. ${G.T[G.me].n} jugará en el grupo ${CCL[gr.findIndex(g=>g.includes(G.me))]||'—'}.`,{top:1})}catch(e){}}
function ccGT(g){const c=G.cc,t={};c.gr.g[g].forEach(i=>t[i]={id:i,pj:0,w:0,d:0,l:0,gf:0,gc:0,pts:0});
 c.res.filter(r=>r.st=='gr'&&r.g==g).forEach(r=>[[r.h,r.hg,r.ag],[r.a,r.ag,r.hg]].forEach(([i,f,e])=>{const x=t[i];x.pj++;x.gf+=f;x.gc+=e;if(f>e){x.w++;x.pts+=3}else if(f==e){x.d++;x.pts++}else x.l++}));
 return Object.values(t).sort((x,y)=>y.pts-x.pts||(y.gf-y.gc)-(x.gf-x.gc)||y.gf-x.gf||x.id-y.id)}
function ccTies(st){const c=G.cc;if(c.ko[st])return c.ko[st];let T=[];
 if(st=='r16'){const W=[],Q=[];for(let g=0;g<8;g++){const t=ccGT(g);W.push([t[0].id,g]);Q.push([t[1].id,g])}
  let q=Q;for(let n=0;n<500;n++){q=ccShuf(Q);if(q.every((x,i)=>x[1]!=W[i][1]))break}/* 1º de grupo vs 2º de OTRO grupo; la ida se juega en casa del 2º */
  T=W.map((w,i)=>ccTie(q[i][0],w[0]))}
 else{const prev={qf:'r16',sf:'qf',fi:'sf'}[st],ws=ccShuf(ccTies(prev).map(t=>t.w));for(let i=0;i+1<ws.length;i+=2)T.push(ccTie(ws[i],ws[i+1],st=='fi'?1:2))}
 c.ko[st]=T;return T}
function ccFix(k){const c=G.cc,s=CCS[k];
 if(s.st=='gr'){ccGrInit();return c.gr.fx.flatMap((f,g)=>f[s.md].map(([h,a])=>[h,a,g]))}
 return(s.st=='po'?c.po:ccTies(s.st)).map(t=>s.leg?[t.b,t.a]:[t.a,t.b])}
/* ---- simulación ---- */
function ccPlay(h,a,neu,keep){const H=G.T[h],A=G.T[a];[H,A].forEach(t=>{if(t.id!=G.me||!t.man)auto(t)});
 const sh=str(H),sa=str(A),tx=typeof tacMx=='function'?tacMx(sh,sa):[0,0],hb=neu?1.325:1.55,ab=neu?1.325:1.1,
 hg=pois(Math.max(.25,hb+(sh.a-sa.d+tx[0])/22)),ag=pois(Math.max(.2,ab+(sa.a-sh.d+tx[1])/22)),s1=scorers(H,hg),s2=scorers(A,ag),c1=cards(H),c2=cards(A);
 [[H,s1],[A,s2]].forEach(([t,s])=>s.forEach(x=>{const p=t.pl.find(z=>z.n==x[0]);if(p)p.cg=(p.cg|0)+1;if(x[2]){const q=t.pl.find(z=>z.n==x[2]);if(q)q.ca=(q.ca|0)+1}}));
 if(keep){G.wsc.push([h,a,s1,s2]);G.pre={[h]:H.pl.map(p=>p.fa|0),[a]:A.pl.map(p=>p.fa|0)}}
 fat(H,h!=G.me,s1,c1);fat(A,a!=G.me,s2,c2);return{hg,ag,s1,s2,c1,c2}}
function ccResolve(t){if(t.w!=null||t.l.some(x=>!x))return;const ga=t.l.reduce((s,x)=>s+x[0],0),gb=t.l.reduce((s,x)=>s+x[1],0);t.ag=[ga,gb];let w=ga>gb?t.a:gb>ga?t.b:null;
 if(w==null&&t.l.length==2){const aa=t.l[1][0],ab=t.l[0][1];if(aa>ab)w=t.a;else if(ab>aa)w=t.b;t.fo=w!=null?1:0}/* gol fuera de casa (como en 2019) */
 if(w==null){const d=str(G.T[t.a]).o-str(G.T[t.b]).o,p=.5+Math.max(-.08,Math.min(.08,d/200));w=Math.random()<p?t.a:t.b;/* sin prórroga: directamente penaltis */
  const ww=4+Math.floor(Math.random()*3),wl=ww-1-(Math.random()<.35?1:0);t.pen=w==t.a?[ww,wl]:[wl,ww]}
 t.w=w}
function ccSimDay(k,live){const c=G.cc,s=CCS[k],fx=ccFix(k),mf=fx.find(f=>f[0]==G.me||f[1]==G.me),rs=[];let mine=null;if(live&&mf)G.wsc=[];
 fx.forEach(([h,a,g])=>{const my=h==G.me||a==G.me,r=ccPlay(h,a,s.st=='fi',live&&my);c.res.push({k,st:s.st,g,h,a,hg:r.hg,ag:r.ag});rs.push({h,a,hg:r.hg,ag:r.ag});
  if(s.st!='gr'){const t=(s.st=='po'?c.po:c.ko[s.st]).find(x=>(x.a==h&&x.b==a)||(x.a==a&&x.b==h));t.l[s.st=='fi'?0:s.leg]=h==t.a?[r.hg,r.ag]:[r.ag,r.hg]}
  if(my){const d=h==G.me?r.hg-r.ag:r.ag-r.hg;G.conf=Math.max(0,Math.min(100,G.conf+(d>0?2:d<0?-1:0)));G.fans=Math.max(0,Math.min(100,(G.fans??60)+(d>0?2:d<0?-2:0)));
   mine={r:[undefined,3,h,a,r.hg,r.ag],cl:s.lb,cc:1,sc:[...r.s1.map(x=>[h,...x]),...r.s2.map(x=>[a,...x])].sort((x,y)=>x[2]-y[2]),cd:[...r.c1.map(x=>[h,...x]),...r.c2.map(x=>[a,...x])].sort((x,y)=>x[2]-y[2])};if(live)G.last=mine}});
 if(s.st!='gr'&&(s.leg||s.st=='fi'))(s.st=='po'?c.po:c.ko[s.st]).forEach(ccResolve);
 if(s.st=='fi')c.w=c.ko.fi[0].w;c.k=k+1;ccNews(k,mine,rs);return mine}
/* partidos que tocan antes de la jornada de liga actual: los que no juega tu equipo se simulan solos; devuelve la jornada de tu equipo (si la hay) */
function ccDue(){const c=ccEns();if(c.skip)return null;let ch=0;
 while(c.k<CCS.length&&CCS[c.k].an<=G.week){const fx=ccFix(c.k);if(fx.some(f=>f[0]==G.me||f[1]==G.me)){if(ch)save();return c.k}ccSimDay(c.k,false);ch=1}
 if(ch)save();return null}
function ccNext(){try{const k=ccDue();if(k==null)return null;const f=ccFix(k).find(x=>x[0]==G.me||x[1]==G.me);return{m:[f[0],f[1]],lbl:CCS[k].lb,neu:CCS[k].st=='fi'}}catch(e){console.error(e);return null}}
function ccPlayNext(){try{const k=ccDue();if(k==null)return null;ccBk=G.wsc;const m=ccSimDay(k,true);save();return m}catch(e){console.error(e);return null}}
function ccFinish(){const c=G.cc;if(!c||c.skip)return;while(c.k<CCS.length)ccSimDay(c.k,false)}
const ccChamp=()=>G.cc&&G.cc.w!=null?G.T[G.cc.w].n:null;
/* ---- estado de tu equipo ---- */
function ccPath(){const c=ccEns(),me=G.me;if(c.skip)return{t:'La Champions Cup empieza la próxima temporada.',s:'n'};
 const pt=c.po.find(t=>t.a==me||t.b==me);
 if(pt){if(pt.w==null)return{t:'Ronda previa: eliminatoria en juego.',s:'a'};if(pt.w!=me)return{t:'Eliminado en la ronda previa.',s:'e'}}
 if(c.k>=8)ccTies('r16');
 if(!c.gr)return{t:pt?'Ronda previa superada. Pendiente el sorteo de grupos.':'Entras directamente en la fase de grupos.',s:'a'};
 const gi=c.gr.g.findIndex(g=>g.includes(me));
 if(c.k<8){const t=ccGT(gi),p=t.findIndex(x=>x.id==me)+1;return{t:`Grupo ${CCL[gi]} · vas ${p}º`,s:p<=2?'a':'b'}}
 for(const st of['r16','qf','sf','fi']){const T=c.ko[st];if(!T)break;const t=T.find(x=>x.a==me||x.b==me);
  if(!t)return{t:st=='r16'?'Eliminado en la fase de grupos.':'Eliminado.',s:'e'};
  if(t.w==null)return{t:CCST[st]+': eliminatoria en juego.',s:'a'};if(t.w!=me)return{t:'Eliminado en '+CCST[st].toLowerCase()+'.',s:'e'};
  if(st=='fi')return{t:'🏆 ¡Campeón de la Champions Cup!',s:'w'}}
 return{t:'Clasificado para la siguiente ronda.',s:'a'}}
/* ---- fin del partido: resumen con el resultado de la eliminatoria / grupo ---- */
function ccAfter(m){G.wsc=ccBk;ccBk=null;try{const c=G.cc,s=CCS[c.k-1],me=G.me,[,,h,a,hg,ag]=m.r,P=ccPath();let x='';
 if(s.st=='gr'){const gi=c.gr.g.findIndex(g=>g.includes(me)),t=ccGT(gi),p=t.findIndex(z=>z.id==me)+1;x=`<p>Grupo ${CCL[gi]}: <b>${p}º</b> con ${t[p-1].pts} pts.</p>`}
 else{const t=(s.st=='po'?c.po:c.ko[s.st]).find(z=>z.a==me||z.b==me);
  if(t&&t.w!=null){x=`<p>Global: <b>${nm(t.a)} ${t.ag[0]} - ${t.ag[1]} ${nm(t.b)}</b>${t.pen?`<br>Penaltis: ${t.pen[0]} - ${t.pen[1]}`:t.fo?'<br>Decide el gol fuera de casa':''}</p>`}
  else if(t)x=`<p class="sm mu">La vuelta se juega más adelante.</p>`}
 return `<h2>${lgl(3,34)} Champions Cup</h2><p class="mu sm">${s.lb}</p><p><b>${nm(h)} ${hg} - ${ag} ${nm(a)}</b></p>${x}<p>${P.t}</p>`}catch(e){console.error(e);return null}}
/* ---- noticias en redes ---- */
function ccPost(a,tx,o){if(typeof fdAdd!='function')return;FW=G.week>0?G.week-1:-1;if(!(FT>=0))FT=500;fdAdd(a,tx,o||{})}
function ccNews(k,mine,rs){try{const c=G.cc,s=CCS[k],T=nm;
 if(mine)ccPost('marca',`🏆 Champions Cup · ${s.lb}: ${T(mine.r[2])} ${mine.r[4]}-${mine.r[5]} ${T(mine.r[3])}`,{top:1});
 const b=rs.slice().sort((x,y)=>(y.hg+y.ag+Math.abs(y.hg-y.ag))-(x.hg+x.ag+Math.abs(x.hg-x.ag)))[0];
 if(b&&b.hg+b.ag>=5&&!(mine&&b.h==mine.r[2]&&b.a==mine.r[3]))ccPost('opta',`📐 Champions Cup · ${s.lb}: goleada en ${T(b.h)} ${b.hg}-${b.ag} ${T(b.a)}.`);
 if(k==1)ccPost('marca',`🏆 Termina la ronda previa de la Champions Cup: 12 equipos de la ${LGN[2]} se unen a los 20 de la ${LGN[1]}.`);
 if(k==7){const q=c.gr.g.map((_,g)=>ccGT(g)[0].id);ccPost('marca',`🏆 Fin de la fase de grupos de la Champions Cup. Primeros de grupo: ${q.map(T).join(', ')}.`)}
 if(s.st=='fi')ccPost('marca',`🏆 ¡${T(c.w)} es campeón de la Champions Cup ${G.season}!`,{big:1,top:1})}catch(e){console.error(e)}}
/* ---- pantallas ---- */
const ccSeg=l=>`<p class="seg s3">${[1,2,3].map(i=>`<button data-l="${i}" class="${l==i?'on':''}">${lgl(i,i==3?44:40)}<span>${LGN[i]}</span></button>`).join('')}</p>`;
function ccTieRow(t){const me=t.a==G.me||t.b==G.me,f=x=>x?x[0]+'-'+x[1]:'–',two=t.l.length==2,ok=t.l.every(x=>x),mid=ok?(two?t.ag[0]+' - '+t.ag[1]:f(t.l[0])):(t.l[0]?f(t.l[0]):'vs'),
 sub=ok?(t.pen?`pen. ${t.pen[0]}-${t.pen[1]}`:t.fo?'gol fuera':two?`${f(t.l[0])} · ${f(t.l[1])}`:''):(two&&t.l[0]?'ida '+f(t.l[0]):'');
 return `<div class="cct${me?' me':''}"><span class="ctm${t.w==t.a?' w':''}">${crest(t.a,24)}<b>${nm(t.a)}</b></span><span class="ccs"><b>${mid}</b><small>${sub}</small></span><span class="ctm r${t.w==t.b?' w':''}"><b>${nm(t.b)}</b>${crest(t.b,24)}</span></div>`}
function ccView(){const c=ccEns(),nxS=c.skip?null:CCS[c.k],cur=c.skip?'po':c.k<2?'po':c.k<8?'gr':'ko',sec=S.cck||cur,P=ccPath();
 const stg=['po','gr','r16','qf','sf','fi'],cs=c.skip?-1:c.k>=15?6:stg.indexOf(CCS[c.k].st),
  chips=`<div class="ccp">${stg.map((s,i)=>`<span class="${i<cs?'d':i==cs?'n':''}">${CCST[s]}</span>`).join('')}</div>`,
  head=`<div class="ccb"><img src="img/CC.png" alt="" onerror="this.style.display='none'"><div><h2>Champions Cup</h2><span class="mu sm">Temporada ${G.season}${c.skip?'':c.w!=null?' · Terminada':' · '+CCST[CCS[Math.min(c.k,14)].st]}</span></div></div>`;
 if(c.skip)return head+`<div class="pn"><p>${P.t}</p><p class="sm mu">Participan los 44 equipos: los 24 de la ${LGN[2]} juegan una ronda previa y se unen a los 20 de la ${LGN[1]}.</p></div>`;
 const my=c.res.filter(r=>r.h==G.me||r.a==G.me),st=`<div class="pn ccst ${P.s}"><h3>Tu camino</h3><p class="ccp2"><b>${P.t}</b></p>${nxS&&c.w==null?`<p class="sm mu">Próxima jornada: ${nxS.lb} · antes de la jornada ${nxS.an+1} de liga</p>`:''}${my.length?`<div class="ccm">${my.map(r=>{const h=r.h==G.me,d=h?r.hg-r.ag:r.ag-r.hg,o=h?r.a:r.h;return `<div><small>${CCS[r.k].lb.replace('Fase de grupos · ','')}</small><span class="tn">${crest(o,18)}${nm(o)}</span><b class="${d>0?'ok':d<0?'ko':''}">${r.hg} - ${r.ag}</b></div>`}).join('')}</div>`:''}</div>`;
 const tabs=`<div class="cck">${[['po','Previa'],['gr','Grupos'],['ko','Eliminatorias'],['sc','Goleadores']].map(([k,l])=>`<button data-cck="${k}" class="${sec==k?'on':''}">${l}</button>`).join('')}</div>`;
 let b='';
 if(sec=='po')b=`<div class="pn"><h3>Ronda previa</h3><p class="sm mu">Los 24 equipos de la ${LGN[2]} juegan ida y vuelta. Pasan 12 y se unen a los 20 de la ${LGN[1]}.</p>${c.po.map(ccTieRow).join('')}</div>`;
 else if(sec=='gr'){if(!c.gr)b=`<div class="pn"><p>El sorteo de grupos se hará al terminar la ronda previa.</p><p class="sm mu">32 equipos (20 de la ${LGN[1]} + 12 de la previa) en 8 grupos de 4, ida y vuelta. Pasan los 2 primeros.</p></div>`;
  else{const mg=c.gr.g.findIndex(g=>g.includes(G.me)),ord=[...Array(8).keys()].sort((x,y)=>(y==mg)-(x==mg)||x-y);
   b=`<div class="g2">${ord.map(g=>{const t=ccGT(g);return `<div class="pn sx ccg${g==mg?' mine':''}"><h3>Grupo ${CCL[g]}</h3><table><tr><th>#</th><th>Equipo</th><th class="n">PJ</th><th class="n">DG</th><th class="n">Pts</th></tr>${t.map((x,i)=>`<tr class="${x.id==G.me?'me':''}"><td class="${i<2?'ccq':''}">${i+1}</td><td><span class="tn">${crest(x.id,22)}<span class="tnm">${nm(x.id)}</span></span></td><td class="n">${x.pj}</td><td class="n">${x.gf-x.gc}</td><td class="n"><b>${x.pts}</b></td></tr>`).join('')}</table></div>`}).join('')}</div><p class="sm mu">Se clasifican los 2 primeros de cada grupo (puntos, diferencia de goles y goles a favor).</p>`}}
 else if(sec=='ko'){if(c.k>=8)ccTies('r16');b=['r16','qf','sf','fi'].map(s=>{const T=c.ko[s];return `<div class="pn"><h3>${CCST[s]}</h3>${T?T.map(ccTieRow).join(''):'<p class="sm mu">Por sortear.</p>'}${s=='fi'&&T?'<p class="sm mu">Final a partido único en campo neutral.</p>':''}</div>`}).join('')+`<p class="sm mu">Ida y vuelta con gol fuera de casa; si sigue el empate, penaltis.</p>`}
 else{const pl=G.T.flatMap(t=>t.pl.map(p=>({p,t}))),lst=(f,tt)=>`<div class="pn sx"><h3>${tt}</h3><table>${pl.filter(x=>f(x.p)>0).sort((x,y)=>f(y.p)-f(x.p)||x.p.n.localeCompare(y.p.n)).slice(0,10).map((x,i)=>`<tr class="${x.t.id==G.me?'me':''}"><td class="n mu">${i+1}</td><td>${x.p.n}</td><td><span class="tn">${crest(x.t.id,18)}<span class="mu sm">${x.t.n}</span></span></td><td class="n"><b>${f(x.p)}</b></td></tr>`).join('')||'<tr><td class="mu">Sin datos todavía</td></tr>'}</table></div>`;
  b=`<div class="g2">${lst(p=>p.cg|0,'⚽ Goleadores')}${lst(p=>p.ca|0,'🅰️ Asistentes')}</div>`}
 return `<div class="ccv">${head}${chips}${st}${tabs}${b}</div>`}
/* ---- estilo (turquesa fosforito) ---- */
(function(){if(document.getElementById('ccsty'))return;const st=document.createElement('style');st.id='ccsty';st.textContent=`
:root{--cc:#00f0e0;--ccd:#00756f;--ccx:#00302d}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ccd:#00f0e0}}
:root[data-theme="dark"]{--ccd:#00f0e0}
.seg.s3{grid-template-columns:1fr 1fr!important}.seg.s3 button[data-l="3"]{grid-column:1/-1}
.seg button[data-l="3"].on{background:var(--cc);border-color:var(--cc);color:var(--ccx);box-shadow:0 0 18px #00f0e0aa;font-weight:700}
.seg button[data-l="3"]:not(.on){border-color:color-mix(in srgb,var(--cc) 55%,var(--ln))}
.nx.cc{--ac:var(--cc);--ac2:var(--ccx);border-color:var(--cc);box-shadow:0 0 18px color-mix(in srgb,var(--cc) 35%,transparent)}
.nx.cc .nxh h3{color:var(--ccd);text-transform:uppercase}
.ccb{display:flex;align-items:center;gap:14px;margin:12px 0;padding:12px 14px;border-radius:14px;border:1px solid var(--cc);background:linear-gradient(135deg,color-mix(in srgb,var(--cc) 22%,var(--pn)),var(--pn) 72%);box-shadow:0 0 18px color-mix(in srgb,var(--cc) 38%,transparent)}
.ccb img{height:68px;max-width:30%;object-fit:contain;filter:drop-shadow(0 0 8px var(--cc))}
.ccb h2{font-size:32px;line-height:1;text-transform:uppercase;color:var(--ccd)}
.ccp{display:flex;gap:4px;margin:0 0 12px}.ccp span{flex:1;min-width:0;text-align:center;font-size:11px;line-height:1.1;padding:7px 2px;border-radius:6px;border:1px solid var(--ln);color:var(--mu);overflow:hidden;text-overflow:ellipsis}
.ccp .d{background:var(--cc);border-color:var(--cc);color:var(--ccx);font-weight:600}.ccp .n{border-color:var(--cc);color:var(--ccd);font-weight:600;box-shadow:0 0 10px color-mix(in srgb,var(--cc) 55%,transparent)}
.ccst{border-left:4px solid var(--cc)}.ccst.e{border-left-color:var(--bad)}.ccst.w{background:color-mix(in srgb,var(--cc) 18%,var(--pn));box-shadow:0 0 16px color-mix(in srgb,var(--cc) 45%,transparent)}
.ccst h3{color:var(--ccd)}.ccp2{margin:4px 0}
.ccm{display:grid;gap:4px;margin-top:8px}.ccm>div{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1.6fr) auto;gap:8px;align-items:center;font-size:14px;border-top:1px solid var(--ln);padding-top:4px}.ccm small{color:var(--mu)}.ccm .tn{min-width:0}
.cck{display:flex;gap:6px;margin:0 0 12px;overflow-x:auto}.cck button{flex:1;white-space:nowrap;padding:8px 10px}.cck button.on{background:var(--cc);border-color:var(--cc);color:var(--ccx);font-weight:700}
.ccg h3{color:var(--ccd)}.ccg.mine{border-color:var(--cc);box-shadow:0 0 12px color-mix(in srgb,var(--cc) 35%,transparent)}
td.ccq{box-shadow:inset 3px 0 0 var(--cc)}
.cct{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:8px;align-items:center;padding:8px 6px;border-top:1px solid var(--ln)}.cct.me{background:color-mix(in srgb,var(--cc) 16%,transparent);border-radius:6px}
.ctm{display:flex;align-items:center;gap:6px;min-width:0}.ctm b{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ctm.r{justify-content:flex-end;text-align:right}.ctm.w b{font-weight:700;color:var(--ccd)}
.ccs{display:flex;flex-direction:column;align-items:center;min-width:64px;line-height:1.1}.ccs b{font:700 20px 'Barlow Condensed',sans-serif}.ccs small{color:var(--mu);font-size:11px}
`;document.head.appendChild(st)})();
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-cck]');if(b&&typeof S!='undefined'&&typeof render=='function'){S.cck=b.dataset.cck;render()}});
