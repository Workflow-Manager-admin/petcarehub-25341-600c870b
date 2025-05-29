import React, { useRef, useState } from "react";
// Chart.js for nutrition and water intake charts
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

/**
 * Soft accent color palette
 */
const COLORS = {
  primary: "#879d85",
  secondary: "#e2dda6",
  accent: "#656461",
  cardBg: "#f8f8f7",
  border: "rgba(133,157,133,0.17)",
  shadow: "rgba(133,157,133,0.09)",
  textPrimary: "#222",
  textSecondary: "#656461"
};

/**
 * Modern icon set (using SVGs for lightness)
 */
function Icon({ name, size = 27, color = COLORS.primary, style = {} }) {
  const icons = {
    meal: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="#fff"/>
        <rect x="8" y="11" width="8" height="5" rx="2" fill={color}/>
        <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" fill="none"/>
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <rect x="3" y="5" width="18" height="16" rx="3" fill="#fff" stroke={color} strokeWidth="2"/>
        <rect x="7" y="9" width="10" height="2" rx="1" fill={color}/>
        <rect x="7" y="13" width="6" height="2" rx="1" fill={color}/>
      </svg>
    ),
    chart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <rect width="24" height="24" fill="none"/>
        <rect x="7" y="11" width="2" height="7" rx="1" fill={color}/>
        <rect x="11" y="7" width="2" height="11" rx="1" fill={color}/>
        <rect x="15" y="14" width="2" height="4" rx="1" fill={color}/>
      </svg>
    ),
    foods: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <ellipse cx="12" cy="18" rx="8" ry="3" fill={color}/>
        <circle cx="10" cy="10" r="4" fill="#fff" stroke={color} strokeWidth="1.5"/>
        <circle cx="17" cy="14" r="2.4" fill={color}/>
      </svg>
    ),
    water: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <path d="M12 4C12 4 6 12 6 16A6 6 0 0 0 18 16C18 12 12 4 12 4Z" stroke={color} strokeWidth="2" fill="#d6e5ea"/>
      </svg>
    ),
    notes: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <rect x="4" y="4" width="16" height="16" rx="3" fill="#fff" stroke={color} strokeWidth="2"/>
        <rect x="8" y="9" width="8" height="2" rx="1" fill={color}/>
        <rect x="8" y="13" width="5" height="2" rx="1" fill={color}/>
      </svg>
    ),
    upload: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <rect x="4" y="16" width="16" height="3" rx="1.5" fill={color}/>
        <path d="M12 15V5M12 5L8 9M12 5l4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={style}>
        <path d="M5 10l4 4L15 7" stroke={color} strokeWidth="2" fill="none" />
      </svg>
    ),
    remove: (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={style}>
        <path d="M6 6l8 8M14 6l-8 8" stroke={color} strokeWidth="2"/>
      </svg>
    )
  };
  return icons[name] || null;
}

/**
 * Panel Card Layout
 */
function PanelCard({ icon, title, children, style }) {
  return (
    <div className="panel-card" style={style}>
      <div className="panel-header">
        {icon}
        <span className="panel-title">{title}</span>
      </div>
      <div className="panel-body">
        {children}
      </div>
    </div>
  );
}

/*
 * Placeholder Data
 */
const mealPlan = [
  { time: "08:00 AM", meal: "Dry Kibble", portion: "1 cup" },
  { time: "12:00 PM", meal: "Wet Food", portion: "0.5 cup" },
  { time: "06:00 PM", meal: "Chicken & Rice", portion: "1.5 cups" }
];
const weeklySchedule = [
  { day: "Mon", foods: ["Dry Kibble", "Apple Treats"] },
  { day: "Tue", foods: ["Wet Food", "Pumpkin"] },
  { day: "Wed", foods: ["Dry Kibble"] },
  { day: "Thu", foods: ["Chicken", "Carrots"] },
  { day: "Fri", foods: ["Dry Kibble", "Sweet Potato"] },
  { day: "Sat", foods: ["Wet Food"] },
  { day: "Sun", foods: ["Chicken", "Green Beans"] }
];
const nutritionData = {
  labels: ["Protein", "Fat", "Carbs", "Fiber", "Other"],
  datasets: [{
    data: [36, 22, 30, 6, 6],
    backgroundColor: [
      "#879d85",
      "#e2dda6",
      "#d6e5ea",
      "#ffe1c9",
      "#bbbcc2"
    ],
    borderWidth: 0,
  }]
};
const preferredFoods = ["Boiled Chicken", "Carrots", "Sweet Potato", "Green Beans", "Salmon"];
const restrictedFoods = ["Grapes", "Chocolate", "Onions", "Avocado", "Macadamia Nuts"];
const vetNotes = [
  { date: "2023-12-12", note: "Introduce cooked pumpkin once weekly for fiber." },
  { date: "2024-01-03", note: "Avoid any treats with food coloring or sugar." }
];
const dietFiles = [
  { name: "Jan2024_DietPlan.pdf", type: "pdf" },
  { name: "LabResults_Feb.png", type: "img" }
];
const waterIntakeData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [{
    label: "Water (cups)",
    data: [2, 2.5, 1.7, 2.2, 2, 2.9, 2.4],
    backgroundColor: "#879d85"
  }]
};

/**
 * MAIN COMPONENT
 */
// PUBLIC_INTERFACE
function DietNutritionPage() {
  // Water tracker state for "today"
  const [todaysWater, setTodaysWater] = useState(1.5);
  // File upload state
  const [uploadedDocs, setUploadedDocs] = useState([]);

  const fileRef = useRef();

  // Handle uploading simulated docs
  function handleUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setUploadedDocs(docs => [
        ...docs,
        { name: file.name, type: file.type.includes("image") ? "img" : "pdf" }
      ]);
    }
  }

  // Modern soft grid for layout
  return (
    <div className="diet-page-root">
      <h1 className="page-title">
        <Icon name="meal" size={32} /> Diet & Nutrition
      </h1>
      <div className="diet-panels-grid">
        {/* Daily Meal Planner */}
        <PanelCard
          icon={<Icon name="meal" />}
          title="Daily Meal Planner"
        >
          <table className="meal-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Meal</th>
                <th>Portion</th>
              </tr>
            </thead>
            <tbody>
              {mealPlan.map((mp, idx) => (
                <tr key={idx}>
                  <td>{mp.time}</td>
                  <td>{mp.meal}</td>
                  <td>{mp.portion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelCard>
        {/* Weekly Food Schedule */}
        <PanelCard
          icon={<Icon name="calendar" />}
          title="Weekly Food Schedule"
        >
          <div className="horizontal-scroll">
            {weeklySchedule.map((item, idx) => (
              <div className="weekly-day-card" key={item.day}>
                <div className="week-day">{item.day}</div>
                <ul className="foods-list">
                  {item.foods.map((f, i) => (
                    <li key={i}><Icon name="check" size={18} color={COLORS.primary} style={{marginRight:4}}/>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PanelCard>
        {/* Nutrition Breakdown */}
        <PanelCard
          icon={<Icon name="chart" />}
          title="Nutrition Breakdown"
        >
          <div style={{width: "100%", maxWidth: 220, margin: "0 auto"}}>
            <Doughnut data={nutritionData} options={{
              plugins: {
                legend: { display: true, position: "bottom", labels: { color: COLORS.textSecondary } }
              }
            }}/>
          </div>
        </PanelCard>
        {/* Preferred/Restricted Foods */}
        <PanelCard
          icon={<Icon name="foods" />}
          title="Preferred & Restricted Foods"
        >
          <div className="food-badges-section">
            <div className="foods-subheading">Preferred:</div>
            <div className="badges-row">
              {preferredFoods.map(f =>
                <span className="food-badge preferred" key={f}><Icon name="check" size={16} color="#66a668"/>{f}</span>
              )}
            </div>
            <div className="foods-subheading">Restricted:</div>
            <div className="badges-row">
              {restrictedFoods.map(f =>
                <span className="food-badge restricted" key={f}><Icon name="remove" size={16} color="#e57373"/>{f}</span>
              )}
            </div>
          </div>
        </PanelCard>
        {/* Water Intake Tracker */}
        <PanelCard
          icon={<Icon name="water" />}
          title="Water Intake Tracker"
        >
          <div style={{width: "100%", maxWidth: 230, margin: "0 auto"}}>
            <Bar data={waterIntakeData} options={{
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false }, ticks: { color: COLORS.textSecondary } },
                y: { min: 0, max: 4, ticks: { color: COLORS.textSecondary } }
              }
            }}/>
            <div className="water-today-row">
              <span>Today: {todaysWater} cups</span>
              <button className="btn water-btn" onClick={() => setTodaysWater(w => +(w + 0.1).toFixed(1))}>+0.1</button>
              <button className="btn water-btn" onClick={() => setTodaysWater(w => (w > 0.1 ? +(w - 0.1).toFixed(1) : 0))}>-0.1</button>
            </div>
          </div>
        </PanelCard>
        {/* Vet/Dietary Notes */}
        <PanelCard
          icon={<Icon name="notes" />}
          title="Vet & Dietary Notes"
        >
          <div className="notes-list">
            {vetNotes.map((v,idx) => (
              <div key={idx} className="note-item">
                <div className="note-date">{v.date}</div>
                <div className="note-content">{v.note}</div>
              </div>
            ))}
          </div>
        </PanelCard>
        {/* Diet Plan/Doc Upload */}
        <PanelCard
          icon={<Icon name="upload" />}
          title="Diet Plans & Uploads"
        >
          <div className="diet-upload-section">
            <input
              type="file"
              ref={fileRef}
              style={{ display: 'none' }}
              onChange={handleUpload}
              accept="application/pdf,image/*"
            />
            <button
              className="btn"
              onClick={() => fileRef.current && fileRef.current.click()}
            >
              <Icon name="upload" size={20} />Upload
            </button>
            <div className="diet-files-list">
              {[...dietFiles, ...uploadedDocs].map((f, idx) => (
                <span className="diet-file-item" key={f.name+idx}>
                  {f.type === "img" ?
                    <span className="file-img-icon">🖼️</span>
                    :
                    <span className="file-pdf-icon">📄</span>
                  }
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        </PanelCard>
      </div>
      <style>
      {`
        .diet-page-root {
          padding: 2.3rem 1rem 1rem;
          background: ${COLORS.cardBg};
          min-height: 100vh;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }
        .page-title {
          color: ${COLORS.primary};
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 1px;
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 1.3rem;
        }
        .diet-panels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
          gap: 1.3rem;
          margin-bottom: 2.5rem;
        }
        .panel-card {
          border-radius: 1.2rem;
          background: #fff;
          box-shadow: 0 2px 12px 0 ${COLORS.shadow};
          border: 1.5px solid ${COLORS.border};
          padding: 1.1rem 1.3rem 1rem 1.15rem;
          display: flex; flex-direction: column;
          transition: box-shadow 0.2s;
        }
        .panel-card:hover {
          box-shadow: 0 4px 18px 0 ${COLORS.shadow};
          border-color: ${COLORS.primary}33;
        }
        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          margin-bottom: 0.5rem;
        }
        .panel-title {
          font-size: 1.1rem;
          color: ${COLORS.accent};
          font-weight: 600;
        }
        .panel-body { flex:1; }

        /* Meal Planner Table */
        .meal-table {
          width: 100%; border-collapse: collapse; background: none;
        }
        .meal-table th, .meal-table td {
          padding: 0.6em 0.5em;
          text-align: left;
        }
        .meal-table th {
          background: ${COLORS.secondary}99;
          color: ${COLORS.primary};
          font-size: 0.99em;
          font-weight: 600;
          border-bottom: 2px solid ${COLORS.border};
        }
        .meal-table td {
          background: none;
          border-bottom: 1px solid #f2f2f4;
          color: ${COLORS.textSecondary};
        }
        .meal-table tr:last-child td { border-bottom: none; }
        /* Weekly Schedule */
        .horizontal-scroll {
          display: flex;
          overflow-x: auto;
          gap: 0.9rem;
          padding-bottom: 0.3rem;
        }
        .weekly-day-card {
          min-width: 86px;
          background: ${COLORS.secondary}22;
          border-radius: 0.9rem;
          padding: 0.7em 0.55em;
          box-shadow: 0 1px 6px 0 ${COLORS.shadow};
          border: 1px solid #ecebd9;
        }
        .week-day {
          color: ${COLORS.accent};
          font-weight: 700;
          font-size: 1em;
          margin-bottom: 0.5em;
        }
        .foods-list {
          list-style: none; margin: 0; padding: 0;
        }
        .foods-list li { 
          color: ${COLORS.primary};
          display: flex; align-items: center;
          font-size: 0.95em;
          font-weight: 400;
          margin-bottom: 0.2em;
          gap: 3px;
        }
        /* Nutrition Chart - handled by chart.js */

        /* Foods - Preferred / Restricted */
        .food-badges-section { margin-bottom: 0; }
        .foods-subheading {
          color: ${COLORS.primary};
          font-weight: 600;
          font-size: 0.97em;
          margin-bottom: 0.15em;
        }
        .badges-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          margin-bottom: 0.7em;
        }
        .food-badge {
          border-radius: 1.2em;
          padding: 0.2em 0.9em 0.2em 0.5em;
          font-size: 0.96em;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .food-badge.preferred {
          background: #e7f8ee;
          color: #3c8266;
          border: 1px solid #a2e6b5;
        }
        .food-badge.restricted {
          background: #fff7f7;
          color: #c12f2f;
          border: 1px solid #fde3e3;
        }
        /* Water Tracker */
        .water-today-row {
          margin: 0.7em 0 0.1em 0;
          display: flex;
          align-items: center;
          gap: 0.7em;
          justify-content: center;
          color: ${COLORS.accent};
          font-weight: 500;
        }
        .btn.water-btn {
          background: ${COLORS.secondary};
          border: none;
          border-radius: 1em;
          padding: 0.2em 0.8em;
          color: ${COLORS.primary};
          font-size: 1em;
          font-weight: 700;
          cursor: pointer;
          margin-left: 2px;
        }
        /* Notes */
        .notes-list {
          display: flex;
          flex-direction: column;
          gap: 0.84em;
        }
        .note-item {
          background: #faf8ef;
          border-left: 4px solid ${COLORS.primary};
          border-radius: 0.7em;
          padding: 0.55em 0.7em;
          color: ${COLORS.textSecondary};
        }
        .note-date {
          font-size: 0.92em; color: ${COLORS.accent};
          font-weight: 600;
        }
        .note-content {
          margin-top: 0.13em;
          font-size: 1em;
        }
        /* Uploads */
        .diet-upload-section {display:flex;flex-direction:column;gap:0.65em;}
        .btn {
          background: ${COLORS.primary};
          color: #fff;
          border: none;
          border-radius: 1.2em;
          padding: 0.4em 1.4em;
          font-size: 1em;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex; align-items: center; gap:7px;
          transition: background 0.12s;
        }
        .btn:hover {
          background: ${COLORS.accent};
        }
        .diet-files-list {margin-top:0.55em;}
        .diet-file-item {
          background: #f2f5ef;
          color: ${COLORS.accent};
          border-radius:1em;
          padding:0.19em 1.13em 0.19em 0.95em;
          font-size:0.99em;
          font-weight:500;
          margin-right:0.55em;
          display:inline-flex; align-items:center; gap:7px;
          margin-bottom:0.36em;
        }

        .file-img-icon, .file-pdf-icon {font-size: 1.12em}
        /* Responsive */
        @media (max-width: 740px) {
          .diet-panels-grid { grid-template-columns: 1fr; gap: 1.1rem; }
        }
        @media (max-width: 450px) {
          .panel-card, .notes-list, .diet-file-item { font-size: 0.97em; }
          .page-title { font-size: 1.25rem; }
        }
      `}
      </style>
    </div>
  );
}

export default DietNutritionPage;
