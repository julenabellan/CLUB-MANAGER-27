/* ===== Redes sociales del universo Superstar (estilo X / Twitter) =====
   Cada jornada se generan publicaciones de prensa, datos, mercado, ligas, clubes y aficionados.
   Imágenes esperadas en /img: MARCA.png, JORGE.png, OPTA.png, TRANSFER.png, LOGO 1A.png, LOGO 2A.png */
const ACC={
 marca:{n:'MARCA',h:'marca',img:'MARCA.png',m:1.6,f:'4,8 M',c:'prensa'},
 jorge:{n:'Jorge de la Mata Oficial',h:'JorgedelaMata',img:'JORGE.png',m:1.9,f:'12,3 M',c:'fich'},
 opta:{n:'Opta',h:'OptaSuperstar',img:'OPTA.png',m:.8,f:'2,1 M',c:'datos'},
 tm:{n:'Transfermarkt',h:'TransfermarktES',img:'TRANSFER.png',m:.7,f:'1,6 M',c:'datos'},
 l1:{n:'Liga Superstar One',h:'SuperstarOne',img:'LOGO 1A.png',m:1.1,f:'3,4 M',c:'prensa'},
 l2:{n:'Liga Superstar 2',h:'Superstar2',img:'LOGO 2A.png',m:.6,f:'890 K',c:'prensa'}};
const FF=[['all','Todo'],['my','Mi club'],['prensa','Noticias'],['fich','Fichajes'],['datos','Datos'],['club','Clubes'],['fan','Afición']];
let FW=0,FT=540;
const fesc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
 fslug=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9]+/g,''),
 fpk=a=>a[Math.floor(Math.random()*a.length)],
 fsh=a=>a.map(x=>[Math.random(),x]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]),
 fN=n=>{n=Math.max(0,Math.round(n));const f=(v,s)=>v.toFixed(1).replace('.',',').replace(/,0$/,'')+s;return n>=1e6?f(n/1e6,' M'):n>=1e3?f(n/1e3,' K'):''+n},
 fpool=l=>G.T.filter(t=>t.lg==l).flatMap(t=>t.pl.map(p=>({p,t})));
/* valor de mercado ficticio a partir de media, potencial y edad */
function mval(p){let v=.9*Math.exp((p.ovr-50)*.115);if(p.age<=23)v*=1+Math.max(0,p.pot-p.ovr)*.06;else if(p.age>=30)v*=Math.max(.25,1-(p.age-29)*.14);return v}
const fmv=v=>v<1?Math.max(50,Math.round(v*10)*100)+' mil €':v<10?v.toFixed(1).replace('.',',')+' M€':Math.round(v)+' M€';
const fdVal=(p,t,up)=>({t:'v',cr:t.id,pn:p.n,pos:p.pos,age:p.age,val:fmv(mval(p)),up});
const fdSk=(id,k)=>{const f={v:d=>d>0,d:d=>d<0,u:d=>d>=0,w:d=>d<=0}[k],a=G.res.filter(r=>r[2]==id||r[3]==id);let n=0;for(let i=a.length-1;i>=0&&f(a[i][2]==id?a[i][4]-a[i][5]:a[i][5]-a[i][4]);i--)n++;return n};

/* ---------- creación de publicaciones ---------- */
function fdAdd(a,tx,o={}){const ac=a?ACC[a]:null,mm=(ac?ac.m:(o.m??.2))*(o.big?2.6:1)*R(.55,1.45),lk=Math.round(mm*R(2500,8000));
 FT+=Math.floor(R(5,34));const q=FT%1440,tm=String(Math.floor(q/60)).padStart(2,'0')+':'+String(q%60).padStart(2,'0');
 const p={i:++G.fs,w:FW,tm,tx,c:o.c||(ac?ac.c:'fan'),lk,rt:Math.round(lk*R(.1,.28)),rp:Math.round(lk*R(.03,.11)),vw:Math.round(lk*R(14,30))};
 if(a)p.a=a;if(o.k)p.k=o.k;if(o.per!=null)p.per=o.per;if(o.big||o.top)p.tp=1;if(o.cr!=null)p.cr=o.cr;if(o.fn){p.fn=o.fn;p.fh=o.fh}if(o.card)p.card=o.card;if(o.my)p.my=1;
 G.feed.push(p);if(G.feed.length>160)G.feed.splice(0,G.feed.length-160);return p}
const fdClub=(c,tx,o={})=>fdAdd(null,tx,{...o,k:'club',c:'club',cr:c,m:o.m??.2,my:o.my||c==G.me});
function fdFan(c,tx,o={}){const C=G.T[c].n,s=fslug(C),y=1890+(c*37)%100,nu=(c*13)%90+10,
 pl=[[`Ultras ${C}`,`Ultras${s}`],[`${C} Forever`,`${s}Forever`],[`Grada ${C}`,`Grada${s}`],[`${C} desde ${y}`,`${s}${y}`],[`El Barrio de ${C}`,`Barrio${s}`],[`Peña ${C} ${nu}`,`Pena${s}${nu}`]][((c+(o.v|0))*7)%6];
 return fdAdd(null,tx,{...o,k:'fan',c:'fan',cr:c,fn:pl[0],fh:pl[1],m:o.m??.05})}
const FANS={
 w3:['¡QUÉ BARBARIDAD! {s}. Hoy sí hemos visto al equipo de nuestros sueños 🔥','{rv} ni se ha enterado. {s}. Para enmarcarlo 😎','Una paliza de las que hacen afición. ¡Gracias, {m}! #{t}'],
 w:['Tres puntos de oro. {m} sabe lo que hace 💪','Sufrir, pero ganar. Así se hacen las ligas #{t}','Victoria y a seguir. ¡Esta afición no se cansa! ❤️','{s}. Se dice rápido, se disfruta mucho 🙌'],
 e:['Un punto que sabe a poco. Hay que ser más fiables.','Empate sin alma. Toca dar un paso adelante, {m}.','{s}. Ni fu ni fa... y así no se ganan las ligas.'],
 l:['Así no. Hoy ha sido un partido para olvidar 😡','Pitos merecidos. Hay que revisar muchas cosas, {m}.','Duele, pero seguimos. Esta camiseta no se abandona 💔','{s}. A levantar la cabeza. #{t}'],
 l3:['VERGÜENZA. {s}. No hay palabras 🤬','Hoy el equipo no ha salido al campo. Inaceptable, {m}.','Que alguien nos explique qué ha pasado hoy... {s} 😶']};
function fdReact(c,r,v){const d=r[2]==c?r[4]-r[5]:r[5]-r[4],k=d>=3?'w3':d>0?'w':d==0?'e':d<=-3?'l3':'l',mine=c==G.me,
 s=`${G.T[r[2]].n} ${r[4]}-${r[5]} ${G.T[r[3]].n}`;
 let x=fpk(FANS[k]).replace(/\{s\}/g,s).replace(/\{rv\}/g,G.T[r[2]==c?r[3]:r[2]].n).replace(/\{m\}/g,mine?G.mgr:'míster').replace(/\{t\}/g,fslug(G.T[c].n));
 if(mine&&d<0&&G.fans<30)x+=' #DirectivaOut';
 return fdFan(c,x,{my:mine,v:v|0})}
/* ---------- cuentas random con foto (CARA1..CARA6.png en /img; CARA6 es mujer): haters, fans y tonterías ---------- */
const PER=[
 {n:'Paco el Cuñao',h:'PacoElCunao',img:'CARA1.png',role:'hater',
  rs:{w3:['{s}. Bueno, el rival ha puesto once conos y así cualquiera, {m}.','Goleada, vale. Ya veremos cuando toque un rival de verdad.'],
   w:['Ganar así no vale, {m}. Menudo sufrimiento. Yo lo hago mejor desde el sofá.','Tres puntos, sí. Juego, ninguno. Y no me digáis que no. #{t}'],
   e:['Empate. Como siempre. {m}, ¿alguien te ha dicho que se juega para ganar?','{s}. Otro partido para no recordar.'],
   l:['{m}, dimisión. Lo dije en la jornada 1 y lo repito hoy. #{ms}Out','{s}. Con un amigo mío de entrenador esto no pasaba.'],
   l3:['VERGÜENZA. {s}. {m}, haz las maletas 🧳 #{ms}Out','Que me devuelvan el abono. {s} 🤡']},
  r:['Opinión impopular: esta táctica es de otra época. No, no os voy a decir cuál.','Yo no digo nada, pero la alineación de hoy parece hecha por el cuñado de alguien.','Cada semana lo mismo en el {c}. Cada semana. Y aquí sigo yo, diciéndolo.']},
 {n:'Jordi',h:'JordiUltra',img:'CARA2.png',role:'fan',
  rs:{w3:['¡¡QUÉ NOCHE!! {s}. Hoy lloro de alegría ❤️🔥 #{t}','{m}, ERES UN DIOS. {s}. ¡Vamos {c}!'],
   w:['Tres puntos y a la cama feliz. ¡Vamos {c}! 💪','Sufrido, pero lo hemos sacado. {c} hasta la muerte #{t}'],
   e:['Un punto es un punto, pero el próximo vamos a por todas. ¡Confío en {m}!','Hoy no ha salido, pero la afición siempre está ahí. #{t}'],
   l:['Cabeza alta, equipo. Mañana más fuertes. Yo no me voy a ningún lado 💔','Hoy duele, pero {m} sabe lo que hace. Confianza total.'],
   l3:['Nos ha tocado sufrir, pero seguimos aquí. ¡Esta camiseta no se abandona! 💔','Un mal día lo tiene cualquiera. ¡Arriba {c}! #{t}']},
  r:['Ya tengo la bufanda lista para el próximo partido 🧣 #{t}','Si me veis llorar en la grada es de emoción. #{t}','Otro día más soñando con ver al {c} campeón 🏆']},
 {n:'AbueloFutbol',h:'AbueloFutbol',img:'CARA3.png',role:'tonto',
  rs:{w3:['{s}. Esto no lo vi ni en el 82. Y mira que yo estuve en el 82.'],w:['Ganamos, nieto. Ganamos. Pásame las gafas, que quiero ver la tabla.'],e:['Empate. En mis tiempos también se empataba, pero con más bigote.'],l:['Hemos perdido. Me voy a por un cafelito, que esto no se arregla con nada.'],l3:['{s}. Me voy a dormir la siesta y mañana lo hablamos.']},
  r:['En mis tiempos los balones pesaban como ladrillos y nadie se quejaba.','Hoy he vuelto a perder las gafas. Estaban en la frente. Igual que el defensa de ayer.','Mi nieto dice que hay "tácticas". Yo solo conozco dos: meter gol y no meterse uno.','Le he dicho al camarero que el {c} gana la liga. Me ha dado un cortado de consolación.','He ido al campo con el transistor por si acaso. Por si acaso, lo que sea.','Antes se jugaba a las cuatro y se cenaba a las nueve. Ahora no sé ni a qué hora es el partido.']},
 {n:'Maldini14',h:'Maldini14',img:'CARA4.png',role:'fan',
  rs:{w3:['¡¡Qué exhibición!! {s}. Así se defiende y así se ataca 🔥 #{t}','{m}, esto es fútbol de otro planeta. #{t}'],
   w:['Tres puntos y la defensa ordenada. Eso es fútbol, amigos 💪 #{t}','Victoria. Lo bonito es ganar, pero lo importante es no encajar 🧱'],
   e:['Un punto. Ojalá la defensa hubiera estado más fina, pero seguimos.','No se ha ganado, pero el equipo ha peleado cada balón. #{t}'],
   l:['Toca aprender. Hay que cerrar atrás y volver con fuerza 💔','Partido cruel, pero {m} tiene mi confianza. #{t}'],
   l3:['Hoy ha costado. Pero la afición del {c} no se rinde nunca. #{t}','{s}. A analizar los errores y a mejorar, que para eso estamos.']},
  r:['Un buen central vale más que tres delanteros. Lo digo yo, que soy del {c} 🧱','Viendo vídeos de tácticas a las 3 de la mañana. Normal. #{t}','Cuando el {c} defiende bien, da gusto verlo. Más claro, imposible.','El 14 siempre en el corazón. Y el {c}, también ❤️']},
 {n:'Sergio',h:'SergioTodoMal',img:'CARA5.png',role:'hater',
  rs:{w3:['{s}. Mucho gol, pero el {rv} ha puesto un equipo de cartón. Y el {c} tampoco es para tirar cohetes.'],
   w:['Ganar, ganar... El {c} y el {rv} dan igual, todos son malísimos.'],
   e:['Empate. Normal: los dos equipos son igual de malos.'],
   l:['{s}. El {c} perdiendo y el {rv} ganando: no sé quién me da más pena.'],
   l3:['{s}. Qué asco de fútbol. Y qué asco de todos los clubes, ya puestos.']},
  r:['El {x} es el club más sobrevalorado de esta liga. Y no, no hay debate.','Todos los clubes son iguales: mucho escudo y poco fútbol. Empezando por el {x}.','Hoy me he levantado odiando al {x} y al {y}. Por si acaso, mañana también.','Que alguien me explique qué le ve la gente al {x}. En serio.','Mi lista de clubes que me caen mal: el {x}, el {y} y todos los demás.']},
 {n:'Lore',h:'Lore_random',img:'CARA6.png',role:'tonto',
  rs:{w3:['Hoy hemos metido un montón de goles. No sé quién ha marcado, pero ha sido bonito 🥳'],w:['¡Ganamos! Mi tío ha gritado tanto que ha asustado al vecino 😂'],e:['Empate. Eso significa que nadie ha perdido, ¿no? Pues perfecto 😌'],l:['Perdimos. Pero las patatas del estadio estaban buenísimas 🍟'],l3:['{s}. Me han dicho que no sonría. Intento no sonreír 🫠']},
  r:['No sé de fútbol, pero ese del número 9 tiene buena pinta 👀','He ido al estadio solo por las patatas. 10/10 🍟','¿Alguien me explica por qué ese señor de negro pita tanto?','Me han dicho que el míster es {m}. ¿Es el de la corbata? Pues me cae bien.','Mi madre cree que el VAR es una marca de detergente.','Hoy el partido, mañana la vida. Pero primero el café ☕']},
 {n:'David67',h:'David67',img:'CARA7.png',role:'tonto',
  rs:{w3:['{s}. Esto es un cheat code. Quiero el replay en 4K y con comentarios del director 🎮','Goleada: win-rate del 100%. Perdón, me he emocionado.'],
   w:['Tres puntos. +3 de experiencia y subida de nivel para el {c} 🎮','{s}. Si esto fuera el Football Manager, acabo de guardar partida con la moral por las nubes.'],
   e:['Empate. Es como un final neutro de videojuego: ni fu ni fa 🎮','Un punto. El árbol de habilidades del {c} sigue a medias.'],
   l:['{s}. Esto es un bug, no puede ser. Que alguien reinicie el servidor.','Derrota. Voy a leer las notas del parche: seguro que nerfearon al {c}.'],
   l3:['{s}. Game over. ¿Continuar? (S/N). Pulso N por precaución.','{s}. Me niego a creer que esto no sea un error de simulación.']},
  r:['Dato friki: llevo 47 horas viendo vídeos de tácticas. Mi madre dice que salga a la calle. Le he dicho que mi build del {c} no se optimiza sola.','Teoría: el VAR es un NPC que se bugea cuando juega el {x}.','Me ha tocado el portero repetido por tercera vez en el sobre de cromos. Estadísticamente imposible. Sospecho del {x}.','Me he pasado el Football Manager con el {c}: siete temporadas, cero títulos. Seguro que {m} lo haría mejor.','Hoy me han explicado el xG: goles esperados. Yo esperaba que alguien me contestara a las 3 de la mañana. Cosas de friki.','Mi setup de ver partidos: 3 pantallas, 2 pestañas de estadísticas y 0 vida social. Rendimiento óptimo.']},
 {n:'AbdoulMarroc',h:'AbdoulMarroc',img:'CARA8.png',role:'fan',
  rs:{w3:['¡¡¡ALHAMDULILLAH!!! {s}. ¡Qué noche! Mi familia de Marruecos está mandando mensajes sin parar 🇲🇦❤️ #{t}','{s}. ¡Qué orgullo, {c}! Mi madre ha salido del salón a gritar 😂'],
   w:['Tres puntos, alhamdulillah. A seguir. ¡Vamos {c}! 💪 #{t}','Victoria con humildad, y a por la siguiente, {m} 🙏'],
   e:['Un punto. Hay que mejorar, pero confío en el equipo. Inshallah el próximo lo ganamos #{t}','Empate. Cabeza arriba, que la liga es larga 🙌'],
   l:['Hoy no tocaba. Cabeza alta y a seguir, {c}. Hay que mantener la fe 🙏','Derrota dura, pero el equipo lo ha dado todo. Inshallah el próximo.'],
   l3:['{s}. Un mal día lo tiene cualquiera. A trabajar más y a levantarse, {c} #{t}','Hoy duele, pero la afición no se mueve de aquí. ¡Vamos, {c}!']},
  r:['Después de comer, té con menta y partido del {c}. Plan perfecto 🍵⚽','Mi primo dice que el {c} no tiene nada que hacer. Le he apostado un tajín. Veremos quién ríe 😏','Cuando juega el {c}, mi familia de Marruecos conecta la videollamada. Somos catorce mirando un móvil 😂','Domingo, familia y {c}. No necesito más ❤️','Mi madre me ha dicho que lleve bufanda al partido. Hay 28 grados. Pero obedezco 🧣','Quien dice que el fútbol no une es que no ha visto mi grupo de WhatsApp familiar discutiendo la alineación.']},
 {n:'Nacho',h:'Nacho_Regional',img:'CARA9.png',role:'hater',
  rs:{w3:['{s}. Se nota la diferencia de nivel. Aun así, contra rivales así hay que mantener la concentración, {m}.','Goleada, pero ojo: yo en amateur aprendí que un 5-0 se convierte en 5-3 si te relajas.'],
   w:['Tres puntos, bien. Pero el equipo concede demasiado atrás. Con mi entrenador de amateur eso no pasaba 🧐','Ganar sin brillar. Y ya sabemos cómo acaba eso a la larga.'],
   e:['Empate. Faltó intensidad en la segunda parte. Lo digo con cariño.','Un punto y poco más. Me recuerda a mis partidos de regional: mucho correr y poco peligro.'],
   l:['Perder duele y lo sé de primera mano. Pero faltó intensidad desde el minuto 1, {m}.','{s}. Se perdió la segunda jugada en cada balón. Cosas básicas.'],
   l3:['{s}. Colgué las botas hace poco, pero esto lo veo desde dentro: aquí falló la actitud 😕','Lo digo con respeto: un partido así hay que analizarlo con calma. Así no se compite, {m}.']},
  r:['Jugué en regional hasta hace poco. Os aseguro que sufrir con un 4-4-2 sin ritmo es un arte.','Colgué las botas con 23 años, pero el ojo no se me ha ido: ese lateral siempre llega tarde.','Hay jugadores que corren mucho y otros que corren con sentido. La diferencia se ve en la segunda parte.','Mi consejo desde la grada: más presión tras pérdida. Lo aprendí a base de entrenadores que gritaban mucho.','Echo de menos los vestuarios de amateur: olor a linimento, bromas pesadas y bocata de tortilla después. Eso no lo da la Superstar.','Este {c} me recuerda a mi último equipo: mucha ilusión y poco orden. Pero ilusión sobra ❤️']}];
const perV=c=>{const me=G.T[G.me],tn=G.T.map(t=>t.n),x=fpk(tn),y=fpk(tn.filter(n=>n!=x));return{c:me.n,m:G.mgr,ms:fslug(G.mgr),t:fslug(me.n),s:c?c.s:'',rv:c?c.rv:'',x,y}};
function perPost(i,k,V,my){const P=PER[i],pl=k&&P.rs[k]&&P.rs[k].length?P.rs[k]:P.r;let x=fpk(pl);Object.keys(V).forEach(q=>{x=x.split('{'+q+'}').join(V[q])});return fdAdd(null,x,{k:'per',c:'fan',per:i,my:my,m:.06})}
const perGrp=r=>PER.map((p,i)=>i).filter(i=>PER[i].role==r);
function fdPersonas(c){const V=perV(c),k=!c?null:c.d>=3?'w3':c.d>0?'w':c.d==0?'e':c.d<=-3?'l3':'l',neg=c&&c.d<0,pos=c&&c.d>0;
 if(c){if(Math.random()<(neg?.8:c.d==0?.55:.4))perPost(fpk(perGrp('hater')),k,V,1);if(Math.random()<(neg?.4:pos?.8:.5))perPost(fpk(perGrp('fan')),k,V,1)}
 if(Math.random()<.65)perPost(fpk(perGrp('tonto')),Math.random()<.35?k:null,V,0);
 if(Math.random()<.5)perPost(4,null,V,0)}
/* ---------- comentarios (respuestas) con like + tweets destacados ---------- */
const fdTop=p=>p.tp||p.lk>=4000;
const fdAvP=P=>`<span class="av br per"><i>${fesc(P.n[0])}</i><img src="img/${P.img}" alt="" onerror="this.parentNode.classList.add('nf');this.remove()"></span>`;
const REP={fan:['¡Así se habla! 👏','Esto es el {c}, señores. Que nadie lo olvide.','Yo estoy con vosotros hasta el final ❤️','Qué grande. Sin discusión.','Ahí, ahí. Seguimos. 💪'],
 hater:['Ya, ya... y luego pasa lo que pasa.','Eso lo dices tú. Los números no mienten, {m}.','Sobrevalorado. Lo digo desde hace meses.','Y yo soy el rey de España 🙄','Tanto bombo para tan poco.'],
 tonto:['Yo vine solo a ver si había pizza 🍕','Primera vez que entro aquí y ya me he perdido.','¿Esto cuenta para la quiniela?','Mi perro ha leído esto y ha ladrado. Ahí lo dejo.','Like por si acaso 👍']};
function fdGenCm(p){const V=perV(null),out=[];fsh(['fan','hater','tonto']).slice(0,Math.random()<.5?2:3).forEach(r=>{const c=perGrp(r).filter(i=>i!==p.per),i=fpk(c.length?c:perGrp(r));let x=fpk(REP[r]);Object.keys(V).forEach(q=>{x=x.split('{'+q+'}').join(V[q])});out.push({per:i,tx:x,lk:Math.round(R(0,320))})});return out}
const fdCm=p=>`<div class="cmx">${p.cm.map((c,j)=>{const P=PER[c.per];return `<div class="cm">${fdAvP(P)}<div class="cb"><div><b>${fesc(P.n)}</b> <span class="hd">@${fesc(P.h)}</span></div><div class="cx">${fdTxt(c.tx)}</div><button class="a${c.lkd?' on':''}" data-c="${j}">♥ <b>${fN(c.lk)}</b></button></div></div>`}).join('')}</div>`;
function fdCmToggle(po,p){const x=po.querySelector('.cmx');if(x){x.remove();return}if(!p.cm){p.cm=fdGenCm(p);save()}
 po.querySelector('.pb').insertAdjacentHTML('beforeend',fdCm(p));
 po.querySelectorAll('.cmx button[data-c]').forEach(b=>b.onclick=()=>{const c=p.cm[+b.dataset.c];c.lkd=!c.lkd;c.lk+=c.lkd?1:-1;b.classList.toggle('on',!!c.lkd);b.querySelector('b').textContent=fN(c.lk);save()})}
const RUM=[
 (p,t,d,v)=>`🚨 EXCLUSIVA | ${d.n} ha preguntado por ${p.n} (${t.n}). Contactos iniciados.\n💶 Valoración: ${v}\n#Mercado`,
 (p,t,d,v)=>`🔎 ${p.n} está en la lista corta de ${d.n}. El ${t.n} no lo soltaría por menos de ${v}. De momento, sin oferta formal.`,
 (p,t,d,v)=>`⚠️ Se mueve algo: ${d.n} prepara una propuesta por ${p.n}. Habrá novedades en los próximos días. #Fichajes`,
 (p,t,d,v)=>`🗣️ Fuentes cercanas al jugador: ${p.n} ve con buenos ojos escuchar a ${d.n}. El ${t.n} está avisado.`,
 (p,t,d,v)=>`✍️ Pasos adelante entre ${d.n} y ${t.n} por ${p.n}. Se habla de ${v}. Ojo a este tema. #Mercado`];
function fdRumor(l){const me=G.T[G.me],pl=fpool(Math.random()<.25?(l==1?2:1):l).filter(x=>x.t.id!=G.me).sort((a,b)=>(b.p.ovr+(b.p.age<=24?b.p.pot:b.p.ovr))-(a.p.ovr+(a.p.age<=24?a.p.pot:a.p.ovr))).slice(0,25);
 if(!pl.length)return;const x=fpk(pl),ds=G.T.filter(t=>t.lg==G.T[G.me].lg&&t.id!=x.t.id).sort((a,b)=>str(b).o-str(a).o).slice(0,8),d=fpk(ds);
 fdAdd('jorge',fpk(RUM)(x.p,x.t,d,fmv(mval(x.p))),{card:fdVal(x.p,x.t,Math.round(R(-4,12)))})}
const fdRes=(h,a,hg,ag)=>`<div class="rc"><span class="tn">${crest(h,22)}<small>${nm(h)}</small></span><b>${hg} - ${ag}</b><span class="tn r"><small>${nm(a)}</small>${crest(a,22)}</span></div>`;

/* ---------- publicaciones de cada jornada ---------- */
function genFeed(w){
 const me=G.T[G.me],l=me.lg,T=i=>G.T[i],rs=G.res.filter(r=>r[0]==w&&r[1]==l),mr=G.res.find(r=>r[0]==w&&(r[2]==G.me||r[3]==G.me));
 if(!rs.length)return;
 FW=w;FT=Math.floor(R(470,600));
 const LN=LGN[l],mg=G.mgr,slg=fslug(me.n),lht=fslug(LN),sg=r=>`${T(r[2]).n} ${r[4]}-${r[5]} ${T(r[3]).n}`,card=r=>({t:'r',h:r[2],a:r[3],hg:r[4],ag:r[5]}),
  tb=tab(l),lead=tb[0],pos=myPos(),so=i=>str(T(i)).o,wn=r=>r[4]>r[5]?r[2]:r[3],ls=r=>r[4]>r[5]?r[3]:r[2];
 let h,o,gf,gc,d,scorer=null;
 /* 1. club propio */
 if(mr){h=mr[2]==G.me;o=h?mr[3]:mr[2];gf=h?mr[4]:mr[5];gc=h?mr[5]:mr[4];d=gf-gc;
  const gs=G.last&&G.last.r[0]==w?G.last.sc.filter(s=>s[0]==G.me):[];if(gs.length){const c={};gs.forEach(s=>c[s[1]]=(c[s[1]]||0)+1);scorer=Object.keys(c).sort((a,b)=>c[b]-c[a])[0]}
  fdClub(G.me,`🏁 FINAL | ${sg(mr)}${gs.length?'\n⚽ '+gs.map(s=>s[1]+' '+s[2]+"'"+(s[3]?' (as. '+s[3].split(' ').slice(1).join(' ')+')':'')).join(' · '):''}\n#J${w+1} #${slg}`,{card:card(mr),m:.7,big:d>=2,top:1})}
 /* 2. resumen de la liga */
 const gl=rs.reduce((s,r)=>s+r[4]+r[5],0),lst=rs.slice().sort((a,b)=>(a===mr?-1:b===mr?1:(b[4]+b[5])-(a[4]+a[5]))).slice(0,5);
 fdAdd('l'+l,`📋 Resumen de la jornada ${w+1}: ${gl} goles en ${rs.length} partidos (${(gl/rs.length).toFixed(1).replace('.',',')} por encuentro). ${lead.n} lidera con ${lead.pts} puntos.\n#J${w+1} #${lht}`,{card:{t:'l',rows:lst.map(r=>[r[2],r[3],r[4],r[5]])}});
 /* 3. MARCA */
 const mk=[],must=[],big=rs.slice().sort((a,b)=>Math.abs(b[4]-b[5])-Math.abs(a[4]-a[5]))[0],bm=Math.abs(big[4]-big[5]);
 if(bm>=3)mk.push(()=>fdAdd('marca',`🔴 GOLEADA | ${T(wn(big)).n} pasa por encima de ${T(ls(big)).n} (${Math.max(big[4],big[5])}-${Math.min(big[4],big[5])}). ${fpk(['Contundencia total.','Una exhibición.','El rival no supo qué hacer.'])}\n#J${w+1}`,{card:card(big),big:1,my:big===mr}));
 const up=rs.filter(r=>r[4]!=r[5]).map(r=>({r,g:so(ls(r))-so(wn(r))})).filter(x=>x.g>=3).sort((a,b)=>b.g-a.g)[0];
 if(up)mk.push(()=>fdAdd('marca',`⚠️ SORPRESA | ${T(wn(up.r)).n} tumba a ${T(ls(up.r)).n}. ${fpk(['Nadie lo esperaba.','Resultado inesperado que mueve la tabla.','Los favoritos tropiezan.'])}`,{card:card(up.r),my:up.r===mr}));
 if(mr)mk.push(()=>fdAdd('marca',d>=2?`${me.n} golpea fuerte: ${sg(mr)}. ${mg} gana crédito en el banquillo.`:d==1?`${me.n} se lleva un triunfo ajustado ante ${T(o).n} y ${pos<=3?'se mantiene en la zona noble':'sigue escalando posiciones'}.`:d==0?`Tablas entre ${me.n} y ${T(o).n}. ${gf==0?'Poco fútbol y ninguna ocasión clara.':'Reparto de puntos con goles.'}`:`${me.n} cae ante ${T(o).n}${d<=-2?' y aumenta la presión sobre '+mg:''}.`,{my:1,card:card(mr)}));
 if(G.conf<35)mk.push(()=>fdAdd('marca',`🔥 Mal ambiente en ${me.n}: la directiva ya sopesa el futuro de ${mg} en el banquillo.`,{my:1}));
 else if(G.conf>82)mk.push(()=>fdAdd('marca',`💪 El crédito de ${mg} está por las nubes en el ${me.n}: la directiva quiere blindarlo.`,{my:1}));
 const fa=xi(me).reduce((s,p)=>s+(p.fa|0),0)/11;
 if(fa>45)mk.push(()=>fdAdd('marca',`🥵 Preocupación en ${me.n}: el once llega al límite físico. ¿Toca rotar, ${mg}?`,{my:1}));
 G.ld=G.ld||{};if(G.ld[l]!=null&&G.ld[l]!=lead.id&&w>2)must.push(()=>fdAdd('marca',`👑 CAMBIO DE LÍDER | ${lead.n} se pone al frente de la ${LN} con ${lead.pts} puntos.`,{big:1,my:lead.id==G.me}));G.ld[l]=lead.id;
 must.concat(fsh(mk)).slice(0,2).forEach(f=>f());
 /* 4. clubes rivales */
 const cw=rs.filter(r=>r!==mr&&r[4]!=r[5]).sort((a,b)=>Math.abs(b[4]-b[5])-Math.abs(a[4]-a[5]))[0];
 if(cw&&Math.random()<.85)fdClub(wn(cw),fpk([`🏁 FINAL | ${sg(cw)}. ¡Gran trabajo del equipo!`,`✅ Tres puntos más. Gracias por vuestro apoyo en la grada 💪`,`🔥 ¡${sg(cw)}! Así se compite.`]),{card:card(cw),m:.25});
 /* 5. Opta */
 const ok=[],sp=fpool(l).sort((a,b)=>b.p.g-a.p.g)[0];
 if(sp&&sp.p.g>0)ok.push(()=>fdAdd('opta',`🎯 ${sp.p.n} (${sp.t.n}) lidera el pichichi de la ${LN} con ${sp.p.g} goles tras ${w+1} jornadas.\n#Pichichi`,{card:{t:'s',n:sp.p.g,l:'goles',cr:sp.t.id}}));
 let bs=null;rs.forEach(r=>[r[2],r[3]].forEach(i=>[['v',3,'victorias seguidas'],['u',5,'partidos sin perder'],['d',3,'derrotas seguidas'],['w',5,'jornadas sin ganar']].forEach(([k,mn,tx])=>{const n=fdSk(i,k);if(n>=mn&&(!bs||n>bs.n))bs={i,n,tx}})));
 if(bs)ok.push(()=>fdAdd('opta',`📈 ${T(bs.i).n}: ${bs.n} ${bs.tx}. ${bs.tx.includes('derrotas')||bs.tx.includes('sin ganar')?'Racha negativa que preocupa.':'Un dato que habla de su momento.'}`,{card:{t:'s',n:bs.n,l:bs.tx,cr:bs.i},my:bs.i==G.me}));
 const sa=fpool(l).sort((a,b)=>(b.p.a|0)-(a.p.a|0))[0];if(sa&&(sa.p.a|0)>0)ok.push(()=>fdAdd('opta',`🅰️ ${sa.p.n} (${sa.t.n}) lidera las asistencias de la ${LN} con ${sa.p.a}.`,{card:{t:'s',n:sa.p.a,l:'asistencias',cr:sa.t.id}}));
 const hw=rs.filter(r=>r[4]>r[5]).length,dr=rs.filter(r=>r[4]==r[5]).length,aw=rs.length-hw-dr;
 ok.push(()=>fdAdd('opta',`📊 Jornada ${w+1} de la ${LN}: ${hw} victorias locales, ${dr} empates y ${aw} triunfos visitantes.\n#J${w+1}`,{card:{t:'s',n:`${hw}-${dr}-${aw}`,l:'locales · empates · visitantes'}}));
 (bs?ok.slice(0,2):fsh(ok).slice(0,1)).forEach(f=>f());
 /* 6. Transfermarkt */
 if(Math.random()<.9){const mp=scorer?me.pl.find(p=>p.n==scorer):null;
  if(mp)fdAdd('tm',`📈 ${mp.n} (${me.n}) ve crecer su valor de mercado tras su actuación en la jornada ${w+1}.`,{card:fdVal(mp,me,Math.round(R(4,14))),my:1});
  else{const x=fpk(fpool(l).sort((a,b)=>mval(b.p)-mval(a.p)).slice(0,14)),up=Math.round(R(-6,12));fdAdd('tm',`💶 Actualización de valor de mercado | ${x.p.n} (${x.t.n}).`,{card:fdVal(x.p,x.t,up),my:x.t.id==G.me})}}
 if(w%10==9){const tp=fpool(l).sort((a,b)=>mval(b.p)-mval(a.p)).slice(0,3);fdAdd('tm',`🔝 Los más valiosos de la ${LN}:\n${tp.map((x,i)=>`${i+1}. ${x.p.n} (${x.t.n}) · ${fmv(mval(x.p))}`).join('\n')}`)}
 /* 7. Jorge de la Mata */
 if(Math.random()<.75)fdRumor(l);
 if(Math.random()<.25){const st=me.pl.slice().sort((a,b)=>b.ovr-a.ovr).slice(0,4),p=fpk(st),dd=fpk(G.T.filter(t=>t.lg==l&&t.id!=G.me).sort((a,b)=>so(b.id)-so(a.id)).slice(0,6));
  fdAdd('jorge',`🚨 Suena fuerte: ${dd.n} quiere a ${p.n}. ${fpk([`El ${me.n} lo considera intocable... de momento.`,'La directiva escuchará ofertas si llegan.',`Aún no hay oferta formal por parte de ${dd.n}.`])}`,{card:fdVal(p,me,Math.round(R(2,10))),my:1})}
 if(Math.random()<.3)fdAdd('jorge',G.conf>60?`🗣️ Fuentes del ${me.n}: la directiva está encantada con ${mg}. ${fpk(['Planean ampliarle el crédito.','Sin dudas en el palco.'])}`:G.conf>=35?`🗣️ En el palco del ${me.n} hay división de opiniones sobre ${mg}. Se esperan resultados.`:`🚨 Reunión de urgencia en el palco del ${me.n}. El futuro de ${mg} se decide en las próximas jornadas.`,{my:1});
 /* 8. próxima jornada del club */
 const nf=((G.fx[l]||[])[w+1]||[]).find(x=>x.includes(G.me));
 if(nf&&Math.random()<.8){const hh=nf[0]==G.me,ro=hh?nf[1]:nf[0];fdClub(G.me,`🔜 Jornada ${w+2}: ${hh?'nos toca en casa':'viajamos'} ante ${T(ro).n}. ${hh?'Os queremos en la grada 🏟️':'Gracias por acompañarnos fuera 🚌'}\n#${slg}`,{m:.35})}
 /* 9. afición */
 if(mr)fdReact(G.me,mr,0);
 if(mr&&Math.random()<.6)fdReact(o,mr,1);
 const ot=rs.filter(r=>r!==mr);if(ot.length&&Math.random()<.6){const r=fpk(ot),c=Math.random()<.5?r[2]:r[3];fdReact(c,r,2)}
 try{fdPersonas(mr?{s:sg(mr),rv:T(o).n,d}:null)}catch(e){console.error(e)}
 if(G.fans<30&&Math.random()<.4)fdFan(G.me,fpk(['Las gradas vacías no son casualidad. Necesitamos un proyecto, no excusas. #DirectivaOut','Cada vez somos menos en el estadio. Que alguien lo arregle ya.']),{my:1,v:3});
 G.feed.sort((a,b)=>a.i-b.i);save()}

/* ---------- arranque de temporada y fin de temporada ---------- */
function feedStart(first){const me=G.T[G.me],l=me.lg,LN=LGN[l],tb=G.T.filter(t=>t.lg==l).sort((a,b)=>str(b).o-str(a).o),fav=tb[0],mg=G.mgr,slg=fslug(me.n),rk=tb.findIndex(t=>t.id==G.me)+1;
 FW=-1;FT=Math.floor(R(480,540));
 if(first)fdClub(G.me,`👋 ¡Bienvenido, ${mg}! Nuevo entrenador del ${me.n} para la temporada ${G.season}. Objetivo: ${objTxt(G.obj[0])}. #${slg}`,{m:.9,big:1});
 fdAdd('l'+l,`⚽ ¡Arranca la ${LN} ${G.season}! ${tb.length} equipos, ${NWL[l]} jornadas y una sola ilusión: ser campeón.\n#${fslug(LN)}`);
 fdAdd('marca',rk==1?`🔝 ${me.n} parte como el equipo a batir en la ${LN}. La presión, desde el primer día, es toda suya.`:`🔝 ${fav.n} parte como favorito en la ${LN}, pero ${me.n} (${rk}º por plantilla) quiere dar la sorpresa.`,{my:1});
 fdAdd('opta',`📊 Según nuestro modelo, ${fav.n} es el favorito (media ${Math.round(str(fav).o)}). ${me.n} aparece ${rk}º de ${tb.length} por nivel de plantilla.`,{card:{t:'s',n:Math.round(str(me).o),l:`media del ${me.n}`,cr:G.me},my:1});
 const x=fpool(l).sort((a,b)=>mval(b.p)-mval(a.p))[0];if(x)fdAdd('tm',`💶 El jugador más valioso de la ${LN} ${G.season}: ${x.p.n} (${x.t.n}).`,{card:fdVal(x.p,x.t,0),my:x.t.id==G.me});
 fdRumor(l);
 fdFan(G.me,fpk(['¡Ya huele a fútbol! Este año va a ser grande 💪','Nuevo año, nueva ilusión. Abonos renovados y a por todas #'+slg,'Que empiece ya. Estamos listos para animar hasta el final ❤️']),{my:1,v:4});
 try{const V=perV(null);perPost(fpk(perGrp('fan')),null,V,1);perPost(fpk(perGrp('hater')),null,V,1);if(Math.random()<.7)perPost(fpk(perGrp('tonto')),null,V,0)}catch(e){console.error(e)}
 G.feed.sort((a,b)=>a.i-b.i);save()}
function feedSeason(s){const me=G.T[G.me],slg=fslug(me.n),id=n=>{const t=G.T.find(t=>t.n==n);return t?t.id:null},ch=id(s.champ);
 FW=-2;FT=Math.floor(R(500,560));
 fdAdd('marca',`🏆 ¡${s.champ} es campeón de la ${LGN[1]} ${s.season}! ${fpk(['Una temporada para la historia.','Lo ha merecido de principio a fin.','Fiesta grande en la ciudad.'])}`,{big:1,my:ch==G.me});
 fdAdd('l1',`🏆 Fin de temporada ${s.season}: campeón ${s.champ}. Descienden: ${s.rel.join(', ')}.`,{card:ch!=null?{t:'s',n:'1º',l:s.champ,cr:ch}:null});
 fdAdd('l2',`⬆️ Ascienden a la ${LGN[1]}: ${s.pro.join(', ')}. ¡Enhorabuena!`);
 if(s.sc)fdAdd('opta',`🎯 Pichichi ${s.season}: ${s.sc[0]} (${s.sc[1]}) termina con ${s.sc[2]} goles.`,{card:{t:'s',n:s.sc[2],l:'goles · '+s.sc[0],cr:id(s.sc[1])}});
 fdClub(G.me,`🎬 Termina la temporada ${s.season}: ${s.pos}º en la ${LGN[s.lg]}. ${s.met}/${s.tot} objetivos cumplidos. Gracias por todo, afición. #${slg}`,{m:.8,big:1});
 if(s.fired)fdAdd('marca',`🚨 ÚLTIMA HORA | ${me.n} destituye a ${G.mgr}. La directiva pone fin a su etapa.`,{big:1,my:1});
 fdAdd('jorge',`🚨 Arranca el mercado de verano. Se esperan movimientos importantes en las dos ligas. #Mercado`);
 G.feed.sort((a,b)=>a.i-b.i);feedStart(0)}
function fdInit(){if(G.fans==null)G.fans=60;if(G.seen==null)G.seen=0;if(!G.feed){G.feed=[];G.fs=0;feedStart(1)}}

/* ---------- pintado ---------- */
const fdList=f=>{const a=G.feed.slice().reverse();return f=='all'?a:f=='my'?a.filter(p=>p.my):a.filter(p=>p.c==f)};
const fdAv=a=>`<span class="av br${a.img.startsWith('LOGO')?' lg':''}"><i>${fesc(a.n[0])}</i><img src="img/${encodeURIComponent(a.img)}" alt="" onerror="this.parentNode.classList.add('nf');this.remove()"></span>`;
const VF='<svg class="vf" viewBox="0 0 24 24" aria-label="Cuenta verificada"><circle cx="12" cy="12" r="11"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function fdAcc(p){if(p.a){const a=ACC[p.a];return{n:a.n,h:a.h,v:1,av:fdAv(a)}}
 if(p.per!=null&&PER[p.per]){const P=PER[p.per];return{n:P.n,h:P.h,v:0,av:`<span class="av br per"><i>${fesc(P.n[0])}</i><img src="img/${P.img}" alt="" onerror="this.parentNode.classList.add('nf');this.remove()"></span>`}}
 if(p.k=='club'){const t=G.T[p.cr];return{n:t.n,h:fslug(t.n),v:1,av:`<span class="av cl">${crest(p.cr,34)}</span>`}}
 return{n:p.fn,h:p.fh,v:0,av:`<span class="av cl fn">${crest(p.cr,34)}</span>`}}
function fdEmb(c){if(!c)return'';
 if(c.t=='r')return `<div class="qc">${fdRes(c.h,c.a,c.hg,c.ag)}</div>`;
 if(c.t=='l')return `<div class="qc ql">${c.rows.map(r=>fdRes(...r)).join('')}</div>`;
 if(c.t=='s')return `<div class="qc qs">${c.cr!=null?crest(c.cr,34):''}<b class="bn">${fesc(c.n)}</b><span>${fesc(c.l)}</span></div>`;
 if(c.t=='v')return `<div class="qc qv">${crest(c.cr,34)}<div class="vi"><b>${fesc(c.pn)}</b><span class="mu sm">${PN[c.pos]} · ${fesc(G.T[c.cr].n)} · ${c.age} años</span></div><div class="vv"><b>${fesc(c.val)}</b><em class="${c.up>=0?'ok':'ko'}">${c.up>=0?'▲':'▼'} ${Math.abs(c.up)}%</em></div></div>`;return''}
const fdTxt=s=>fesc(s).replace(/(#[\p{L}\p{N}_]+)/gu,'<span class="ht">$1</span>').replace(/\n/g,'<br>');
function fdPost(p,seen){const a=fdAcc(p),wl=p.w==-1?'Pretemporada':p.w==-2?'Fin de temporada':'J'+(p.w+1);
 return `<article class="po${p.my?' my':''}${p.i>seen?' nw':''}" data-i="${p.i}">${a.av}<div class="pb"><div class="ph"><b>${fesc(a.n)}</b>${a.v?VF:''}<span class="hd">@${fesc(a.h)}</span><span class="dt">· ${wl} · ${p.tm}</span></div><div class="px">${fdTxt(p.tx)}</div>${fdEmb(p.card)}<div class="pf"><button class="a cmb" data-a="cm" title="Ver comentarios">💬 <b>${fN(p.rp)}</b></button><button class="a rt${p.rtd?' on':''}" data-a="rt">⟲ <b>${fN(p.rt)}</b></button><button class="a lk${p.lkd?' on':''}" data-a="lk">♥ <b>${fN(p.lk)}</b></button><span class="a">📈 <b>${fN(p.vw)}</b></span></div></div></article>`}
function feedHome(){const a=fdList('all').filter(fdTop).slice(0,6),seen=G.seen|0;
 return `<section class="pn fdp"><div class="fdh"><h3><span class="live"></span>Destacados · Mundo Superstar</h3><button id="fall">Ver todo →</button></div>${a.map(p=>fdPost(p,seen)).join('')||'<p class="mu" style="padding:16px">Todavía no hay tweets destacados.</p>'}</section>`}
function fdSide(){const me=G.T[G.me],l=me.lg,w=G.week,tb=tab(l),sp=fpool(l).sort((a,b)=>b.p.g-a.p.g)[0],
 hv=s=>{let x=7;for(const ch of s)x=(x*31+ch.charCodeAt(0))%99991;return 900+(x*(w+5))%47000},
 tr=[['#'+fslug(me.n),'Tu club'],['#J'+Math.min(w+1,NWL[l]),'Jornada en juego'],['#'+fslug(tb[0].n),'Líder de la liga'],sp&&sp.p.g>0?['#Pichichi',sp.p.n+' · '+sp.p.g+' goles']:null,['#Mercado','Rumores de fichajes'],['#'+fslug(LGN[l]),LGN[l]]].filter(Boolean),
 rows=tb.slice(0,5);if(!rows.some(t=>t.id==G.me))rows.push(me);
 return `<div class="pn"><h3>Tendencias</h3>${tr.map(([t,s])=>`<div class="tr"><span class="mu sm">${fesc(s)} · Tendencia</span><b>${fesc(t)}</b><span class="mu sm">${fN(hv(t))} publicaciones</span></div>`).join('')}</div>
 <div class="pn"><h3 class="lgt">${lgl(l,44)}<span>${LGN[l]}</span></h3><table class="mini">${rows.map(t=>`<tr class="${t.id==G.me?'me':''}"><td class="n">${tb.indexOf(t)+1}</td><td><span class="tn">${crest(t.id,20)}${t.n}</span></td><td class="n"><b>${t.pts}</b></td></tr>`).join('')}</table></div>
 <div class="pn"><h3>Cuentas que mandan</h3>${Object.values(ACC).map(a=>`<div class="ac">${fdAv(a)}<div><b>${fesc(a.n)}</b>${VF}<br><span class="mu sm">@${a.h} · ${a.f} seguidores</span></div></div>`).join('')}</div>`}
function feedFull(){const f=S.ff||'all',n=S.fn||20;
 if(!S.socOpen){S.socOpen=true;S.fseen=G.seen|0;G.seen=G.fs;save()}
 const L=fdList(f),seen=S.fseen|0;
 return `<div class="sg"><section class="pn fdp"><div class="fdh"><h3><span class="live"></span>Redes · Mundo Superstar</h3></div><div class="fx">${FF.map(([k,t])=>`<button data-f="${k}" class="${f==k?'on':''}">${t}</button>`).join('')}</div>${L.slice(0,n).map(p=>fdPost(p,seen)).join('')||'<p class="mu" style="padding:16px">Todavía no hay publicaciones aquí.</p>'}${L.length>n?'<button id="fmore" class="mr">Cargar más publicaciones</button>':''}</section><aside class="sd">${fdSide()}</aside></div>`}
function fdBind(){
 document.querySelectorAll('.po .a[data-a]').forEach(b=>b.onclick=()=>{const po=b.closest('.po'),p=G.feed.find(x=>x.i==+po.dataset.i);if(!p)return;if(b.dataset.a=='cm'){fdCmToggle(po,p);return}const k=b.dataset.a=='lk'?'lk':'rt',d=k+'d';p[d]=!p[d];p[k]+=p[d]?1:-1;b.classList.toggle('on',!!p[d]);b.querySelector('b').textContent=fN(p[k]);save()});
 document.querySelectorAll('.fx [data-f]').forEach(b=>b.onclick=()=>{S.ff=b.dataset.f;S.fn=20;render()});
 const m=$('#fmore');if(m)m.onclick=()=>{S.fn=(S.fn||20)+20;render()};
 const a=$('#fall');if(a)a.onclick=()=>{S.tab='soc';S.socOpen=false;render()}}
