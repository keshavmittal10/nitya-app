"use client";
import { useState } from "react";
import { FULL_DAYS } from "@/lib/data";
import { BNav, StatusBar } from "@/components/shared";

export default function Prarthana({ onNav }: { onNav: (s: string) => void }) {
  const todayIdx = new Date().getDay();
  const [sel, setSel] = useState(todayIdx);
  const day = FULL_DAYS[sel];

  return (
    <div style={{ width: "100%", height: "100%", background: day.bg, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", transition: "background .5s ease" }}>
      {/* Glow */}
      <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 320, height: 320, background: `radial-gradient(circle,${day.glow} 0%,transparent 65%)`, borderRadius: "50%", pointerEvents: "none", zIndex: 0, animation: "breathe 6s ease-in-out infinite", transition: "background .5s ease" }} />
      <div style={{ position: "absolute", bottom: -10, right: -10, fontFamily: "'Noto Sans Devanagari',serif", fontSize: 220, color: `${day.color}07`, pointerEvents: "none", zIndex: 0, lineHeight: 1 }}>ॐ</div>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 24px 0", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: `${day.color}88`, zIndex: 10, flexShrink: 0 }}>
        <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        <span>▶ ▌▌ ▊</span>
      </div>

      <div style={{ padding: "8px 22px 0", zIndex: 10, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: `${day.color}77`, marginBottom: 2 }}>🙏 Daily Prayer</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#1A0800", letterSpacing: .5, textTransform: "uppercase", lineHeight: 1 }}>Prarthana</div>
      </div>

      {/* Day tabs */}
      <div style={{ padding: "12px 16px 0", zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,.55)", borderRadius: 22, padding: "5px", backdropFilter: "blur(16px)", border: `1px solid ${day.color}25`, boxShadow: `0 4px 18px ${day.color}14` }}>
          {FULL_DAYS.map((d, i) => {
            const on = i === sel;
            const isToday = i === todayIdx;
            return (
              <button key={i} onClick={() => setSel(i)} style={{ flex: 1, padding: "8px 0 7px", borderRadius: 16, border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "all .25s cubic-bezier(.16,1,.3,1)", background: on ? `linear-gradient(140deg,${d.color},${d.color}CC)` : "transparent", boxShadow: on ? `0 4px 16px ${d.color}44` : "none", position: "relative" }}>
                {isToday && !on && <div style={{ position: "absolute", top: 4, left: "50%", transform: "translateX(6px)", width: 5, height: 5, borderRadius: "50%", background: d.color, boxShadow: `0 0 5px ${d.color}88` }} />}
                <span style={{ fontSize: on ? 16 : 13, lineHeight: 1, transition: "font-size .2s" }}>{d.icon}</span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 7.5, fontWeight: on ? 800 : 600, letterSpacing: .5, textTransform: "uppercase", lineHeight: 1, color: on ? "white" : `${d.color}88` }}>{d.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 82, zIndex: 5 }}>
        {/* Hero card */}
        <div key={`hero-${sel}`} style={{ margin: "12px 16px 0", borderRadius: 28, padding: "22px 20px", position: "relative", overflow: "hidden", boxShadow: `0 18px 52px ${day.color}35`, background: day.heroBg, animation: "fadeUp .4s ease both" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${day.color},rgba(255,255,255,.75),${day.color})`, backgroundSize: "200% 100%", animation: "gradShift 3s linear infinite", borderRadius: "28px 28px 0 0" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Noto Sans Devanagari',serif", fontSize: 130, color: "rgba(255,255,255,.07)", lineHeight: 1, pointerEvents: "none", userSelect: "none", width: "100%", textAlign: "center" }}>ॐ</div>
          <div style={{ textAlign: "center", marginBottom: 14, position: "relative", zIndex: 2 }}>
            <div style={{ display: "inline-flex", width: 76, height: 76, borderRadius: "50%", background: "rgba(255,255,255,.15)", border: "2px solid rgba(255,255,255,.3)", alignItems: "center", justifyContent: "center", fontSize: 38, boxShadow: `0 0 36px ${day.color}55`, animation: "floatUp 4s ease-in-out infinite" }}>{day.icon}</div>
          </div>
          <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: 5 }}>{day.sub}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "white", textTransform: "uppercase", lineHeight: 1.1, marginBottom: 5 }}>{day.deity}</div>
            <div style={{ fontFamily: "'Noto Sans Devanagari',serif", fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,.9)" }}>{day.name}</div>
          </div>
        </div>

        {/* Verse cards */}
        <div style={{ padding: "10px 16px 0" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: `${day.color}99`, marginBottom: 10, paddingLeft: 4 }}>🙏 आरती के पद</div>
          {day.verses.map((v, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.7)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "16px", marginBottom: 10, border: `1.5px solid ${v.c}25`, boxShadow: `0 4px 16px ${v.c}12`, animation: `fadeUp .4s ${i * .06}s ease both` }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: v.c, marginBottom: 8 }}>{v.label}</div>
              <div style={{ fontFamily: "'Noto Sans Devanagari',serif", fontSize: 14, fontWeight: 600, color: "#1A0800", lineHeight: 1.9, whiteSpace: "pre-line" }}>{v.text}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <BNav active="prarthana" onNav={onNav} />
    </div>
  );
}
