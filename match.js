/* Partido en directo: reproduce de forma animada el resultado ya simulado */
function liveMatch(m,done){
const [,,h,a,hg,ag]=m.r,ids=[h,a],T=ids.map(i=>G.T[i]),COL=['#2f7bff','#ff5a4f'];
const ev=m.sc.map(s=>({min:s[2],k:'goal',s:s[0]==h?0:1,who:s[1]}));
const strs=T.map(t=>str(t));
ids.forEach((id,s)=>{const x=xi(G.T[id]).filter(p=>p.pos!='P'),n=Math.round(R(3,7));for(let i=0;i<n;i++)ev.push({min:Math.floor(R(2,89)),k:Math.random()<.5?'save':'miss',s,who:x[Math.floor(Math.random()*x.length)].n})});
ev.sort((x,y)=>x.min-y.min);
const XS={P:7,D:24,M:45,F:62},pl=[];
T.forEach((t,s)=>{const x=xi(t);['P','D','M','F'].forEach(c=>{const g=x.filter(p=>p.pos==c);g.forEach((p,i)=>{const bx=s?105-XS[c]:XS[c],by=(i+1)/(g.length+1)*68;pl.push({s,c,bx,by,x:bx,y:by,ph:Math.random()*6})})})});
const o=document.createElement('div');o.id='lv';
let svg='<svg viewBox="0 0 105 68" id="lvp">';
for(let i=0;i<10;i++)svg+=`<rect x="${i*10.5}" y="0" width="10.5" height="68" class="${i%2?'gs1':'gs2'}"/>`;
svg+='<g class="gl"><rect x="1" y="1" width="103" height="66"/><line x1="52.5" y1="1" x2="52.5" y2="67"/><circle cx="52.5" cy="34" r="9"/><rect x="1" y="14" width="16" height="40"/><rect x="88" y="14" width="16" height="40"/><rect x="1" y="25" width="6" height="18"/><rect x="98" y="25" width="6" height="18"/></g><rect x="-1.5" y="30" width="2.5" height="8" class="gp"/><rect x="104" y="30" width="2.5" height="8" class="gp"/>';
pl.forEach((p,i)=>svg+=`<circle id="pj${i}" r="1.7" fill="${COL[p.s]}" class="pj"/>`);
svg+='<ellipse id="bsh" rx="1.2" ry=".5" fill="#0005"/><circle id="bl" r="1.1" fill="#fff" stroke="#111" stroke-width=".3"/></svg>';
o.innerHTML=`<div class="lvc"><div class="lvh"><b style="color:${COL[0]}">${T[0].n}</b><div class="sc" id="lvs">0 - 0</div><b style="color:${COL[1]}">${T[1].n}</b></div>
<div class="lvt"><span id="lvm">0'</span><div class="bar"><i id="lvk" style="width:0"></i></div></div>
<div class="lvw">${svg}<div id="lvb"></div></div>
<div class="lvst"><span id="sh0">0</span><span class="mu sm">Tiros</span><span id="sh1">0</span></div>
<div id="lvf"></div>
<div class="lvct"><button data-v="1" class="on">x1</button><button data-v="2">x2</button><button data-v="4">x4</button><button data-v="60">Saltar</button><button class="p" id="lvok" style="display:none">Continuar</button></div></div>`;
document.body.appendChild(o);
const q=s=>o.querySelector(s),feed=q('#lvf'),ban=q('#lvb');
const say=(min,t,c)=>{const d=document.createElement('p');d.className='lf '+(c||'');d.innerHTML=`<b>${min}'</b> ${t}`;feed.prepend(d)};
let min=0,sp=1,pause=0,sc=[0,0],sh=[0,0],ei=0,last=performance.now(),nextT=0,rs=0,half=0,fin=0,poss=0;
const ball={x:52.5,y:34},tg={x:52.5,y:34};
const hold=x=>x/(sp>10?40:1),me=s=>ids[s]==G.me;
o.querySelectorAll('.lvct button[data-v]').forEach(b=>b.onclick=()=>{sp=+b.dataset.v;o.querySelectorAll('.lvct button').forEach(x=>x.classList.toggle('on',x==b))});
const L={save:['{p} remata y el portero bloca','{p} lo intenta de lejos, ¡paradón!','{p} dispara y el portero lo desvía a córner'],miss:['{p} la manda fuera por poco','{p} cabecea desviado','{p} se encuentra con el larguero']};
say(0,'¡Comienza el partido!');
function fire(e){const gx=e.s?1:104;sh[e.s]++;tg.x=ball.x=gx;tg.y=ball.y=34+R(-4,4);
 if(e.k=='goal'){sc[e.s]++;ban.innerHTML=`<div class="gb ${me(e.s)?'gm':''}"><span>¡GOL!</span><small>${e.who} · ${T[e.s].n}</small></div>`;ban.className='on';pause=hold(2.6);rs=1;say(e.min,`⚽ <b>¡GOL de ${T[e.s].n}!</b> Marca ${e.who}`,'g')}
 else{pause=hold(.9);const t=L[e.k][Math.floor(Math.random()*3)].replace('{p}',e.who);say(e.min,`${t} (${T[e.s].n})`)}}
function end(){fin=1;ban.innerHTML=`<div class="gb"><span>FINAL</span><small>${hg} - ${ag}</small></div>`;ban.className='on';say(90,`Final del partido: ${T[0].n} ${hg} - ${ag} ${T[1].n}`,'g');q('#lvok').style.display='';q('.lvct').querySelectorAll('button[data-v]').forEach(b=>b.style.display='none');q('#lvok').onclick=()=>{o.remove();done()}}
function frame(now){if(fin)return;const dt=Math.min(.05,(now-last)/1000);last=now;
 if(pause>0){pause-=dt;if(pause<=0){ban.className='';if(rs){ball.x=tg.x=52.5;ball.y=tg.y=34;rs=0;poss=1-poss}}}
 else{min+=dt*2*sp;
  if(!half&&min>=45){half=1;pause=hold(1.4);say(45,'Descanso. Los equipos se van a los vestuarios','h');ban.innerHTML='<div class="gb"><span>Descanso</span></div>';ban.className='on'}
  else{let g=0;while(ei<ev.length&&ev[ei].min<=min&&pause<=0)fire(ev[ei++]);
   if(pause<=0&&now>=nextT){const p=strs[0].o/(strs[0].o+strs[1].o)+R(-.12,.12);poss=Math.random()<p?0:1;tg.x=poss?R(15,45):R(60,90);tg.y=R(10,58);nextT=now+R(800,1700)/sp}
   if(pause<=0&&ei>=ev.length&&min>=90){end();return}}}
 const k=Math.min(1,dt*3*Math.min(sp,4));ball.x+=(tg.x-ball.x)*k;ball.y+=(tg.y-ball.y)*k;
 pl.forEach((p,i)=>{const f=p.c=='P'?.08:p.c=='D'?.3:.5,tx=p.bx+(ball.x-52.5)*f,ty=p.by+(ball.y-34)*.18+Math.sin(now/450+p.ph)*.9;p.x+=(tx-p.x)*dt*3;p.y+=(ty-p.y)*dt*3;const e=q('#pj'+i);e.setAttribute('cx',p.x);e.setAttribute('cy',p.y)});
 const b=q('#bl'),hh=Math.abs(Math.sin(now/180))*1.2;b.setAttribute('cx',ball.x);b.setAttribute('cy',ball.y-hh);q('#bsh').setAttribute('cx',ball.x);q('#bsh').setAttribute('cy',ball.y+.8);
 const mm=Math.min(90,Math.floor(min));q('#lvm').textContent=mm+"'";q('#lvk').style.width=mm/.9+'%';q('#lvs').textContent=sc[0]+' - '+sc[1];q('#sh0').textContent=sh[0];q('#sh1').textContent=sh[1];
 requestAnimationFrame(frame)}
requestAnimationFrame(frame)}
