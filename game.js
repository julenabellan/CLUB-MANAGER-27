const lgl=(l,s=28)=>`<img class="lgl" height="${s}" src="img/LOGO%20${l}A.png" alt="" onerror="this.style.display='none'">`;
const CRN=["cluc fc g.png", "CRAKOVIA CF G.png", "Campo.png", "GACKO.png", "as club g.png", "KFK.png", "BERLIN FC.png", "Paris CF.png", "Gacko Portugal.png", "NUBE.png", "blue wordl club g.png", "SPAIN CLUB.png", "ENGLAND CLUB.png", "leizpig fc.png", "Creg Belga.png", "Spartak Belgrade.png", "LONDON CLUB.png", "Creg Croata.png", "Holland Team.png", "Moscu fc g.png", "Italica FC.png", "Germanya FS.png", "Warsaw KP.png", "MILANO SP.png", "Zürich Aktiv.png", "CLUC B.png", "France Club.png", "Bratislava Fighters.png", "PUSKAS SPORTOS.png", "mac manchester.png", "VICTORIA ISTANBUL.png", "SOLIKSON ISLANDIA.png", "LAC LIVERPOOL.png", "KFK B.png", "DINAMO ROTTERDAM.png", "Cardiff Cambrian FC.png", "RIBERA LEVANTINA.png", "SOLIKSON IRLANDES.png", "IBERICA.png", "SKÄRHOLM AFC.png", "JAPAN FC.png", "BASILEA FF.png", "MIQAREM.png", "NYHAVN.png"];
const crest=(i,s=28)=>`<img class="cr" width="${s}" height="${s}" src="img/${encodeURIComponent(CRN[i])}" alt="" onerror="this.style.visibility='hidden'">`;
const PN={P:'POR',D:'DEF',M:'MED',F:'DEL'},FORM={'4-3-3':[1,4,3,3],'4-4-2':[1,4,4,2],'3-5-2':[1,3,5,2]},LGN={1:'Liga Superstar One',2:'Liga Superstar 2'},REL=3,PRO=3,NW=46,NWL={1:38,2:46},KEY='cm27b';
const $=s=>document.querySelector(s),R=(a,b)=>a+Math.random()*(b-a),ef=p=>p.ovr*(1-.001*(p.fa|0)),av=a=>a.length?a.reduce((s,p)=>s+ef(p),0)/a.length:50;
let G=null,S={tab:'home',lg:1,sel:{lg:1,t:null}};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(G))}catch(e){}};
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}};
const ids=l=>G.T.filter(t=>t.lg==l).map(t=>t.id),nm=i=>G.T[i].n;
function newGame(name,tid){G={mgr:name,me:tid,season:2027,week:0,conf:60,T:D.map((t,i)=>({id:i,n:t.n,c:t.c,lg:t.l,form:'4-3-3',pl:t.p.map(p=>({n:p[1],nat:p[2],age:p[3],pos:p[0],ovr:p[4],pot:p[5],g:0,fa:0}))}))};startSeason();}
function startSeason(){G.week=0;G.res=[];G.last=null;G.T.forEach(t=>{t.pts=t.pj=t.gf=t.gc=t.w=t.d=t.l=0;t.pl.forEach(p=>{p.g=0;p.fa=0});if(t.id!=G.me||!t.man)auto(t)});G.fx={1:rounds(ids(1)),2:rounds(ids(2))};setObj();save();}
function rounds(a){a=a.slice().sort(()=>Math.random()-.5);const n=a.length,m=n-1,H=[];for(let r=0;r<m;r++){const x=[r%2?[a[r],a[m]]:[a[m],a[r]]];for(let k=1;k<n/2;k++){const p=a[(r+k)%m],q=a[(r-k+m)%m];x.push(k%2?[p,q]:[q,p])}H.push(x)}return H.concat(H.map(r=>r.map(([h,b])=>[b,h])))}
const slots=f=>{const a=FORM[f],o=[];'PDMF'.split('').forEach((c,i)=>{for(let k=0;k<a[i];k++)o.push(c)});return o},mean=a=>a.reduce((s,v)=>s+v,0)/a.length,rt=(p,s)=>ef(p)*(p.pos==s?1:.8);
function auto(t){const f=FORM[t.form],used=new Set(),lu=[],ix=t.pl.map((p,i)=>i),by=(a,b)=>ef(t.pl[b])-ef(t.pl[a]);
 'PDMF'.split('').forEach((c,k)=>ix.filter(i=>t.pl[i].pos==c&&!used.has(i)).sort(by).slice(0,f[k]).forEach(i=>{lu.push(i);used.add(i)}));
 ix.filter(i=>!used.has(i)&&t.pl[i].pos!='P').sort(by).slice(0,11-lu.length).forEach(i=>{lu.push(i);used.add(i)});
 const r=ix.filter(i=>!used.has(i)),gk=r.filter(i=>t.pl[i].pos=='P').sort(by).slice(0,1);
 t.lu=lu;t.bn=gk.concat(r.filter(i=>!gk.includes(i)).sort(by).slice(0,7-gk.length))}
function xi(t){if(!t.lu||t.lu.length!=11||t.lu.some(i=>!t.pl[i]))auto(t);if(!t.bn)auto(t);return t.lu.map(i=>t.pl[i])}
function str(t){const x=xi(t),sp=slots(t.form),r=x.map((p,i)=>rt(p,sp[i])),g=c=>{const a=r.filter((_,i)=>sp[i]==c);return a.length?mean(a):50},m=g('M'),f=g('F');return{a:.55*f+.35*m+.1*g('D'),d:.45*g('D')+.3*g('P')+.25*m,o:mean(r)}}
const fat=t=>{const x=new Set(t.lu);t.pl.forEach((p,i)=>{p.fa=Math.max(0,Math.min(100,(p.fa|0)+(x.has(i)?R(5,9):-9)))})};
function pois(l){const L=Math.exp(-l);let k=0,p=1;do{k++;p*=Math.random()}while(p>L);return k-1}
function scorers(t,n){const x=xi(t),sp=slots(t.form),w=x.map((p,i)=>({F:6,M:2.5,D:.8,P:0}[sp[i]]*ef(p)/70)),T=w.reduce((a,b)=>a+b,0),o=[];for(let i=0;i<n;i++){let r=Math.random()*T,j=0;while(j<w.length-1&&r>w[j]){r-=w[j];j++}x[j].g++;o.push([x[j].n,Math.floor(R(1,91))])}return o.sort((a,b)=>a[1]-b[1])}
function upd(t,f,c){t.pj++;t.gf+=f;t.gc+=c;if(f>c){t.w++;t.pts+=3}else if(f==c){t.d++;t.pts++}else t.l++}
function simW(){let mine=null;G.T.forEach(t=>{if(t.id!=G.me||!t.man)auto(t)});[1,2].forEach(l=>(G.fx[l][G.week]||[]).forEach(([h,a])=>{const H=G.T[h],A=G.T[a],sh=str(H),sa=str(A),hg=pois(Math.max(.25,1.55+(sh.a-sa.d)/22)),ag=pois(Math.max(.2,1.1+(sa.a-sh.d)/22)),s1=scorers(H,hg),s2=scorers(A,ag);fat(H);fat(A);upd(H,hg,ag);upd(A,ag,hg);const r=[G.week,l,h,a,hg,ag];G.res.push(r);if(h==G.me||a==G.me){mine={r,sc:[...s1.map(s=>[h,...s]),...s2.map(s=>[a,...s])].sort((x,y)=>x[2]-y[2])};G.last=mine;const d=h==G.me?hg-ag:ag-hg;G.conf=Math.max(0,Math.min(100,G.conf+(d>0?3:d<0?-2:0)))}}));G.week++;if(G.week>=NW)endSeason();return mine}
function simWeek(){if(G.week>=NW)return;const my=G.T[G.me].lg,mine=simW();if(G.week>=NWL[my]&&G.week<NW)while(G.week>=NWL[my]&&G.week<NW)simW();save();return mine}
const tab=l=>G.T.filter(t=>t.lg==l).sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf);
function setObj(){const me=G.T[G.me],l=me.lg,n=G.T.filter(t=>t.lg==l).length,rk=G.T.filter(t=>t.lg==l).map(t=>str(t).o).sort((a,b)=>b-a).findIndex(o=>o<=str(me).o),q=21*(n-1-rk)/(n-1),k=(n-1)*2/42;
 G.obj=[{t:'pos',v:l==1?Math.min(n-REL,rk+4):(rk<4?3:Math.min(16,rk+4))},{t:'gf',v:Math.round((36+q*.9)*k)},{t:'w',v:Math.round((10+q*.45)*k)}];G.objLg=l;G.objN=n}
const myPos=()=>tab(G.T[G.me].lg).findIndex(t=>t.id==G.me)+1;
function objVal(o){const me=G.T[G.me];return o.t=='pos'?myPos():o.t=='gf'?me.gf:me.w}
const objOk=o=>o.t=='pos'?objVal(o)<=o.v:objVal(o)>=o.v;
function objTxt(o){return o.t=='pos'?(G.objLg==1&&o.v>=G.objN-REL?'Evitar el descenso':G.objLg==2&&o.v<=3?'Lograr el ascenso (top 3)':'Terminar entre los '+o.v+' primeros'):o.t=='gf'?'Marcar al menos '+o.v+' goles':'Ganar al menos '+o.v+' partidos'}
function endSeason(){const t1=tab(1),t2=tab(2),me=G.T[G.me],pos=myPos(),met=G.obj.filter(objOk).length,rel=t1.slice(-REL),pro=t2.slice(0,PRO);
 G.conf=Math.max(0,Math.min(100,G.conf+(met>=2?15:met==1?0:-20)));
 G.sum={season:G.season,champ:t1[0].n,pro:pro.map(t=>t.n),rel:rel.map(t=>t.n),pos,lg:me.lg,met,tot:G.obj.length,fired:G.conf<=0,sc:G.T.filter(t=>t.lg==me.lg).flatMap(t=>t.pl.map(p=>[p.n,t.n,p.g])).sort((a,b)=>b[2]-a[2])[0]};
 rel.forEach(t=>t.lg=2);pro.forEach(t=>t.lg=1);
 G.T.forEach(t=>t.pl.forEach(p=>{p.age++;p.ovr=Math.round(p.age<=24?Math.min(p.pot,p.ovr+R(0,4)):p.age>31?p.ovr-R(0,3):p.ovr+R(-1.5,1.5));p.pot=Math.max(p.pot,p.ovr)}));
 G.season++;startSeason();G.pend=1}
/* UI */
const E=(s,o)=>{const e=document.createElement('div');e.innerHTML=s;return e};
function stTeams(l){return D.map((t,i)=>({i,t})).filter(x=>x.t.l==l).map(x=>({i:x.i,n:x.t.n,c:x.t.c,o:Math.round(av(x.t.p.map(p=>({ovr:p[4]})).sort((a,b)=>b.ovr-a.ovr).slice(0,14)))})).sort((a,b)=>b.o-a.o)}
function renderStart(){const s=S.sel,sv=load();document.body.dataset.lg=s.lg;$('#stc').innerHTML=`<h1>Club Manager <span>27</span></h1><p class="mu">Elige liga y club. Lleva a tu equipo a lo más alto de las ligas Superstar.</p>
${sv?`<div class="pn"><b>Partida guardada:</b> ${sv.mgr} · ${sv.T[sv.me].n} · temporada ${sv.season}, jornada ${sv.week}/${NWL[sv.T[sv.me].lg]} <button class="p" id="co" style="margin-left:8px">Continuar</button></div>`:''}
<div class="pn"><label>Nombre del entrenador<br><input id="mg" value="${sv?sv.mgr:''}" placeholder="Tu nombre" maxlength="24"></label>
<p class="seg" style="margin:14px 0 4px"><button data-l="1" class="${s.lg==1?'on':''}">${lgl(1,26)}<span>${LGN[1]}</span></button><button data-l="2" class="${s.lg==2?'on':''}">${lgl(2,26)}<span>${LGN[2]}</span></button></p>
<div class="tl">${stTeams(s.lg).map(t=>`<button data-t="${t.i}" class="${s.t===t.i?'on':''}"><span class="tn">${crest(t.i,36)}<span>${t.n}<br><span class="mu sm">${t.c}</span></span></span><b class="cn" style="font-size:22px">${t.o}</b></button>`).join('')}</div>
<button class="p" id="go" ${s.t===null?'disabled':''}>Empezar partida</button></div>`;
 document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{s.lg=+b.dataset.l;s.t=null;renderStart()});
 document.querySelectorAll('.tl button').forEach(b=>b.onclick=()=>{s.t=+b.dataset.t;renderStart()});
 $('#go').onclick=()=>{newGame($('#mg').value.trim()||'Míster',s.t);enter()};if(sv)$('#co').onclick=()=>{G=sv;enter()}}
function enter(){$('#st').style.display='none';$('#ap').style.display='block';render();if(G.pend)season()}
function render(){const me=G.T[G.me],p=Math.round(G.conf);$('#hc').innerHTML=crest(G.me,40)+'<span>'+me.n+'</span>';document.body.dataset.lg=me.lg;$('#hs').innerHTML=`${lgl(me.lg,22)}<span>${LGN[me.lg]} · Temporada ${G.season} · Jornada ${Math.min(G.week+1,NWL[me.lg])}/${NWL[me.lg]} · Directiva ${p}%</span>`;
 $('#bs').textContent='Jugar partido';
 $('#nv').innerHTML=[['home','Inicio'],['cal','Calendario'],['tab','Clasificación'],['sq','Plantilla'],['obj','Objetivos']].map(([k,l])=>`<button data-k="${k}" class="${S.tab==k?'on':''}">${l}</button>`).join('');
 document.querySelectorAll('#nv button').forEach(b=>b.onclick=()=>{S.tab=b.dataset.k;render()});
 $('#mn').innerHTML=V[S.tab]();bind()}
const sc=(h,a)=>`<div class="sc">${h} - ${a}</div>`;
const nxt=()=>G.fx[G.T[G.me].lg][G.week].find(m=>m.includes(G.me));
const V={
home(){const m=nxt(),me=G.T[G.me],l=G.last,top=G.T.filter(t=>t.lg==me.lg).flatMap(t=>t.pl.map(p=>[p.n,t.n,p.g])).sort((a,b)=>b[2]-a[2]).slice(0,5);let h='';
 const o=m[0]==G.me?m[1]:m[0];h+=`<div class="g2"><div class="pn"><h3>Próximo partido</h3><p class="mu sm">Jornada ${G.week+1} · ${m[0]==G.me?'En casa':'Fuera'}</p><div class="r" style="display:flex;justify-content:space-between;align-items:center"><div class="tc">${crest(G.me,48)}<br><b>${me.n}</b><br><span class="mu sm">Media ${Math.round(str(me).o)}</span></div><span class="cn" style="font-size:24px">vs</span><div class="tc" style="text-align:right">${crest(o,48)}<br><b>${nm(o)}</b><br><span class="mu sm">Media ${Math.round(str(G.T[o]).o)}</span></div></div></div>`;
 h+=`<div class="pn"><h3>Último resultado</h3>${l?`<p class="mu sm">Jornada ${l.r[0]+1}</p><div style="display:flex;justify-content:space-between;align-items:center"><b class="tn">${crest(l.r[2],30)}${nm(l.r[2])}</b>${sc(l.r[4],l.r[5])}<b class="tn">${nm(l.r[3])}${crest(l.r[3],30)}</b></div><p class="sm mu">${l.sc.map(s=>`${s[1]} ${s[2]}'`).join(' · ')||'Sin goles'}</p>`:'<p class="mu">Todavía no has jugado. Pulsa «Simular partido».</p>'}</div></div>`;
 h+=`<div class="g2"><div class="pn"><h3>Confianza de la directiva</h3><div class="bar" style="margin-top:8px"><i style="width:${G.conf}%"></i></div><p class="sm mu">Posición actual: ${myPos()}º en ${LGN[me.lg]}<br>Cansancio medio del once: ${Math.round(xi(me).reduce((s,p)=>s+(p.fa|0),0)/11)}%</p></div><div class="pn"><h3>Goleadores de tu liga</h3><table>${top.map(t=>`<tr><td>${t[0]}</td><td class="mu">${t[1]}</td><td class="n"><b>${t[2]}</b></td></tr>`).join('')}</table></div></div>`;return h},
cal(){const me=G.T[G.me],rows=G.fx[me.lg].map((r,w)=>{const m=r.find(x=>x.includes(G.me)),x=G.res.find(z=>z[0]==w&&(z[2]==G.me||z[3]==G.me)),h=m[0]==G.me,o=h?m[1]:m[0];let c='';if(x){const d=h?x[4]-x[5]:x[5]-x[4];c=d>0?'ok':d<0?'ko':''}return `<tr class="${w==G.week?'me':''}"><td>${w+1}</td><td>${h?'Casa':'Fuera'}</td><td><span class="tn">${crest(o,22)}${nm(o)}</span></td><td class="n ${c}"><b>${x?x[4]+' - '+x[5]:'—'}</b></td></tr>`}).join('');return `<div class="pn sx"><table><tr><th>J</th><th></th><th>Rival</th><th class="n">Resultado</th></tr>${rows}</table></div>`},
tab(){const l=S.lg,t=tab(l),n=t.length;return `<p class="seg"><button data-l="1" class="${l==1?'on':''}">${lgl(1,26)}<span>${LGN[1]}</span></button><button data-l="2" class="${l==2?'on':''}">${lgl(2,26)}<span>${LGN[2]}</span></button></p><div class="pn sx"><table><tr><th>#</th><th>Equipo</th><th class="n">PJ</th><th class="n">G</th><th class="n">E</th><th class="n">P</th><th class="n">GF</th><th class="n">GC</th><th class="n">DG</th><th class="n">Pts</th></tr>${t.map((x,i)=>`<tr class="${x.id==G.me?'me':''}"><td class="${l==1&&i==0?'z1':l==1&&i>=n-REL?'z3':l==2&&i<PRO?'z2':''}">${i+1}</td><td><span class="tn">${crest(x.id,22)}${x.n}</span></td><td class="n">${x.pj}</td><td class="n">${x.w}</td><td class="n">${x.d}</td><td class="n">${x.l}</td><td class="n">${x.gf}</td><td class="n">${x.gc}</td><td class="n">${x.gf-x.gc}</td><td class="n"><b>${x.pts}</b></td></tr>`).join('')}</table></div><p class="sm mu">${l==1?'Dorado: campeón · Rojo: descienden '+REL:'Verde: ascienden '+PRO+' · No hay descensos'}</p>`},
sq(){return sqv()},
obj(){return `<div class="pn"><h3>Objetivos de la directiva · Temporada ${G.season}</h3>${G.obj.map(o=>`<div style="margin:12px 0"><div style="display:flex;justify-content:space-between"><span>${objTxt(o)}</span><b class="${objOk(o)?'ok':'mu'}">${o.t=='pos'?myPos()+'º':objVal(o)+' / '+o.v}</b></div></div>`).join('')}<p class="sm mu">Cumplir 2 o más objetivos sube la confianza; si llega a 0% te despiden.</p></div><div class="pn"><h3>Reglas de las ligas</h3><p class="sm">${LGN[1]}: gana 1 campeón y descienden ${REL}.<br>${LGN[2]}: ascienden ${PRO}, sin descensos.</p></div>`}};
function bind(){document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{S.lg=+b.dataset.l;render()});if(S.tab=='sq')sqBind()}
function sqv(){const t=G.T[G.me];xi(t);const sp=slots(t.form),inb=new Set(t.bn),inx=new Set(t.lu),ln=p=>p.n.split(' ').slice(1).join(' ')||p.n;
 const fb=p=>{const f=p.fa|0;return `<i class="fb" title="Cansancio ${f}%"><u class="${f>66?'hi':f>33?'md':'lo'}" style="width:${Math.max(6,f)}%"></u></i>`};
 const card=i=>{const p=t.pl[t.lu[i]];return `<div class="sl${S.pk=='x:'+i?' pk':''}${p.pos!=sp[i]?' oop':''}" draggable="true" data-l="x:${i}"><span class="ov">${Math.round(ef(p))}</span><b>${ln(p)}</b>${fb(p)}</div>`};
 const row=(i,l)=>{const p=t.pl[i];return `<div class="pr${S.pk==l?' pk':''}" draggable="true" data-l="${l}"><span class="ps ${p.pos}">${PN[p.pos]}</span><span class="pnm">${p.n}</span><span class="mu sm">${p.age}a</span><b>${Math.round(ef(p))}</b>${fb(p)}</div>`};
 const rs=t.pl.map((p,i)=>i).filter(i=>!inx.has(i)&&!inb.has(i)).sort((a,b)=>'PDMF'.indexOf(t.pl[a].pos)-'PDMF'.indexOf(t.pl[b].pos)||t.pl[b].ovr-t.pl[a].ovr);
 return `<div class="pn sqh"><label>Formación <select id="fm">${Object.keys(FORM).map(f=>`<option ${f==t.form?'selected':''}>${f}</option>`).join('')}</select></label><button id="au" class="${t.man?'':'p'}">Auto</button><span class="mu sm">Media del once <b>${Math.round(str(t).o)}</b> · Arrastra o toca dos jugadores para intercambiarlos · Barra = cansancio (verde fresco, rojo agotado): los cansados rinden menos · Rojo = fuera de posición</span></div>
<div class="g2 sq"><div class="pn pit">${['F','M','D','P'].map(c=>`<div class="rw">${sp.map((s,i)=>s==c?card(i):'').join('')}</div>`).join('')}</div><div><div class="pn zn" data-z="b"><h3>Banquillo <small>${t.bn.length}/7</small></h3>${t.bn.map((i,j)=>row(i,'b:'+j)).join('')||'<p class="mu sm">Arrastra aquí jugadores</p>'}</div><div class="pn zn" data-z="r"><h3>Reservas</h3>${rs.map(i=>row(i,'r:'+i)).join('')}</div></div></div>`}
const gl=(t,l)=>{const [k,v]=l.split(':'),n=+v;return k=='x'?t.lu[n]:k=='b'?t.bn[n]:n},sl=(t,l,val)=>{const [k,v]=l.split(':'),n=+v;if(k=='x')t.lu[n]=val;else if(k=='b')t.bn[n]=val};
function mv(a,b){const t=G.T[G.me];if(!a||!b||a==b)return;const va=gl(t,a),vb=gl(t,b);sl(t,a,vb);sl(t,b,va);t.man=true;save()}
function zone(a,z){const t=G.T[G.me],[k,v]=a.split(':'),n=+v;if(z=='b'&&k=='r'&&t.bn.length<7)t.bn.push(n);else if(z=='r'&&k=='b')t.bn.splice(n,1);else return;t.man=true;save()}
function sqBind(){document.querySelectorAll('[data-l^="x:"],[data-l^="b:"],[data-l^="r:"]').forEach(e=>{const l=e.dataset.l;
 e.onclick=()=>{if(S.pk&&S.pk!=l){mv(S.pk,l);S.pk=null}else S.pk=S.pk==l?null:l;render()};
 e.ondragstart=ev=>{ev.dataTransfer.setData('text/plain',l);S.pk=null};e.ondragover=ev=>ev.preventDefault();
 e.ondrop=ev=>{ev.preventDefault();ev.stopPropagation();mv(ev.dataTransfer.getData('text/plain'),l);render()}});
 document.querySelectorAll('[data-z]').forEach(e=>{e.ondragover=ev=>ev.preventDefault();e.ondrop=ev=>{ev.preventDefault();zone(ev.dataTransfer.getData('text/plain'),e.dataset.z);render()};e.onclick=ev=>{if(ev.target==e&&S.pk){zone(S.pk,e.dataset.z);S.pk=null;render()}}});
 $('#fm').onchange=()=>{const t=G.T[G.me];t.form=$('#fm').value;auto(t);save();render()};
 $('#au').onclick=()=>{const t=G.T[G.me];t.man=false;auto(t);S.pk=null;save();render()}}
function modal(h){$('#mdc').innerHTML=h+'<p style="margin:16px 0 0"><button class="p" id="ok">Continuar</button></p>';$('#md').style.display='flex';$('#ok').onclick=()=>{$('#md').style.display='none';if(G.pend){G.pend=0;save()}}}
function season(){const s=G.sum;modal(`<h2>Fin de temporada ${s.season}</h2><p>Campeón de ${LGN[1]}: <b>${s.champ}</b></p><p>Tu equipo terminó <b>${s.pos}º</b> en ${LGN[s.lg]} y cumplió <b>${s.met}/${s.tot}</b> objetivos.</p><p class="sm">Ascienden: ${s.pro.join(', ')}<br>Descienden: ${s.rel.join(', ')}</p>${s.sc?`<p class="sm">Pichichi de tu liga: ${s.sc[0]} (${s.sc[1]}), ${s.sc[2]} goles</p>`:''}${s.fired?'<p class="ko"><b>La directiva te ha despedido.</b> Empieza una nueva partida.</p>':'<p class="sm mu">Los jugadores han envejecido un año y la nueva temporada está lista.</p>'}`);
 if(s.fired)$('#ok').onclick=()=>{try{localStorage.removeItem(KEY)}catch(e){}location.reload()}}
$('#bs').onclick=()=>{const m=simWeek(),fin=()=>{render();if(G.pend)season()};if(m)liveMatch(m,fin);else fin()};
$('#b5').onclick=()=>{for(let i=0;i<5;i++){simWeek();if(G.pend)break}render();if(G.pend)season()};
renderStart();
