/* Extras v1: más frases y cuentas en redes, personajes nuevos, Todo mezclado, destacados variados y animación de salida al campo */
function fdH(i,s){let x=Math.imul(i^Math.imul(s,40503),2654435761)>>>0;x^=x>>>15;x=Math.imul(x,2246822519)>>>0;return(x>>>8)/16777216}
function fdMix(a){const s=G.fs|0;return a.slice().sort((x,y)=>fdH(x.i,s)-fdH(y.i,s))}
/* --- más frases para David67, AbdoulMarroc y Nacho (ya existen en PER) --- */
PER[6].r.push('Mi nivel de ansiedad en un penalti: jefe final de Dark Souls.','Si el fútbol fuera un RPG, el {c} tendría +10 de moral y -5 de suerte.','He hecho un Excel con las estadísticas de la plantilla del {c}. 14 pestañas. No me juzguéis.','Mi gato ha mirado el partido de refilón y ya sabe más de tácticas que yo. Respeto.','Hoy he descubierto que un córner es básicamente un spawn point. Gracias por nada.');
PER[7].r.push('Bismillah y a por el partido de hoy. ¡Vamos {c}! ⚽','Lo mejor del fútbol: da igual de dónde seas, cuando marcamos gritamos todos igual.','Té con menta, bufanda puesta y a ver al {c}. Plan perfecto 🍵🧣','Hermano, qué manera de jugar. Esto es lo que enamora a la gente.','Que nadie se pierda el próximo partido. Va a ser grande, inshallah.');
PER[8].r.push('Ex jugador amateur a los 23: con esa alineación a mí me cambiaban en el descanso.','Los que dicen que el fútbol es fácil, que prueben a correr 90 minutos con un 5 pegado.','Se nota quién ha jugado de verdad: ve los desmarques antes de que ocurran. Y aquí nadie los ve.','Yo en amateur con ese centro del campo ya habría pedido el cambio por voluntad propia.');
/* --- más frases para los de siempre --- */
[[0,['Yo ya lo dije en el bar: esa defensa no vale ni para un partido de playa.','Que vengan a decirme que fue penalti. Que vengan.','{c} necesita un 9 de verdad. Lo dice un señor con tres bufandas.']],
 [1,['Domingo de fútbol, bufanda y abono: mi felicidad, {c} ❤️','No me importa el resultado: vuelvo a casa orgulloso de estos colores. #{t}','Si me veis llorar en la grada es de emoción. ¡Vamos {c}!']],
 [2,['Hoy intenté ver el partido por la radio. El nieto me puso el vídeo del gato.','En mi época ganaba el que corría más. Ahora hace falta un máster.','Me quedé dormido en el segundo gol. ¿Alguien me lo cuenta?']],
 [3,['Como decía mi entrenador: se gana con defensa y se pierde sin ella. #{t}','Con los pies en el suelo, partido a partido. {c} 💪','Hoy valoro el trabajo táctico. Respeto al rival y a nuestro míster.']],
 [4,['Otra vez la alineación inexplicable. Cada semana igual, ¿hasta cuándo?','Si sale mal es culpa del míster; si sale bien, suerte. Así funciona esto.','Que me expliquen el cambio del minuto 70, porque no lo pillo.']],
 [5,['He mirado la clasificación y creo que hay un equipo que se llama {x}. Dato curioso.','¿Alguien sabe a qué hora juega el {c}? Lo pregunto por si me lo pierdo otra vez 🙈','Hoy el café me ha sabido a gol, no sé si me explico ☕⚽']]].forEach(([i,a])=>PER[i].r.push(...a));
const XP={
 marca:['🎙️ En directo: la afición del {c} despide a su equipo con una gran ovación tras la jornada {jn}.','🎙️ Tertulia de la noche: ¿es {l} el mejor equipo de la liga o aún tiene que demostrarlo?','🎙️ Entrevista: {m} analiza la jornada {jn} y avisa: "Nada está ganado".','🎙️ Balance de la jornada {jn}: {gl} goles y muchas dudas para {u}.'],
 opta:['📐 {b} ganó {bs} a {bl}. Claves: presión tras pérdida y transiciones rápidas.','📐 Hilo táctico: por qué {l} controla los partidos desde la medular. 🧵','📐 {ps} ({pt}) lleva {pg} goles: sus movimientos sin balón explican su olfato. 🧵','📐 Los laterales ya no son laterales: se meten de interiores y cambian el partido. Análisis en el hilo.'],
 fd:['😂 Yo viendo el partido del {c} con la tabla en la mano: "tranquilo, es solo un juego".','😂 La cara de {u} mirando la clasificación: 😐','😂 Cuando pitan fuera de juego y tú ya habías gritado el gol. Dolor.','😂 {c} en la jornada {jn}: "no me hables hasta que me tome un café ☕".'],
 jorge:['💼 Fuentes cercanas: {l} sondea fichajes de cara a enero. Sigue la pista de un extremo.','💼 Se cocina un traspaso de peso en {c}: reunión esta semana. Nada oficial.','💼 {ps} ({pt}) en el radar de varios clubes tras sus {pg} goles.','💼 OJO: tres equipos pujan por el mismo delantero. Movimiento en las próximas horas.'],
 sky:['📺 Revisión de la jornada {jn}: dos decisiones polémicas, una clave en el resultado del {c}.','📺 ¿Fue penalti? Analizamos la jugada que ha encendido las redes en {b}-{bl}.','📺 Actuación arbitral de la jornada {jn}: notable en general, con una mancha en la segunda parte.'],
 l2:['🌱 Joven promesa del {c} impresiona en los entrenamientos del primer equipo.','🌱 Los canteranos piden paso: el {c} tiene tres jugadores listos para debutar.','🌱 El futuro ya está aquí: la jornada {jn} tuvo a varios jóvenes marcando diferencias.']};
function fdMore(w){const me=G.T[G.me],l=me.lg,rs=G.res.filter(r=>r[0]==w&&r[1]==l);if(!rs.length)return;FW=w;
 const T=i=>G.T[i],mr=rs.find(r=>r[2]==G.me||r[3]==G.me),bg=rs.slice().sort((a,b)=>Math.abs(b[4]-b[5])-Math.abs(a[4]-a[5]))[0],tb=tab(l),sp=G.T.filter(t=>t.lg==l).flatMap(t=>t.pl.map(p=>[p.n,t.n,p.g|0])).sort((a,b)=>b[2]-a[2])[0],wn=bg[4]>=bg[5]?0:1,
 V={c:me.n,m:G.mgr,t:fslug(me.n),l:tb[0].n,u:tb[tb.length-1].n,b:T(bg[2+wn]).n,bl:T(bg[3-wn]).n,bs:Math.max(bg[4],bg[5])+'-'+Math.min(bg[4],bg[5]),jn:w+1,gl:rs.reduce((s,r)=>s+r[4]+r[5],0),ps:sp?sp[0]:'—',pt:sp?sp[1]:'',pg:sp?sp[2]:0,x:fpk(G.T.map(t=>t.n))};
 fsh(Object.keys(XP)).slice(0,2+(Math.random()<.5?1:0)).forEach(k=>fdAdd(k,fpk(XP[k]).replace(/\{(\w+)\}/g,(_,q)=>V[q]??''),{top:Math.random()<.2}));}
const _gf=genFeed;genFeed=function(w){_gf(w);try{fdMore(w)}catch(e){console.error(e)}};
/* --- destacados: una publicación por cuenta, mezcladas --- */
const fdKey=p=>p.a||(p.per!=null?'p'+p.per:p.k=='club'?'c'+p.cr:'f'+p.fh);
function fdLatest(){return G.feed.filter(fdCur)}
function fdPick(){const s=G.fs|0,best={};fdLatest().forEach(p=>{const k=fdKey(p);if(!best[k]||p.lk>best[k].lk)best[k]=p});
 let a=Object.values(best),nw=a.filter(p=>p.a||p.k=='club');if(nw.length>=3)a=nw;return a.sort((x,y)=>y.lk*(.35+1.3*fdH(y.i,s))-x.lk*(.35+1.3*fdH(x.i,s))).slice(0,6)}
feedHome=function(){const seen=G.seen|0;const a=fdPick();
 return `<section class="pn fdp"><div class="fdh"><h3><span class="live"></span>Destacados · Mundo Superstar</h3><button id="fall">Ver todo →</button></div>${a.map(p=>fdPost(p,seen)).join('')||'<p class="mu" style="padding:16px">Todavía no hay noticias de esta jornada.</p>'}</section>`};
/* --- animación de salida al campo --- */
function matchIntro(m,cb){const [w,l,h,a]=m.r,o=document.createElement('div'),rm=matchMedia('(prefers-reduced-motion:reduce)').matches;o.id='mi';
 o.innerHTML=`<div class="mi-p l"></div><div class="mi-p r"></div><div class="mi-c"><div class="mi-lg">${lgl(l,44)}<span>${LGN[l]} · Jornada ${w+1}</span></div><div class="mi-t"><div class="mi-s l">${crest(h,120)}<span>${nm(h)}</span>${form5(h,w)}</div><div class="mi-vs">VS</div><div class="mi-s r">${crest(a,120)}<span>${nm(a)}</span>${form5(a,w)}</div></div><div class="mi-bar"><i></i></div><p class="mi-go">🏟️ Saliendo al campo… <small>(toca para saltar)</small></p></div>`;
 document.body.appendChild(o);let d=0;const go=()=>{if(d)return;d=1;cb();o.classList.add('out');setTimeout(()=>o.remove(),rm?0:420)};o.onclick=go;setTimeout(go,rm?500:2400)}
