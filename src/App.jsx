import { useState, useEffect, useRef } from "react";

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&family=Pacifico&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}body{overflow-x:hidden}
    input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.25)}
    select option{background:#1a1a2e;color:#fff}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:4px}
    @keyframes floatOrb{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-40px) scale(1.08)}}
    @keyframes riseUp{0%{transform:translateY(0);opacity:0}10%{opacity:1}100%{transform:translateY(-105vh);opacity:.5}}
    @keyframes bounceIn{0%{opacity:0;transform:scale(.5) translateY(40px)}60%{transform:scale(1.15) translateY(-10px)}100%{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes sparkle{0%{opacity:.2;transform:scale(.8) rotate(0)}100%{opacity:1;transform:scale(1.4) rotate(22deg)}}
    @keyframes cakeBounce{0%,100%{transform:scale(1) rotate(-3deg)}50%{transform:scale(1.08) rotate(3deg)}}
    @keyframes emojiWobble{0%,100%{transform:rotate(-6deg) scale(1)}50%{transform:rotate(6deg) scale(1.18)}}
    @keyframes firework{0%{opacity:0;transform:scale(0)}20%{opacity:1;transform:scale(1)}80%{opacity:.5}100%{opacity:0;transform:scale(1.5)}}
    @keyframes ray{0%{height:0;opacity:0}20%{height:30px;opacity:1}100%{height:60px;opacity:0}}
    @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
    @keyframes popIn{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
    @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.05);opacity:.8}}
    @keyframes giftBounce{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-20px) rotate(-5deg)}75%{transform:translateY(-15px) rotate(5deg)}}
    @keyframes giftReveal{0%{transform:scale(0) rotate(-10deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}
    @keyframes viewAnim{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
    @keyframes musicWave{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.8)}}
  `}</style>
);

// ── THEMES (8) ──────────────────────────────────────────────────────
const THEMES = {
  gold:    {l:"👑 Royal Gold",   bg:"linear-gradient(135deg,#0F0C29,#302B63,#24243E)",a:"#FFD700",a2:"#FF9F43",p:["#FFD700","#FF6B6B","#FF9F43","#54A0FF","#C084FC","#FF3F81","#00D2D3"]},
  ocean:   {l:"🌊 Ocean Blue",   bg:"linear-gradient(135deg,#0c1f3f,#0a3d62,#1e3799)",a:"#00D2FF",a2:"#0099CC",p:["#00D2FF","#74b9ff","#0984e3","#a29bfe","#fd79a8","#55efc4","#fdcb6e"]},
  rose:    {l:"🌸 Rose Garden",  bg:"linear-gradient(135deg,#2d1b35,#6c2645,#3d1a4a)",a:"#FF6B9D",a2:"#FF9FC7",p:["#FF6B9D","#ffb3c6","#FF9FC7","#f9a8d4","#e879f9","#fbbf24","#34d399"]},
  emerald: {l:"🌿 Emerald",      bg:"linear-gradient(135deg,#0a1628,#1a3a2a,#0d2b1a)",a:"#00FF87",a2:"#00CC6A",p:["#00FF87","#00CC6A","#34d399","#6ee7b7","#fbbf24","#f472b6","#60a5fa"]},
  sunset:  {l:"🌅 Sunset",       bg:"linear-gradient(135deg,#1a0a1e,#6b1f3a,#c0392b)",a:"#FF6348",a2:"#FFDD59",p:["#FF6348","#FFDD59","#ff7f50","#ff4500","#ffa500","#ff69b4","#ff1493"]},
  neon:    {l:"⚡ Neon Cyber",   bg:"linear-gradient(135deg,#000000,#0a0a1a,#050510)",a:"#00FFFF",a2:"#FF00FF",p:["#00FFFF","#FF00FF","#00FF00","#FFFF00","#FF6600","#FF0066","#6600FF"]},
  galaxy:  {l:"🌌 Galaxy",       bg:"linear-gradient(135deg,#020007,#0d0221,#170b3b)",a:"#A78BFA",a2:"#F472B6",p:["#A78BFA","#F472B6","#60A5FA","#34D399","#FBBF24","#F87171","#C084FC"]},
  candy:   {l:"🍭 Candy Pop",    bg:"linear-gradient(135deg,#2d1b4e,#4a1942,#1a1040)",a:"#FF69B4",a2:"#FFD700",p:["#FF69B4","#FF1493","#FF6347","#FFD700","#00CED1","#7B68EE","#98FB98"]},
};

// ── LANGUAGES (5) ────────────────────────────────────────────────────
const LANGS = {
  en:{f:"🇺🇸",n:"English",  hb:"Happy Birthday",  td:"Today is YOUR day!",   from:"With love from",  turning:"Turning {age} Today!",  msgs:["May your day be as wonderful as you are!","Wishing you a lifetime of happiness!","Here's to another year of amazing adventures!","You deserve all the love in the world!","May every dream come true! 🌠","Sending the biggest virtual hug! 🤗"]},
  hi:{f:"🇮🇳",n:"हिंदी",    hb:"जन्मदिन मुबारक", td:"आज का दिन आपका है!",   from:"प्यार के साथ",  turning:"आज {age} साल!",          msgs:["आपका दिन सुंदर हो!","आजीवन खुश रहो!","नए साल की शुभ शुरुआत!","दुनिया का सारा प्यार आपका!","हर सपना सच हो! 🌠","सबसे बड़ी वर्चुअल गले लगाई! 🤗"]},
  gu:{f:"🇮🇳",n:"ગુજરાતી", hb:"જન્મ દિવસ મુબારક",td:"આજ તારો દિવસ!",        from:"પ્રેમ સહ",      turning:"આજ {age} વર્ષ!",          msgs:["તારો દિવસ સુંદર!","ખૂબ ખુશ રહો!","નવા સાહસ ભરેલ વર્ષ!","દુનિયાભર નો પ્રેમ!","સ્વપ્ન સાકાર!","સૌથી મોટો ભેટો! 🤗"]},
  es:{f:"🇪🇸",n:"Español",  hb:"¡Feliz Cumpleaños",td:"¡Hoy es TU día!",      from:"Con amor de",   turning:"¡{age} años hoy!",        msgs:["¡Que tu día sea maravilloso!","¡Una vida llena de felicidad!","¡Otro año de aventuras!","¡Mereces todo el amor!","¡Que tus sueños se realicen! 🌠","¡El abrazo virtual más grande! 🤗"]},
  fr:{f:"🇫🇷",n:"Français", hb:"Joyeux Anniversaire",td:"C'est TON jour!",    from:"Avec amour de", turning:"{age} ans aujourd'hui!",  msgs:["Que ta journée soit merveilleuse!","Une vie pleine de bonheur!","À une autre année d'aventures!","Tu mérites tout l'amour!","Que tes rêves se réalisent! 🌠","Le plus grand câlin virtuel! 🤗"]},
};

// ── CONFETTI STYLES ───────────────────────────────────────────────────
const C_STYLES = {
  classic: {l:"🎊 Classic"},
  hearts:  {l:"❤️ Hearts"},
  stars:   {l:"⭐ Stars"},
  money:   {l:"💰 Money"},
  balloons:{l:"🎈 Balloons"},
};

// ── UTILS ──────────────────────────────────────────────────────────────
const enc = o => { try{return btoa(unescape(encodeURIComponent(JSON.stringify(o))))}catch{return""} };
const dec = s => { try{return JSON.parse(decodeURIComponent(escape(atob(s))))}catch{return null} };

const compressImg = (file) => new Promise(res => {
  const c = document.createElement("canvas"); c.width = 80; c.height = 80;
  const ctx = c.getContext("2d"); const img = new Image();
  img.onload = () => { ctx.drawImage(img,0,0,80,80); res(c.toDataURL("image/jpeg",0.4)); };
  img.src = URL.createObjectURL(file);
});

const playBirthday = () => {
  try {
    const ac = new (window.AudioContext||window.webkitAudioContext)();
    const notes = [{f:392,d:.3},{f:392,d:.1},{f:440,d:.4},{f:392,d:.4},{f:523,d:.4},{f:494,d:.8},{f:392,d:.3},{f:392,d:.1},{f:440,d:.4},{f:392,d:.4},{f:587,d:.4},{f:523,d:.8},{f:392,d:.3},{f:392,d:.1},{f:784,d:.4},{f:659,d:.4},{f:523,d:.4},{f:494,d:.4},{f:440,d:.8},{f:698,d:.3},{f:698,d:.1},{f:659,d:.4},{f:523,d:.4},{f:587,d:.4},{f:523,d:.8}];
    let t = ac.currentTime + .1;
    notes.forEach(({f,d}) => {
      const o = ac.createOscillator(); const g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.frequency.value = f; o.type = "sine";
      g.gain.setValueAtTime(.3,t); g.gain.exponentialRampToValueAtTime(.001,t+d);
      o.start(t); o.stop(t+d); t += d;
    });
  } catch(e) {}
};

const timeGreeting = () => { const h = new Date().getHours(); return h<12?"Good morning ☀️":h<17?"Good afternoon 🌤":h<21?"Good evening 🌙":"Good night 🌟"; };

// ── CONFETTI HOOK ─────────────────────────────────────────────────────
function useConfetti(active, colors, style) {
  const cvs = useRef(null), anim = useRef(null), pts = useRef([]);
  useEffect(() => {
    if(!active) return;
    const c = cvs.current; if(!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const shapes = ["circle","rect","tri"];
    const spawn = (n=6) => { for(let i=0;i<n;i++) pts.current.push({x:Math.random()*c.width,y:-20,r:Math.random()*9+4,color:colors[Math.floor(Math.random()*colors.length)],shape:shapes[Math.floor(Math.random()*shapes.length)],vx:(Math.random()-.5)*5,vy:Math.random()*3+2,angle:Math.random()*Math.PI*2,spin:(Math.random()-.5)*.25,op:1}); };
    let frame=0;
    const loop = () => {
      ctx.clearRect(0,0,c.width,c.height);
      if(frame%10===0) spawn(); frame++;
      pts.current = pts.current.filter(p=>p.op>0.05).slice(-80);
      pts.current.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.angle+=p.spin; p.vy+=.07;
        if(p.y>c.height*.72) p.op-=.018;
        ctx.save(); ctx.globalAlpha=p.op; ctx.translate(p.x,p.y); ctx.rotate(p.angle); ctx.fillStyle=p.color;
        if(style==="hearts"||style==="balloons"||style==="money") {
          ctx.font=`${p.r*2}px serif`;
          ctx.fillText(style==="hearts"?"❤":style==="balloons"?"🎈":["💵","💴","💶","💷"][Math.floor(Math.random()*4)],0,0);
        } else if(style==="stars") {
          ctx.beginPath();
          for(let j=0;j<5;j++){ctx.lineTo(Math.cos((j*4/5-.5)*Math.PI)*p.r,Math.sin((j*4/5-.5)*Math.PI)*p.r);ctx.lineTo(Math.cos((j*4/5-.1)*Math.PI)*p.r*.4,Math.sin((j*4/5-.1)*Math.PI)*p.r*.4);}
          ctx.closePath();ctx.fill();
        } else {
          if(p.shape==="circle"){ctx.beginPath();ctx.arc(0,0,p.r,0,Math.PI*2);ctx.fill();}
          else if(p.shape==="rect"){ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r);}
          else{ctx.beginPath();ctx.moveTo(0,-p.r);ctx.lineTo(p.r,p.r);ctx.lineTo(-p.r,p.r);ctx.closePath();ctx.fill();}
        }
        ctx.restore();
      });
      anim.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(anim.current); window.removeEventListener("resize",resize); };
  },[active,colors,style]);
  return cvs;
}

// ── UI COMPONENTS ─────────────────────────────────────────────────────
const FloatingOrbs = ({a}) => {
  const orbs = Array.from({length:5},(_,i)=>({id:i,s:Math.random()*200+80,l:Math.random()*100,t:Math.random()*100,d:Math.random()*6,dur:Math.random()*8+10}));
  return(<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    {orbs.map(o=><div key={o.id} style={{position:"absolute",width:o.s,height:o.s,left:`${o.l}%`,top:`${o.t}%`,borderRadius:"50%",background:`radial-gradient(circle,${a}18 0%,${a}05 60%,transparent 80%)`,animation:`floatOrb ${o.dur}s ease-in-out ${o.d}s infinite alternate`}}/>)}
  </div>);
};

const Balloons = ({colors}) => (
  <div style={{position:"absolute",bottom:0,left:0,right:0,pointerEvents:"none"}}>
    {colors.slice(0,4).map((c,i)=>(
      <div key={i} style={{position:"absolute",left:`${8+i*18}%`,bottom:0,animation:`riseUp 3.5s ease-out ${i*.35}s forwards`}}>
        <div style={{width:44,height:54,background:`radial-gradient(circle at 35% 35%,${c}ee,${c}88)`,borderRadius:"50% 50% 50% 50%/60% 60% 40% 40%",position:"relative"}}>
          <div style={{position:"absolute",bottom:-2,left:"50%",transform:"translateX(-50%)",width:2,height:64,background:`${c}88`}}/>
        </div>
      </div>
    ))}
  </div>
);

const Fireworks = ({a}) => (
  <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
    {[15,50,85].map((x,i)=>(
      <div key={i} style={{position:"absolute",left:`${x}%`,top:"15%",animation:`firework 2.4s ease-out ${i*.5}s infinite`}}>
        {[0,60,120,180,240,300].map((deg,j)=>(
          <div key={j} style={{position:"absolute",width:3,height:30,background:`linear-gradient(${a},transparent)`,transformOrigin:"top center",transform:`rotate(${deg}deg)`,animation:`ray 2.4s ease-out ${i*.5}s infinite`,borderRadius:3}}/>
        ))}
      </div>
    ))}
  </div>
);

const SparkleText = ({children,a}) => (
  <span style={{position:"relative",display:"inline-block"}}>
    {children}
    {["✦","✧","✦"].map((s,i)=><span key={i} style={{position:"absolute",fontSize:14+i*4,top:i===1?"-20px":"-10px",left:i===0?"-20px":i===2?"calc(100% + 4px)":"50%",transform:i===1?"translateX(-50%)":"none",animation:`sparkle 1.6s ease-in-out ${i*.45}s infinite alternate`,color:a}}>{s}</span>)}
  </span>
);

const CakeIcon = ({a}) => (
  <svg width="80" height="80" viewBox="0 0 84 84" fill="none">
    <rect x="10" y="42" width="64" height="32" rx="7" fill={a} opacity=".85"/>
    <rect x="18" y="29" width="48" height="20" rx="6" fill="#FF9F43" opacity=".9"/>
    <rect x="25" y="20" width="34" height="16" rx="5" fill="#FFD700" opacity=".9"/>
    {[30,42,54].map((x,i)=><g key={i}><rect x={x-3} y="9" width="7" height="15" rx="3.5" fill={["#C084FC","#60A5FA","#F472B6"][i]}/><ellipse cx={x+.5} cy="8" rx="3.5" ry="6" fill="#FFD700" opacity=".9"><animate attributeName="ry" values="6;9;6" dur=".9s" repeatCount="indefinite"/></ellipse></g>)}
    <path d="M18 29 Q23 22 28 29 Q33 22 38 29 Q43 22 48 29 Q53 22 58 29 Q63 22 66 29" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
  </svg>
);

const Avatar = ({photo,name,a,size=80}) => photo ? (
  <div style={{width:size,height:size,borderRadius:"50%",overflow:"hidden",border:`3px solid ${a}`,boxShadow:`0 0 20px ${a}60`,margin:"0 auto 14px"}}>
    <img src={photo} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
  </div>
) : (
  <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${a},${a}66)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",border:`3px solid ${a}88`,boxShadow:`0 0 20px ${a}40`,fontSize:size*.38,fontWeight:900,color:"#1a1a2e",fontFamily:"'Playfair Display',serif"}}>
    {name?.[0]?.toUpperCase()||"🎂"}
  </div>
);

function Countdown({a}) {
  const [t,setT] = useState("");
  useEffect(()=>{
    const u = () => { const n=new Date(),m=new Date(n);m.setHours(24,0,0,0);const d=m-n;setT(`${String(Math.floor(d/3600000)).padStart(2,"0")}:${String(Math.floor((d%3600000)/60000)).padStart(2,"0")}:${String(Math.floor((d%60000)/1000)).padStart(2,"0")}`); };
    u(); const id=setInterval(u,1000); return()=>clearInterval(id);
  },[]);
  return(
    <div style={{background:"rgba(0,0,0,.3)",borderRadius:12,padding:"8px 18px",marginBottom:14,border:`1px solid ${a}40`,textAlign:"center"}}>
      <div style={{color:"rgba(255,255,255,.4)",fontSize:".68rem",letterSpacing:"2px",textTransform:"uppercase",marginBottom:3}}>🕛 Birthday ends in</div>
      <div style={{fontFamily:"monospace",fontSize:"1.5rem",color:a,fontWeight:700,letterSpacing:"4px"}}>{t}</div>
    </div>
  );
}

function ViewCounter({a,name}) {
  const [v,setV] = useState(0);
  useEffect(()=>{ const k=`bv_${name}`,n=parseInt(localStorage.getItem(k)||"0")+1;localStorage.setItem(k,n);setV(n); },[name]);
  return(
    <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.06)",borderRadius:100,padding:"5px 12px",marginBottom:10,border:`1px solid ${a}25`}}>
      <span>👁</span><span style={{color:"rgba(255,255,255,.5)",fontSize:".76rem"}}><span style={{color:a,fontWeight:700,animation:"viewAnim .5s ease"}}>{v}</span> views</span>
    </div>
  );
}

function GiftBox({a,onOpen}) {
  const [opened,setOpened] = useState(false);
  const [opening,setOpening] = useState(false);
  const open = () => { setOpening(true); setTimeout(()=>{ setOpened(true); onOpen?.(); },600); };
  if(opened) return(
    <div style={{animation:"giftReveal .6s ease",textAlign:"center",padding:"16px 0"}}>
      <div style={{fontSize:"2.5rem",marginBottom:8}}>🎉🎊✨💝✨🎊🎉</div>
      <p style={{color:"rgba(255,255,255,.8)",fontSize:".9rem"}}>May all your wishes come true! 🌟</p>
    </div>
  );
  return(
    <div style={{textAlign:"center",padding:"8px 0"}}>
      <div onClick={open} style={{cursor:"pointer",display:"inline-block",animation:opening?"none":"giftBounce 2s ease-in-out infinite",fontSize:"4rem",filter:`drop-shadow(0 0 16px ${a})`,transition:"transform .3s"}}>🎁</div>
      <p style={{color:"rgba(255,255,255,.45)",fontSize:".8rem",marginTop:8}}>Tap to open your gift!</p>
    </div>
  );
}

function EmojiReactions({a}) {
  const [r,setR] = useState({}); const [pop,setPop] = useState(null);
  const [total] = useState(Math.floor(Math.random()*60)+15);
  const emojis = ["🎉","❤️","🎂","🥳","🌟","🙏","😍","🎁","🔥","💯","😭","🫶"];
  const add = e => { setR(p=>({...p,[e]:(p[e]||0)+1})); setPop(e); setTimeout(()=>setPop(null),500); };
  return(<div style={{marginTop:20}}>
    <p style={{color:"rgba(255,255,255,.35)",fontSize:".72rem",marginBottom:10,textTransform:"uppercase",letterSpacing:"1.5px"}}>Tap to react · {total + Object.values(r).reduce((s,v)=>s+v,0)} reactions</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center"}}>
      {emojis.map(e=>(
        <button key={e} onClick={()=>add(e)} style={{background:pop===e?`${a}44`:"rgba(255,255,255,.07)",border:`1px solid ${pop===e?a:"rgba(255,255,255,.12)"}`,borderRadius:100,padding:"7px 11px",cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:4,transform:pop===e?"scale(1.25)":"scale(1)"}}>
          <span style={{fontSize:"1.2rem"}}>{e}</span>
          {r[e]>0&&<span style={{color:"rgba(255,255,255,.85)",fontSize:".8rem",fontWeight:600}}>{r[e]}</span>}
        </button>
      ))}
    </div>
  </div>);
}

function WishBoard({name,a,lang="en"}) {
  const L = LANGS[lang]||LANGS.en;
  const [wishes,setWishes] = useState([
    {n:"A Friend",m:"May all your dreams come true! 🌟",t:"2m ago"},
    {n:"Family",m:"We love you so much! 🎂",t:"5m ago"},
  ]);
  const [wn,setWn]=useState(""); const [wm,setWm]=useState(""); const [sent,setSent]=useState(false);
  const submit = () => {
    if(!wn.trim()||!wm.trim()) return;
    setWishes(p=>[{n:wn.trim(),m:wm.trim(),t:"Just now"},...p]);
    setWn(""); setWm(""); setSent(true); setTimeout(()=>setSent(false),2000);
  };
  const inp = {width:"100%",padding:"11px 14px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,color:"#fff",fontSize:".9rem",fontFamily:"'DM Sans',sans-serif",outline:"none"};
  return(<div style={{width:"100%",maxWidth:500,margin:"0 auto"}}>
    <h3 style={{fontFamily:"'Playfair Display',serif",color:"#fff",fontSize:"1.05rem",marginBottom:14,textAlign:"center"}}>💌 Leave a wish for {name}</h3>
    <div style={{background:"rgba(255,255,255,.05)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,padding:16,marginBottom:12}}>
      <input value={wn} onChange={e=>setWn(e.target.value)} placeholder="Your name" style={{...inp,marginBottom:9}}/>
      <textarea value={wm} onChange={e=>setWm(e.target.value)} placeholder="Write your birthday wish..." rows={3} style={{...inp,resize:"none",lineHeight:1.5,marginBottom:11}}/>
      <button onClick={submit} style={{width:"100%",padding:"12px",background:sent?"linear-gradient(135deg,#34D399,#059669)":`linear-gradient(135deg,${a},${a}99)`,border:"none",borderRadius:10,color:"#1a1a2e",fontSize:".9rem",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .3s"}}>
        {sent?"✅ Wish Sent!":"Send Wish 💝"}
      </button>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:9,maxHeight:260,overflowY:"auto"}}>
      {wishes.map((w,i)=>(
        <div key={i} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:"12px 14px",animation:"slideUp .4s ease both"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
            <span style={{color:a,fontWeight:600,fontSize:".88rem"}}>✨ {w.n}</span>
            <span style={{color:"rgba(255,255,255,.3)",fontSize:".72rem"}}>{w.t}</span>
          </div>
          <p style={{color:"rgba(255,255,255,.8)",fontSize:".88rem",lineHeight:1.5}}>{w.m}</p>
        </div>
      ))}
    </div>
  </div>);
}

function QRCode({url,a}) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&bgcolor=0d0d1a&color=${a.replace("#","")}`;
  return(<div style={{textAlign:"center",marginTop:14}}>
    <p style={{color:"rgba(255,255,255,.35)",fontSize:".7rem",marginBottom:7,letterSpacing:"1px",textTransform:"uppercase"}}>Scan QR Code</p>
    <div style={{background:"rgba(255,255,255,.06)",borderRadius:12,padding:9,display:"inline-block",border:`1px solid ${a}30`}}>
      <img src={qr} alt="QR" width={110} height={110} style={{borderRadius:6,display:"block"}}/>
    </div>
  </div>);
}

// ── SETUP PAGE ────────────────────────────────────────────────────────
function SetupPage({onGenerate}) {
  const [f,setF] = useState({name:"",sender:"",message:"",age:"",theme:"gold",lang:"en",confetti:"classic",photo:null,bdDate:""});
  const [foc,setFoc] = useState("");
  const [prev,setPrev] = useState(null);
  const T = THEMES[f.theme];
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const handlePhoto = async e => {
    const file = e.target.files?.[0]; if(!file) return;
    const c = await compressImg(file); setPrev(c); set("photo",c);
  };

  const handleDate = e => {
    const d = e.target.value; set("bdDate",d);
    if(d) { const n=new Date(),b=new Date(d); let age=n.getFullYear()-b.getFullYear(); if(n.getMonth()-b.getMonth()<0||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate())) age--; if(age>0&&age<130) set("age",String(age)); }
  };

  const inp = k => ({width:"100%",padding:"12px 15px",background:"rgba(255,255,255,.07)",border:`1.5px solid ${foc===k?T.a:"rgba(255,255,255,.12)"}`,borderRadius:11,color:"#fff",fontSize:".95rem",fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border .2s",marginBottom:11});
  const lbl = {display:"block",color:"rgba(255,255,255,.45)",fontSize:".7rem",fontWeight:500,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:5};

  const templates = [
    "🎂 Warmest wishes on your special day!",
    "🌟 You make the world brighter just by being in it!",
    "🎉 May this year bring everything you've ever dreamed of!",
    "💛 Grateful every day to know someone as amazing as you!",
    "🌈 Another year older, wiser, and more wonderful!",
  ];

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:T.bg,fontFamily:"'DM Sans',sans-serif",padding:"28px 16px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:500}}>

        {/* Language Bar */}
        <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:18,flexWrap:"wrap"}}>
          {Object.entries(LANGS).map(([k,l])=>(
            <button key={k} onClick={()=>set("lang",k)} style={{padding:"5px 9px",borderRadius:100,border:`1px solid ${f.lang===k?T.a:"rgba(255,255,255,.2)"}`,background:f.lang===k?`${T.a}22`:"rgba(255,255,255,.05)",color:"#fff",cursor:"pointer",fontSize:".78rem",fontFamily:"'DM Sans',sans-serif"}}>
              {l.f} {l.n}
            </button>
          ))}
        </div>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{marginBottom:12,animation:"bounceIn .8s both"}}><CakeIcon a={T.a}/></div>
          <h1 style={{fontFamily:"'Pacifico',cursive",fontSize:"clamp(1.8rem,6vw,2.6rem)",color:"#fff",lineHeight:1.2,marginBottom:5}}>
            Birthday <span style={{background:`linear-gradient(135deg,${T.a},${T.a2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Surprise!</span>
          </h1>
          <p style={{color:"rgba(255,255,255,.35)",fontSize:".85rem"}}>Create a magical experience — music, themes, reactions & more!</p>
        </div>

        {/* Form */}
        <div style={{background:"rgba(255,255,255,.06)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.1)",borderRadius:22,padding:"22px 18px",boxShadow:"0 24px 64px rgba(0,0,0,.4)"}}>

          {/* Photo */}
          <label style={lbl}>📸 Photo (optional)</label>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}>
            <div style={{width:46,height:46,borderRadius:"50%",overflow:"hidden",border:`2px solid ${prev?T.a:"rgba(255,255,255,.2)"}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.07)"}}>
              {prev?<img src={prev} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:"1.3rem"}}>📸</span>}
            </div>
            <label style={{flex:1,padding:"9px 12px",background:"rgba(255,255,255,.07)",border:"1.5px dashed rgba(255,255,255,.25)",borderRadius:10,cursor:"pointer",color:"rgba(255,255,255,.55)",fontSize:".82rem",textAlign:"center"}}>
              {prev?"✅ Photo added! Click to change":"Tap to upload photo"}
              <input type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
            </label>
          </div>

          <label style={lbl}>🎂 Birthday Person's Name *</label>
          <input value={f.name} onChange={e=>set("name",e.target.value)} onFocus={()=>setFoc("name")} onBlur={()=>setFoc("")} onKeyDown={e=>e.key==="Enter"&&f.name.trim()&&onGenerate(f)} placeholder="e.g. Priya, Rahul, Alex..." style={inp("name")}/>

          <label style={lbl}>👤 Your Name (From)</label>
          <input value={f.sender} onChange={e=>set("sender",e.target.value)} onFocus={()=>setFoc("sender")} onBlur={()=>setFoc("")} placeholder="e.g. Mom, Best Friend, Team..." style={inp("sender")}/>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            <div>
              <label style={lbl}>📅 Birthday Date</label>
              <input type="date" value={f.bdDate} onChange={handleDate} onFocus={()=>setFoc("date")} onBlur={()=>setFoc("")} style={{...inp("date"),marginBottom:0,colorScheme:"dark"}}/>
            </div>
            <div>
              <label style={lbl}>🔢 Age</label>
              <input value={f.age} onChange={e=>set("age",e.target.value.replace(/\D/,""))} onFocus={()=>setFoc("age")} onBlur={()=>setFoc("")} placeholder="Auto or manual" maxLength={3} style={{...inp("age"),marginBottom:0}}/>
            </div>
          </div>
          <div style={{height:11}}/>

          <label style={lbl}>💬 Message Template</label>
          <select value="" onChange={e=>{ if(e.target.value){set("message",e.target.value);} }} style={{...inp("tpl"),background:"rgba(0,0,0,.4)",cursor:"pointer",marginBottom:11}}>
            <option value="">Pick a template...</option>
            {templates.map((t,i)=><option key={i} value={t}>{t}</option>)}
          </select>

          <label style={lbl}>✍️ Personal Message</label>
          <textarea value={f.message} onChange={e=>set("message",e.target.value)} onFocus={()=>setFoc("msg")} onBlur={()=>setFoc("")} placeholder="Write something from the heart..." rows={3} style={{...inp("msg"),resize:"none",lineHeight:1.5,marginBottom:18}}/>

          {/* Theme */}
          <label style={lbl}>🎨 Theme</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {Object.entries(THEMES).map(([k,t])=>(
              <button key={k} onClick={()=>set("theme",k)} style={{padding:"7px 11px",borderRadius:100,cursor:"pointer",background:f.theme===k?`linear-gradient(135deg,${t.a},${t.a2})`:"rgba(255,255,255,.07)",border:`1.5px solid ${f.theme===k?t.a:"rgba(255,255,255,.14)"}`,color:f.theme===k?"#1a1a2e":"rgba(255,255,255,.7)",fontSize:".78rem",fontWeight:f.theme===k?700:400,transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>
                {t.l}
              </button>
            ))}
          </div>

          {/* Confetti */}
          <label style={lbl}>🎊 Confetti Style</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:20}}>
            {Object.entries(C_STYLES).map(([k,s])=>(
              <button key={k} onClick={()=>set("confetti",k)} style={{padding:"7px 11px",borderRadius:100,cursor:"pointer",background:f.confetti===k?`linear-gradient(135deg,${T.a},${T.a2})`:"rgba(255,255,255,.07)",border:`1.5px solid ${f.confetti===k?T.a:"rgba(255,255,255,.14)"}`,color:f.confetti===k?"#1a1a2e":"rgba(255,255,255,.7)",fontSize:".78rem",fontWeight:f.confetti===k?700:400,transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>
                {s.l}
              </button>
            ))}
          </div>

          <button onClick={()=>f.name.trim()&&onGenerate(f)} disabled={!f.name.trim()} style={{width:"100%",padding:"15px",background:f.name.trim()?`linear-gradient(135deg,${T.a},${T.a2})`:"rgba(255,255,255,.1)",border:"none",borderRadius:13,color:f.name.trim()?"#1a1a2e":"rgba(255,255,255,.3)",fontSize:"1rem",fontWeight:700,cursor:f.name.trim()?"pointer":"not-allowed",fontFamily:"'DM Sans',sans-serif",transition:"all .25s",boxShadow:f.name.trim()?`0 8px 28px ${T.a}40`:"none"}}>
            ✨ Generate Magic Surprise Link
          </button>
        </div>
        <p style={{color:"rgba(255,255,255,.14)",fontSize:".72rem",marginTop:14,textAlign:"center"}}>Free · No signup · 8 themes · 5 languages · Birthday music 🎵</p>
      </div>
    </div>
  );
}

// ── SHARE PAGE ────────────────────────────────────────────────────────
function SharePage({data,link,onBack}) {
  const T = THEMES[data.theme]||THEMES.gold;
  const [copied,setCopied] = useState(false);
  const [showQR,setShowQR] = useState(false);

  const copy = () => navigator.clipboard.writeText(link).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500); });
  const wa = () => window.open(`https://wa.me/?text=${encodeURIComponent(`🎂 Happy Birthday ${data.name}! Your special surprise → ${link}`)}`,"_blank");
  const tg = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`🎂 Happy Birthday ${data.name}!`)}`,"_blank");
  const tw = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🎂 Happy Birthday ${data.name}! 🎉 ${link}`)}`,"_blank");
  const em = () => window.open(`mailto:?subject=${encodeURIComponent(`Happy Birthday ${data.name}! 🎂`)}&body=${encodeURIComponent(`Hey ${data.name}!\n\nI made this special birthday surprise for you:\n${link}\n\nEnjoy your day! 🎉`)}`);
  const sm = () => window.open(`sms:?body=${encodeURIComponent(`🎂 Happy Birthday ${data.name}! Your surprise: ${link}`)}`);
  const fb = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,"_blank");

  const sb = (bg,txt) => ({padding:"11px 6px",background:bg,border:"none",borderRadius:11,color:txt||"#fff",fontSize:".8rem",fontWeight:700,cursor:"pointer",transition:"all .3s",fontFamily:"'DM Sans',sans-serif"});

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:T.bg,fontFamily:"'DM Sans',sans-serif",padding:"28px 16px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:480,textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:12,animation:"popIn .6s both"}}>🎊</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.4rem,5vw,2rem)",fontWeight:900,color:"#fff",marginBottom:5}}>
          Link Ready for <span style={{color:T.a,fontStyle:"italic"}}>{data.name}!</span>
        </h2>
        <p style={{color:"rgba(255,255,255,.35)",marginBottom:18,fontWeight:300,fontSize:".9rem"}}>Share via any platform below ✨</p>

        {/* Preview */}
        <div style={{background:"rgba(255,255,255,.06)",backdropFilter:"blur(20px)",border:`1px solid ${T.a}30`,borderRadius:18,padding:"14px 18px",marginBottom:12,textAlign:"left"}}>
          <div style={{fontSize:".65rem",color:"rgba(255,255,255,.3)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:9}}>Preview</div>
          <div style={{display:"flex",gap:11,alignItems:"center",marginBottom:7}}>
            {data.photo?<div style={{width:40,height:40,borderRadius:"50%",overflow:"hidden",border:`2px solid ${T.a}`,flexShrink:0}}><img src={data.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>:<div style={{width:40,height:40,borderRadius:"50%",background:`${T.a}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🎂</div>}
            <div>
              <div style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:".95rem",fontWeight:700}}>{LANGS[data.lang]?.hb||"Happy Birthday"}, {data.name}!</div>
              {data.age&&<div style={{color:T.a,fontSize:".78rem"}}>Turning {data.age} 🎉</div>}
              {data.sender&&<div style={{color:"rgba(255,255,255,.4)",fontSize:".74rem"}}>From: {data.sender}</div>}
            </div>
          </div>
          {data.message&&<div style={{color:"rgba(255,255,255,.6)",fontSize:".8rem",fontStyle:"italic",borderLeft:`2px solid ${T.a}`,paddingLeft:9,lineHeight:1.5}}>"{data.message.slice(0,80)}{data.message.length>80?"...":""}"</div>}
          <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}>
            {[THEMES[data.theme]?.l,C_STYLES[data.confetti]?.l,LANGS[data.lang]?.f+" "+LANGS[data.lang]?.n].filter(Boolean).map((x,i)=><span key={i} style={{color:"rgba(255,255,255,.35)",fontSize:".68rem"}}>{x}</span>)}
          </div>
        </div>

        {/* Link */}
        <div style={{background:"rgba(0,0,0,.25)",borderRadius:9,padding:"9px 12px",marginBottom:10,wordBreak:"break-all",color:"rgba(255,255,255,.4)",fontSize:".7rem",fontFamily:"monospace",border:"1px solid rgba(255,255,255,.07)",textAlign:"left",maxHeight:50,overflow:"hidden"}}>{link.slice(0,100)}...</div>

        {/* Copy */}
        <button onClick={copy} style={{width:"100%",padding:"13px",background:copied?"linear-gradient(135deg,#34D399,#059669)":`linear-gradient(135deg,${T.a},${T.a2})`,border:"none",borderRadius:12,color:copied?"#fff":"#1a1a2e",fontSize:".95rem",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:9,transition:"all .3s"}}>
          {copied?"✅ Copied!":"📋 Copy Link"}
        </button>

        {/* Share grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:9}}>
          <button onClick={wa} style={sb("linear-gradient(135deg,#25D366,#128C7E)")}>💬 WA</button>
          <button onClick={tg} style={sb("linear-gradient(135deg,#229ED9,#1a7fc1)")}>✈️ TG</button>
          <button onClick={tw} style={sb("linear-gradient(135deg,#1DA1F2,#0d7bc4)")}>🐦 TW</button>
          <button onClick={fb} style={sb("linear-gradient(135deg,#1877F2,#0d5cba)")}>📘 FB</button>
          <button onClick={em} style={sb("linear-gradient(135deg,#EA4335,#c5221f)")}>📧 Email</button>
          <button onClick={sm} style={sb("rgba(255,255,255,.1)")}>💬 SMS</button>
          <button onClick={()=>setShowQR(p=>!p)} style={sb(`rgba(255,255,255,.1)`)}>📱 QR</button>
          <button onClick={()=>navigator.share?.({title:`Happy Birthday ${data.name}!`,url:link}).catch(()=>copy())||copy()} style={sb(`${T.a}33`)}>↗ Share</button>
        </div>

        {showQR&&<QRCode url={link} a={T.a}/>}

        {/* Steps */}
        <div style={{marginTop:14}}>
          {[{i:"1️⃣",t:`Share with ${data.name} on any platform`},{i:"2️⃣",t:"They see confetti, music, reactions & more! 🎵"},{i:"3️⃣",t:"They can react, leave wishes & open a gift box 🎁"}].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:9,background:"rgba(255,255,255,.04)",borderRadius:9,padding:"9px 12px",marginBottom:7,textAlign:"left",border:"1px solid rgba(255,255,255,.06)"}}>
              <span style={{fontSize:14}}>{s.i}</span><span style={{color:"rgba(255,255,255,.55)",fontSize:".82rem"}}>{s.t}</span>
            </div>
          ))}
        </div>

        <button onClick={onBack} style={{marginTop:16,background:"transparent",border:"1px solid rgba(255,255,255,.18)",borderRadius:10,color:"rgba(255,255,255,.4)",padding:"9px 22px",cursor:"pointer",fontSize:".82rem",fontFamily:"'DM Sans',sans-serif"}}>
          ← Create another
        </button>
      </div>
    </div>
  );
}

// ── CELEBRATION PAGE ──────────────────────────────────────────────────
function CelebrationPage({data}) {
  const T = THEMES[data.theme]||THEMES.gold;
  const L = LANGS[data.lang]||LANGS.en;
  const cvs = useConfetti(true,T.p,data.confetti||"classic");
  const [visible,setVisible] = useState(false);
  const [tab,setTab] = useState("celebrate");
  const [music,setMusic] = useState(false);
  const [giftOpen,setGiftOpen] = useState(false);

  useEffect(()=>{ setTimeout(()=>setVisible(true),150); },[]);

  const msg = data.message || L.msgs[data.name.length % L.msgs.length];
  const greeting = timeGreeting();

  const toggleMusic = () => {
    if(!music) { playBirthday(); setMusic(true); setTimeout(()=>setMusic(false),8500); }
  };

  const TABS = [{id:"celebrate",label:L.hb?" 🎉 Celebrate":"🎉 Celebrate"},{id:"wishes",label:"💌 Wishes"},{id:"gift",label:"🎁 Gift"}];

  return(
    <div style={{minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",background:T.bg,position:"relative",overflow:"hidden"}}>
      <canvas ref={cvs} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1}}/>
      <FloatingOrbs a={T.a}/>
      <Balloons colors={T.p}/>
      <Fireworks a={T.a}/>

      {/* Music button */}
      <button onClick={toggleMusic} style={{position:"fixed",top:14,right:14,zIndex:20,background:music?`${T.a}cc`:"rgba(0,0,0,.55)",border:`1.5px solid ${T.a}`,borderRadius:100,padding:"7px 13px",color:"#fff",cursor:"pointer",fontSize:".78rem",fontFamily:"'DM Sans',sans-serif",backdropFilter:"blur(10px)",transition:"all .3s",animation:music?"pulse 1s infinite":""}}>
        {music ? <>🎵 <span style={{display:"inline-flex",gap:2,alignItems:"center"}}>{[1,1.5,2,1.5,1].map((h,i)=><span key={i} style={{display:"inline-block",width:3,height:`${h*8}px`,background:"#fff",borderRadius:2,animation:`musicWave .6s ease-in-out ${i*.12}s infinite alternate`}}/>)}</span></> : "🎵 Play Birthday Song"}
      </button>

      <div style={{position:"relative",zIndex:10,maxWidth:580,margin:"0 auto",padding:"32px 16px 60px",opacity:visible?1:0,transform:visible?"none":"translateY(28px)",transition:"all .9s cubic-bezier(0.16,1,0.3,1)",textAlign:"center"}}>

        {/* Tabs */}
        <div style={{display:"flex",gap:5,background:"rgba(255,255,255,.06)",borderRadius:50,padding:4,marginBottom:22,border:"1px solid rgba(255,255,255,.1)"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px",borderRadius:46,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:".82rem",fontWeight:600,transition:"all .25s",background:tab===t.id?`linear-gradient(135deg,${T.a},${T.a2})`:"transparent",color:tab===t.id?"#1a1a2e":"rgba(255,255,255,.5)"}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* CELEBRATE */}
        {tab==="celebrate"&&<>
          <ViewCounter a={T.a} name={data.name}/>
          <div style={{color:"rgba(255,255,255,.4)",fontSize:".78rem",marginBottom:8}}>{greeting}</div>
          <Countdown a={T.a}/>
          <div style={{marginBottom:12,animation:"cakeBounce 2s ease-in-out infinite"}}><CakeIcon a={T.a}/></div>
          <div style={{display:"inline-block",background:`linear-gradient(135deg,${T.a}22,${T.a2}18)`,border:`1px solid ${T.a}40`,borderRadius:100,padding:"5px 16px",marginBottom:12,color:T.a,fontSize:".75rem",fontWeight:600,letterSpacing:"2px",textTransform:"uppercase"}}>
            ✦ {L.hb} ✦
          </div>

          <Avatar photo={data.photo} name={data.name} a={T.a} size={88}/>

          {data.age&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,background:`linear-gradient(135deg,${T.a}28,${T.a2}18)`,border:`1.5px solid ${T.a}50`,borderRadius:100,padding:"9px 22px",marginBottom:12,width:"fit-content",margin:"0 auto 12px"}}>
            <span style={{fontSize:"1.3rem"}}>🎂</span>
            <span style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:".95rem",fontWeight:700}}>{L.turning.replace("{age}",data.age)}</span>
          </div>}

          <h1 style={{fontFamily:"'Pacifico',cursive",fontSize:"clamp(2.5rem,10vw,5rem)",fontWeight:400,margin:"8px 0 6px",lineHeight:1.05,textShadow:`0 0 60px ${T.a}50`}}>
            <SparkleText a={T.a}>
              <span style={{background:`linear-gradient(135deg,${T.a},${T.a2},#fff)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{data.name}</span>
            </SparkleText>
          </h1>
          <p style={{color:"rgba(255,255,255,.65)",fontFamily:"'Playfair Display',serif",fontStyle:"italic",marginBottom:12,fontSize:".95rem"}}>{L.td}</p>

          {data.sender&&<div style={{display:"inline-block",background:"rgba(255,255,255,.07)",borderRadius:100,padding:"5px 16px",marginBottom:14,color:"rgba(255,255,255,.5)",fontSize:".82rem"}}>
            {L.from} <span style={{color:T.a,fontWeight:600}}>{data.sender}</span> 💛
          </div>}

          <div style={{background:"rgba(255,255,255,.06)",backdropFilter:"blur(24px)",border:`1px solid ${T.a}25`,borderRadius:20,padding:"22px 20px",marginBottom:16,boxShadow:`0 32px 80px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.08)`}}>
            <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"clamp(.95rem,3vw,1.2rem)",color:"rgba(255,255,255,.88)",lineHeight:1.65,margin:0}}>"{msg}"</p>
          </div>

          <div style={{display:"flex",justifyContent:"center",gap:7,marginBottom:12}}>
            {["🎁","🥂","🌟","🎈","💫","🎊","🍰","🎤"].map((e,i)=><span key={i} style={{fontSize:"clamp(1.2rem,3.5vw,1.7rem)",animation:`emojiWobble 2.2s ease-in-out ${i*.28}s infinite`}}>{e}</span>)}
          </div>

          <EmojiReactions a={T.a}/>

          <p style={{color:"rgba(255,255,255,.14)",fontSize:".7rem",marginTop:22}}>
            Made with 💛 · <a href={window.location.href.split("#")[0]} style={{color:T.a,textDecoration:"none",fontWeight:500}}>Create your own →</a>
          </p>
        </>}

        {/* WISHES */}
        {tab==="wishes"&&<WishBoard name={data.name} a={T.a} lang={data.lang||"en"}/>}

        {/* GIFT */}
        {tab==="gift"&&(
          <div style={{padding:"16px 0"}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",color:"#fff",fontSize:"1.2rem",marginBottom:5}}>🎁 A Special Gift For You!</h3>
            <p style={{color:"rgba(255,255,255,.4)",marginBottom:22,fontSize:".88rem"}}>Tap the gift to reveal a surprise {data.sender?`from ${data.sender}`:""}!</p>
            <GiftBox a={T.a} onOpen={()=>{ setGiftOpen(true); setTimeout(toggleMusic,400); }}/>
            {giftOpen&&(
              <div style={{marginTop:22,animation:"slideUp .6s ease"}}>
                <div style={{background:`linear-gradient(135deg,${T.a}22,${T.a2}18)`,border:`1px solid ${T.a}40`,borderRadius:18,padding:"22px",textAlign:"center"}}>
                  <div style={{fontSize:"2.5rem",marginBottom:10}}>🌟💝🎊💝🌟</div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",color:"rgba(255,255,255,.9)",fontSize:"1rem",lineHeight:1.6}}>
                    "The greatest gift is knowing someone who fills your world with joy. You are surrounded by love today and always! Happy Birthday, <span style={{color:T.a}}>{data.name}</span>! 🎂"
                  </p>
                  {data.sender&&<p style={{color:T.a,marginTop:10,fontWeight:600,fontSize:".9rem"}}>— With love, {data.sender} 💛</p>}
                  <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:14,flexWrap:"wrap"}}>
                    {["🎂","🎉","🎊","🌟","💝","🥳","🎁","🎈"].map((e,i)=><span key={i} style={{fontSize:"1.5rem",animation:`emojiWobble 1.5s ease-in-out ${i*.2}s infinite`}}>{e}</span>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage] = useState("setup");
  const [data,setData] = useState(null);
  const [link,setLink] = useState("");

  useEffect(()=>{
    const h = window.location.hash;
    if(h.includes("bd=")) { const m=h.match(/bd=([^&]+)/); if(m){const d=dec(m[1]);if(d?.name){setData(d);setPage("celebrate");}}}
    else { const m=h.match(/[?&]?name=([^&]+)/); if(m){setData({name:decodeURIComponent(m[1]),sender:"",message:"",age:"",theme:"gold",lang:"en",confetti:"classic",photo:null});setPage("celebrate");}}
  },[]);

  const gen = d => { setData(d); setLink(`${window.location.href.split("#")[0]}#bd=${enc(d)}`); setPage("share"); };

  return(<>
    <FontLink/>
    {page==="setup"&&<SetupPage onGenerate={gen}/>}
    {page==="share"&&<SharePage data={data} link={link} onBack={()=>setPage("setup")}/>}
    {page==="celebrate"&&data&&<CelebrationPage data={data}/>}
  </>);
}
