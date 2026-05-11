"use client";
import { useState } from "react";
import { LEVELS, getBadges } from "@/lib/data";
import { BNav, StatusBar, SectionHead } from "@/components/shared";
import { useStore } from "@/store";

export default function Profile({ onNav }: { onNav: (s: string) => void }) {
  const { karma, tapasyaDays, shlokaCount, mantaDays, nightPrayerDays, bhaktDays, user, setUser, setScreen } = useStore();
  const [notif, setNotif] = useState(true);

  const level = LEVELS.find((l) => karma >= l.min && karma <= l.max) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const progress = nextLevel ? Math.round(((karma - level.min) / (nextLevel.min - level.min)) * 100) : 100;

  const badgeGroups = getBadges(tapasyaDays, shlokaCount, mantaDays, nightPrayerDays, bhaktDays);

  const signOut = () => {
    setUser(null);
    setScreen("splash");
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(170deg,#FFF8EC 0%,#FFF2D6 55%,#FFE8B0 100%)", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 320, height: 320, background: "radial-gradient(circle,rgba(200,120,16,.1) 0%,transparent 65%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0, animation: "breathe 8s ease-in-out infinite" }} />

      <StatusBar />
      <div style={{ padding: "8px 22px 0", zIndex: 10, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(196,112,16,.6)", marginBottom: 2 }}>👤 Your Journey</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#1A0800", letterSpacing: .5, textTransform: "uppercase" }}>Profile</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 82, zIndex: 5 }}>
        {/* Avatar + level */}
        <div style={{ margin: "12px 16px 0", background: "linear-gradient(135deg,#7C2D12,#9A3412)", borderRadius: 24, padding: "22px 20px", boxShadow: "0 10px 32px rgba(120,45,18,.3)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", right: -20, transform: "translateY(-50%)", fontFamily: "'Noto Sans Devanagari',serif", fontSize: 160, color: "rgba(255,255,255,.05)", lineHeight: 1 }}>ॐ</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#FFD700,#FF8C00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, boxShadow: "0 0 28px rgba(255,200,0,.4)", border: "2.5px solid rgba(255,255,255,.3)", animation: "floatUp 4s ease-in-out infinite" }}>🧘</div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,200,100,.5)", marginBottom: 4 }}>Sadhak</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 700, color: "white" }}>{user ? `+91 ${user.phone}` : "Guest Seeker"}</div>
              <div style={{ display: "inline-block", background: `${level.color}33`, border: `1px solid ${level.color}66`, borderRadius: 20, padding: "3px 10px", marginTop: 5 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 800, color: level.color, letterSpacing: 1 }}>{level.label}</span>
              </div>
            </div>
          </div>
          {/* Karma progress */}
          <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,200,100,.5)" }}>Karma</span>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 700, color: "#FFD700" }}>{karma.toLocaleString()}</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,.15)", borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${level.color},#FFD700)`, borderRadius: 3, transition: "width .6s" }} />
          </div>
          {nextLevel && <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 600, color: "rgba(255,200,100,.4)" }}>Next: {nextLevel.label} · {(nextLevel.min - karma).toLocaleString()} karma away</div>}
        </div>

        {/* Stats */}
        <div style={{ margin: "16px 16px 0" }}>
          <SectionHead title="Statistics" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Sadhana Streak", val: `${tapasyaDays} 🔥`, color: "#F97316" },
              { label: "Shlokas Read", val: `${shlokaCount} 📖`, color: "#60A5FA" },
              { label: "Journey Days", val: `${mantaDays} 🛤️`, color: "#A78BFA" },
              { label: "Bhakti Days", val: `${bhaktDays} 🙏`, color: "#EC4899" },
            ].map((s) => (
              <div key={s.label} style={{ background: "white", borderRadius: 18, padding: "14px", boxShadow: "0 3px 14px rgba(180,80,0,.06)", border: "1.5px solid rgba(255,165,0,.1)" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#C4A882", marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div style={{ margin: "16px 16px 0" }}>
          <SectionHead title="🏅 Badges" />
          {badgeGroups.map((group) => {
            const total = group.items.length;
            return (
              <div key={group.cat} style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#C4A882", marginBottom: 8, paddingLeft: 4 }}>{group.cat}</div>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${total}, 1fr)`, gap: 8 }}>
                  {group.items.map((b) => (
                    <div key={b.n} style={{ background: "white", borderRadius: 18, padding: total === 1 ? "14px 18px" : "14px 8px", display: "flex", flexDirection: total === 1 ? "row" : "column", alignItems: "center", gap: total === 1 ? 14 : 5, boxShadow: b.e ? `0 4px 16px ${b.color}22` : "0 2px 8px rgba(180,80,0,.05)", border: `1.5px solid ${b.e ? b.color + "35" : "rgba(200,160,80,.08)"}`, opacity: b.e ? 1 : .35, position: "relative", overflow: "hidden", transition: "all .2s" }}>
                      {b.e && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2.5, background: `linear-gradient(90deg,${b.color},${b.color}88)` }} />}
                      {b.e && <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", width: 60, height: 60, background: `radial-gradient(circle,${b.glow} 0%,transparent 70%)`, pointerEvents: "none" }} />}
                      <div style={{ fontSize: total === 1 ? 28 : 22, flexShrink: 0 }}>{b.ico}</div>
                      <div style={{ flex: total === 1 ? 1 : undefined }}>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: total === 1 ? 11 : 8, fontWeight: 800, letterSpacing: .5, textAlign: total === 1 ? "left" : "center", textTransform: "uppercase", color: b.e ? b.color : "#C4B8A8", lineHeight: 1.2 }}>{b.n}</div>
                        {b.e
                          ? <div style={{ fontFamily: "'Syne',sans-serif", fontSize: total === 1 ? 9 : 7, fontWeight: 600, color: b.color, letterSpacing: .5, textAlign: total === 1 ? "left" : "center", marginTop: 2 }}>Earned ✓</div>
                          : <div style={{ fontFamily: "'Syne',sans-serif", fontSize: total === 1 ? 9 : 7, fontWeight: 500, color: "rgba(180,140,80,.5)", letterSpacing: .3, textAlign: total === 1 ? "left" : "center", fontStyle: "italic", marginTop: 2, lineHeight: 1.3 }}>{b.desc}</div>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Settings */}
        <div style={{ padding: "14px 16px 0" }}>
          <SectionHead title="Settings" />
          <div style={{ background: "white", borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 16px rgba(180,80,0,.07)", border: "1.5px solid rgba(255,165,0,.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(255,165,0,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🔔</div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: "#4A2800", flex: 1 }}>Daily Notifications</span>
              <div onClick={() => setNotif((v) => !v)} style={{ width: 48, height: 28, borderRadius: 14, background: notif ? "linear-gradient(135deg,#E8A020,#C47010)" : "rgba(200,180,150,.2)", cursor: "pointer", position: "relative", transition: "background .25s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 4, left: notif ? 22 : 4, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left .25s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div style={{ padding: "14px 16px 0" }}>
          <button onClick={signOut} style={{ width: "100%", background: "rgba(255,100,80,.08)", border: "1.5px solid rgba(255,100,80,.2)", borderRadius: 18, padding: "14px", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "#EF4444", cursor: "pointer" }}>Sign Out</button>
        </div>
        <div style={{ height: 16 }} />
      </div>

      <BNav active="profile" onNav={onNav} />
    </div>
  );
}
