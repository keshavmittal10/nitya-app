"use client";
import { useState, useRef } from "react";

export default function Splash({ onEnter, onLogin }: {
  onEnter: () => void;
  onLogin: (phone: string) => void;
}) {
  const [mode, setMode] = useState<"splash" | "login" | "otp">("splash");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [err, setErr] = useState("");
  const [verifying, setVerifying] = useState(false);
  const refs = [useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null)];

  const sendOtp = () => {
    if (phone.length !== 10) { setErr("Valid 10-digit number required"); return; }
    setErr(""); setMode("otp");
    setTimeout(() => refs[0].current?.focus(), 120);
  };
  const handleDigit = (val: string, i: number) => {
    const d = val.replace(/\D/g,"").slice(-1);
    const n = [...otp]; n[i] = d; setOtp(n); setErr("");
    if (d && i < 5) setTimeout(() => refs[i+1].current?.focus(), 30);
  };
  const handleKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      refs[i-1].current?.focus();
      const n = [...otp]; n[i-1] = ""; setOtp(n);
    }
  };
  const verify = () => {
    if (otp.join("").length !== 6) { setErr("Enter 6-digit OTP"); return; }
    setVerifying(true);
    setTimeout(() => { setVerifying(false); onLogin(phone); }, 1400);
  };

  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(175deg,#1E0C00 0%,#2C1400 45%,#1A0A00 100%)", display:"flex", flexDirection:"column", alignItems:"center", position:"relative", overflow:"hidden" }}>
      {/* ambient glow */}
      <div style={{ position:"absolute", top:-40, left:"50%", width:300, height:300, background:"radial-gradient(circle,rgba(255,120,0,.18) 0%,transparent 68%)", borderRadius:"50%", animation:"glowBreath 5s ease-in-out infinite alternate", transform:"translateX(-50%)", pointerEvents:"none", zIndex:0 }}/>

      {/* status bar */}
      <div style={{ width:"100%", display:"flex", justifyContent:"space-between", padding:"14px 24px 0", fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, color:"rgba(200,170,255,.4)", flexShrink:0, zIndex:10 }}>
        <span>{new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span><span>▶ ▌▌ ▊</span>
      </div>

      {/* Sun + OM */}
      <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", paddingTop: mode==="splash"?28:16, zIndex:5, animation:"fadeDown 1s .2s cubic-bezier(.16,1,.3,1) both", transition:"padding .3s" }}>
        <div style={{ position:"relative", width:mode==="splash"?150:100, height:mode==="splash"?150:100, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .4s" }}>
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", animation:"spinRay 30s linear infinite", opacity:.5 }} viewBox="0 0 130 130" fill="none">
            <g stroke="rgba(255,180,60,.6)" strokeWidth="1" strokeLinecap="round">
              <line x1="65" y1="4" x2="65" y2="20"/><line x1="65" y1="110" x2="65" y2="126"/>
              <line x1="4" y1="65" x2="20" y2="65"/><line x1="110" y1="65" x2="126" y2="65"/>
              <line x1="23" y1="23" x2="34" y2="34"/><line x1="96" y1="96" x2="107" y2="107"/>
              <line x1="107" y1="23" x2="96" y2="34"/><line x1="34" y1="96" x2="23" y2="107"/>
            </g>
          </svg>
          <div style={{ width:mode==="splash"?84:58, height:mode==="splash"?84:58, borderRadius:"50%", background:"radial-gradient(circle at 38% 36%,#FFE566,#FF9200 52%,#D94E00)", animation:"sunPulse 4s ease-in-out infinite alternate", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1, transition:"all .4s" }}>
            <span style={{ fontFamily:"'Noto Sans Devanagari',serif", fontSize:mode==="splash"?36:24, fontWeight:500, color:"rgba(60,18,0,.7)", lineHeight:1, marginTop:mode==="splash"?5:3, transition:"font-size .4s" }}>ॐ</span>
          </div>
        </div>
      </div>

      {/* Diya — only on splash */}
      {mode==="splash"&&(
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", zIndex:5, width:"100%" }}>
          <svg style={{ position:"absolute", width:220, height:220, opacity:.06, animation:"spinSlow 90s linear infinite" }} viewBox="0 0 220 220" fill="none">
            <circle cx="110" cy="110" r="108" stroke="#FFB830" strokeWidth=".6" strokeDasharray="4 7"/>
            <circle cx="110" cy="110" r="86" stroke="#FFB830" strokeWidth=".5" strokeDasharray="2 8"/>
            <circle cx="110" cy="110" r="62" stroke="#FFB830" strokeWidth=".6" strokeDasharray="3 5"/>
            <circle cx="110" cy="110" r="38" stroke="#FFB830" strokeWidth=".5"/>
            <circle cx="110" cy="110" r="14" stroke="#FFB830" strokeWidth=".7"/>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(d=><ellipse key={d} cx="110" cy="70" rx="5" ry="16" transform={`rotate(${d} 110 110)`} stroke="#FFB830" strokeWidth=".5"/>)}
          </svg>
          {/* Diya SVG */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", animation:"fadeUp .9s .5s cubic-bezier(.16,1,.3,1) both" }}>
            <svg width="110" height="96" viewBox="0 0 110 96" fill="none">
              <defs>
                <radialGradient id="fo"><stop offset="0%" stopColor="#FF9800"/><stop offset="55%" stopColor="#FF5722"/><stop offset="100%" stopColor="#BF360C" stopOpacity="0"/></radialGradient>
                <radialGradient id="fi"><stop offset="0%" stopColor="#FFFDE7"/><stop offset="100%" stopColor="#FFD54F" stopOpacity=".2"/></radialGradient>
                <linearGradient id="db" x1="55" y1="48" x2="55" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#C47010"/><stop offset="55%" stopColor="#9A4E08"/><stop offset="100%" stopColor="#6B3200"/></linearGradient>
                <linearGradient id="hg" x1="78" y1="68" x2="92" y2="54" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#C47010"/><stop offset="100%" stopColor="#8B4500"/></linearGradient>
              </defs>
              <g style={{ transformOrigin:"50% 100%", animation:"flicker 1.5s ease-in-out infinite alternate" }}>
                <ellipse cx="55" cy="26" rx="8" ry="16" fill="url(#fo)"/>
                <ellipse cx="55" cy="28" rx="4.5" ry="9" fill="url(#fi)"/>
                <ellipse cx="55" cy="31" rx="2" ry="4" fill="#FFFDE7"/>
              </g>
              <line x1="55" y1="48" x2="55" y2="42" stroke="rgba(255,180,60,.55)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M24 58 Q26 50 55 50 Q84 50 86 58 L81 74 Q79 80 55 80 Q31 80 29 74 Z" fill="url(#db)"/>
              <ellipse cx="46" cy="64" rx="8" ry="3" fill="rgba(255,220,100,.18)"/>
              <path d="M26 58 Q28 51 55 51 Q82 51 84 58" stroke="rgba(255,210,100,.35)" strokeWidth="1" fill="none"/>
              <path d="M80 70 Q92 66 90 56 Q88 48 80 52" stroke="url(#hg)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ width:90, height:18, background:"radial-gradient(ellipse,rgba(255,150,30,.45) 0%,transparent 70%)", borderRadius:"50%", marginTop:-6, animation:"flamePulse 1.4s ease-in-out infinite alternate" }}/>
          </div>
        </div>
      )}

      {/* Bottom panel */}
      <div style={{ ...(mode==="splash"?{flexShrink:0}:{flex:1,justifyContent:"center"}), width:"100%", display:"flex", flexDirection:"column", alignItems:"center", padding:mode==="splash"?"22px 28px 34px":"16px 24px 44px", background:"linear-gradient(180deg,transparent 0%,rgba(14,6,0,.82) 22%,#100700 44%)", zIndex:10, animation:"fadeUp .9s .9s cubic-bezier(.16,1,.3,1) both" }}>

        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, fontWeight:300, letterSpacing:5, textTransform:"uppercase" as const, color:"rgba(255,190,80,.4)", marginBottom:4 }}>A Daily Sadhana Companion</span>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:mode==="splash"?54:40, fontWeight:800, letterSpacing:-1, lineHeight:1, background:"linear-gradient(155deg,#FFE8A0 0%,#FFAB00 55%,#E05000 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:mode==="splash"?10:6, transition:"font-size .3s" }}>NITYA</span>
        <div style={{ width:36, height:1, background:"linear-gradient(90deg,transparent,rgba(255,180,60,.5),transparent)", marginBottom:mode==="splash"?10:12 }}/>

        {mode==="splash"&&(<>
          <p style={{ fontFamily:"'Noto Sans Devanagari',serif", fontSize:17, fontWeight:400, color:"rgba(255,220,140,.75)", textAlign:"center", lineHeight:1.7, marginBottom:22 }}>
            <strong style={{ fontWeight:600, color:"rgba(255,235,170,.95)" }}>हर दिन श्लोक,</strong><br/>हर दिन शांति।
          </p>
          <button onClick={onEnter} style={{ width:"100%", background:"linear-gradient(135deg,#E07800,#B85000)", border:"none", borderRadius:22, padding:"16px 20px", cursor:"pointer", position:"relative", overflow:"hidden", boxShadow:"0 8px 28px rgba(180,80,0,.5)", marginBottom:10 }}>
            <div style={{ position:"absolute", top:0, left:"-80%", width:"50%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)", animation:"shimmer 3s ease-in-out infinite" }}/>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              <span style={{ fontFamily:"'Noto Sans Devanagari',serif", fontSize:15, fontWeight:600, color:"#FFF5E0" }}>आज की साधना शुरू करें</span>
              <div style={{ width:1, height:16, background:"rgba(255,220,120,.3)" }}/>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase" as const, color:"rgba(255,230,160,.5)" }}>Begin</span>
            </div>
          </button>
          <button onClick={()=>setMode("login")} style={{ width:"100%", background:"transparent", border:"1px solid rgba(255,200,80,.22)", borderRadius:22, padding:"13px 20px", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase" as const, color:"rgba(255,200,80,.6)" }}>
            🔐 Sign In to Save Progress
          </button>
        </>)}

        {mode==="login"&&(<>
          <div style={{ width:"100%", marginBottom:14 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:9, fontWeight:700, letterSpacing:2, textTransform:"uppercase" as const, color:"rgba(255,200,80,.55)", marginBottom:8 }}>Mobile Number</div>
            <div style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,.07)", borderRadius:16, border:`1px solid ${err?"rgba(255,100,80,.4)":"rgba(255,200,80,.2)"}`, overflow:"hidden" }}>
              <div style={{ padding:"0 14px", borderRight:"1px solid rgba(255,200,80,.15)", height:52, display:"flex", alignItems:"center" }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"rgba(255,200,80,.7)" }}>+91</span>
              </div>
              <input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} onKeyDown={e=>e.key==="Enter"&&sendOtp()} placeholder="9876543210" type="tel" maxLength={10}
                style={{ flex:1, background:"transparent", border:"none", outline:"none", padding:"14px", fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:"white", letterSpacing:2 }}/>
            </div>
            {err&&<div style={{ fontFamily:"'Syne',sans-serif", fontSize:10, color:"#FF8080", marginTop:5, letterSpacing:.5 }}>{err}</div>}
          </div>
          <button onClick={sendOtp} style={{ width:"100%", background:"linear-gradient(135deg,#E07800,#B85000)", border:"none", borderRadius:18, padding:"14px", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase" as const, color:"white", boxShadow:"0 6px 24px rgba(180,80,0,.45)", marginBottom:10, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:"-80%", width:"50%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)", animation:"shimmer 3s ease-in-out infinite" }}/>
            Send OTP →
          </button>
          <button onClick={()=>setMode("splash")} style={{ width:"100%", background:"transparent", border:"none", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:600, letterSpacing:1, textTransform:"uppercase" as const, color:"rgba(255,200,80,.35)", padding:"6px" }}>← Back</button>
        </>)}

        {mode==="otp"&&(<>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:10, color:"rgba(255,200,80,.5)", marginBottom:14, letterSpacing:.5, textAlign:"center" }}>OTP sent to +91 {phone}</div>
          <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:14 }}>
            {otp.map((d,i)=>(
              <input key={i} ref={refs[i]} value={d} onChange={e=>handleDigit(e.target.value,i)} onKeyDown={e=>handleKey(e,i)} maxLength={1} type="tel"
                style={{ width:40, height:50, borderRadius:13, background:"rgba(255,255,255,.08)", border:`1.5px solid ${d?"rgba(255,200,80,.5)":"rgba(255,200,80,.18)"}`, outline:"none", textAlign:"center", fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"white", transition:"border .2s" }}/>
            ))}
          </div>
          {err&&<div style={{ fontFamily:"'Syne',sans-serif", fontSize:10, color:"#FF8080", marginBottom:8, letterSpacing:.5, textAlign:"center" }}>{err}</div>}
          {verifying
            ?<div style={{ textAlign:"center", padding:"10px 0", fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, color:"rgba(255,200,80,.5)", letterSpacing:1, textTransform:"uppercase" as const }}>Verifying...</div>
            :<button onClick={verify} style={{ width:"100%", background:"linear-gradient(135deg,#E07800,#B85000)", border:"none", borderRadius:18, padding:"14px", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase" as const, color:"white", boxShadow:"0 6px 24px rgba(180,80,0,.45)", marginBottom:10 }}>
              Verify & Begin ✓
            </button>
          }
          <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
            <button onClick={()=>{setMode("login");setOtp(["","","","","",""]);setErr("");}} style={{ background:"transparent", border:"none", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:600, letterSpacing:1, textTransform:"uppercase" as const, color:"rgba(255,200,80,.35)", padding:"6px" }}>← Back</button>
            <button onClick={sendOtp} style={{ background:"transparent", border:"none", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:600, letterSpacing:1, textTransform:"uppercase" as const, color:"rgba(255,200,80,.35)", padding:"6px" }}>Resend OTP</button>
          </div>
        </>)}
      </div>
      <div id="recaptcha-container"/>
    </div>
  );
}
