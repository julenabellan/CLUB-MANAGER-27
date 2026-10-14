/* Tácticas v1: estilo de juego, roles, jugadas ensayadas e identidad de club */
const STY={eq:{n:'Equilibrado',i:'⚖️',a:0,d:0,t:'Sin riesgos, se adapta al rival.'},
 pos:{n:'Posesión',i:'🎯',a:1,d:1,t:'Controla el balón. Sufre ante la presión alta.'},
 con:{n:'Contraataque',i:'⚡',a:-.5,d:2,t:'Defiende atrás y sale veloz. Castiga a la presión alta.'},
 pre:{n:'Presión alta',i:'🔥',a:2,d:-1.5,t:'Roba arriba y asfixia. Deja espacios al contraataque.'}};
const BEATS={pre:'pos',pos:'con',con:'pre'};
const SPS={no:['Ninguna',0],co:['Córners',.8],fa:['Faltas directas',.8],sl:['Saques largos',.6]};
const tacMx=(x,y)=>{const m=(p,q)=>BEATS[p]==q?2.2:BEATS[q]==p?-1.6:0;return[m(x.st,y.st),m(y.st,x.st)]};
const tacBest=(t,k)=>t.pl.map((p,i)=>i).filter(i=>k.includes(t.pl[i].pos)).sort((a,b)=>t.pl[b].ovr-t.pl[a].ovr);
function tacOf(t){if(!t.tac){const h=(t.id*3+1)%4,st=['eq','pos','con','pre'][h],f={eq:['4-3-3','4-4-2'],pos:['4-5-1','3-5-2'],con:['5-3-2','5-4-1'],pre:['4-3-3','3-4-3']}[st][t.id%2];
 t.tac={st,cre:tacBest(t,'M')[0],rem:tacBest(t,'F')[0],tk:tacBest(t,'MF')[1],sp:['co','fa','sl','no'][t.id%4]};if(t.id!=G.me)t.form=f}return t.tac}
const _str=str;
str=function(t){const s=_str(t),c=tacOf(t),y=STY[c.st],on=i=>i!=null&&t.lu.includes(i),b=i=>Math.max(0,(ef(t.pl[i])-68)*.06);let a=s.a+y.a,d=s.d+y.d;
 if(on(c.cre))a+=.4+b(c.cre);if(on(c.rem))a+=.3+b(c.rem);if(c.sp!='no'&&on(c.tk))a+=SPS[c.sp][1]+b(c.tk)/2;return{...s,a,d,st:c.st}};
function tacBestSty(t,oid){const o=str(G.T[oid]),c=tacOf(t),keep=c.st;let best=keep,bv=-99;Object.keys(STY).forEach(k=>{c.st=k;const s=str(t),m=tacMx(s,o),v=s.a-o.d+m[0]-(o.a-s.d+m[1]);if(v>bv){bv=v;best=k}});c.st=keep;return best}
const _hubSq=hubSq;
hubSq=function(){const t=G.T[G.me],c=tacOf(t);return _hubSq().replace(/<\/div>$/,hcd('q:tac','tac','🧠','Tácticas',`${STY[c.st].n} · ${t.form}`,STY[c.st].i,'Estilo')+'</div>')};
SQM.push(['tac','Tácticas']);
const _sqm=sqm;
sqm=function(){return S.sq=='tac'?back('q','Plantilla','Tácticas')+tacv():_sqm()};
function tacv(){const t=G.T[G.me],c=tacOf(t),m=nxt(),oid=m[0]==G.me?m[1]:m[0],o=G.T[oid],oc=tacOf(o),os=str(o),mx=tacMx(str(t),os),
 sel=(k,ks,cur,none)=>`<select data-r="${k}">${none?'<option value="">—</option>':''}${tacBest(t,ks).map(i=>`<option value="${i}" ${cur===i?'selected':''}>${PN[t.pl[i].pos]} ${t.pl[i].n} (${Math.round(ef(t.pl[i]))})</option>`).join('')}</select>`;
 return `<div class="pn"><h3>Estilo de juego</h3><div class="tcg">${Object.keys(STY).map(k=>`<button class="tcs${c.st==k?' on':''}" data-st="${k}"><span>${STY[k].i}</span><b>${STY[k].n}</b><small>${STY[k].t}</small></button>`).join('')}</div>
<p class="sm mu">Próximo rival: <b>${o.n}</b> · ${STY[oc.st].i} ${STY[oc.st].n} · ${o.form}. ${mx[0]>0?'Tu estilo le gana la partida táctica.':mx[0]<0?'Tu estilo sufre contra el suyo.':'Sin ventaja táctica clara.'} Piedra-papel-tijera: presión gana a posesión, posesión a contraataque, contraataque a presión.</p></div>
<div class="pn tcf"><h3>Formación y roles</h3><label>Formación ${'<select id="tfm">'+Object.keys(FORM).map(f=>`<option ${f==t.form?'selected':''}>${f}</option>`).join('')+'</select>'}</label>
<label>Creador (medio) ${sel('cre','M',c.cre)}</label><label>Rematador (delantero) ${sel('rem','F',c.rem)}</label>
<label>Jugadas ensayadas <select data-r="sp">${Object.keys(SPS).map(k=>`<option value="${k}" ${c.sp==k?'selected':''}>${SPS[k][0]}</option>`).join('')}</select></label>
<label>Lanzador ${sel('tk','MFD',c.tk)}</label><p class="sm mu">Los roles solo dan bonus si el jugador es titular. Mejor nivel = más efecto.</p></div>
<div class="pn"><h3>Automático</h3><button class="p" id="tau">🤖 Mejor táctica para el próximo rival</button> <span class="sm mu">Elige estilo, creador, rematador y lanzador por ti.</span></div>`}
const _bind=bind;
bind=function(){_bind();if(S.sq!='tac')return;const t=G.T[G.me],c=tacOf(t),ok=()=>{save();render()};
 document.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{c.st=b.dataset.st;ok()});
 document.querySelectorAll('[data-r]').forEach(s=>s.onchange=()=>{const k=s.dataset.r;c[k]=k=='sp'?s.value:+s.value;ok()});
 $('#tfm').onchange=()=>{t.form=$('#tfm').value;auto(t);ok()};
 $('#tau').onclick=()=>{const m=nxt(),oid=m[0]==G.me?m[1]:m[0];c.st=tacBestSty(t,oid);c.cre=tacBest(t,'M')[0];c.rem=tacBest(t,'F')[0];c.tk=tacBest(t,'MF')[1];ok()}};
