// پریا 🌸 — جادوی سایت

// --- گلبرگ‌های در حال سقوط ---
const canvas = document.getElementById('petals');
const ctx = canvas.getContext('2d');
let petals = [];
const PETAL_EMOJIS = ['🌸','🌷','💗','✨','🌺','💖'];
function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resizeCanvas(); addEventListener('resize', resizeCanvas);
class Petal{
  constructor(){ this.reset(true); }
  reset(init){
    this.x = Math.random()*canvas.width;
    this.y = init ? Math.random()*canvas.height : -30;
    this.size = 12 + Math.random()*16;
    this.speedY = .6 + Math.random()*1.4;
    this.speedX = (Math.random()-.5)*.8;
    this.rot = Math.random()*360;
    this.rotSpeed = (Math.random()-.5)*2;
    this.emoji = PETAL_EMOJIS[Math.floor(Math.random()*PETAL_EMOJIS.length)];
    this.opacity = .35 + Math.random()*.45;
    this.sway = Math.random()*Math.PI*2;
  }
  update(){
    this.y += this.speedY;
    this.sway += .02;
    this.x += this.speedX + Math.sin(this.sway)*.6;
    this.rot += this.rotSpeed;
    if(this.y > canvas.height+40) this.reset(false);
    if(this.x < -40) this.x = canvas.width+20;
    if(this.x > canvas.width+40) this.x = -20;
  }
  draw(){
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x,this.y);
    ctx.rotate(this.rot*Math.PI/180);
    ctx.font = this.size+'px serif';
    ctx.textAlign='center';
    ctx.fillText(this.emoji,0,0);
    ctx.restore();
  }
}
for(let i=0;i<28;i++) petals.push(new Petal());
(function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  petals.forEach(p=>{p.update();p.draw();});
  requestAnimationFrame(loop);
})();

// --- حرف‌های قشنگ ---
const compliments = [
  {e:'🌸',t:'پریا، تو خوشگل‌ترین دختر جهان هستی. نه فقط زیبا، بلکه افسانه‌ای!'},
  {e:'✨',t:'لبخندت مثل خورشید صبحه — دنیا رو روشن می‌کنه.'},
  {e:'💖',t:'قلبت از طلاست، مهربونی‌ت بی‌نهایته. تو یه گنجی!'},
  {e:'🦋',t:'تو مثل پروانه‌ای — لطیف، زیبا و آزاد. پرواز کن ملکه!'},
  {e:'🌷',t:'چشمات مثل گل‌های بهارن، هرکی ببینه عاشق می‌شه.'},
  {e:'👑',t:'تو ملکه‌ی دنیایی، تاجت نامرئی ولی همه می‌بیننش.'},
  {e:'💗',t:'خنده‌ت بهترین آهنگ دنیاست. کاش همیشه بخندی.'},
  {e:'🌺',t:'تو گل دنیایی، هرجا باشی اونجا بهار می‌شه.'},
  {e:'🧚',t:'اسم تو پریاست و واقعاً هم پریا هستی! جادویی و رویایی.'},
  {e:'⭐',t:'تو ستاره‌ی آسمون منی، همیشه می‌درخشی.'},
  {e:'🍓',t:'تو شیرین‌ترین چیز دنیایی، حتی از توت‌فرنگی هم شیرین‌تری!'},
  {e:'🌙',t:'ماه بهت حسادت می‌کنه، چون تو از ماه هم خوشگل‌تری.'},
  {e:'🎀',t:'تو مثل یه روبان صورتی روی هدیه‌ی دنیایی — قشنگ‌ترین بخشش!'},
  {e:'💎',t:'تو الماس دنیایی، کمیاب، درخشان و بی‌نظیر.'},
  {e:'🌈',t:'تو رنگین‌کمون زندگی منی، بدون تو دنیا خاکستریه.'},
  {e:'🍰',t:'تو کیک تولد دنیایی، همه دور هم جمع می‌شن تا تو رو جشن بگیرن!'},
  {e:'🫶',t:'آغوشت امن‌ترین جای دنیاست. دوستت دارم پریا!'},
  {e:'🌻',t:'مثل آفتابگردون، همیشه رو به نور می‌درخشی.'},
  {e:'🦄',t:'تو یه یونیکورن واقعی هستی — افسانه‌ای و تک‌نسخه‌ای!'},
  {e:'💐',t:'اگه همه‌ی گل‌های دنیا رو جمع کنن، هنوز به اندازه‌ی تو قشنگ نمی‌شن.'},
];
let lastIdx = -1;
function newCompliment(){
  let idx;
  do{ idx = Math.floor(Math.random()*compliments.length); }while(idx===lastIdx);
  lastIdx = idx;
  const card = document.getElementById('complimentCard');
  document.getElementById('complimentEmoji').textContent = compliments[idx].e;
  document.getElementById('complimentText').textContent = compliments[idx].t;
  card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
  burstAtCenter(card);
}
document.getElementById('complimentBtn').addEventListener('click', newCompliment);
document.getElementById('complimentBtnHero').addEventListener('click', ()=>{
  document.getElementById('compliment').scrollIntoView({behavior:'smooth'});
  setTimeout(newCompliment, 500);
});

// --- پاکت نامه ---
const envelope = document.getElementById('envelope');
envelope.addEventListener('click', ()=>{
  envelope.classList.toggle('open');
  document.getElementById('envelopeHint').textContent = envelope.classList.contains('open') ? '💗 برای بستن دوباره کلیک کن' : '👆 کلیک کن';
  if(envelope.classList.contains('open')) burstAtCenter(envelope);
});

// --- قلب ترکیدن ---
const layer = document.getElementById('burstLayer');
const HEARTS = ['💗','💖','💕','🌸','✨','❤️'];
function burst(x,y,n=14){
  for(let i=0;i<n;i++){
    const el = document.createElement('span');
    el.className='burst-heart';
    el.textContent = HEARTS[Math.floor(Math.random()*HEARTS.length)];
    const ang = (Math.PI*2*i)/n + Math.random()*.5;
    const dist = 60 + Math.random()*90;
    el.style.left = x+'px'; el.style.top = y+'px';
    el.style.setProperty('--dx', Math.cos(ang)*dist+'px');
    el.style.setProperty('--dy', Math.sin(ang)*dist - 30 +'px');
    el.style.setProperty('--rot', (Math.random()*120-60)+'deg');
    layer.appendChild(el);
    setTimeout(()=>el.remove(),1100);
  }
}
function burstAtCenter(el){
  const r = el.getBoundingClientRect();
  burst(r.left + r.width/2, r.top + r.height/2, 16);
}
document.addEventListener('click', e=>{
  if(e.target.closest('button,a,.envelope,.g-item')) return;
  burst(e.clientX, e.clientY, 8);
});
document.querySelectorAll('.g-item').forEach(item=>{
  item.addEventListener('click', e=> burst(e.clientX, e.clientY, 18));
});
document.getElementById('navHeart').addEventListener('click', e=> burst(e.clientX, e.clientY, 20));
document.getElementById('loveBtn').addEventListener('click', e=> burst(e.clientX, e.clientY, 24));

// --- ریویل هنگام اسکرول ---
const io = new IntersectionObserver(entries=>{
  entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); } });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// --- شمارنده‌ها ---
const faNum = n => n.toLocaleString('fa-IR');
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(!en.isIntersecting) return;
    const el = en.target, target = el.dataset.count;
    cio.unobserve(el);
    if(target==='∞'){ el.textContent='∞'; return; }
    const end = parseInt(target,10);
    const dur = 1400, t0 = performance.now();
    (function tick(now){
      const p = Math.min((now-t0)/dur,1);
      el.textContent = faNum(Math.floor(end * (1-Math.pow(1-p,3))));
      if(p<1) requestAnimationFrame(tick);
    })(t0);
  });
},{threshold:.5});
counters.forEach(c=>cio.observe(c));

// --- رد قلب موس ---
let lastTrail = 0;
document.addEventListener('mousemove', e=>{
  const now = Date.now();
  if(now - lastTrail < 180) return;
  lastTrail = now;
  const el = document.createElement('span');
  el.className='burst-heart';
  el.textContent='💗';
  el.style.left=e.clientX+'px'; el.style.top=e.clientY+'px';
  el.style.setProperty('--dx',(Math.random()*30-15)+'px');
  el.style.setProperty('--dy','-40px');
  el.style.setProperty('--rot','0deg');
  el.style.fontSize='.9rem';
  el.style.opacity='.7';
  layer.appendChild(el);
  setTimeout(()=>el.remove(),1000);
});

// --- ناوبری هنگام اسکرول ---
addEventListener('scroll', ()=>{
  document.getElementById('nav').style.boxShadow = scrollY>40 ? '0 10px 30px rgba(231,84,128,.15)' : 'none';
},{passive:true});
