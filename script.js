const DATA = [
  {id:'kamboja', name:'Kamboja', x:16.3, y:11.3, icon:'🏔️', color:'#a9df36', region:'North-west frontier', capital:'Rajapura (traditionally associated)', modern:'Rajouri / north-western frontier area', type:'Republic / gana-sangha tradition', clue:'Think: Kamboja = the far north-west gateway.'},
  {id:'gandhara', name:'Gandhara', x:22.1, y:13.7, icon:'🏔️', color:'#2493df', region:'North-west, around the Indus', capital:'Taxila (Takshashila)', modern:'North-west Pakistan / adjoining Afghanistan', type:'Monarchy', clue:'Think: Gandhara → Taxila → far north-west.'},
  {id:'kuru', name:'Kuru', x:43.0, y:36.0, icon:'🛡️', color:'#8d88e8', region:'Haryana–Delhi region', capital:'Indraprastha / Hastinapura', modern:'Delhi, Haryana and nearby western Uttar Pradesh', type:'Republic / oligarchic tradition', clue:'Think: Kuru sits west of Panchala.'},
  {id:'panchala', name:'Panchala', x:51.7, y:39.7, icon:'📜', color:'#fff064', region:'Western Uttar Pradesh', capital:'Ahichchhatra and Kampilya', modern:'Western / central Uttar Pradesh', type:'Monarchy', clue:'Think: Panchala is just east of Kuru.'},
  {id:'matsya', name:'Matsya', x:38.4, y:45.5, icon:'🐟', color:'#f5c84c', region:'Rajasthan region', capital:'Viratanagara', modern:'Jaipur-region Rajasthan', type:'Monarchy', clue:'Think: Matsya = south-west of Kuru.'},
  {id:'surasena', name:'Surasena', x:54.8, y:47.4, icon:'🪷', color:'#ee55a8', region:'Mathura region', capital:'Mathura', modern:'Mathura / western Uttar Pradesh', type:'Monarchy', clue:'Think: Surasena → Mathura → Yamuna.'},
  {id:'kosala', name:'Kosala', x:61.5, y:41.7, icon:'🌾', color:'#f57b78', region:'Awadh / north-central Uttar Pradesh', capital:'Shravasti (and Ayodhya in tradition)', modern:'Awadh / eastern Uttar Pradesh', type:'Monarchy', clue:'Think: Kosala is north-east of the central cluster.'},
  {id:'vajji', name:'Vajji', x:68.7, y:41.0, icon:'⚖️', color:'#9fbd61', region:'North Bihar', capital:'Vaishali', modern:'North Bihar', type:'Republic / confederacy', clue:'Think: Vajji = Vaishali, north of the Ganga.'},
  {id:'vatsa', name:'Vatsa', x:57.9, y:44.8, icon:'🏺', color:'#43779c', region:'Prayaga / Kaushambi region', capital:'Kaushambi', modern:'Prayagraj area, Uttar Pradesh', type:'Monarchy', clue:'Think: Vatsa is around Kaushambi, east of Surasena.'},
  {id:'malla', name:'Malla', x:73.1, y:48.2, icon:'🏹', color:'#72cbf3', region:'Eastern Uttar Pradesh', capital:'Kushinara and Pava', modern:'Kushinagar / eastern Uttar Pradesh', type:'Republic', clue:'Think: Malla lies east of Kosala.'},
  {id:'kashi', name:'Kashi', x:67.2, y:51.9, icon:'🪔', color:'#fcb47a', region:'Varanasi region', capital:'Varanasi', modern:'Varanasi area, Uttar Pradesh', type:'Monarchy', clue:'Think: Kashi → Varanasi on the Ganga.'},
  {id:'magadha', name:'Magadha', x:80.3, y:57.2, icon:'👑', color:'#efb8ce', region:'South Bihar', capital:'Rajagriha; later Pataliputra', modern:'South Bihar around Gaya and Patna', type:'Monarchy', clue:'Think: Magadha is east of Kashi and south of the Ganga.'},
  {id:'anga', name:'Anga', x:88.0, y:56.5, icon:'🐘', color:'#73dc5d', region:'Eastern Bihar', capital:'Champa', modern:'Bhagalpur–Munger region, Bihar', type:'Monarchy', clue:'Think: Anga is the eastern neighbour of Magadha.'},
  {id:'chedi', name:'Chedi', x:57.7, y:58.2, icon:'⚔️', color:'#d4b3ec', region:'Bundelkhand region', capital:'Shuktimati (traditional)', modern:'Bundelkhand, around the UP–MP region', type:'Monarchy', clue:'Think: Chedi lies south of the Ganga plain.'},
  {id:'avanti', name:'Avanti', x:41.9, y:65.0, icon:'🏛️', color:'#91e293', region:'Malwa region', capital:'Ujjayini and Mahishmati', modern:'Malwa / Madhya Pradesh', type:'Monarchy', clue:'Think: Avanti = Ujjain / Malwa in the west.'},
  {id:'asmaka', name:'Asmaka', x:50.0, y:86.3, icon:'🌴', color:'#9de5fb', region:'Godavari region', capital:'Potali / Pratishthana (traditions vary)', modern:'Godavari basin in Maharashtra–Telangana area', type:'Monarchy / republic traditions vary by source', clue:'Think: Asmaka is the southernmost of the sixteen.'}
];

const byId = id => document.getElementById(id);
let soundOn = true, score = 0, streak = 0, current = 0, answered = false;

function say(text){
  if(!soundOn || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.rate=.94; u.pitch=1.02;
  speechSynthesis.speak(u);
}

function makePin(item, interactive=true, practice=false){
  const b=document.createElement('button');
  b.className='pin'+(practice?' practice-pin':'');
  b.style.left=item.x+'%'; b.style.top=item.y+'%';
  b.style.setProperty('--pin',item.color);
  b.title='Learn about '+item.name;
  b.setAttribute('aria-label','Learn about '+item.name);
  b.innerHTML='<span class="pin-dot"></span><span class="label">'+item.name+'</span>';
  if(interactive) b.onclick=e=>showLearn(item,e.currentTarget);
  return b;
}

function showLearn(item, button){
  const card=byId('learnCard');
  card.classList.remove('card-pop'); void card.offsetWidth; card.classList.add('card-pop');
  card.innerHTML=`
    <div class="info-top"><div class="big-emoji">${item.icon}</div><div><span class="mini-tag">MAHAJANAPADA</span><h2>${item.name}</h2></div></div>
    <p class="lead">${item.region}</p>
    <div class="info-grid">
      <div><span>🏛️ Capital</span><b>${item.capital}</b></div>
      <div><span>📍 Modern area</span><b>${item.modern}</b></div>
      <div><span>🏺 Government</span><b>${item.type}</b></div>
      <div><span>🧠 Memory clue</span><b>${item.clue}</b></div>
    </div>
    <div class="remember-strip">✨ <b>Remember:</b> ${item.name} → ${item.clue}</div>`;
  document.querySelectorAll('#pins .pin').forEach(p=>p.classList.remove('selected'));
  button.classList.add('selected');
  say(`${item.name}. ${item.region}. Capital: ${item.capital}. ${item.clue}`);
}

function renderLearn(){
  const layer=byId('pins'); layer.innerHTML='';
  DATA.forEach(x=>layer.appendChild(makePin(x,true,false)));
}
function renderMemory(){
  byId('memoryGrid').innerHTML=DATA.map((x,i)=>`<button class="memory-item" style="--delay:${i*.045}s" data-id="${x.id}"><b>${x.icon} ${x.name}</b><span>${x.region}</span></button>`).join('');
  document.querySelectorAll('.memory-item').forEach(btn=>btn.onclick=()=>{const item=DATA.find(x=>x.id===btn.dataset.id); showScreen(0); setTimeout(()=>{const pin=[...document.querySelectorAll('#pins .pin')].find(p=>p.title.includes(item.name)); if(pin) showLearn(item,pin)},80)});
}

function showScreen(n){
  document.querySelectorAll('.screen').forEach((s,i)=>s.classList.toggle('active',i===n));
  document.querySelectorAll('.step').forEach((s,i)=>s.classList.toggle('active',i===n));
  if(n===2) startQuestion();
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('.step').forEach(s=>s.onclick=()=>showScreen(+s.dataset.step));
byId('soundBtn').onclick=function(){soundOn=!soundOn;this.textContent=soundOn?'🔊 Sound':'🔇 Sound';this.classList.add('button-pop');setTimeout(()=>this.classList.remove('button-pop'),400);if(soundOn)say('Sound on');};
byId('toPractice').onclick=()=>showScreen(2);

function startQuestion(){
  answered=false; byId('next').disabled=true; byId('feedback').textContent=''; byId('feedback').className='feedback';
  const item=DATA[current%DATA.length];
  byId('question').innerHTML=`Find <strong>${item.name}</strong> on the map`;
  byId('questionHint').textContent=item.clue;
  const layer=byId('practicePins'); layer.innerHTML='';
  DATA.forEach(x=>{
    const p=makePin(x,false,true);
    p.onclick=e=>answer(x,e.currentTarget);
    layer.appendChild(p);
  });
}

function answer(x,button){
  if(answered)return;
  const target=DATA[current%DATA.length];
  if(x.id===target.id){
    answered=true; score+=10; streak++;
    byId('score').textContent=score; byId('streak').textContent=streak;
    byId('feedback').className='feedback success';
    byId('feedback').innerHTML=`🎉 Correct! <b>${target.name}</b> is here.<br><span>${target.clue}</span>`;
    button.classList.add('correct');
    byId('next').disabled=false; say('Correct! '+target.name);
  }else{
    streak=0; byId('streak').textContent=0;
    byId('feedback').className='feedback fail';
    byId('feedback').innerHTML=`🔎 Not this one. ${x.name} is the ${x.region}.<br><span>Hint: ${target.clue}</span>`;
    button.classList.add('wrong'); say('Try again');
  }
}
byId('next').onclick=()=>{current++;startQuestion();};
byId('hint').onclick=()=>{const t=DATA[current%DATA.length];byId('feedback').className='feedback hint';byId('feedback').innerHTML=`💡 <b>Hint:</b> ${t.clue}`;say(t.clue);};

// Button ripple / click animation for every interactive button.
document.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  b.classList.remove('button-pop'); void b.offsetWidth; b.classList.add('button-pop');
  setTimeout(()=>b.classList.remove('button-pop'),450);
});

renderLearn(); renderMemory();
