/* Tácticas v1: estilo de juego, roles, jugadas ensayadas e identidad de club */
const STY={eq:{n:'Equilibrado',i:'⚖️',a:.4,d:.4,t:'Sin riesgos: rinde igual con cualquier plantilla.'},
 pos:{n:'Posesión',i:'🎯',a:.9,d:.1,t:'Domina el balón. Rinde más con buenos medios.'},
 con:{n:'Contraataque',i:'⚡',a:-.3,d:1.3,t:'Atrás y a la contra. Rinde más con buena defensa y delanteros.'},
 pre:{n:'Presión alta',i:'🔥',a:1.6,d:-.6,t:'Asfixia arriba. Exige nivel alto y poco cansancio.'}};
const BEATS={pre:'pos',pos:'con',con:'pre'};
const SPS={no:['Ninguna',0],co:['Córners',.8],fa:['Faltas directas',.8],sl:['Saques largos',.6]};
/* cruce de estilos suave: ninguna táctica gana siempre; el encaje con la plantilla pesa más */
const tacMx=(x,y)=>{const m=(p,q)=>BEATS[p]==q?.5:BEATS[q]==p?-.3:0;return[m(x.st,y.st),m(y.st,x.st)]};
const tacFit=(t,k)=>{const x=t.lu.map(i=>t.pl[i]).filter(Boolean);if(!x.length||k=='eq')return 0;const g=c=>{const a=x.filter(p=>p.pos==c);return a.length?av(a):68},fa=x.reduce((s,p)=>s+(p.fa|0),0)/x.length,all=av(x);
 const f=k=='pos'?(g('M')-68)*.05:k=='con'?((g('D')+g('F'))/2-68)*.05:((all-68)*.03-fa*.02);return Math.max(-.8,Math.min(.8,f))};
const tacBest=(t,k)=>t.pl.map((p,i)=>i).filter(i=>k.includes(t.pl[i].pos)).sort((a,b)=>t.pl[b].ovr-t.pl[a].ovr);
function tacOf(t){if(!t.tac){const h=(t.id*3+1)%4,st=['eq','pos','con','pre'][h],f={eq:['4-3-3','4-4-2'],pos:['4-5-1','3-5-2'],con:['5-3-2','5-4-1'],pre:['4-3-3','3-4-3']}[st][t.id%2];
 t.tac={st,cre:tacBest(t,'M')[0],rem:tacBest(t,'F')[0],tk:tacBest(t,'MF')[1],sp:['co','fa','sl','no'][t.id%4]};if(t.id!=G.me)t.form=f}return t.tac}
const _str=str;
str=function(t){const s=_str(t),c=tacOf(t),y=STY[c.st],on=i=>i!=null&&t.lu.includes(i),b=i=>Math.max(0,(ef(t.pl[i])-68)*.06);let a=s.a+y.a,d=s.d+y.d;const ft=tacFit(t,c.st);if(c.st=='con')d+=ft;else a+=ft;
 if(on(c.cre))a+=.4+b(c.cre);if(on(c.rem))a+=.3+b(c.rem);if(c.sp!='no'&&on(c.tk))a+=SPS[c.sp][1]+b(c.tk)/2;return{...s,a,d,st:c.st}};
function tacBestSty(t,oid){const o=str(G.T[oid]),c=tacOf(t),keep=c.st;let best=keep,bv=-99;Object.keys(STY).forEach(k=>{c.st=k;const s=str(t),m=tacMx(s,o),v=s.a-o.d+m[0]-(o.a-s.d+m[1]);if(v>bv){bv=v;best=k}});c.st=keep;return best}
const _hubSq=hubSq;
hubSq=function(){const t=G.T[G.me],c=tacOf(t);return _hubSq().replace(/<\/div>$/,hcd('q:tac','tac','🧠','Tácticas',`${STY[c.st].n} · ${t.form}`,STY[c.st].i,'Estilo')+'</div>')};
SQM.push(['tac','Tácticas']);
const _sqm=sqm;
sqm=function(){return S.sq=='tac'?back('q','Plantilla','Tácticas')+tacv():_sqm()};
const SPI={no:'🚫',co:'🚩',fa:'🥅',sl:'🧤'},RI={cre:'🪄',rem:'🎯',tk:'🦶'};
const tcPh=(t,i)=>{const p=t.pl[i],x=t.lu.includes(i);return `<span class="ps ${p.pos}">${PN[p.pos]}</span><span class="pnm">${p.n}</span><em class="xt${x?'':' w'}">${x?'XI':'Banq.'}</em><b class="ov">${Math.round(ef(p))}</b>`};
const tcDd=(k,items,cur,btn)=>{const o=S.dd==k;return `<div class="dd${o?' open':''}"><button class="ddb" data-ddt="${k}">${btn}<span class="ddc">▾</span></button>${o?`<div class="ddl">${items.map(([v,h])=>`<button class="ddi${String(v)==String(cur)?' on':''}" data-ddk="${k}" data-ddv="${v}">${h}</button>`).join('')}</div>`:''}</div>`};
function tacv(){const t=G.T[G.me],c=tacOf(t),m=nxt(),oid=m[0]==G.me?m[1]:m[0],o=G.T[oid],oc=tacOf(o),os=str(o),mx=tacMx(str(t),os),net=mx[0]-mx[1];xi(t);
 const sp=slots(t.form),ln=p=>p.n.split(' ').slice(1).join(' ')||p.n,v=net>.4?'good':net<-.4?'bad':'mid',vt=net>.4?'Pequeña ventaja':net<-.4?'Pequeña desventaja':'Igualado',fl=k=>{const f=tacFit(t,k);return k=='eq'?['Neutro','mid']:f>=.3?['Alto','good']:f<=-.3?['Bajo','bad']:['Medio','mid']},
 rdd=(k,ks,lab)=>{const cur=c[k],ok=cur!=null&&t.pl[cur],on=ok&&t.lu.includes(cur);return `<div class="tcr"><span class="tcl">${RI[k]} ${lab}</span>${tcDd(k,tacBest(t,ks).map(i=>[i,tcPh(t,i)]),cur,ok?tcPh(t,cur):'<span class="pnm mu">—</span>')}${ok&&!on?'<small class="tcw">⚠ Está en el banquillo: no da bonus</small>':''}</div>`},
 card=i=>{const p=t.pl[t.lu[i]],r=Object.keys(RI).filter(k=>c[k]===t.lu[i]);return `<div class="sl${r.length?' pk':''}"><span class="ov">${Math.round(ef(p))}</span><b>${ln(p)}</b>${r.length?`<span class="rl">${r.map(k=>`<i>${RI[k]}</i>`).join('')}</span>`:''}</div>`};
 return `<div class="pn"><h3>Estilo de juego</h3><div class="tcg">${Object.keys(STY).map(k=>`<button class="tcs${c.st==k?' on':''}" data-st="${k}"><span>${STY[k].i}</span><b>${STY[k].n}</b><small>${STY[k].t}</small><em class="fit ${fl(k)[1]}">Encaje ${fl(k)[0]}</em></button>`).join('')}</div>
<div class="tcv ${v}"><div class="tcvs"><small>Tú</small><span>${STY[c.st].i}</span><b>${STY[c.st].n}</b><small>${t.form}</small></div><div class="tcvm"><b>${vt}</b><small>El cruce de estilos pesa poco</small></div><div class="tcvs"><small>${nm(oid)}</small><span>${STY[oc.st].i}</span><b>${STY[oc.st].n}</b><small>${o.form}</small></div></div>
<p class="tcl2">Ningún estilo gana siempre: pesa más lo bien que encaja con tu plantilla (ver «Encaje») que el estilo del rival.</p></div>
<div class="g2 sq tcp"><div class="pn pit">${['F','M','D','P'].map(x=>`<div class="rw">${sp.map((s,i)=>s==x?card(i):'').join('')}</div>`).join('')}</div>
<div><div class="pn tcf"><h3>Formación y roles</h3>
<div class="tcr"><span class="tcl">📋 Formación</span>${tcDd('fm',Object.keys(FORM).map(f=>[f,`<b class="fmn">${f}</b><span class="pnm mu">${['POR','DEF','MED','DEL'].map((n,j)=>n+' '+FORM[f][j]).join(' · ')}</span>`]),t.form,`<b class="fmn">${t.form}</b><span class="pnm mu">${['POR','DEF','MED','DEL'].map((n,j)=>n+' '+FORM[t.form][j]).join(' · ')}</span>`)}</div>
${rdd('cre','M','Creador (medio)')}${rdd('rem','F','Rematador (delantero)')}
<div class="tcr"><span class="tcl">🎬 Jugadas ensayadas</span>${tcDd('sp',Object.keys(SPS).map(k=>[k,`<span class="spi">${SPI[k]}</span><span class="pnm">${SPS[k][0]}</span><em class="xt">${k=='no'?'—':'+'+SPS[k][1]}</em>`]),c.sp,`<span class="spi">${SPI[c.sp]}</span><span class="pnm">${SPS[c.sp][0]}</span>`)}</div>
${rdd('tk','MFD','Lanzador')}
<p class="sm mu">En el campo: 🪄 creador · 🎯 rematador · 🦶 lanzador (marcados en dorado). Los roles solo dan bonus si el jugador es titular. Mejor nivel = más efecto.</p></div>
<div class="pn"><h3>Automático</h3><button class="p" id="tau">🤖 Mejor táctica para el próximo rival</button><p class="sm mu" style="margin:8px 0 0">Elige estilo, creador, rematador y lanzador por ti.</p></div></div></div>`}
const _bind=bind;
bind=function(){_bind();document.body.classList.toggle('tcm',S.sq=='tac');if(S.sq!='tac'){S.dd=null;return}
 const t=G.T[G.me],c=tacOf(t),ok=()=>{save();render()};
 document.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{c.st=b.dataset.st;S.dd=null;ok()});
 document.querySelectorAll('[data-ddt]').forEach(b=>b.onclick=()=>{const k=b.dataset.ddt;S.dd=S.dd==k?null:k;render()});
 document.querySelectorAll('[data-ddk]').forEach(b=>b.onclick=()=>{const k=b.dataset.ddk,v=b.dataset.ddv;if(k=='fm'){t.form=v;auto(t)}else c[k]=k=='sp'?v:+v;S.dd=null;ok()});
 $('#tau').onclick=()=>{const m=nxt(),oid=m[0]==G.me?m[1]:m[0];c.st=tacBestSty(t,oid);c.cre=tacBest(t,'M')[0];c.rem=tacBest(t,'F')[0];c.tk=tacBest(t,'MF')[1];S.dd=null;ok()};
 const l=document.querySelector('.ddl');if(l){const s=l.querySelector('.on');if(s)l.scrollTop=Math.max(0,s.offsetTop-60);l.scrollIntoView({block:'nearest',behavior:'smooth'})}};
