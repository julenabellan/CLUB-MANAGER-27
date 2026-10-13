/* Partido en directo: marcador arriba + mensajes de cada equipo. Reproduce el resultado ya simulado. */
function liveMatch(m,done){
const [,,h,a,hg,ag]=m.r,ids=[h,a],T=ids.map(i=>G.T[i]),mine=ids[0]==G.me?0:1,MT=T[mine];
xi(MT);const orig=[MT.lu.slice(),MT.bn.slice()],strs=T.map(t=>str(t)),ev=[];
m.sc.forEach(s=>ev.push({min:s[2],k:'goal',s:s[0]==h?0:1,who:s[1]}));
const pick=x=>x[Math.floor(Math.random()*x.length)];
ids.forEach((id,s)=>{const x=xi(G.T[id]).filter(p=>p.pos!='P'),n=Math.round(R(8,13));
 for(let i=0;i<n;i++){const r=Math.random(),k=r<.5?pick(['save','save','miss','post','block']):r<.7?'foul':r<.85?'corner':'card';ev.push({min:Math.floor(R(2,89)),k,s,who:pick(x).n})}});
ev.sort((x,y)=>x.min-y.min);
const L={
goal:['¡GOOOL de {p}! Derechazo terrible','¡GOOOL de {p}! Zurdazo imparable','¡GOOOL de {p}! Cabezazo a la red','¡GOOOL de {p}! Define con calma','¡GOOOL de {p}! No perdona dentro del área','¡GOOOL de {p}! Un golazo desde fuera del área'],
save:['{p} dispara y el portero lo detiene','{p} lo intenta de lejos. ¡Paradón!','{p} remata a bocajarro y el portero lo saca','Disparo de {p} desviado a córner por el portero'],
miss:['{p} la manda fuera por muy poco','{p} cabecea desviado','{p} dispara alto, a las nubes','{p} se precipita y falla'],
post:['¡Al palo! {p} estuvo a centímetros','¡Larguero! El disparo de {p} saca astillas'],
block:['Disparo de {p} bloqueado por la defensa','{p} prueba suerte pero un defensa se interpone'],
foul:['Falta de {p}. El árbitro para el juego','{p} entra tarde y el árbitro pita falta'],
corner:['Córner a favor. {p} lo sacará','Saque de esquina tras una buena jugada de {p}'],
card:['Tarjeta amarilla para {p}','El árbitro enseña amarilla a {p}']};
const ICON={goal:'⚽',save:'🧤',miss:'💨',post:'🥅',block:'🛡️',foul:'🟨',corner:'🚩',card:'🟨'};
const o=document.createElement('div');o.id='lv';
const cr=(i,s)=>crest(i,s);
o.innerHTML=`<div class="lvc"><div class="lvtop"><div class="lvtm">${cr(ids[0],54)}${form5(ids[0],m.r[0])}<b>${T[0].n}</b></div>
<div class="lvmid"><div>${lgl(m.r[1],30)}</div><div class="sc" id="lvs">0 - 0</div><div class="lvmin" id="lvm">0'</div></div>
<div class="lvtm r">${cr(ids[1],54)}${form5(ids[1],m.r[0])}<b>${T[1].n}</b></div></div>
<div class="bar"><i id="lvk" style="width:0"></i></div>
<div class="lvst"><span id="sh0">0</span><span class="mu sm">Tiros</span><span id="sh1">0</span></div>
<div id="lvf"></div>
<div class="lvct"><button data-v="1" class="on">x1</button><button data-v="2">x2</button><button data-v="4">x4</button><button id="lvsb">Cambios (5)</button><button data-v="60">Saltar</button><button class="p" id="lvok" style="display:none">Continuar</button></div></div>`;
document.body.appendChild(o);
const q=s=>o.querySelector(s),feed=q('#lvf');
const say=(min,s,t,c)=>{const d=document.createElement('div');d.className='lm l'+s+' '+(c||'');d.innerHTML=`${s<2?cr(ids[s],26):''}<div><small>${min}'</small><span>${t}</span></div>`;feed.prepend(d)};
let min=0,sp=1,pause=0,pz=0,sc=[0,0],sh=[0,0],ei=0,last=performance.now(),half=0,fin=0,subs=0;
const hold=x=>x/(sp>10?40:1);
o.querySelectorAll('.lvct button[data-v]').forEach(b=>b.onclick=()=>{sp=+b.dataset.v;o.querySelectorAll('.lvct button[data-v]').forEach(x=>x.classList.toggle('on',x==b))});
say(0,2,'¡Comienza el partido!','h');
function fire(e){const t=pick(L[e.k]).replace('{p}','<b>'+e.who+'</b>');
 if(e.k=='goal'){sc[e.s]++;sh[e.s]++;pause=hold(1.8);say(e.min,e.s,`${ICON.goal} ${t} <em>${T[e.s].n}</em>`,'g'+(e.s==mine?' gm':''));q('#lvs').classList.remove('flash');void q('#lvs').offsetWidth;q('#lvs').classList.add('flash')}
 else{if(['save','miss','post','block'].includes(e.k))sh[e.s]++;pause=hold(.35);say(e.min,e.s,`${ICON[e.k]} ${t}`,e.k=='card'?'y':'')}}
function recap(){const gs=ev.filter(e=>e.k=='goal'),my=sc[mine],th=sc[1-mine],d=my-th,opp=T[1-mine].n,run=[0,0],out=[];
 const head=d>=3?'Goleada':d==2?'Victoria sólida':d==1?'Victoria ajustada':d==0?(my?'Empate con goles':'Empate sin goles'):d==-1?'Derrota mínima':d==-2?'Derrota clara':'Noche para olvidar';
 gs.forEach((e,i)=>{const s=e.s,pd=run[s]-run[1-s];run[s]++;const nd=pd+1;
  const c=i==0?'Abrió el marcador':nd==0?'Igualó':pd<0&&nd>0?'Remontó':nd<0?'Recortó distancias':pd==0?'Puso por delante a '+T[s].n:'Amplió la ventaja';
  out.push(`${c} <b>${e.who}</b> (${e.min}')${i==0?' para '+T[s].n:''}.`)});
 const cnt={};gs.forEach(e=>cnt[e.who]=(cnt[e.who]||0)+1);Object.keys(cnt).filter(k=>cnt[k]>1).forEach(k=>out.push(cnt[k]>2?`¡Hat-trick de <b>${k}</b>!`:`Doblete de <b>${k}</b>.`));
 const pos=myPos(),end=d>0?`Tres puntos que te colocan ${pos}º.`:d==0?`Un punto que te deja ${pos}º.`:`Sin puntos: ${pos}º en la tabla.`;
 const el=document.createElement('div');el.className='lm l2 sum';
 el.innerHTML=`<h4>Resumen · ${head}</h4><p>${T[0].n} ${hg}-${ag} ${T[1].n}. ${out.join(' ')||'Ninguno de los dos logró perforar la portería.'} En total, ${T[0].n} remató ${sh[0]} veces y ${T[1].n} ${sh[1]}. ${end}</p>`;feed.prepend(el)}
function end(){fin=1;MT.lu=orig[0];MT.bn=orig[1];save();say(90,2,`🏁 Final: ${T[0].n} ${hg} - ${ag} ${T[1].n}`,'h f');recap();q('#lvok').style.display='';q('.lvct').querySelectorAll('button:not(#lvok)').forEach(b=>b.style.display='none');q('#lvok').onclick=()=>{o.remove();done()}}
function frame(now){if(fin)return;const dt=Math.min(.05,(now-last)/1000);last=now;
 if(!pz){if(pause>0)pause-=dt;
  else{min+=dt*2*sp;
   if(!half&&min>=45){half=1;pause=hold(1.2);say(45,2,'⏸ Descanso. Los equipos se van a los vestuarios','h')}
   else{while(ei<ev.length&&ev[ei].min<=min&&pause<=0)fire(ev[ei++]);
    if(pause<=0&&ei>=ev.length&&min>=90){end();return}}}}
 const mm=Math.min(90,Math.floor(min));q('#lvm').textContent=mm+"'";q('#lvk').style.width=mm/.9+'%';q('#lvs').textContent=sc[0]+' - '+sc[1];q('#sh0').textContent=sh[0];q('#sh1').textContent=sh[1];
 requestAnimationFrame(frame)}
q('#lvsb').onclick=()=>{if(fin||subs>=5)return;pz=1;const x=MT.lu.map(i=>MT.pl[i]),bn=MT.bn.map(i=>MT.pl[i]);let a=null,b=null;
 const pn=document.createElement('div');pn.id='lvsub';o.appendChild(pn);
 const draw=()=>{pn.innerHTML=`<div class="sbx"><h3>Cambios · ${subs}/5 usados</h3><div class="g2"><div><p class="mu sm">Sale</p>${x.map((p,i)=>`<button data-a="${i}" class="${a===i?'on':''}"><span>${PN[p.pos]} ${p.n}</span><b>${p.ovr}</b></button>`).join('')}</div><div><p class="mu sm">Entra</p>${bn.map((p,i)=>`<button data-b="${i}" class="${b===i?'on':''}"><span>${PN[p.pos]} ${p.n}</span><b>${p.ovr}</b></button>`).join('')}</div></div><p class="lvct"><button class="p" id="sbg" ${a===null||b===null?'disabled':''}>Confirmar cambio</button><button id="sbc">Cerrar</button></p></div>`;
  pn.querySelectorAll('[data-a]').forEach(e=>e.onclick=()=>{a=+e.dataset.a;draw()});pn.querySelectorAll('[data-b]').forEach(e=>e.onclick=()=>{b=+e.dataset.b;draw()});
  pn.querySelector('#sbc').onclick=()=>{pn.remove();pz=0;last=performance.now()};
  pn.querySelector('#sbg').onclick=()=>{const po=x[a],pi=bn[b],ia=MT.lu[a];MT.lu[a]=MT.bn[b];MT.bn[b]=ia;x[a]=pi;bn[b]=po;subs++;say(Math.min(90,Math.floor(min)),mine,`🔄 Cambio en ${MT.n}: sale <b>${po.n}</b>, entra <b>${pi.n}</b>`,'sub');q('#lvsb').textContent='Cambios ('+(5-subs)+')';if(subs>=5)q('#lvsb').disabled=true;pn.remove();pz=0;last=performance.now()}};
 draw()};
requestAnimationFrame(frame)}
