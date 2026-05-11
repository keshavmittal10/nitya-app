"use client";
import { useState, useRef, useEffect } from "react";
import { SHLOKAS, PRAYERS } from "@/lib/data";
import { BNav } from "@/components/shared";
import { useStore } from "@/store";

export default function HomeTab({ onNav }: { onNav: (s: string) => void }) {
  const [tab, setTab] = useState("hindi");
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(28);
  const [favOpen, setFavOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [sharePopup, setSharePopup] = useState(false);
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);
  const { favorites, addFavorite, removeFavorite } = useStore();
  const sl = SHLOKAS[0];
  const todayIdx = new Date().getDay();
  const pr = PRAYERS[todayIdx];

  const togglePlay = () => {
    setPlaying(p => {
      if (!p) iv.current = setInterval(() => setProg(x => x >= 100 ? 0 : x + 0.4), 200);
      else { if(iv.current) clearInterval(iv.current); }
      return !p;
    });
  };
  useEffect(() => () => { if(iv.current) clearInterval(iv.current); }, []);
  const sec = Math.floor(prog * 84 / 100);
  const ts = `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;

  const isFav = favorites.some(f => f.id === sl.id);
  const showToast = (m: string) => { setToastMsg(m); setTimeout(() => setToastMsg(""), 2200); };
  const toggleFav = () => {
    if (isFav) { removeFavorite(sl.id); showToast("Removed from favourites"); }
    else { addFavorite({ id: sl.id, grantha: sl.grantha, chapter: sl.chapter, sanskrit: sl.sanskrit }); showToast("Added to favourites ❤️"); }
  };

  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(170deg,#FFF8EC 0%,#FFF2D6 55%,#FFE8B0 100%)", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", bottom:-30, right:-30, fontFamily:"'Noto Sans Devanagari',serif", fontSize:260, color:"rgba(180,120,30,.04)", pointerEvents:"none", zIndex:0, lineHeight:1 }}>ॐ</div>

      {/* Toast */}
      {toastMsg&&<div style={{ position:"absolute", top:72, left:"50%", transform:"translateX(-50%)", background:"rgba(40,20,0,.93)", color:"#FFD700", fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, letterSpacing:1, padding:"9px 20px", borderRadius:20, zIndex:50, whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(0,0,0,.4)", animation:"fadeUp .3s ease" }}>{toastMsg}</div>}

      {/* WhatsApp share popup */}
      {sharePopup&&(
        <div style={{ position:"absolute", inset:0, zIndex:60, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", background:"rgba(0,0,0,.65)", backdropFilter:"blur(6px)" }}
          onClick={e=>{ if(e.target===e.currentTarget) setSharePopup(false); }}>
          <div style={{ width:"100%", background:"white", borderRadius:"28px 28px 0 0", padding:"0 0 32px", animation:"fadeUp .35s cubic-bezier(.16,1,.3,1) both", boxShadow:"0 -12px 40px rgba(0,0,0,.25)" }}>
            <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 8px" }}>
              <div style={{ width:40, height:4, borderRadius:4, background:"rgba(0,0,0,.15)" }}/>
            </div>
            <div style={{ padding:"0 20px 16px", borderBottom:"1px solid rgba(0,0,0,.07)" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, letterSpacing:.5, textTransform:"uppercase" as const, color:"#2D1400", marginBottom:2 }}>Share Preview</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:500, color:"#C4A882", letterSpacing:.5 }}>This is how it will look on WhatsApp Status</div>
            </div>
            {/* Preview card */}
            <div style={{ margin:"16px 20px", borderRadius:22, overflow:"hidden", boxShadow:"0 8px 32px rgba(80,30,0,.18)" }}>
              <div style={{ background:"linear-gradient(135deg,#3D1C00,#5C2E00)", padding:"20px 18px 16px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#FFD700,#FF8C00,#FFD700)" }}/>
                <div style={{ position:"absolute", right:-8, bottom:-12, fontFamily:"'Noto Sans Devanagari',serif", fontSize:80, color:"rgba(255,200,60,.07)", lineHeight:1, pointerEvents:"none" }}>ॐ</div>
                <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(255,200,60,.14)", border:"1px solid rgba(255,200,60,.25)", borderRadius:20, padding:"3px 10px", marginBottom:12 }}>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:8, fontWeight:700, letterSpacing:1, textTransform:"uppercase" as const, color:"rgba(255,210,100,.9)" }}>🪷 {sl.grantha} · {sl.chapter}</span>
                </div>
                <div style={{ fontFamily:"'Noto Sans Devanagari',serif", fontSize:15, fontWeight:600, color:"#FFE4A0", lineHeight:1.85, textAlign:"center", whiteSpace:"pre-line", padding:"12px 8px", background:"rgba(255,255,255,.04)", borderRadius:14, border:"1px solid rgba(255,200,60,.08)", marginBottom:12 }}>{sl.sanskrit}</div>
                <div style={{ fontFamily:"'Noto Sans Devanagari',serif", fontSize:12, fontWeight:700, color:"rgba(255,220,140,.85)", lineHeight:1.7, textAlign:"center" }}>{sl.hindi}</div>
              </div>
              <div style={{ background:"#FFF8EC", padding:"10px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:22, height:22, borderRadius:7, background:"linear-gradient(135deg,#FF8C00,#FF4500)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>🪷</div>
                  <div>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:11, fontWeight:700, color:"#6B2A00", letterSpacing:1 }}>NITYA</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:7.5, fontWeight:600, letterSpacing:1, color:"#C4A882", textTransform:"uppercase" as const }}>नित्य · Daily Sadhana</div>
                  </div>
                </div>
                <div style={{ fontFamily:"'Noto Sans Devanagari',serif", fontSize:18, color:"rgba(180,100,20,.3)" }}>ॐ</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, padding:"0 20px" }}>
              <button onClick={()=>{ setSharePopup(false); showToast("Shared to WhatsApp! ✨"); }} style={{ flex:1, background:"linear-gradient(135deg,#25D366,#128C7E)", border:"none", borderRadius:18, padding:"14px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 5px 18px rgba(37,211,102,.35)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:"white", letterSpacing:.5 }}>Share to WhatsApp</span>
              </button>
              <button onClick={()=>setSharePopup(false)} style={{ width:50, background:"rgba(0,0,0,.06)", border:"none", borderRadius:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div style={{ width:"100%", display:"flex", justifyContent:"space-between", padding:"14px 24px 0", fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, color:"rgba(120,60,0,.5)", flexShrink:0, zIndex:10 }}>
        <span>{new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span><span>▶ ▌▌ ▊</span>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 22px 0", zIndex:10, flexShrink:0 }}>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#4A2800", letterSpacing:".5px", textTransform:"uppercase" as const, lineHeight:1 }}>Today's Sadhana</span>
        <div style={{ width:34, height:34, borderRadius:12, background:"rgba(180,80,0,.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, cursor:"pointer" }}>🔔</div>
      </div>

      <div style={{ flex:1, overflowY:"auto", paddingBottom:82, zIndex:5 }}>
        {/* Shloka card — dark */}
        <div style={{ margin:"14px 16px 0", background:"linear-gradient(135deg,#3D1C00,#5C2E00)", borderRadius:26, padding:"20px", boxShadow:"0 12px 36px rgba(80,30,0,.28)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#FFD700,#FF8C00,#FFD700)", borderRadius:"26px 26px 0 0" }}/>
          <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(255,200,60,.12)", border:"1px solid rgba(255,200,60,.22)", borderRadius:20, padding:"4px 11px", marginBottom:14 }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:9, fontWeight:700, letterSpacing:1, textTransform:"uppercase" as const, color:"rgba(255,210,100,.8)" }}>🪷 {sl.grantha} · {sl.chapter}</span>
          </div>
          <div style={{ fontFamily:"'Noto Sans Devanagari',serif", fontSize:17, fontWeight:600, color:"#FFE4A0", lineHeight:1.9, textAlign:"center", whiteSpace:"pre-line", padding:"16px 10px", background:"rgba(255,255,255,.04)", borderRadius:18, border:"1px solid rgba(255,200,60,.08)", marginBottom:14 }}>{sl.sanskrit}</div>
          {/* Audio bar */}
          <div style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(0,0,0,.2)", borderRadius:18, padding:"11px 14px" }}>
            <button onClick={togglePlay} style={{ width:44, height:44, borderRadius:"50%", border:"none", cursor:"pointer", flexShrink:0, background:"linear-gradient(135deg,#FFD700,#FF8C00)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 5px 18px rgba(255,215,0,.55)", animation:playing?"none":"pulse 3s infinite" }}>
              {playing
                ?<svg width="16" height="16" viewBox="0 0 16 16" fill="white"><rect x="2" y="2" width="5" height="12" rx="1.5"/><rect x="9" y="2" width="5" height="12" rx="1.5"/></svg>
                :<svg width="16" height="16" viewBox="0 0 16 16" fill="white" style={{marginLeft:2}}><polygon points="3,1 15,8 3,15"/></svg>}
            </button>
            <div style={{ flex:1 }}>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, color:"rgba(255,220,120,.85)", display:"block", marginBottom:6 }}>हिंदी पाठ सुनें · 1:24</span>
              <div style={{ height:3, background:"rgba(255,200,60,.15)", borderRadius:10, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${prog}%`, background:"linear-gradient(90deg,#FFD700,#FF9000)", borderRadius:10, transition:"width .2s" }}/>
              </div>
            </div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:10, color:"rgba(255,200,60,.4)", flexShrink:0 }}>{ts}</span>
          </div>
        </div>

        {/* Translation card */}
        <div style={{ margin:"12px 16px 0", background:"white", borderRadius:24, overflow:"hidden", boxShadow:"0 6px 22px rgba(180,80,0,.09)", border:"1.5px solid rgba(255,165,0,.14)" }}>
          <div style={{ display:"flex", borderBottom:"1.5px solid rgba(255,165,0,.1)" }}>
            {[{id:"hindi",label:"हिंदी",sub:"Hindi"},{id:"english",label:"English",sub:"अंग्रेज़ी"}].map(t=>{
              const on = tab===t.id;
              return (
                <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"12px 8px 10px", border:"none", cursor:"pointer", background:on?"white":"rgba(255,240,220,.5)", borderBottom:on?"2.5px solid #C47010":"2.5px solid transparent", transition:"all .2s", position:"relative" }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:on?800:600, color:on?"#C47010":"rgba(160,80,10,.4)", letterSpacing:.3, lineHeight:1 }}>{t.label}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:8, fontWeight:500, color:on?"rgba(196,112,16,.6)":"rgba(160,80,10,.25)", letterSpacing:1, textTransform:"uppercase" as const, marginTop:2 }}>{t.sub}</div>
                </button>
              );
            })}
          </div>
          <div style={{ padding:"16px 18px 18px", position:"relative", minHeight:90 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:tab==="hindi"?"rgba(196,112,16,.08)":"rgba(80,100,200,.07)", border:`1px solid ${tab==="hindi"?"rgba(196,112,16,.18)":"rgba(80,100,200,.15)"}`, borderRadius:20, padding:"3px 10px", marginBottom:10 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:tab==="hindi"?"#C47010":"#5B7AE0" }}/>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:8, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase" as const, color:tab==="hindi"?"#C47010":"#5B7AE0" }}>{tab==="hindi"?"भावार्थ · Meaning":"Translation"}</span>
            </div>
            {tab==="hindi"
              ?<p style={{ fontFamily:"'Noto Sans Devanagari',serif", fontSize:15, fontWeight:700, color:"#3E1800", lineHeight:1.9 }}>{sl.hindi}</p>
              :<p style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:600, color:"#2D3080", lineHeight:1.85 }}>{sl.english}</p>}
            <div style={{ position:"absolute", right:16, bottom:10, fontFamily:"serif", fontSize:52, color:tab==="hindi"?"rgba(196,112,16,.06)":"rgba(80,100,200,.06)", lineHeight:1, userSelect:"none" }}>"</div>
          </div>
        </div>

        {/* Share + fav row */}
        <div style={{ margin:"10px 16px 0", display:"flex", gap:8 }}>
          <button onClick={()=>setSharePopup(true)} style={{ flex:1, background:"linear-gradient(135deg,#25D366,#128C7E)", border:"none", borderRadius:18, padding:"12px 10px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, boxShadow:"0 4px 16px rgba(37,211,102,.3)", transition:"transform .15s" }}
            onMouseDown={e=>e.currentTarget.style.transform="scale(.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, color:"white", letterSpacing:.3 }}>WhatsApp</span>
          </button>
          <button onClick={()=>showToast("Shared to Instagram! ✨")} style={{ flex:1, background:"linear-gradient(135deg,#833AB4,#FD1D1D,#F77737)", border:"none", borderRadius:18, padding:"12px 10px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, boxShadow:"0 4px 16px rgba(131,58,180,.3)", transition:"transform .15s" }}
            onMouseDown={e=>e.currentTarget.style.transform="scale(.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, color:"white", letterSpacing:.3 }}>Instagram</span>
          </button>
          <button onClick={toggleFav} style={{ width:48, height:48, borderRadius:16, border:"none", cursor:"pointer", background:isFav?"linear-gradient(135deg,#FF6B6B,#FF4444)":"rgba(180,80,0,.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, boxShadow:isFav?"0 4px 14px rgba(255,100,100,.4)":"none", flexShrink:0, transition:"all .2s" }}>
            {isFav?"❤️":"🤍"}
          </button>
        </div>

        {/* Evening prayer card */}
        <div style={{ margin:"12px 16px 0", borderRadius:26, padding:"20px", position:"relative", overflow:"hidden", boxShadow:`0 14px 42px ${pr.color}28`, background:pr.g }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${pr.color},rgba(255,255,255,.75),${pr.color})`, backgroundSize:"200% 100%", animation:"gradShift 3.5s linear infinite", borderRadius:"26px 26px 0 0" }}/>
          <div style={{ position:"absolute", right:-10, bottom:-18, fontFamily:"'Noto Sans Devanagari',serif", fontSize:110, color:"rgba(255,255,255,.06)", lineHeight:1, pointerEvents:"none" }}>ॐ</div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
            <div style={{ width:48, height:48, borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"2px solid rgba(255,255,255,.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, boxShadow:`0 0 20px ${pr.color}55`, animation:"floatUp 4s ease-in-out infinite" }}>{pr.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:9, fontWeight:700, letterSpacing:2, textTransform:"uppercase" as const, color:"rgba(255,255,255,.5)", marginBottom:2 }}>🌙 Evening Prayer · 6:00 – 7:30 PM</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:"white", textTransform:"uppercase" as const, letterSpacing:.5, lineHeight:1.1 }}>{pr.deity}</div>
              <div style={{ fontFamily:"'Noto Sans Devanagari',serif", fontSize:14, fontWeight:600, color:"rgba(255,255,255,.8)", marginTop:2 }}>{pr.hi}</div>
            </div>
          </div>
          <button onClick={()=>onNav("prarthana")} style={{ width:"100%", background:"rgba(255,255,255,.14)", backdropFilter:"blur(10px)", border:"1.5px solid rgba(255,255,255,.25)", borderRadius:16, padding:"12px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:800, color:"white", letterSpacing:.5 }}>Open Today's Aarti</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,.7)" }}>→</span>
          </button>
        </div>

        {/* Favourites */}
        <div style={{ margin:"12px 16px 0", background:"white", borderRadius:22, overflow:"hidden", boxShadow:"0 4px 18px rgba(180,80,0,.07)", border:"1.5px solid rgba(255,165,0,.1)" }}>
          <button onClick={()=>setFavOpen(o=>!o)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>❤️</span>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:800, letterSpacing:1, textTransform:"uppercase" as const, color:"#4A2800" }}>Favourites{favorites.length>0?` (${favorites.length})`:""}</span>
            </div>
            <span style={{ fontSize:13, color:"#C47010", display:"inline-block", transform:favOpen?"rotate(180deg)":"rotate(0deg)", transition:"transform .2s" }}>▼</span>
          </button>
          {favOpen&&(
            <div style={{ borderTop:"1px solid rgba(255,165,0,.1)" }}>
              {favorites.length===0
                ?<div style={{ padding:"16px", textAlign:"center", fontFamily:"'Noto Sans Devanagari',serif", fontSize:13, color:"#C4A882" }}>कोई पसंदीदा नहीं। ❤️ से जोड़ें।</div>
                :favorites.map((f,i)=>(
                  <div key={f.id} style={{ padding:"12px 16px", borderTop:i>0?"1px solid rgba(255,165,0,.08)":"none" }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:9, fontWeight:700, letterSpacing:1, textTransform:"uppercase" as const, color:"#C47010", marginBottom:4 }}>{f.grantha} · {f.chapter}</div>
                    <div style={{ fontFamily:"'Noto Sans Devanagari',serif", fontSize:13, fontWeight:600, color:"#3E1800", lineHeight:1.7, whiteSpace:"pre-line" }}>{f.sanskrit}</div>
                    <button onClick={()=>{ removeFavorite(f.id); showToast("Removed ✓"); }} style={{ marginTop:6, background:"rgba(255,100,100,.08)", border:"1px solid rgba(255,100,100,.18)", borderRadius:10, padding:"3px 10px", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:8, fontWeight:700, letterSpacing:1, textTransform:"uppercase" as const, color:"#EF4444" }}>Remove</button>
                  </div>
                ))
              }
            </div>
          )}
        </div>
        <div style={{ height:16 }}/>
      </div>
      <BNav active="home" onNav={onNav}/>
    </div>
  );
}
