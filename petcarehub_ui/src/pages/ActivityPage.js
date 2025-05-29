import React, { useState } from "react";

// Accent color palette based on project description and App.css variables
const ACCENT = "var(--kavia-orange, #E87A41)";
const DARK = "var(--kavia-dark, #1A1A1A)";
const SECONDARY = "var(--kavia-secondary, #e2dda6)";
const BG = "#222";
const BORDER = "var(--border-color, rgba(255,255,255,0.1))";
const CARD_BG = "#292a2d";
const GRADIENT = `linear-gradient(90deg, ${ACCENT} 0%, #f8cbb1 100%)`;

// Example badge icons (For real app: replace with images or SVGs)
const badges = [
  { name: "First Walk!", emoji: "🐾" },
  { name: "Active Week", emoji: "💪" },
  { name: "Consistency Star", emoji: "⭐" },
  { name: "Hydration Hero", emoji: "💧" },
];

function Card({ title, children, style, ...rest }) {
  return (
    <div
      style={{
        background: CARD_BG,
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        padding: 24,
        marginBottom: 24,
        border: `1px solid ${BORDER}`,
        ...style,
      }}
      {...rest}
    >
      <h2 style={{
        fontSize: 22,
        margin: "0 0 12px",
        color: ACCENT,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}>{title}</h2>
      {children}
    </div>
  );
}

function AnimatedProgress({ percent, color = ACCENT, label }) {
  return (
    <div style={{margin: "10px 0", width: "100%"}}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#fff" }}>
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 15,
          background: "#232323",
          borderRadius: 8,
          marginTop: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            transition: "width 1.3s cubic-bezier(0.4,1,0.2,1)",
            width: `${percent}%`,
            height: "100%",
            background: GRADIENT,
            borderRadius: 8,
            boxShadow: "0 0 4px 0px #ffa15a88",
          }}
        />
      </div>
    </div>
  );
}

function AnimatedMoodSlider({ label, value, setValue, min, max, emojiMap, step=1 }) {
  return (
    <div style={{
      margin: "24px 0 12px",
      display: "flex",
      alignItems: "center"
    }}>
      <span style={{fontSize: 24, marginRight: 8, minWidth: 38}}>
        {emojiMap[value] || "⚪"}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={e => setValue(Number(e.target.value))}
        style={{ accentColor: ACCENT, flex: 1, marginRight: 12 }}
      />
      <span style={{color: "#fff", fontWeight: 500}}>{label}</span>
    </div>
  );
}

// PUBLIC_INTERFACE
function ActivityPage() {
  // States for inputs & logs
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [log, setLog] = useState([]);
  const [mood, setMood] = useState(2);
  const [energy, setEnergy] = useState(2);
  const [media, setMedia] = useState([]);
  const [goalProgress, setGoalProgress] = useState(55); // stub % for demonstration

  // Demo chart data
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekData = [45, 30, 50, 60, 80, 30, 55];

  const moodEmojiMap = ["😴", "😐", "😊", "😄", "🤪"];
  const energyEmojiMap = ["🥱", "😌", "🙂", "🚀", "🏃‍♂️"];

  function addLog() {
    if (!activity.trim() || !duration.trim()) return;
    setLog([
      { activity, duration, ts: Date.now() },
      ...log,
    ]);
    setActivity("");
    setDuration("");
  }

  function onMediaUpload(e) {
    const files = Array.from(e.target.files || []);
    setMedia([...media, ...files]);
  }

  // Placeholder for chart (uses canvas for basic fake chart)
  function WeeklyActivityChart({ labels, data }) {
    // For demo only, replace with chart library (e.g., Chart.js, recharts) in production
    const height = 90, width = 310;
    const max = Math.max(...data, 1);
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display:"block"}}>
        {/* Axis */}
        <line x1="30" y1={height-20} x2={width-10} y2={height-20} stroke={BORDER} strokeWidth="1"/>
        {/* Bars */}
        {data.map((val, i) => {
          const barH = Math.round((val / max) * 48);
          return (
            <g key={i}>
              <rect
                x={38 + i * 38}
                y={height-20-barH}
                width={20}
                height={barH}
                rx={5}
                fill={ACCENT}
                style={{transition: "height 0.8s"}}
              />
              <text x={47 + i * 38} y={height-6} textAnchor="middle" fill="#fff90b" fontSize={13}>{labels[i]}</text>
            </g>
          )
        })}
      </svg>
    );
  }

  return (
    <div style={{
      background: BG,
      minHeight: "100vh",
      color: "#FFF",
      fontFamily: "Poppins,Arial,sans-serif",
      padding: "0 0 42px 0",
      maxWidth: 650,
      margin: "0 auto",
      animation: "fadein 1.2s",
    }}>
      <div style={{
        padding: "26px 0 0 0",
        textAlign: "center",
      }}>
        <h1 style={{ fontWeight: 800, fontSize: 32, lineHeight: 1, color: ACCENT, margin: 0, letterSpacing:1 }}>Activity & Wellness</h1>
        <p style={{ color: "var(--text-secondary, #FFF)", fontSize: 16, marginTop: 8, marginBottom: 20 }}>
          Track your pet’s daily activity, mood, milestones, and more.<br /> Boost their well-being with insights and a dash of fun!
        </p>
      </div>

      {/* DAILY ACTIVITY LOG */}
      <Card title="Daily Activity Log" style={{ marginTop: 8 }}>
        <div className="activity-log-input-row" style={{
          display: "flex",
          gap: 14,
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <input
            type="text"
            placeholder="Activity (e.g., Walk, Play)"
            value={activity}
            onChange={e => setActivity(e.target.value)}
            className="duration-input"
            style={{
              width: 155,
              marginRight: 5
            }}
          />
          <input
            type="text"
            placeholder="Duration (min)"
            value={duration}
            onChange={e => setDuration(e.target.value.replace(/[^\d]/g, ""))}
            className="duration-input duration-input-black"
            maxLength={3}
            style={{
              width: 100,
              marginRight: 5
            }}
          />
          <button
            className="btn"
            onClick={addLog}
            style={{marginRight: 0, marginTop: 0}}
          >Add Log</button>
        </div>
        <div style={{ marginTop: 18, maxHeight: 138, overflowY: "auto" }}>
          {log.length === 0 &&
            <div className="text-muted" style={{ fontStyle: "italic", fontSize: 15 }}>
              No activities logged for today yet.
            </div>
          }
          {log.map((item, idx) => (
            <div
              key={item.ts || idx}
              className="activity-log-row"
              style={{
                padding: "7px 0",
                borderBottom: `1px solid ${BORDER}`,
                display: "flex",
                gap: 16,
                alignItems: "center"
              }}
            >
              <span style={{
                minWidth: 80,
                fontWeight: 600,
                color: "var(--kavia-orange, #E87A41)"
              }}>{item.activity}</span>
              <span className="badge badge-black-orange" style={{fontSize:"15px"}}>{item.duration} min</span>
              <span style={{
                fontSize: 13,
                color: "var(--text-secondary, #999)"
              }}>
                {new Date(item.ts).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* WEEKLY GRAPHS */}
      <Card title="Weekly Activity Graphs">
        <div style={{textAlign:"center"}}>
          <WeeklyActivityChart labels={weekLabels} data={weekData}/>
          <div style={{fontSize:15, color:"#C1CDE7",marginTop:-2}}>Minutes active each day</div>
        </div>
      </Card>

      {/* GOALS & PROGRESS */}
      <Card title="Goals & Progress">
        <div>
          <AnimatedProgress percent={goalProgress} label="This Week's Activity Goal"/>
          <div style={{marginTop:8}}>
            <AnimatedProgress percent={80} label="Hydration Goal" color="#71c9ce"/>
          </div>
          <div style={{marginTop:8}}>
            <AnimatedProgress percent={36} label="Training Sessions" color="#f1a01b"/>
          </div>
        </div>
      </Card>

      {/* MOOD AND ENERGY TRACKING */}
      <Card title="Mood & Energy">
        <AnimatedMoodSlider
          label="Mood"
          value={mood}
          setValue={setMood}
          min={0}
          max={4}
          emojiMap={moodEmojiMap}
        />
        <AnimatedMoodSlider
          label="Energy"
          value={energy}
          setValue={setEnergy}
          min={0}
          max={4}
          emojiMap={energyEmojiMap}
        />
        <div style={{color: "#B5F86C", marginTop: 7, fontWeight:600}}>
          {`Current Mood: ${moodEmojiMap[mood]} / Energy: ${energyEmojiMap[energy]}`}
        </div>
      </Card>

      {/* MILESTONES (GAMIFICATION BADGES) */}
      <Card title="Milestones & Badges">
        <div style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
        }}>
          {badges.map((b, idx) =>
            <div key={b.name} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "#23281b",
              borderRadius: 14,
              padding: "10px 20px",
              minWidth: 85,
              color: "#fff",
              boxShadow: idx === 2
                ? `0 0 16px 2px #b4e67380`
                : "none",
              border: idx === 0 ? "2px solid #E87A41" : "2px solid #2f2f29",
              transition: "transform 0.3s",
              animation: idx === 0 ? "popbadge 1s" : "none"
            }}>
              <span style={{ fontSize: 34, marginBottom: 3, filter: "drop-shadow(0 0 7px #E87A41d0)" }}>
                {b.emoji}
              </span>
              <span style={{
                fontSize: 14,
                textAlign: "center",
                marginBottom: -2,
                fontWeight: 600,
                letterSpacing: 0.2,
              }}>{b.name}</span>
            </div>
          )}
        </div>
      </Card>

      {/* MEDIA UPLOADER */}
      <Card title="Media Uploads">
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            id="media-upload"
            style={{display:"none"}}
            onChange={onMediaUpload}
          />
          <label htmlFor="media-upload"
            className="btn"
            style={{
              background: ACCENT,
              color: "#fff",
              fontWeight: 700,
              borderRadius:8,
              padding: "10px 18px",
              cursor:"pointer",
              border:"none"
            }}
          >
            Upload Media
          </label>
          <span style={{color:"var(--text-secondary)", fontSize:15}}>
            Upload your pet's photos/videos from walks & play!
          </span>
        </div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:10 }}>
          {media.map((f, idx) => (
            <div key={idx} style={{
              width: 55, height: 55, borderRadius: 8,
              background: "#131313",
              border: `1px solid ${BORDER}`,
              overflow: "hidden", display: "flex",
              alignItems: "center", justifyContent: "center",
              position: "relative"
            }}>
              {f.type && f.type.startsWith("image") ?
                (<img
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />)
                : f.type && f.type.startsWith("video") ?
                  (<span style={{ fontSize: 27, color: "#23cdf3" }}>🎬</span>)
                  : (<span style={{ fontSize: 25, color: "#ffec99" }}>📁</span>)
              }
            </div>
          ))}
        </div>
      </Card>

      {/* REMINDERS PLACEHOLDER */}
      <Card title="Reminders & Scheduled Activities"
        style={{borderColor: "#a6f1e9"}}
      >
        <div style={{fontSize:15, color:"#C2E9E0",fontStyle:"italic"}}>
          Upcoming reminders and scheduled activities for your pet will appear here.<br />
          <span style={{fontSize:18}}>⏰</span> <span style={{color:ACCENT, fontWeight:600}}>Coming soon!</span>
        </div>
      </Card>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(40px);}
          60% {opacity: 0.6;}
          100% { opacity: 1; transform: none;}
        }
        @keyframes popbadge {
          0% {transform: scale(0.78);}
          80% {transform: scale(1.15);}
          100% {transform: scale(1);}
        }
        
        /* Button focus style */
        .btn:focus, .btn:active {
          outline: 2px solid ${ACCENT};
        }
      `}</style>
    </div>
  );
}

export default ActivityPage;
