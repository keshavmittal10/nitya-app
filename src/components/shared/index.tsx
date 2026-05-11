"use client";
import { NAV } from "@/lib/data";

export function StatusBar({ light = true }: { light?: boolean }) {
  return (
    <div style={{
      width: "100%", display: "flex", justifyContent: "space-between",
      padding: "14px 24px 0", fontFamily: "'Syne',sans-serif", fontSize: 11,
      fontWeight: 700, color: light ? "rgba(120,60,0,.5)" : "rgba(200,170,255,.4)",
      flexShrink: 0, zIndex: 10,
    }}>
      <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      <span>▶ ▌▌ ▊</span>
    </div>
  );
}

export function SectionHead({ title, color = "#C47010" }: { title: string; color?: string }) {
  return (
    <div style={{
      fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 800,
      letterSpacing: 3, textTransform: "uppercase" as const, color, marginBottom: 10,
    }}>{title}</div>
  );
}

export function BNav({ active, onNav, dark = false }: { active: string; onNav: (s: string) => void; dark?: boolean }) {
  const bg = dark ? "rgba(12,6,24,.94)" : "rgba(255,249,238,.93)";
  const bdr = dark ? "rgba(120,80,200,.2)" : "rgba(232,160,32,.18)";
  const aBg = dark ? "linear-gradient(135deg,#7C3AED,#4F46E5)" : "linear-gradient(135deg,#E8A020,#C47010)";
  const aSh = dark ? "0 4px 14px rgba(124,58,237,.45)" : "0 4px 14px rgba(200,120,16,.4)";
  const aC = dark ? "#A78BFA" : "#C47010";
  const iC = dark ? "rgba(160,140,210,.28)" : "#D4B896";
  return (
    <nav style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "10px 0 22px", background: bg, backdropFilter: "blur(24px)",
      borderTop: `1px solid ${bdr}`, zIndex: 30,
    }}>
      {NAV.map((n) => {
        const on = n.id === active;
        return (
          <div key={n.id} onClick={() => onNav(n.id)} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, cursor: "pointer", padding: "4px 6px",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 14, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 18,
              background: on ? aBg : "rgba(180,120,30,.06)",
              boxShadow: on ? aSh : "none", transition: "all .2s",
            }}>{n.icon}</div>
            <span style={{
              fontFamily: "'Syne',sans-serif", fontSize: 7.5, fontWeight: 700,
              letterSpacing: "1px", textTransform: "uppercase" as const,
              color: on ? aC : iC,
            }}>{n.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

export function PlayBtn({ playing, onToggle, size = 44, c1 = "#FFD700", c2 = "#FF8C00" }: {
  playing: boolean; onToggle: () => void; size?: number; c1?: string; c2?: string;
}) {
  return (
    <button onClick={onToggle} style={{
      width: size, height: size, borderRadius: "50%", border: "none",
      cursor: "pointer", flexShrink: 0,
      background: `linear-gradient(135deg,${c1},${c2})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 5px 18px ${c1}55`, position: "relative",
      transition: "transform .15s",
      animation: playing ? "none" : "pulse 3s infinite",
    }}>
      {playing
        ? <svg width={size * .36} height={size * .36} viewBox="0 0 16 16" fill="white"><rect x="2" y="2" width="5" height="12" rx="1.5" /><rect x="9" y="2" width="5" height="12" rx="1.5" /></svg>
        : <svg width={size * .36} height={size * .36} viewBox="0 0 16 16" fill="white" style={{ marginLeft: 2 }}><polygon points="3,1 15,8 3,15" /></svg>
      }
    </button>
  );
}
