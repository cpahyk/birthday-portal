import { useState, useEffect, useRef, useCallback } from "react";

/* ─── FONTS ──────────────────────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=Pacifico&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}body{overflow-x:hidden}
    input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.25)}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:4px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
    @keyframes popIn{0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}
    @keyframes cakePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
    @keyframes glowPulse{0%,100%{opacity:.6}50%{opacity:1}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
    @keyframes musicBar{0%,100%{transform:scaleY(1)}50%{transform:scaleY(2)}}
    @keyframes countUp{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
    @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
  `}</style>
);

/* ─── THEMES ─────────────────────────────────────────────────────── */
const THEMES = {
  gold:    {l:"👑 Royal Gold",   bg:"linear-gradient(160deg,#0F0C29 0%,#302B63 50%,#24243E 100%)",a:"#FFD700",a2:"#FF9F43",p:["#FFD700","#FF6B6B","#FF9F43","#54A0FF","#C084FC","#FF3F81"]},
  ocean:   {l:"🌊 Ocean Blue",   bg:"linear-gradient(160deg,#0c1f3f 0%,#0a3d62 50%,#1e3799 100%)",a:"#00D2FF",a2:"#0099CC",p:["#00D2FF","#74b9ff","#0984e3","#a29bfe","#fd79a8","#55efc4"]},
  rose:    {l:"🌸 Rose Garden",  bg:"linear-gradient(160deg,#2d1b35 0%,#6c2645 50%,#3d1a4a 100%)",a:"#FF6B9D",a2:"#FF9FC7",p:["#FF6B9D","#ffb3c6","#FF9FC7","#f9a8d4","#e879f9","#fbbf24"]},
  emerald: {l:"🌿 Emerald",      bg:"linear-gradient(160deg,#0a1628 0%,#1a3a2a 50%,#0d2b1a 100%)",a:"#00FF87",a2:"#00CC6A",p:["#00FF87","#00CC6A","#34d399","#6ee7b7","#fbbf24","#f472b6"]},
  sunset:  {l:"🌅 Sunset",       bg:"linear-gradient(160deg,#1a0a1e 0%,#6b1f3a 50%,#c0392b 100%)",a:"#FF6348",a2:"#FFDD59",p:["#FF6348","#FFDD59","#ff7f50","#ff4500","#ffa500","#ff69b4"]},
  neon:    {l:"⚡ Neon Cyber",   bg:"linear-gradient(160deg,#000000 0%,#0a0a1a 50%,#050510 100%)",a:"#00FFFF",a2:"#FF00FF",p:["#00FFFF","#FF00FF","#00FF00","#FFFF00","#FF6600","#FF0066"]},
  galaxy:  {l:"🌌 Galaxy",       bg:"linear-gradient(160deg,#020007 0%,#0d0221 50%,#170b3b 100%)",a:"#A78BFA",a2:"#F472B6",p:["#A78BFA","#F472B6","#60A5FA","#34D399","#FBBF24","#F87171"]},
  candy:   {l:"🍭 Candy Pop",    bg:"linear-gradient(160deg,#2d1b4e 0%,#4a1942 50%,#1a1040 100%)",a:"#FF69B4",a2:"#FFD700",p:["#FF69B4","#FF1493","#FF6347","#FFD700","#00CED1","#7B68EE"]},
};

/* ─── LANGUAGES ──────────────────────────────────────────────────── */
const LANGS = {
  en:{f:"🇺🇸",n:"English",  hb:"Happy Birthday",  td:"Today is YOUR day!",from:"With love from",turning:"Turning {age} Today!",msgs:["May your day be as wonderful as you are!","Wishing you a lifetime of happiness!","Here's to another year of amazing adventures!","You deserve all the love in the world!","May every dream come true! 🌠"]},
  hi:{f:"🇮🇳",n:"हिंदी",    hb:"जन्मदिन मुबारक",  td:"आज का दिन आपका है!",from:"प्यार के साथ",turning:"आज {age} साल!",msgs:["आपका दिन सुंदर हो!","आजीवन खुश रहो!","नए साल की शुभ शुरुआत!","हर सपना सच हो! 🌠","जन्मदिन की हार्दिक शुभकामनाएं!"]},
  gu:{f:"🇮🇳",n:"ગુજરાતી",  hb:"જન્મ દિવસ મુબારક",td:"આજ તારો દિવસ!",from:"પ્રેમ સહ",turning:"આજ {age} વર્ષ!",msgs:["તારો દિવસ સુંદર!","ખૂબ ખુશ રહો!","સ્વપ્ન સાકાર!","પ્રેમ ભર્યો જન્મ દિવસ! 🌠","નવા વર્ષ ની ખૂબ ખૂબ શુભ ભાવના!"]},
  es:{f:"🇪🇸",n:"Español",  hb:"¡Feliz Cumpleaños",td:"¡Hoy es TU día!",from:"Con amor de",turning:"¡{age} años hoy!",msgs:["¡Que tu día sea maravilloso!","¡Una vida llena de felicidad!","¡Otro año de aventuras!","¡Que tus sueños se realicen! 🌠","¡Mereces todo el amor!"]},
  fr:{f:"🇫🇷",n:"Français",  hb:"Joyeux Anniversaire",td:"C'est TON jour!",from:"Avec amour de",turning:"{age} ans aujourd'hui!",msgs:["Que ta journée soit merveilleuse!","Une vie pleine de bonheur!","À une autre année d'aventures!","Que tes rêves se réalisent! 🌠","Tu mérites tout l'amour!"]},
};

const CONFETTI_STYLES = {
  classic:{l:"🎊 Classic"}, hearts:{l:"❤️ Hearts"}, stars:{l:"⭐ Stars"}, money:{l:"💰 Money"}, balloons:{l:"🎈 Balloons"},
};

/* ─── UTILS ──────────────────────────────────────────────────────── */
const enc = o => { try{return btoa(unescape(encodeURIComponent(JSON.stringify(o))))}catch{return""} };
const dec = s => { try{return JSON.parse(decodeURIComponent(escape(atob(s))))}catch{return null} };
const compressImg = (file) => new Promise(res => {
  const c=document.createElement("canvas");c.width=80;c.height=80;
  const ctx=c.getContext("2d"),img=new Image();
  img.onload=()=>{ctx.drawImage(img,0,0,80,80);res(c.toDataURL("image/jpeg",0.4));};
  img.src=URL.createObjectURL(file);
});

/* ─── BIRTHDAY MUSIC ─────────────────────────────────────────────── */
const playBirthday = () => {
  try {
    const ac=new(window.AudioContext||window.webkitAudioContext)();
    const notes=[{f:392,d:.3},{f:392,d:.1},{f:440,d:.4},{f:392,d:.4},{f:523,d:.4},{f:494,d:.8},{f:392,d:.3},{f:392,d:.1},{f:440,d:.4},{f:392,d:.4},{f:587,d:.4},{f:523,d:.8},{f:392,d:.3},{f:392,d:.1},{f:784,d:.4},{f:659,d:.4},{f:523,d:.4},{f:494,d:.4},{f:440,d:.8},{f:698,d:.3},{f:698,d:.1},{f:659,d:.4},{f:523,d:.4},{f:587,d:.4},{f:523,d:.8}];
    let t=ac.currentTime+.1;
    notes.forEach(({f,d})=>{const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=f;o.type="sine";g.gain.setValueAtTime(.28,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.start(t);o.stop(t+d);t+=d;});
  } catch(e){}
};

/* ─── TAP-BURST CONFETTI (unique feature) ────────────────────────── */
function useTapConfetti(colors) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animRef = useRef(null);
  const running = useRef(false);

  const burst = useCallback((x, y, n = 28) => {
    const canvas = canvasRef.current; if(!canvas) return;
    for(let i=0;i<n;i++) {
      const angle = (Math.PI*2/n)*i;
      const speed = Math.random()*6+3;
      particles.current.push({
        x,y,vx:Math.cos(angle)*speed*(Math.random()*0.8+0.6),
        vy:Math.sin(angle)*speed*(Math.random()*0.8+0.6)-2,
        r:Math.random()*6+3,
        color:colors[Math.floor(Math.random()*colors.length)],
        op:1,shape:["circle","rect","tri"][Math.floor(Math.random()*3)]
      });
    }
    if(!running.current) loop(canvas);
  }, [colors]);

  const loop = (canvas) => {
    running.current = true;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.current = particles.current.filter(p=>p.op>0.05);
    particles.current.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.vy+=.15; p.op-=.018;
      ctx.save(); ctx.globalAlpha=p.op; ctx.fillStyle=p.color;
      if(p.shape==="circle"){ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}
      else if(p.shape==="rect"){ctx.fillRect(p.x-p.r,p.y-p.r/2,p.r*2,p.r);}
      else{ctx.beginPath();ctx.moveTo(p.x,p.y-p.r);ctx.lineTo(p.x+p.r,p.y+p.r);ctx.lineTo(p.x-p.r,p.y+p.r);ctx.closePath();ctx.fill();}
      ctx.restore();
    });
    if(particles.current.length>0) animRef.current=requestAnimationFrame(()=>loop(canvas));
    else { running.current=false; ctx.clearRect(0,0,canvas.width,canvas.height); }
  };

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
    resize(); window.addEventListener("resize",resize);
    return()=>{cancelAnimationFrame(animRef.current);window.removeEventListener("resize",resize);};
  },[]);

  return {canvasRef, burst};
}

/* ─── SCRATCH CARD (unique feature) ─────────────────────────────── */
function ScratchCard({accent, message, sender}) {
  const cvs = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [pct, setPct] = useState(0);
  const drawing = useRef(false);

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const ctx=c.getContext("2d");
    c.width=c.offsetWidth; c.height=c.offsetHeight;
    ctx.fillStyle="#888"; 
    const grad=ctx.createLinearGradient(0,0,c.width,c.height);
    grad.addColorStop(0,"#555");grad.addColorStop(.5,"#777");grad.addColorStop(1,"#555");
    ctx.fillStyle=grad; ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle="rgba(255,255,255,0.15)";
    ctx.font="bold 14px DM Sans";ctx.textAlign="center";
    ctx.fillText("✦ Scratch to reveal your gift! ✦",c.width/2,c.height/2-6);
    ctx.fillText("Use your finger or mouse",c.width/2,c.height/2+14);
  },[]);

  const scratch = (e) => {
    if(!drawing.current) return;
    const c=cvs.current; if(!c) return;
    const ctx=c.getContext("2d");
    const rect=c.getBoundingClientRect();
    const x=(e.touches?e.touches[0].clientX:e.clientX)-rect.left;
    const y=(e.touches?e.touches[0].clientY:e.clientY)-rect.top;
    ctx.globalCompositeOperation="destination-out";
    ctx.beginPath();ctx.arc(x,y,28,0,Math.PI*2);ctx.fill();
    // check % revealed
    const data=ctx.getImageData(0,0,c.width,c.height).data;
    let transparent=0;
    for(let i=3;i<data.length;i+=4) if(data[i]<128) transparent++;
    const p=Math.round((transparent/(c.width*c.height))*100);
    setPct(p);
    if(p>60&&!revealed) setRevealed(true);
  };

  return(
    <div style={{position:"relative",width:"100%",maxWidth:340,margin:"0 auto",borderRadius:18,overflow:"hidden",boxShadow:`0 8px 32px rgba(0,0,0,.4)`}}>
      {/* Content underneath */}
      <div style={{background:`linear-gradient(135deg,${accent}22,${accent}11)`,border:`1px solid ${accent}40`,padding:"24px 20px",textAlign:"center",minHeight:110,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
        <div style={{fontSize:"2rem"}}>{revealed?"🎁✨":"🎁"}</div>
        {revealed
          ? <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",color:"rgba(255,255,255,.9)",fontSize:".95rem",lineHeight:1.6}}>{message}</p>
          : <p style={{color:"rgba(255,255,255,.5)",fontSize:".85rem"}}>Keep scratching...</p>
        }
        {revealed&&sender&&<p style={{color:accent,fontSize:".82rem",fontWeight:600}}>— {sender} 💛</p>}
      </div>
      {/* Scratch overlay */}
      {!revealed&&<canvas ref={cvs} onMouseDown={()=>drawing.current=true} onMouseUp={()=>drawing.current=false} onMouseLeave={()=>drawing.current=false} onMouseMove={scratch} onTouchStart={()=>drawing.current=true} onTouchEnd={()=>drawing.current=false} onTouchMove={scratch} style={{position:"absolute",inset:0,width:"100%",height:"100%",cursor:"crosshair",touchAction:"none"}}/>}
    </div>
  );
}

/* ─── VIEW COUNTER ───────────────────────────────────────────────── */
function ViewCounter({a,name}) {
  const [v,setV]=useState(0);
  useEffect(()=>{const k=`bv_${name}`,n=parseInt(localStorage.getItem(k)||"0")+1;localStorage.setItem(k,n);setV(n);},[name]);
  return(<div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.07)",borderRadius:100,padding:"4px 12px",marginBottom:8}}>
    <span style={{fontSize:".85rem"}}>👁</span><span style={{color:"rgba(255,255,255,.45)",fontSize:".74rem"}}><span style={{color:a,fontWeight:700}}>{v}</span> views</span>
  </div>);
}

/* ─── COUNTDOWN ──────────────────────────────────────────────────── */
function Countdown({a}) {
  const [t,setT]=useState("");
  useEffect(()=>{
    const u=()=>{const n=new Date(),m=new Date(n);m.setHours(24,0,0,0);const d=m-n;setT(`${String(Math.floor(d/3600000)).padStart(2,"0")}:${String(Math.floor((d%3600000)/60000)).padStart(2,"0")}:${String(Math.floor((d%60000)/1000)).padStart(2,"0")}`);};
    u();const id=setInterval(u,1000);return()=>clearInterval(id);
  },[]);
  return(<div style={{background:"rgba(0,0,0,.25)",borderRadius:10,padding:"7px 16px",marginBottom:12,border:`1px solid ${a}35`,textAlign:"center",display:"inline-block"}}>
    <span style={{color:"rgba(255,255,255,.4)",fontSize:".68rem",letterSpacing:"1.5px",textTransform:"uppercase"}}>🕛 ends in </span>
    <span style={{fontFamily:"monospace",fontSize:"1.1rem",color:a,fontWeight:700,letterSpacing:"3px"}}>{t}</span>
  </div>);
}

/* ─── EMOJI REACTIONS ────────────────────────────────────────────── */
function EmojiReactions({a,onTap}) {
  const [r,setR]=useState({});
  const [pop,setPop]=useState(null);
  const emojis=["🎉","❤️","🎂","🥳","🌟","🙏","😍","🎁","🔥","💯","😭","🫶"];
  const add=(e,ev)=>{
    setR(p=>({...p,[e]:(p[e]||0)+1}));
    setPop(e);setTimeout(()=>setPop(null),400);
    if(onTap) onTap(ev.clientX,ev.clientY);
  };
  return(<div style={{marginTop:18}}>
    <p style={{color:"rgba(255,255,255,.35)",fontSize:".7rem",marginBottom:9,textTransform:"uppercase",letterSpacing:"1.5px"}}>Tap to react & burst confetti 🎊</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
      {emojis.map(e=>(
        <button key={e} onClick={ev=>add(e,ev)} style={{background:pop===e?`${a}44`:"rgba(255,255,255,.07)",border:`1px solid ${pop===e?a:"rgba(255,255,255,.1)"}`,borderRadius:100,padding:"7px 11px",cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",gap:4,transform:pop===e?"scale(1.2)":"scale(1)",willChange:"transform"}}>
          <span style={{fontSize:"1.15rem"}}>{e}</span>
          {r[e]>0&&<span style={{color:"rgba(255,255,255,.8)",fontSize:".8rem",fontWeight:600}}>{r[e]}</span>}
        </button>
      ))}
    </div>
  </div>);
}

/* ─── WISH BOARD ─────────────────────────────────────────────────── */
function WishBoard({name,a,lang="en"}) {
  const L=LANGS[lang]||LANGS.en;
  const [wishes,setWishes]=useState([{n:"A Friend",m:"May all your dreams come true! 🌟",t:"2m ago"},{n:"Family",m:"We love you so much! 🎂",t:"5m ago"}]);
  const [wn,setWn]=useState("");const [wm,setWm]=useState("");const [sent,setSent]=useState(false);
  const submit=()=>{if(!wn.trim()||!wm.trim())return;setWishes(p=>[{n:wn.trim(),m:wm.trim(),t:"Just now"},...p]);setWn("");setWm("");setSent(true);setTimeout(()=>setSent(false),2000);};
  const inp={width:"100%",padding:"11px 14px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,color:"#fff",fontSize:".9rem",fontFamily:"'DM Sans',sans-serif",outline:"none"};
  return(<div style={{width:"100%",maxWidth:500,margin:"0 auto"}}>
    <h3 style={{fontFamily:"'Playfair Display',serif",color:"#fff",fontSize:"1rem",marginBottom:12,textAlign:"center"}}>💌 Leave a wish for {name}</h3>
    <div style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:16,marginBottom:12}}>
      <input value={wn} onChange={e=>setWn(e.target.value)} placeholder="Your name" style={{...inp,marginBottom:9}}/>
      <textarea value={wm} onChange={e=>setWm(e.target.value)} placeholder="Write your birthday wish..." rows={3} style={{...inp,resize:"none",lineHeight:1.5,marginBottom:11}}/>
      <button onClick={submit} style={{width:"100%",padding:"11px",background:sent?"linear-gradient(135deg,#34D399,#059669)":`linear-gradient(135deg,${a},${a}99)`,border:"none",borderRadius:10,color:"#1a1a2e",fontSize:".9rem",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .3s"}}>
        {sent?"✅ Wish Sent!":"Send Wish 💝"}
      </button>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:9,maxHeight:240,overflowY:"auto"}}>
      {wishes.map((w,i)=>(
        <div key={i} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:11,padding:"12px 14px",animation:"slideIn .3s ease both"}}>
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

/* ─── QR CODE ────────────────────────────────────────────────────── */
function QRCode({url,a}) {
  return(<div style={{textAlign:"center",marginTop:12}}>
    <p style={{color:"rgba(255,255,255,.35)",fontSize:".7rem",marginBottom:7,letterSpacing:"1px",textTransform:"uppercase"}}>QR Code</p>
    <div style={{background:"rgba(255,255,255,.06)",borderRadius:11,padding:8,display:"inline-block",border:`1px solid ${a}30`}}>
      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(url)}&bgcolor=0d0d1a&color=${a.replace("#","")}`} alt="QR" width={110} height={110} style={{borderRadius:6,display:"block"}}/>
    </div>
  </div>);
}

/* ─── CAKE ───────────────────────────────────────────────────────── */
function CakeIcon({a}) {
  return(<svg width="72" height="72" viewBox="0 0 84 84" fill="none" style={{animation:"cakePulse 2s ease-in-out infinite",willChange:"transform"}}>
    <rect x="10" y="42" width="64" height="32" rx="7" fill={a} opacity=".85"/>
    <rect x="18" y="29" width="48" height="20" rx="6" fill="#FF9F43" opacity=".9"/>
    <rect x="25" y="20" width="34" height="16" rx="5" fill="#FFD700" opacity=".9"/>
    {[30,42,54].map((x,i)=><g key={i}><rect x={x-3} y="9" width="7" height="15" rx="3.5" fill={["#C084FC","#60A5FA","#F472B6"][i]}/><ellipse cx={x+.5} cy="8" rx="3.5" ry="6" fill="#FFD700" opacity=".9"><animate attributeName="ry" values="6;9;6" dur=".9s" repeatCount="indefinite"/></ellipse></g>)}
    <path d="M18 29 Q23 22 28 29 Q33 22 38 29 Q43 22 48 29 Q53 22 58 29 Q63 22 66 29" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
  </svg>);
}

/* ─── AVATAR ─────────────────────────────────────────────────────── */
const Avatar = ({photo,name,a,size=80}) => photo
  ? <div style={{width:size,height:size,borderRadius:"50%",overflow:"hidden",border:`3px solid ${a}`,boxShadow:`0 0 24px ${a}55`,margin:"0 auto 12px"}}><img src={photo} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
  : <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${a},${a}66)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",border:`3px solid ${a}77`,boxShadow:`0 0 18px ${a}40`,fontSize:size*.38,fontWeight:900,color:"#1a1a2e",fontFamily:"'Playfair Display',serif"}}>{name?.[0]?.toUpperCase()||"🎂"}</div>;

/* ─── THEME PICKER ───────────────────────────────────────────────── */
function ThemePicker({selected,onChange}) {
  return(<div>
    <label style={{display:"block",color:"rgba(255,255,255,.45)",fontSize:".7rem",fontWeight:500,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:9}}>Choose Theme</label>
    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
      {Object.entries(THEMES).map(([key,t])=>(
        <button key={key} onClick={()=>onChange(key)} style={{padding:"7px 11px",borderRadius:100,cursor:"pointer",background:selected===key?`linear-gradient(135deg,${t.a},${t.a2})`:"rgba(255,255,255,.07)",border:`1.5px solid ${selected===key?t.a:"rgba(255,255,255,.14)"}`,color:selected===key?"#1a1a2e":"rgba(255,255,255,.7)",fontSize:".78rem",fontWeight:selected===key?700:400,transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>
          {t.l}
        </button>
      ))}
    </div>
  </div>);
}

/* ─── SETUP PAGE ─────────────────────────────────────────────────── */
function SetupPage({onGenerate}) {
  const [f,setF]=useState({name:"",sender:"",message:"",age:"",theme:"gold",lang:"en",confetti:"classic",photo:null,bdDate:""});
  const [foc,setFoc]=useState(""); const [prev,setPrev]=useState(null);
  const T=THEMES[f.theme]; const set=(k,v)=>setF(p=>({...p,[k]:v}));

  const handlePhoto=async e=>{const file=e.target.files?.[0];if(!file)return;const c=await compressImg(file);setPrev(c);set("photo",c);};
  const handleDate=e=>{const d=e.target.value;set("bdDate",d);if(d){const n=new Date(),b=new Date(d);let age=n.getFullYear()-b.getFullYear();if(n.getMonth()-b.getMonth()<0||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate()))age--;if(age>0&&age<130)set("age",String(age));}};

  const inp=k=>({width:"100%",padding:"12px 14px",background:"rgba(255,255,255,.07)",border:`1.5px solid ${foc===k?T.a:"rgba(255,255,255,.12)"}`,borderRadius:11,color:"#fff",fontSize:".95rem",fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border .2s",marginBottom:11});
  const lbl={display:"block",color:"rgba(255,255,255,.45)",fontSize:".7rem",fontWeight:500,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:5};

  const templates=["🎂 Warmest wishes on your special day!","🌟 You make the world brighter just by being in it!","🎉 May this year bring everything you've dreamed of!","💛 Grateful every day to know someone as amazing as you!","🌈 Another year older, wiser, and more wonderful!"];

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:T.bg,fontFamily:"'DM Sans',sans-serif",padding:"28px 16px"}}>
      <div style={{width:"100%",maxWidth:500}}>
        {/* Language */}
        <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:16,flexWrap:"wrap"}}>
          {Object.entries(LANGS).map(([k,l])=>(
            <button key={k} onClick={()=>set("lang",k)} style={{padding:"5px 9px",borderRadius:100,border:`1px solid ${f.lang===k?T.a:"rgba(255,255,255,.2)"}`,background:f.lang===k?`${T.a}22`:"rgba(255,255,255,.05)",color:"#fff",cursor:"pointer",fontSize:".78rem",fontFamily:"'DM Sans',sans-serif"}}>{l.f} {l.n}</button>
          ))}
        </div>

        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{marginBottom:12}}><CakeIcon a={T.a}/></div>
          <h1 style={{fontFamily:"'Pacifico',cursive",fontSize:"clamp(1.8rem,6vw,2.5rem)",color:"#fff",lineHeight:1.2,marginBottom:5}}>
            Birthday <span style={{background:`linear-gradient(135deg,${T.a},${T.a2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Surprise!</span>
          </h1>
          <p style={{color:"rgba(255,255,255,.35)",fontSize:".85rem"}}>Tap reactions = confetti burst · Scratch card reveal · Birthday music 🎵</p>
        </div>

        <div style={{background:"rgba(255,255,255,.06)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:"20px 16px",boxShadow:"0 20px 60px rgba(0,0,0,.4)"}}>
          {/* Photo */}
          <label style={lbl}>📸 Photo (optional)</label>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}>
            <div style={{width:44,height:44,borderRadius:"50%",overflow:"hidden",border:`2px solid ${prev?T.a:"rgba(255,255,255,.2)"}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.07)"}}>
              {prev?<img src={prev} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span>📸</span>}
            </div>
            <label style={{flex:1,padding:"9px 12px",background:"rgba(255,255,255,.07)",border:"1.5px dashed rgba(255,255,255,.25)",borderRadius:10,cursor:"pointer",color:"rgba(255,255,255,.5)",fontSize:".82rem",textAlign:"center"}}>
              {prev?"✅ Photo added":"Tap to upload photo"}<input type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
            </label>
          </div>

          <label style={lbl}>🎂 Birthday Person's Name *</label>
          <input value={f.name} onChange={e=>set("name",e.target.value)} onFocus={()=>setFoc("name")} onBlur={()=>setFoc("")} placeholder="e.g. Priya, Rahul, Alex..." style={inp("name")} onKeyDown={e=>e.key==="Enter"&&f.name.trim()&&onGenerate(f)}/>

          <label style={lbl}>👤 Your Name (From)</label>
          <input value={f.sender} onChange={e=>set("sender",e.target.value)} onFocus={()=>setFoc("sender")} onBlur={()=>setFoc("")} placeholder="e.g. Mom, Best Friend, Team..." style={inp("sender")}/>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            <div><label style={lbl}>📅 Birthday Date</label><input type="date" value={f.bdDate} onChange={handleDate} onFocus={()=>setFoc("date")} onBlur={()=>setFoc("")} style={{...inp("date"),marginBottom:0,colorScheme:"dark"}}/></div>
            <div><label style={lbl}>🔢 Age</label><input value={f.age} onChange={e=>set("age",e.target.value.replace(/\D/,""))} onFocus={()=>setFoc("age")} onBlur={()=>setFoc("")} placeholder="Auto-filled" maxLength={3} style={{...inp("age"),marginBottom:0}}/></div>
          </div><div style={{height:11}}/>

          <label style={lbl}>💬 Message Template</label>
          <select value="" onChange={e=>e.target.value&&set("message",e.target.value)} style={{...inp("tpl"),background:"rgba(0,0,0,.4)",cursor:"pointer",marginBottom:11}}>
            <option value="">Pick a template...</option>
            {templates.map((t,i)=><option key={i} value={t}>{t}</option>)}
          </select>

          <label style={lbl}>✍️ Personal Message</label>
          <textarea value={f.message} onChange={e=>set("message",e.target.value)} onFocus={()=>setFoc("msg")} onBlur={()=>setFoc("")} placeholder="Write something from the heart..." rows={3} style={{...inp("msg"),resize:"none",lineHeight:1.5,marginBottom:18}}/>

          <div style={{marginBottom:16}}><ThemePicker selected={f.theme} onChange={v=>set("theme",v)}/></div>

          <label style={lbl}>🎊 Confetti Style (tap anywhere to burst!)</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:20}}>
            {Object.entries(CONFETTI_STYLES).map(([k,s])=>(
              <button key={k} onClick={()=>set("confetti",k)} style={{padding:"7px 11px",borderRadius:100,cursor:"pointer",background:f.confetti===k?`linear-gradient(135deg,${T.a},${T.a2})`:"rgba(255,255,255,.07)",border:`1.5px solid ${f.confetti===k?T.a:"rgba(255,255,255,.14)"}`,color:f.confetti===k?"#1a1a2e":"rgba(255,255,255,.7)",fontSize:".78rem",transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>{s.l}</button>
            ))}
          </div>

          <button onClick={()=>f.name.trim()&&onGenerate(f)} disabled={!f.name.trim()} style={{width:"100%",padding:"14px",background:f.name.trim()?`linear-gradient(135deg,${T.a},${T.a2})`:"rgba(255,255,255,.1)",border:"none",borderRadius:13,color:f.name.trim()?"#1a1a2e":"rgba(255,255,255,.3)",fontSize:".95rem",fontWeight:700,cursor:f.name.trim()?"pointer":"not-allowed",fontFamily:"'DM Sans',sans-serif",transition:"all .25s",boxShadow:f.name.trim()?`0 8px 24px ${T.a}40`:"none"}}>
            ✨ Generate Magic Surprise Link
          </button>
        </div>
        <p style={{color:"rgba(255,255,255,.14)",fontSize:".72rem",marginTop:12,textAlign:"center"}}>Free · No signup · 8 themes · 5 languages · Scratch card 🎰</p>
      </div>
    </div>
  );
}

/* ─── SHARE PAGE ─────────────────────────────────────────────────── */
function SharePage({data,link,onBack}) {
  const T=THEMES[data.theme]||THEMES.gold;
  const [copied,setCopied]=useState(false);const [showQR,setShowQR]=useState(false);
  const copy=()=>navigator.clipboard.writeText(link).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});
  const wa=()=>window.open(`https://wa.me/?text=${encodeURIComponent(`🎂 Happy Birthday ${data.name}! Your surprise → ${link}`)}`,"_blank");
  const tg=()=>window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`🎂 Happy Birthday ${data.name}!`)}`,"_blank");
  const tw=()=>window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🎂 Happy Birthday ${data.name}! 🎉 ${link}`)}`,"_blank");
  const em=()=>window.open(`mailto:?subject=${encodeURIComponent(`Happy Birthday ${data.name}! 🎂`)}&body=${encodeURIComponent(`Hey ${data.name}!\n\nI made this special birthday surprise for you:\n${link}\n\nEnjoy! 🎉`)}`);
  const sm=()=>window.open(`sms:?body=${encodeURIComponent(`🎂 Happy Birthday ${data.name}! Your surprise: ${link}`)}`);
  const sb=(bg)=>({padding:"11px 6px",background:bg,border:"none",borderRadius:11,color:"#fff",fontSize:".8rem",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"});

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:T.bg,fontFamily:"'DM Sans',sans-serif",padding:"28px 16px"}}>
      <div style={{width:"100%",maxWidth:460,textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:12,animation:"popIn .6s both"}}>🎊</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.4rem,5vw,2rem)",fontWeight:900,color:"#fff",marginBottom:5}}>
          Link Ready for <span style={{color:T.a,fontStyle:"italic"}}>{data.name}!</span>
        </h2>
        <p style={{color:"rgba(255,255,255,.35)",marginBottom:18,fontWeight:300,fontSize:".88rem"}}>Share via any platform below ✨</p>

        <div style={{background:"rgba(255,255,255,.06)",backdropFilter:"blur(16px)",border:`1px solid ${T.a}30`,borderRadius:18,padding:"14px 18px",marginBottom:12,textAlign:"left"}}>
          <div style={{fontSize:".65rem",color:"rgba(255,255,255,.3)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:9}}>What they'll see</div>
          <div style={{display:"flex",gap:11,alignItems:"center",marginBottom:7}}>
            {data.photo?<div style={{width:40,height:40,borderRadius:"50%",overflow:"hidden",border:`2px solid ${T.a}`,flexShrink:0}}><img src={data.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>:<div style={{width:40,height:40,borderRadius:"50%",background:`${T.a}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"1.2rem"}}>🎂</div>}
            <div>
              <div style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700}}>{LANGS[data.lang]?.hb||"Happy Birthday"}, {data.name}!</div>
              {data.age&&<div style={{color:T.a,fontSize:".78rem"}}>Turning {data.age} 🎉</div>}
              {data.sender&&<div style={{color:"rgba(255,255,255,.4)",fontSize:".74rem"}}>From: {data.sender}</div>}
            </div>
          </div>
          {data.message&&<div style={{color:"rgba(255,255,255,.6)",fontSize:".8rem",fontStyle:"italic",borderLeft:`2px solid ${T.a}`,paddingLeft:9,lineHeight:1.5}}>"{data.message.slice(0,80)}{data.message.length>80?"...":""}"</div>}
          <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}>
            {[THEMES[data.theme]?.l,CONFETTI_STYLES[data.confetti]?.l,LANGS[data.lang]?.f+" "+LANGS[data.lang]?.n].filter(Boolean).map((x,i)=><span key={i} style={{color:"rgba(255,255,255,.3)",fontSize:".68rem"}}>{x}</span>)}
          </div>
        </div>

        <div style={{background:"rgba(0,0,0,.2)",borderRadius:9,padding:"9px 12px",marginBottom:10,wordBreak:"break-all",color:"rgba(255,255,255,.4)",fontSize:".7rem",fontFamily:"monospace",border:"1px solid rgba(255,255,255,.07)",textAlign:"left",maxHeight:46,overflow:"hidden"}}>{link.slice(0,100)}...</div>

        <button onClick={copy} style={{width:"100%",padding:"13px",background:copied?"linear-gradient(135deg,#34D399,#059669)":`linear-gradient(135deg,${T.a},${T.a2})`,border:"none",borderRadius:12,color:copied?"#fff":"#1a1a2e",fontSize:".92rem",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:9,transition:"all .3s"}}>
          {copied?"✅ Copied!":"📋 Copy Link"}
        </button>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:9}}>
          <button onClick={wa} style={sb("linear-gradient(135deg,#25D366,#128C7E)")}>💬 WA</button>
          <button onClick={tg} style={sb("linear-gradient(135deg,#229ED9,#1a7fc1)")}>✈️ TG</button>
          <button onClick={tw} style={sb("linear-gradient(135deg,#1DA1F2,#0d7bc4)")}>🐦 TW</button>
          <button onClick={em} style={sb("linear-gradient(135deg,#EA4335,#c5221f)")}>📧</button>
          <button onClick={sm} style={sb("rgba(255,255,255,.1)")}>💬 SMS</button>
          <button onClick={()=>navigator.share?.({title:`Happy Birthday ${data.name}!`,url:link}).catch(()=>copy())||copy()} style={sb(`rgba(255,255,255,.1)`)}>↗ Share</button>
          <button onClick={()=>setShowQR(p=>!p)} style={sb(`${T.a}33`)}>📱 QR</button>
          <button onClick={onBack} style={sb("rgba(255,255,255,.08)")}>← Back</button>
        </div>

        {showQR&&<QRCode url={link} a={T.a}/>}

        <div style={{marginTop:14}}>
          {[{i:"1️⃣",t:`Share with ${data.name} on any platform`},{i:"2️⃣",t:"They tap reactions → confetti bursts! 🎊"},{i:"3️⃣",t:"Scratch card reveals a special message 🎰"}].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:9,background:"rgba(255,255,255,.04)",borderRadius:9,padding:"9px 12px",marginBottom:7,textAlign:"left",border:"1px solid rgba(255,255,255,.06)"}}>
              <span>{s.i}</span><span style={{color:"rgba(255,255,255,.55)",fontSize:".82rem"}}>{s.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── CELEBRATION PAGE ───────────────────────────────────────────── */
function CelebrationPage({data}) {
  const T=THEMES[data.theme]||THEMES.gold;
  const L=LANGS[data.lang]||LANGS.en;
  const [visible,setVisible]=useState(false);
  const [tab,setTab]=useState("celebrate");
  const [music,setMusic]=useState(false);

  // Tap-burst confetti (on-demand, no constant animation)
  const {canvasRef, burst} = useTapConfetti(T.p);

  useEffect(()=>{ setTimeout(()=>setVisible(true),100); },[]);
  // Auto-burst on load
  useEffect(()=>{ setTimeout(()=>{ burst(window.innerWidth/2,window.innerHeight/3,20); },800); },[]);

  const msg=data.message||L.msgs[data.name.length%L.msgs.length];
  const toggleMusic=()=>{ if(!music){playBirthday();setMusic(true);setTimeout(()=>setMusic(false),9000);} };

  const handlePageTap=(e)=>{ if(e.target.tagName==="BUTTON"||e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA") return; burst(e.clientX,e.clientY,16); };

  return(
    <div onClick={handlePageTap} style={{minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",background:T.bg,position:"relative",cursor:"crosshair"}}>
      {/* Tap-burst canvas — replaces constant confetti */}
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:50}}/>

      {/* Subtle glow background — CSS only, no JS */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${T.a}12 0%,transparent 70%)`,top:"10%",left:"10%",animation:"glowPulse 4s ease-in-out infinite"}}/>
        <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${T.a2}10 0%,transparent 70%)`,bottom:"15%",right:"10%",animation:"glowPulse 5s ease-in-out 1s infinite"}}/>
      </div>

      {/* Music button */}
      <button onClick={e=>{e.stopPropagation();toggleMusic();}} style={{position:"fixed",top:14,right:14,zIndex:60,background:music?`${T.a}cc`:"rgba(0,0,0,.5)",border:`1.5px solid ${T.a}`,borderRadius:100,padding:"7px 13px",color:"#fff",cursor:"pointer",fontSize:".78rem",fontFamily:"'DM Sans',sans-serif",backdropFilter:"blur(8px)"}}>
        {music?<>🎵 <span style={{display:"inline-flex",gap:2,alignItems:"center"}}>{[1,1.5,2,1.5,1].map((h,i)=><span key={i} style={{display:"inline-block",width:3,height:h*8,background:"#fff",borderRadius:2,animation:`musicBar .6s ease-in-out ${i*.12}s infinite alternate`}}/>)}</span></>:"🎵 Song"}
      </button>

      {/* Tap hint */}
      <div style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",zIndex:60,background:"rgba(0,0,0,.4)",backdropFilter:"blur(8px)",borderRadius:100,padding:"6px 14px",pointerEvents:"none",opacity:.6}}>
        <span style={{color:"rgba(255,255,255,.7)",fontSize:".72rem"}}>🎊 Tap anywhere to burst confetti!</span>
      </div>

      <div style={{position:"relative",zIndex:10,maxWidth:560,margin:"0 auto",padding:"32px 16px 80px",opacity:visible?1:0,transform:visible?"none":"translateY(24px)",transition:"opacity .7s ease,transform .7s ease",textAlign:"center"}}>

        {/* Tabs */}
        <div style={{display:"flex",gap:5,background:"rgba(255,255,255,.06)",borderRadius:50,padding:4,marginBottom:22,border:"1px solid rgba(255,255,255,.1)"}}>
          {[{id:"celebrate",l:"🎉 Celebrate"},{id:"wishes",l:"💌 Wishes"},{id:"gift",l:"🎰 Gift"}].map(t=>(
            <button key={t.id} onClick={e=>{e.stopPropagation();setTab(t.id);}} style={{flex:1,padding:"9px",borderRadius:46,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:".82rem",fontWeight:600,transition:"all .2s",background:tab===t.id?`linear-gradient(135deg,${T.a},${T.a2})`:"transparent",color:tab===t.id?"#1a1a2e":"rgba(255,255,255,.5)"}}>
              {t.l}
            </button>
          ))}
        </div>

        {tab==="celebrate"&&<>
          <ViewCounter a={T.a} name={data.name}/>
          <div style={{marginBottom:6}}><Countdown a={T.a}/></div>
          <div style={{marginBottom:12}}><CakeIcon a={T.a}/></div>

          <div style={{display:"inline-block",background:`linear-gradient(135deg,${T.a}22,${T.a2}18)`,border:`1px solid ${T.a}40`,borderRadius:100,padding:"4px 16px",marginBottom:12,color:T.a,fontSize:".76rem",fontWeight:600,letterSpacing:"2px",textTransform:"uppercase"}}>
            ✦ {L.hb} ✦
          </div>

          {data.age&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,background:`linear-gradient(135deg,${T.a}25,${T.a2}18)`,border:`1.5px solid ${T.a}45`,borderRadius:100,padding:"9px 20px",marginBottom:12,width:"fit-content",margin:"0 auto 12px",animation:"countUp .6s ease .3s both"}}>
            <span style={{fontSize:"1.3rem"}}>🎂</span>
            <span style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:".95rem",fontWeight:700}}>{L.turning.replace("{age}",data.age)}</span>
          </div>}

          <Avatar photo={data.photo} name={data.name} a={T.a} size={84}/>

          <h1 style={{fontFamily:"'Pacifico',cursive",fontSize:"clamp(2.4rem,10vw,4.8rem)",fontWeight:400,margin:"8px 0 6px",lineHeight:1.05,background:`linear-gradient(135deg,${T.a},${T.a2},#fff)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",backgroundSize:"200% auto",animation:"shimmer 4s linear infinite"}}>
            {data.name}
          </h1>
          <p style={{color:"rgba(255,255,255,.6)",fontFamily:"'Playfair Display',serif",fontStyle:"italic",marginBottom:12,fontSize:".92rem"}}>{L.td}</p>

          {data.sender&&<div style={{display:"inline-block",background:"rgba(255,255,255,.07)",borderRadius:100,padding:"5px 15px",marginBottom:14,color:"rgba(255,255,255,.5)",fontSize:".82rem"}}>
            {L.from} <span style={{color:T.a,fontWeight:600}}>{data.sender}</span> 💛
          </div>}

          <div style={{background:"rgba(255,255,255,.06)",backdropFilter:"blur(20px)",border:`1px solid ${T.a}22`,borderRadius:20,padding:"22px 20px",marginBottom:16,boxShadow:`0 20px 60px rgba(0,0,0,.35)`}}>
            <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"clamp(.95rem,3vw,1.2rem)",color:"rgba(255,255,255,.88)",lineHeight:1.65,margin:0}}>"{msg}"</p>
          </div>

          <EmojiReactions a={T.a} onTap={burst}/>

          <p style={{color:"rgba(255,255,255,.15)",fontSize:".7rem",marginTop:20}}>
            Made with 💛 · <a href={window.location.href.split("#")[0]} style={{color:T.a,textDecoration:"none",fontWeight:500}}>Create your own →</a>
          </p>
        </>}

        {tab==="wishes"&&<div onClick={e=>e.stopPropagation()}><WishBoard name={data.name} a={T.a} lang={data.lang||"en"}/></div>}

        {tab==="gift"&&<div onClick={e=>e.stopPropagation()} style={{padding:"16px 0"}}>
          <h3 style={{fontFamily:"'Playfair Display',serif",color:"#fff",fontSize:"1.15rem",marginBottom:5}}>🎰 Scratch to Reveal Your Gift!</h3>
          <p style={{color:"rgba(255,255,255,.4)",marginBottom:18,fontSize:".86rem"}}>Use your finger or mouse to scratch the card below</p>
          <ScratchCard accent={T.a} message={msg} sender={data.sender}/>
          <p style={{color:"rgba(255,255,255,.25)",fontSize:".75rem",marginTop:14}}>Scratch away to reveal a special message ✨</p>
        </div>}
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────── */
export default function App() {
  const [page,setPage]=useState("setup");
  const [data,setData]=useState(null);
  const [link,setLink]=useState("");

  useEffect(()=>{
    const h=window.location.hash;
    if(h.includes("bd=")){const m=h.match(/bd=([^&]+)/);if(m){const d=dec(m[1]);if(d?.name){setData(d);setPage("celebrate");}}}
    else{const m=h.match(/[?&]?name=([^&]+)/);if(m){setData({name:decodeURIComponent(m[1]),sender:"",message:"",age:"",theme:"gold",lang:"en",confetti:"classic",photo:null});setPage("celebrate");}}
  },[]);

  const gen=d=>{setData(d);setLink(`${window.location.href.split("#")[0]}#bd=${enc(d)}`);setPage("share");};

  return(<><FontLink/>
    {page==="setup"&&<SetupPage onGenerate={gen}/>}
    {page==="share"&&<SharePage data={data} link={link} onBack={()=>setPage("setup")}/>}
    {page==="celebrate"&&data&&<CelebrationPage data={data}/>}
  </>);
}
