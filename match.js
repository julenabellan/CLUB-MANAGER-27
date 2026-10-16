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
ev.sort((x,y)=>x.min-y.min);
/* ---- pantalla ---- */
if(!document.getElementById('lvhd')){const st=document.createElement('style');st.id='lvhd';st.textContent=`
#lv .lvtop{position:relative;overflow:hidden;isolation:isolate;padding:12px 14px 14px;border-radius:16px;border:1px solid rgba(255,255,255,.2);
 background:radial-gradient(120% 140% at 50% 0%,color-mix(in srgb,var(--ac) 88%,#fff) 0%,var(--ac) 38%,color-mix(in srgb,var(--ac) 50%,#000) 100%);
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
const o=document.createElement('div');o.id='lv';
const cr=(i,s)=>crest(i,s);
o.innerHTML=`<div class="lvc"><div class="lvtop"><img class="lvbg" src="img/LOGO%20${m.r[1]}A.png" alt="" onerror="this.style.display='none'"><div class="lvtm">${cr(ids[0],54)}${form5(ids[0],m.r[0])}<b>${T[0].n}</b></div>
<div class="lvmid"><div>${lgl(m.r[1],96)}</div><div class="sc" id="lvs">0 - 0</div><div class="lvmin" id="lvm">0'</div></div>
<div class="lvtm r">${cr(ids[1],54)}${form5(ids[1],m.r[0])}<b>${T[1].n}</b></div>
<div class="lvg"><div id="lg0"></div><div id="lg1" class="r"></div></div></div>
<div class="bar"><i id="lvk" style="width:0"></i></div>
<div class="lvst"><div><span id="sh0">0</span><small>Tiros</small><span id="sh1">0</span></div><div><span id="co0">0</span><small>Córners</small><span id="co1">0</span></div><div><span id="fo0">0</span><small>Faltas</small><span id="fo1">0</span></div></div>
<div id="lvf"></div><div class="lvh" id="lvh" style="display:none">↕ Desliza para ver todas las acciones</div>
<div class="lvbt"><div class="lvtac" id="lvtac"><button data-t="d">🛡️ Defensivo</button><button data-t="e" class="on">⚖️ Equilibrado</button><button data-t="o">⚔️ Ofensivo</button></div><div class="lvct"><button data-v="1" class="on">x1</button><button data-v="2">x2</button><button data-v="4">x4</button><button id="lvsb">Cambios (5)</button><button data-v="60">Saltar</button><button class="p" id="lvok" style="display:none">Continuar</button></div></div></div>`;
document.body.appendChild(o);
const q=s=>o.querySelector(s),feed=q('#lvf');
let min=0,sp=1,pause=0,pz=0,sc=[0,0],sh=[0,0],co=[0,0],fo=[0,0],yc=[0,0],ei=0,last=performance.now(),half=0,fin=0,subs=0,tac='e';const gl=[[],[]];
const hold=x=>x/(sp>10?40:1);
/* se ven las 5 últimas acciones; las anteriores quedan debajo y se ven deslizando */
const fit=()=>{q('#lvh').style.display=feed.scrollHeight>feed.clientHeight+2?'':'none'};
const say=(min,s,t,c)=>{const d=document.createElement('div');d.className='lm l'+s+' '+(c||'');d.innerHTML=`${s<2?cr(ids[s],22):''}<div><small>${min}'</small><span>${t}</span></div>`;const top=feed.scrollTop,h0=feed.scrollHeight;feed.prepend(d);if(top>4)feed.scrollTop=top+feed.scrollHeight-h0;if(!fin)fit()};
const rsz=()=>{if(!fin)fit()};window.addEventListener('resize',rsz);
o.querySelectorAll('.lvct button[data-v]').forEach(b=>b.onclick=()=>{sp=+b.dataset.v;o.querySelectorAll('.lvct button[data-v]').forEach(x=>x.classList.toggle('on',x==b))});
say(0,2,'¡Comienza el partido!','h');
const fill=(t,e)=>t.replace(/\{p\}/g,'<b>'+e.who+'</b>').replace(/\{a\}/g,'<b>'+(e.as||'')+'</b>').replace(/\{k\}/g,'<b>'+(e.gk||'el portero')+'</b>').replace(/\{o\}/g,'<b>'+(e.opp||'un rival')+'</b>');
function fire(e){const t=fill(deck[e.k=='goal'?gk(e):e.k](),e);
 if(e.k=='goal'){sc[e.s]++;sh[e.s]++;pause=hold(1.8);gl[e.s].push(`${e.min}' ${e.who}${e.as?' <i>(as. '+e.as+')</i>':''}`);q('#lg'+e.s).innerHTML=gl[e.s].join('<br>');
  say(e.min,e.s,`${ICON.goal} ${t}`,'g'+(e.s==mine?' gm':''));q('#lvs').classList.remove('flash');void q('#lvs').offsetWidth;q('#lvs').classList.add('flash')}
 else{if(SHOT.includes(e.k))sh[e.s]++;if(e.k=='corner')co[e.s]++;if(e.k=='foul')fo[e.s]++;if(e.k=='fapre')fo[1-e.s]++;if(e.k=='card')yc[e.s]++;pause=hold(.35);say(e.min,e.s,`${e.k=='card'?'<i class="cdk"></i>':ICON[e.k]} ${t}`,e.k=='card'?'y':'')}}
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
 const fut=ev.splice(ei).filter(e=>e.k=='goal'||e.k=='card'||e.pre);ev.push(...fut,...filler(Math.floor(min),tac));ev.sort((x,y)=>x.min-y.min);
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
   else{bump(iN,'yc',1);e.wf=e.ref[1]=iN;e.who=sn(iN)}}})};
q('#lvsb').onclick=()=>{if(fin||subs>=5)return;pz=1;
 const cur=MT.lu.slice(),cs=new Set(cur),dl=cur.slice(),db=MT.bn.filter(i=>!gone.has(i)),sp=slots(MT.form),left=5-subs;let pk=null,msg='';
 const pn=document.createElement('div');pn.id='lvsub';o.appendChild(pn);
 const nin=()=>dl.filter(i=>!cs.has(i)).length,
  fb=p=>{const f=p.fa|0;return `<i class="fb"><u class="${f>66?'hi':f>33?'md':'lo'}" style="width:${Math.max(6,f)}%"></u></i>`},
  get=l=>{const[k,v]=l.split(':');return k=='x'?dl[+v]:db[+v]},
  set=(l,val)=>{const[k,v]=l.split(':');if(k=='x')dl[+v]=val;else db[+v]=val},
  sw=(a,b)=>{const va=get(a),vb=get(b);set(a,vb);set(b,va)},
  tr=(a,b)=>{if(!a||!b||a==b)return;sw(a,b);if(nin()>left){sw(a,b);msg='Solo te quedan '+left+(left==1?' cambio.':' cambios.')}else msg=''};
 const draw=()=>{const n=nin(),ok=n>0&&n<=left,
  sl=i=>{const p=MT.pl[dl[i]],en=!cs.has(dl[i]);return `<div class="sl fit${pk=='x:'+i?' pk':''}${en?' inn':''}" style="--fc:${FC(p,roles(MT)[i])}" data-l="x:${i}"><span class="ps slp ${FGR(roles(MT)[i])}">${roles(MT)[i]}</span><span class="ov">${Math.round(ef(p))}</span><b>${sn(p.n)}</b>${fb(p)}</div>`},
  rw=db.map((id,j)=>{const p=MT.pl[id],lf=cs.has(id);return `<div class="pr${pk=='b:'+j?' pk':''}${lf?' outt':''}" data-l="b:${j}"><span class="ps ${p.pos}">${PL(p)}</span><span class="pnm">${p.n}${lf?' <em>sale</em>':''}</span><span class="mu sm">${p.age}a</span><b>${Math.round(ef(p))}</b>${fb(p)}</div>`}).join('');
  pn.innerHTML=`<div class="sbx"><h3>Cambios · ${subs}/5 usados</h3><p class="mu sm">Toca (o arrastra) un jugador del campo y otro del banquillo para cambiarlos. Puedes preparar varios cambios y confirmarlos todos a la vez. Un jugador sustituido no vuelve a entrar. Rojo = fuera de posición · Verde = entra.</p><div class="g2 sq"><div class="pn pit gr">${pitch(roles(MT),sl)}</div><div class="pn zn"><h3>Banquillo <small>${db.length}</small></h3>${rw||'<p class="mu sm">Sin suplentes</p>'}</div></div><p class="sbs">${msg||(n?`${n} cambio${n>1?'s':''} preparado${n>1?'s':''} · te quedarán ${left-n}`:`Te quedan ${left} cambios`)}</p><p class="lvct"><button class="p" id="sbg" ${ok?'':'disabled'}>Confirmar${n?' '+n+(n>1?' cambios':' cambio'):' cambios'}</button><button id="sbr">Deshacer</button><button id="sbc">Cerrar</button></p></div>`;
  pn.querySelectorAll('[data-l]').forEach(e=>{const l=e.dataset.l;e.draggable=true;
   e.onclick=()=>{if(pk&&pk!=l){tr(pk,l);pk=null}else pk=pk==l?null:l;draw()};
   e.ondragstart=ev=>{ev.dataTransfer.setData('text/plain',l);pk=null};e.ondragover=ev=>ev.preventDefault();
   e.ondrop=ev=>{ev.preventDefault();tr(ev.dataTransfer.getData('text/plain'),l);pk=null;draw()}});
  pn.querySelector('#sbr').onclick=()=>{cur.forEach((v,i)=>dl[i]=v);const bo=MT.bn.filter(i=>!gone.has(i));bo.forEach((v,i)=>db[i]=v);pk=null;msg='';draw()};
  pn.querySelector('#sbc').onclick=()=>{pn.remove();pz=0;last=performance.now()};
  pn.querySelector('#sbg').onclick=()=>{const ins=dl.filter(i=>!cs.has(i)),outs=cur.filter(i=>!dl.includes(i)),pairs=ins.map(i=>{let k=outs.findIndex(j=>MT.pl[j].pos==MT.pl[i].pos);if(k<0)k=0;return[outs.splice(k,1)[0],i]});
   pairs.forEach(([a])=>gone.add(a));MT.lu=dl.slice();MT.bn=db.filter(i=>!gone.has(i));subs+=ins.length;ins.forEach(i=>{if(ent.has(i))return;ent.add(i);const p=MT.pl[i];p.pj=(p.pj|0)+1});
   const mn=Math.min(90,Math.floor(min));pairs.forEach(([a,b])=>sublog.push([a,b,mn]));pairs.forEach(([a,b])=>rmp(a,b));pairs.forEach(([a,b])=>say(mn,mine,`🔄 Cambio en ${MT.n}: sale <b>${sn(MT.pl[a].n)}</b>, entra <b>${sn(MT.pl[b].n)}</b>`,'sub'));
   q('#lvsb').textContent='Cambios ('+(5-subs)+')';if(subs>=5)q('#lvsb').disabled=true;pn.remove();pz=0;last=performance.now()}};
 draw()};
requestAnimationFrame(frame)}
