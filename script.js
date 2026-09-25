const DATA=[
["kamboja","Kamboja","Far northwest — think beyond Gandhara.","The far northwestern region of the ancient subcontinent.","🧭",22,13],
["gandhara","Gandhara","Northwest — think Taxila.","The northwest, around the Taxila region.","🏛️",25,23],
["kuru","Kuru","Around the Delhi–Haryana region.","North-central India, around the upper Yamuna and Delhi-Haryana region.","👑",38,31],
["panchala","Panchala","East of Kuru.","East of Kuru in the upper Ganga-Yamuna region.","🌾",48,34],
["matsya","Matsya","Southwest of Surasena.","Around parts of present-day Rajasthan.","🐟",32,39],
["surasena","Surasena","Think Mathura.","Centered around Mathura and the Yamuna.","🏹",41,39],
["kosala","Kosala","North of the Ganga, east of Panchala.","Eastern Gangetic plain, associated with Shravasti and Ayodhya.","🦁",60,31],
["malla","Malla","Near the Himalayan foothills, east of Kosala.","Eastern Gangetic region near the Himalayan foothills.","⛰️",72,34],
["vajji","Vajji","Think Vaishali, north of the Ganga.","North Bihar region, associated with Vaishali.","🤝",66,37],
["kashi","Kashi","Think Varanasi.","Centered around Varanasi on the Ganga.","🪔",61,42],
["vatsa","Vatsa","Think Kaushambi, near the Yamuna.","Centered around Kaushambi in the lower Yamuna region.","🏺",51,47],
["chedi","Chedi","Central India, east of Avanti.","Central India around the Bundelkhand region.","⚔️",40,52],
["avanti","Avanti","Western/central India — think Ujjayini.","Western/central India, associated with Ujjayini.","🐘",31,52],
["magadha","Magadha","South of the Ganga in eastern India.","South Bihar and the eastern Gangetic plain.","🏰",70,48],
["anga","Anga","Farther east of Magadha.","Farther east, around the Champa region.","🌊",79,47],
["asmaka","Asmaka","The southernmost — near the Godavari.","The southernmost traditional Mahajanapada, associated with the Godavari region.","🌴",45,61]
].map(x=>({id:x[0],name:x[1],clue:x[2],detail:x[3],emoji:x[4],x:x[5],y:x[6]}));

let score=0,streak=0,best=0,correct=0,index=0,order=[],memoryIndex=0;
const $=id=>document.getElementById(id);

function sound(ok=true){
  if(localStorage.getItem("mahajanapadaSound")==="off") return;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  const c=new AC(),o=c.createOscillator(),g=c.createGain();
  o.type="sine";o.frequency.value=ok?720:180;g.gain.setValueAtTime(.07,c.currentTime);
  g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.18);
  o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.18);
}
function particles(n=8){
  const box=$("particles");
  for(let i=0;i<n;i++){
    const p=document.createElement("i");p.className="particle";
    p.style.left=Math.random()*100+"%";p.style.top=(80+Math.random()*20)+"%";
    p.style.animationDuration=(3+Math.random()*4)+"s";
    box.appendChild(p);setTimeout(()=>p.remove(),8000);
  }
}
setInterval(()=>particles(2),1000);particles(10);

function toast(t){
  $("toast").textContent=t;$("toast").classList.add("show");
  setTimeout(()=>$("toast").classList.remove("show"),1400);
}
function scoreUI(){
  $("score").textContent=score;$("streak").textContent=streak;
  $("bestStreak").textContent=best;$("correct").textContent=correct;
}
function journey(mode){
  const n=["learn","remember","practice"].indexOf(mode);
  document.querySelectorAll(".journey-step").forEach((b,i)=>{
    b.classList.toggle("active",i===n);b.classList.toggle("done",i<n);
  });
  $("journeyFill").style.width=(n*50)+"%";
}
function setMode(mode){
  document.querySelectorAll(".journey-step").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===mode));
  journey(mode);
  if(mode==="practice" && !order.length) startPractice();
}
document.querySelectorAll(".journey-step").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));

function makeHotspots(containerId,handler){
  const box=$(containerId);
  box.querySelectorAll(".hotspot").forEach(x=>x.remove());
  DATA.forEach(d=>{
    const b=document.createElement("button");
    b.className="hotspot";b.dataset.id=d.id;b.style.left=d.x+"%";b.style.top=d.y+"%";
    b.setAttribute("aria-label",d.name);
    b.innerHTML=`<span class="pin-label">${d.name}</span>`;
    b.addEventListener("click",e=>{e.stopPropagation();handler(d,b)});
    box.appendChild(b);
  });
}
function learnClick(d,b){
  document.querySelectorAll("#learnMap .hotspot").forEach(x=>x.classList.remove("selected"));
  b.classList.add("selected","revealed");
  $("learnInfo").innerHTML=`<div class="big-icon">${d.emoji}</div><h3>${d.name}</h3><p>${d.detail}</p><p><b>🧠 Remember:</b> ${d.clue}</p>`;
  sound(true);toast("Memory unlocked!");
}
makeHotspots("learnMap",learnClick);

function renderMemory(){
  const d=DATA[memoryIndex];
  $("memoryProgress").textContent=`${memoryIndex+1} / ${DATA.length}`;
  $("memoryEmoji").textContent=d.emoji;$("memoryName").textContent=d.name;$("memoryClue").textContent=d.clue;
  $("memoryReveal").classList.remove("hidden");$("memoryNext").classList.add("hidden");
}
$("memoryReveal").addEventListener("click",()=>{
  const d=DATA[memoryIndex];setMode("learn");
  const b=document.querySelector(`#learnMap .hotspot[data-id="${d.id}"]`);
  learnClick(d,b);b.scrollIntoView({behavior:"smooth",block:"center"});
  $("memoryReveal").classList.add("hidden");$("memoryNext").classList.remove("hidden");
});
$("memoryNext").addEventListener("click",()=>{
  memoryIndex=(memoryIndex+1)%DATA.length;renderMemory();setMode("remember");
});

function startPractice(){
  order=[...DATA].sort(()=>Math.random()-.5);
  index=0;score=0;streak=0;best=0;correct=0;
  makeHotspots("practiceMap",answer);nextQuestion();scoreUI();
}
function nextQuestion(){
  document.querySelectorAll("#practiceMap .hotspot").forEach(b=>b.classList.remove("correct","wrong","selected"));
  if(index>=order.length){finish();return}
  const d=order[index];
  $("practicePrompt").innerHTML=`Find the territory for <strong>${d.name}</strong>.`;
  $("questionNo").textContent=`${index+1} / ${order.length}`;
  $("progressText").textContent=Math.round(index/order.length*100)+"%";
  $("practiceProgress").style.width=(index/order.length*100)+"%";
  $("feedback").textContent="Tap a glowing location to answer.";
}
function answer(d,b){
  const wanted=order[index];if(!wanted)return;
  if(d.id===wanted.id){
    b.classList.add("correct");
    score+=10;streak++;best=Math.max(best,streak);correct++;
    $("feedback").innerHTML=`✅ Correct! <span>${wanted.clue}</span>`;
    sound(true);toast(streak>=3?"🔥 Amazing streak!":"✨ Correct!");particles(10);scoreUI();
    index++;setTimeout(nextQuestion,700);
  }else{
    b.classList.add("wrong");
    score=Math.max(0,score-2);streak=0;
    $("feedback").innerHTML=`❌ Not quite. <span>Hint: ${wanted.clue}</span>`;
    sound(false);scoreUI();setTimeout(()=>b.classList.remove("wrong"),500);
  }
}
$("hintBtn").addEventListener("click",()=>{
  const d=order[index];if(!d)return;
  $("feedback").innerHTML=`💡 <b>Hint:</b> ${d.clue}`;toast("Hint shown");
});
$("restartBtn").addEventListener("click",startPractice);

function finish(){
  $("finalXP").textContent=score;$("finalStreak").textContent=best;
  $("finalMessage").textContent=`You answered ${correct} of ${DATA.length} locations correctly. Keep practicing to make the map stick in your memory!`;
  $("finishModal").classList.remove("hidden");particles(18);
}
$("playAgain").addEventListener("click",()=>{
  $("finishModal").classList.add("hidden");startPractice();
});

$("soundBtn").addEventListener("click",()=>{
  const off=localStorage.getItem("mahajanapadaSound")==="off";
  localStorage.setItem("mahajanapadaSound",off?"on":"off");
  $("soundBtn").textContent=off?"🔊 Sound":"🔇 Sound";
});
if(localStorage.getItem("mahajanapadaSound")==="off")$("soundBtn").textContent="🔇 Sound";

renderMemory();
startPractice();
