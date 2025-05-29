import React, { useState } from "react";
// PUBLIC_INTERFACE
/**
 * ManageAppointmentsPage
 * Main page for managing appointments in PetCareHub.
 * Sections: Upcoming Appointments, Calendar View, Appointment Booking Form, Appointment History, Reminders, Documents.
 */
function ManageAppointmentsPage() {
  /** Placeholder data **/
  const sampleUpcoming = [
    { id: 1, pet: "Bella", type: "Vet Visit", date: "2024-06-10", time: "10:30", status: "Scheduled" },
    { id: 2, pet: "Max", type: "Vaccination", date: "2024-06-12", time: "15:00", status: "Scheduled" }
  ];
  const sampleHistory = [
    { id: 11, pet: "Bella", type: "Grooming", date: "2024-04-15", status: "Completed" },
    { id: 12, pet: "Max", type: "Surgery", date: "2024-03-11", status: "Completed" }
  ];
  const sampleDocs = [
    { name: "VaccineRecord.pdf", type: "pdf" },
    { name: "Xray.png", type: "image" }
  ];

  const [showBooking, setShowBooking] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [calendarFilter, setCalendarFilter] = useState("all");
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [uploads, setUploads] = useState(sampleDocs);

  // ----- Handlers (minimal logic for illustration) -----
  const handleBookOpen = () => { setShowBooking(true); setCurrentStep(1); };
  const handleBookClose = () => setShowBooking(false);
  const handleStepAdvance = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const handleStepBack = () => setCurrentStep((s) => Math.max(s - 1, 1));
  const handleRebook = (historyId) => { setShowBooking(true); setCurrentStep(1); };
  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setUploads((prev) => [
      ...prev,
      ...files.map((f) => ({
        name: f.name,
        type: f.type.startsWith("image") ? "image" : f.type === "application/pdf" ? "pdf" : "other",
        file: f
      }))
    ]);
  };

  // Minimal calendar placeholder
  function Calendar() {
    // In a real implementation, import a calendar package.
    return (
      <div style={{
        background: "var(--secondary, #e2dda6)",
        borderRadius: "12px",
        minHeight: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: "#656461"
      }}>
        <span role="img" aria-label="calendar" style={{ marginRight: 12 }}>📆</span>
        <span>Minimal Calendar Placeholder - Upcoming Events Marked</span>
      </div>
    );
  }

  // ----- UI Layout -----
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 8px" }}>
      <h1 className="title" style={{ marginBottom: 16 }}>Manage Appointments</h1>

      <div className="card" style={{ marginBottom: 24, padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #68686812" }}>
        <SectionTitle icon="🕑">Upcoming Appointments</SectionTitle>
        <UpcomingAppointmentsTable appointments={sampleUpcoming} onBook={handleBookOpen} />
      </div>

      <div className="cards-row" style={{
        display: "flex",
        gap: 24,
        flexWrap: "wrap",
        marginBottom: 24
      }}>
        <div className="card" style={{
          flex: 2, minWidth: 320, padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #6868680d"
        }}>
          <SectionTitle icon="📅">Calendar View</SectionTitle>
          <label style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <span style={{ marginRight: 8 }}>Filter:</span>
            <select value={calendarFilter} onChange={e => setCalendarFilter(e.target.value)} style={{ padding: 4, borderRadius: 6 }}>
              <option value="all">All</option>
              <option value="vet">Vet</option>
              <option value="grooming">Grooming</option>
              <option value="vaccination">Vaccination</option>
            </select>
          </label>
          <Calendar />
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
            Dates with events are highlighted. Click a date for appointment details.
          </div>
        </div>
        <div className="card" style={{
          flex: 1, minWidth: 280, padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #6868680d"
        }}>
          <SectionTitle icon="⏰">Reminders & Notifications</SectionTitle>
          <div style={{ marginBottom: 18, display: "flex", alignItems: "center" }}>
            <ToggleSwitch checked={remindersEnabled} onChange={() => setRemindersEnabled(r => !r)} />
            <span style={{ marginLeft: 12, color: remindersEnabled ? "#39a944" : "#a77" }}>
              {remindersEnabled ? "Reminders On" : "Reminders Off"}
            </span>
          </div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
            Email & push notifications for upcoming appointments and tasks.
          </div>
        </div>
      </div>

      {/* Document Section */}
      <div className="card" style={{ marginBottom: 24, padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #68686812" }}>
        <SectionTitle icon="📎">Documents (PDF/Image Uploads & Previews)</SectionTitle>
        <div style={{ marginBottom: 14 }}>
          <label className="btn" style={{ padding: "6px 12px", cursor: "pointer" }}>
            <span role="img" aria-label="upload">⬆️</span> Upload Document
            <input type="file" accept="image/*,application/pdf" style={{ display: "none" }} multiple onChange={handleUpload} />
          </label>
        </div>
        <div style={{
          display: "flex", gap: 18, flexWrap: "wrap"
        }}>
          {uploads.map((doc, idx) => (
            <DocPreview key={idx} doc={doc} />
          ))}
        </div>
      </div>

      {/* Appointment History */}
      <div className="card" style={{ marginBottom: 24, padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #68686812" }}>
        <SectionTitle icon="📜">Appointment History</SectionTitle>
        <AppointmentHistoryTable history={sampleHistory} onRebook={handleRebook} />
      </div>

      {/* Booking Form Modal */}
      {showBooking &&
        <Modal onClose={handleBookClose}>
          <StepwiseAppointmentForm currentStep={currentStep}
            onAdvance={handleStepAdvance}
            onBack={handleStepBack}
            onClose={handleBookClose}
          />
        </Modal>
      }
    </div>
  );
}

/* ========== Utility components ========== */

function SectionTitle({ icon, children }) {
  return <h2 className="subtitle" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <span style={{ fontSize: 22 }}>{icon}</span>
    {children}
  </h2>;
}

function UpcomingAppointmentsTable({ appointments, onBook }) {
  return (
    <div>
      <button className="btn btn-large" style={{
        float: "right", marginBottom: 8, background: "var(--kavia-orange)", color: "#fff"
      }} onClick={onBook}>
        <span role="img" aria-label="plus">➕</span> Book New Appointment
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
        <thead>
          <tr style={{ background: "rgba(228,221,166,0.35)" }}>
            <th style={th}>Pet</th>
            <th style={th}>Type</th>
            <th style={th}>Date</th>
            <th style={th}>Time</th>
            <th style={th}>Status</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt.id} style={{ borderBottom: "1px solid #ececec" }}>
              <td style={td}>{appt.pet}</td>
              <td style={td}>{appt.type}</td>
              <td style={td}>{appt.date}</td>
              <td style={td}>{appt.time}</td>
              <td style={td}><span style={{ color: "#39a944" }}>{appt.status}</span></td>
              <td style={td}>
                <button className="btn" style={{ padding: "2px 9px", fontSize: 13 }}>View</button>
                <button className="btn" style={{
                  padding: "2px 9px", fontSize: 13, marginLeft: 6,
                  background: "#eee", color: "#222"
                }}>Cancel</button>
              </td>
            </tr>
          ))}
          {appointments.length === 0 &&
            <tr><td colSpan={6} style={td}>No upcoming appointments.</td></tr>
          }
        </tbody>
      </table>
    </div>
  );
}

function AppointmentHistoryTable({ history, onRebook }) {
  const [filter, setFilter] = useState("all");
  const filtered = (filter === "all") ? history : history.filter(h => h.type.toLowerCase() === filter);
  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <span style={{ marginRight: 8 }}>Filter:</span>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 4, borderRadius: 6 }}>
          <option value="all">All</option>
          <option value="vet visit">Vet Visit</option>
          <option value="grooming">Grooming</option>
          <option value="vaccination">Vaccination</option>
          <option value="surgery">Surgery</option>
        </select>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
        <thead>
          <tr style={{ background: "rgba(228,221,166,0.25)" }}>
            <th style={th}>Pet</th>
            <th style={th}>Type</th>
            <th style={th}>Date</th>
            <th style={th}>Status</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(appt => (
            <tr key={appt.id} style={{ borderBottom: "1px solid #ececec" }}>
              <td style={td}>{appt.pet}</td>
              <td style={td}>{appt.type}</td>
              <td style={td}>{appt.date}</td>
              <td style={td}><span style={{ color: "#999" }}>{appt.status}</span></td>
              <td style={td}>
                <button className="btn" style={{
                  padding: "2px 9px", fontSize: 13, background: "var(--kavia-orange)", color: "#fff"
                }} onClick={() => onRebook(appt.id)}>
                  <span role="img" aria-label="repeat">🔁</span> Rebook
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 &&
            <tr><td colSpan={5} style={td}>No appointment history.</td></tr>
          }
        </tbody>
      </table>
    </div>
  );
}

/** Stepwise Appointment Booking Modal/Form */
function StepwiseAppointmentForm({ currentStep, onAdvance, onBack, onClose }) {
  // Placeholder for a 3-step process
  return (
    <div style={{ width: 370, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h3 style={{ fontWeight: 600 }}>Book Appointment</h3>
        <button onClick={onClose} style={{
          border: "none", background: "transparent", fontSize: 21, cursor: "pointer"
        }} title="Close"><span role="img" aria-label="close">✖️</span></button>
      </div>
      <StepProgress current={currentStep} total={3} />
      {currentStep === 1 && (
        <div style={{ margin: "16px 0" }}>
          <label>
            <span>Pet:</span>
            <select style={inputStyle}>
              <option>Bella</option>
              <option>Max</option>
            </select>
          </label>
          <label style={{ display: "block", marginTop: 10 }}>
            <span>Appointment Type:</span>
            <select style={inputStyle}>
              <option>Vet Visit</option>
              <option>Grooming</option>
              <option>Vaccination</option>
            </select>
          </label>
        </div>
      )}
      {currentStep === 2 && (
        <div style={{ margin: "16px 0" }}>
          <label>
            <span>Date:</span>
            <input type="date" style={inputStyle} />
          </label>
          <label style={{ display: "block", marginTop: 10 }}>
            <span>Time:</span>
            <input type="time" style={inputStyle} />
          </label>
        </div>
      )}
      {currentStep === 3 && (
        <div style={{ margin: "16px 0" }}>
          <strong>Review & Confirm</strong>
          <div style={{ fontSize: 15, marginTop: 8 }}>
            Appointment for <b>Bella</b> - <b>Vet Visit</b><br />on <b>2024-06-10</b> at <b>10:30</b>
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <button className="btn" style={{
          background: "#ececec", color: "#222", minWidth: 88
        }} disabled={currentStep === 1} onClick={onBack}>Back</button>
        {currentStep < 3 &&
          <button className="btn" style={{ background: "var(--kavia-orange)", color: "#fff", minWidth: 88 }} onClick={onAdvance}>Next</button>
        }
        {currentStep === 3 &&
          <button className="btn" style={{
            background: "#39a944", color: "#fff", minWidth: 88
          }} onClick={onClose}>Confirm</button>
        }
      </div>
    </div>
  );
}

/** Step Progress Indicator */
function StepProgress({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
      {[...Array(total)].map((_, idx) => (
        <div key={idx}
          style={{
            width: 28, height: 6,
            borderRadius: 7,
            background: idx + 1 <= current ? "var(--kavia-orange)" : "#eee",
            transition: "background .35s"
          }} />
      ))}
    </div>
  );
}

/** Modal shell with fade */
function Modal({ onClose, children }) {
  return (
    <div style={{
      position: "fixed", zIndex: 1000, top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(32,32,32,0.31)", display: "flex", alignItems: "center", justifyContent: "center",
      transition: "background .4s"
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, boxShadow: "0 5px 24px #2222", minWidth: 260,
        animation: "fadein-modal .36s",
        position: "relative"
      }}>
        {children}
      </div>
      <style>{`
        @keyframes fadein-modal {
          0% { transform: translateY(48px); opacity: 0;}
          100% { transform: translateY(0); opacity: 1;}
        }
      `}</style>
    </div>
  );
}

/** Toggle UI for Reminders/Notifications */
function ToggleSwitch({ checked, onChange }) {
  return (
    <label style={{ display: "inline-block", width: 44, height: 26, position: "relative" }}>
      <input type="checkbox" checked={checked} onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{
        position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0,
        background: checked ? "var(--kavia-orange)" : "#d0d0d0",
        transition: ".3s", borderRadius: 20
      }} />
      <span style={{
        position: "absolute", left: checked ? 24 : 4, top: 4,
        width: 18, height: 18, background: "#fff", borderRadius: "50%", boxShadow: "0 1px 2px #0001",
        transition: ".38s"
      }} />
    </label>
  );
}

/** Preview doc uploads (pdf/image) */
function DocPreview({ doc }) {
  const icon = doc.type === "pdf"
    ? <span role="img" aria-label="pdf" style={{ fontSize: 28 }}>📄</span>
    : doc.type === "image"
      ? <span role="img" aria-label="img" style={{ fontSize: 28 }}>🖼️</span>
      : <span role="img" aria-label="file" style={{ fontSize: 28 }}>📎</span>;
  return (
    <div style={{
      minWidth: 100, minHeight: 60, background: "#faf9f6", borderRadius: 8,
      padding: "12px 16px", display: "flex", alignItems: "center", gap: 14,
      boxShadow: "0 1px 8px #88643418"
    }}>
      {icon}
      <span style={{ wordBreak: "break-all", fontSize: 14 }}>{doc.name}</span>
    </div>
  );
}

/* -- Table cell style helpers -- */
const th = { fontWeight: 600, padding: "8px 8px", fontSize: 15, textAlign: "left", color: "#444" };
const td = { fontWeight: 400, padding: "8px 8px", fontSize: 15, color: "#222" };
const inputStyle = { border: "1px solid #ccc", borderRadius: 6, fontSize: 15, padding: "6px 8px", marginLeft: 6, width: 180 };

export default ManageAppointmentsPage;
