/* ===== Redes sociales del universo Superstar (estilo X / Twitter) =====
   v2: declaraciones y entrevistas por tipo de gol/situación, prensa rival y directiva, personas reales con roles (fan/crit/neu) y comentarios que reaccionan al tema de cada publicación.
   Cada jornada se generan publicaciones de prensa, datos, mercado, ligas, clubes y aficionados.
   Imágenes esperadas en /img: MARCA.png, JORGE.png, OPTA.png, TRANSFER.png, FD.png, SKY.png, HERTZ.png, SERGIO.png, LOGO 1A.png, LOGO 2A.png,
   ST1..ST3.png (MVP, jugador del mes, hat-trick), ST4.png y ST4-2.png (portería a 0) */
const ACC={
 marca:{n:'MARCA',h:'marca',img:'MARCA.png',m:1.6,f:'4,8 M',c:'prensa'},
 jorge:{n:'Jorge de la Mata Oficial',h:'JorgedelaMata',img:'JORGE.png',m:1.9,f:'12,3 M',c:'fich'},
 opta:{n:'Opta',h:'OptaSuperstar',img:'OPTA.png',m:.8,f:'2,1 M',c:'datos'},
 tm:{n:'Transfermarkt',h:'TransfermarktES',img:'TRANSFER.png',m:.7,f:'1,6 M',c:'datos'},
 l1:{n:'Liga Superstar One',h:'SuperstarOne',img:'LOGO 1A.png',m:1.1,f:'3,4 M',c:'prensa'},
 l2:{n:'Liga Superstar 2',h:'Superstar2',img:'LOGO 2A.png',m:.6,f:'890 K',c:'prensa'},
 fd:{n:'FD SPORTS',h:'FDSports',img:'FD.png',m:1.5,f:'7,8 M',c:'fd'},
 sky:{n:'Sky Sports',h:'SkySports',img:'SKY.png',m:1.7,f:'9,4 M',c:'sky'},
 hertz:{n:'HERTZ',h:'hertz',img:'HERTZ.png',m:1.3,f:'5,2 M',c:'prensa'},
 sergio:{n:'Sergio Navarro',h:'SergioNavarro',img:'SERGIO.png',m:1.0,f:'1,4 M',c:'prensa'}};
/* imágenes stock de los eventos nuevos (si una no existe, la tarjeta se muestra sin foto) */
const IMG={cs:['ST4.png','ST4-2.png'],iv:[]};
const FF=[['all','Todo'],['my','Mi club'],['prensa','Noticias'],['fich','Fichajes'],['datos','Datos'],['club','Clubes'],['fan','Afición']];
let FW=0,FT=540;
/* Solo se muestran noticias de la jornada actual: la última jugada (G.week-1). Al empezar temporada (G.week==0) se ven fin de temporada (-2) y pretemporada (-1) */
const fdCurW=()=>G.week>0?[G.week-1]:[-2,-1],fdCur=p=>fdCurW().includes(p.w);
/* En 'Todo' solo sale la jornada actual; en filtros (Mi club, Noticias...) y perfiles se guardan también ~3 jornadas anteriores */
const FKEEP=3;
const fdRecW=()=>{const w=G.week,o=[];for(let i=w-1;i>=Math.max(0,w-1-FKEEP);i--)o.push(i);if(w-1-FKEEP<0)o.push(-1,-2);return o},fdRec=p=>fdRecW().includes(p.w);
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
 if(a)p.a=a;if(o.k)p.k=o.k;if(o.per!=null)p.per=o.per;if(o.big||o.top)p.tp=1;if(o.cr!=null)p.cr=o.cr;if(o.fn){p.fn=o.fn;p.fh=o.fh}if(o.card)p.card=o.card;if(o.my)p.my=1;if(o.pn)p.pn=o.pn;if(o.pt!=null)p.pt=o.pt;if(o.sn)p.sn=o.sn;if(o.qk)p.qk=o.qk;
 G.feed.push(p);if(G.feed.length>160)G.feed.splice(0,G.feed.length-160);return p}
const fdClub=(c,tx,o={})=>fdAdd(null,tx,{...o,k:'club',c:'club',cr:c,m:o.m??.2,my:o.my||c==G.me});
function fdFan(c,tx,o={}){const C=G.T[c].n,s=fslug(C),y=1890+(c*37)%100,nu=(c*13)%90+10,
 pl=[[`Afición ${C}`,`Aficion${s}`],[`Sentimiento ${C}`,`Sentimiento${s}`],[`Grada ${C}`,`Grada${s}`],[`${C} desde ${y}`,`${s}${y}`],[`Socios del ${C}`,`Socios${s}`],[`Peña ${C} ${nu}`,`Pena${s}${nu}`]][((c+(o.v|0))*7)%6];
 return fdAdd(null,tx,{...o,k:'fan',c:'fan',cr:c,fn:pl[0],fh:pl[1],m:o.m??.05})}
const FANS={
 w3:['{s}. Esto es lo que queremos ver cada semana 🔥 #{t}','Goleada y a dormir feliz. Gracias, equipo. {s}.','{rv} no ha tenido ni una opción. Qué manera de jugar.','Llevábamos tiempo sufriendo y hoy por fin se ha disfrutado. {s}.','Si el equipo juega así, la grada se llena sola. #{t}','Partido redondo. Enhorabuena, {m}, esto se ve desde la grada.','{s}. De los partidos que dan ganas de volver el próximo fin de semana.'],
 w:['Tres puntos y a seguir. #{t}','Se sufrió, pero se ganó. Eso vale mucho en una liga larga.','{s}. Seguimos sumando.','No fue el mejor partido, pero los tres puntos valen igual. Gracias, equipo.','Victoria y a pensar ya en el siguiente. Buen trabajo, {m}.','Salimos del campo con la voz hecha polvo y una sonrisa. {s} #{t}'],
 e:['Un punto que sabe a poco, pero suma. #{t}','{s}. Se ha competido, pero faltó acierto.','Empate. Queríamos ganar, aunque tampoco es para dramatizar.','Hoy no tocó. A trabajar la semana, {m}.','Mucho querer y poco poder en el último pase. Hay que afinar.','{s}. Dos puntos que se nos escapan, pero seguimos ahí.'],
 l:['Duele. Pero esto se arregla trabajando, {m}.','{s}. Hoy el rival fue mejor. Toca revisar.','Derrota. A levantar la cabeza, que la temporada es larga. #{t}','Mala tarde, no hay otra. A ver si el próximo partido nos devuelve la sonrisa.','El equipo ha dado la cara, pero no ha sido suficiente.','{s}. Nos vamos tristes, pero el escudo no se abandona. #{t}'],
 l3:['{s}. Un resultado que cuesta explicar. {m}, hay que dar la cara.','Se nos ha ido el partido de las manos. No hay excusas. #{t}','Hoy no hemos estado. Que sirva de aviso: hay muchas cosas que corregir.','Mala noche. Pero seguimos aquí, como siempre. #{t}','{s}. Hay que revisar todo, desde la alineación hasta la actitud.','Salgo del estadio sin palabras. Toca hablar en el vestuario y mirarnos al espejo.']};
function fdReact(c,r,v){const d=r[2]==c?r[4]-r[5]:r[5]-r[4],k=d>=3?'w3':d>0?'w':d==0?'e':d<=-3?'l3':'l',mine=c==G.me,
 s=`${G.T[r[2]].n} ${r[4]}-${r[5]} ${G.T[r[3]].n}`;
 let x=fpk(FANS[k]).replace(/\{s\}/g,s).replace(/\{rv\}/g,G.T[r[2]==c?r[3]:r[2]].n).replace(/\{m\}/g,mine?G.mgr:'míster').replace(/\{t\}/g,fslug(G.T[c].n));
 if(mine&&d<0&&G.fans<30)x+=' #DirectivaOut';
 return fdFan(c,x,{my:mine,v:v|0,sn:k})}
/* ---------- cuentas de personas con foto (CARA1..CARA9.png en /img; CARA3 es un señor mayor y CARA6 una mujer) ----------
   role: 'fan' (apoya, con matices) · 'crit' (exigente, con argumentos) · 'neu' (analiza con calma)
   rs: reacción al resultado del club del jugador (w3 goleada · w victoria · e empate · l derrota · l3 derrota abultada) · r: opiniones sueltas · cx: comentarios genéricos
   Marcadores: {s} resultado · {rv} rival · {m} míster · {c} club · {t} hashtag del club · {ms} hashtag del míster · {pos} puesto en liga · {nx} próximo rival · {gl} máximo goleador del club */
const PER=[
 {n:'Paco Ruiz',h:'PacoRuiz61',img:'CARA1.png',role:'crit',
  rs:{w3:['{s}. Muy bien, pero lo que me interesa es cómo se ha defendido, no solo cuántos goles hemos metido.','Goleada. Ahora a ver si lo repetimos contra un rival que no se deje.'],
   w:['Tres puntos, pero el equipo ha pasado demasiado rato sin el balón. Eso, tarde o temprano, se paga.','Ganar es lo que cuenta. Pero hoy ha habido más suerte que fútbol, {m}.'],
   e:['Empate que se veía venir: poco peligro arriba y los cambios, tarde otra vez.','{s}. Dos puntos perdidos, y lo digo sin dramatismo.'],
   l:['{s}. Desde el minuto 20 se veía que no íbamos a competir el partido. {m}, hay que cambiar algo.','No voy a pedir dimisiones. Pero explicaciones, sí. #{t}'],
   l3:['{s}. Esto no es un mal día: es un problema de planteamiento y de plantilla.','Hacía años que no veía al {c} tan roto. Esto hay que arreglarlo ya.']},
  r:['Llevo treinta años de socio y lo que más me cansa no es perder, es perder sin entender el plan.','Los cambios llegan siempre quince minutos tarde. Lo llevo diciendo toda la temporada.','Hoy he releído la alineación tres veces. Sigo sin ver al pivote que necesitamos.','Estamos en el puesto {pos}. Para unos es mucho, para otros poco. Yo creo que todavía no hemos visto el techo del equipo.','Cuando el equipo juega bien, {m} tiene razón. Cuando no, también hay que decirlo. Es lo mínimo.'],
  cx:['Yo lo veo un poco distinto, la verdad.','Hasta que no se vea en el campo, no me lo creo.','Con todo el respeto: eso ya lo dijeron en otras temporadas.']},
 {n:'Jordi Casas',h:'JordiCasas9',img:'CARA2.png',role:'fan',
  rs:{w3:['{s}. En el tercero se me ha puesto la piel de gallina. Qué manera de jugar. #{t}','Noche de las que enganchan. Gracias, equipo. {s}.'],
   w:['Tres puntos y a la cama con una sonrisa. Hoy tocaba sufrir un poco, pero se ha ganado. #{t}','Ganar jugando regular es lo que hacen los equipos grandes. Seguimos.'],
   e:['Un punto. Duele un poco, pero el equipo ha competido. A por el siguiente.','{s}. No es lo que queríamos, pero la liga es larga. #{t}'],
   l:['Hoy ha dolido. Pero esto va de levantarse, y a este equipo le sobra carácter.','{s}. Toca apretar los dientes y trabajar. Yo sigo creyendo en {m}.'],
   l3:['Un día para olvidar. Que sirva para aprender y que el próximo partido lo demostremos.','Me duele, no voy a mentir. Pero la camiseta se defiende también en los días malos.']},
  r:['Ya estoy contando los días para el siguiente partido en casa. #{t}','Llevé a mi hermana pequeña al estadio por primera vez. Ahora quiere camiseta. Un fichaje de cantera 😄','Hoy toca ver la repetición del partido con calma. Siempre se aprende algo.','El ambiente en la grada cuando el equipo aprieta es insuperable. #{t}'],
  cx:['Yo de verdad creo que lo del equipo va a más. #{t}','Eso es lo que me gusta leer.','Que nadie se baje del barco ahora.']},
 {n:'Manolo Ibáñez',h:'ManoloIbanez',img:'CARA3.png',role:'neu',
  rs:{w3:['{s}. Hacía tiempo que no veía al equipo tan suelto. Que no se suban las cabezas, eso sí.'],
   w:['Ganar sufriendo también enseña. Lo que cuenta es sumar.'],
   e:['Un empate no es nada malo si se aprende de él.'],
   l:['Hemos perdido. Cuando llevas tantos años en el campo, aprendes que una derrota no define una temporada.'],
   l3:['{s}. Un resultado duro. Pero este equipo ya ha sabido levantarse antes; ahora toca hacerlo otra vez.']},
  r:['Hoy se oía más a los jóvenes que a los de siempre. Antes era al revés, pero está bien que vengan.','Llevo cuarenta años de abonado. Lo que más me gusta sigue siendo llegar una hora antes y ver el campo vacío.','Un equipo se construye desde atrás. Aunque ahora todo el mundo mire a los delanteros.','He visto entrenadores ir y venir. {m} tiene tiempo, creo: los proyectos no se miden en dos jornadas.','Cuando el {c} compite, se nota en cómo vuelve la gente a casa: más hablada, menos callada.'],
  cx:['Esto ya lo he visto otras veces; casi siempre termina bien si hay paciencia.','Hay que mirar la temporada entera, no solo un partido.','Cosas del fútbol. Un día se gana y otro se aprende.']},
 {n:'Dani Vera',h:'DaniVera_',img:'CARA4.png',role:'neu',
  rs:{w3:['{s}. Lo mejor: la presión tras pérdida. El rival no ha podido salir limpio ni una vez.','{s}. Dominio claro en los dos tercios del campo. Ahora, a mantenerlo. #{t}'],
   w:['Victoria con un patrón claro: bloque medio, salidas rápidas y control tras el descanso. Eso es de equipo con plan. #{t}','Tres puntos. El partido se ha decidido por pequeños detalles en las áreas.'],
   e:['Empate. Más posesión que peligro: falta el último pase.','{s}. Muchos metros ganados, pocas ocasiones claras. Hay que afinar.'],
   l:['{s}. Mucho espacio entre líneas y el rival lo ha explotado. Es corregible.','Derrota. La salida de balón ha fallado en los momentos clave; pasa por entrenar más ese patrón.'],
   l3:['{s}. Más que el resultado, preocupa cómo se ha roto el equipo en transición. Hay trabajo táctico por delante.']},
  r:['Me fijo en lo que no sale en la tele: las coberturas. Un equipo se explica por ellas.','Los datos de ocasiones ayudan, pero no lo cuentan todo. A veces un partido se gana en un córner bien trabajado.','Mi opinión: el {c} tiene mejor plantilla de lo que dice la tabla. Dependerá de cómo gestionemos el calendario.','Para el partido ante {nx}: si el rival presiona alto, la clave estará en el pivote y en cómo salga el central.','Cuando el lateral del lado débil no cierra al interior, se abre una vía. Hoy la he vuelto a ver en otro partido.'],
  cx:['Lo importante es cómo se ha llegado a eso, no solo el resultado.','Hay que mirar el partido entero, no un solo momento.','Los datos dicen algo parecido, aunque con matices.']},
 {n:'Sergio Molina',h:'SergioMolina_',img:'CARA5.png',role:'crit',
  rs:{w3:['{s}. Resultado engañoso: el rival ha jugado mal. Hay que ver al equipo ante rivales que sí aprieten.'],
   w:['Tres puntos, pero el nivel de la liga está tan igualado que cualquier ventaja parece enorme.'],
   e:['Empate lógico: los dos han jugado a no perder.'],
   l:['{s}. Se pierde por errores no forzados. Eso no es mala suerte.'],
   l3:['{s}. Esto pasa cuando no se renueva la plantilla a tiempo.']},
  r:['Me gustaría ver más cantera en el {c} y menos fichajes de última hora.','Pagar traspasos caros por un nombre sin mirar el encaje táctico: el mal de muchos clubes.','Cada vez me creo menos las palabras de las ruedas de prensa y más los números del campo.','El problema de esta liga no son los entrenadores: son los calendarios y la planificación de los clubes.'],
  cx:['Habrá que ver si dura.','Eso se dice fácil. Otra cosa es hacerlo.','Prefiero esperar a ver más partidos antes de opinar.']},
 {n:'Lorena Díaz',h:'LorenaDiaz_',img:'CARA6.png',role:'fan',
  rs:{w3:['¡Qué noche! Mi padre ha vuelto a ser un niño en la grada. {s}. #{t}'],
   w:['Tres puntos. Hoy hemos salido del estadio contentos y con la voz hecha polvo 😅 #{t}'],
   e:['Hoy no ha podido ser, pero la grada ha cantado hasta el final y eso también cuenta.'],
   l:['Derrota que duele. Pero se vuelve el siguiente fin de semana, que para eso somos aficionados.'],
   l3:['{s}. Se nos ha hecho larga la tarde, pero el escudo no se abandona.']},
  r:['Entre semana trabajo y los fines de semana, estadio. Mi rutina favorita. #{t}','Mi sobrino de seis años ya se sabe la alineación de memoria. Futuro ojeador, sin duda.','Lo que más me gusta del {c} es cómo se junta la afición en las malas. Ahí se ve quién es de verdad.','Para el partido ante {nx} ya tengo entradas. A ver si el ambiente acompaña.'],
  cx:['Qué bien da leer esto.','Totalmente de acuerdo.','Yo también lo vi así desde la grada.']},
 {n:'David Ortega',h:'DavidOrtega_',img:'CARA7.png',role:'neu',
  rs:{w3:['{s}. Una goleada sube mucho la confianza, pero conviene no sacar conclusiones con una sola muestra.','{s}. Buen dato para el equipo, aunque la liga se juega a largo plazo.'],
   w:['Victoria ajustada. En un campeonato largo, estos partidos suelen decidir la temporada.','Tres puntos. Lo mejor: el equipo mantiene el orden cuando el partido se complica.'],
   e:['Empate. Con los datos en la mano, el partido ha estado equilibrado.','{s}. Un punto que, según cómo salgan los próximos partidos, puede valer más o menos.'],
   l:['{s}. Una derrota no hace una crisis; dos seguidas, sí. Vamos a ver la próxima jornada.','Derrota. Los números de las últimas semanas dicen que el equipo no está mal, pero hoy no ha estado fino.'],
   l3:['{s}. Un resultado así mueve la tabla y la moral. Lo importante es cómo reaccione el equipo la semana que viene.']},
  r:['Con el calendario que viene, la plantilla va a necesitar rotaciones. Eso también se prepara.','Me gustan los equipos que mejoran poco a poco. Los saltos de repente suelen durar poco.','Mi análisis rápido de la jornada: la liga está muy igualada y cada punto cuenta el doble.','{gl} está siendo clave en el ataque del {c}. Ojo a cómo se gestiona su carga de partidos.'],
  cx:['Interesante lectura, aunque yo miraría también el contexto.','Faltan datos para sacar conclusiones.','Depende de cómo se mire, pero tiene sentido.']},
 {n:'Yassine Amrani',h:'YassineAmrani_',img:'CARA8.png',role:'fan',
  rs:{w3:['Qué noche. {s}. Mañana en el trabajo me van a oír hablar de este partido todo el día. #{t}'],
   w:['Tres puntos y buen ambiente. Vamos, {c}. #{t}','Victoria con humildad y a por la siguiente, {m}. 🙏'],
   e:['Un punto. Hay que mejorar, pero confío en el equipo. El próximo lo ganamos. #{t}','Empate. Cabeza arriba, que la liga es larga.'],
   l:['Hoy no tocaba. Cabeza alta y a seguir, {c}. Hay que mantener la fe.','Derrota dura, pero el equipo lo ha dado todo.'],
   l3:['{s}. Un mal día lo tiene cualquiera. A trabajar más y a levantarse, {c}. #{t}','Hoy duele, pero la afición no se mueve de aquí.']},
  r:['Después del trabajo, a ver el partido con los compañeros. Plan perfecto.','Domingo, familia y {c}. No necesito más ❤️','Quien dice que el fútbol no une es que no ha visto mi grupo de WhatsApp discutiendo la alineación.','Este año el {c} puede dar guerra. Se nota en el vestuario y en la grada. #{t}'],
  cx:['Así se habla.','Ánimo, equipo. Yo estoy con vosotros.','Gracias por compartirlo.']},
 {n:'Nacho Peña',h:'NachoPena_',img:'CARA9.png',role:'crit',
  rs:{w3:['{s}. Se nota la diferencia de nivel. Aun así, contra rivales así hay que mantener la concentración, {m}.','Goleada, pero ojo: un 5-0 se convierte en 5-3 si te relajas.'],
   w:['Tres puntos, bien. Pero el equipo concede demasiado atrás.','Ganar sin brillar. Y ya sabemos cómo acaba eso a la larga.'],
   e:['Empate. Faltó intensidad en la segunda parte. Lo digo con cariño.','Un punto y poco más. Mucho correr y poco peligro.'],
   l:['Perder duele y lo sé de primera mano. Pero faltó intensidad desde el minuto uno, {m}.','{s}. Se perdió la segunda jugada en cada balón. Cosas básicas.'],
   l3:['{s}. Colgué las botas hace poco y esto lo veo desde dentro: aquí falló la actitud.','Lo digo con respeto: un partido así hay que analizarlo con calma. Así no se compite, {m}.']},
  r:['Jugué en categorías regionales hasta hace poco. Os aseguro que sufrir con un equipo sin ritmo es un aprendizaje.','Hay jugadores que corren mucho y otros que corren con sentido. La diferencia se ve en la segunda parte.','Mi consejo desde la grada: más presión tras pérdida. Lo aprendí a base de entrenadores exigentes.','Este {c} me recuerda a mi último equipo: mucha ilusión y poco orden. Pero ilusión sobra ❤️'],
  cx:['Desde dentro del vestuario se ve distinto.','Lo básico: intensidad y orden.','Respeto, pero no coincido.']},
 {n:'David Roldán',h:'DavidRoldan_',img:'CARA10.png',role:'fan',
  rs:{w3:['{s}. ¡Qué tarde más buena! Mis hijos gritando, yo sin voz y todos felices. #{t}','Goleada y a invitar a los de la grada a una ronda. Qué bien se siente esto 😄'],
   w:['Tres puntos y a casa de buen humor. Así da gusto volver a trabajar el lunes. #{t}','Ganar siempre sienta bien. Y ganar con esta gente al lado, mejor.'],
   e:['Un punto. No pasa nada, que la tarde ha sido buena igualmente. A por la siguiente.','Empate. Cuando el equipo compite, yo me voy contento. #{t}'],
   l:['Hoy ha tocado perder. Un abrazo a los de la grada y a seguir, que el próximo fin de semana volvemos.','Derrota, pero con la cabeza alta. {m} y los chicos tienen todo mi apoyo.'],
   l3:['{s}. Ha dolido, no lo voy a negar. Pero uno quiere al equipo en las buenas y en las malas.','Mala tarde. Mañana será otro día. A ver si el próximo partido nos devuelve la sonrisa. #{t}']},
  r:['Primer café del lunes y ya estoy comentando el partido con el vecino. Así se vive el fútbol.','Me ha encantado ver a tanta gente joven en el estadio. El futuro del {c} está en buenas manos.','Mi mujer sabe cuándo ha ganado el {c} por mi humor en la cena. Y tiene razón.','Para el partido ante {nx} llevo bocadillos para toda la peña. Hay que cuidar al equipo y a la afición 😄'],
  cx:['Qué buen rollo da leer esto.','Todo con calma, que la liga es larga.','Eso, eso. Y a disfrutarlo.']}];
const fdFill=(x,V)=>{Object.keys(V).forEach(q=>{x=x.split('{'+q+'}').join(V[q])});return x.replace(/\{\w+\}/g,'')};
const perV=c=>{const me=G.T[G.me],tn=G.T.map(t=>t.n).filter(n=>n!=me.n),x=fpk(tn),y=fpk(tn.filter(n=>n!=x));let pos='',nx='el próximo rival',gl='nuestro nueve';
 try{pos=myPos()}catch(e){}
 try{const f=((G.fx[me.lg]||[])[c?FW+1:G.week]||[]).find(q=>q.includes(G.me));if(f)nx=G.T[f[0]==G.me?f[1]:f[0]].n}catch(e){}
 try{const p=me.pl.slice().sort((a,b)=>(b.g|0)-(a.g|0))[0];if(p&&(p.g|0)>0)gl=p.n}catch(e){}
 return{c:me.n,m:G.mgr,ms:fslug(G.mgr),t:fslug(me.n),s:c?c.s:'',rv:c?c.rv:'el rival',x,y,pos,nx,gl}};
function perPost(i,k,V,my){const P=PER[i],pl=k&&P.rs[k]&&P.rs[k].length?P.rs[k]:P.r;return fdAdd(null,fdFill(fpk(pl),V),{k:'per',c:'fan',per:i,my:my,m:.06,sn:k||'z'})}
const perGrp=r=>PER.map((p,i)=>i).filter(i=>PER[i].role==r);
function fdPersonas(c){const V=perV(c),k=!c?null:c.d>=3?'w3':c.d>0?'w':c.d==0?'e':c.d<=-3?'l3':'l',neg=c&&c.d<0,pos=c&&c.d>0,used=[],
 go=(r,kk,my)=>{const g=perGrp(r).filter(i=>!used.includes(i));if(!g.length)return;const i=fpk(g);used.push(i);perPost(i,kk,V,my)};
 if(c){if(Math.random()<(neg?.75:c.d==0?.5:.35))go('crit',k,1);if(Math.random()<(neg?.45:pos?.8:.5))go('fan',k,1);if(Math.random()<.5)go('neu',k,1)}
 if(Math.random()<.45)go('neu',null,0);
 if(Math.random()<.3)go('crit',null,0)}

/* ---------- comentarios (respuestas) con like + tweets destacados ---------- */
const fdTop=p=>p.tp||p.lk>=4000;
const fdAvP=P=>`<span class="av br per"><i>${fesc(P.n[0])}</i><img src="img/${P.img}" alt="" onerror="this.parentNode.classList.add('nf');this.remove()"></span>`;
/* Comentarios: cada publicación se clasifica por tema (fdTopic) y las respuestas salen del banco REP[tema.matiz] según el rol de quien comenta.
   Marcadores: {pn} jugador de la publicación · {tm} su club · {s} resultado · {rv} rival · {c} tu club · {m} míster · {nx} próximo rival · {pos} puesto · {t} hashtag */
const REP={
 'res.w3':{fan:['Qué manera de jugar. Se ha visto presión, ritmo y gol. #{t}','Los hemos pasado por encima. Esto se celebra en casa y en el bar 🍻','Hace una semana nadie decía esto. Que siga la racha, {m}.'],
  crit:['Muy bien, pero ojo: contra {rv} era fácil que pasara. La prueba de verdad vendrá con rivales más fuertes.','Goleada merecida. Aun así, me quedo con lo que hay que mejorar atrás.'],
  neu:['{s} cuenta una historia clara: dominio total. La pregunta es si se puede repetir.','Partido redondo. Lo que más me ha gustado: el equipo no ha dejado de correr ni con el partido resuelto.']},
 'res.w':{fan:['Tres puntos que valen oro. Se ha sufrido y por eso se disfruta más.','Ganar así también es de equipo grande. Vamos {c} 💪','Gracias por empujar hasta el final, equipo.'],
  crit:['Se ha ganado, vale, pero ha habido demasiados momentos de sufrimiento.','Tres puntos sí, pero que no se maquille lo que no ha funcionado.'],
  neu:['Victoria corta pero merecida si miras las ocasiones. Esto suma.','Se gana también cuando no se juega bien. Eso se valora a final de temporada.']},
 'res.e':{fan:['Un punto es un punto. A seguir.','El equipo ha competido. Cabeza arriba.'],
  crit:['Dos puntos perdidos, así de simple. Hay que ser más claros arriba.','Con empates así no se llega lejos. Hay que ganar partidos como este.'],
  neu:['Empate justo por lo visto: los dos han tenido su parte.','Todo lo que sume suma. Pero que no se vuelva costumbre.']},
 'res.l':{fan:['Hoy duele, pero esto es largo. A levantarse.','Orgulloso de cómo ha peleado el equipo, aunque no haya valido. #{t}','No se pierde la fe por un partido, {m}.'],
  crit:['{s}. No se puede perder así. Algo hay que cambiar, {m}.','Hay que reconocerlo: el rival ha estado mejor en casi todo. Toca revisar.'],
  neu:['Derrota con matices: se puede corregir.','Un tropiezo no hace una crisis. Veremos cómo reacciona el equipo la semana que viene.']},
 'res.l3':{fan:['Qué dolor. Pero este equipo ya ha demostrado carácter antes; vamos a ver si lo vuelve a hacer.','Hoy el equipo no ha estado, pero no pienso soltar la bufanda.'],
  crit:['Esto ya no es un mal día. {m}, hay que dar explicaciones.','Resultado impropio del {c}. La directiva debería tomar nota.'],
  neu:['Un resultado así rompe cualquier análisis. Más que táctica, aquí ha fallado la cabeza.','Primero toca digerirlo. Después, análisis frío: errores individuales, ajustes de bloque y confianza.']},
 'res.o':{fan:['Qué partido tan loco. La liga está más abierta que nunca.','Resultados así hacen que la liga sea impredecible. Me gusta.'],
  crit:['El resultado dice más del perdedor que del ganador.','Cuando un equipo pierde así, hay que mirar al banquillo.'],
  neu:['Importante cómo queda la clasificación tras esto. El {c} lo tiene que mirar.','Un {s} cambia la lectura de la jornada, sin duda.']},
 ht:{fan:['Qué nivel, {pn}. Eso es ser delantero.','Tres goles en un partido no se ven todos los días. Merecido reconocimiento.'],
  crit:['Muy bien, pero tres goles también dependen del partido. Veremos si lo sostiene.','Los hat-tricks hacen ruido, pero lo importante es la regularidad.'],
  neu:['Lo que cuenta es cómo se los ha fabricado el equipo. Buena noticia para {tm}.','{tm} tiene a un delantero muy en forma. Habrá que tenerlo en cuenta.']},
 mvp:{fan:['Merecido. {pn} ha estado enorme en esta jornada.','El MVP no se discute. A seguir así.'],
  crit:['La nota es alta, pero habría que ver cuánto han ayudado los compañeros.','Las notas siempre se discuten: yo habría puesto otro nombre.'],
  neu:['{pn} está jugando por encima de la media. Su valor de mercado debería estar subiendo.','Lo bueno de la nota es que cuenta el partido completo, no solo el gol.']},
 jm:{fan:['Premio merecido: {pn} lleva semanas entre lo mejor de la liga.','Jugador del mes sin discusión.'],
  crit:['El premio llega por regularidad: si baja una semana, se acaba el cuento.','Muy bien, aunque yo habría mirado otros nombres. Es opinión.'],
  neu:['Un mes entero es muestra suficiente para decir que está en un gran momento.','La nota media ayuda a medir, aunque no lo cuenta todo.']},
 cs:{fan:['{pn} ha sido un muro. Ese cero también es suyo.','Portería a cero y puntos en el bolsillo: eso se aplaude.'],
  crit:['El cero depende también de que el rival no acierte. Ojo.','Está bien el cero. A ver si se repite cuando el rival apriete más.'],
  neu:['Un cero no es solo del portero: es del bloque entero.','Dejar la portería a cero cambia el ánimo de la semana.']},
 gm:{fan:['Qué golazo. Lo he visto tres veces seguidas.','Para enmarcar. ¡HERTZ sabe elegir!'],
  crit:['Muy bonito, pero yo habría elegido otro.','Un golazo no cambia la liga, pero se agradece verlo.'],
  neu:['Gol con mucha técnica. Yo también lo habría elegido.','Estos goles son lo que hace especial al fútbol.']},
 'iv.w':{fan:['Así habla un jugador de equipo 👏','Me encanta que se dedique la victoria a la grada.'],
  crit:['Palabras muy bonitas. Lo que quiero ver es que lo demuestre cada semana.','Siempre dicen lo mismo tras ganar. Falta el siguiente partido.'],
  neu:['Declaración sensata: celebrar sin olvidar al grupo.','Tras ganar es fácil hablar. Lo difícil es mantener la cabeza fría.']},
 'iv.e':{fan:['Un punto con gol: hay que quedarse con lo bueno y seguir.','Ánimo. Con esa actitud llegan los puntos.'],
  crit:['Marcar y no ganar es lo que más me desespera. Hay que cerrar los partidos.','Los goles sirven si se ganan los partidos.'],
  neu:['Declaración mesurada tras un resultado ni bueno ni malo.','Si el equipo corrige los detalles, esos empates serán victorias.']},
 'iv.l':{fan:['Cuando un jugador reconoce el error, da gusto. Estamos con él.','Ánimo, que de esto se sale trabajando.'],
  crit:['Reconocer no basta: hay que corregir.','Siempre es lo mismo tras perder: "hay que trabajar". Que se note en el campo.'],
  neu:['Declaración honesta. Falta ver cómo responde el vestuario.','No es fácil dar la cara tras perder. Hay que valorarlo.']},
 'iv.mv':{fan:['Qué buen momento de {pn}. Que siga así.','Compromiso total: así se gana a la afición.'],
  crit:['Ya veremos cuando llegue una oferta si sigue pensando igual.','Hablar de títulos en octubre es fácil. Hablar de ellos en mayo es otra cosa.'],
  neu:['{pn} transmite confianza, y los jugadores en buen momento suelen estar mejor de cabeza.','El discurso es el habitual, pero encaja con sus números.']},
 'iv.cs':{fan:['Un portero que habla así da seguridad a toda la defensa.','Merecido el reconocimiento al cero.'],
  crit:['Mucho mérito, pero ojo con confiarse.','Un cero no se mantiene solo. Hay que seguir así.'],
  neu:['Habla de la defensa antes que de él. Detalle de líder.','Un portero tranquilo es medio equipo tranquilo.']},
 'iv.coach':{fan:['Buen análisis del míster. Se agradece que hable claro.','Se nota que conoce a sus jugadores.'],
  crit:['Mucho discurso. Lo que cuenta es el marcador.','Palabras bonitas; veremos si en el campo se confirman.'],
  neu:['Declaración medida y realista: ni excesos ni victimismo.','Es lo que se espera de un entrenador: analizar sin dar pistas.']},
 'iv.bd':{fan:['Se agradece el respaldo. Vamos juntos.','Una directiva que da la cara, bien.'],
  crit:['El respaldo vale mientras lleguen los resultados, ya sabemos cómo funciona esto.','Eso lo dicen siempre. Quiero ver hechos.'],
  neu:['Declaración institucional típica: apoyo con matices.','Dependerá de cómo evolucionen los próximos partidos.']},
 'iv.pv':{fan:['Ganas de ver este partido. #{t}','Esto va a ser importante. A llenar la grada.'],
  crit:['En la previa todos son amables. Después se ven las caras.','Todo muy bonito, pero habrá que ver cómo se gestiona la presión del rival.'],
  neu:['Previa interesante: según cómo llegue cada equipo, puede decidirse en detalles.','Va a ser un partido de pocos espacios, creo.']},
 mk:{fan:['Si se confirma, sería un fichaje de nivel. Veremos.','Con Jorge de la Mata nunca se sabe, pero algo de verdad suele haber.'],
  crit:['Rumores, rumores... hasta que no haya oferta oficial, nada.','Siempre suenan los mismos nombres. Que fiche quien tenga que fichar.'],
  neu:['El valor de {pn} ({tm}) justifica el interés. El resto ya se verá.','Los rumores son parte del mercado: ni los desmiento ni me los creo.']},
 val:{fan:['{pn} sube por méritos propios.','Lo bonito de que suba el valor es que se nota el trabajo.'],
  crit:['El valor sube, pero los números no cuentan toda la historia.','Mercado inflado, como siempre.'],
  neu:['Su valor refleja nivel y edad. Habrá que ver cómo evoluciona.','Transfermarkt siempre da debate: no es oficial, pero orienta.']},
 xi:{fan:['Once con nivel. Se ve que la jornada ha tenido de todo.','Mi voto sería para otro, pero entiendo el once.'],
  crit:['Siempre falta alguien. Yo no habría dejado fuera a algún central.','Las notas del once son discutibles: otra jornada y cambia todo.'],
  neu:['El once ideal es una foto de la jornada, no del campeonato.','Interesante ver cómo se reparten los clubes en el once.']},
 pr:{fan:['Las predicciones están para romperlas 😄 #{t}','Si el {c} sigue así, nos veremos arriba.'],
  crit:['Predicciones... hasta que llega un tropiezo y se cae todo.','El porcentaje no vale de nada si no se gana en el campo.'],
  neu:['Modelo razonable: los puntos se deciden en pequeños márgenes.','La predicción cambia cada semana. Mejor mirar la tendencia que el porcentaje.']},
 cp:{fan:['Gran duelo de delanteros.','Yo me quedo con el que esté más en forma.'],
  crit:['Comparativas así valen poco: hay que ver el equipo que tiene detrás cada uno.','Datos bonitos, pero no explican el rendimiento en partidos grandes.'],
  neu:['Buenas métricas. Edad y valor de mercado cuentan tanto como los goles.','Duelo igualado según los datos; yo miraría más la regularidad.']},
 yr:{fan:['Cantera con futuro. Da gusto ver a chavales así.','Ojalá el {c} apueste más por jóvenes.'],
  crit:['Mucho potencial en papel. Luego hay que ver si dan el salto.','Ya hemos visto promesas que se quedan en nada. Prudencia.'],
  neu:['El potencial es una estimación; lo que decide es el trabajo diario.','Edad y minutos: la clave para el desarrollo.']},
 rc:{fan:['Récord para la historia, ¡enhorabuena!','Qué bonito ver cómo se baten marcas.'],
  crit:['Los récords se rompen. Lo que me importa es el título.','Mérito, pero cada época tiene sus condiciones.'],
  neu:['Interesante el contexto: más partidos, más rotaciones...','Buena marca. Veremos cuánto aguanta.']},
 tab:{fan:['La liga está más cerrada que nunca. Ánimo, {c}.','Lo que cuenta es el final, no la foto de hoy.'],
  crit:['La tabla no miente: el {c} está en el puesto {pos}.','Hay que mirar la zona baja con cuidado, nunca se sabe.'],
  neu:['Faltan muchas jornadas: es una tabla provisional.','Importante cómo se reparten los puntos en los próximos partidos.']},
 club:{fan:['Gracias por todo, equipo. Seguimos. #{t}','Esta afición no falla.'],
  crit:['Mucho comunicado. Quiero ver acciones en el campo.','Muy bonito. A ver cómo responde el equipo.'],
  neu:['Buena comunicación del club.','Tono correcto, sin excesos.']},
 'bd.p':{fan:['Si la directiva confía en {m}, yo también.','El respaldo da tranquilidad.'],
  crit:['Confiar está bien, pero los resultados mandan.','Un blindaje no sirve si luego no se gana.'],
  neu:['Es lo normal cuando el equipo va bien: dar estabilidad.','La estabilidad es clave en un proyecto.']},
 'bd.z':{fan:['Hay que dar tiempo, que esto es largo.','Lo importante es que todos remen en la misma dirección.'],
  crit:['Las dudas en el palco no son buena señal.','Mejor que decidan pronto, que el vestuario lo nota.'],
  neu:['Situación intermedia: depende de los próximos resultados.','Ni crisis ni euforia. A esperar.']},
 'bd.n':{fan:['Ahora es cuando el equipo necesita unión.','No soltemos al equipo cuando peor está.'],
  crit:['La situación es complicada. Algo hay que cambiar.','Las reuniones de urgencia no suelen ser buena noticia.'],
  neu:['Ojalá se resuelva con serenidad.','Lo que decidan debería basarse en datos, no en el ruido de las redes.']},
 'op.p':{fan:['Totalmente de acuerdo. Qué orgullo de equipo.','Esto es lo que me gusta leer 💪'],
  crit:['Con el resultado a favor es fácil opinar así. Veremos en la próxima.','Se disfruta, sí, pero ojo con relajarse.'],
  neu:['Buena lectura: el equipo ha mostrado cosas buenas. Ahora hay que sostenerlo.','Más allá del resultado, se ve una idea de juego.']},
 'op.n':{fan:['Ánimo. Con la afición no se ha acabado nada.','Hoy duele, pero la temporada es larga.'],
  crit:['Dices lo que muchos pensamos.','Hay motivo de enfado, pero hay que ser constructivo.'],
  neu:['Las críticas ayudan si se hacen con datos.','Entiendo el enfado, pero conviene mirar el contexto: calendario, cansancio, lesiones.']},
 'op.z':{fan:['Muy buen punto.','Eso mismo pensaba yo.'],
  crit:['Yo lo veo un poco distinto, la verdad.','Esa opinión es discutible.'],
  neu:['Es una lectura interesante.','Depende de cómo se mire, pero tiene sentido.']},
 an:{fan:['Buen análisis. Se nota que ve los partidos enteros.','Totalmente de acuerdo con la lectura.'],
  crit:['Mucho esquema, pero el fútbol se decide en detalles que no caben en una pizarra.','Yo habría puesto el foco en otra cosa.'],
  neu:['Coincide con lo que dicen los números.','Interesante el matiz. Habrá que ver si se mantiene en las próximas jornadas.']},
 gen:{fan:['Buena noticia para la liga.','Así me gusta.'],crit:['Veremos cuánto dura.','Habrá que ver más para opinar.'],neu:['Interesante, aunque con matices.','Conviene mirarlo con perspectiva.']}};
const QMAP={w:'w',e:'e',pe:'w',fa:'w',co:'w',late:'w',ht:'w',l:'l',mv:'mv',g:'mv',cs:'cs',coach:'coach',bd:'bd',pv:'pv'};
function fdTopic(p){const tx=p.tx||'',c=p.card||{},h=c.h||'';
 if(p.qk)return{t:'iv.'+(QMAP[p.qk]||'w')};
 if(p.a=='sergio')return{t:'an'};
 if(p.per!=null||p.k=='fan'){const s=p.sn||'z';return{t:'op.'+(s=='w3'||s=='w'?'p':s=='l'||s=='l3'?'n':'z')}}
 if(c.t=='ph'){if(/HAT/.test(h))return{t:'ht'};if(/MVP/.test(h))return{t:'mvp'};if(/MES/.test(h))return{t:'jm'};if(/PORTER/.test(h))return{t:'cs'}}
 if(/GOL DEL MES/.test(tx))return{t:'gm'};
 if(c.t=='xi')return{t:'xi'};if(c.t=='pr')return{t:'pr'};if(c.t=='cp')return{t:'cp'};if(c.t=='yr')return{t:'yr'};if(c.t=='rc')return{t:'rc'};
 if(c.t=='v')return{t:p.a=='jorge'?'mk':'val'};
 if(/CLASIFICACI/.test(tx))return{t:'tab'};
 if(/directiva|palco|destituye|ambiente/i.test(tx)&&p.a!='opta'){const f=G.conf;return{t:'bd.'+(f>60?'p':f>=35?'z':'n')}}
 if(c.t=='r'){const me=G.me,m=c.h==me||c.a==me;if(!m)return{t:'res.o'};const d=c.h==me?c.hg-c.ag:c.ag-c.hg;return{t:'res.'+(d>=3?'w3':d>0?'w':d==0?'e':d<=-3?'l3':'l')}}
 if(p.k=='club')return{t:'club'};
 return{t:'gen'}}
function fdGenCm(p){const tp=fdTopic(p),V=perV(null),cd=p.card||{},me=G.me;
 V.pn=p.pn||cd.n&&cd.t=='ph'&&cd.n||cd.pn||'el jugador';
 const tid=cd.cr!=null?cd.cr:p.pt!=null?p.pt:p.cr;V.tm=tid!=null&&G.T[tid]?G.T[tid].n:V.c;
 if(cd.t=='r'&&G.T[cd.h]&&G.T[cd.a]){V.s=`${G.T[cd.h].n} ${cd.hg}-${cd.ag} ${G.T[cd.a].n}`;V.rv=G.T[cd.h==me?cd.a:cd.a==me?cd.h:cd.a].n}
 const bk=REP[tp.t]||REP.gen,out=[],used=[],rs=fsh(['fan','crit','neu']).slice(0,Math.random()<.5?2:3);
 rs.forEach(r=>{const g=perGrp(r).filter(i=>i!==p.per&&!used.includes(i)),i=fpk(g.length?g:perGrp(r));used.push(i);
  const P=PER[i],l=bk[r]&&bk[r].length?(Math.random()<.15&&P.cx?P.cx:bk[r]):P.cx;out.push({per:i,tx:fdFill(fpk(l),V),lk:Math.round(R(1,60)*R(1,5))})});
 return out.sort((a,b)=>b.lk-a.lk)}
const fdCm=p=>`<div class="cmx">${p.cm.map((c,j)=>{const P=PER[c.per];return `<div class="cm">${fdAvP(P)}<div class="cb"><div><b>${fesc(P.n)}</b> <span class="hd">@${fesc(P.h)}</span></div><div class="cx">${fdTxt(c.tx)}</div><button class="a${c.lkd?' on':''}" data-c="${j}">♥ <b>${fN(c.lk)}</b></button></div></div>`}).join('')}</div>`;
function fdCmToggle(po,p){const x=po.querySelector('.cmx');if(x){x.remove();return}if(!p.cm){p.cm=fdGenCm(p);save()}
 po.querySelector('.pb').insertAdjacentHTML('beforeend',fdCm(p));
 po.querySelectorAll('.cmx button[data-c]').forEach(b=>b.onclick=()=>{const c=p.cm[+b.dataset.c];c.lkd=!c.lkd;c.lk+=c.lkd?1:-1;b.classList.toggle('on',!!c.lkd);b.querySelector('b').textContent=fN(c.lk);save()})}
const RUM=[
 (p,t,d,v)=>`🚨 EXCLUSIVA | ${d.n} ha preguntado por ${p.n} (${t.n}). Contactos iniciados.\n💶 Valoración: ${v}\n#Mercado`,
 (p,t,d,v)=>`🔎 ${p.n} está en la lista corta de ${d.n}. El ${t.n} no lo soltaría por menos de ${v}. De momento, sin oferta formal.`,
 (p,t,d,v)=>`⚠️ Se mueve algo: ${d.n} prepara una propuesta por ${p.n}. Habrá novedades en los próximos días. #Fichajes`,
 (p,t,d,v)=>`🗣️ Fuentes cercanas al jugador: ${p.n} ve con buenos ojos escuchar a ${d.n}. El ${t.n} está avisado.`,
 (p,t,d,v)=>`✍️ Pasos adelante entre ${d.n} y ${t.n} por ${p.n}. Se habla de ${v}. Ojo a este tema. #Mercado`,
 (p,t,d,v)=>`📋 ${d.n} sigue de cerca a ${p.n} desde hace semanas. El ${t.n} no quiere venderlo, pero hay cláusulas de por medio. #Mercado`,
 (p,t,d,v)=>`🤝 Primeros contactos entre el entorno de ${p.n} y ${d.n}. Todo muy en el inicio, pero el jugador no cierra la puerta.`,
 (p,t,d,v)=>`💬 ${p.n} (${t.n}) estaría abierto a cambiar de aires. ${d.n} y otros dos clubes están atentos. Valoración: ${v}.`,
 (p,t,d,v)=>`📉 Se enfría la operación por ${p.n}: ${d.n} considera que ${v} es demasiado y estudia alternativas. #Fichajes`];
function fdRumor(l){const me=G.T[G.me],pl=fpool(Math.random()<.25?(l==1?2:1):l).filter(x=>x.t.id!=G.me).sort((a,b)=>(b.p.ovr+(b.p.age<=24?b.p.pot:b.p.ovr))-(a.p.ovr+(a.p.age<=24?a.p.pot:a.p.ovr))).slice(0,25);
 if(!pl.length)return;const x=fpk(pl),ds=G.T.filter(t=>t.lg==G.T[G.me].lg&&t.id!=x.t.id).sort((a,b)=>str(b).o-str(a).o).slice(0,8),d=fpk(ds);
 fdAdd('jorge',fpk(RUM)(x.p,x.t,d,fmv(mval(x.p))),{card:fdVal(x.p,x.t,Math.round(R(-4,12)))})}
const fdRes=(h,a,hg,ag)=>`<div class="rc"><span class="tn">${crest(h,22)}<small>${nm(h)}</small></span><b>${hg} - ${ag}</b><span class="tn r"><small>${nm(a)}</small>${crest(a,22)}</span></div>`;

/* ---------- FD SPORTS (estilo 433): once ideal, predicciones, cara a cara, promesas y récords ---------- */
const fdC=(v,a,b)=>Math.max(a,Math.min(b,v)),fdUk=(t,i)=>t.id+':'+i,fdLn=n=>String(n).split(' ').slice(1).join(' ')||n,
 FRK={pg:'Goles en una temporada',tp:'Puntos en una temporada',gl:'Mayor goleada',rv:'Racha de victorias'};
function fdIdeal(w,l,rs,LN){const sn=G.fdg||{},cd=[];
 G.T.filter(t=>t.lg==l).forEach(t=>{const r=rs.find(x=>x[2]==t.id||x[3]==t.id);if(!r||!t.lu)return;const h=r[2]==t.id,d=h?r[4]-r[5]:r[5]-r[4],cs=(h?r[5]:r[4])==0;
  t.lu.forEach(i=>{const p=t.pl[i];if(!p)return;const s=sn[fdUk(t,i)]||[p.g|0,p.a|0],g=p.g|0,a=p.a|0,dg=g>=s[0]?g-s[0]:g,da=a>=s[1]?a-s[1]:a,
   rt=fdC(6.1+(p.ovr-68)*.025+dg*.95+da*.5+(d>0?.35:d<0?-.25:0)+((p.pos=='D'||p.pos=='P')&&cs?.55:0)+R(-.25,.35),5.5,9.9);cd.push({p,t,rt,dg,da})})});
 G.fdm=G.fdm||{};cd.forEach(x=>{const k=fdUk(x.t,x.t.pl.indexOf(x.p)),m=G.fdm[k]||(G.fdm[k]=[0,0]);m[0]+=x.rt;m[1]++});G.fdg=G.fdg||{};G.T.filter(t=>t.lg==l).forEach(t=>t.pl.forEach((p,i)=>G.fdg[fdUk(t,i)]=[p.g|0,p.a|0]));
 const pk=(q,n)=>cd.filter(x=>x.p.pos==q).sort((a,b)=>b.rt-a.rt).slice(0,n),xi=[...pk('F',3),...pk('M',3),...pk('D',4),...pk('P',1)];
 if(xi.length<11)return;const mv=xi.slice().sort((a,b)=>b.rt-a.rt)[0];
 fdAdd('fd',`⭐ ONCE IDEAL | Así queda el equipo de la jornada ${w+1} en la ${LN}. MVP: ${mv.p.n} (${mv.t.n}) con un ${mv.rt.toFixed(1).replace('.',',')}.\n#J${w+1} #OnceIdeal`,{top:1,my:xi.some(x=>x.t.id==G.me),card:{t:'xi',h:'ONCE IDEAL',s:`Jornada ${w+1} · ${LN}`,r:xi.map(x=>[x.p.pos,x.p.n,x.t.id,+x.rt.toFixed(1),x.dg,x.da,x===mv?1:0])}});return mv}
function fdPred(w,l,LN,lht){const tb=tab(l),N=NWL[l],pj=Math.max(...tb.map(t=>t.pj)),rem=N-pj;if(rem<1)return;
 const so=tb.map(t=>str(t).o),av=so.reduce((s,v)=>s+v,0)/so.length,
  pr=tb.map((t,i)=>({t,x:t.pts+rem*((t.pts+6*fdC(1.35+(so[i]-av)/16,.5,2.5))/(t.pj+6))})).sort((a,b)=>b.x-a.x),
  tau=2+.7*Math.sqrt(rem),e=pr.map(q=>Math.exp((q.x-pr[0].x)/tau)),sm=e.reduce((s,v)=>s+v,0),pc=e.map(v=>Math.round(100*v/sm)),mi=pr.findIndex(q=>q.t.id==G.me),me=G.T[G.me];
 fdAdd('sky',`🔮 PREDICCIÓN | Tras ${pj} jornadas, ${pr[0].t.n} tiene un ${pc[0]}% de ganar la ${LN}. ${me.n} acabaría ${mi+1}º con ${Math.round(pr[mi].x)} puntos.\n#Predicción #${lht}`,{my:1,card:{t:'pr',pj,n:N,r:pr.slice(0,5).map((q,i)=>[q.t.id,Math.round(q.x),pc[i]]),zl:l==1?'Zona de descenso (previsión)':'Ascenso directo (previsión)',z:(l==1?pr.slice(-REL):pr.slice(0,PRO)).map(q=>q.t.id),me:[mi+1,Math.round(pr[mi].x)]}})}
function fdDuel(w,l,LN){const sc=x=>(x.p.g|0)*2.5+x.p.ovr*.4,fw=fpool(l).filter(x=>x.p.pos=='F').sort((a,b)=>sc(b)-sc(a));if(fw.length<2)return;
 const a=fw[0];let b=fw[1];const mine=fw.find(x=>x.t.id==G.me&&x!==a);if(mine&&Math.random()<.4)b=mine;
 const o=x=>({n:x.p.n,cr:x.t.id,age:x.p.age,ovr:Math.round(x.p.ovr),g:x.p.g|0,a:x.p.a|0,v:+mval(x.p).toFixed(1)}),A=o(a),B=o(b),k=['ovr','g','a','v'],wa=k.filter(q=>A[q]>B[q]).length,wb=k.filter(q=>B[q]>A[q]).length;
 fdAdd('fd',`⚔️ CARA A CARA | ${a.p.n} (${a.t.n}) vs ${b.p.n} (${b.t.n}): ¿quién es el delantero del momento? ${wa==wb?'Duelo igualado.':(wa>wb?a.p.n:b.p.n)+' manda en '+Math.max(wa,wb)+' de 4 apartados.'}\n#Delanteros #J${w+1}`,{my:a.t.id==G.me||b.t.id==G.me,card:{t:'cp',a:A,b:B}})}
function fdYoung(w,l,LN){let pl=fpool(l).filter(x=>x.p.age<=21);if(pl.length<5)pl=fpool(l).filter(x=>x.p.age<=23);pl=pl.sort((a,b)=>(b.p.pot+b.p.ovr*.6)-(a.p.pot+a.p.ovr*.6)).slice(0,5);if(pl.length<3)return;const x=pl[0];
 fdAdd('fd',`🌱 JÓVENES PROMESAS | Los talentos que mandan en la ${LN}. Ojo a ${x.p.n} (${x.t.n}): ${x.p.age} años y potencial ${Math.round(x.p.pot)}.\n#Cantera #FuturasEstrellas`,{my:pl.some(q=>q.t.id==G.me),card:{t:'yr',h:'JÓVENES PROMESAS',s:LN,r:pl.map(q=>[q.t.id,q.p.n,q.p.pos,q.p.age,Math.round(q.p.ovr),Math.round(q.p.pot)])}})}
/* récords históricos de la liga (se guardan en la partida; arrancan con marcas de archivo y se baten con el tiempo) */
function fdRecBase(l){G.rec=G.rec||{};const n='Archivo de la liga';return G.rec[l]||(G.rec[l]=l==1?{pg:{v:30,n:'Rafa Montero',s:0},tp:{v:86,n:'Campeón histórico',s:0},gl:{v:7,d:'7-0',n,s:0},rv:{v:11,n,s:0}}:{pg:{v:32,n:'Rafa Montero',s:0},tp:{v:98,n:'Campeón histórico',s:0},gl:{v:7,d:'7-0',n,s:0},rv:{v:12,n,s:0}})}
const fdRows=(R0,brk)=>Object.keys(FRK).map(k=>({k:FRK[k],v:k=='gl'?R0.gl.d:R0[k].v,n:R0[k].n,cr:R0[k].cr,s:R0[k].s?'Temporada '+R0[k].s:'Histórico',nw:(brk||[]).includes(k)?1:0}));
function fdRecUpd(w,l,LN,lht){const R0=fdRecBase(l),tb=tab(l),rs=G.res.filter(r=>r[1]==l),brk=[],T=i=>G.T[i];
 const sp=fpool(l).sort((a,b)=>(b.p.g|0)-(a.p.g|0))[0];if(sp&&(sp.p.g|0)>R0.pg.v){R0.pg={v:sp.p.g|0,n:sp.p.n+' ('+sp.t.n+')',cr:sp.t.id,s:G.season};brk.push('pg')}
 if(tb[0].pts>R0.tp.v){R0.tp={v:tb[0].pts,n:tb[0].n,cr:tb[0].id,s:G.season};brk.push('tp')}
 const bg=rs.slice().sort((a,b)=>Math.abs(b[4]-b[5])-Math.abs(a[4]-a[5]))[0];
 if(bg&&Math.abs(bg[4]-bg[5])>R0.gl.v){R0.gl={v:Math.abs(bg[4]-bg[5]),d:Math.max(bg[4],bg[5])+'-'+Math.min(bg[4],bg[5]),n:T(bg[2]).n+' - '+T(bg[3]).n,cr:bg[4]>bg[5]?bg[2]:bg[3],s:G.season};brk.push('gl')}
 let bs=null;tb.forEach(t=>{const n=fdSk(t.id,'v');if(n>R0.rv.v&&(!bs||n>bs.n))bs={id:t.id,n}});if(bs){R0.rv={v:bs.n,n:T(bs.id).n,cr:bs.id,s:G.season};brk.push('rv')}
 if(!brk.length||(R0.lps==G.season&&w-R0.lpw<4))return;R0.lps=G.season;R0.lpw=w;const k=brk[0],x=R0[k],
  tx={pg:`${x.n} ya suma ${x.v} goles en una temporada: récord histórico de la ${LN}.`,tp:`${x.n} alcanza ${x.v} puntos: nadie había sumado tanto en la ${LN}.`,gl:`${x.d} entre ${x.n}: la mayor goleada de la historia de la ${LN}.`,rv:`${x.n} encadena ${x.v} victorias seguidas: récord absoluto de la ${LN}.`}[k];
 fdAdd('sky',`🏅 NUEVO RÉCORD | ${tx}\n#Récord #${lht}`,{big:1,my:x.cr==G.me,card:{t:'rc',h:'NUEVO RÉCORD',s:LN,r:fdRows(R0,brk)}})}
function fdRecBook(l,LN,lht){fdAdd('sky',`📚 LIBRO DE RÉCORDS | Estas son las marcas históricas de la ${LN}. ¿Quién las batirá?\n#Récords #${lht}`,{card:{t:'rc',h:'RÉCORDS HISTÓRICOS',s:LN,r:fdRows(fdRecBase(l))}})}

/* ---------- FD (viral) y SKY (oficial): hat-tricks, MVP, jugador del mes, balón parado y crónica de la jornada ---------- */
const gs0=(mr,w)=>{const m=(G.wsc||[]).find(q=>q[0]==mr[2]&&q[1]==mr[3]);if(!m)return null;const t=mr[2]==G.me?m[2]:m[3],g=t.find(x=>x[3]&&x[3]!='n');return g?{n:g[0],ty:g[3]}:null},fdWk=l=>(G.wsc||[]).filter(m=>G.T[m[0]]&&G.T[m[0]].lg==l);
function fdHT(l){const o=[];fdWk(l).forEach(([h,a,s1,s2])=>[[h,a,s1],[a,h,s2]].forEach(([t,v,s])=>{const c={};s.forEach(g=>c[g[0]]=(c[g[0]]||0)+1);Object.keys(c).forEach(n=>{if(c[n]>=3)o.push({n,t,v,g:c[n]})})}));return o}
function fdSP(l){const o=[];fdWk(l).forEach(([h,a,s1,s2])=>[[h,a,s1],[a,h,s2]].forEach(([t,v,s])=>s.forEach(g=>{if(g[3]&&g[3]!='n')o.push({n:g[0],t,v,min:g[1],as:g[2],ty:g[3]})})));return o}
const fdSc=m=>[m[2],m[3]].filter(s=>s.length).map(s=>s.map(g=>`${fdLn(g[0])} ${g[1]}'${({pe:' (p)',fa:' (f)'}[g[3]]||'')}`).join(', ')).join(' · ');
function fdStars(w,l,LN,lht,mv){const T=i=>G.T[i],ph=(img,h,n,t,st,rt)=>({t:'ph',img:Math.random()<.5?img:img.replace('.png','-2.png'),h,n,cr:t,st,rt}),has=(...a)=>a.includes(G.me),pa=()=>Math.random()<.5?'fd':'sky',rn=v=>v.toFixed(1).replace('.',',');
 /* la foto la sube una sola cuenta: a veces FD (viral) y a veces Sky (oficial) */
 fdHT(l).forEach(x=>{const c=ph('ST3.png','HAT-TRICK · J'+(w+1),x.n,x.t,`${x.g} goles vs ${T(x.v).n}`,0),mi=has(x.t,x.v),a=pa();
  fdAdd(a,a=='fd'?fpk([`🎩🔥 ¡¡HAT-TRICK!! ${x.n} (${T(x.t).n}) no perdona: ${x.g} goles a ${T(x.v).n}. Se lleva el balón a casa 🏠⚽\n#HatTrick #J${w+1}`,`🤯 ¡TRIPLETE! ${x.n} está on fire: ${x.g} golazos ante ${T(x.v).n}. Hay delantero en ${T(x.t).n} 🔥\n#HatTrick`,`😱 ¿QUIÉN LO PARA? ${x.n} firma ${x.g} goles y manda el partido a la historia. ¡Nivel BESTIAL!\n#HatTrick #J${w+1}`]):fpk([`📄 HAT-TRICK | ${x.n} (${T(x.t).n}) anota ${x.g} goles ante ${T(x.v).n} en la jornada ${w+1} de la ${LN}.`,`📄 PARTE OFICIAL | Triplete de ${x.n} (${T(x.t).n}) frente al ${T(x.v).n}. Actuación destacada de la jornada ${w+1}.`]),{big:1,my:mi,card:c})});
 if(mv&&(mv.rt>=8.6||Math.random()<.22)){const st=[mv.dg?mv.dg+(mv.dg>1?' goles':' gol'):'',mv.da?mv.da+' asist.':''].filter(Boolean).join(' · ')||'Partidazo total',rt=rn(mv.rt),a=pa();
  fdAdd(a,a=='fd'?fpk([`🔥 MVP DE LA JORNADA ${w+1} | ${mv.p.n} (${mv.t.n}) la lía parda con un ${rt}. ${fpk(['Intratable.','Absolutamente imparable.','Partidazo de los que se recuerdan.'])}\n#MVP #J${w+1}`,`⭐ ¡${mv.p.n.toUpperCase()} ESTÁ EN OTRO NIVEL! ${rt} de nota y MVP de la jornada ${w+1} con el ${mv.t.n} 🚀\n#MVP`]):fpk([`🏅 MVP DE LA JORNADA ${w+1} | ${mv.p.n} (${mv.t.n}) ha sido el jugador más destacado de la ${LN}, con una valoración de ${rt}.\n#MVP #${lht}`,`🏅 JUGADOR DE LA JORNADA | ${mv.p.n}, del ${mv.t.n}, es elegido MVP de la jornada ${w+1} (${rt}).`]),{big:mv.rt>=9,my:mv.t.id==G.me,card:ph('ST1.png','MVP · JORNADA '+(w+1),mv.p.n,mv.t.id,st,rt)})}
 if(w%4==3&&G.fdm){let b=null;Object.keys(G.fdm).forEach(k=>{const [a,n]=G.fdm[k];if(n<3)return;const sc=a/n+.04*n;if(!b||sc>b.sc)b={k,sc,av:a/n}});
  if(b){const [ti,pi]=b.k.split(':').map(Number),t=T(ti),p=t&&t.pl[pi],a=pa();if(p){const av=b.av.toFixed(2).replace('.',',');fdAdd(a,a=='fd'?fpk([`🏆🔥 JUGADOR DEL MES | ${p.n} (${t.n}) se lo ha ganado a pulso: nota media de ${av}. ¡Merecidísimo! 👏\n#JugadorDelMes`,`👑 ¡EL REY DEL MES! ${p.n} (${t.n}) arrasa en la ${LN} con un ${av} de media 🚀`]):fpk([`🏆 JUGADOR DEL MES | ${p.n} (${t.n}) es elegido el mejor jugador del mes en la ${LN}, con una nota media de ${av}.\n#JugadorDelMes #${lht}`,`🏆 PREMIO OFICIAL | ${p.n}, del ${t.n}, recibe el galardón de Jugador del Mes de la ${LN}. Nota media: ${av}.`]),{big:1,my:t.id==G.me,card:ph('ST2.png','JUGADOR DEL MES',p.n,t.id,`Nota media ${av}`,rn(b.av))});G.fdm={}}}}}
function fdVibes(w,l,rs,LN,lht){const T=i=>G.T[i],me=T(G.me),sg=r=>`${T(r[2]).n} ${r[4]}-${r[5]} ${T(r[3]).n}`,cd=r=>({t:'r',h:r[2],a:r[3],hg:r[4],ag:r[5]}),wk=fdWk(l),has=r=>r[2]==G.me||r[3]==G.me,
 bg=rs.slice().sort((a,b)=>Math.abs(b[4]-b[5])-Math.abs(a[4]-a[5]))[0],tg=rs.slice().sort((a,b)=>(b[4]+b[5])-(a[4]+a[5]))[0],wn=r=>r[4]>r[5]?r[2]:r[3],ls=r=>r[4]>r[5]?r[3]:r[2],mr=rs.find(has);
 if(bg&&Math.abs(bg[4]-bg[5])>=3&&Math.random()<.8)fdAdd('fd',fpk([`🤯 PERO QUÉ HA PASADO AQUÍ... ${sg(bg)}. ${T(ls(bg)).n} se va a casa con la cabeza gacha 😬\n#J${w+1}`,`💥 MASACRE | ${T(wn(bg)).n} le pasa por encima a ${T(ls(bg)).n}: ${Math.max(bg[4],bg[5])}-${Math.min(bg[4],bg[5])}. ¡Imposible no verlo!`,`🚨 LOCURA EN LA ${LN.toUpperCase()}: ${sg(bg)}. Se va a hablar de esto toda la semana 🔥`]),{card:cd(bg),my:has(bg),big:1});
 if(tg&&tg[4]+tg[5]>=5&&tg!==bg&&Math.random()<.7)fdAdd('fd',fpk([`🍿 PARTIDAZO | ${sg(tg)}. ${tg[4]+tg[5]} goles y un final de infarto 😮‍💨\n#J${w+1}`,`⚽🔥 FESTIVAL DE GOLES: ${sg(tg)}. Los porteros pidiendo auxilio 🆘`]),{card:cd(tg),my:has(tg)});
 if(mr&&Math.random()<.5){const d=(mr[2]==G.me?mr[4]-mr[5]:mr[5]-mr[4]);if(d>=2)fdAdd('fd',fpk([`🔥 EL ${me.n.toUpperCase()} ARRASA: ${sg(mr)}. ¿Candidato serio? 👀`,`💪 ${me.n} va sobrado: ${sg(mr)}. Así se manda un mensaje al resto 📣`]),{card:cd(mr),my:1});else if(d<=-2)fdAdd('fd',fpk([`😬 NOCHE DURA para ${me.n}: ${sg(mr)}. ¿Hay crisis en el banquillo?`,`🚨 ${me.n} se hunde: ${sg(mr)}. Las redes arden 🔥`]),{card:cd(mr),my:1})}
 const late=[];wk.forEach(([h,a,s1,s2])=>{const hg=s1.length,ag=s2.length;if(Math.abs(hg-ag)!=1)return;const ws=hg>ag?s1:s2,g=ws.slice().sort((x,y)=>y[1]-x[1])[0];if(g&&g[1]>=87)late.push({n:g[0],t:hg>ag?h:a,min:g[1],sc:`${T(h).n} ${hg}-${ag} ${T(a).n}`})});
 if(late.length&&Math.random()<.85){const x=late[0];fdAdd('fd',fpk([`⏱️ MINUTO ${x.min} Y SE ARMA... ${x.n} da la victoria al ${T(x.t).n}: ${x.sc}. ¡Qué locura! 😮‍💨`,`💥 ¡SOBRE LA BOCINA! ${x.n} (${x.min}') y el ${T(x.t).n} se lleva los tres puntos: ${x.sc} 🔥`]),{my:x.t==G.me})}
 const sp=fdSP(l),fa=sp.find(x=>x.ty=='fa'),co=sp.find(x=>x.ty=='co'),pe=sp.find(x=>x.ty=='pe');
 if(fa&&Math.random()<.7)fdAdd('fd',fpk([`🎯 FALTA DE LOCOS | ${fa.n} (${T(fa.t).n}) clava un libre directo en el ${fa.min}' ante ${T(fa.v).n}. ¡Mirad esa escuadra! 😱\n#J${w+1}`,`🚀 MISIL de ${fa.n}: golazo de falta para el ${T(fa.t).n}. El portero ni la vio 👀`]),{my:fa.t==G.me||fa.v==G.me});
 if(co&&Math.random()<.4)fdAdd('fd',`🧠 JUGADA DE PIZARRA | Córner${co.as?' de '+fdLn(co.as):''} y ${co.n} la manda a la red con el ${T(co.t).n} (${co.min}'). ¡Estrategia perfecta! 📐`,{my:co.t==G.me||co.v==G.me});
 if(pe&&Math.random()<.5)fdAdd('sky',fpk([`⚖️ PENALTI | ${pe.n} (${T(pe.t).n}) transforma la pena máxima en el minuto ${pe.min} ante ${T(pe.v).n}.`,`⚖️ ACTA | Penalti transformado por ${pe.n} (${T(pe.t).n}) en el minuto ${pe.min}, frente al ${T(pe.v).n}.`]),{my:pe.t==G.me||pe.v==G.me});
 if(Math.random()<.7){const tb=tab(l);fdAdd('sky',`📊 CLASIFICACIÓN OFICIAL | Tras la jornada ${w+1} de la ${LN}: ${tb.slice(0,3).map((t,i)=>`${i+1}. ${t.n} (${t.pts})`).join(' · ')}. Zona baja: ${tb.slice(-REL).map(t=>t.n).join(', ')}.\n#${lht}`,{my:tb.slice(0,3).concat(tb.slice(-REL)).some(t=>t.id==G.me)})}
 if(tg&&Math.random()<.6){const m=wk.find(q=>q[0]==tg[2]&&q[1]==tg[3]);fdAdd('sky',`🏁 FINAL | ${sg(tg)}.${m&&(m[2].length+m[3].length)?' Goles: '+fdSc(m)+'.':''}\n#J${w+1} #${lht}`,{card:cd(tg),my:has(tg)})}}
/* ---------- DECLARACIONES Y ENTREVISTAS (Marca, Sky Sports y FD Sports) ----------
   Marcadores: {v} rival · {t} club del jugador · {m} míster · {as} asistente del gol · {min} minuto · {sc} resultado · {j} jornada
   Tipos (k): w gol en victoria · e gol en empate · l derrota · mv MVP · cs portería a 0 · pe penalti · fa falta · co córner · late gol en el tramo final · ht hat-trick */
const QV={
 w:['Estoy contento por el gol, pero lo importante es el equipo. Hemos trabajado toda la semana para esto.','Sabíamos que {v} iba a apretar, pero {m} nos preparó el partido a la perfección.','Llevaba tiempo buscándolo. Ahora toca no bajar el pistón y pensar ya en la siguiente jornada.','Aquí gana el vestuario, no uno solo. Hoy me ha tocado a mí, mañana será otro.','Cuando entra, te olvidas de todo. Se lo dedico a la afición, que nos ha empujado hasta el final.','Hemos sido valientes. Salimos a ganar y el equipo lo ha hecho con mucha personalidad.'],
 e:['Un punto sabe a poco, pero hemos competido. Hay que mejorar el último tercio.','Mi gol no sirve de mucho si no ganamos. Contra {v} merecíamos algo más.','El empate es justo por lo visto, pero hay que ser más contundentes cuando tenemos el partido de cara.','Marcar siempre es bonito, pero el equipo quería los tres puntos. Seguimos trabajando.'],
 l:['Un golpe duro. Toca callar, trabajar y devolverle a la afición lo que merece.','No hay excusas contra {v}. Nos faltó intensidad y hay que reconocerlo.','Estamos tristes, pero el vestuario está unido. Esto se arregla trabajando.','Merecíamos más, pero el fútbol es así. Cabeza alta y a la siguiente.','Perder duele, pero lo peor sería esconderse. Hay que dar la cara, empezando por nosotros.'],
 mv:['Estoy en un buen momento, pero no quiero relajarme ni un segundo.','Los números ayudan, pero lo que quiero son títulos con el {t}.','Estoy muy a gusto aquí. Mientras {m} confíe en mí, lo daré todo.','Sueño con llevar al {t} a lo más alto de esta liga.','Cuando el equipo funciona, el jugador sale ganando. Esto es mérito del grupo.'],
 cs:['Dejar la portería a cero es mérito de todos: de los delanteros que presionan y de los defensas que cierran.','Contra {v} había que estar muy atentos. El cero nos da confianza para lo que viene.','Un portero vive de la tranquilidad que le da la defensa. Hoy hemos estado muy bien juntos.','El cero es bonito, pero no hay que confiarse. Seguimos trabajando los detalles.'],
 pe:['Me puse delante del balón con calma. Lo entreno cada semana y el equipo confía en mí para ello.','Un penalti nunca es fácil. Lo importante es no pensar demasiado y golpear con decisión.','Lo hablamos en el vestuario: si hay penalti, lo tiro yo. Hoy tocó y salió bien.'],
 fa:['Llevo semanas probando ese golpeo después de los entrenamientos. Hoy me salió tal como lo imaginaba.','Vi un hueco entre la barrera y el portero, y pensé que si salía bien, sería golazo. Y salió.','Las faltas se trabajan mucho. No siempre salen, pero cuando salen, se disfrutan el doble.'],
 co:['El balón parado lo trabajamos toda la semana. {as} puso el centro justo donde pedimos y yo solo tuve que llegar.','Cuando una jugada ensayada sale bien, es la recompensa a muchas horas de vídeo y repeticiones.','Contra {v} sabíamos que el córner podía hacer daño. Lo habíamos estudiado.'],
 late:['Insistimos hasta el final y eso se premia. Un gol en el minuto {min} te cambia la semana.','No pensé en nada, solo en estar en el sitio correcto. Después te das cuenta de lo que has hecho.','El equipo creyó hasta el último minuto. Esa mentalidad es la que queremos.'],
 ht:['Con incredulidad. Esto es del equipo: sin los pases de mis compañeros no habría hecho nada.','Tres goles en un partido no se ven todos los días. Me llevo el balón a casa, pero mañana toca seguir trabajando.','Estoy muy contento, pero lo importante es que el equipo ha ganado. Los goles son una consecuencia.'],
 g:['Vamos jornada a jornada, sin mirar la tabla. Lo demás vendrá solo.','{m} nos pide paciencia con el proyecto y yo confío plenamente.','Mi objetivo es seguir creciendo. Lo demás, que lo decidan los goles.']};
const IQ={
 w:[['Gol y victoria. ¿Cómo se vive desde dentro?','Con mucha alegría, pero con los pies en el suelo. Hemos trabajado toda la semana y se nota en el campo.'],['¿Qué ha marcado la diferencia ante {v}?','La intensidad sin balón. Cuando todos presionamos a la vez, el rival se queda sin ideas.'],['¿Qué mensaje le llega de la grada?','Que estamos juntos. Se nota cuando la gente aprieta en los minutos difíciles; eso nos da fuerzas.']],
 e:[['Marcó, pero el equipo no ganó. ¿Qué sabor le queda?','Agridulce. Marcar siempre es bonito, pero queríamos los tres puntos. Hay que ser más fiables.'],['¿Dónde se escapó el partido?','En los detalles: un balón dividido, una segunda jugada. Son cosas pequeñas que deciden partidos.']],
 l:[['¿Cómo está el vestuario tras la derrota?','Tocado, pero unido. Hay que asumir errores, reconocer al rival y trabajar para la siguiente.'],['¿Qué falló ante {v}?','Nos faltó ritmo y, cuando quisimos reaccionar, ya era tarde. Sin excusas.'],['¿Qué mensaje manda a la afición?','Compromiso. Se merecen más y vamos a dárselo.']],
 mv:[['Gran momento de forma. ¿A qué lo atribuye?','Al trabajo diario, a la confianza de {m} y al apoyo del grupo. Cuando el equipo funciona, el jugador sale ganando.'],['¿Se ve peleando por títulos?','Mientras sigamos creciendo, sí. Sin obsesionarnos, partido a partido.'],['¿Qué le falta por mejorar?','Regularidad, decisión en los últimos metros, trabajo defensivo. Siempre se puede más.']],
 cs:[['Portería a cero. ¿Cuánto vale ese cero?','Mucho. Es un trabajo de todos: delanteros que presionan, defensas que cierran, y yo solo tengo que estar atento.'],['¿Cómo se prepara un partido así?','Con vídeo, balón parado y mucha comunicación. El portero ordena, pero la defensa tiene que escuchar.']],
 pe:[['¿Qué se siente al ponerse delante del balón en un penalti?','Mucha calma por fuera y mucho latido por dentro. Lo entreno cada semana y se nota.'],['¿Quién decidió que lo tirara usted?','Lo hablamos en el vestuario: si pasa algo, lo tiro yo. Hoy tocó y salió bien.']],
 fa:[['Golazo de falta. ¿Lo tenía pensado?','Sí, llevo semanas probando ese golpeo después de entrenar. Hoy me salió como lo imaginaba.'],['¿Qué le dijo {m} antes del lanzamiento?','Que confiara en lo que había practicado. A veces basta con eso.']],
 co:[['Gol a balón parado, ¿estaba ensayado?','Sí, lo trabajamos toda la semana. {as} puso el balón donde pedimos y yo solo tuve que llegar.'],['¿Cuánto trabajo hay detrás de una jugada así?','Más de lo que parece: vídeo, repeticiones, señales. Cuando sale, es la recompensa.']],
 late:[['Gol en el minuto {min}. ¿Qué se le pasó por la cabeza?','Nada, la verdad. Solo quería estar en el sitio correcto. Después te das cuenta de lo que has hecho.'],['¿Cree que el equipo merecía los tres puntos?','Insistimos hasta el final y eso se premia. Los partidos duran hasta que el árbitro pita.']],
 ht:[['Tres goles en un partido. ¿Cómo se asimila algo así?','Con incredulidad. Esto es del equipo: sin los pases de mis compañeros no habría hecho nada.'],['¿Se lleva el balón a casa?','Claro. Lo guardaré como recuerdo, aunque mañana ya hay que pensar en el siguiente partido.']]};
const QC={
 cl:['Felicito al {c}: ha estado mejor y no hay discusión. Nosotros tenemos que revisar cómo defendimos.','El {c} nos ha hecho daño en los momentos clave. Toca levantarse y trabajar.','No hay excusas: {m} ha preparado muy bien el partido y nosotros no hemos estado a la altura.','Perder duele, pero no vamos a mirar a otro lado. Hay cosas que corregir en nuestro juego.'],
 cw:['Hemos sufrido, pero el equipo ha sabido competir. El {c} es un rival muy peligroso y lo hemos respetado.','Un triunfo valioso ante un equipo bien dirigido por {m}. Seguimos adelante.','Los tres puntos son para el vestuario, que se ha dejado la piel. El {c} no nos lo ha puesto fácil.'],
 ce:['Un punto que sabe a poco, pero contra el {c} tampoco es mal resultado. Hemos competido.','El empate es justo. {m} tiene un equipo serio y que no regala nada.','Podíamos haber ganado, pero también perder. Nos llevamos un punto ante un rival difícil.'],
 pv:['Será un partido exigente. El {c} tiene calidad y {m} sabe cómo plantear estos partidos.','Nos toca preparar bien el partido: el {c} es peligroso en transición y a balón parado.','Vamos con ilusión. Respeto al {c}, pero queremos imponer nuestro juego.'],
 ot:['Hay que pedir perdón a la afición. Una derrota así no se puede repetir.','Los jugadores han dado la cara, pero hay que reconocer que el rival ha sido superior.','Un resultado así duele. Mañana toca trabajar mucho para levantar la cabeza.'],
 bp:['Estamos muy contentos con el trabajo de {m}. Tiene todo nuestro respaldo.','El proyecto avanza. Queremos continuidad, y no solo por los resultados.'],
 bz:['Confiamos en {m}, pero los resultados tienen que acompañar en las próximas jornadas.','Seguimos de cerca la evolución. Hay margen, pero no infinito.'],
 bn:['Estamos preocupados. Los resultados no llegan y la directiva se reunirá para decidir.','No voy a cuestionar a nadie hoy, pero la situación exige una reacción inmediata.']};
function fdQuote(w,l,rs,LN,lht,mv){const T=i=>G.T[i],pool=[];
 const keeper=tm=>(tm.lu&&tm.lu.length?tm.lu.map(i=>tm.pl[i]):[]).find(p=>p&&p.pos=='P')||tm.pl.find(p=>p.pos=='P');
 fdWk(l).forEach(([h,a,s1,s2])=>[[h,a,s1,s2.length],[a,h,s2,s1.length]].forEach(([t,v,s,gc])=>{
  const sc=`${T(h).n} ${s1.length}-${s2.length} ${T(a).n}`,df=s.length-gc,cn={};s.forEach(g=>cn[g[0]]=(cn[g[0]]||0)+1);
  s.forEach(g=>{const ty=g[3]&&g[3]!='n'?g[3]:'',k=df<0?'l':cn[g[0]]>=3?'ht':ty=='pe'?'pe':ty=='fa'?'fa':ty=='co'?'co':g[1]>=85&&df>0&&df<=1?'late':df>0?'w':'e';
   pool.push({n:g[0],t,v,k,min:g[1],as:g[2],sc})});
  if(df<0){const tm=T(t),lu=(tm.lu&&tm.lu.length?tm.lu.map(i=>tm.pl[i]):tm.pl).filter(p=>p&&p.pos!='P').sort((x,y)=>y.ovr-x.ovr).slice(0,4);if(lu.length)pool.push({n:fpk(lu).n,t,v,k:'l',sc})}
  if(gc==0){const kp=keeper(T(t));if(kp)pool.push({n:kp.n,t,v,k:'cs',sc})}}));
 if(mv)pool.push({n:mv.p.n,t:mv.t.id,v:null,k:'mv'});
 if(!pool.length)return;
 const used=new Set(),ac=fsh(['marca','sky','fd']),n=Math.random()<.15?2:1;
 for(let z=0;z<n;z++){const fr=pool.filter(x=>!used.has(x.n)),mine=fr.filter(x=>x.t==G.me||x.v==G.me);if(!fr.length)break;
  const x=mine.length&&Math.random()<.45?fpk(mine):fpk(fr);used.add(x.n);
  const tn=T(x.t).n,mm=x.t==G.me&&Math.random()<.6?G.mgr:'el míster',
   fill=s=>s.replace(/\{v\}/g,x.v!=null?T(x.v).n:'el rival').replace(/\{t\}/g,tn).replace(/\{m\}/g,mm).replace(/\{as\}/g,x.as?fdLn(x.as):'un compañero').replace(/\{min\}/g,x.min!=null?x.min:'').replace(/\{sc\}/g,x.sc||'el resultado').replace(/\{j\}/g,w+1),
   a=ac[z],my=x.t==G.me||(x.v!=null&&x.v==G.me),q=fill(fpk(Math.random()<.12&&x.k!='cs'?QV.g:QV[x.k]||QV.w)),
   af=x.sc?`tras el ${x.sc}`:`tras la jornada ${w+1}`;
  let tx;
  if(a=='marca'){const qa=IQ[x.k]&&Math.random()<.6?fpk(IQ[x.k]):null;
   tx=qa?`🎙️ ENTREVISTA | ${x.n} (${tn}) para MARCA.\n— ${fill(qa[0])}\n— «${fill(qa[1])}»`:fpk([`🗞️ ${x.n}, sin filtros en MARCA: «${q}»\n#${lht}`,`🗞️ ${x.n} (${tn}) en MARCA: «${q}»`])}
  else if(a=='sky')tx=fpk([`🎤 ZONA MIXTA | ${x.n} (${tn}) ${af}: «${q}»`,`🎤 DECLARACIONES | ${x.n} atiende a Sky Sports ${af}: «${q}»\n#${lht}`]);
  else tx=x.k=='late'?`⏱️ ${x.n.toUpperCase()} Y SU GOL EN EL ${x.min}': «${q}»\n#J${w+1}`:x.k=='cs'?`🧤 ${x.n} sobre el cero ante ${x.v!=null?T(x.v).n:'el rival'}: «${q}»`:x.k=='l'?`😔 ${x.n} da la cara: «${q}»`:fpk([`👀 ${x.n.toUpperCase()} SE SINCERA: «${q}» 🔥\n#J${w+1}`,`🎙️ Palabras mayores de ${x.n} (${tn}): «${q}» 🗣️`,`🗣️ ${x.n} sin filtros: «${q}»`]);
  const o={my,pn:x.n,pt:x.t,qk:x.k};if(IMG.iv.length)o.card={t:'ph',img:fpk(IMG.iv),h:'DECLARACIONES',n:x.n,cr:x.t,st:tn,rt:0};
  fdAdd(a,tx,o)}}
/* entrenadores rivales, directiva y previas: declaraciones que reaccionan a tu resultado y a tu situación en el club */
function fdPress(w,l,rs,LN,lht){const T=i=>G.T[i],me=T(G.me),mg=G.mgr,mr=rs.find(r=>r[2]==G.me||r[3]==G.me),
 fill=(s,o)=>s.replace(/\{c\}/g,me.n).replace(/\{m\}/g,mg).replace(/\{o\}/g,o?o.n:''),ac=()=>fpk(['marca','sky']);
 if(mr&&Math.random()<.5){const h=mr[2]==G.me,o=T(h?mr[3]:mr[2]),d=h?mr[4]-mr[5]:mr[5]-mr[4],sc=`${T(mr[2]).n} ${mr[4]}-${mr[5]} ${T(mr[3]).n}`,k=d>0?'cl':d<0?'cw':'ce';
  fdAdd(ac(),`🎙️ RUEDA DE PRENSA | El técnico del ${o.n} tras el ${sc}: «${fill(fpk(QC[k]),o)}»`,{my:1,pt:o.id,qk:'coach'})}
 if(Math.random()<.2){const k=G.conf>60?'bp':G.conf>=35?'bz':'bn';
  fdAdd(ac(),`🎙️ PRESIDENTE | El presidente del ${me.n} sobre ${mg}: «${fill(fpk(QC[k]))}»`,{my:1,pt:G.me,qk:'bd'})}
 const nf=((G.fx[l]||[])[w+1]||[]).find(x=>x.includes(G.me));
 if(nf&&Math.random()<.45){const ro=T(nf[0]==G.me?nf[1]:nf[0]);
  fdAdd(ac(),`⏭️ PREVIA | El técnico del ${ro.n} antes de medirse al ${me.n}: «${fill(fpk(QC.pv),ro)}»`,{my:1,pt:ro.id,qk:'pv'})}
 const bg=rs.filter(r=>r!==mr&&Math.abs(r[4]-r[5])>=3).sort((a,b)=>Math.abs(b[4]-b[5])-Math.abs(a[4]-a[5]))[0];
 if(bg&&Math.random()<.5){const lo=T(bg[4]>bg[5]?bg[3]:bg[2]);fdAdd('sky',`🎤 PALABRAS DEL TÉCNICO | ${lo.n} tras caer ${Math.max(bg[4],bg[5])}-${Math.min(bg[4],bg[5])}: «${fpk(QC.ot)}»`,{pt:lo.id,qk:'coach'})}}

/* ---------- PORTERÍA A 0 (de vez en cuando, con ST4.png o ST4-2.png) ---------- */
function fdCS(w,l,rs,LN,lht){if(Math.random()>.5)return;const T=i=>G.T[i],c=[];
 rs.forEach(r=>[[r[2],r[3],r[5],r[4]],[r[3],r[2],r[4],r[5]]].forEach(([t,v,gc,gf])=>{if(gc!=0)return;const tm=T(t),k=(tm.lu&&tm.lu.length?tm.lu.map(i=>tm.pl[i]):[]).find(p=>p&&p.pos=='P')||tm.pl.find(p=>p.pos=='P');if(k)c.push({k,t,v,win:gf>0})}));
 if(!c.length)return;const mine=c.filter(x=>x.t==G.me),x=mine.length&&Math.random()<.6?mine[0]:fpk(c),a=Math.random()<.5?'fd':'sky',vn=T(x.v).n,tn=T(x.t).n;
 fdAdd(a,a=='fd'?fpk(x.win?[`🧤🔒 PORTERÍA A 0 | ${x.k.n} (${tn}) cierra la puerta ante ${vn}. ¡Muro! 🧱\n#PorteríaA0 #J${w+1}`,`🧱 ¡NO PASA NADIE! ${x.k.n} deja el cero en el marcador y el ${tn} se lleva el partido ante ${vn} 🙌`]:[`🧤🔒 PORTERÍA A 0 | ${x.k.n} (${tn}) mantiene el cero ante ${vn}. Sin goles, pero ¡qué muro! 🧱\n#PorteríaA0 #J${w+1}`,`🧱 ¡NO PASA NADIE! ${x.k.n} firma otra noche perfecta ante ${vn}. Cero en contra 🙌`]):fpk([`🧤 PORTERÍA A CERO | ${x.k.n} (${tn}) mantiene su portería imbatida ante el ${vn} en la jornada ${w+1} de la ${LN}.`,`🧤 ACTA | Meta invicta para ${x.k.n} (${tn}) frente al ${vn}.\n#${lht}`]),
  {my:x.t==G.me||x.v==G.me,card:{t:'ph',img:fpk(IMG.cs),h:'PORTERÍA A 0 · J'+(w+1),n:x.k.n,cr:x.t,st:'Sin encajar ante '+vn,rt:0}})}

/* ---------- GOL DEL MES patrocinado por HERTZ ---------- */
function fdGMtrack(w,l){const T=i=>G.T[i];let b=G.gm&&G.gm.sc!=null?G.gm:null;
 fdWk(l).forEach(([h,a,s1,s2])=>[[h,a,s1],[a,h,s2]].forEach(([t,v,s])=>s.forEach(g=>{
  const sc=({fa:3.2,co:1.6,pe:-2}[g[3]]||0)+(g[1]>=88?1.4:g[1]>=80?.6:0)+(g[2]?.4:0)+R(0,1.6);
  if(!b||sc>b.sc)b={sc,n:g[0],t,v,min:g[1],as:g[2],ty:g[3],w}})));
 if(b)G.gm=b}
function fdGM(w,l,LN,lht){fdGMtrack(w,l);if(w%4!=3||!G.gm)return;const x=G.gm,T=i=>G.T[i],tn=T(x.t).n,vn=T(x.v).n,
  d=({fa:'Una falta de museo.',co:'Remate perfecto tras un córner.'}[x.ty])||fpk(['Una jugada para enmarcar.','Un golazo de los que se recuerdan.','Imposible no repetirlo una y otra vez.']);
 fdAdd('hertz',fpk([`⚽🚗 El GOL DEL MES, patrocinado por HERTZ | ${x.n} (${tn}) ante ${vn}, minuto ${x.min}'. ${d}${x.as?' Asistencia de '+fdLn(x.as)+'.':''}\n#GolDelMes #HERTZ`,`🏆 HERTZ patrocina el gol y el ganador es ${x.n} (${tn}) frente al ${vn} (J${x.w+1}). ${d}\n#GolDelMes #${lht}`]),
  {big:1,my:x.t==G.me||x.v==G.me,card:{t:'s',n:x.min+"'",l:`Gol del mes · ${x.n} · J${x.w+1}`,cr:x.t}});G.gm=null}

/* ---------- SERGIO NAVARRO (periodista): tácticas, estados de forma, momentos y goles; no habla de fichajes ---------- */
function fdSergio(w,l,rs,LN,lht,mv){const T=i=>G.T[i],me=T(G.me),mg=G.mgr,mr=rs.find(r=>r[2]==G.me||r[3]==G.me),c=[],my=[],
 sg=r=>`${T(r[2]).n} ${r[4]}-${r[5]} ${T(r[3]).n}`,cd=r=>({t:'r',h:r[2],a:r[3],hg:r[4],ag:r[5]}),fm=v=>v.toFixed(1).replace('.',',');
 if(mr){const h=mr[2]==G.me,o=T(h?mr[3]:mr[2]),gf=h?mr[4]:mr[5],gc=h?mr[5]:mr[4],d=gf-gc;
  my.push(()=>fdAdd('sergio',fpk(d>=2?[`🧠 ANÁLISIS | ${sg(mr)}. El ${me.n} ganó el partido con ideas claras: presión tras pérdida, líneas juntas y mucha gente llegando al área.\n#${lht}`,`🔍 LA CLAVE | Más allá del ${gf}-${gc}, lo mejor del ${me.n} fue cómo recuperó el balón en campo rival. Así se castiga a ${o.n}.`]:
   d==1?[`🧠 ANÁLISIS | ${sg(mr)}. Victoria corta que se explica por el orden: pocas concesiones y una defensa que no se descompuso. Los equipos que ganan así suelen sumar mucho a final de temporada.`,`🔍 LA CLAVE | El ${me.n} no brilló, pero supo gestionar los tiempos del partido ante ${o.n}. ${gc==0?'Portería a cero y mucha concentración.':'Sufrió, pero cerró bien las ayudas.'}`]:
   d==0?[`🧠 ANÁLISIS | ${sg(mr)}. ${gf==0?'Partido muy cerrado: pocos espacios y mucha precaución por ambos lados.':'Partido abierto, con errores en las dos áreas.'} ${mg} tiene que ajustar ${gf==0?'el último pase':'las ayudas defensivas'}.`,`🔍 LA CLAVE | ${me.n} y ${o.n} se anularon en los sectores clave. Quien consiga cambiar el ritmo en la segunda parte decantará estos partidos.`]:
   [`🧠 ANÁLISIS | ${sg(mr)}. El ${me.n} perdió el partido en las transiciones: demasiado espacio entre líneas y poca ayuda al lateral. Es corregible, pero ${mg} tiene trabajo esta semana.`,`🔍 LA CLAVE | ${o.n} supo dónde hacer daño al ${me.n}. ${d<=-2?'Cuando el partido se rompe, cuesta mucho volver a ordenarlo.':'Con pequeños detalles, el resultado pudo ser otro.'}`]),{card:cd(mr),my:1}))}
 let bv=null,bd=null;
 rs.forEach(r=>[r[2],r[3]].forEach(i=>{const v=fdSk(i,'v'),d=fdSk(i,'d');if(v>=3&&(!bv||v>bv.n))bv={i,n:v};if(d>=3&&(!bd||d>bd.n))bd={i,n:d}}));
 if(bv)c.push(()=>fdAdd('sergio',`📈 ESTADO DE FORMA | ${T(bv.i).n} suma ${bv.n} victorias seguidas. ${fpk(['Lo llamativo no es solo el resultado, sino cómo gana: con orden y sin depender de una sola pieza.','Un equipo en racha gana también partidos que no merece. Este los está ganando de todas las formas.'])}\n#${lht}`,{card:{t:'s',n:bv.n,l:'victorias seguidas',cr:bv.i},my:bv.i==G.me}));
 if(bd)c.push(()=>fdAdd('sergio',`📉 MALA RACHA | ${T(bd.i).n} encadena ${bd.n} derrotas seguidas. ${fpk(['El problema ya no es solo táctico: es de confianza.','Cuando el equipo duda, se nota en cada balón dividido y en cada segunda jugada.'])}`,{card:{t:'s',n:bd.n,l:'derrotas seguidas',cr:bd.i},my:bd.i==G.me}));
 const tg=rs.slice().sort((a,b)=>(b[4]+b[5])-(a[4]+a[5]))[0],z=rs.find(r=>r[4]==0&&r[5]==0);
 if(tg&&tg[4]+tg[5]>=5)c.push(()=>fdAdd('sergio',`⚽ GOLES | ${sg(tg)}. ${tg[4]+tg[5]} goles en un partido que se rompió pronto: defensas descolocadas y mucho espacio al contragolpe.`,{card:cd(tg),my:tg[2]==G.me||tg[3]==G.me}));
 if(z)c.push(()=>fdAdd('sergio',`🔒 PARTIDO CERRADO | ${sg(z)}. Dos equipos que prefirieron no perder antes que arriesgar. En la ${LN} cada punto cuenta mucho.`,{card:cd(z),my:z[2]==G.me||z[3]==G.me}));
 const late=[];fdWk(l).forEach(([h,a,s1,s2])=>{const hg=s1.length,ag=s2.length;if(Math.abs(hg-ag)!=1)return;const ws=hg>ag?s1:s2,g=ws.slice().sort((x,y)=>y[1]-x[1])[0];if(g&&g[1]>=87)late.push({n:g[0],t:hg>ag?h:a,min:g[1],sc:`${T(h).n} ${hg}-${ag} ${T(a).n}`})});
 if(late.length)c.push(()=>{const x=late[0];fdAdd('sergio',`⏱️ MOMENTO | ${x.n} marca en el minuto ${x.min} y decide el ${x.sc}. Hay partidos que se ganan por insistencia, no por dominio.`,{my:x.t==G.me})});
 if(mv)c.push(()=>fdAdd('sergio',`🔎 JUGADOR DEL MOMENTO | ${mv.p.n} (${mv.t.n}) está en un gran estado de forma: ${fm(mv.rt)} de nota en la jornada ${w+1}. Lo mejor: ${({D:'cómo ordena a los suyos sin balón',P:'la seguridad que da bajo palos',M:'cómo conecta las líneas',F:'su movimiento sin balón y su pegada'})[mv.p.pos]||'su regularidad'}.`,{my:mv.t.id==G.me}));
 const gl=rs.reduce((q,r)=>q+r[4]+r[5],0),av=gl/rs.length;
 c.push(()=>fdAdd('sergio',`📊 TENDENCIA | ${gl} goles en la jornada ${w+1} de la ${LN} (${fm(av)} por partido). ${av>=3?'Se juega a campo abierto y las defensas sufren.':av<2?'Mandan las defensas: los partidos se deciden por detalles.':'Equilibrio entre ataque y defensa: ninguna línea domina a las demás.'}`));
 const n=Math.random()<.35?1:2,pk=[];if(my.length&&Math.random()<.75)pk.push(my[0]);fsh(c).forEach(f=>{if(pk.length<n)pk.push(f)});pk.forEach(f=>f())}

function fdFD(w,l,rs){const LN=LGN[l],lht=fslug(LN),N=NWL[l],run=f=>{try{f()}catch(e){console.error(e)}};
 let mv=null;run(()=>{mv=fdIdeal(w,l,rs,LN)});run(()=>fdStars(w,l,LN,lht,mv));run(()=>fdQuote(w,l,rs,LN,lht,mv));run(()=>fdPress(w,l,rs,LN,lht));run(()=>fdSergio(w,l,rs,LN,lht,mv));run(()=>fdCS(w,l,rs,LN,lht));run(()=>fdGM(w,l,LN,lht));run(()=>fdVibes(w,l,rs,LN,lht));
 if(w>=3&&(w+1)%5==0&&w<N-1)run(()=>fdPred(w,l,LN,lht));
 if(w%6==2)run(()=>fdDuel(w,l,LN));
 if(w%7==4)run(()=>fdYoung(w,l,LN));
 run(()=>fdRecUpd(w,l,LN,lht));
 if(w%12==11)run(()=>fdRecBook(l,LN,lht))}
function fdSeasonFD(){const l=G.T[G.me].lg,LN=LGN[l],run=f=>{try{f()}catch(e){console.error(e)}};run(()=>fdYoung(-1,l,LN));run(()=>fdRecBook(l,LN,fslug(LN)))}

/* ---------- publicaciones de cada jornada ---------- */
function genFeed(w){
 const me=G.T[G.me],l=me.lg,T=i=>G.T[i],rs=G.res.filter(r=>r[0]==w&&r[1]==l),mr=G.res.find(r=>r[0]==w&&(r[2]==G.me||r[3]==G.me));
 if(!rs.length)return;
 FW=w;FT=Math.floor(R(470,600));
 G.feed=(G.feed||[]).filter(p=>p.w<=w&&p.w>=w-FKEEP);/* poda: se conservan la jornada actual y las 3 anteriores */
 const LN=LGN[l],mg=G.mgr,slg=fslug(me.n),lht=fslug(LN),sg=r=>`${T(r[2]).n} ${r[4]}-${r[5]} ${T(r[3]).n}`,card=r=>({t:'r',h:r[2],a:r[3],hg:r[4],ag:r[5]}),
  tb=tab(l),lead=tb[0],pos=myPos(),so=i=>str(T(i)).o,wn=r=>r[4]>r[5]?r[2]:r[3],ls=r=>r[4]>r[5]?r[3]:r[2];
 let h,o,gf,gc,d,scorer=null;
 /* 1. club propio */
 if(mr){h=mr[2]==G.me;o=h?mr[3]:mr[2];gf=h?mr[4]:mr[5];gc=h?mr[5]:mr[4];d=gf-gc;
  const gs=G.last&&G.last.r[0]==w?G.last.sc.filter(s=>s[0]==G.me):[];if(gs.length){const c={};gs.forEach(s=>c[s[1]]=(c[s[1]]||0)+1);scorer=Object.keys(c).sort((a,b)=>c[b]-c[a])[0]}
  fdClub(G.me,`🏁 FINAL | ${sg(mr)}${gs.length?'\n⚽ '+gs.map(s=>s[1]+' '+s[2]+"'"+({pe:' (p)',fa:' (f)',co:' (c)'}[s[4]]||'')+(s[3]?' (as. '+s[3].split(' ').slice(1).join(' ')+')':'')).join(' · '):''}\n#J${w+1} #${slg}`,{card:card(mr),m:.7,big:d>=2,top:1})}
 if(mr&&Math.random()<.55){const sp=gs0(mr,w);fdClub(G.me,fpk(d>=1?[`🔥 ¡Qué noche! ${sp&&sp.ty=='pe'?'Desde los once metros '+fdLn(sp.n)+' no falla.':sp&&sp.ty=='fa'?'Golazo de falta de '+fdLn(sp.n)+'.':sp&&sp.ty=='co'?'Remate de '+fdLn(sp.n)+' tras un córner y a celebrarlo.':scorer?scorer+' en estado de gracia.':'Equipo enorme.'} Gracias por empujar hasta el final #${slg}`,`💪 Tres puntos más y la grada rugiendo. Vamos a por la siguiente 🏟️ #${slg}`,`✅ Trabajo hecho. Cada partido cuenta y este lo hemos sacado adelante ⚽ #${slg}`,`👏 Gran partido de ${scorer||'todo el equipo'}. Seguimos creciendo, afición. #${slg}`,`🏟️ Gracias por vuestro apoyo en la grada: esta victoria también es vuestra. #${slg}`]:d==0?[`🤝 Punto sumado. Seguimos creciendo, gracias por el apoyo #${slg}`,`⚖️ Empate trabajado. Toca corregir detalles y mirar a la próxima #${slg}`,`🤝 Un punto que nos toca analizar con calma. Gracias por no soltarnos. #${slg}`]:[`😔 No era el resultado que queríamos. A levantarse: la afición merece más #${slg}`,`💙 Duele, pero seguimos juntos. A trabajar para la próxima #${slg}`,`🔁 Toca analizar lo que ha pasado y volver más fuertes. Contamos con vosotros. #${slg}`]),{m:.3})}
 /* 2. resumen de la liga */
 const gl=rs.reduce((s,r)=>s+r[4]+r[5],0),lst=rs.slice().sort((a,b)=>(a===mr?-1:b===mr?1:(b[4]+b[5])-(a[4]+a[5]))).slice(0,5);
 fdAdd('l'+l,`📋 Resumen de la jornada ${w+1}: ${gl} goles en ${rs.length} partidos (${(gl/rs.length).toFixed(1).replace('.',',')} por encuentro). ${lead.n} lidera con ${lead.pts} puntos.\n#J${w+1} #${lht}`,{card:{t:'l',rows:lst.map(r=>[r[2],r[3],r[4],r[5]])}});
 /* 3. MARCA */
 const mk=[],must=[],big=rs.slice().sort((a,b)=>Math.abs(b[4]-b[5])-Math.abs(a[4]-a[5]))[0],bm=Math.abs(big[4]-big[5]);
 if(bm>=3)mk.push(()=>fdAdd('marca',`🔴 GOLEADA | ${T(wn(big)).n} pasa por encima de ${T(ls(big)).n} (${Math.max(big[4],big[5])}-${Math.min(big[4],big[5])}). ${fpk(['Contundencia total.','Una exhibición.','El rival no supo qué hacer.'])}\n#J${w+1}`,{card:card(big),big:1,my:big===mr}));
 const up=rs.filter(r=>r[4]!=r[5]).map(r=>({r,g:so(ls(r))-so(wn(r))})).filter(x=>x.g>=3).sort((a,b)=>b.g-a.g)[0];
 if(up)mk.push(()=>fdAdd('marca',`⚠️ SORPRESA | ${T(wn(up.r)).n} tumba a ${T(ls(up.r)).n}. ${fpk(['Nadie lo esperaba.','Resultado inesperado que mueve la tabla.','Los favoritos tropiezan.'])}`,{card:card(up.r),my:up.r===mr}));
 if(mr)mk.push(()=>fdAdd('marca',fpk(d>=2?[`${me.n} golpea fuerte: ${sg(mr)}. ${mg} gana crédito en el banquillo.`,`${me.n} no da opción a ${T(o).n} (${sg(mr)}).${scorer?' '+scorer+' lidera la fiesta.':''}`,`Exhibición del ${me.n} ${h?'en casa':'a domicilio'}: ${sg(mr)}. ${pos<=3?'Ya mira a los de arriba.':'La tabla empieza a moverse.'}`]:d==1?[`${me.n} se lleva un triunfo ajustado ante ${T(o).n} y ${pos<=3?'se mantiene en la zona noble':'sigue escalando posiciones'}.`,`Victoria de oficio del ${me.n} ante ${T(o).n}: ${sg(mr)}. ${mg} suma y sigue.`]:d==0?[`Tablas entre ${me.n} y ${T(o).n}. ${gf==0?'Poco fútbol y ninguna ocasión clara.':'Reparto de puntos con goles.'}`,`${me.n} y ${T(o).n} se reparten los puntos (${sg(mr)}). ${mg} se queda con sensaciones contradictorias.`]:[`${me.n} cae ante ${T(o).n}${d<=-2?' y aumenta la presión sobre '+mg:''}.`,`${T(o).n} castiga al ${me.n} (${sg(mr)}). ${d<=-2?'Pitos y dudas en el banquillo.':'Se complica la semana para '+mg+'.'}`]),{my:1,card:card(mr)}));
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
 fdFD(w,l,rs);
 G.feed.sort((a,b)=>a.i-b.i);save()}

/* ---------- arranque de temporada y fin de temporada ---------- */
function feedStart(first){const me=G.T[G.me],l=me.lg,LN=LGN[l],tb=G.T.filter(t=>t.lg==l).sort((a,b)=>str(b).o-str(a).o),fav=tb[0],mg=G.mgr,slg=fslug(me.n),rk=tb.findIndex(t=>t.id==G.me)+1;
 FW=-1;FT=Math.floor(R(480,540));
 if(first)fdClub(G.me,`👋 ¡Bienvenido, ${mg}! Nuevo entrenador del ${me.n} para la temporada ${G.season}. Objetivo: ${objTxt(G.obj[0])}. #${slg}`,{m:.9,big:1});
 fdAdd('l'+l,`⚽ ¡Arranca la ${LN} ${G.season}! ${tb.length} equipos, ${NWL[l]} jornadas y una sola ilusión: ser campeón.\n#${fslug(LN)}`);
 fdAdd('marca',rk==1?`🔝 ${me.n} parte como el equipo a batir en la ${LN}. La presión, desde el primer día, es toda suya.`:`🔝 ${fav.n} parte como favorito en la ${LN}, pero ${me.n} (${rk}º por plantilla) quiere dar la sorpresa.`,{my:1});
 fdAdd('opta',`📊 Según nuestro modelo, ${fav.n} es el favorito (media ${Math.round(str(fav).o)}). ${me.n} aparece ${rk}º de ${tb.length} por nivel de plantilla.`,{card:{t:'s',n:Math.round(str(me).o),l:`media del ${me.n}`,cr:G.me},my:1});
 const x=fpool(l).sort((a,b)=>mval(b.p)-mval(a.p))[0];if(x)fdAdd('tm',`💶 El jugador más valioso de la ${LN} ${G.season}: ${x.p.n} (${x.t.n}).`,{card:fdVal(x.p,x.t,0),my:x.t.id==G.me});
 fdAdd('sergio',`🧠 CLAVES DE LA TEMPORADA | En la ${LN} ${G.season} pesarán la presión tras pérdida y la solidez en balón parado. ${me.n} ${rk<=3?'tiene argumentos para pelear arriba si mantiene el equilibrio entre ataque y defensa':'tendrá que ganar en los detalles para meterse en la pelea'}.\n#${fslug(LN)}`,{my:1});
 fdRumor(l);
 fdFan(G.me,fpk(['¡Ya huele a fútbol! Este año va a ser grande 💪','Nuevo año, nueva ilusión. Abonos renovados y a por todas #'+slg,'Que empiece ya. Estamos listos para animar hasta el final ❤️']),{my:1,v:4});
 try{const V=perV(null);perPost(fpk(perGrp('fan')),null,V,1);perPost(fpk(perGrp('crit')),null,V,1);if(Math.random()<.7)perPost(fpk(perGrp('neu')),null,V,0)}catch(e){console.error(e)}
 G.feed.sort((a,b)=>a.i-b.i);save()}
function feedSeason(s){const me=G.T[G.me],slg=fslug(me.n),id=n=>{const t=G.T.find(t=>t.n==n);return t?t.id:null},ch=id(s.champ);
 FW=-2;FT=Math.floor(R(500,560));G.gm=null;G.fdm={};
 fdAdd('marca',`🏆 ¡${s.champ} es campeón de la ${LGN[1]} ${s.season}! ${fpk(['Una temporada para la historia.','Lo ha merecido de principio a fin.','Fiesta grande en la ciudad.'])}`,{big:1,my:ch==G.me});
 fdAdd('l1',`🏆 Fin de temporada ${s.season}: campeón ${s.champ}. Descienden: ${s.rel.join(', ')}.`,{card:ch!=null?{t:'s',n:'1º',l:s.champ,cr:ch}:null});
 fdAdd('l2',`⬆️ Ascienden a la ${LGN[1]}: ${s.pro.join(', ')}. ¡Enhorabuena!`);
 if(s.sc)fdAdd('opta',`🎯 Pichichi ${s.season}: ${s.sc[0]} (${s.sc[1]}) termina con ${s.sc[2]} goles.`,{card:{t:'s',n:s.sc[2],l:'goles · '+s.sc[0],cr:id(s.sc[1])}});
 fdClub(G.me,`🎬 Termina la temporada ${s.season}: ${s.pos}º en la ${LGN[s.lg]}. ${s.met}/${s.tot} objetivos cumplidos. Gracias por todo, afición. #${slg}`,{m:.8,big:1});
 if(s.fired)fdAdd('marca',`🚨 ÚLTIMA HORA | ${me.n} destituye a ${G.mgr}. La directiva pone fin a su etapa.`,{big:1,my:1});
 fdAdd('jorge',`🚨 Arranca el mercado de verano. Se esperan movimientos importantes en las dos ligas. #Mercado`);
 fdSeasonFD();
 G.feed.sort((a,b)=>a.i-b.i);feedStart(0)}
function fdInit(){if(G.fans==null)G.fans=60;if(G.seen==null)G.seen=0;if(!G.feed){G.feed=[];G.fs=0;feedStart(1)}}

/* ---------- pintado ---------- */
/* (fdKey ya existe en extras.js: aquí uso fdAK) alterna cuentas dentro de cada jornada (nunca repite cuenta seguida si hay alternativa) y mantiene siempre las jornadas más nuevas arriba */
const fdAK=p=>p.a||(p.per!=null?'per'+p.per:p.k=='club'?'club'+p.cr:'fan'+p.cr);
function fdAlt(a){const out=[];let i=0;
 while(i<a.length){let j=i;while(j<a.length&&a[j].w==a[i].w)j++;const g=a.slice(i,j),rc=[];
  while(g.length){let k=g.findIndex((p,q)=>q<14&&!rc.includes(fdAK(p)));if(k<0)k=g.findIndex((p,q)=>q<14&&fdAK(p)!=rc[0]);if(k<0)k=0;
   const p=g.splice(k,1)[0];out.push(p);rc.unshift(fdAK(p));rc.length=Math.min(rc.length,2)}
  i=j}
 return out}
const fdList=f=>{if(f=='all')return fdAlt(G.feed.filter(fdCur).reverse());const a=G.feed.filter(fdRec).reverse();return f=='my'?a.filter(p=>p.my):a.filter(p=>p.c==f)};
const fdAv=a=>`<span class="av br${/^(LOGO|FD|SKY|HERTZ)/.test(a.img)?' lg':''}"><i>${fesc(a.n[0])}</i><img src="img/${encodeURIComponent(a.img)}" alt="" onerror="this.parentNode.classList.add('nf');this.remove()"></span>`;
const VF='<svg class="vf" viewBox="0 0 24 24" aria-label="Cuenta verificada"><circle cx="12" cy="12" r="11"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function fdAcc(p){if(p.a){const a=ACC[p.a];return{n:a.n,h:a.h,v:1,av:fdAv(a)}}
 if(p.per!=null&&PER[p.per]){const P=PER[p.per];return{n:P.n,h:P.h,v:0,av:`<span class="av br per"><i>${fesc(P.n[0])}</i><img src="img/${P.img}" alt="" onerror="this.parentNode.classList.add('nf');this.remove()"></span>`}}
 if(p.k=='club'){const t=G.T[p.cr];return{n:t.n,h:fslug(t.n),v:1,av:`<span class="av cl">${crest(p.cr,34)}</span>`}}
 return{n:p.fn,h:p.fh,v:0,av:`<span class="av cl fn">${crest(p.cr,34)}</span>`}}
function fdEmb(c){if(!c)return'';
 if(c.t=='r')return `<div class="qc">${fdRes(c.h,c.a,c.hg,c.ag)}</div>`;
 if(c.t=='l')return `<div class="qc ql">${c.rows.map(r=>fdRes(...r)).join('')}</div>`;
 if(c.t=='s')return `<div class="qc qs">${c.cr!=null?crest(c.cr,34):''}<b class="bn">${fesc(c.n)}</b><span>${fesc(c.l)}</span></div>`;
 if(c.t=='v')return `<div class="qc qv">${crest(c.cr,34)}<div class="vi"><b>${fesc(c.pn)}</b><span class="mu sm">${PN[c.pos]} · ${fesc(G.T[c.cr].n)} · ${c.age} años</span></div><div class="vv"><b>${fesc(c.val)}</b><em class="${c.up>=0?'ok':'ko'}">${c.up>=0?'▲':'▼'} ${Math.abs(c.up)}%</em></div></div>`; const fdPl=(r)=>['F','M','D','P'].map(q=>`<div class="fd-rw">${r.filter(x=>x[0]==q).map(x=>`<div class="fd-pl${x[6]?' mv':''}">${crest(x[2],26)}<b>${fesc(fdLn(x[1]))}</b><i>${x[3].toFixed(1).replace('.',',')}</i>${x[4]||x[5]?`<u>${x[4]?'⚽'+(x[4]>1?x[4]:''):''}${x[5]?'🅰'+(x[5]>1?x[5]:''):''}</u>`:''}</div>`).join('')}</div>`).join('');
 const fdHd=c=>`<div class="fd-hd"><b>${fesc(c.h)}</b><span>${fesc(c.s)}</span></div>`;
 if(c.t=='ph')return `<div class="qc fd-ph"><img src="img/${c.img}" alt="" onerror="this.parentNode.classList.add('nf');this.remove()"><div class="fd-pc"><div><small>${fesc(c.h)}</small><b>${fesc(c.n)}</b><span>${fesc(c.st)}</span></div>${c.rt?`<i>${c.rt}</i>`:''}</div></div>`;
 if(c.t=='xi')return `<div class="qc fd-c">${fdHd(c)}<div class="fd-pit">${fdPl(c.r)}</div></div>`;
 if(c.t=='pr')return `<div class="qc fd-c"><div class="fd-hd"><b>PREDICCIÓN FINAL</b><span>${c.pj}/${c.n} jornadas</span></div><div class="fd-bd">${c.r.map((x,i)=>`<div class="fd-pr"><span class="fd-n">${i+1}</span>${crest(x[0],24)}<b>${nm(x[0])}</b><span class="fd-bar"><i style="width:${Math.max(3,x[2])}%"></i></span><em>${x[2]}%</em><u>${x[1]} pts</u></div>`).join('')}<div class="fd-zn"><small>${c.zl}</small>${c.z.map(i=>`<span class="tn">${crest(i,20)}<small>${nm(i)}</small></span>`).join('')}</div>${c.me&&c.me[0]>5?`<div class="fd-zn"><small>Tu club</small><span>${c.me[0]}º · ${c.me[1]} pts</span></div>`:''}</div></div>`;
 if(c.t=='cp'){const A=c.a,B=c.b,mx=(x,y)=>Math.max(x,y,1),row=(l,k,f)=>{const a=A[k],b=B[k],m=mx(a,b);return `<div class="fd-cr"><small>${l}</small><div class="fd-ln"><b class="${a>b?'w':''}">${f(a)}</b><span class="fd-t"><span class="h l"><i class="${a>b?'w':''}" style="width:${Math.round(100*a/m)}%"></i></span><span class="h"><i class="${b>a?'w':''}" style="width:${Math.round(100*b/m)}%"></i></span></span><b class="${b>a?'w':''}">${f(b)}</b></div></div>`},id=x=>x;
  return `<div class="qc fd-c"><div class="fd-hd"><b>CARA A CARA</b><span>Delanteros</span></div><div class="fd-du"><div>${crest(A.cr,38)}<b>${fesc(A.n)}</b><small>${A.age} años</small></div><span class="vs">VS</span><div>${crest(B.cr,38)}<b>${fesc(B.n)}</b><small>${B.age} años</small></div></div><div class="fd-bd">${row('Media','ovr',id)}${row('Goles','g',id)}${row('Asistencias','a',id)}${row('Valor de mercado','v',fmv)}</div></div>`}
 if(c.t=='yr')return `<div class="qc fd-c">${fdHd(c)}<div class="fd-bd">${c.r.map((x,i)=>`<div class="fd-yr"><span class="fd-n">${i+1}</span>${crest(x[0],26)}<div><b>${fesc(x[1])}</b><small>${PN[x[2]]} · ${x[3]} años</small></div><span class="pt">${x[4]} <em>→ ${x[5]}</em><i><u style="width:${fdC(x[5],0,100)}%"></u></i></span></div>`).join('')}</div></div>`;
 if(c.t=='rc')return `<div class="qc fd-c">${fdHd(c)}<div class="fd-bd">${c.r.map(x=>`<div class="fd-rc${x.nw?' nw':''}"><span class="fd-v">${fesc(x.v)}</span><div><b>${fesc(x.k)}${x.nw?' <em>NUEVO</em>':''}</b><small>${x.cr!=null&&G.T[x.cr]?crest(x.cr,16):''}<span>${fesc(x.n)} · ${x.s}</span></small></div></div>`).join('')}</div></div>`;
 return''}
const fdTxt=s=>fesc(s).replace(/(#[\p{L}\p{N}_]+)/gu,'<span class="ht">$1</span>').replace(/\n/g,'<br>');
function fdPost(p,seen){const a=fdAcc(p),wl=p.w==-1?'Pretemporada':p.w==-2?'Fin de temporada':'J'+(p.w+1);
 return `<article class="po${p.my?' my':''}${p.i>seen?' nw':''}" data-i="${p.i}">${a.av}<div class="pb"><div class="ph"><b>${fesc(a.n)}</b>${a.v?VF:''}<span class="hd">@${fesc(a.h)}</span><span class="dt">· ${wl} · ${p.tm}</span></div><div class="px">${fdTxt(p.tx)}</div>${fdEmb(p.card)}<div class="pf"><button class="a cmb" data-a="cm" title="Ver comentarios">💬 <b>${fN(p.rp)}</b></button><button class="a rt${p.rtd?' on':''}" data-a="rt">⟲ <b>${fN(p.rt)}</b></button><button class="a lk${p.lkd?' on':''}" data-a="lk">♥ <b>${fN(p.lk)}</b></button><span class="a">📈 <b>${fN(p.vw)}</b></span></div></div></article>`}
function feedHome(){const a=fdList('all').filter(fdTop).slice(0,6),seen=G.seen|0;
 return `<section class="pn fdp"><div class="fdh"><h3><span class="live"></span>Destacados · Mundo Superstar</h3><button id="fall">Ver todo →</button></div>${a.map(p=>fdPost(p,seen)).join('')||'<p class="mu" style="padding:16px">Todavía no hay tweets destacados.</p>'}</section>`}
function fdSide(){const me=G.T[G.me],l=me.lg,w=G.week,tb=tab(l),sp=fpool(l).sort((a,b)=>b.p.g-a.p.g)[0],
 hv=s=>{let x=7;for(const ch of s)x=(x*31+ch.charCodeAt(0))%99991;return 900+(x*(w+5))%47000},
 tr=[['#'+fslug(me.n),'Tu club'],['#J'+Math.min(w+1,NWL[l]),'Jornada en juego'],sp&&sp.p.g>0?['#Pichichi',sp.p.n+' · '+sp.p.g+' goles']:null,['#Mercado','Rumores de fichajes']].filter(Boolean);
 return `<div class="pn"><h3>Tendencias</h3>${tr.map(([t,s])=>`<div class="tr"><span class="mu sm">${fesc(s)} · Tendencia</span><b>${fesc(t)}</b><span class="mu sm">${fN(hv(t))} publicaciones</span></div>`).join('')}</div>
 <div class="pn"><h3>Cuentas que mandan</h3>${Object.keys(ACC).map(k=>{const a=ACC[k];return `<div class="ac${S.prof==k?' on':''}" data-p="${k}" role="button" tabindex="0">${fdAv(a)}<div><b>${fesc(a.n)}</b>${VF}<br><span class="mu sm">@${a.h} · ${a.f} seguidores</span></div></div>`}).join('')}</div>`}
function fdProf(k){const a=ACC[k];return `<div class="prh">${fdAv(a)}<div><b>${fesc(a.n)}</b>${VF}<br><span class="mu sm">@${a.h} · ${a.f} seguidores</span></div><button id="pback">← Volver</button></div>`}
function feedFull(){const pk=S.prof&&ACC[S.prof]?S.prof:null,f=FF.some(x=>x[0]==S.ff)?S.ff:'all',n=S.fn||20;
 if(!S.socOpen){S.socOpen=true;S.fseen=G.seen|0;G.seen=G.fs;save()}
 const L=pk?G.feed.filter(p=>fdRec(p)&&p.a==pk).reverse():fdList(f),seen=S.fseen|0;
 return `<div class="sg"><section class="pn fdp"><div class="fdh"><h3><span class="live"></span>${pk?'Perfil · '+fesc(ACC[pk].n):'Redes · Mundo Superstar'}</h3></div>${pk?fdProf(pk):`<div class="fx">${FF.map(([k,t])=>`<button data-f="${k}" class="${f==k?'on':''}">${t}</button>`).join('')}</div>`}${L.slice(0,n).map(p=>fdPost(p,seen)).join('')||'<p class="mu" style="padding:16px">Todavía no hay publicaciones aquí.</p>'}${L.length>n?'<button id="fmore" class="mr">Cargar más publicaciones</button>':''}</section><aside class="sd">${fdSide()}</aside></div>`}
/* al abrir/cerrar un perfil: lleva la vista hasta el perfil (sin saltar al inicio de la página), descontando la cabecera fija */
function fdScrollProf(){const run=()=>{const t=document.querySelector('.sg .fdp');if(!t)return;const hd=document.querySelector('header.top'),off=(hd?hd.getBoundingClientRect().height:0)+8,y=t.getBoundingClientRect().top+window.pageYOffset-off;
  window.scrollTo({top:Math.max(0,y),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})};requestAnimationFrame(()=>requestAnimationFrame(run))}
function fdBind(){
 document.querySelectorAll('.po .a[data-a]').forEach(b=>b.onclick=()=>{const po=b.closest('.po'),p=G.feed.find(x=>x.i==+po.dataset.i);if(!p)return;if(b.dataset.a=='cm'){fdCmToggle(po,p);return}const k=b.dataset.a=='lk'?'lk':'rt',d=k+'d';p[d]=!p[d];p[k]+=p[d]?1:-1;b.classList.toggle('on',!!p[d]);b.querySelector('b').textContent=fN(p[k]);save()});
 document.querySelectorAll('.fx [data-f]').forEach(b=>b.onclick=()=>{S.ff=b.dataset.f;S.prof=null;S.fn=20;render()});
 document.querySelectorAll('.ac[data-p]').forEach(b=>{const go=()=>{S.prof=S.prof==b.dataset.p?null:b.dataset.p;S.fn=20;render();fdScrollProf()};b.onclick=go;b.onkeydown=e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();go()}}});
 const pb=$('#pback');if(pb)pb.onclick=()=>{S.prof=null;S.fn=20;render()};
 const m=$('#fmore');if(m)m.onclick=()=>{S.fn=(S.fn||20)+20;render()};
 const a=$('#fall');if(a)a.onclick=()=>{S.tab='soc';S.prof=null;S.socOpen=false;render()}}
