import React, { useState, useRef } from 'react';

// PUBLIC_INTERFACE
/**
 * ManageAppointmentsPage
 * A modern, stylized page to manage pet appointments - includes upcoming appointments,
 * calendar view, appointment history, creation form (modal), reminders, and document upload with preview.
 * Uses cards, tables, accent backgrounds, animated gradient buttons, icons, and modern layout.
 */
function ManageAppointmentsPage() {
  // Dummy data for demo
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      pet: 'Milo',
      type: 'Vet Check-Up',
      date: '2024-06-19',
      time: '10:00',
      notes: 'Annual wellness exam',
      icon: '🩺'
    },
    {
      id: 2,
      pet: 'Whiskers',
      type: 'Grooming',
      date: '2024-06-22',
      time: '14:30',
      notes: 'Haircut and brush-out',
      icon: '✂️'
    }
  ]);
  const [history, setHistory] = useState([
    {
      id: 3,
      pet: 'Milo',
      type: 'Vaccine',
      date: '2024-04-05',
      time: '09:00',
      notes: 'Rabies booster shot',
      icon: '💉'
    },
    {
      id: 4,
      pet: 'Whiskers',
      type: 'Dental Cleaning',
      date: '2024-03-12',
      time: '11:15',
      notes: 'Teeth Cleaned',
      icon: '😺'
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [calendarMode, setCalendarMode] = useState('month');
  const [reminders, setReminders] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  const uploadInputRef = useRef();

  // Handlers
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Example: Collect info and add to appointments (not persistent)
    const form = e.target;
    setUpcomingAppointments([
      ...upcomingAppointments,
      {
        id: Math.random(),
        pet: form.pet.value,
        type: form.type.value,
        date: form.date.value,
        time: form.time.value,
        notes: form.notes.value,
        icon: form.type.value === 'Vet Check-Up' ? '🩺'
          : form.type.value === 'Grooming' ? '✂️'
          : form.type.value === 'Vaccine' ? '💉'
          : '📅',
      }
    ]);
    setShowForm(false);
    form.reset();
  };

  const handleRemindersToggle = (type) => {
    setReminders({ ...reminders, [type]: !reminders[type] });
  };

  const handleUploadChange = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (file) {
      setUploadPreview(null);
    }
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleCalendarMode = (mode) => setCalendarMode(mode);

  // UI Constants for demo
  const appointmentTypes = [
    { label: 'All', value: 'all', icon: '📅' },
    { label: 'Vet', value: 'Vet Check-Up', icon: '🩺' },
    { label: 'Grooming', value: 'Grooming', icon: '✂️' },
    { label: 'Vaccine', value: 'Vaccine', icon: '💉' }
  ];

  // Calendar Demo (simplified, not real calendar rendering)
  const currentMonth = [
    { day: 10, appointments: [{ ...upcomingAppointments[0] }] },
    { day: 14, appointments: [{ ...upcomingAppointments[1] }] }
  ];

  // Filtered history
  const filteredHistory = filterType === 'all'
    ? history
    : history.filter(a => a.type === filterType);

  // Animation for gradient button
  const gradientBtnStyle = {
    background: 'linear-gradient(90deg, #E87A41, #e2dda6, #879d85, #656461, #E87A41)',
    backgroundSize: '300% 300%',
    animation: 'gradientBG 5s ease infinite',
    color: '#fff',
    border: 'none',
    borderRadius: '2rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
    fontSize: '1rem',
    padding: '0.75rem 2rem',
    cursor: 'pointer',
    boxShadow: '0 2px 14px -6px #879d85, 0 1px 5px -5px #e2dda6',
    transition: 'box-shadow 0.2s',
  };

  // Modern card shadows and bg
  const cardStyle = {
    background: 'rgba(255,255,255,0.12)',
    boxShadow: '0 4px 20px -8px #879d85, 0 1px 5px -3px #1A1A1A',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    margin: '0 .5rem 2rem .5rem',
    border: '1px solid var(--border-color)',
    color: 'var(--text-color)',
    backdropFilter: 'blur(7px)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(132deg, #e2dda6 0%, #879d85 40%, #656461 100%)',
      fontFamily: '\'Inter\', sans-serif',
      padding: '0',
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes gradientBG {
          0%,100% {background-position:0% 50%;}
          50% {background-position:100% 50%;}
        }
        .appointments-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2vw 2vw 5vw 2vw;
        }
        .section-title {
          font-family: 'Inter',sans-serif;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -1px;
          margin-bottom: 1rem;
          color: #1A1A1A;
          text-shadow: 0 2px 5px rgba(232,122,65,0.03);
        }
        .upcoming-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: flex-start;
        }
        .card {
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .card:hover {
          transform: translateY(-3px) scale(1.02) rotate(-1.3deg);
          box-shadow: 0 8px 25px -4px #e2dda6, 0 4px 20px -12px #E87A41;
        }
        .calendar-wrap {
          background: rgba(255,255,255,0.09);
          border-radius: 22px;
          overflow-x:auto;
          padding: 2rem 1rem 1rem 1rem;
          margin-bottom: 2rem;
        }
        .calendar-controls {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: .8rem;
          min-width: 370px;
        }
        .calendar-day {
          min-height: 72px;
          background: rgba(134,157,133, 0.13);
          border-radius: 13px;
          color: #1A1A1A;
          padding: 0.45rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 1rem;
          border: 1.5px solid #e2dda6;
        }
        .calendar-appt {
          font-size: 0.95rem;
          background: #E87A41cc;
          color: #fff;
          border-radius: 0.9rem;
          margin: 0.25rem 0;
          padding: 0.14rem 0.7rem;
          box-shadow: 0 3px 12px -7px #E87A41;
        }
        .appt-type-filter {
          display: flex;
          gap: 0.7rem;
          align-items: center;
          margin-bottom: 1.2rem;
        }
        .appt-type-btn {
          padding: 0.5rem 1.1rem;
          border-radius: 2rem;
          background: #e2dda6B0;
          color: #1A1A1A;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background .18s, box-shadow .16s;
          box-shadow: 0 1px 6px -3px #e2dda6;
        }
        .appt-type-btn.active, .appt-type-btn:hover {
          background: #e87a41;
          color: #fff;
          box-shadow: 0 2px 12px -5px #e87a41;
        }
        .app-history-table {
          width: 100%;
          border-collapse: collapse;
        }
        .app-history-table th, .app-history-table td {
          font-size: 1rem;
          padding: 0.7em 1em;
          background:rgba(234,218,166,0.08);
          font-family: inherit;
        }
        .app-history-table th {
          font-weight: 800;
          color: #879d85;
          background: #1a1a1aaa;
        }
        .app-history-table tr:nth-child(even) td {
          background:rgba(135,157,133,0.07);
        }
        .animated-btn {
          margin-top: 2rem;
        }
        .reminders-wrap {
          background:#65646144;
          border-radius: 17px;
          padding: 1.3rem 2rem;
          margin: 0 0 2rem 0;
          color: #fff;
          box-shadow: 0 1.5px 12px -7px #656461;
        }
        .reminder-toggle-list {
          display: flex;
          gap: 2.5rem;
        }
        .toggle-switch {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 1.1rem;
        }
        .toggle-slider {
          width: 38px; height: 21px;
          background: #e2dda6;
          border-radius: 22px;
          position: relative; cursor: pointer;
          transition: background .2s;
        }
        .toggle-slider.checked { background: #E87A41;}
        .toggle-dot {
          width: 18px; height:18px;
          border-radius:50%;
          background:#fff;
          position:absolute;
          top:1.5px; left:2px;
          transition: left .19s;
        }
        .toggle-slider.checked .toggle-dot { left: 17.5px; }
        .doc-upload-wrap {
          margin: 0 0 2rem 0;
          padding: 1.1rem 2rem;
          background: #e2dda6aa;
          border-radius: 15px;
          color: #333;
          box-shadow: 0 2px 13px -7px #E87A41;
        }
        .doc-upload-preview {
          margin-top: 0.7rem;
          display: flex;
          gap: 1.2rem;
        }
        .doc-preview-img {
          max-width: 130px; max-height:130px; border-radius: 9px;
          border:2.3px solid #879d85;
          box-shadow:0 1.7px 8px -5px #1A1A1A;
        }
        /* Modal */
        .modal-overlay {
          position:fixed;
          top:0; left:0; right:0; bottom:0;
          background: rgba(33,41,52,0.45);
          z-index:98;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-content {
          max-width: 410px;
          background: #fff;
          border-radius: 1.3rem;
          box-shadow: 0 2px 32px -8px #879d85;
          padding:2.2rem 2.2rem 1.3rem 2.2rem;
          color: #1A1A1A;
          animation: modalPop .33s cubic-bezier(.66,.05,.53,1.43);
          z-index:99;
        }
        @keyframes modalPop {
          0% { transform: scale(0.92) translateY(40px);}
          100% { transform: scale(1) translateY(0);}
        }
        .modal-close {
          float:right;
          font-size:1.7rem;
          color: #656461;
          cursor:pointer;
          font-weight:700;
        }
        .new-appt-form label {
          margin-bottom:0.6rem;
          font-size:1.02rem;
          font-weight:600;
        }
        .new-appt-form input, .new-appt-form select, .new-appt-form textarea {
          width:100%;
          margin-bottom:1rem;
          padding:0.55rem 0.7rem;
          border-radius:6px;
          border:1px solid #e2dda6;
          font-size:1.01rem;
        }
        .rebook-btn {
          background: #E87A41cc;
          border: none;
          color: #fff;
          border-radius: 1rem;
          padding: 0.35rem 1.15rem;
          font-weight: 600;
          margin:0.1rem 0;
          cursor: pointer;
          transition: background .18s;
        }
        .rebook-btn:hover {
          background:#879d85;
        }
        @media (max-width:920px) {
          .upcoming-cards { flex-direction:column; gap:1.1rem;}
        }
        @media (max-width:600px) {
          .section-title {font-size:1.32rem;}
          .calendar-wrap {padding:1rem;}
          .reminder-toggle-list {flex-direction:column;}
          .appointments-container {padding:1.3vw;}
        }
      `}</style>

      <div className="appointments-container">

        {/* Section: Upcoming Appointments */}
        <div>
          <div className="section-title">Upcoming Appointments</div>
          <div className="upcoming-cards">
            {upcomingAppointments.map(a => (
              <div key={a.id} className="card" style={cardStyle}>
                <div style={{
                  fontSize: "2.2rem",
                  marginBottom: ".7em"
                }}>{a.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "1.11rem" }}>{a.type}</div>
                <div style={{ color: "#E87A41", fontWeight: 600 }}>
                  {a.date} <span style={{ color: "#656461", marginLeft: "0.22em" }}>{a.time}</span>
                </div>
                <div style={{ color: "#879d85", marginTop: ".4rem" }}>
                  Pet: <strong>{a.pet}</strong>
                </div>
                <div style={{ color: "#656461", fontSize: ".95rem", marginTop: ".4rem" }}>{a.notes}</div>
              </div>
            ))}
            {/* Add new appointment animated button */}
            <button
              style={gradientBtnStyle}
              className="animated-btn"
              onClick={() => setShowForm(true)}
            >
              <span style={{ fontSize: '1.40rem', marginRight: ".6em" }}>＋</span> New Appointment
            </button>
          </div>
        </div>

        {/* Section: Calendar View */}
        <div className="calendar-wrap" style={{ marginTop: '2.7rem' }}>
          <div className="section-title" style={{ marginTop: 0 }}>Calendar</div>
          <div className="calendar-controls">
            <button
              className="appt-type-btn"
              style={calendarMode === 'month' ? { background: "#E87A41", color: "#fff" } : {}}
              onClick={() => handleCalendarMode('month')}
            >
              <span role="img" aria-label="month" style={{ fontSize: "1.2rem", marginRight: "0.2em" }}>🗓️</span>
              Month
            </button>
            <button
              className="appt-type-btn"
              style={calendarMode === 'week' ? { background: "#E87A41", color: "#fff" } : {}}
              onClick={() => handleCalendarMode('week')}
            >
              <span role="img" aria-label="week" style={{ fontSize: "1.1rem", marginRight: "0.2em" }}>📅</span>
              Week
            </button>
            {/* Filter by type */}
            <div className="appt-type-filter">
              {appointmentTypes.map(at =>
                <button
                  key={at.value}
                  className={`appt-type-btn${filterType === at.value ? " active" : ""}`}
                  onClick={() => setFilterType(at.value)}
                >
                  <span style={{ marginRight: ".35rem", fontSize: '1.2rem' }}>{at.icon}</span> {at.label}
                </button>
              )}
            </div>
          </div>
          {/* Simple demo calendar - 7 days/week x 4 weeks of "month" */}
          <div className="calendar-grid">
            {Array.from({ length: 28 }).map((_, i) => {
              const dayNum = i + 1;
              const apptsToday = currentMonth.filter(d => d.day === dayNum)
                .flatMap(d => d.appointments)
                .filter(a => filterType === 'all' || a.type === filterType);
              return (
                <div className="calendar-day" key={dayNum}>
                  <span style={{ fontWeight: 600 }}>{dayNum}</span>
                  {apptsToday.length > 0 && apptsToday.map((appt, idx) => (
                    <div className="calendar-appt" key={idx}>
                      <span style={{ fontWeight: 700 }}>{appt.icon}</span>{' '}
                      <span>{appt.type}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Reminders/Notifications Toggles */}
        <div className="reminders-wrap">
          <div className="section-title" style={{ color: '#e2dda6', marginBottom: '0.6em' }}>
            Reminders & Notifications
          </div>
          <div className="reminder-toggle-list">
            {['email', 'sms', 'push'].map(type => (
              <div className="toggle-switch" key={type}>
                <span>
                  {type === 'email' && <span role="img" aria-label="Email">📧</span>}
                  {type === 'sms' && <span role="img" aria-label="SMS">📱</span>}
                  {type === 'push' && <span role="img" aria-label="Push">🔔</span>}
                  <span style={{ marginLeft: '.43em' }}>{type.toUpperCase()}</span>
                </span>
                <span
                  className={`toggle-slider${reminders[type] ? ' checked' : ''}`}
                  onClick={() => handleRemindersToggle(type)}
                >
                  <span
                    className="toggle-dot"
                    style={{ left: reminders[type] ? '17.5px' : '2px' }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Upload Appointment Document */}
        <div className="doc-upload-wrap">
          <div className="section-title" style={{ color:"#E87A41", marginTop:0, marginBottom:".8em", fontSize:"1.32rem" }}>
            Appointment Documents
          </div>
          <input
            type="file"
            style={{ marginBottom: "1rem" }}
            accept="image/*,.pdf,.docx"
            onChange={handleUploadChange}
            ref={uploadInputRef}
          />
          {uploadFile && (
            <div className="doc-upload-preview">
              <span>{uploadFile.name}</span>
              {uploadPreview && (
                // Show preview if it's an image
                <img src={uploadPreview} alt="Preview" className="doc-preview-img" />
              )}
              {!uploadPreview &&
                <span style={{
                  color: "#656461",
                  fontStyle: "italic"
                }}>
                  (Preview unavailable)
                </span>}
              <button
                onClick={() => {
                  setUploadFile(null);
                  setUploadPreview(null);
                  uploadInputRef.current.value = "";
                }}
                style={{
                  marginLeft: "1.5em",
                  border: "none",
                  background: "#e87a41bb",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "0.25em 0.8em",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >Remove</button>
            </div>
          )}
        </div>

        {/* Section: Appointment History */}
        <div>
          <div className="section-title">Appointment History</div>
          <div className="appt-type-filter" style={{ marginBottom: "-0.3em" }}>
            {appointmentTypes.map(at =>
              <button
                key={at.value}
                className={`appt-type-btn${filterType === at.value ? " active" : ""}`}
                onClick={() => setFilterType(at.value)}
              >
                <span style={{ marginRight: ".35rem", fontSize: '1.2rem' }}>{at.icon}</span> {at.label}
              </button>
            )}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="app-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Pet</th>
                  <th>Type</th>
                  <th>Notes</th>
                  <th>Rebook</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 &&
                  <tr><td colSpan="6" style={{ color: "#e87a41", textAlign: "center", fontWeight: "bold" }}>No history for this type.</td></tr>
                }
                {filteredHistory.map(h => (
                  <tr key={h.id}>
                    <td>{h.date}</td>
                    <td>{h.time}</td>
                    <td>{h.pet}</td>
                    <td>
                      <span>{h.icon} {h.type}</span>
                    </td>
                    <td>{h.notes}</td>
                    <td>
                      <button className="rebook-btn" onClick={() => setShowForm(true)}>
                        <span role="img" aria-label="Book Again">🔁</span> Rebook
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for New Appointment */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div
              className="modal-content"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <span className="modal-close" onClick={() => setShowForm(false)}>&times;</span>
              <div style={{ fontSize: "1.27rem", fontWeight: 700, marginBottom: "0.7em", color: "#E87A41" }}>
                Add New Appointment
              </div>
              <form className="new-appt-form" autoComplete="off" onSubmit={handleFormSubmit}>
                <label>
                  Pet Name
                  <input name="pet" type="text" required placeholder="Enter pet name" />
                </label>
                <label>
                  Type
                  <select name="type" required>
                    <option value="Vet Check-Up">Vet Check-Up</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Vaccine">Vaccine</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Date
                  <input name="date" type="date" required />
                </label>
                <label>
                  Time
                  <input name="time" type="time" required />
                </label>
                <label>
                  Notes
                  <textarea name="notes" placeholder="Add notes (optional)" rows={2} />
                </label>
                <button style={gradientBtnStyle} className="animated-btn" type="submit">
                  <span style={{ fontWeight: 700 }}>Create Appointment</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ManageAppointmentsPage;
