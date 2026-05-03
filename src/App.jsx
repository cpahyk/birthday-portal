import { useState, useEffect, useRef } from "react";

// ── Google Fonts ──────────────────────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
  `}</style>
);

// ── Confetti particle ─────────────────────────────────────────────────────────
function useConfetti(active) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#FFD700","#FF6B6B","#FF9F43","#54A0FF","#5F27CD","#FF3F81","#00D2D3","#FFEAA7"];
    const shapes = ["circle","rect","triangle"];

    const spawn = (n = 15) => {
      for (let i = 0; i < n; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: -20,
          r: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 3 + 2,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.2,
          opacity: 1,
        });
      }
    };

    let frame = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (frame % 8 === 0) spawn(12);
      frame++;

      particles.current = particles.current.filter(p => p.opacity > 0.05);
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.vy += 0.06;
        if (p.y > canvas.height * 0.7) p.opacity -= 0.02;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "rect") {
          ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.r);
          ctx.lineTo(p.r, p.r);
          ctx.lineTo(-p.r, p.r);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return canvasRef;
}

// ── Floating orbs background ──────────────────────────────────────────────────
function FloatingOrbs() {
  const orbs = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 200 + 80,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 6,
    duration: Math.random() * 8 + 10,
    color: ["#FFD700","#FF6B6B","#C084FC","#60A5FA","#F472B6","#34D399"][i % 6],
  }));

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {orbs.map(o => (
        <div key={o.id} style={{
          position:"absolute",
          width: o.size,
          height: o.size,
          left: `${o.left}%`,
          top: `${o.top}%`,
          borderRadius:"50%",
          background: `radial-gradient(circle, ${o.color}22 0%, ${o.color}05 60%, transparent 80%)`,
          animation: `float ${o.duration}s ease-in-out ${o.delay}s infinite alternate`,
        }} />
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-40px) scale(1.08); }
        }
      `}</style>
    </div>
  );
}

// ── Sparkle text ──────────────────────────────────────────────────────────────
function SparkleText({ children }) {
  return (
    <span style={{ position:"relative", display:"inline-block" }}>
      {children}
      {["✦","✧","✦"].map((s, i) => (
        <span key={i} style={{
          position:"absolute",
          fontSize: 14 + i * 4,
          top: i === 1 ? "-18px" : "-8px",
          left: i === 0 ? "-18px" : i === 2 ? "calc(100% + 4px)" : "50%",
          transform: i === 1 ? "translateX(-50%)" : "none",
          animation: `twinkle 1.5s ease-in-out ${i * 0.4}s infinite alternate`,
          color: "#FFD700",
        }}>{s}</span>
      ))}
      <style>{`
        @keyframes twinkle {
          0% { opacity:0.2; transform: scale(0.8) rotate(0deg); }
          100% { opacity:1; transform: scale(1.3) rotate(20deg); }
        }
      `}</style>
    </span>
  );
}

// ── Balloons ──────────────────────────────────────────────────────────────────
function Balloons() {
  const list = [
    { color:"#FF6B6B", x:8, delay:0 },
    { color:"#FFD700", x:20, delay:0.8 },
    { color:"#C084FC", x:75, delay:0.3 },
    { color:"#60A5FA", x:88, delay:1.2 },
    { color:"#F472B6", x:50, delay:0.5 },
  ];
  return (
    <div style={{ position:"absolute", bottom:0, left:0, right:0, pointerEvents:"none" }}>
      {list.map((b, i) => (
        <div key={i} style={{
          position:"absolute",
          left:`${b.x}%`,
          bottom:0,
          animation:`rise 3s ease-out ${b.delay}s forwards`,
        }}>
          <div style={{
            width:44, height:52,
            background:`radial-gradient(circle at 35% 35%, ${b.color}dd, ${b.color}88)`,
            borderRadius:"50% 50% 50% 50% / 60% 60% 40% 40%",
            position:"relative",
            boxShadow:`inset -6px -6px 12px rgba(0,0,0,0.15)`,
          }}>
            <div style={{
              position:"absolute", bottom:-2, left:"50%", transform:"translateX(-50%)",
              width:2, height:60, background:`${b.color}99`,
            }} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes rise {
          0% { transform: translateY(0); opacity:0; }
          10% { opacity:1; }
          100% { transform: translateY(-100vh); opacity:0.6; }
        }
      `}</style>
    </div>
  );
}

// ── Cake SVG ──────────────────────────────────────────────────────────────────
function CakeIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="10" y="40" width="60" height="30" rx="6" fill="#FF6B6B" opacity="0.9"/>
      <rect x="18" y="28" width="44" height="18" rx="5" fill="#FF9F43" opacity="0.9"/>
      <rect x="24" y="20" width="32" height="14" rx="4" fill="#FFD700" opacity="0.9"/>
      {/* Candles */}
      {[30, 40, 50].map((x, i) => (
        <g key={i}>
          <rect x={x-3} y="10" width="6" height="14" rx="3" fill={["#C084FC","#60A5FA","#F472B6"][i]}/>
          <ellipse cx={x} cy="9" rx="3" ry="5" fill="#FFD700" opacity="0.9">
            <animate attributeName="ry" values="5;7;5" dur="0.8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.9;0.5;0.9" dur="0.8s" repeatCount="indefinite"/>
          </ellipse>
        </g>
      ))}
      {/* Frosting */}
      <path d="M18 28 Q22 22 26 28 Q30 22 34 28 Q38 22 42 28 Q46 22 50 28 Q54 22 58 28 Q62 22 62 28" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ── SETUP PAGE ────────────────────────────────────────────────────────────────
function SetupPage({ onGenerate }) {
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (name.trim()) onGenerate(name.trim());
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:"linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)",
      fontFamily:"'DM Sans', sans-serif",
      padding:"32px 20px",
      position:"relative", overflow:"hidden",
    }}>
      <FloatingOrbs />

      <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:480, textAlign:"center" }}>
        {/* Icon */}
        <div style={{ marginBottom:24, animation:"bounceIn 0.8s cubic-bezier(.36,.07,.19,.97) both" }}>
          <CakeIcon />
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily:"'Playfair Display', serif",
          fontSize:"clamp(2rem, 6vw, 3.2rem)",
          fontWeight:900,
          color:"#fff",
          margin:"0 0 8px",
          lineHeight:1.15,
          letterSpacing:"-0.5px",
        }}>
          Create a Birthday<br/>
          <span style={{ color:"#FFD700", fontStyle:"italic" }}>Surprise 🎉</span>
        </h1>

        <p style={{
          color:"rgba(255,255,255,0.55)",
          fontSize:"1rem",
          marginBottom:40,
          fontWeight:300,
          letterSpacing:"0.2px",
        }}>
          Enter the birthday person's name, get a magic link,<br/>and share it with them!
        </p>

        {/* Input card */}
        <div style={{
          background:"rgba(255,255,255,0.06)",
          backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:20,
          padding:"32px 28px",
          boxShadow:"0 24px 64px rgba(0,0,0,0.4)",
        }}>
          <label style={{
            display:"block", textAlign:"left",
            color:"rgba(255,255,255,0.6)", fontSize:"0.78rem",
            fontWeight:500, letterSpacing:"1.5px", textTransform:"uppercase",
            marginBottom:10,
          }}>
            Birthday Person's Name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Priya, Rahul, Sarah..."
            style={{
              width:"100%", boxSizing:"border-box",
              padding:"16px 20px",
              background:"rgba(255,255,255,0.08)",
              border:`1.5px solid ${focused ? "#FFD700" : "rgba(255,255,255,0.15)"}`,
              borderRadius:12, color:"#fff", fontSize:"1.1rem",
              fontFamily:"'Playfair Display', serif",
              outline:"none",
              transition:"border 0.2s",
              letterSpacing:"0.3px",
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{
              marginTop:20, width:"100%",
              padding:"16px",
              background: name.trim()
                ? "linear-gradient(135deg, #FFD700 0%, #FF9F43 100%)"
                : "rgba(255,255,255,0.1)",
              border:"none", borderRadius:12,
              color: name.trim() ? "#1a1a2e" : "rgba(255,255,255,0.3)",
              fontSize:"1rem", fontWeight:700,
              fontFamily:"'DM Sans', sans-serif",
              cursor: name.trim() ? "pointer" : "not-allowed",
              letterSpacing:"0.5px",
              transition:"all 0.25s",
              transform: name.trim() ? "scale(1)" : "scale(0.98)",
              boxShadow: name.trim() ? "0 8px 24px rgba(255,215,0,0.35)" : "none",
            }}
          >
            ✨ Generate Surprise Link
          </button>
        </div>

        <p style={{ color:"rgba(255,255,255,0.25)", fontSize:"0.78rem", marginTop:24 }}>
          No sign-up needed · Free forever · Instant magic 🪄
        </p>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% { opacity:0; transform:scale(0.5) translateY(40px); }
          60% { transform:scale(1.15) translateY(-10px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}

// ── SHARE PAGE ────────────────────────────────────────────────────────────────
function SharePage({ name, link, onBack }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:"linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)",
      fontFamily:"'DM Sans', sans-serif",
      padding:"32px 20px",
      position:"relative", overflow:"hidden",
    }}>
      <FloatingOrbs />

      <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:500, textAlign:"center" }}>
        <div style={{ fontSize:56, marginBottom:16, animation:"pop 0.6s cubic-bezier(.36,.07,.19,.97)" }}>🎊</div>

        <h2 style={{
          fontFamily:"'Playfair Display', serif",
          fontSize:"clamp(1.6rem, 5vw, 2.4rem)", fontWeight:900,
          color:"#fff", margin:"0 0 8px",
        }}>
          Link Ready for{" "}
          <span style={{ color:"#FFD700", fontStyle:"italic" }}>{name}!</span>
        </h2>

        <p style={{ color:"rgba(255,255,255,0.5)", marginBottom:32, fontWeight:300 }}>
          Share this link and watch their face light up ✨
        </p>

        {/* Link box */}
        <div style={{
          background:"rgba(255,255,255,0.06)", backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:20, padding:"28px",
          boxShadow:"0 24px 64px rgba(0,0,0,0.4)",
          marginBottom:20,
        }}>
          <div style={{
            background:"rgba(0,0,0,0.3)", borderRadius:10,
            padding:"14px 16px", marginBottom:16,
            wordBreak:"break-all", color:"rgba(255,255,255,0.7)",
            fontSize:"0.82rem", textAlign:"left",
            border:"1px solid rgba(255,255,255,0.08)",
            fontFamily:"monospace",
          }}>
            {link}
          </div>

          <button onClick={copy} style={{
            width:"100%", padding:"15px",
            background: copied
              ? "linear-gradient(135deg, #34D399, #059669)"
              : "linear-gradient(135deg, #FFD700, #FF9F43)",
            border:"none", borderRadius:12,
            color: "#1a1a2e", fontSize:"1rem", fontWeight:700,
            cursor:"pointer", transition:"all 0.3s",
            boxShadow: copied
              ? "0 8px 24px rgba(52,211,153,0.4)"
              : "0 8px 24px rgba(255,215,0,0.35)",
          }}>
            {copied ? "✅ Copied to Clipboard!" : "📋 Copy Link"}
          </button>
        </div>

        {/* Instruction chips */}
        {[
          { icon:"1️⃣", text:"Copy the link above" },
          { icon:"2️⃣", text:`Share it with ${name} via WhatsApp, SMS, or email` },
          { icon:"3️⃣", text:"They open the link and get surprised! 🎉" },
        ].map((step, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", gap:12,
            background:"rgba(255,255,255,0.05)", borderRadius:10,
            padding:"12px 16px", marginBottom:10, textAlign:"left",
            border:"1px solid rgba(255,255,255,0.07)",
            animation:`slideIn 0.4s ease ${i * 0.1 + 0.3}s both`,
          }}>
            <span style={{ fontSize:20 }}>{step.icon}</span>
            <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.9rem" }}>{step.text}</span>
          </div>
        ))}

        <button onClick={onBack} style={{
          marginTop:24, background:"transparent", border:"1px solid rgba(255,255,255,0.2)",
          borderRadius:10, color:"rgba(255,255,255,0.5)", padding:"10px 24px",
          cursor:"pointer", fontSize:"0.9rem", transition:"all 0.2s",
        }}>
          ← Create another
        </button>
      </div>

      <style>{`
        @keyframes pop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}

// ── BIRTHDAY CELEBRATION PAGE ─────────────────────────────────────────────────
function CelebrationPage({ name }) {
  const canvasRef = useConfetti(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const messages = [
    "May your day be as wonderful as you are!",
    "Wishing you a lifetime of happiness and smiles!",
    "Here's to another year of amazing adventures!",
    "You deserve all the love and joy today!",
  ];
  const message = messages[name.length % messages.length];

  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:"linear-gradient(160deg, #1a0533 0%, #2D1B69 40%, #0f2044 100%)",
      fontFamily:"'DM Sans', sans-serif",
      padding:"32px 20px", textAlign:"center",
      position:"relative", overflow:"hidden",
    }}>
      {/* Confetti canvas */}
      <canvas ref={canvasRef} style={{
        position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none",
      }} />

      <FloatingOrbs />
      <Balloons />

      <div style={{
        position:"relative", zIndex:10, maxWidth:560,
        opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)",
        transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Party header */}
        <div style={{ fontSize:"clamp(3rem,10vw,5rem)", lineHeight:1, marginBottom:8,
          animation:"pulse 1.5s ease-in-out infinite alternate" }}>
          🎂
        </div>

        <div style={{
          display:"inline-block",
          background:"linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,159,67,0.15))",
          border:"1px solid rgba(255,215,0,0.3)",
          borderRadius:100, padding:"6px 20px", marginBottom:24,
          color:"#FFD700", fontSize:"0.8rem", fontWeight:600, letterSpacing:"2px",
          textTransform:"uppercase",
        }}>
          ✦ Happy Birthday ✦
        </div>

        <h1 style={{
          fontFamily:"'Playfair Display', serif",
          fontSize:"clamp(2.8rem, 10vw, 5.5rem)",
          fontWeight:900, color:"#fff",
          margin:"0 0 16px", lineHeight:1.05,
          textShadow:"0 0 60px rgba(255,215,0,0.4)",
        }}>
          <SparkleText>
            <span style={{
              background:"linear-gradient(135deg, #FFD700 0%, #FF9F43 50%, #FF6B6B 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text",
            }}>
              {name}
            </span>
          </SparkleText>
          <span style={{ display:"block", fontSize:"55%", fontWeight:400, fontStyle:"italic",
            color:"rgba(255,255,255,0.8)", marginTop:8 }}>
            Today is YOUR day!
          </span>
        </h1>

        {/* Message card */}
        <div style={{
          background:"rgba(255,255,255,0.06)", backdropFilter:"blur(24px)",
          border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:24, padding:"32px 28px",
          boxShadow:"0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          marginBottom:28,
        }}>
          <p style={{
            fontFamily:"'Playfair Display', serif", fontStyle:"italic",
            fontSize:"clamp(1.1rem, 3vw, 1.4rem)", color:"rgba(255,255,255,0.9)",
            lineHeight:1.6, margin:0,
          }}>
            "{message}"
          </p>
        </div>

        {/* Emoji row */}
        <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:28 }}>
          {["🎁","🥂","🌟","🎈","💫"].map((e, i) => (
            <span key={i} style={{
              fontSize:"clamp(1.4rem, 4vw, 2rem)",
              animation:`wobble 2s ease-in-out ${i * 0.3}s infinite`,
            }}>{e}</span>
          ))}
        </div>

        {/* Create your own */}
        <p style={{
          color:"rgba(255,255,255,0.3)", fontSize:"0.78rem",
          fontWeight:300, letterSpacing:"0.3px",
        }}>
          Made with 💛 · Want to create one?{" "}
          <a href={window.location.href.split("#")[0]} style={{
            color:"#FFD700", textDecoration:"none", fontWeight:500,
          }}>
            Click here →
          </a>
        </p>
      </div>

      <style>{`
        @keyframes pulse { 0%{transform:scale(1)} 100%{transform:scale(1.1)} }
        @keyframes wobble {
          0%,100%{transform:rotate(-5deg) scale(1)}
          50%{transform:rotate(5deg) scale(1.15)}
        }
      `}</style>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function BirthdayPortal() {
  const [page, setPage] = useState("setup"); // setup | share | celebrate
  const [birthdayName, setBirthdayName] = useState("");
  const [shareLink, setShareLink] = useState("");

  // On mount: check hash for a name
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/[?&]?name=([^&]+)/);
    if (match) {
      const decoded = decodeURIComponent(match[1]);
      setBirthdayName(decoded);
      setPage("celebrate");
    }
  }, []);

  const handleGenerate = (name) => {
    setBirthdayName(name);
    // Build shareable URL using current origin + hash param
    const base = window.location.href.split("#")[0];
    const link = `${base}#name=${encodeURIComponent(name)}`;
    setShareLink(link);
    setPage("share");
  };

  return (
    <>
      <FontLink />
      {page === "setup" && <SetupPage onGenerate={handleGenerate} />}
      {page === "share" && <SharePage name={birthdayName} link={shareLink} onBack={() => setPage("setup")} />}
      {page === "celebrate" && <CelebrationPage name={birthdayName} />}
    </>
  );
}
