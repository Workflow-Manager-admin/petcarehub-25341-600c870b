import React, { useState, useRef } from "react";
import "./HealthTracker.module.css";

// PUBLIC_INTERFACE
/**
 * HealthTrackerPage
 * Modern, responsive health tracker for pets including:
 * - Health Summary Card
 * - Medical History Timeline
 * - Allergies & Medical Conditions
 * - Medication Tracker
 * - Vaccination Records
 * - Veterinarian Info Panel
 * - Upload Health Documents
 */
function HealthTrackerPage() {
  // Demo state (replace with real data/fetch in actual integration)
  const [summary, setSummary] = useState({
    weight: 22.4,
    weightUnit: "kg",
    age: 3,
    ageUnit: "years",
    lastCheckup: "2024-02-12",
    nextCheckup: "2024-08-22",
    mood: "Happy",
  });

  const [history, setHistory] = useState([
    { date: "2024-04-10", event: "Rabies booster", type: "vaccine" },
    { date: "2024-03-05", event: "Vet visit (minor rash)", type: "vet" },
    { date: "2024-01-12", event: "Teeth cleaning", type: "procedure" },
  ]);

  const [allergies, setAllergies] = useState([
    "Chicken protein",
    "Grass pollen",
  ]);
  const [conditions, setConditions] = useState([
    { name: "Skin Sensitivity", notes: "Flare-ups during spring" },
  ]);

  const [medications, setMedications] = useState([
    {
      name: "Apoquel",
      dose: "16mg",
      frequency: "Daily",
      nextDue: "2024-06-01",
      editMode: false,
    },
  ]);
  const [vaccines, setVaccines] = useState([
    { name: "Distemper", date: "2023-06-07", due: "2024-06-07", status: "Due soon" },
    { name: "Rabies", date: "2024-04-10", due: "2025-04-10", status: "Up to date" },
    { name: "Parvovirus", date: "2023-06-07", due: "2024-06-07", status: "Due soon" },
  ]);

  const [vetInfo, setVetInfo] = useState({
    name: "Dr. Hana Patel",
    clinic: "Green Paws Vet Clinic",
    phone: "(555) 123-4567",
    email: "vet@greenpawsvet.com",
    address: "12 Maple Ave, Springfield",
  });

  const [uploading, setUploading] = useState(false);
  const [docs, setDocs] = useState([]);
  const uploadRef = useRef();

  // Animation helpers
  const fadeInStyle = { animation: "fadeIn 0.4s cubic-bezier(.39,.575,.565,1) both" };

  // Handlers
  const handleAddAllergy = (e) => {
    e.preventDefault();
    const val = e.target.elements["allergy"].value.trim();
    if (val) setAllergies([...allergies, val]);
    e.target.reset();
  };

  const handleAddCondition = (e) => {
    e.preventDefault();
    const name = e.target.elements["cond"].value.trim();
    const notes = e.target.elements["notes"].value.trim();
    if (name) setConditions([...conditions, { name, notes }]);
    e.target.reset();
  };

  const handleMedChange = (idx, field, val) => {
    setMedications(meds =>
      meds.map((m, i) =>
        i === idx ? { ...m, [field]: val } : m
      )
    );
  };

  const handleMedEditToggle = (idx) => {
    setMedications(meds =>
      meds.map((m, i) =>
        i === idx ? { ...m, editMode: !m.editMode } : { ...m, editMode: false }
      )
    );
  };

  const handleMedSave = (idx) => {
    setMedications(meds =>
      meds.map((m, i) => (i === idx ? { ...m, editMode: false } : m))
    );
  };

  const handleDocUpload = e => {
    setUploading(true);
    const files = Array.from(e.target.files);
    setTimeout(() => {
      setDocs(d => [...d, ...files.map(f => ({ name: f.name, date: new Date().toISOString().slice(0, 10) }))]);
      setUploading(false);
    }, 1000);
  };

  // Icon SVGs
  const icons = {
    weight: (
      <span role="img" aria-label="weight">
        <svg style={{ verticalAlign: "middle" }} width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#E87A41" strokeWidth="2"/><path d="M12 12 v-4 m0 0 l-2 2 m2-2 l2 2" stroke="#E87A41" strokeWidth="2"/></svg>
      </span>
    ),
    age: (
      <span role="img" aria-label="birthday cake">
        <svg style={{ verticalAlign: "middle" }} width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="8" rx="2" stroke="#E87A41" strokeWidth="2"/><path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="#E87A41" strokeWidth="2"/></svg>
      </span>
    ),
    checkup: (
      <span role="img" aria-label="checkup">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" stroke="#E87A41"/><path d="M12 8v4l2 2" stroke="#E87A41" strokeWidth="2"/></svg>
      </span>
    ),
    mood: (
      <span role="img" aria-label="mood">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#F8B400" strokeWidth="2"/><path d="M8 14c1.333 1.333 4 1.333 5.999 0" stroke="#F8B400" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="10" r="1" fill="#F8B400"/><circle cx="15" cy="10" r="1" fill="#F8B400"/></svg>
      </span>
    ),
    vaccine: (
      <span role="img" aria-label="vaccination">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="6" y="10" width="12" height="4" rx="2" fill="#e2dda6"/><rect x="10" y="6" width="4" height="12" rx="2" fill="#E87A41"/></svg>
      </span>
    ),
    doc: (
      <span role="img" aria-label="document">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2" stroke="#656461" strokeWidth="2"/><path d="M6 8h12" stroke="#879d85"/><path d="M6 16h12" stroke="#879d85"/></svg>
      </span>
    ),
    edit: (
      <span role="img" aria-label="edit">
        <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M13.5 3L17 6.5L6.5 17H3V13.5L13.5 3Z" stroke="#879d85" strokeWidth="2" /></svg>
      </span>
    ),
    save: (
      <span role="img" aria-label="save">
        <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="2" stroke="#879d85" strokeWidth="2"/><path d="M6 10l3 3 5-5" stroke="#879d85" strokeWidth="2"/></svg>
      </span>
    ),
    upload: (
      <span role="img" aria-label="upload">
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><path d="M10 14V4M10 4l-4 4M10 4l4 4" stroke="#e87a41" strokeWidth="2"/><rect x="3" y="14" width="14" height="3" rx="1.5" fill="#e2dda6"/></svg>
      </span>
    )
  };

  return (
    <div className="container health-container" style={{ maxWidth: 900, margin: "0 auto", padding: "1em" }}>
      <h2 className="title" style={{ marginTop: 5 }}>Health Tracker</h2>
      {/* Health Summary Card */}
      <section className="hcard" style={{ ...fadeInStyle, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(30,20,10,0.07)", padding: 24, marginBottom: 28, display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: 1.5, minWidth: 220 }}>
          <h4 style={{ color: "var(--kavia-orange)", margin: 0, fontWeight: 600 }}>Health Summary</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, marginTop: 12 }}>
            <li style={{ marginBottom: 7 }}>{icons.weight} <span style={{ fontWeight: 500 }}>Weight:</span> {summary.weight} {summary.weightUnit}</li>
            <li style={{ marginBottom: 7 }}>{icons.age} <span style={{ fontWeight: 500 }}>Age:</span> {summary.age} {summary.ageUnit}</li>
            <li style={{ marginBottom: 7 }}>{icons.checkup} <span style={{ fontWeight: 500 }}>Last Checkup:</span> {summary.lastCheckup}</li>
            <li style={{ marginBottom: 7 }}>{icons.checkup} <span style={{ fontWeight: 500 }}>Next Checkup:</span> {summary.nextCheckup}</li>
            <li style={{ marginBottom: 0 }}>{icons.mood} <span style={{ fontWeight: 500 }}>Mood:</span> {summary.mood}</li>
          </ul>
        </div>
        {/* Veterinarian Info Panel */}
        <div style={{ flex: 1, minWidth: 220, background: "#e2dda6", borderRadius: 12, padding: 18, margin: 0, alignSelf: "stretch", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
          <span style={{ fontWeight: 600, color: "#656461" }}>Primary Vet</span>
          <div style={{ margin: "8px 0 4px 0", fontSize: 17, fontWeight: 500 }}>
            {vetInfo.name}
          </div>
          <div style={{ color: "var(--kavia-dark)", fontSize: 15 }}>
            <div role="address">{vetInfo.clinic}</div>
            <div>📞 {vetInfo.phone}</div>
            <div>✉️ <a href={`mailto:${vetInfo.email}`}>{vetInfo.email}</a></div>
            <div>{vetInfo.address}</div>
          </div>
        </div>
      </section>

      {/* Medical History Timeline */}
      <section className="hcard" style={{ ...fadeInStyle, background: "#fff", borderRadius: 16, boxShadow: "0 1px 10px rgba(30,20,10,0.05)", padding: 20, marginBottom: 28 }}>
        <h4 style={{ color: "var(--kavia-orange)" }}>Medical History</h4>
        <div style={{
          display: "flex", flexDirection: "column",
          marginTop: 12,
          gap: "8px",
        }}>
          {history.slice().sort((a, b) => b.date.localeCompare(a.date)).map((entry, idx) => (
            <div key={idx} className="timeline-item" style={{
              display: "flex", alignItems: "center", padding: 0,
              transition: "background 0.2s", borderRadius: 8,
              background: "#f7f7f5"
            }}>
              <div style={{ minWidth: 80, color: "#656461", fontWeight: 500, fontSize: 15 }}>
                {entry.date}
              </div>
              <div style={{ margin: "0 12px" }}>
                {entry.type === "vaccine" ? icons.vaccine : entry.type === "vet" ? icons.checkup : icons.doc}
              </div>
              <div>{entry.event}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Allergies and Medical Conditions */}
      <div style={{display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 28}}>
        <section className="hcard" style={{
          flex: 1,
          minWidth: 250,
          background: "#fff", borderRadius: 16, boxShadow: "0 1px 10px rgba(30,20,10,0.05)", padding: 20,
          ...fadeInStyle
        }}>
          <h4 style={{ color: "var(--kavia-orange)" }}>Allergies</h4>
          <ul style={{ margin: "8px 0 12px 0", paddingLeft: 17 }}>
            {allergies.map((all, idx) => (
              <li key={idx} style={{ marginBottom: 3 }}>{all}</li>
            ))}
          </ul>
          <form onSubmit={handleAddAllergy} style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              name="allergy"
              className="input"
              placeholder="Add Allergy"
              style={{ flex: 1, borderRadius: 8, border: "1px solid #e2dda6", padding: 6 }}
              required
            />
            <button type="submit" className="btn" style={{
              background: "var(--kavia-orange)",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              borderRadius: 7,
              padding: "0 12px"
            }}>Add</button>
          </form>
        </section>
        <section className="hcard" style={{
          flex: 1,
          minWidth: 250,
          background: "#fff", borderRadius: 16, boxShadow: "0 1px 10px rgba(30,20,10,0.05)", padding: 20,
          ...fadeInStyle
        }}>
          <h4 style={{ color: "var(--kavia-orange)" }}>Medical Conditions</h4>
          <ul style={{ margin: "8px 0 12px 0", paddingLeft: 17 }}>
            {conditions.map((cond, idx) => (
              <li key={idx} style={{ marginBottom: 3 }}>
                <b>{cond.name}</b>{cond.notes && <>: <span style={{ color: "#879d85" }}>{cond.notes}</span></>}
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddCondition} style={{ display: "flex", gap: 8, flexDirection: "column" }}>
            <input
              type="text"
              name="cond"
              className="input"
              placeholder="Condition"
              style={{ borderRadius: 8, border: "1px solid #e2dda6", padding: 6 }}
              required
            />
            <input
              type="text"
              name="notes"
              className="input"
              placeholder="Notes (optional)"
              style={{ borderRadius: 8, border: "1px solid #e2dda6", padding: 6 }}
            />
            <button type="submit" className="btn" style={{
              background: "var(--kavia-orange)",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              borderRadius: 7,
              padding: "0 12px"
            }}>Add</button>
          </form>
        </section>
      </div>

      {/* Medications and Vaccines */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 28 }}>
        {/* Medication Tracker */}
        <section className="hcard" style={{
          flex: 1,
          minWidth: 250,
          background: "#fff", borderRadius: 16, boxShadow: "0 1px 10px rgba(30,20,10,0.05)", padding: 20,
          ...fadeInStyle
        }}>
          <h4 style={{ color: "var(--kavia-orange)" }}>Medications</h4>
          <div>
            {medications.map((med, idx) =>
              med.editMode ? (
                <div key={idx} style={{
                  background: "#f6f6f1", borderRadius: 8, margin: "12px 0", padding: "8px 8px", display: "flex", flexDirection: "column", gap: 5
                }}>
                  <input type="text" value={med.name} onChange={e => handleMedChange(idx, "name", e.target.value)} style={{ marginBottom: 2, border: "1px solid #e2dda6", borderRadius: 7, padding: "2px 7px" }} />
                  <input type="text" value={med.dose} onChange={e => handleMedChange(idx, "dose", e.target.value)} style={{ marginBottom: 2, border: "1px solid #e2dda6", borderRadius: 7, padding: "2px 7px" }} />
                  <input type="text" value={med.frequency} onChange={e => handleMedChange(idx, "frequency", e.target.value)} style={{ marginBottom: 2, border: "1px solid #e2dda6", borderRadius: 7, padding: "2px 7px" }} />
                  <input type="date" value={med.nextDue} onChange={e => handleMedChange(idx, "nextDue", e.target.value)} style={{ marginBottom: 4, border: "1px solid #e2dda6", borderRadius: 7, padding: "2px 7px" }} />
                  <button className="btn" style={{
                    background: "var(--kavia-orange)",
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    borderRadius: 7,
                    padding: "2px 10px", width: 90, alignSelf: "flex-end", display: "flex", alignItems: "center", gap: 5
                  }} onClick={() => handleMedSave(idx)}>{icons.save}Save</button>
                </div>
              ) : (
                <div key={idx} className="med-row" style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f7f7f5", borderRadius: 7, padding: "8px 12px", margin: "7px 0"
                }}>
                  <span>
                    <b>{med.name}</b> {med.dose}, {med.frequency} <span style={{ color: "#879d85" }}>Next: {med.nextDue}</span>
                  </span>
                  <button className="btn btn-edit" style={{
                    background: "transparent", border: "none", cursor: "pointer", padding: 2
                  }} onClick={() => handleMedEditToggle(idx)}>{icons.edit}</button>
                </div>
              )
            )}
          </div>
        </section>
        {/* Vaccination Records */}
        <section className="hcard" style={{
          flex: 1,
          minWidth: 250,
          background: "#fff", borderRadius: 16, boxShadow: "0 1px 10px rgba(30,20,10,0.05)", padding: 20,
          ...fadeInStyle
        }}>
          <h4 style={{ color: "var(--kavia-orange)" }}>Vaccinations</h4>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: 17 }}>
            {vaccines.map((vac, idx) => (
              <li key={idx} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                {icons.vaccine}
                <span>
                  <b>{vac.name}</b>: {vac.date} ({vac.status})
                  <br />
                  <span style={{ color: "#879d85", fontSize: 13 }}>Due: {vac.due}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Upload Health Documents */}
      <section className="hcard" style={{
        ...fadeInStyle,
        background: "#fff", borderRadius: 16, boxShadow: "0 1px 10px rgba(30,20,10,0.05)", padding: 20, marginBottom: 24
      }}>
        <h4 style={{ color: "var(--kavia-orange)" }}>Health Documents</h4>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <label
            className="btn"
            style={{
              background: "var(--kavia-orange)",
              color: "#fff",
              borderRadius: 8,
              padding: "7px 18px",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 0,
              display: "flex",
              alignItems: "center",
              gap: 7
            }}
          >
            {icons.upload}
            {uploading ? "Uploading..." : "Upload Document"}
            <input
              ref={uploadRef}
              style={{ display: "none" }}
              type="file"
              multiple
              onChange={handleDocUpload}
            />
          </label>
          <div style={{ display: "flex", gap: 11, flexWrap: "wrap", alignItems: "center" }}>
            {docs.length === 0 && (
              <span style={{ color: "#879d85", fontSize: 15 }}>No documents uploaded yet.</span>
            )}
            {docs.map((doc, idx) => (
              <span key={idx} style={{ background: "#f6f6f1", padding: "5px 11px", borderRadius: 14, fontSize: 15, display: "flex", alignItems: "center", gap: 4, marginRight: 3 }}>
                {icons.doc}
                {doc.name}
                <span style={{ color: "#879d85", fontSize: 12, marginLeft: 6 }}>{doc.date}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive styles (inline for now; should be in .module.css or reuse App.css in extension) */}
      <style>
        {`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(16px);}
          100% { opacity: 1; transform: none;}
        }
        .health-container h2.title {
          font-size: 2rem;
        }
        @media (max-width: 800px) {
          .hcard {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .health-container { padding: 0.5em; }
        }
        @media (max-width: 570px) {
          .hcard { padding: 14px !important; }
          .health-container h2.title {
            font-size: 1.25rem;
          }
        }
        .btn {
          transition: background 0.13s, color 0.13s;
        }
        .btn:hover, .btn:focus {
          background: #ce672f !important;
        }
        .input:focus {
          outline: 2px solid var(--kavia-orange);
        }
        `}
      </style>
    </div>
  );
}

export default HealthTrackerPage;
