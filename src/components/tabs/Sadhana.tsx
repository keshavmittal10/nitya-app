"use client";
import { useState } from "react";
import { SHLOKAS, CHAUPAIS } from "@/lib/data";
import { BNav, StatusBar, SectionHead, PlayBtn } from "@/components/shared";
import { useStore } from "@/store";
import toast from "react-hot-toast";

export default function Sadhana({ onNav }: { onNav: (s: string) => void }) {
  const { karma, addKarma, tapasyaDays, setTapasyaDays, shlokaCount, setShlokaCount, bhaktDays, setBhaktDays, tasksDone, setTasksDone, user } = useStore();
  const [playing, setPlaying] = useState(false);
  const [expandedShloka, setExpandedShloka] = useState<number | null>(null);
  const [mantraCount, setMantraCount] = useState(0);
  const MANTRA_TARGET = 108;

  const showToast = (msg: string) => toast(msg, {
    style: { background: "#1A2A00", color: "#86EFAC", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700 },
  });

  const markShlokaRead = (id: number) => {
    if (!tasksDone.shlok) {
      setTasksDone({ ...tasksDone, shlok: true });
      setShlokaCount(shlokaCount + 1);
      addKarma(10);
      showToast("+10 karma · Shloka read ✓");
    }
    setExpandedShloka(expandedShloka === id ? null : id);
  };

  const doMantraTap = () => {
    const next = mantraCount + 1;
    setMantraCount(next);
    if (next === MANTRA_TARGET) {
      if (!tasksDone.aarti) {
        setTasksDone({ ...tasksDone, aarti: true });
        setBhaktDays(bhaktDays + 1);
        addKarma(25);
        showToast("🎉 108 mantras! +25 karma");
      }
    }
  };

  const completeSadhana = () => {
    setTapasyaDays(tapasyaDays + 1);
    addKarma(15);
    showToast(`+15 karma · Day ${tapasyaDays + 1} streak! 🔥`);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(170deg,#F0FDF4 0%,#DCFCE7 55%,#BBF7D0 100%)", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 320, height: 320, background: "radial-gradient(circle,rgba(34,197,94,.1) 0%,transparent 65%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0, animation: "breathe 8s ease-in-out infinite" }} />

      <StatusBar light={true} />
      <div style={{ padding: "8px 22px 0", zIndex: 10, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(22,163,74,.6)", marginBottom: 2 }}>🌿 Daily Practice</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#14532D", letterSpacing: .5, textTransform: "uppercase" }}>Sadhana</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 82, zIndex: 5 }}>
        {/* Karma pill */}
        <div style={{ margin: "12px 16px 0", background: "linear-gradient(135deg,#14532D,#166534)", borderRadius: 20, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 6px 22px rgba(22,163,74,.25)" }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(134,239,172,.6)", marginBottom: 3 }}>Total Karma</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 28, fontWeight: 700, color: "#86EFAC" }}>{karma.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(134,239,172,.6)", marginBottom: 3 }}>Streak</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 700, color: "#FDE047" }}>🔥 {tapasyaDays}</div>
          </div>
        </div>

        {/* Tasks */}
        <div style={{ margin: "16px 16px 0" }}>
          <SectionHead title="Today's Tasks" color="#166534" />
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, background: tasksDone.shlok ? "linear-gradient(135deg,#166534,#15803D)" : "white", borderRadius: 18, padding: "14px", border: `1.5px solid ${tasksDone.shlok ? "transparent" : "rgba(34,197,94,.2)"}`, boxShadow: "0 3px 14px rgba(22,163,74,.1)", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>📖</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: tasksDone.shlok ? "rgba(134,239,172,.8)" : "#166534" }}>Shloka</div>
              {tasksDone.shlok && <div style={{ fontSize: 16, marginTop: 4, animation: "completePop .4s ease" }}>✅</div>}
            </div>
            <div style={{ flex: 1, background: tasksDone.aarti ? "linear-gradient(135deg,#166534,#15803D)" : "white", borderRadius: 18, padding: "14px", border: `1.5px solid ${tasksDone.aarti ? "transparent" : "rgba(34,197,94,.2)"}`, boxShadow: "0 3px 14px rgba(22,163,74,.1)", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>📿</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: tasksDone.aarti ? "rgba(134,239,172,.8)" : "#166534" }}>Mantra</div>
              {tasksDone.aarti && <div style={{ fontSize: 16, marginTop: 4, animation: "completePop .4s ease" }}>✅</div>}
            </div>
            <div style={{ flex: 1, background: (tasksDone.shlok && tasksDone.aarti) ? "linear-gradient(135deg,#166534,#15803D)" : "white", borderRadius: 18, padding: "14px", border: `1.5px solid ${(tasksDone.shlok && tasksDone.aarti) ? "transparent" : "rgba(34,197,94,.2)"}`, boxShadow: "0 3px 14px rgba(22,163,74,.1)", textAlign: "center", cursor: "pointer" }} onClick={completeSadhana}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>🌟</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: (tasksDone.shlok && tasksDone.aarti) ? "rgba(134,239,172,.8)" : "#166534" }}>Complete</div>
            </div>
          </div>
        </div>

        {/* Mantra counter */}
        <div style={{ margin: "16px 16px 0" }}>
          <SectionHead title="📿 Mantra Jaap — 108" color="#166534" />
          <div style={{ background: "white", borderRadius: 22, padding: "20px", boxShadow: "0 4px 16px rgba(22,163,74,.1)", border: "1.5px solid rgba(34,197,94,.15)", textAlign: "center" }}>
            <div style={{ fontFamily: "'Noto Sans Devanagari',serif", fontSize: 18, fontWeight: 700, color: "#166534", marginBottom: 4 }}>ॐ नमः शिवाय</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 42, fontWeight: 700, color: mantraCount >= MANTRA_TARGET ? "#22C55E" : "#14532D", marginBottom: 4 }}>{mantraCount}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 600, color: "rgba(22,163,74,.5)", marginBottom: 16 }}>/ {MANTRA_TARGET}</div>
            {/* Progress */}
            <div style={{ height: 6, background: "rgba(34,197,94,.15)", borderRadius: 3, marginBottom: 18, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min((mantraCount / MANTRA_TARGET) * 100, 100)}%`, background: "linear-gradient(90deg,#22C55E,#16A34A)", borderRadius: 3, transition: "width .3s" }} />
            </div>
            <button onClick={doMantraTap} disabled={mantraCount >= MANTRA_TARGET} style={{ width: 80, height: 80, borderRadius: "50%", background: mantraCount >= MANTRA_TARGET ? "linear-gradient(135deg,#22C55E,#16A34A)" : "linear-gradient(135deg,#4ADE80,#22C55E)", border: "none", cursor: mantraCount >= MANTRA_TARGET ? "default" : "pointer", fontSize: 28, boxShadow: "0 6px 22px rgba(34,197,94,.35)", transition: "transform .1s", animation: "pulse 3s infinite" }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(.94)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
              {mantraCount >= MANTRA_TARGET ? "✅" : "📿"}
            </button>
          </div>
        </div>

        {/* Shlokas */}
        <div style={{ margin: "16px 16px 0" }}>
          <SectionHead title="📖 Shlokas" color="#166534" />
          {SHLOKAS.map((sl, i) => (
            <div key={sl.id} style={{ background: "white", borderRadius: 20, overflow: "hidden", marginBottom: 10, boxShadow: "0 3px 14px rgba(22,163,74,.08)", border: "1.5px solid rgba(34,197,94,.12)", animation: `fadeUp .4s ${i * .08}s ease both` }}>
              <button onClick={() => markShlokaRead(sl.id)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ textAlign: "left", flex: 1 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#22C55E", marginBottom: 4 }}>{sl.grantha} · {sl.chapter}</div>
                  <div style={{ fontFamily: "'Noto Sans Devanagari',serif", fontSize: 12, fontWeight: 600, color: "#14532D", lineHeight: 1.6 }}>{sl.sanskrit.split("\n")[0]}…</div>
                </div>
                <span style={{ fontSize: 13, color: "#22C55E", transform: expandedShloka === sl.id ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▼</span>
              </button>
              {expandedShloka === sl.id && (
                <div style={{ padding: "0 16px 16px", animation: "fadeUp .3s ease both" }}>
                  <div style={{ height: 1, background: "rgba(34,197,94,.15)", marginBottom: 12 }} />
                  <div style={{ fontFamily: "'Noto Sans Devanagari',serif", fontSize: 14, fontWeight: 600, color: "#14532D", lineHeight: 1.9, whiteSpace: "pre-line", marginBottom: 10 }}>{sl.sanskrit}</div>
                  <div style={{ fontFamily: "'Noto Sans Devanagari',serif", fontSize: 12, color: "#166534", lineHeight: 1.7, marginBottom: 8 }}>{sl.hindi}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 12, color: "rgba(22,101,52,.6)", lineHeight: 1.6 }}>{sl.english}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Hanuman Chalisa */}
        <div style={{ margin: "16px 16px 0" }}>
          <SectionHead title="🪔 Hanuman Chalisa" color="#166534" />
          {CHAUPAIS.map((c, i) => (
            <div key={i} style={{ background: c.bg, border: `1.5px solid ${c.bd}`, borderRadius: 18, padding: "14px 16px", marginBottom: 8, animation: `fadeUp .4s ${i * .05}s ease both` }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: c.c, marginBottom: 8 }}>{c.n}</div>
              <div style={{ fontFamily: "'Noto Sans Devanagari',serif", fontSize: 13, fontWeight: 600, color: "#1A0800", lineHeight: 1.9, whiteSpace: "pre-line", marginBottom: 8 }}>{c.txt}</div>
              <div style={{ fontFamily: "'Noto Sans Devanagari',serif", fontSize: 11, color: "rgba(100,60,0,.6)", lineHeight: 1.6 }}>{c.hi}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <BNav active="sadhana" onNav={onNav} />
    </div>
  );
}
