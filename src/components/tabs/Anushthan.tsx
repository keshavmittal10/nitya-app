"use client";
import { PHASES, DAYS } from "@/lib/data";
import { BNav, StatusBar, SectionHead } from "@/components/shared";
import { useStore } from "@/store";
import toast from "react-hot-toast";

export default function Anushthan({ onNav }: { onNav: (s: string) => void }) {
  const { karma, addKarma, mantaDays, setMantaDays } = useStore();

  const showToast = (msg: string) => toast(msg, {
    style: { background: "#1E1040", color: "#C4B5FD", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700 },
  });

  const startDay = (day: typeof DAYS[0]) => {
    if (day.done || !day.active) return;
    setMantaDays(mantaDays + 1);
    addKarma(20);
    showToast(`+20 karma · Day ${day.d} started! 🛤️`);
  };

  const progress = Math.round((DAYS.filter((d) => d.done).length / DAYS.length) * 100);

  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(170deg,#F5F3FF 0%,#EDE9FE 55%,#DDD6FE 100%)", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 320, height: 320, background: "radial-gradient(circle,rgba(139,92,246,.1) 0%,transparent 65%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0, animation: "breathe 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: -10, right: -10, fontFamily: "'Noto Sans Devanagari',serif", fontSize: 220, color: "rgba(139,92,246,.05)", pointerEvents: "none", zIndex: 0 }}>गीता</div>

      <StatusBar />
      <div style={{ padding: "8px 22px 0", zIndex: 10, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(109,40,217,.6)", marginBottom: 2 }}>🛤️ 21-Day Journey</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#2E1065", letterSpacing: .5, textTransform: "uppercase" }}>Anushthan</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 82, zIndex: 5 }}>
        {/* Progress banner */}
        <div style={{ margin: "12px 16px 0", background: "linear-gradient(135deg,#2E1065,#4C1D95)", borderRadius: 22, padding: "18px", boxShadow: "0 8px 28px rgba(109,40,217,.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(196,181,253,.5)", marginBottom: 3 }}>Your Progress</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 26, fontWeight: 700, color: "#C4B5FD" }}>{progress}%</div>
            </div>
            <div style={{ fontFamily: "'Noto Sans Devanagari',serif", fontSize: 36, color: "rgba(255,255,255,.15)" }}>ॐ</div>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,.1)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#A78BFA,#8B5CF6)", borderRadius: 4, transition: "width .6s" }} />
          </div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 600, color: "rgba(196,181,253,.5)", marginTop: 8 }}>{DAYS.filter(d => d.done).length} of {DAYS.length} days completed</div>
        </div>

        {/* Phases */}
        {PHASES.map((ph) => (
          <div key={ph.id} style={{ margin: "16px 16px 0" }}>
            <div style={{ background: ph.dim, border: `1.5px solid ${ph.bdr}`, borderRadius: 16, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{ph.emoji}</span>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: ph.color, letterSpacing: .5 }}>Phase {ph.id} — {ph.title}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 500, color: `${ph.color}88`, marginTop: 2 }}>{ph.days} · {ph.theme}</div>
              </div>
            </div>

            {DAYS.filter((d) => d.p === ph.id).map((day, i) => {
              const isActive = !!day.active;
              const isDone = day.done;
              return (
                <div key={day.d} onClick={() => startDay(day)} style={{
                  background: isDone ? `linear-gradient(135deg,${ph.color}15,${ph.color}08)` : isActive ? "white" : "rgba(255,255,255,.5)",
                  borderRadius: 18, padding: "14px 16px", marginBottom: 8,
                  border: `1.5px solid ${isDone ? ph.color + "35" : isActive ? ph.color + "45" : "rgba(139,92,246,.1)"}`,
                  boxShadow: isActive ? `0 4px 18px ${ph.color}22, 0 0 0 2px ${ph.color}33` : "0 2px 8px rgba(109,40,217,.06)",
                  cursor: isActive ? "pointer" : "default",
                  animation: `fadeUp .4s ${i * .06}s ease both`,
                  display: "flex", alignItems: "center", gap: 12, position: "relative", overflow: "hidden",
                }}>
                  {isActive && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ph.color},${ph.color}88)` }} />}
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: isDone ? `linear-gradient(135deg,${ph.color},${ph.color}AA)` : isActive ? `${ph.color}18` : "rgba(139,92,246,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {isDone ? "✅" : isActive ? "▶" : `${day.d}`}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: isDone ? ph.color : isActive ? "#2E1065" : "#6D28D9", letterSpacing: .3 }}>{day.t}</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 500, color: "rgba(109,40,217,.5)", marginTop: 2 }}>{day.s}</div>
                  </div>
                  <div style={{ fontFamily: "'Noto Sans Devanagari',serif", fontSize: 10, fontWeight: 600, color: `${ph.color}88`, textAlign: "right", maxWidth: 80, lineHeight: 1.4 }}>{day.sl}</div>
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ height: 16 }} />
      </div>

      <BNav active="anushthan" onNav={onNav} />
    </div>
  );
}
