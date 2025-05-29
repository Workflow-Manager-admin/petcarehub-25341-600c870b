import React, { useState, useMemo } from "react";

// PUBLIC_INTERFACE
/**
 * Modern, visually appealing Dashboard for PetCareHub.
 * - Clean glassy design, Poppins/Inter font.
 * - Eight key sections: header, metrics/cards, reminders, analytics, activity feed, quick actions, pet switcher, inspiration tip.
 * - Lucide/FontAwesome icons. Charts via animated SVG/CSS, no dependencies. No emojis.
 * - All data delivered via props.
 */
function Dashboard({
  pets = [],
  selectedPetId,
  setSelectedPetId,
  reminders = [],
  medicalRecords = {},
  onAddReminder,
  onToggleDoneReminder,
  onEditReminder,
  onDeleteReminder,
}) {
  // Placeholder user (demo, no auth yet)
  const user = {
    name: "Alex Pawsome",
    title: "Pet Parent",
    profilePic: null, // fallback to icon
  };

  // -- PET SWITCHER --
  const petOptions = pets.map((p) => ({
    label: p.name,
    value: p.id,
    photo: p.photo,
    breed: p.breed,
    age: p.age,
  }));
  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0] || null;

  // -- SUMMARY CARD DATA (Health, Diet, Activity, Appointments) --
  const summaryData = [
    {
      key: "health",
      label: "Health",
      value: selectedPet && medicalRecords[selectedPet.id]?.history?.length
        ? "Good"
        : "No Records",
      pct: selectedPet && medicalRecords[selectedPet.id]?.history?.length
        ? 80
        : 12,
      icon: <i className="lucide lucide-heart-pulse" />,
      c: "var(--success)",
      action: { label: "View", onClick: () => window.location.href = "/health" },
      desc: "Medical records",
    },
    {
      key: "diet",
      label: "Diet",
      value: "Balanced",
      pct: 72,
      icon: <i className="lucide lucide-utensils" />,
      c: "var(--accent)",
      action: { label: "View", onClick: () => window.location.href = "/diet" },
      desc: "Last meal logged",
    },
    {
      key: "activity",
      label: "Activity",
      value: "Active",
      pct: 63,
      icon: <i className="lucide lucide-running" />,
      c: "var(--primary)",
      action: { label: "View", onClick: () => window.location.href = "/activity" },
      desc: "Today's walks/plays",
    },
    {
      key: "appointments",
      label: "Appointments",
      value:
        reminders.filter(
          (r) =>
            r.petId === (selectedPet && selectedPet.id) &&
            r.title &&
            r.title.toLowerCase().includes("vet")
        ).length > 0
          ? "Upcoming"
          : "None",
      pct:
        reminders.filter(
          (r) =>
            r.petId === (selectedPet && selectedPet.id) &&
            r.title &&
            r.title.toLowerCase().includes("vet")
        ).length > 0
          ? 46
          : 8,
      icon: <i className="lucide lucide-calendar-clock" />,
      c: "var(--info)",
      action: { label: "Book", onClick: () => window.location.href = "/appointments" },
      desc: "Vet/groom/grooming tasks",
    },
  ];

  // -- DAILY REMINDERS PREVIEW (up to 3, sorted) --
  const now = new Date();
  const remindersSorted = useMemo(() => {
    return [...reminders]
      .filter((r) => r.petId === (selectedPet ? selectedPet.id : null))
      .sort((a, b) => (a.dueDate && b.dueDate ? new Date(a.dueDate) - new Date(b.dueDate) : 0));
  }, [reminders, selectedPet]);
  const topReminders = remindersSorted.slice(0, 3);

  // -- ANALYTICS / MINI-CHARTS --
  // Generate mock analytics: calories, activity(min), sleep(hr)
  // For demo, generate some values
  const analytics = [
    {
      key: "calories",
      label: "Calories",
      value: selectedPet ? 456 : 0,
      unit: "kcal",
      pct: 68,
      c: "var(--warning)",
      icon: <i className="lucide lucide-flame" />,
    },
    {
      key: "activity",
      label: "Activity",
      value: selectedPet ? 73 : 0,
      unit: "min",
      pct: 73,
      c: "var(--success)",
      icon: <i className="lucide lucide-running" />,
    },
    {
      key: "sleep",
      label: "Sleep",
      value: selectedPet ? 9.1 : 0,
      unit: "hr",
      pct: 91,
      c: "var(--secondary)",
      icon: <i className="lucide lucide-bed" />,
    },
  ];

  // -- RECENT ACTIVITY FEED --
  const activityFeed = useMemo(() => {
    // Compose timeline: reminders + medical + mock data
    const events = [];
    reminders
      .filter((r) => !!r.dueDate && r.petId === (selectedPet && selectedPet.id))
      .forEach((r) => {
        events.push({
          type: "reminder",
          ts: r.dueDate,
          label: r.title,
          desc: r.notes,
          isDone: !!r.done,
        });
      });
    const med = medicalRecords[selectedPet?.id] || {};
    ["history", "vaccinations", "prescriptions", "visits"].forEach((k) => {
      (med[k] || []).forEach((item) =>
        events.push({
          type: "medical",
          ts: item.date || item.start || item.visitDate,
          label: k === "history" ? item.condition : item.vaccine || item.medicine || item.reason,
          desc: item.notes || item.vet || "",
        })
      );
    });
    // Add mock activity: meal log today at 7am
    if (selectedPet)
      events.push({
        type: "meal",
        ts: `${now.toISOString().slice(0, 10)}T07:00`,
        label: "Fed breakfast",
        desc: "Meal logged",
      });
    // Sort by ts desc
    return events
      .filter((e) => !!e.ts)
      .sort((a, b) => new Date(b.ts) - new Date(a.ts))
      .slice(0, 7);
  }, [reminders, medicalRecords, selectedPet, now]);

  // -- QUICK ACTIONS --
  const quickActions = [
    {
      icon: <i className="lucide lucide-notebook-pen" />,
      label: "Log Health",
      onClick: () => window.location.href = "/health",
    },
    {
      icon: <i className="lucide lucide-running" />,
      label: "Log Activity",
      onClick: () => window.location.href = "/activity",
    },
    {
      icon: <i className="lucide lucide-utensils" />,
      label: "Add Meal",
      onClick: () => window.location.href = "/diet",
    },
    {
      icon: <i className="lucide lucide-calendar-plus" />,
      label: "Book Appointment",
      onClick: () => window.location.href = "/appointments",
    },
  ];

  // -- INSPIRATIONAL QUOTE --
  const tipList = [
    "A happy pet is a healthy pet.",
    "Small walks, big smiles. Exercise daily.",
    "Vet visits today, peace of mind tomorrow.",
    "Nutrition matters. Balance each meal.",
    "Play with your pet; the joy is mutual.",
    "Consistency creates comfort for your furry friend.",
    "A well-rested pet lives longer.",
  ];
  const [tipIdx, setTipIdx] = useState(0);

  // Auto-cycle tip every 12 seconds
  React.useEffect(() => {
    const t = setInterval(() => setTipIdx(idx => (idx + 1) % tipList.length), 12000);
    return () => clearInterval(t);
  }, []);

  function formatDate(dt, opts = {}) {
    try {
      const d = new Date(dt);
      if (opts.short) return d.toLocaleDateString(undefined, {month:"short",day:"numeric"});
      return d.toLocaleString(undefined, {month:"short", day:"numeric", hour: "2-digit", minute: "2-digit"});
    } catch (e) {
      return dt;
    }
  }

  // -- SVG MINI-CHART (Pie/Circle) --
  function CircleProgress({ pct = 0, size = 56, color = "#879d85", stroke = 6, label = "", icon }) {
    const r = (size - stroke) / 2;
    const circumference = 2 * Math.PI * r;
    const progress = Math.max(0, Math.min(pct, 100)) * circumference / 100;
    return (
      <svg width={size} height={size} style={{display:"block",overflow:"visible"}}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#ebedea"
          strokeWidth={stroke}
          fill="none"
          style={{}}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{transition:"stroke-dashoffset 0.85s cubic-bezier(.33,.7,.29,1)",filter:"drop-shadow(0 1px 7px #879d8536)"}}
        />
        {icon && (
          <foreignObject x={size/2-18} y={size/2-18} width={36} height={36}>
            <div style={{fontSize:"1.65em", display:"flex",alignItems:"center",justifyContent:"center"}}>{icon}</div>
          </foreignObject>
        )}
      </svg>
    );
  }

  // -- PROFILE AVATAR (simple, no emoji fallback) --
  function UserAvatar({ photo, size = 48 }) {
    return photo ? (
      <img
        src={photo}
        alt="profile"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2.3px solid var(--primary)",
          background: "#eef2e2",
        }}
      />
    ) : (
      <span style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fbed",
        border: "2.3px solid var(--primary)"
      }}>
        <i className="lucide lucide-user" style={{fontSize: size/2}} />
      </span>
    );
  }

  // -- PET AVATAR (reuse logic, fallback is colored circle with initial) --
  function PetThumb({ pet, size = 44 }) {
    if (!pet) return null;
    return pet.photo ? (
      <img
        src={pet.photo}
        alt="pet"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid var(--accent)",
          boxShadow: "0 2px 11px #65646125",
        }}
      />
    ) : (
      <span style={{
        width: size, height: size, borderRadius: "50%",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(98deg,#e2dda6 70%,#879d85 100%)",
        color: "#656461", fontSize: size*0.52, fontWeight: 700,
        border: "2px solid var(--accent)",
        boxShadow: "0 3px 12px #e2dda642"
      }}>{pet.name[0] || "?"}</span>
    );
  }

  // -- RENDER --
  return (
    <div
      className="container card card-glass"
      style={{
        margin: "2.5rem auto",
        maxWidth: 1100,
        minWidth: 280,
        fontFamily: "var(--font-sans)",
        boxShadow: "var(--shadow-card)",
        animation: "card-in 1.18s cubic-bezier(.19,.8,.39,1) both",
        background: "var(--glass-light)"
      }}
    >
      {/* 1. WELCOME HEADER */}
      <section style={{
        display: "flex", alignItems: "center", gap: 30,
        marginBottom: 24,
        justifyContent: "space-between"
      }}>
        <div style={{display:"flex",alignItems:"center",gap:19}}>
          <UserAvatar photo={user.profilePic} size={54}/>
          <div>
            <div style={{
              fontWeight: 600, color: "var(--primary)",
              fontSize: "1.13em", opacity: 0.95, letterSpacing: "0.015em"
            }}>
              Welcome back, {user.name}
            </div>
            <div style={{
              color: "var(--accent)", fontSize: "1em", fontWeight: 400, opacity: 0.7
            }}>{user.title}</div>
            <div style={{
              fontSize: "0.95em", color: "var(--text-secondary)", fontWeight: 500, letterSpacing:0.014,
              marginTop: "2px"
            }}>{(new Date()).toLocaleDateString(undefined, {weekday:"long",month:"short",day:"numeric"})}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:17}}>
          {/* Pet thumbnail & switcher */}
          {selectedPet && (
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <PetThumb pet={selectedPet} size={44} />
              <select
                value={selectedPet.id}
                style={{
                  minWidth:90, borderRadius:8,padding:"6px 14px",
                  background: "#fff", color: "var(--accent)",fontWeight:500, border: "1.4px solid var(--secondary)",fontFamily:"var(--font-sans)",fontSize:"1.09em"
                }}
                onChange={e=>setSelectedPetId(Number(e.target.value))}
                aria-label="Switch pet"
              >
                {petOptions.map(p=>
                  <option value={p.value} key={p.value}>{p.label}</option>
                )}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* 2. SUMMARY METRIC CARDS */}
      <section className="grid grid-2-cols" style={{gap:"1.5rem",marginBottom:36}}>
        {summaryData.map(card => (
          <div
            key={card.key}
            className="card card-glass card-animated"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 21,
              background: "var(--glass-light)",
              borderRadius: 18,
              boxShadow: "var(--shadow-card)",
              border: "var(--border-card)",
              minHeight: 108,
              opacity: 0.98,
            }}
          >
            <div>
              <CircleProgress pct={card.pct} size={54} color={card.c} icon={card.icon}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:"1.02em", color:"var(--primary)", fontWeight:700, marginBottom:1}}>{card.label}</div>
              <div style={{fontWeight:600,fontSize:"1.19em",color:"var(--accent)",letterSpacing:"0.01em"}}>{card.value}</div>
              <div style={{fontSize:"0.96em",color:"var(--text-secondary)",opacity:0.8}}>
                {card.desc}
              </div>
            </div>
            <button
              className="btn btn-glass"
              style={{
                fontWeight:500,
                fontSize:"0.98em",
                padding:"5px 17px",
                margin:0,
                marginLeft:7,boxShadow:"var(--shadow-btn)"
              }}
              tabIndex={0}
              onClick={card.action.onClick}
              aria-label={card.label + " action"}
            >
              <span><i className="lucide lucide-arrow-right" /></span> {card.action.label}
            </button>
          </div>
        ))}
      </section>

      <section className="grid grid-2-cols" style={{gap:"2.2rem", marginBottom:33}}>
        {/* 3. REMINDERS */}
        <div style={{minWidth:0,flex:1}}>
          <div style={{fontWeight:600,color:"var(--primary)",marginBottom:7,fontSize:"1.08em"}}>Reminders</div>
          {topReminders.length === 0 ? (
            <div style={{
              fontSize:"1em", color:"var(--text-muted)", background:"#fafcf7",borderRadius:11, padding:"1em 1.3em"
            }}>No reminders for this pet yet.</div>
          ) : (
            <ul style={{listStyle:"none",padding:0,margin:0}}>
              {topReminders.map(r => (
                <li key={r.id} style={{
                  display:"flex",alignItems:"center",marginBottom:10,background:"#fbfdf2",borderRadius:8,padding:"7px 11px",boxShadow:"0 2px 8px #e2dda611"
                }}>
                  <span style={{fontSize:"1.13em",color:"#e7c341",marginRight:8}}><i className="lucide lucide-bell-ring" /></span>
                  <span style={{
                    flex:1,
                    fontWeight:600,
                    color: r.done ? "#b6b7ac" : "var(--accent)",
                    textDecoration: r.done ? "line-through" : "none",
                    fontSize: "0.99em"
                  }}>{r.title}</span>
                  <span style={{fontSize:"0.99em",color:"#aeb47c",marginLeft:8}}>
                    {formatDate(r.dueDate, {short:true})}
                  </span>
                  <button
                    className="btn btn-glass"
                    tabIndex={0}
                    style={{marginLeft:9,padding:"3px 12px",fontSize:"0.93em",fontWeight:500,background:"#e2dda6",color:"#656461"}}
                    onClick={()=>onToggleDoneReminder(r.id)}
                  >{r.done ? "Undone" : "Done"}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* 4. MINI ANALYTICS/CHARTS */}
        <div style={{minWidth:0,flex:1}}>
          <div style={{fontWeight:600,color:"var(--primary)",marginBottom:7,fontSize:"1.08em"}}>Today's Analytics</div>
          <div className="grid" style={{gridTemplateColumns: "repeat(3,1fr)",gap:"1.1em"}}>
            {analytics.map(a=>(
              <div key={a.key} style={{
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minWidth:0,background:"#fbfdf7",borderRadius:12,
                padding:"8px 0",boxShadow:"0 2px 7px #e2dda619"
              }}>
                <div style={{marginBottom:4}}>
                  <CircleProgress pct={a.pct} size={36} color={a.c} icon={a.icon}/>
                </div>
                <div style={{fontWeight:600,fontSize:"1.05em",color:"var(--accent)"}}>{a.value}<span style={{color:"#c6c381",fontWeight:500,fontSize:"0.89em",marginLeft:4}}>{a.unit}</span></div>
                <div style={{fontSize:"0.97em",color:"var(--text-secondary)", fontWeight:500,opacity:0.77}}>{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RECENT ACTIVITY FEED */}
      <section className="card card-glass" style={{
        background:"#fafdfe",marginBottom:33,minHeight:70,boxShadow:"var(--shadow-glass-light)",borderRadius:19,overflow:"hidden"
      }}>
        <div style={{fontWeight:600,color:"var(--primary)",marginBottom:7,fontSize:"1.08em"}}>Recent Activity</div>
        {activityFeed.length === 0 ? (
          <div style={{color:"var(--text-secondary)",padding:"0.8em"}}>No recent activity yet.</div>
        ) : (
          <ul style={{listStyle:"none",margin:0,padding:"0 0.4em 0.6em"}}>
            {activityFeed.map((e,i)=>(
              <li key={i} style={{
                display:"flex",alignItems:"center", borderBottom: i===activityFeed.length-1?"none":"1px solid #ebedea",padding:"5.5px 0"
              }}>
                <span style={{
                  width:23, textAlign:"center",color:"#7e9f88",fontSize:"1.15em",marginRight:5
                }}>
                  <i className={
                    e.type==="meal" ? "lucide lucide-utensils"
                    : e.type==="reminder" ? "lucide lucide-bell"
                    : e.type==="medical" ? "lucide lucide-heart-pulse"
                    : "lucide lucide-activity"
                  } />
                </span>
                <span style={{flex:1,color:"#656461",fontWeight:e.isDone?400:600,opacity:e.isDone?0.74:0.98}}>
                  {e.label}
                  {e.isDone && <span style={{marginLeft:5,fontWeight:400,color:"#b6b7ac",fontSize:"0.99em"}}>(done)</span>}
                </span>
                <span style={{color:"#adb19c",fontSize:"0.98em",marginLeft:10}}>
                  {formatDate(e.ts, {short:true})}
                </span>
                {e.desc && <span style={{
                  color:"#a3a381",fontSize:"0.93em",marginLeft:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:136
                }}>{e.desc}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 6. QUICK ACTIONS */}
      <section style={{marginBottom:32, display:"flex", gap:"1.4em", flexWrap:"wrap"}}>
        {quickActions.map((a,i)=>(
          <button key={i} className="btn btn-glass" style={{
            display:"flex", alignItems:"center",gap:8,padding:"0.90em 1.85em",fontWeight:600,fontSize:"1.09em",
            letterSpacing:"0.01em",borderRadius:19,boxShadow:"var(--shadow-btn)",background:"var(--glass-light)",marginTop:0
          }} tabIndex={0} onClick={a.onClick}>
            <span style={{fontSize:"1.2em"}}>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </section>

      {/* 8. INSPIRATIONAL QUOTE/TIP */}
      <section
        className="card card-glass card-animated"
        style={{
          background: "linear-gradient(110deg, var(--secondary) 61%, var(--primary) 103%)",
          margin: "1.6em 0 0",
          borderRadius: "1.5em",
          boxShadow: "0 2px 17px #c9e6b14b, 0 1px 7px #879d8598",
          color: "#656461",
          padding: "1em 2.2em",
          fontWeight: 600,
          fontFamily: "var(--font-inter), var(--font-sans)",
          position: "relative"
        }}
      >
        <i className="lucide lucide-sparkles" style={{
          position:"absolute",left:19,top:18,fontSize:"1.2em",color:"#879d85",opacity:0.49
        }}/>
        <div style={{marginLeft:36, fontSize:"1.07em"}}>
          {tipList[tipIdx]}
        </div>
        <button
          aria-label="Next tip"
          className="btn btn-glass"
          style={{
            position: "absolute",
            right: 18,
            top: 14,
            padding: "4.5px 14px",
            fontWeight: 500,
            background: "#fff7",
          }}
          tabIndex={0}
          onClick={() => setTipIdx((tipIdx + 1) % tipList.length)}>Next</button>
      </section>
    </div>
  );
}

// props for MainContainer integration
Dashboard.defaultProps = {
  pets: [],
  reminders: [],
  selectedPetId: null,
  setSelectedPetId: () => {},
  medicalRecords: {},
  onAddReminder: () => {},
  onEditReminder: () => {},
  onDeleteReminder: () => {},
  onToggleDoneReminder: () => {},
};

export default Dashboard;
