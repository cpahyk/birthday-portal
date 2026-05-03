import { useState, useEffect, useRef } from "react";

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}body{overflow-x:hidden}
    input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.25)}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:4px}
  `}</style>
);

const THEMES = {
  gold:    {label:"Royal Gold",   emoji:"👑",bg:"linear-gradient(135deg,#0F0C29,#302B63,#24243E)",accent:"#FFD700",accent2:"#FF9F43",particles:["#FFD700","#FF6B6B","#FF9F43","#54A0FF","#C084FC","#FF3F81","#00D2D3"]},
  ocean:   {label:"Ocean Blue",   emoji:"🌊",bg:"linear-gradient(135deg,#0c1f3f,#0a3d62,#1e3799)",accent:"#00D2FF",accent2:"#0099CC",particles:["#00D2FF","#74b9ff","#0984e3","#a29bfe","#fd79a8","#55efc4","#fdcb6e"]},
  rose:    {label:"Rose Garden",  emoji:"🌸",bg:"linear-gradient(135deg,#2d1b35,#6c2645,#3d1a4a)",accent:"#FF6B9D",accent2:"#FF9FC7",particles:["#FF6B9D","#ffb3c6","#FF9FC7","#f9a8d4","#e879f9","#fbbf24","#34d399"]},
  emerald: {label:"Emerald",      emoji:"🌿",bg:"linear-gradient(135deg,#0a1628,#1a3a2a,#0d2b1a)",accent:"#00FF87",accent2:"#00CC6A",particles:["#00FF87","#00CC6A","#34d399","#6ee7b7","#fbbf24","#f472b6","#60a5fa"]},
  sunset:  {label:"Sunset",       emoji:"🌅",bg:"linear-gradient(135deg,#1a0a1e,#6b1f3a,#c0392b)",accent:"#FF6348",accent2:"#FFDD59",particles:["#FF6348","#FFDD59","#ff7f50","#ff4500","#ffa500","#ff69b4","#ff1493"]},
};

const encodeData = o => { try{return btoa(unescape(encodeURIComponent(JSON.stringify(o))))}catch{return""} };
const decodeData = s => { try{return JSON.parse(decodeURIComponent(escape(atob(s))))}catch{return null} };

function useConfetti(active,colors){
  const canvasRef=useRef(null),animRef=useRef(null),parts=useRef([]);
  useEffect(()=>{
    if(!active)return;
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight};
    resize();window.addEventListener("resize",resize);
    const shapes=["circle","rect","triangle"];
    const spawn=(n=14)=>{for(let i=0;i<n;i++)parts.current.push({x:Math.random()*c.width,y:-20,r:Math.random()*9+4,color:colors[Math.floor(Math.random()*colors.length)],shape:shapes[Math.floor(Math.random()*shapes.length)],vx:(Math.random()-.5)*5,vy:Math.random()*3+2,angle:Math.random()*Math.PI*2,spin:(Math.random()-.5)*.25,opacity:1})};
    let frame=0;
    const loop=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      if(frame%6===0)spawn(14);frame++;
      parts.current=parts.current.filter(p=>p.opacity>0.05);
      parts.current.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;p.angle+=p.spin;p.vy+=.07;
        if(p.y>c.height*.72)p.opacity-=.018;
        ctx.save();ctx.globalAlpha=p.opacity;ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillStyle=p.color;
        if(p.shape==="circle"){ctx.beginPath();ctx.arc(0,0,p.r,0,Math.PI*2);ctx.fill();}
        else if(p.shape==="rect"){ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r);}
        else{ctx.beginPath();ctx.moveTo(0,-p.r);ctx.lineTo(p.r,p.r);ctx.lineTo(-p.r,p.r);ctx.closePath();ctx.fill();}
        ctx.restore();
      });
      animRef.current=requestAnimationFrame(loop);
    };
    loop();
    return()=>{cancelAnimationFrame(animRef.current);window.removeEventListener("resize",resize)};
  },[active,colors]);
  return canvasRef;
}

function FloatingOrbs({accent}){
  const orbs=Array.from({length:10},(_,i)=>({id:i,size:Math.random()*200+80,left:Math.random()*100,top:Math.random()*100,delay:Math.random()*6,dur:Math.random()*8+10}));
  return(<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    {orbs.map(o=><div key={o.id} style={{position:"absolute",width:o.size,height:o.size,left:`${o.left}%`,top:`${o.top}%`,borderRadius:"50%",background:`radial-gradient(circle,${accent}18 0%,${accent}05 60%,transparent 80%)`,animation:`float ${o.dur}s ease-in-out ${o.delay}s infinite alternate`}}/>)}
    <style>{`@keyframes float{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-40px) scale(1.08)}}`}</style>
  </div>);
}

function Balloons({colors}){
  const list=colors.slice(0,5).map((c,i)=>({c,x:10+i*20,d:i*.4}));
  return(<div style={{position:"absolute",bottom:0,left:0,right:0,pointerEvents:"none"}}>
    {list.map((b,i)=>(
      <div key={i} style={{position:"absolute",left:`${b.x}%`,bottom:0,animation:`brise 3.5s ease-out ${b.d}s forwards`}}>
        <div style={{width:44,height:54,background:`radial-gradient(circle at 35% 35%,${b.c}ee,${b.c}88)`,borderRadius:"50% 50% 50% 50%/60% 60% 40% 40%",boxShadow:`inset -6px -6px 12px rgba(0,0,0,.18)`,position:"relative"}}>
          <div style={{position:"absolute",bottom:-2,left:"50%",transform:"translateX(-50%)",width:2,height:64,background:`${b.c}88`}}/>
        </div>
      </div>
    ))}
    <style>{`@keyframes brise{0%{transform:translateY(0);opacity:0}10%{opacity:1}100%{transform:translateY(-105vh);opacity:.5}}`}</style>
  </div>);
}

function SparkleText({children,accent}){
  return(<span style={{position:"relative",display:"inline-block"}}>
    {children}
    {["✦","✧","✦"].map((s,i)=><span key={i} style={{position:"absolute",fontSize:14+i*4,top:i===1?"-20px":"-10px",left:i===0?"-20px":i===2?"calc(100% + 4px)":"50%",transform:i===1?"translateX(-50%)":"none",animation:`twinkle 1.6s ease-in-out ${i*.45}s infinite alternate`,color:accent}}>{s}</span>)}
    <style>{`@keyframes twinkle{0%{opacity:.2;transform:scale(.8) rotate(0deg)}100%{opacity:1;transform:scale(1.4) rotate(22deg)}}`}</style>
  </span>);
}

function CakeIcon({accent}){
  return(<svg width="84" height="84" viewBox="0 0 84 84" fill="none">
    <rect x="10" y="42" width="64" height="32" rx="7" fill={accent} opacity=".85"/>
    <rect x="18" y="29" width="48" height="20" rx="6" fill="#FF9F43" opacity=".9"/>
    <rect x="25" y="20" width="34" height="16" rx="5" fill="#FFD700" opacity=".9"/>
    {[30,42,54].map((x,i)=><g key={i}><rect x={x-3} y="9" width="7" height="15" rx="3.5" fill={["#C084FC","#60A5FA","#F472B6"][i]}/><ellipse cx={x+.5} cy="8" rx="3.5" ry="6" fill="#FFD700" opacity=".9"><animate attributeName="ry" values="6;9;6" dur=".9s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;.4;.9" dur=".9s" repeatCount="indefinite"/></ellipse></g>)}
    <path d="M18 29 Q23 22 28 29 Q33 22 38 29 Q43 22 48 29 Q53 22 58 29 Q63 22 66 29" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
  </svg>);
}

function Fireworks({accent}){
  return(<div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
    {[10,26,42,58,74,90].map((x,i)=>(
      <div key={i} style={{position:"absolute",left:`${x}%`,top:"18%",animation:`fw 2.4s ease-out ${i*.5}s infinite`}}>
        {[0,45,90,135,180,225,270,315].map((deg,j)=>(
          <div key={j} style={{position:"absolute",width:3,height:30,background:`linear-gradient(${accent},transparent)`,transformOrigin:"top center",transform:`rotate(${deg}deg)`,animation:`ray 2.4s ease-out ${i*.5}s infinite`,borderRadius:3}}/>
        ))}
      </div>
    ))}
    <style>{`@keyframes fw{0%{opacity:0;transform:scale(0)}20%{opacity:1;transform:scale(1)}80%{opacity:.5}100%{opacity:0;transform:scale(1.5)}}@keyframes ray{0%{height:0;opacity:0}20%{height:30px;opacity:1}100%{height:60px;opacity:0}}`}</style>
  </div>);
}

function EmojiReactions({accent}){
  const [r,setR]=useState({});const [pop,setPop]=useState(null);
  const emojis=["🎉","❤️","🎂","🥳","🌟","🙏","😍","🎁"];
  const add=e=>{setR(p=>({...p,[e]:(p[e]||0)+1}));setPop(e);setTimeout(()=>setPop(null),500)};
  return(<div style={{marginTop:22}}>
    <p style={{color:"rgba(255,255,255,.4)",fontSize:".75rem",marginBottom:10,textTransform:"uppercase",letterSpacing:"1.5px"}}>Tap to react 💫</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
      {emojis.map(e=>(
        <button key={e} onClick={()=>add(e)} style={{background:pop===e?`${accent}44`:"rgba(255,255,255,.07)",border:`1px solid ${pop===e?accent:"rgba(255,255,255,.12)"}`,borderRadius:100,padding:"8px 14px",cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:5,transform:pop===e?"scale(1.2)":"scale(1)"}}>
          <span style={{fontSize:"1.3rem"}}>{e}</span>
          {r[e]>0&&<span style={{color:"rgba(255,255,255,.85)",fontSize:".85rem",fontWeight:600}}>{r[e]}</span>}
        </button>
      ))}
    </div>
  </div>);
}

function WishBoard({birthdayName,accent}){
  const [wishes,setWishes]=useState([{name:"A Friend",msg:"May all your dreams come true! 🌟",time:"Just now"}]);
  const [name,setName]=useState("");const [msg,setMsg]=useState("");const [sent,setSent]=useState(false);
  const submit=()=>{if(!name.trim()||!msg.trim())return;setWishes(p=>[{name:name.trim(),msg:msg.trim(),time:"Just now"},...p]);setName("");setMsg("");setSent(true);setTimeout(()=>setSent(false),2000)};
  const inp={width:"100%",padding:"11px 16px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,color:"#fff",fontSize:".95rem",fontFamily:"'DM Sans',sans-serif",outline:"none"};
  return(<div style={{marginTop:10,width:"100%",maxWidth:520,margin:"0 auto"}}>
    <h3 style={{fontFamily:"'Playfair Display',serif",color:"#fff",fontSize:"1.1rem",marginBottom:16,textAlign:"center"}}>💌 Leave a Wish for {birthdayName}</h3>
    <div style={{background:"rgba(255,255,255,.05)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,padding:20,marginBottom:14}}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{...inp,marginBottom:10}}/>
      <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Write your birthday wish..." rows={3} style={{...inp,resize:"none",lineHeight:1.5,marginBottom:12}}/>
      <button onClick={submit} style={{width:"100%",padding:"12px",background:sent?"linear-gradient(135deg,#34D399,#059669)":`linear-gradient(135deg,${accent},${accent}99)`,border:"none",borderRadius:10,color:"#1a1a2e",fontSize:".95rem",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .3s"}}>
        {sent?"✅ Wish Sent!":"Send Wish 💝"}
      </button>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {wishes.map((w,i)=>(
        <div key={i} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{color:accent,fontWeight:600,fontSize:".9rem"}}>✨ {w.name}</span>
            <span style={{color:"rgba(255,255,255,.3)",fontSize:".75rem"}}>{w.time}</span>
          </div>
          <p style={{color:"rgba(255,255,255,.8)",fontSize:".9rem",lineHeight:1.5}}>{w.msg}</p>
        </div>
      ))}
    </div>
  </div>);
}

function ThemePicker({selected,onChange}){
  return(<div>
    <label style={{display:"block",color:"rgba(255,255,255,.5)",fontSize:".73rem",fontWeight:500,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>Choose Theme</label>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {Object.entries(THEMES).map(([key,t])=>(
        <button key={key} onClick={()=>onChange(key)} style={{padding:"8px 14px",borderRadius:100,cursor:"pointer",background:selected===key?`linear-gradient(135deg,${t.accent},${t.accent2})`:"rgba(255,255,255,.07)",border:`1.5px solid ${selected===key?t.accent:"rgba(255,255,255,.15)"}`,color:selected===key?"#1a1a2e":"rgba(255,255,255,.7)",fontSize:".82rem",fontWeight:selected===key?700:400,transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>
          {t.emoji} {t.label}
        </button>
      ))}
    </div>
  </div>);
}

function SetupPage({onGenerate}){
  const [form,setForm]=useState({name:"",sender:"",message:"",age:"",theme:"gold"});
  const [focused,setFocused]=useState("");
  const theme=THEMES[form.theme];
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const inp=(f)=>({width:"100%",padding:"13px 16px",background:"rgba(255,255,255,.07)",border:`1.5px solid ${focused===f?theme.accent:"rgba(255,255,255,.12)"}`,borderRadius:11,color:"#fff",fontSize:"1rem",fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border .2s",marginBottom:12});
  const lbl={display:"block",color:"rgba(255,255,255,.5)",fontSize:".73rem",fontWeight:500,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6};

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:theme.bg,fontFamily:"'DM Sans',sans-serif",padding:"32px 20px",position:"relative",overflow:"hidden"}}>
      <FloatingOrbs accent={theme.accent}/>
      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:500}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{marginBottom:16,animation:"bounceIn .8s cubic-bezier(.36,.07,.19,.97) both"}}><CakeIcon accent={theme.accent}/></div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,6vw,3rem)",fontWeight:900,color:"#fff",lineHeight:1.15,marginBottom:6}}>
            Create a Birthday<br/>
            <span style={{background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontStyle:"italic"}}>Surprise 🎉</span>
          </h1>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:".9rem",fontWeight:300}}>Fill in the details, get a magic link, send it to them!</p>
        </div>

        <div style={{background:"rgba(255,255,255,.06)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.11)",borderRadius:22,padding:"28px 24px",boxShadow:"0 24px 64px rgba(0,0,0,.4)"}}>
          <label style={lbl}>Birthday Person's Name *</label>
          <input value={form.name} onChange={e=>set("name",e.target.value)} onFocus={()=>setFocused("name")} onBlur={()=>setFocused("")} onKeyDown={e=>e.key==="Enter"&&form.name.trim()&&onGenerate(form)} placeholder="e.g. Rahul, Priya, Alex..." style={inp("name")}/>

          <label style={lbl}>Your Name (From)</label>
          <input value={form.sender} onChange={e=>set("sender",e.target.value)} onFocus={()=>setFocused("sender")} onBlur={()=>setFocused("")} placeholder="e.g. Mom, Best Friend, Team..." style={inp("sender")}/>

          <label style={lbl}>Age Being Celebrated (optional)</label>
          <input value={form.age} onChange={e=>set("age",e.target.value.replace(/\D/,""))} onFocus={()=>setFocused("age")} onBlur={()=>setFocused("")} placeholder="e.g. 25, 30, 18..." maxLength={3} style={inp("age")}/>

          <label style={lbl}>Personal Message (optional)</label>
          <textarea value={form.message} onChange={e=>set("message",e.target.value)} onFocus={()=>setFocused("msg")} onBlur={()=>setFocused("")} placeholder="Write something special for them..." rows={3} style={{...inp("msg"),resize:"none",lineHeight:1.5,marginBottom:20}}/>

          <div style={{marginBottom:22}}><ThemePicker selected={form.theme} onChange={v=>set("theme",v)}/></div>

          <button onClick={()=>form.name.trim()&&onGenerate(form)} disabled={!form.name.trim()} style={{width:"100%",padding:"15px",background:form.name.trim()?`linear-gradient(135deg,${theme.accent},${theme.accent2})`:"rgba(255,255,255,.1)",border:"none",borderRadius:13,color:form.name.trim()?"#1a1a2e":"rgba(255,255,255,.3)",fontSize:"1rem",fontWeight:700,cursor:form.name.trim()?"pointer":"not-allowed",fontFamily:"'DM Sans',sans-serif",letterSpacing:".4px",transition:"all .25s",boxShadow:form.name.trim()?`0 8px 28px ${theme.accent}40`:"none"}}>
            ✨ Generate Surprise Link
          </button>
        </div>
        <p style={{color:"rgba(255,255,255,.18)",fontSize:".75rem",marginTop:18,textAlign:"center"}}>Free · No signup · 5 beautiful themes 🪄</p>
      </div>
      <style>{`@keyframes bounceIn{0%{opacity:0;transform:scale(.5) translateY(40px)}60%{transform:scale(1.15) translateY(-10px)}100%{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

function SharePage({data,link,onBack}){
  const theme=THEMES[data.theme]||THEMES.gold;
  const [copied,setCopied]=useState(false);const [wpSent,setWpSent]=useState(false);
  const copy=()=>navigator.clipboard.writeText(link).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500)});
  const whatsapp=()=>{window.open(`https://wa.me/?text=${encodeURIComponent(`🎂 Happy Birthday ${data.name}! I have a special surprise for you → ${link}`)}`,"_blank");setWpSent(true)};

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:theme.bg,fontFamily:"'DM Sans',sans-serif",padding:"32px 20px",position:"relative",overflow:"hidden"}}>
      <FloatingOrbs accent={theme.accent}/>
      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:500,textAlign:"center"}}>
        <div style={{fontSize:54,marginBottom:14,animation:"pop .6s cubic-bezier(.36,.07,.19,.97)"}}>🎊</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.6rem,5vw,2.3rem)",fontWeight:900,color:"#fff",marginBottom:6}}>
          Link Ready for <span style={{color:theme.accent,fontStyle:"italic"}}>{data.name}!</span>
        </h2>
        <p style={{color:"rgba(255,255,255,.4)",marginBottom:22,fontWeight:300}}>Share this link and watch their face light up ✨</p>

        <div style={{background:"rgba(255,255,255,.06)",backdropFilter:"blur(20px)",border:`1px solid ${theme.accent}30`,borderRadius:20,padding:"18px 22px",marginBottom:14,textAlign:"left"}}>
          <div style={{fontSize:".7rem",color:"rgba(255,255,255,.35)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>Preview of their surprise</div>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:"2rem"}}>🎂</span>
            <div>
              <div style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",fontWeight:700}}>Happy Birthday, {data.name}!</div>
              {data.age&&<div style={{color:theme.accent,fontSize:".82rem"}}>Turning {data.age} today 🎉</div>}
              {data.sender&&<div style={{color:"rgba(255,255,255,.4)",fontSize:".78rem"}}>From: {data.sender}</div>}
            </div>
          </div>
          {data.message&&<div style={{color:"rgba(255,255,255,.65)",fontSize:".85rem",fontStyle:"italic",borderLeft:`3px solid ${theme.accent}`,paddingLeft:10,lineHeight:1.5}}>"{data.message}"</div>}
          <div style={{marginTop:10,display:"flex",gap:6,alignItems:"center"}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:theme.accent}}/>
            <span style={{color:"rgba(255,255,255,.3)",fontSize:".72rem"}}>{theme.emoji} {theme.label} theme</span>
          </div>
        </div>

        <div style={{background:"rgba(0,0,0,.25)",borderRadius:10,padding:"10px 14px",marginBottom:12,wordBreak:"break-all",color:"rgba(255,255,255,.45)",fontSize:".75rem",fontFamily:"monospace",border:"1px solid rgba(255,255,255,.07)",textAlign:"left"}}>{link}</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          <button onClick={copy} style={{padding:"13px",background:copied?"linear-gradient(135deg,#34D399,#059669)":`linear-gradient(135deg,${theme.accent},${theme.accent2})`,border:"none",borderRadius:12,color:copied?"#fff":"#1a1a2e",fontSize:".92rem",fontWeight:700,cursor:"pointer",transition:"all .3s",fontFamily:"'DM Sans',sans-serif"}}>
            {copied?"✅ Copied!":"📋 Copy Link"}
          </button>
          <button onClick={whatsapp} style={{padding:"13px",background:wpSent?"linear-gradient(135deg,#25D366,#128C7E)":"rgba(37,211,102,.14)",border:`1.5px solid ${wpSent?"#25D366":"rgba(37,211,102,.4)"}`,borderRadius:12,color:"#fff",fontSize:".92rem",fontWeight:700,cursor:"pointer",transition:"all .3s",fontFamily:"'DM Sans',sans-serif"}}>
            {wpSent?"✅ Sent!":"💬 WhatsApp"}
          </button>
        </div>

        {[{icon:"1️⃣",text:`Share the link with ${data.name}`},{icon:"2️⃣",text:"They open it and get a beautiful surprise 🎉"},{icon:"3️⃣",text:"They can react & leave wishes 💌"}].map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,.04)",borderRadius:10,padding:"10px 14px",marginBottom:8,textAlign:"left",border:"1px solid rgba(255,255,255,.06)"}}>
            <span style={{fontSize:18}}>{s.icon}</span>
            <span style={{color:"rgba(255,255,255,.6)",fontSize:".86rem"}}>{s.text}</span>
          </div>
        ))}

        <button onClick={onBack} style={{marginTop:18,background:"transparent",border:"1px solid rgba(255,255,255,.18)",borderRadius:10,color:"rgba(255,255,255,.4)",padding:"10px 24px",cursor:"pointer",fontSize:".86rem",fontFamily:"'DM Sans',sans-serif"}}>
          ← Create another
        </button>
      </div>
      <style>{`@keyframes pop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>
    </div>
  );
}

function CelebrationPage({data}){
  const theme=THEMES[data.theme]||THEMES.gold;
  const canvasRef=useConfetti(true,theme.particles);
  const [visible,setVisible]=useState(false);
  const [tab,setTab]=useState("celebrate");
  useEffect(()=>{setTimeout(()=>setVisible(true),120)},[]);
  const msgs=["May your day be as wonderful as you are!","Wishing you a lifetime of happiness!","Here's to another year of amazing adventures!","You deserve all the love and joy in the world!","May every dream you have come true! 🌠"];
  const msg=data.message||msgs[data.name.length%msgs.length];

  return(
    <div style={{minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",background:theme.bg,position:"relative",overflow:"hidden"}}>
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1}}/>
      <FloatingOrbs accent={theme.accent}/>
      <Balloons colors={theme.particles}/>
      <Fireworks accent={theme.accent}/>

      <div style={{position:"relative",zIndex:10,maxWidth:580,margin:"0 auto",padding:"40px 20px 60px",opacity:visible?1:0,transform:visible?"none":"translateY(28px)",transition:"all .9s cubic-bezier(0.16,1,0.3,1)",textAlign:"center"}}>

        <div style={{display:"flex",gap:6,background:"rgba(255,255,255,.06)",borderRadius:50,padding:4,marginBottom:28,border:"1px solid rgba(255,255,255,.1)"}}>
          {[{id:"celebrate",label:"🎉 Celebrate"},{id:"wishes",label:"💌 Wishes"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px",borderRadius:46,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:".9rem",fontWeight:600,transition:"all .25s",background:tab===t.id?`linear-gradient(135deg,${theme.accent},${theme.accent2})`:"transparent",color:tab===t.id?"#1a1a2e":"rgba(255,255,255,.5)"}}>
              {t.label}
            </button>
          ))}
        </div>

        {tab==="celebrate"&&<>
          <div style={{marginBottom:14,animation:"bounce 2s ease-in-out infinite"}}><CakeIcon accent={theme.accent}/></div>

          <div style={{display:"inline-block",background:`linear-gradient(135deg,${theme.accent}22,${theme.accent2}18)`,border:`1px solid ${theme.accent}40`,borderRadius:100,padding:"5px 18px",marginBottom:14,color:theme.accent,fontSize:".78rem",fontWeight:600,letterSpacing:"2px",textTransform:"uppercase"}}>
            ✦ Happy Birthday ✦
          </div>

          {data.age&&(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:`linear-gradient(135deg,${theme.accent}28,${theme.accent2}18)`,border:`1.5px solid ${theme.accent}50`,borderRadius:100,padding:"10px 24px",marginBottom:16,width:"fit-content",margin:"0 auto 16px"}}>
              <span style={{fontSize:"1.4rem"}}>🎂</span>
              <span style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",fontWeight:700}}>Turning <span style={{color:theme.accent}}>{data.age}</span> Today!</span>
            </div>
          )}

          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(3rem,11vw,5.5rem)",fontWeight:900,margin:"0 0 8px",lineHeight:1.05,textShadow:`0 0 60px ${theme.accent}50`}}>
            <SparkleText accent={theme.accent}>
              <span style={{background:`linear-gradient(135deg,${theme.accent},${theme.accent2},#fff)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{data.name}</span>
            </SparkleText>
            <span style={{display:"block",fontSize:"43%",fontWeight:400,fontStyle:"italic",color:"rgba(255,255,255,.7)",marginTop:8}}>Today is YOUR day!</span>
          </h1>

          {data.sender&&<div style={{display:"inline-block",background:"rgba(255,255,255,.07)",borderRadius:100,padding:"6px 18px",marginBottom:18,color:"rgba(255,255,255,.55)",fontSize:".85rem"}}>
            With love from <span style={{color:theme.accent,fontWeight:600}}>{data.sender}</span> 💛
          </div>}

          <div style={{background:"rgba(255,255,255,.06)",backdropFilter:"blur(24px)",border:`1px solid ${theme.accent}25`,borderRadius:22,padding:"28px 24px",marginBottom:20,boxShadow:`0 32px 80px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.08)`}}>
            <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"clamp(1.05rem,3vw,1.3rem)",color:"rgba(255,255,255,.88)",lineHeight:1.65,margin:0}}>"{msg}"</p>
          </div>

          <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:16}}>
            {["🎁","🥂","🌟","🎈","💫","🎊"].map((e,i)=><span key={i} style={{fontSize:"clamp(1.3rem,4vw,1.9rem)",animation:`wobble 2.2s ease-in-out ${i*.28}s infinite`}}>{e}</span>)}
          </div>

          <EmojiReactions accent={theme.accent}/>

          <p style={{color:"rgba(255,255,255,.18)",fontSize:".75rem",marginTop:28}}>
            Made with 💛 · <a href={window.location.href.split("#")[0]} style={{color:theme.accent,textDecoration:"none",fontWeight:500}}>Create your own →</a>
          </p>
        </>}

        {tab==="wishes"&&<WishBoard birthdayName={data.name} accent={theme.accent}/>}
      </div>

      <style>{`@keyframes bounce{0%,100%{transform:scale(1) rotate(-3deg)}50%{transform:scale(1.08) rotate(3deg)}}@keyframes wobble{0%,100%{transform:rotate(-6deg) scale(1)}50%{transform:rotate(6deg) scale(1.18)}}`}</style>
    </div>
  );
}

export default function BirthdayPortal(){
  const [page,setPage]=useState("setup");
  const [formData,setFormData]=useState(null);
  const [shareLink,setShareLink]=useState("");

  useEffect(()=>{
    const hash=window.location.hash;
    if(hash.includes("bd=")){
      const m=hash.match(/bd=([^&]+)/);
      if(m){const d=decodeData(m[1]);if(d?.name){setFormData(d);setPage("celebrate");}}
    } else {
      const m=hash.match(/[?&]?name=([^&]+)/);
      if(m){setFormData({name:decodeURIComponent(m[1]),sender:"",message:"",age:"",theme:"gold"});setPage("celebrate");}
    }
  },[]);

  const handleGenerate=data=>{
    setFormData(data);
    setShareLink(`${window.location.href.split("#")[0]}#bd=${encodeData(data)}`);
    setPage("share");
  };

  return(<>
    <FontLink/>
    {page==="setup"&&<SetupPage onGenerate={handleGenerate}/>}
    {page==="share"&&<SharePage data={formData} link={shareLink} onBack={()=>setPage("setup")}/>}
    {page==="celebrate"&&formData&&<CelebrationPage data={formData}/>}
  </>);
}
