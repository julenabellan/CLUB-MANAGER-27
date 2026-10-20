/* Partido en directo: marcador, goles con asistente, las 5 últimas acciones visibles (el resto, deslizando) y resumen final variado.
   Reproduce el resultado ya simulado (goles, asistencias y tarjetas vienen de la simulación). */
function liveMatch(m,done){
const [,,h,a,hg,ag]=m.r,ids=[h,a],T=ids.map(i=>G.T[i]),mine=ids[0]==G.me?0:1,MT=T[mine];
xi(MT);const orig=[MT.lu.slice(),MT.bn.slice()],strs=T.map(t=>str(t)),ev=[],MAXV=5;
const pick=x=>x[Math.floor(Math.random()*x.length)],sn=n=>{const p=String(n).split(' ');return p.length>1?p.slice(1).join(' '):n};
const gkOf=i=>{const g=xi(G.T[i]).find(p=>p.pos=='P');return g?sn(g.n):'el portero'};
/* acciones según posición: los tiros los hacen sobre todo delanteros y medios; faltas y entradas, defensas y medios (diferencias suaves) */
const PWT={save:[{F:4,M:3,D:1},{}],miss:[{F:4,M:3,D:1},{}],post:[{F:4,M:3,D:1},{}],block:[{F:4,M:3,D:1},{F:.8,M:2,D:3.4}],chance:[{F:5,M:2.5,D:.5},{}],free:[{F:2,M:4,D:1.6},{}],
 foul:[{F:1.2,M:2.8,D:3},{F:3,M:3,D:1}],corner:[{F:3,M:3.4,D:1.4},{}],offside:[{F:6,M:2,D:.2},{}],cross:[{F:2.2,M:3.4,D:2.4},{F:1,M:1.6,D:3}],dribble:[{F:3.6,M:3.4,D:1.2},{F:1,M:2.4,D:3}],
 counter:[{F:3.6,M:3.4,D:1},{}],tackle:[{F:3,M:3.4,D:1},{F:1,M:2.6,D:3.4}],pass:[{F:1.6,M:4,D:1.8},{}],penmiss:[{F:4,M:3,D:1},{}],pen:[{F:3.6,M:3.2,D:1},{F:.6,M:1.6,D:3.6}]};
const wpl=(l,w)=>{w=w||{};const ww=l.map(p=>w[p.pos]!=null?w[p.pos]:1);let r=Math.random()*ww.reduce((s,x)=>s+x,0);for(let i=0;i<l.length;i++){if((r-=ww[i])<=0)return l[i]}return l[l.length-1]};
const wp=l=>{let r=Math.random()*l.reduce((s,x)=>s+x[1],0);for(const x of l){if((r-=x[1])<=0)return x[0]}return l[0][0]};
/* ---- textos ---- */
const L={
goalA:['¡GOOOL de {p}! Remata a placer el pase de {a}','¡GOOOL de {p}! Centro de {a} y cabezazo imparable','¡GOOOL de {p}! {a} se la deja de tacón y no perdona','¡GOOOL de {p}! Contraataque letal que culmina tras el pase de {a}','¡GOOOL de {p}! Pase filtrado de {a} y define con el exterior','¡GOOOL de {p}! Volea espectacular tras el servicio de {a}','¡GOOOL de {p}! {a} abre a la banda, pase atrás y gol','¡GOOOL de {p}! Pared con {a} y bate al portero','¡GOOOL de {p}! Córner de {a} y remate de cabeza a la red','¡GOOOL de {p}! Zurdazo cruzado tras la jugada de {a}','¡GOOOL de {p}! {a} la pone con mimo y él empuja a placer','¡GOOOL de {p}! Asistencia de lujo de {a} y definición de crack'],
goalS:['¡GOOOL de {p}! Se inventa una jugada individual y bate al portero','¡GOOOL de {p}! Penalti ejecutado con frialdad','¡GOOOL de {p}! Libre directo imparable','¡GOOOL de {p}! Un golazo desde fuera del área','¡GOOOL de {p}! Aprovecha el rebote y la manda a la red','¡GOOOL de {p}! Vaselina perfecta por encima del portero','¡GOOOL de {p}! Derechazo terrible, ajustado al palo','¡GOOOL de {p}! Chilena de ensueño','¡GOOOL de {p}! Roba en la salida y define con calma','¡GOOOL de {p}! Cabezazo a la red tras una melé en el área','¡GOOOL de {p}! Zurdazo seco que se cuela por la escuadra','¡GOOOL de {p}! Recorta, se perfila y la clava en la escuadra'],
save:['{p} dispara y {k} lo detiene','{p} lo intenta de lejos. ¡Paradón de {k}!','{p} remata a bocajarro y {k} lo saca con el pie','Disparo de {p} desviado a córner por {k}','{k} se estira y niega el gol a {p}','{p} se queda solo ante {k}, ¡y el portero gana el duelo!'],
miss:['{p} la manda fuera por muy poco','{p} cabecea desviado','{p} dispara alto, a las nubes','{p} se precipita y falla','El disparo de {p} se marcha lamiendo el poste','{p} remata de primeras y el balón sale muy desviado'],
post:['¡Al palo! {p} estuvo a centímetros','¡Larguero! El disparo de {p} saca astillas','¡Poste! {p} no puede creérselo'],
block:['Disparo de {p} bloqueado por {o}','{p} prueba suerte pero {o} se interpone','{o} llega providencial y tapa el remate de {p}'],
foul:['Falta de {p} sobre {o}. El árbitro para el juego','{p} entra tarde a {o} y el árbitro pita falta','Falta táctica de {p} para cortar la contra'],
corner:['Córner a favor. {p} lo sacará','Saque de esquina tras una buena jugada de {p}','{p} fuerza el córner con un buen desborde'],
offside:['{p} cae en fuera de juego. El asistente levanta el banderín','Fuera de juego de {p} cuando se iba solo','El línea levanta la bandera: {p} estaba adelantado'],
chance:['¡Ocasión clamorosa! {p} la manda fuera con la portería vacía','{p} se queda solo ante {k} y su remate sale cruzado','¡Increíble lo de {p}! Falla de manera inexplicable'],
free:['{p} lanza la falta y el balón se va por encima del larguero','Falta directa de {p}: {k} la despeja a córner','{p} saca la barrera y su libre directo roza el poste'],
cross:['Centro peligroso de {p} que nadie remata','{p} manda un centro raso al área y {o} corta','Buen servicio de {p}, pero la defensa despeja'],
dribble:['{p} se marcha de dos rivales y busca el pase','Regate de {p} que levanta a la grada','{p} encara, recorta y el pase final no sale'],
counter:['Contraataque veloz de {p}, pero la defensa corta a tiempo','{p} lidera una contra de tres contra dos... que se queda en nada','Salida rápida del equipo con {p} de protagonista'],
card:['Tarjeta amarilla para {p}','El árbitro enseña amarilla a {p} tras una entrada fuerte','Amarilla para {p} por protestar','Amarilla a {p} por parar una contra con una falta táctica']};
const ICON={goal:'⚽',save:'🧤',miss:'💨',post:'🥅',block:'🛡️',foul:'🟨',corner:'🚩',card:'🟨',offside:'🚫',chance:'😱',free:'🎯',cross:'🎯',dribble:'💫',counter:'⚡'},
 SHOT=['save','miss','post','block','chance','free'],
 KW=[['save',22],['miss',15],['post',4],['block',10],['foul',12],['corner',12],['offside',7],['chance',5],['free',5],['cross',5],['dribble',5],['counter',4]];
ICON.foul='🦵';

/* ---- ampliación: más frases, goles de córner/falta/penalti y acciones nuevas ---- */
const AD={
goalA:['¡GOOOL de {p}! Gran jugada colectiva que remata tras el pase de {a}','¡GOOOL de {p}! {a} abre el campo y {p} define con calidad','¡GOOOL de {p}! Combinación brillante con {a} y definición a la escuadra','¡GOOOL de {p}! Pared con {a} y al fondo de la red','¡GOOOL de {p}! Pase de la muerte de {a} y gol cantado','¡GOOOL de {p}! Robo, apertura de {a} y remate cruzado','¡GOOOL de {p}! {a} filtra, {p} se planta solo y bate al portero','¡GOOOL de {p}! Zurdazo seco a pase de {a}','¡GOOOL de {p}! Desborde de {a} y toque suave para el gol','¡GOOOL de {p}! {a} la pone con el interior y no hay quien lo pare'],
goalS:['¡GOOOL de {p}! Arranca desde el medio campo y firma una jugada de videojuego','¡GOOOL de {p}! Zapatazo seco al palo largo','¡GOOOL de {p}! Se la lleva con el pecho y define de volea','¡GOOOL de {p}! Roba arriba y la manda a la red sin dudar','¡GOOOL de {p}! Cobra el rechace y no perdona','¡GOOOL de {p}! Recorte, hueco y disparo ajustado al palo','¡GOOOL de {p}! Latigazo desde la frontal imposible para {k}','¡GOOOL de {p}! Error en la salida rival y castiga al instante'],
goalCoA:['¡GOOOL de {p}! Córner de {a} y cabezazo imparable al primer palo','¡GOOOL de {p}! {a} pone el córner en la cabeza de {p} y el balón a la red','¡GOOOL de {p}! Saque de esquina medido de {a} y remate a placer','¡GOOOL de {p}! Gran jugada de pizarra a la salida de un córner de {a}','¡GOOOL de {p}! Córner de {a}, peinada y {p} empuja el balón dentro','¡GOOOL de {p}! Se eleva más que nadie tras el córner de {a}'],
goalCo:['¡GOOOL de {p}! Remata de cabeza tras un córner y bate a {k}','¡GOOOL de {p}! Jaleo en el área tras el córner y {p} la manda dentro','¡GOOOL de {p}! El córner acaba en la red tras un rechace de {p}','¡GOOOL de {p}! Gol de estrategia: córner ensayado y remate letal'],
goalFa:['¡GOOOL de {p}! Falta directa y el balón se cuela por la escuadra','¡GOOOL de {p}! Golazo de falta: la barrera no puede hacer nada','¡GOOOL de {p}! Libre directo por encima de la barrera y al fondo de la red','¡GOOOL de {p}! Lanza la falta con rosca y {k} no llega','¡GOOOL de {p}! Obra de arte a balón parado, ajustada al palo','¡GOOOL de {p}! Falta al borde del área y misil imparable'],
goalPe:['¡GOOOL de {p}! Penalti ejecutado con frialdad, {k} se tira al otro lado','¡GOOOL de {p}! Desde los once metros no perdona: al centro y gol','¡GOOOL de {p}! Penalti picado a la escuadra, imposible para {k}','¡GOOOL de {p}! Pena máxima transformada con categoría','¡GOOOL de {p}! Engaña a {k} y convierte el penalti'],
pen:['¡PENALTI! {o} derriba a {p} dentro del área','Mano de {o} en el área: ¡penalti a favor!','¡Penalti claro! {o} hace falta sobre {p}','El árbitro señala penalti tras el tropiezo de {p} con {o}','¡Penalti! {p} cae en el área y el colegiado no lo duda'],
fapre:['Falta peligrosa al borde del área. Se perfila {p}...','Falta frontal: {p} coloca el balón','¡Falta cerca del área! {p} se hace cargo del lanzamiento'],
penmiss:['¡PENALTI! {p} lo lanza... ¡y {k} se lo detiene!','¡Penalti fallado! {p} lo estrella en el palo','¡Penalti a favor! {p} dispara por encima del larguero','¡Pena máxima! {p} tira... ¡y {k} adivina y lo para!'],
tackle:['Gran entrada de {o} que corta el avance de {p}','{o} se anticipa a {p} con un tackle providencial','Barrida espectacular de {o} para evitar el peligro','{o} roba el balón limpio a {p}'],
pass:['Pase en profundidad de {p} que rompe la defensa','{p} saca un pase de otro partido pero no llega nadie','Gran cambio de juego de {p} al otro costado','Tiki-taka del equipo con {p} marcando el ritmo'],
save:['{k} vuela hasta la escuadra para negar el gol a {p}','Manopla de {k} a un disparo cruzado de {p}','{k} sale bien y le gana el mano a mano a {p}','Parada de museo de {k} tras el remate de {p}'],
miss:['{p} manda el balón a las gradas desde buena posición','Remate de {p} que se va rozando el larguero','{p} no acierta tras un buen centro','Disparo flojo de {p} que no inquieta al portero'],
post:['¡Palo! Remate de {p} que se estrella en el poste izquierdo','¡Madera! {p} la pone en la escuadra y rebota en el larguero'],
block:['{o} se tira al suelo y bloquea el tiro de {p}','Remate de {p} que sale rebotado en un defensa'],
foul:['{p} derriba a {o} y el árbitro le recrimina','Falta de {p} para frenar el contragolpe','Entrada dura de {p}, el colegiado habla con él'],
corner:['{p} gana un córner con un buen pase al hueco','El balón sale rebotado: córner para el equipo de {p}'],
offside:['{p} estaba en posición adelantada en el pase de su compañero','El asistente levanta la bandera: {p} se pasó de frenada'],
chance:['¡Ocasión de oro para {p}! Remata a un metro de la línea y no entra','{p} la tiene en el área pequeña y se la entrega a {k}'],
free:['{p} lanza la falta con potencia pero el balón se estrella en la barrera','Falta de {p} que {k} atrapa sin problemas'],
cross:['{p} saca un centro tenso que {o} despeja de puños... de cabeza','Centro al segundo palo de {p} que se pierde por línea de fondo'],
dribble:['{p} se saca de encima a {o} con un caño y levanta al público','Gran control orientado de {p} y arranque imparable'],
counter:['Contra letal liderada por {p}: el balón se queda en el último pase','{p} conduce la contra y le falta un pase más fino'],
card:['Amarilla para {p} por simular una caída','El colegiado amonesta a {p} por cortar una jugada peligrosa']};
Object.keys(AD).forEach(k=>{L[k]=(L[k]||[]).concat(AD[k])});
Object.assign(ICON,{pen:'⚠️',fapre:'🎯',penmiss:'🧤',tackle:'🦶',pass:'🎩'});
SHOT.push('penmiss');KW.push(['tackle',7],['pass',6],['penmiss',1.2]);
const deck={};Object.keys(L).forEach(k=>{let q=[];deck[k]=()=>{if(!q.length)q=L[k].map((_,i)=>i).sort(()=>Math.random()-.5);return L[k][q.pop()]}});
const gk=e=>{const t={co:'Co',fa:'Fa',pe:'Pe'}[e.gt];if(t){const k='goal'+t+(e.as?'A':'');if(deck[k])return k}return e.as?'goalA':'goalS'};
/* ---- eventos ---- */
m.sc.forEach(s=>{const sd=s[0]==h?0:1,ty=s[4]||'n',ox=xi(G.T[ids[1-sd]]).filter(p=>p.pos!='P'),mx=xi(G.T[ids[sd]]).filter(p=>p.pos!='P'),pre=Math.max(0,s[2]-1),ml=mx.filter(p=>p.n!=s[1]);
 if(ty=='pe'){const pp=wpl(ml.length?ml:mx,PWT.pen[0]);ev.push({min:pre,k:'pen',s:sd,who:sn(pp.n),wf:pp.n,opp:sn(wpl(ox,PWT.pen[1]).n),pre:1})}
 else if(ty=='fa')ev.push({min:pre,k:'fapre',s:sd,who:sn(s[1]),wf:s[1],pre:1});
 else if(ty=='co'){const cn=s[3]||pick(ml.length?ml:mx).n;ev.push({min:pre,k:'corner',s:sd,who:sn(cn),wf:cn,pre:1})}
 ev.push({min:s[2],k:'goal',s:sd,who:sn(s[1]),wf:s[1],as:s[3]?sn(s[3]):null,asf:s[3]||null,gt:ty,gk:gkOf(ids[1-sd]),ref:s})});
(m.cd||[]).forEach(c=>ev.push({min:c[2],k:'card',s:c[0]==h?0:1,who:sn(c[1]),wf:c[1],ref:c}));
const TF={d:[.75,.65],e:[1,1],o:[1.35,1.25]};
const filler=(from,tc)=>{const out=[];ids.forEach((id,s)=>{const mx=xi(G.T[id]).filter(p=>p.pos!='P'),ox=xi(G.T[ids[1-s]]).filter(p=>p.pos!='P'),n=Math.round(R(9,14)*TF[tc][s==mine?0:1]*Math.max(0,89-from)/88);
 for(let i=0;i<n;i++){const k=wp(KW);const pw=PWT[k]||[];out.push({min:Math.floor(R(from+1,89)),k,s,who:sn(wpl(mx,pw[0]).n),opp:sn(wpl(ox,pw[1]).n),gk:gkOf(ids[1-s])})}});return out};
ev.push(...filler(1,'e'));
/* cambios de la IA: vienen de la simulación (t.asb); salen en las acciones y el sustituido deja de ser protagonista de jugadas posteriores */
const rs=1-mine,RT=T[rs],rsub=(RT.asb||[]).filter(x=>RT.pl[x[0]]&&RT.pl[x[1]]);
const remapR=l=>rsub.forEach(([a,b,mn])=>{const on=sn(RT.pl[a].n),inn=sn(RT.pl[b].n);l.forEach(e=>{if(e.min<mn||e.k=='sub'||e.k=='goal'||e.k=='card')return;if(e.s==rs&&e.who==on){e.who=inn;if(e.wf)e.wf=RT.pl[b].n}if(e.s!=rs&&e.opp==on)e.opp=inn})});
remapR(ev);rsub.forEach(([a,b,mn])=>ev.push({min:mn,k:'sub',s:rs,ia:a,ib:b,out:RT.pl[a].n,inn:RT.pl[b].n}));
ev.sort((x,y)=>x.min-y.min);
/* ---- pantalla ---- */
if(!document.getElementById('lvhd')){const st=document.createElement('style');st.id='lvhd';st.textContent=`
#lv .lvtop{position:relative;overflow:hidden;isolation:isolate;padding:12px 14px 14px;border-radius:16px;border:1px solid rgba(255,255,255,.2);
 background:radial-gradient(120% 140% at 50% 0%,rgba(255,255,255,.24) 0%,rgba(255,255,255,0) 58%),linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.32) 100%),linear-gradient(135deg,var(--lc),color-mix(in srgb,var(--lc) 62%,#000));
 box-shadow:0 8px 24px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.28),inset 0 -3px 0 rgba(0,0,0,.18)}
#lv .lvtop>*{position:relative;z-index:2}
#lv .lvtop>.lvbg{position:absolute;z-index:0;left:50%;top:50%;height:185%;width:auto;max-width:none;transform:translate(-50%,-50%);opacity:.2;pointer-events:none;
 filter:grayscale(1) brightness(1.7);mix-blend-mode:soft-light;-webkit-mask-image:radial-gradient(closest-side,#000 45%,transparent 100%);mask-image:radial-gradient(closest-side,#000 45%,transparent 100%)}
#lv .lvtop::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
 background:linear-gradient(112deg,rgba(0,0,0,.24) 0 27%,transparent 27.2%),linear-gradient(248deg,rgba(0,0,0,.24) 0 27%,transparent 27.2%),
 linear-gradient(112deg,transparent 0 40%,rgba(255,255,255,.1) 40% 42.5%,transparent 42.5% 46%,rgba(255,255,255,.06) 46% 47.5%,transparent 47.5%)}
#lv .lvtop::after{content:"";position:absolute;left:8%;right:8%;bottom:0;height:3px;z-index:3;border-radius:3px 3px 0 0;background:linear-gradient(90deg,transparent,var(--hi),transparent)}
#lv .lvmid .lgl{height:clamp(70px,22vw,118px);max-width:36vw;width:auto;object-fit:contain;margin-bottom:2px;filter:drop-shadow(0 4px 10px rgba(0,0,0,.5))}
#lv .lvmid .sc{text-shadow:0 3px 0 rgba(0,0,0,.35),0 0 22px rgba(255,255,255,.18);font-variant-numeric:tabular-nums}
#lv .lvmid .lvmin{background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.28);box-shadow:0 2px 6px rgba(0,0,0,.3);letter-spacing:.05em}
#lv .lvtm .cr{filter:drop-shadow(0 3px 7px rgba(0,0,0,.5))}
#lv .lvtm b{text-shadow:0 2px 4px rgba(0,0,0,.45);text-transform:uppercase;letter-spacing:.03em}`;document.head.appendChild(st)}
const o=document.createElement('div');o.id='lv';if(m.cc)o.classList.add('cc');tcSet(o,ids);o.style.setProperty('--lc',({1:'#d62828',2:'#3fb4ff',3:'#1e63e9'})[m.cc?3:m.r[1]]||'#d62828');
const cr=(i,s)=>crest(i,s),crv=s=>s==1-mine?`<span class="rvc" data-rv="${ids[s]}" role="button" tabindex="0" title="Ver alineación de ${T[s].n}">${cr(ids[s],54)}</span>`:cr(ids[s],54);
o.innerHTML=`<div class="lvc"><div class="lvtop"><img class="lvbg" src="${lgi(m.r[1])}" alt="" onerror="this.style.display='none'"><div class="lvtm">${crv(0)}${form5(ids[0],m.r[0])}<b>${T[0].n}</b></div>
<div class="lvmid"><div>${lgl(m.r[1],96)}</div><div class="sc" id="lvs">0 - 0</div><div class="lvmin" id="lvm">0'</div></div>
<div class="lvtm r">${crv(1)}${form5(ids[1],m.r[0])}<b>${T[1].n}</b></div>
<div class="lvg"><div id="lg0"></div><div id="lg1" class="r"></div></div></div>
<div class="bar"><i id="lvk" style="width:0"></i></div>
<div class="lvst"><div><span id="sh0">0</span><small>Tiros</small><span id="sh1">0</span></div><div><span id="co0">0</span><small>Córners</small><span id="co1">0</span></div><div><span id="fo0">0</span><small>Faltas</small><span id="fo1">0</span></div></div>
<div id="lvf"></div><div class="lvh" id="lvh" style="display:none">↕ Desliza para ver todas las acciones</div>
<div class="lvbt"><div class="lvtac" id="lvtac"><button data-t="d">🛡️ Defensivo</button><button data-t="e" class="on">⚖️ Equilibrado</button><button data-t="o">⚔️ Ofensivo</button></div><div class="lvct"><button data-v="1" class="on">x1</button><button data-v="2">x2</button><button data-v="4">x4</button><button id="lvsb">Cambios (5)</button><button data-v="60">Saltar</button><button class="p" id="lvok" style="display:none">Continuar</button></div></div></div>`;
document.body.appendChild(o);
const q=s=>o.querySelector(s),feed=q('#lvf');
let min=0,sp=1,pause=0,pz=0,sc=[0,0],sh=[0,0],co=[0,0],fo=[0,0],yc=[0,0],ei=0,last=performance.now(),half=0,fin=0,subs=0,tac='e';const gl=[[],[]];
let rl=RT.lu.slice(),rb=RT.bn.slice();const rOut=[],BD={},bd=(s,n)=>BD[s+'|'+n]||(BD[s+'|'+n]={g:0,y:0,s:''});
const bh=p=>{const b=BD[rs+'|'+p.n]||{};return (b.g?`<span class="bgg">⚽${b.g>1?'×'+b.g:''}</span>`:'')+(b.y?'<span class="bgy"></span>':'')+(b.s=='in'?'<span class="bgs in">▲</span>':b.s=='out'?'<span class="bgs out">▼</span>':'')};
/* Pulsar el escudo del rival: el partido se pausa, se ve su once (media y cansancio a este minuto) y al cerrar con la cruz continúa */
o.querySelectorAll('[data-rv]').forEach(e=>e.onclick=()=>{const rid=+e.dataset.rv,pre=G.pre&&G.pre[rid],st=new Set(G.T[rid].lu),prev=pz;pz=1;
 rivalView(rid,{lu:rl.slice(),bn:rb.concat(rOut),out:new Set(rOut),bd:bh,fa:pre&&!fin?(p,i)=>{const a=pre[i]|0;return st.has(i)?Math.round(a+((p.fa|0)-a)*Math.min(1,min/90)):a}:null,onClose:()=>{pz=prev;last=performance.now()}})});
const hold=x=>x/(sp>10?40:1);
/* se ven las 5 últimas acciones; las anteriores quedan debajo y se ven deslizando */
const fit=()=>{q('#lvh').style.display=feed.scrollHeight>feed.clientHeight+2?'':'none'};
const say=(min,s,t,c)=>{const d=document.createElement('div');d.className='lm l'+s+' '+(c||'');d.innerHTML=`${s<2?cr(ids[s],22):''}<div><small>${min}'</small><span>${t}</span></div>`;const top=feed.scrollTop,h0=feed.scrollHeight;feed.prepend(d);if(top>4)feed.scrollTop=top+feed.scrollHeight-h0;if(!fin)fit()};
const rsz=()=>{if(!fin)fit()};window.addEventListener('resize',rsz);
o.querySelectorAll('.lvct button[data-v]').forEach(b=>b.onclick=()=>{sp=+b.dataset.v;o.querySelectorAll('.lvct button[data-v]').forEach(x=>x.classList.toggle('on',x==b))});
say(0,2,'¡Comienza el partido!','h');
const fill=(t,e)=>t.replace(/\{p\}/g,'<b>'+e.who+'</b>').replace(/\{a\}/g,'<b>'+(e.as||'')+'</b>').replace(/\{k\}/g,'<b>'+(e.gk||'el portero')+'</b>').replace(/\{o\}/g,'<b>'+(e.opp||'un rival')+'</b>');
function fire(e){if(e.k=='sub'){pause=hold(.35);const ix=rl.indexOf(e.ia);if(ix>=0)rl[ix]=e.ib;rb=rb.filter(i=>i!=e.ib);rOut.push(e.ia);bd(e.s,e.inn).s='in';bd(e.s,e.out).s='out';
  say(e.min,e.s,`🔄 Cambio en ${T[e.s].n}: sale <b>${sn(e.out)}</b>, entra <b>${sn(e.inn)}</b>`,'sub');return}
 const t=fill(deck[e.k=='goal'?gk(e):e.k](),e);
 if(e.k=='goal'){sc[e.s]++;sh[e.s]++;pause=hold(1.8);bd(e.s,e.wf).g++;gl[e.s].push(`${e.min}' ${e.who}${e.as?' <i>(as. '+e.as+')</i>':''}`);q('#lg'+e.s).innerHTML=gl[e.s].join('<br>');
  say(e.min,e.s,`${ICON.goal} ${t}`,'g'+(e.s==mine?' gm':''));q('#lvs').classList.remove('flash');void q('#lvs').offsetWidth;q('#lvs').classList.add('flash');const tp=q('.lvtop');tp.classList.remove('gl0','gl1');void tp.offsetWidth;tp.classList.add('gl'+e.s)}
 else{if(SHOT.includes(e.k))sh[e.s]++;if(e.k=='corner')co[e.s]++;if(e.k=='foul')fo[e.s]++;if(e.k=='fapre')fo[1-e.s]++;if(e.k=='card'){yc[e.s]++;bd(e.s,e.wf).y=1}pause=hold(.35);say(e.min,e.s,`${e.k=='card'?'<i class="cdk"></i>':ICON[e.k]} ${t}`,e.k=='card'?'y':'')}}
/* ---- resumen final ---- */
function recap(){
 const gs=ev.filter(e=>e.k=='goal'),cs=ev.filter(e=>e.k=='card'),my=sc[mine],th=sc[1-mine],d=my-th,me=MT.n,opp=T[1-mine].n,ven=mine==0?'en casa':'lejos de casa',run=[0,0],
 F=(s,v)=>s.replace(/\{(\w+)\}/g,(_,k)=>v[k]??''),B=x=>'<b>'+x+'</b>',cl=(v,a,b)=>Math.max(a,Math.min(b,v));
 const HD=d>=3?['Goleada','Exhibición','Paseo triunfal','Festival de goles']:d==2?['Victoria sólida','Triunfo con autoridad','Dominio claro']:d==1?['Victoria ajustada','Tres puntos sufridos','Triunfo de mérito']:d==0&&my?['Empate con emoción','Reparto de puntos','Tablas con goles']:d==0?['Empate sin goles','Cerrojo mutuo','Un punto y poco más']:d==-1?['Derrota mínima','Cayeron por poco','Amarga derrota']:d==-2?['Derrota clara','Superados','Tarde complicada']:['Noche para olvidar','Hundimiento','Sonrojante derrota'];
 const OP=d>=3?['{me} se dio un festín ante {opp} {ven}','Exhibición de {me}, que arrolló a {opp}','Noche redonda para {me}: {opp} no pudo seguirle el ritmo']:d==2?['{me} se impuso con autoridad a {opp} {ven}','Victoria convincente de {me} frente a {opp}','{me} controló el partido ante {opp} y se llevó los tres puntos']:d==1?['{me} sufrió, pero sacó los tres puntos ante {opp} {ven}','Triunfo por la mínima de {me} frente a {opp}','{me} supo sufrir ante {opp} y se marchó con la victoria']:d==0&&my?['{me} y {opp} se repartieron los puntos en un duelo de ida y vuelta','Tablas entre {me} y {opp} tras un partido con goles en ambas áreas','{me} y {opp} firmaron un empate lleno de alternativas']:d==0?['{me} y {opp} no lograron perforar la portería rival','Cero a cero entre {me} y {opp}: muchas dudas y poco peligro','Los porteros mandaron en el empate sin goles entre {me} y {opp}']:d==-1?['{me} cayó por la mínima ante {opp} {ven}','Derrota amarga de {me} frente a {opp}','{opp} aprovechó su momento y se llevó el choque ante {me}']:d==-2?['{opp} fue superior y {me} no encontró soluciones','Tarde complicada para {me}, que cayó ante {opp} {ven}','{opp} se mostró más fino y superó a {me}']:['{opp} arrolló a {me} {ven}','Una tarde para olvidar de {me} ante {opp}','{me} naufragó ante {opp}'];
 const AS=[' tras un pase de {a}',' con asistencia de {a}',' a pase de {a}',' servido por {a}'];
 const phrase=(e,i)=>{const pd=run[e.s]-run[1-e.s],nd=pd+1,t=T[e.s].n,w=B(e.who),as=(e.as?F(pick(AS),{a:B(e.as)}):'')+({pe:' de penalti',fa:' de falta directa',co:' tras un córner'}[e.gt]||''),mm=e.min+"'";run[e.s]++;
  const pool=i==0?['{w} abrió el marcador para {t} en el {m}{as}','El primero fue obra de {w} ({m}){as}, para {t}','{t} golpeó primero: {w} ({m}){as}']:nd==0?['{w} igualó el choque ({m}){as}','{w} devolvió las tablas ({m}){as}','Respuesta inmediata de {t}: {w} empató ({m}){as}']:pd<0&&nd>0?['{w} completó la remontada ({m}){as}','Remontada de {t} con gol de {w} ({m}){as}']:nd<0?['{w} recortó distancias ({m}){as}','{w} metió a {t} en el partido ({m}){as}']:pd==0?['{w} puso por delante a {t} ({m}){as}','{t} se adelantó con un gol de {w} ({m}){as}']:['{w} amplió la ventaja ({m}){as}','{w} sentenció ({m}){as}','Otro más para {t}: {w} ({m}){as}'];
  return F(pick(pool),{w,t,m:mm,as})};
 let ph=gs.map((e,i)=>phrase(e,i));if(ph.length>6)ph=[...ph.slice(0,2),`Entre medias llegaron ${ph.length-4} goles más`,...ph.slice(-2)];
 let narr=gs.length?ph.join('. ')+'.':F(pick(['Los porteros, {g0} y {g1}, fueron los protagonistas.','Ninguno de los dos acertó de cara a gol: {g0} y {g1} no pasaron apuros.','Las defensas se impusieron y los porteros ({g0} y {g1}) apenas sufrieron.']),{g0:B(gkOf(ids[0])),g1:B(gkOf(ids[1]))});
 const cnt={},asc={};gs.forEach(e=>{cnt[e.s+'|'+e.who]=(cnt[e.s+'|'+e.who]||0)+1;if(e.as)asc[e.as]=(asc[e.as]||0)+1});
 Object.keys(cnt).forEach(k=>{const n=cnt[k],w=B(k.split('|')[1]);if(n==2)narr+=' '+F(pick(['Doblete de {w}.','{w} firmó un doblete.','{w} hizo dos goles.']),{w});else if(n>=3)narr+=' '+F(pick(['¡Hat-trick de {w}!','{w} se llevó el balón tras su hat-trick.']),{w})});
 Object.keys(asc).filter(k=>asc[k]>1).forEach(k=>narr+=' '+F(pick(['{a} repartió {n} asistencias.','{a} fue el socio perfecto con {n} pases de gol.']),{a:B(k),n:asc[k]}));
 if(cs.length){const nm2=[...new Set(cs.map(e=>e.who))].slice(0,2).map(B).join(' y ');narr+=' '+F(pick(['El árbitro mostró {n} amarillas, con {nm} entre ellas.','Se vieron {n} tarjetas amarillas ({nm}).','Partido de {n} amarillas; {nm} vieron la cartulina.']),{n:cs.length,nm:nm2})}
 const sco={};gs.forEach(e=>{const k=e.s+'|'+e.wf;sco[k]=sco[k]||{n:e.who,g:0,a:0,v:0};sco[k].g++;sco[k].v+=3;if(e.as){const k2=e.s+'|'+e.asf;sco[k2]=sco[k2]||{n:e.as,g:0,a:0,v:0};sco[k2].a++;sco[k2].v+=2}});
 const best=Object.values(sco).sort((x,y)=>y.v-x.v||Math.random()-.5)[0];
 const mv=best?`⭐ Jugador del partido: ${B(best.n)} · ${[best.g?best.g+(best.g>1?' goles':' gol'):'',best.a?best.a+(best.a>1?' asistencias':' asistencia'):''].filter(Boolean).join(' y ')}`:`🧤 Portería a cero: ${B(gkOf(my==0&&th>0?ids[1-mine]:ids[mine]))}`;
 const pos=myPos(),end=F(pick(d>0?['Los tres puntos te colocan {pos}º en la tabla.','Con la victoria, {me} es {pos}º.','Suma tres y se queda {pos}º.']:d==0?['Un punto que te deja {pos}º.','El empate mantiene a {me} {pos}º en la clasificación.']:['Sin puntos: {pos}º en la tabla.','La derrota te deja {pos}º.','{me} se queda {pos}º tras este resultado.']),{pos,me});
 const po=cl(Math.round(50+(strs[0].o-strs[1].o)*1.3+R(-4,4)+(mine==0?1:-1)*({d:-5,e:0,o:5}[tac])),34,66),el=document.createElement('div');el.className='lm l2 sum';
 el.innerHTML=`<h4>Resumen · ${pick(HD)}</h4><p>${F(pick(OP),{me:B(me),opp:B(opp),ven})}. ${narr}</p><div class="rch"><span>Tiros <b>${sh[0]}-${sh[1]}</b></span><span>Córners <b>${co[0]}-${co[1]}</b></span><span>Faltas <b>${fo[0]}-${fo[1]}</b></span><span>Amarillas <b>${yc[0]}-${yc[1]}</b></span><span>Posesión <b>${po}%-${100-po}%</b></span></div><p class="mv">${mv}</p><p class="se">${end}</p>`;feed.append(el)}
/* ---- animación final: confeti si ganas, rebote del marcador si empatas, sacudida suave si pierdes ---- */
if(!document.getElementById('lvfx')){const st=document.createElement('style');st.id='lvfx';st.textContent=`
#lv .fxl{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:25}
#lv .cf{position:absolute;top:-16px;width:9px;height:15px;border-radius:2px;opacity:.95;animation:lvcf var(--t) cubic-bezier(.3,.6,.5,1) var(--d) forwards}
@keyframes lvcf{to{transform:translate3d(var(--dx),108vh,0) rotate(var(--r));opacity:.9}}
#lv.fw .lvmid .sc{animation:lvwin 1.1s ease-out}
#lv.fd .lvmid .sc{animation:lvdraw .8s ease-out}
#lv.fl .lvmid .sc{animation:lvlose .7s ease-out}
@keyframes lvwin{0%{transform:scale(1)}30%{transform:scale(1.35);text-shadow:0 0 28px rgba(255,215,0,.9)}60%{transform:scale(.94)}100%{transform:scale(1)}}
@keyframes lvdraw{0%{transform:scale(1)}40%{transform:scale(1.14)}100%{transform:scale(1)}}
@keyframes lvlose{0%,100%{transform:translateX(0)}15%{transform:translateX(-7px)}35%{transform:translateX(6px)}55%{transform:translateX(-4px)}75%{transform:translateX(3px)}}
#lv.fin .lm.sum{animation:lvsum .7s .25s ease-out both}
@keyframes lvsum{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
#lv.fw .lvtop{animation:lvglow 1.6s ease-out}
@keyframes lvglow{0%{box-shadow:0 6px 20px rgba(0,0,0,.25)}35%{box-shadow:0 0 38px 6px rgba(255,215,0,.55)}100%{box-shadow:0 6px 20px rgba(0,0,0,.25)}}
@media(prefers-reduced-motion:reduce){#lv .fxl{display:none}#lv.fin .lvmid .sc,#lv.fin .lvtop,#lv.fin .lm.sum{animation:none}}`;document.head.appendChild(st)}
function celebrate(){const d=sc[mine]-sc[1-mine];o.classList.add('fin',d>0?'fw':d<0?'fl':'fd');if(d<=0)return;
 const L=document.createElement('div');L.className='fxl';const cs=['#ffd700','#ffffff','var(--ac)','#ff4d6d','#4dd2ff','#7CFC9A'],n=d>=3?90:60;
 for(let i=0;i<n;i++){const c=document.createElement('i');c.className='cf';c.style.cssText=`left:${Math.random()*100}%;background:${cs[i%cs.length]};--dx:${Math.round(R(-90,90))}px;--r:${Math.round(R(240,900))}deg;--t:${R(2.2,4.2).toFixed(2)}s;--d:${R(0,1.1).toFixed(2)}s;width:${Math.round(R(6,11))}px;height:${Math.round(R(10,18))}px`;L.appendChild(c)}
 o.appendChild(L);setTimeout(()=>L.remove(),5600)}
function end(){fin=1;sublog.forEach(([a,b,mn])=>{const po=MT.pl[a],pi=MT.pl[b],fr=(90-mn)/90;po.fa=Math.max(0,(po.fa|0)-Math.round((R(5,9)+3)*fr));pi.fa=Math.max(0,Math.min(100,(pi.fa|0)+Math.round(12+R(5,9)*fr-3*(1-fr))))});MT.lu=orig[0];MT.bn=orig[1];save();feed.innerHTML='';feed.style.height='';q('#lvh').style.display='none';feed.classList.add('end');say(90,2,`🏁 Final: ${T[0].n} ${hg} - ${ag} ${T[1].n}`,'h f');recap();celebrate();q('#lvok').style.display='';q('#lvtac').style.display='none';q('.lvct').querySelectorAll('button:not(#lvok)').forEach(b=>b.style.display='none');q('#lvok').onclick=()=>{window.removeEventListener('resize',rsz);o.remove();done()}}
function frame(now){if(fin)return;const dt=Math.min(.05,(now-last)/1000);last=now;
 if(!pz){if(pause>0)pause-=dt;
  else{min+=dt*2*sp;
   if(!half&&min>=45){half=1;pause=hold(1.2);say(45,2,'⏸ Descanso. Los equipos se van a los vestuarios','h')}
   else{while(ei<ev.length&&ev[ei].min<=min&&pause<=0)fire(ev[ei++]);
    if(pause<=0&&ei>=ev.length&&min>=90){end();return}}}}
 const mm=Math.min(90,Math.floor(min));q('#lvm').textContent=mm+"'";q('#lvk').style.width=mm/.9+'%';q('#lvs').textContent=sc[0]+' - '+sc[1];
 ['sh','co','fo'].forEach(k=>{const v={sh,co,fo}[k];q('#'+k+'0').textContent=v[0];q('#'+k+'1').textContent=v[1]});
 requestAnimationFrame(frame)}
const TM={d:['🛡️','plantea el partido de forma defensiva: se repliega y cierra espacios'],e:['⚖️','busca el equilibrio entre defensa y ataque'],o:['⚔️','se lanza al ataque y adelanta sus líneas']};
o.querySelectorAll('#lvtac button').forEach(b=>b.onclick=()=>{if(fin||b.dataset.t==tac)return;tac=b.dataset.t;o.querySelectorAll('#lvtac button').forEach(x=>x.classList.toggle('on',x==b));
 const fut=ev.splice(ei).filter(e=>e.k=='goal'||e.k=='card'||e.k=='sub'||e.pre),nf=filler(Math.floor(min),tac);remapR(nf);ev.push(...fut,...nf);ev.sort((x,y)=>x.min-y.min);
 say(Math.min(90,Math.floor(min)),mine,`${TM[tac][0]} <b>${MT.n}</b> ${TM[tac][1]}`,'sub')});
const gone=new Set(),ent=new Set(),sublog=[];
/* Un jugador sustituido ya no puede marcar, asistir ni ver tarjetas: sus acciones futuras pasan al suplente (también en estadísticas y datos del partido) */
const rmp=(A,B)=>{const oN=MT.pl[A].n,iN=MT.pl[B].n,bump=(n,f,d)=>{const p=MT.pl.find(z=>z.n==n);if(p)p[f]=Math.max(0,(p[f]|0)+d)},
 w=(G.wsc||[]).find(z=>z[0]==m.r[2]&&z[1]==m.r[3]),wl=w?(m.r[2]==G.me?w[2]:w[3]):[];
 ev.slice(ei).forEach(e=>{if(e.s!=mine)return;
  if(e.k=='goal'){const r=e.ref,x=wl.find(z=>z[0]==r[1]&&z[1]==r[2]&&(z[3]||'n')==(r[4]||'n'));
   if(e.wf==oN){bump(oN,'g',-1);bump(iN,'g',1);e.wf=r[1]=iN;e.who=sn(iN);if(x)x[0]=iN}
   if(e.asf==oN){bump(oN,'a',-1);bump(iN,'a',1);e.asf=r[3]=iN;e.as=sn(iN);if(x)x[2]=iN}
   if(e.asf&&e.asf==e.wf){bump(e.asf,'a',-1);e.as=e.asf=null;r[3]=null;if(x)x[2]=null}}
  else if(e.pre&&e.wf==oN){e.wf=iN;e.who=sn(iN)}
  else if(e.k=='card'&&e.wf==oN){bump(oN,'yc',-1);
   if(ev.some(z=>z!==e&&z.k=='card'&&z.wf==iN)){ev.splice(ev.indexOf(e),1);const ix=(m.cd||[]).indexOf(e.ref);if(ix>=0)m.cd.splice(ix,1)}
   else{bump(iN,'yc',1);e.wf=e.ref[1]=iN;e.who=sn(iN)}}
  else if(!e.wf&&e.who==sn(oN))e.who=sn(iN)});
 /* el resto de acciones futuras (tiros, faltas, paradas...): el sustituido deja de ser protagonista, rival o portero de esas jugadas */
 ev.slice(ei).forEach(e=>{if(e.s==mine)return;if(e.opp==sn(oN))e.opp=sn(iN);if(e.gk==sn(oN))e.gk=sn(iN)})};
q('#lvsb').onclick=()=>{if(fin||subs>=5)return;pz=1;
 const cur=MT.lu.slice(),cs=new Set(cur),dl=cur.slice(),db=MT.bn.filter(i=>!gone.has(i)),sp=slots(MT.form),left=5-subs;let pk=null,msg='';
 const pn=document.createElement('div');pn.id='lvsub';o.appendChild(pn);o.classList.add('sbo');
 const nin=()=>dl.filter(i=>!cs.has(i)).length,
  fb=p=>{const f=p.fa|0;return `<i class="fb"><u class="${f>66?'hi':f>33?'md':'lo'}" style="width:${Math.max(6,f)}%"></u></i>`},
  get=l=>{const[k,v]=l.split(':');return k=='x'?dl[+v]:db[+v]},
  set=(l,val)=>{const[k,v]=l.split(':');if(k=='x')dl[+v]=val;else db[+v]=val},
  sw=(a,b)=>{const va=get(a),vb=get(b);set(a,vb);set(b,va)},
  tr=(a,b)=>{if(!a||!b||a==b)return;sw(a,b);if(nin()>left){sw(a,b);msg='Solo te quedan '+left+(left==1?' cambio.':' cambios.')}else msg=''};
 const draw=()=>{const n=nin(),ok=n>0&&n<=left,
  sl=i=>{const p=MT.pl[dl[i]],en=!cs.has(dl[i]);return `<div class="sl fit${pk=='x:'+i?' pk':''}${en?' inn':''}" style="--fc:${FC(p,fslots(MT.form)[i])};${ROY(fslots(MT.form)[i])}" data-l="x:${i}"><span class="ps slp ${FGR(fslots(MT.form)[i])}">${fslots(MT.form)[i]}</span><span class="ov">${Math.round(ef(p))}</span><b>${sn(p.n)}</b>${fb(p)}</div>`},
  rw=db.map((id,j)=>{const p=MT.pl[id],lf=cs.has(id);return `<div class="pr${pk=='b:'+j?' pk':''}${lf?' outt':''}" data-l="b:${j}"><span class="ps ${p.pos}">${PL(p)}</span><span class="pnm">${p.n}${lf?' <em>sale</em>':''}</span><span class="mu sm">${p.age}a</span><b>${Math.round(ef(p))}</b>${fb(p)}</div>`}).join('');
  pn.innerHTML=`<div class="sbx"><h3>Cambios · ${subs}/5 usados</h3><p class="mu sm">Toca (o arrastra) un jugador del campo y otro del banquillo para cambiarlos. Puedes preparar varios cambios y confirmarlos todos a la vez. Un jugador sustituido no vuelve a entrar. Rojo = fuera de posición · Verde = entra.</p><div class="g2 sq"><div class="pn pit">${['F','M','D','P'].map(c=>`<div class="rw">${sp.map((s,i)=>s==c?sl(i):'').join('')}</div>`).join('')}</div><div class="pn zn"><h3>Banquillo <small>${db.length}</small></h3>${rw||'<p class="mu sm">Sin suplentes</p>'}</div></div><p class="sbs">${msg||(n?`${n} cambio${n>1?'s':''} preparado${n>1?'s':''} · te quedarán ${left-n}`:`Te quedan ${left} cambios`)}</p><p class="lvct"><button class="p" id="sbg" ${ok?'':'disabled'}>Confirmar${n?' '+n+(n>1?' cambios':' cambio'):' cambios'}</button><button id="sbr">Deshacer</button><button id="sbc">Cerrar</button></p></div>`;
  pn.querySelectorAll('[data-l]').forEach(e=>{const l=e.dataset.l;e.draggable=true;
   e.onclick=()=>{if(pk&&pk!=l){tr(pk,l);pk=null}else pk=pk==l?null:l;draw()};
   e.ondragstart=ev=>{ev.dataTransfer.setData('text/plain',l);pk=null};e.ondragover=ev=>ev.preventDefault();
   e.ondrop=ev=>{ev.preventDefault();tr(ev.dataTransfer.getData('text/plain'),l);pk=null;draw()}});
  pn.querySelector('#sbr').onclick=()=>{cur.forEach((v,i)=>dl[i]=v);const bo=MT.bn.filter(i=>!gone.has(i));bo.forEach((v,i)=>db[i]=v);pk=null;msg='';draw()};
  pn.querySelector('#sbc').onclick=()=>{o.classList.remove('sbo');pn.remove();pz=0;last=performance.now()};
  pn.querySelector('#sbg').onclick=()=>{const ins=dl.filter(i=>!cs.has(i)),outs=cur.filter(i=>!dl.includes(i)),pairs=ins.map(i=>{let k=outs.findIndex(j=>MT.pl[j].pos==MT.pl[i].pos);if(k<0)k=0;return[outs.splice(k,1)[0],i]});
   pairs.forEach(([a])=>gone.add(a));MT.lu=dl.slice();MT.bn=db.filter(i=>!gone.has(i));subs+=ins.length;ins.forEach(i=>{if(ent.has(i))return;ent.add(i);const p=MT.pl[i];p.pj=(p.pj|0)+1});
   const mn=Math.min(90,Math.floor(min));pairs.forEach(([a,b])=>sublog.push([a,b,mn]));pairs.forEach(([a,b])=>rmp(a,b));pairs.forEach(([a,b])=>say(mn,mine,`🔄 Cambio en ${MT.n}: sale <b>${sn(MT.pl[a].n)}</b>, entra <b>${sn(MT.pl[b].n)}</b>`,'sub'));
   q('#lvsb').textContent='Cambios ('+(5-subs)+')';if(subs>=5)q('#lvsb').disabled=true;o.classList.remove('sbo');pn.remove();pz=0;last=performance.now()}};
 draw()};
requestAnimationFrame(frame)}


/* ===== INTRO DE PARTIDO (estilo retransmisión) =====
   bcIntro(m,start): escudos → clasificación → alineación local → alineación visitante → saque inicial.
   Se avanza tocando la pantalla (o con Enter/espacio); "Saltar" va directo al partido. Al terminar llama a start().
   Uso (ya enganchado en playMatch de game.js):  bcIntro(m,()=>liveMatch(m,done)) */

/* Clasificación de la liga ANTES del partido (simWeek ya ha sumado esta jornada, así que se resta) → [{id,pj,dg,pts}] ordenada */
function bcTable(lg,rd){try{
 const sub={};G.res.filter(r=>r[0]==rd&&r[1]==lg).forEach(([,,h,a,hg,ag])=>[[h,hg,ag],[a,ag,hg]].forEach(([id,f,c])=>{const s=sub[id]=sub[id]||{pj:0,gf:0,gc:0,pts:0};s.pj++;s.gf+=f;s.gc+=c;s.pts+=f>c?3:f==c?1:0}));
 const r=G.T.filter(t=>t.lg==lg).map(t=>{const s=sub[t.id]||{pj:0,gf:0,gc:0,pts:0},gf=t.gf-s.gf,gc=t.gc-s.gc;return{id:t.id,pj:t.pj-s.pj,gf,gc,dg:gf-gc,pts:t.pts-s.pts}});
 if(!r.length||r.some(x=>x.pj<0||x.pts<0))return null;
 return r.sort((x,y)=>y.pts-x.pts||y.dg-x.dg||y.gf-x.gf)}catch(e){return null}}

/* Filas del campo de arriba (delanteros) a abajo (portero); cada fila es una lista de índices de alineación, de izquierda a derecha */
function bcRows(t){
 xi(t);const sp=slots(t.form),fs=typeof fslots=='function'?fslots(t.form):[],g={F:[],M:[],D:[],P:[]};
 t.lu.forEach((id,i)=>{const c=g[sp[i]]?sp[i]:t.pl[id].pos;(g[c]||g.M).push(i)});
 const nums=(String(t.form||'').split(' ')[0].match(/\d/g)||[]).map(Number),mids=nums.slice(1,-1);let mr=[g.M.slice()];
 if(mids.length>1&&nums[0]==g.D.length&&nums[nums.length-1]==g.F.length&&mids.reduce((s,x)=>s+x,0)==g.M.length){
  const rk=i=>{const f=String(fs[i]||'');return /^MCD/.test(f)?0:/^(MCO|MP|MO)/.test(f)?2:1},so=g.M.slice().sort((x,y)=>rk(x)-rk(y));let k=0;
  mr=mids.map(n=>so.slice(k,k+=n).sort((x,y)=>x-y))}
 return [g.F,...mr.slice().reverse(),g.D,g.P].filter(r=>r.length)}
/* dorsales: p.num (se asignan en game.js con assignNums) */
function bcNums(t){if(assignNums(t))save();return t.lu.map(id=>t.pl[id].num)}

function bcCss(){if(document.getElementById('bcsty'))return;const st=document.createElement('style');st.id='bcsty';st.textContent=`
#bc{position:fixed;inset:0;z-index:30;overflow:hidden;display:flex;flex-direction:column;color:#fff;cursor:pointer;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;
 font-family:'Barlow Condensed',sans-serif;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);
 background:radial-gradient(900px 480px at 50% -8%,rgba(255,255,255,.09),transparent),repeating-linear-gradient(115deg,transparent 0 26px,rgba(255,255,255,.03) 26px 52px),#050912}
#bc.out{animation:bcOut .45s forwards;pointer-events:none}@keyframes bcOut{to{opacity:0;transform:scale(1.06)}}
#bc .bc-pg{display:flex;gap:4px;padding:10px 14px 0;position:relative;z-index:6}
#bc .bc-pg i{flex:1;height:3px;background:rgba(255,255,255,.22);border-radius:2px;overflow:hidden}
#bc .bc-pg b{display:block;height:100%;width:0;background:#fff}#bc .bc-pg i.d b{width:100%}#bc .bc-pg i.on b{animation:bcFill var(--t) linear forwards}
@keyframes bcFill{to{width:100%}}
#bc .bc-top{display:flex;justify-content:space-between;align-items:center;padding:8px 14px 0;font-size:13px;letter-spacing:.14em;text-transform:uppercase;opacity:.75;position:relative;z-index:6}
#bc .bc-sk{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:999px;padding:3px 12px;font:700 14px 'Barlow Condensed',sans-serif;letter-spacing:.1em;text-transform:uppercase}
#bc .bc-st{position:relative;flex:1;min-height:0}
#bc .bc-sc{position:absolute;inset:0;display:flex;flex-direction:column;animation:bcIn .4s both}@keyframes bcIn{from{opacity:0}to{opacity:1}}
#bc .bc-wp{position:absolute;inset:0;z-index:5;pointer-events:none;overflow:hidden}
#bc .bc-wp::before,#bc .bc-wp::after{content:"";position:absolute;top:0;bottom:0;left:0;width:125%;transform:skewX(-14deg) translateX(-115%)}
#bc .bc-wp::before{background:linear-gradient(120deg,color-mix(in srgb,var(--c0,#2f7bff) 55%,#000),var(--c0,#2f7bff))}#bc .bc-wp::after{background:linear-gradient(240deg,color-mix(in srgb,var(--c1,#ff4d43) 55%,#000),var(--c1,#ff4d43))}
#bc .bc-wp.go::before{animation:bcW .46s cubic-bezier(.65,0,.35,1)}#bc .bc-wp.go::after{animation:bcW .46s .07s cubic-bezier(.65,0,.35,1)}
@keyframes bcW{from{transform:skewX(-14deg) translateX(-115%)}to{transform:skewX(-14deg) translateX(115%)}}
/* escena 1: escudos */
#bc .bc-bg{position:absolute;top:0;bottom:0;width:62%;opacity:.9}
#bc .bc-bg.l{left:-12%;background:linear-gradient(120deg,color-mix(in srgb,var(--c0,#2f7bff) 55%,#000),var(--c0,#2f7bff));animation:bcPl .7s cubic-bezier(.2,.9,.2,1) both}
#bc .bc-bg.r{right:-12%;background:linear-gradient(240deg,color-mix(in srgb,var(--c1,#ff4d43) 55%,#000),var(--c1,#ff4d43));animation:bcPr .7s cubic-bezier(.2,.9,.2,1) both}
@keyframes bcPl{from{transform:skewX(-12deg) translateX(-115%)}to{transform:skewX(-12deg)}}@keyframes bcPr{from{transform:skewX(-12deg) translateX(115%)}to{transform:skewX(-12deg)}}
#bc .bc-c{position:relative;z-index:2;margin:auto;width:100%;max-width:760px;padding:16px;text-align:center}
#bc .bc-lg{display:flex;justify-content:center;align-items:center;gap:12px;font-size:22px;letter-spacing:.14em;text-transform:uppercase;animation:bcUp .5s .45s both}
#bc .bc-lg .lgl{height:56px;width:auto}
#bc .bc-t{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:6px;margin:18px 0}
#bc .bc-tm{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:0}
#bc .bc-tm b{font-size:clamp(22px,5.4vw,40px);line-height:1;text-transform:uppercase;text-shadow:0 3px 14px rgba(0,0,0,.6)}
#bc .bc-tm.l{animation:bcSl .65s .3s cubic-bezier(.2,1.4,.4,1) both}#bc .bc-tm.r{animation:bcSr .65s .4s cubic-bezier(.2,1.4,.4,1) both}
#bc .bc-cr{filter:drop-shadow(0 8px 18px rgba(0,0,0,.6));animation:bcFl 3.2s 1.2s ease-in-out infinite}
#bc .bc-cr .cr{width:clamp(90px,26vw,160px)!important;height:auto!important}
#bc .bc-vs{font-size:clamp(44px,11vw,90px);font-weight:700;font-style:italic;color:var(--hi);text-shadow:0 0 26px var(--hi);animation:bcVs .5s .8s cubic-bezier(.2,1.8,.4,1) both}
@keyframes bcUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes bcSl{from{opacity:0;transform:translateX(-100px) scale(.7)}to{opacity:1;transform:none}}@keyframes bcSr{from{opacity:0;transform:translateX(100px) scale(.7)}to{opacity:1;transform:none}}
@keyframes bcVs{from{opacity:0;transform:scale(.2) rotate(-12deg)}to{opacity:1;transform:none}}@keyframes bcFl{50%{transform:translateY(-7px)}}
/* escena 2: clasificación */
#bc .bc-tt{display:flex;align-items:center;gap:14px;margin:16px 14px 0;animation:bcHd .55s cubic-bezier(.2,.9,.2,1) both}
#bc .bc-tt .lgl{height:56px;width:auto}#bc .bc-tt small{display:block;font-size:14px;letter-spacing:.2em;text-transform:uppercase;opacity:.8}
#bc .bc-tt b{font-size:clamp(32px,9vw,48px);line-height:1;text-transform:uppercase;letter-spacing:.03em}
#bc .bc-tb{display:flex;flex-direction:column;gap:5px;margin:14px;max-width:640px;align-self:center;width:calc(100% - 28px)}
#bc .bc-th,#bc .bc-r{display:grid;grid-template-columns:30px 32px 1fr 32px 42px 44px;align-items:center;gap:8px;padding:6px 12px 6px 8px}
#bc .bc-th{font-size:13px;letter-spacing:.14em;opacity:.65}
#bc .bc-r{background:rgba(255,255,255,.08);border-left:4px solid rgba(255,255,255,.2);clip-path:polygon(0 0,100% 0,calc(100% - 14px) 100%,0 100%);font-size:20px;animation:bcRow .5s var(--d) cubic-bezier(.2,.9,.2,1) both}
#bc .bc-r em{font-style:normal;font-weight:700;opacity:.8;text-align:center}#bc .bc-r b{font-weight:700;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#bc .bc-r span .cr{width:26px!important;height:26px!important;object-fit:contain}
#bc .bc-r i,#bc .bc-th span:nth-child(n+4){font-style:normal;text-align:right}#bc .bc-r strong{text-align:right;color:var(--hi);font-size:24px}
#bc .bc-r.h{background:linear-gradient(90deg,color-mix(in srgb,var(--c0,#2f7bff) 60%,transparent),color-mix(in srgb,var(--c0,#2f7bff) 14%,transparent));border-left-color:var(--c0,#2f7bff)}
#bc .bc-r.a{background:linear-gradient(90deg,color-mix(in srgb,var(--c1,#ff4d43) 60%,transparent),color-mix(in srgb,var(--c1,#ff4d43) 14%,transparent));border-left-color:var(--c1,#ff4d43)}
#bc .bc-gp{text-align:center;opacity:.45;letter-spacing:.6em;line-height:.5;font-size:22px}
@keyframes bcRow{from{opacity:0;transform:translateX(-46px)}to{opacity:1;transform:none}}
/* escenas 3 y 4: alineaciones */
#bc .bc-lu{display:flex;flex-direction:column;height:100%}
#bc .bc-hd{display:flex;align-items:center;gap:12px;margin:12px 14px 0;padding:8px 16px 8px 10px;background:linear-gradient(100deg,var(--c),color-mix(in srgb,var(--c) 40%,#000));border-radius:4px 22px 4px 22px;box-shadow:0 8px 24px rgba(0,0,0,.5);animation:bcHd .55s cubic-bezier(.2,.9,.2,1) both}
#bc .bc-hd small{display:block;font-size:13px;letter-spacing:.2em;text-transform:uppercase;opacity:.85}
#bc .bc-hd b{display:block;font-size:clamp(24px,7vw,36px);line-height:1;text-transform:uppercase;letter-spacing:.03em}
#bc .bc-hcr .cr{width:50px!important;height:auto!important;filter:drop-shadow(0 3px 6px rgba(0,0,0,.5))}
#bc .bc-fm{margin-left:auto;font-size:clamp(28px,8vw,42px);font-weight:700;color:var(--hi);text-shadow:0 2px 0 rgba(0,0,0,.4)}
@keyframes bcHd{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:none}}
#bc .bc-pit{position:relative;flex:1;min-height:0;margin:8px 12px;border-radius:10px;overflow:hidden;background:repeating-linear-gradient(0deg,#15612f 0 10%,#1a7338 10% 20%);box-shadow:0 10px 30px rgba(0,0,0,.5),inset 0 0 0 2px rgba(255,255,255,.5);animation:bcIn .6s .15s both}
#bc .bc-pit::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 45%,transparent 50%,rgba(0,0,0,.45));pointer-events:none}
#bc .bc-pit i{position:absolute;border:2px solid rgba(255,255,255,.45)}
#bc .bc-hl{left:0;right:0;top:50%;height:0;border-width:2px 0 0!important}
#bc .bc-cc{left:50%;top:50%;width:26%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%}
#bc .bc-bx{left:26%;right:26%;height:14%}#bc .bc-bx.t{top:-2px;border-top:0}#bc .bc-bx.b{bottom:-2px;border-bottom:0}
#bc .bc-pl{position:absolute;z-index:2;width:var(--w,21%);transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:4px;animation:bcPop .45s var(--d) cubic-bezier(.2,1.5,.4,1) both}
#bc .bc-pl u{position:relative;text-decoration:none;display:grid;place-items:center;width:clamp(40px,12vw,56px);aspect-ratio:1;border-radius:50%;background:var(--c);border:2.5px solid #fff;font:700 clamp(20px,6vw,28px)/1 'Barlow Condensed',sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.6)}
#bc .bc-pl span{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:rgba(5,9,18,.92);border-left:3px solid var(--hi);padding:2px 4px;font:700 clamp(12px,3.6vw,16px)/1.25 'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:0;transform:skewX(-8deg)}
#bc .bc-pl em{position:absolute;top:-9px;right:-15px;font:700 11px/1.35 'Barlow Condensed',sans-serif;font-style:normal;color:var(--hi);background:#050912;border:1px solid var(--hi);border-radius:8px;padding:0 4px;transform:skewX(0)}
@keyframes bcPop{from{opacity:0;transform:translate(-50%,-30%) scale(.2)}to{opacity:1;transform:translate(-50%,-50%)}}
#bc .bc-bn{display:flex;flex-wrap:wrap;align-items:center;gap:3px 12px;margin:0 14px 12px;padding:7px 12px;background:rgba(255,255,255,.07);border-top:2px solid var(--c);font-size:14px;text-transform:uppercase;letter-spacing:.04em;animation:bcUp .5s .9s both}
#bc .bc-bn b{color:var(--hi);letter-spacing:.14em}
/* escena 5: saque inicial */
#bc .bc-ko{margin:auto;text-align:center;display:flex;flex-direction:column;align-items:center;gap:14px}
#bc .bc-ko b{font-size:clamp(38px,11vw,72px);line-height:1;text-transform:uppercase;font-style:italic;text-shadow:0 0 26px var(--hi);animation:bcVs .5s both}
#bc .bc-kc{display:flex;align-items:center;gap:18px}#bc .bc-kc .cr{width:clamp(60px,18vw,96px)!important;height:auto!important}
#bc .bc-kc span{font-size:clamp(34px,9vw,54px);animation:bcSpin 1.2s linear infinite}@keyframes bcSpin{to{transform:rotate(360deg)}}
/* v2: ritmo más ágil + escenas 1 y 5 */
#bc .bc-sc{animation-duration:.3s}
#bc .bc-lg{animation-delay:.2s}#bc .bc-tm.l{animation-delay:.1s}#bc .bc-tm.r{animation-delay:.2s}#bc .bc-vs{position:relative;animation-delay:.45s}
#bc .bc-beam{position:absolute;z-index:1;top:-12%;width:42%;height:135%;pointer-events:none;mix-blend-mode:screen;filter:blur(16px);background:linear-gradient(180deg,rgba(255,255,255,.5),transparent 72%);opacity:.18;animation:bcBeam 2.6s ease-in-out infinite}
#bc .bc-beam.l{left:-6%;transform:rotate(-24deg);transform-origin:top left}#bc .bc-beam.r{right:-6%;transform:rotate(24deg);transform-origin:top right;animation-delay:.9s}
@keyframes bcBeam{50%{opacity:.4}}
#bc .bc-role{font-size:14px;letter-spacing:.32em;text-transform:uppercase;opacity:.85}
#bc .bc-lg{font-size:26px}
#bc .bc-rk{display:flex;align-items:baseline;gap:6px;background:rgba(5,9,18,.6);border:1px solid rgba(255,255,255,.4);border-radius:999px;padding:0 14px;font-size:22px;animation:bcUp .45s .7s both}
#bc .bc-rk b{color:var(--hi)}#bc .bc-rk small{font-size:15px;opacity:.85;letter-spacing:.08em}
#bc .bc-vs i{position:absolute;left:50%;top:50%;width:22px;height:22px;margin:-11px;border-radius:50%;border:3px solid var(--hi);opacity:0;animation:bcRing .8s .6s ease-out both}
@keyframes bcRing{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(13)}}
#bc .bc-ko{position:absolute;inset:0;margin:0;justify-content:center;gap:12px;overflow:hidden}
#bc .bc-fl{position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,rgba(255,255,255,.9),transparent 62%);animation:bcFlash .7s ease-out both}
@keyframes bcFlash{from{opacity:1}to{opacity:0}}
#bc .bc-ring{position:absolute;left:50%;top:42%;width:60px;height:60px;margin:-30px;border:3px solid #fff;border-radius:50%;opacity:0;animation:bcRing2 1s .05s ease-out both}#bc .bc-ring.r2{animation-delay:.3s;border-color:var(--hi)}
@keyframes bcRing2{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(12)}}
#bc .bc-ball{position:relative;font-size:clamp(64px,19vw,104px);line-height:1;animation:bcVs .5s .05s both;filter:drop-shadow(0 8px 14px rgba(0,0,0,.6))}
#bc .bc-ball span{display:inline-block;animation:bcSpin 1s linear infinite}
#bc .bc-ko b{position:relative;animation-delay:.2s}
#bc .bc-sbug{position:relative;display:flex;align-items:center;gap:12px;margin-top:8px;max-width:94%;background:linear-gradient(90deg,#17419a,#0a1226 50%,#a8231d);border:1px solid rgba(255,255,255,.3);border-radius:4px 18px 4px 18px;padding:6px 16px;font-size:clamp(17px,4.8vw,26px);text-transform:uppercase;box-shadow:0 8px 24px rgba(0,0,0,.5);animation:bcUp .45s .4s both}
#bc .bc-sbug>span{display:flex;align-items:center;gap:8px;min-width:0}#bc .bc-sbug em{font-style:normal;max-width:24vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#bc .bc-sbug .cr{width:34px!important;height:34px!important;object-fit:contain}#bc .bc-sbug strong{font-size:1.6em;color:var(--hi);line-height:1}#bc .bc-sbug u{text-decoration:none;opacity:.8;font-size:.85em}
@media(prefers-reduced-motion:reduce){#bc *{animation:none!important}#bc .bc-pg i.on b{width:100%}#bc .bc-wp{display:none}}`;document.head.appendChild(st)}


/* ===== INTRO DE LA CHAMPIONS CUP: misma estructura que la de liga, otra disposición, tipografía, textos y colores ===== */
function bcCcCss(){if(document.getElementById('bccsty'))return;const st=document.createElement('style');st.id='bccsty';st.textContent=`
#bc.bcx{--hi:#00f0e0;--gd:#ffc233;font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;font-weight:700;
 background:radial-gradient(760px 420px at 50% -6%,rgba(0,240,224,.26),transparent),radial-gradient(520px 360px at 105% 105%,rgba(255,194,51,.16),transparent),radial-gradient(1.5px 1.5px at 18px 22px,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 70px 64px,rgba(255,255,255,.5),transparent),radial-gradient(1.5px 1.5px at 104px 12px,rgba(150,255,255,.8),transparent),#03061a;
 background-size:auto,auto,120px 90px,120px 90px,120px 90px}
#bc.bcx .bc-pg b{background:linear-gradient(90deg,#00f0e0,#ffc233)}
#bc.bcx .bc-top{letter-spacing:.2em;font-weight:600}
#bc.bcx .bc-sk,#bc.bcx .bc-pl u,#bc.bcx .bc-pl span,#bc.bcx .bc-fm{font-family:inherit}
#bc.bcx .bc-sk{border-color:var(--hi);color:var(--hi);background:rgba(0,240,224,.08);font-size:12px;font-weight:700}
#bc.bcx .bc-wp::before{background:linear-gradient(120deg,color-mix(in srgb,var(--c0,#00f0e0) 55%,#000),var(--c0,#00f0e0))}#bc.bcx .bc-wp::after{background:linear-gradient(240deg,color-mix(in srgb,var(--c1,#ffc233) 55%,#000),var(--c1,#ffc233))}
/* escena 1: bloques escalonados */
#bc .cx-c{position:relative;z-index:2;margin:auto;width:100%;max-width:560px;padding:14px 18px;display:flex;flex-direction:column;gap:12px}
#bc .cx-lg{display:flex;align-items:center;gap:14px;animation:bcUp .5s .1s both}
#bc .cx-lg .lgl{height:76px;width:auto;max-width:34%;object-fit:contain;filter:drop-shadow(0 0 14px var(--hi))}
#bc .cx-lg small{display:block;font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:var(--gd)}
#bc .cx-lg b{display:block;font-size:clamp(26px,7.5vw,38px);line-height:1.02;letter-spacing:.06em;text-transform:uppercase;color:#fff;text-shadow:0 0 22px rgba(0,240,224,.7)}
#bc .cx-lg em{display:inline-block;margin-top:6px;font-style:normal;font-size:13px;letter-spacing:.14em;text-transform:uppercase;padding:3px 10px;border:1px solid var(--hi);color:var(--hi);border-radius:999px}
#bc .cx-t{display:flex;align-items:center;gap:14px;padding:10px 16px;border-radius:6px 28px 6px 28px;background:linear-gradient(100deg,color-mix(in srgb,var(--c0,#00f0e0) 55%,transparent),color-mix(in srgb,var(--c0,#00f0e0) 8%,transparent));border:1px solid var(--c0,#00f0e0);box-shadow:0 10px 28px rgba(0,0,0,.5),0 0 22px color-mix(in srgb,var(--c0,#00f0e0) 35%,transparent)}
#bc .cx-t.r{flex-direction:row-reverse;text-align:right;border-radius:28px 6px 28px 6px;background:linear-gradient(260deg,color-mix(in srgb,var(--c1,#ffc233) 55%,transparent),color-mix(in srgb,var(--c1,#ffc233) 8%,transparent));border-color:var(--c1,#ffc233);box-shadow:0 10px 28px rgba(0,0,0,.5),0 0 22px color-mix(in srgb,var(--c1,#ffc233) 35%,transparent)}
#bc .cx-t.l{animation:bcSl .6s .25s cubic-bezier(.2,1.3,.4,1) both}#bc .cx-t.r{animation:bcSr .6s .4s cubic-bezier(.2,1.3,.4,1) both}
#bc .cx-cr{flex:none;filter:drop-shadow(0 6px 14px rgba(0,0,0,.6));animation:bcFl 3.2s 1.2s ease-in-out infinite}
#bc .cx-cr .cr{width:clamp(78px,24vw,120px)!important;height:auto!important}
#bc .cx-t>div{min-width:0;flex:1}
#bc .cx-t small{display:block;font-size:12px;letter-spacing:.3em;text-transform:uppercase;opacity:.85}
#bc .cx-t b{display:block;font-size:clamp(20px,5.6vw,30px);line-height:1.1;text-transform:uppercase;letter-spacing:.03em;overflow-wrap:anywhere}
#bc .cx-vs{display:flex;align-items:center;gap:12px;animation:bcVs .5s .6s cubic-bezier(.2,1.8,.4,1) both}
#bc .cx-vs span{flex:1;height:2px;background:linear-gradient(90deg,transparent,var(--hi),transparent)}
#bc .cx-vs b{font-size:clamp(26px,7vw,40px);font-weight:800;color:var(--gd);letter-spacing:.2em;text-shadow:0 0 18px var(--gd)}
/* escena 2: grupo / resultado de la ida */
#bc .cx-g{margin:auto;width:calc(100% - 28px);max-width:520px;display:flex;flex-direction:column;gap:9px}
#bc .cx-gh{text-align:center;margin-bottom:4px;animation:bcUp .5s both}
#bc .cx-gh small{display:block;font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--gd)}
#bc .cx-gh b{display:block;font-size:clamp(30px,9vw,46px);letter-spacing:.08em;text-transform:uppercase;text-shadow:0 0 22px rgba(0,240,224,.7)}
#bc .cx-gr{display:grid;grid-template-columns:26px 28px minmax(0,1fr) 30px 40px 40px;gap:8px;align-items:center;padding:9px 12px;border-radius:4px 16px 4px 16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);font-size:17px;animation:bcRow .5s var(--d,.1s) cubic-bezier(.2,.9,.2,1) both}
#bc .cx-gr b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-transform:uppercase;font-size:16px}
#bc .cx-gr em{font-style:normal;color:var(--hi);text-align:center}#bc .cx-gr i{font-style:normal;text-align:right}#bc .cx-gr strong{text-align:right;color:var(--gd);font-size:20px}
#bc .cx-gr .cr{width:26px!important;height:26px!important;object-fit:contain}
#bc .cx-gr.h{border-color:var(--hi);background:linear-gradient(90deg,rgba(0,240,224,.34),rgba(0,240,224,.06))}
#bc .cx-gr.a{border-color:var(--gd);background:linear-gradient(90deg,rgba(255,194,51,.34),rgba(255,194,51,.06))}
#bc .cx-gr.hd{background:none;border:0;font-size:12px;letter-spacing:.14em;opacity:.65;padding-top:0;padding-bottom:0;animation:none}
#bc .cx-gr.hd span:nth-child(n+4){text-align:right}
#bc .cx-id{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;padding:16px 12px;border-radius:6px 28px 6px 28px;background:rgba(255,255,255,.06);border:1px solid var(--hi);animation:bcUp .5s .2s both}
#bc .cx-id>div{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:0;text-align:center}
#bc .cx-id b{font-size:clamp(15px,4.4vw,22px);text-transform:uppercase;overflow-wrap:anywhere}
#bc .cx-id strong{font-size:clamp(34px,10vw,52px);color:var(--gd);text-shadow:0 0 18px var(--gd)}
#bc .cx-cap{text-align:center;font-size:12px;letter-spacing:.3em;text-transform:uppercase;opacity:.7;margin:0}
/* alineaciones */
#bc.bcx .bc-hd{border-radius:20px 4px 20px 4px;border:1px solid rgba(255,255,255,.25);background:linear-gradient(100deg,var(--c),color-mix(in srgb,var(--c) 35%,#020512))}
#bc.bcx .bc-hd b{letter-spacing:.06em;font-weight:800}#bc.bcx .bc-hd small{letter-spacing:.26em}
#bc.bcx .bc-fm{color:#fff;font-weight:800}
#bc.bcx .bc-pit{background:repeating-linear-gradient(90deg,#0a3b45 0 12.5%,#0d4752 12.5% 25%);box-shadow:0 10px 30px rgba(0,0,0,.5),inset 0 0 0 2px rgba(0,240,224,.55)}
#bc.bcx .bc-pit i{border-color:rgba(0,240,224,.45)}
#bc.bcx .bc-pl u{border-radius:14px;border-color:var(--gd)}
#bc.bcx .bc-pl span{border-left:0;border-bottom:2px solid var(--gd);transform:none;background:rgba(2,6,26,.92);font-weight:700}
#bc.bcx .bc-pl em{color:var(--gd);border-color:var(--gd);font-family:inherit}
#bc.bcx .bc-pl span{font-size:clamp(10px,3vw,13px)}
#bc.bcx .bc-bn{border-top-color:var(--gd)}#bc.bcx .bc-bn b{color:var(--gd)}
/* saque inicial */
#bc.bcx .bc-ko b{font-style:normal;letter-spacing:.1em;font-weight:800;font-size:clamp(28px,8vw,52px);color:#fff;text-shadow:0 0 26px var(--hi)}
#bc .cx-lh .lgl{height:clamp(80px,22vw,120px);width:auto;filter:drop-shadow(0 0 22px var(--hi));animation:bcVs .5s .05s both}
#bc .cx-sb{position:relative;display:flex;align-items:center;gap:12px;margin-top:6px;max-width:94%;background:linear-gradient(90deg,rgba(0,240,224,.5),#050a22 50%,rgba(255,194,51,.5));border:1px solid rgba(255,255,255,.3);border-radius:18px 4px 18px 4px;padding:6px 16px;font-size:clamp(15px,4.4vw,22px);text-transform:uppercase;letter-spacing:.04em;box-shadow:0 8px 24px rgba(0,0,0,.5);animation:bcUp .45s .4s both}
#bc .cx-sb>span{display:flex;align-items:center;gap:8px;min-width:0}#bc .cx-sb em{font-style:normal;max-width:24vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#bc .cx-sb .cr{width:34px!important;height:34px!important;object-fit:contain}#bc .cx-sb strong{font-size:1.5em;color:var(--gd);line-height:1}
`;document.head.appendChild(st)}

/* datos de la Champions Cup previos al partido (ccSimDay ya lo ha simulado, así que se excluye) */
function bcCC(h,a){try{const c=G.cc,k=c.k-1,s=CCS[k];
 if(s.st=='gr'){const g=c.gr.g.findIndex(x=>x.includes(h)),t={};c.gr.g[g].forEach(i=>t[i]={id:i,pj:0,gf:0,gc:0,pts:0});
  c.res.filter(r=>r.st=='gr'&&r.g==g&&r.k!=k).forEach(r=>[[r.h,r.hg,r.ag],[r.a,r.ag,r.hg]].forEach(([i,f,e])=>{const x=t[i];x.pj++;x.gf+=f;x.gc+=e;x.pts+=f>e?3:f==e?1:0}));
  return{st:'gr',g:'ABCDEFGH'[g],rows:Object.values(t).map(x=>({...x,dg:x.gf-x.gc})).sort((x,y)=>y.pts-x.pts||y.dg-x.dg||y.gf-x.gf||x.id-y.id)}}
 if(s.leg&&s.st!='fi'){const T=s.st=='po'?c.po:c.ko[s.st],t=T.find(x=>(x.a==h&&x.b==a)||(x.a==a&&x.b==h));if(t&&t.l[0])return{st:'ko',h:t.a,a:t.b,l:t.l[0]}}
}catch(e){}return null}

/* reduce la letra de los nombres de la alineación que no caben en su recuadro */
function bcFit(r){r.querySelectorAll('.bc-pl span').forEach(e=>{let f=parseFloat(getComputedStyle(e).fontSize)||14;while(e.scrollWidth>e.clientWidth+1&&f>9){f-=.5;e.style.fontSize=f+'px'}})}

function bcIntro(m,start){
 bcCss();
 const [rd,lg,h,a]=m.r,ids=[h,a],T=ids.map(i=>G.T[i]),COL=[tcol(h,0),tcol(a,1)],
  sn=n=>{const p=String(n).split(' ');return p.length>1?p.slice(1).join(' '):n},
  esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])),
  jr=m.cl?' · '+m.cl:Number.isFinite(rd)?' · Jornada '+(rd+1):'',fm=t=>String(t.form||'').split(' ')[0];
 const rows=bcTable(lg,rd),pi=rows?rows.findIndex(r=>r.id==h):-1,qi=rows?rows.findIndex(r=>r.id==a):-1,keep=new Set();
 [pi,qi].forEach(i=>{if(i>=0)for(let k=i-1;k<=i+1;k++)if(k>=0&&k<rows.length)keep.add(k)});
 const rk=s=>{const i=s?qi:pi;return rows&&i>=0?`<div class="bc-rk"><b>${i+1}º</b><small>${rows[i].pts} pts</small></div>`:''};
 const cc=!!m.cc,ccd=cc?bcCC(h,a):null;let neu=0;if(cc){bcCcCss();try{neu=CCS[G.cc.k-1].st=='fi'}catch(e){}}
 const S1c=()=>`<div class="cx-c"><div class="cx-lg">${lgl(3,76)}<div><small>Temporada ${G.season}</small><b>Champions Cup</b><em>${esc(m.cl||'')}</em></div></div>
  ${[0,1].map(s=>`<div class="cx-t ${s?'r':'l'}"><span class="cx-cr">${crest(ids[s],120)}</span><div><small>${neu?'Campo neutral':s?'Visitante':'Local'}</small><b>${esc(T[s].n)}</b>${form5(ids[s])}</div></div>`).join('<div class="cx-vs"><span></span><b>VS</b><span></span></div>')}</div>`;
 const S2c=()=>{if(!ccd)return'';const hl=id=>id==h?' h':id==a?' a':'';
  if(ccd.st=='gr')return `<div class="cx-g"><div class="cx-gh"><small>${esc(m.cl||'')}</small><b>Grupo ${ccd.g}</b></div><div class="cx-gr hd"><span></span><span></span><span>Equipo</span><span>PJ</span><span>DG</span><span>PTS</span></div>${ccd.rows.map((r,k)=>`<div class="cx-gr${hl(r.id)}" style="--d:${(.2+k*.08).toFixed(2)}s"><em>${k+1}</em><span>${crest(r.id,26)}</span><b>${esc(G.T[r.id].n)}</b><i>${r.pj}</i><i>${r.dg>0?'+'+r.dg:r.dg}</i><strong>${r.pts}</strong></div>`).join('')}</div>`;
  return `<div class="cx-g"><div class="cx-gh"><small>${esc(m.cl||'')}</small><b>Eliminatoria</b></div><div class="cx-id"><div>${crest(ccd.h,64)}<b>${esc(G.T[ccd.h].n)}</b></div><strong>${ccd.l[0]} - ${ccd.l[1]}</strong><div>${crest(ccd.a,64)}<b>${esc(G.T[ccd.a].n)}</b></div></div><p class="cx-cap">Resultado de la ida</p></div>`};
 const S5c=()=>`<div class="bc-ko"><div class="bc-fl"></div><i class="bc-ring"></i><i class="bc-ring r2"></i><div class="cx-lh">${lgl(3,110)}</div><b>¡Arranca la Champions!</b>
  <div class="cx-sb"><span>${crest(h,34)}<em>${esc(T[0].n)}</em></span><strong>0 - 0</strong><span class="r"><em>${esc(T[1].n)}</em>${crest(a,34)}</span></div></div>`;
 const S1=()=>`<div class="bc-beam l"></div><div class="bc-beam r"></div><div class="bc-bg l"></div><div class="bc-bg r"></div><div class="bc-c"><div class="bc-lg">${lgl(lg,60)}<span>${lg==3?'Champions Cup':'Liga '+lg}${jr}</span></div>
  <div class="bc-t">${[0,1].map(s=>`<div class="bc-tm ${s?'r':'l'}"><small class="bc-role">${s?'Visitante':'Local'}</small><span class="bc-cr">${crest(ids[s],150)}</span><b>${esc(T[s].n)}</b>${rk(s)}${form5(ids[s],rd)}</div>`).join('<div class="bc-vs"><i></i>VS</div>')}</div></div>`;
 const S2=()=>{let body='',prev=-1,n=0;[...keep].sort((x,y)=>x-y).forEach(k=>{const r=rows[k];if(prev>=0&&k>prev+1)body+='<div class="bc-gp">···</div>';prev=k;
   body+=`<div class="bc-r${r.id==h?' h':r.id==a?' a':''}" style="--d:${(.2+n++*.07).toFixed(2)}s"><em>${k+1}</em><span>${crest(r.id,26)}</span><b>${esc(G.T[r.id].n)}</b><i>${r.pj}</i><i>${r.dg>0?'+'+r.dg:r.dg}</i><strong>${r.pts}</strong></div>`});
  return `<div class="bc-tt">${lgl(lg,56)}<div><small>${lg==3?'Champions Cup':'Liga '+lg}${jr}</small><b>Clasificación</b></div></div><div class="bc-tb"><div class="bc-th"><span></span><span></span><span>Equipo</span><span>PJ</span><span>DG</span><span>PTS</span></div>${body}</div>`};
 const LU=s=>{const t=T[s],rw=bcRows(t),N=bcNums(t),R=rw.length;
  const pl=rw.map((r,k)=>r.map((li,j)=>{const p=t.pl[t.lu[li]],n=r.length,lo=n==2?28:n==3?19:n==4?14:11,sp=n>1?(100-2*lo)/(n-1):40,x=n>1?lo+j*sp:50,y=R>1?9+k*82/(R-1):50,w=Math.min(34,sp*1.06);
   return `<div class="bc-pl" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;--w:${w.toFixed(1)}%;--d:${(.25+(R-1-k)*.14+j*.05).toFixed(2)}s"><u>${N[li]}<em>${Math.round(ef(p))}</em></u><span>${esc(sn(p.n))}</span></div>`}).join('')).join('');
  const bn=(t.bn||[]).slice(0,8).map(i=>t.pl[i]).filter(Boolean).map(p=>`<span>${esc(sn(p.n))}</span>`).join('');
  return `<div class="bc-lu" style="--c:${COL[s]}"><div class="bc-hd"><span class="bc-hcr">${crest(ids[s],54)}</span><div><small>${s?'Visitante':'Local'} · Alineación</small><b>${esc(t.n)}</b></div><div class="bc-fm">${fm(t)}</div></div>
   <div class="bc-pit"><i class="bc-hl"></i><i class="bc-cc"></i><i class="bc-bx t"></i><i class="bc-bx b"></i>${pl}</div><div class="bc-bn"><b>Banquillo</b>${bn}</div></div>`};
 const S5=()=>`<div class="bc-ko"><div class="bc-fl"></div><i class="bc-ring"></i><i class="bc-ring r2"></i><div class="bc-ball"><span>⚽</span></div><b>¡Empieza el partido!</b>
  <div class="bc-sbug"><span>${crest(h,34)}<em>${esc(T[0].n)}</em></span><strong>0 - 0</strong><span class="r"><em>${esc(T[1].n)}</em>${crest(a,34)}</span><u>0'</u></div></div>`;
 const sc=[{h:cc?S1c:S1,d:2900},...(cc?(ccd?[{h:S2c,d:3200}]:[]):keep.size?[{h:S2,d:3200}]:[]),{h:()=>LU(0),d:4200},{h:()=>LU(1),d:4200},{h:cc?S5c:S5,d:2000}];
 const o=document.createElement('div');o.id='bc';if(cc)o.classList.add('bcx');tcSet(o,ids);
 o.innerHTML=`<div class="bc-pg">${sc.map(()=>'<i><b></b></i>').join('')}</div><div class="bc-top"><span>Toca para avanzar</span><button class="bc-sk" type="button">Saltar ⏭</button></div><div class="bc-st"></div><div class="bc-wp"></div>`;
 document.body.appendChild(o);
 const st=o.querySelector('.bc-st'),wp=o.querySelector('.bc-wp'),pg=[...o.querySelectorAll('.bc-pg i')];let tm=0,fin=0,lt=0,sw=0;
 const kd=e=>{if(e.key=='Enter'||e.key==' '||e.key=='ArrowRight'){e.preventDefault();nx()}else if(e.key=='Escape')end()};
 function end(){if(fin)return;fin=1;clearTimeout(tm);clearTimeout(sw);document.removeEventListener('keydown',kd);try{start()}finally{o.classList.add('out');setTimeout(()=>o.remove(),480)}}
 function go(k){if(fin)return;clearTimeout(tm);if(k>=sc.length)return end();lt=Date.now();
  const put=()=>{st.innerHTML='<div class="bc-sc">'+sc[k].h()+'</div>';bcFit(st);pg.forEach((e,j)=>{e.className=j<k?'d':j==k?'on':'';e.style.setProperty('--t',sc[k].d+'ms')})};
  if(!k)put();else{wp.classList.remove('go');void wp.offsetWidth;wp.classList.add('go');sw=setTimeout(()=>{if(!fin)put()},230)}
  cur=k;tm=setTimeout(()=>go(k+1),sc[k].d+(k?230:0))}
 let cur=0;const nx=()=>{if(Date.now()-lt>300)go(cur+1)};
 o.addEventListener('click',e=>{if(e.target.closest('.bc-sk'))end();else nx()});document.addEventListener('keydown',kd);
 go(0)}
