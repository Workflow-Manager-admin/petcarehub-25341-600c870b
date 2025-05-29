import React, { useState } from "react";

/**
 * ManageAppointmentsPage
 * Provides all six required appointment management sections:
 * - Upcoming appointments (cards/table)
 * - Interactive calendar (month view w/ highlights)
 * - New booking form (modal)
 * - History (table, filters, rebook)
 * - Reminders (toggles/settings)
 * - Document upload & preview (mock docs)
 * 
 * Uses mock data, accent backgrounds, responsive cards, KAVIA color palette, icons and modern typography.
 */

// Sample icons as SVGs (replace w/ real icon library if needed)
const CalendarIcon = () => (
  <svg width="24" height="24" fill="none" stroke="var(--kavia-orange)" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="var(--kavia-orange)" fill="none"/>
    <path d="M8 3v4M16 3v4M3 9.5h18" stroke="var(--kavia-orange)" />
  </svg>
);

const ReminderIcon = () => (
  <svg width="24" height="24" stroke="var(--kavia-dark)" fill="none" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="13" r="8" stroke="var(--kavia-orange)" />
    <path d="M12 9v4l2 2" stroke="var(--kavia-orange)" />
  </svg>
);

const DocIcon = () => (
  <svg width="24" height="24" fill="none" stroke="var(--kavia-orange)" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="6" y="3" width="12" height="18" rx="2" stroke="var(--kavia-orange)" fill="none" />
    <path d="M9 8h6M9 12h6M12 16h3" stroke="var(--kavia-orange)" />
  </svg>
);

const PetIcon = () => (
  <svg width="22" height="22" fill="none" stroke="var(--kavia-dark)" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="8" cy="8" r="2.5" fill="#e2dda6"/>
    <circle cx="16" cy="8" r="2.5" fill="#e2dda6"/>
    <ellipse cx="12" cy="15.5" rx="7" ry="4" fill="#e2dda6"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" fill="none" stroke="var(--kavia-orange)" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" stroke="var(--kavia-orange)" />
  </svg>
);

// Mock Data
const upcomingAppointments = [
  {
    id: 1,
    pet: "Bella",
    type: "Vet - Checkup",
    date: "2024-06-15T14:30",
    location: "Downtown Vet Clinic",
    notes: "Annual exam, bring vaccination records"
  },
  {
    id: 2,
    pet: "Max",
    type: "Grooming",
    date: "2024-06-17T11:00",
    location: "Pet Palace",
    notes: ""
  },
];

const appointmentHistory = [
  {
    id: 51,
    pet: "Bella",
    type: "Vaccination",
    date: "2024-05-11T15:00",
    provider: "Downtown Vet",
    notes: "DHPP, rabies"
  },
  {
    id: 42,
    pet: "Max",
    type: "Grooming",
    date: "2024-05-03T10:45",
    provider: "Pet Palace",
    notes: "Nails, bath"
  },
  {
    id: 61,
    pet: "Bella",
    type: "Vet - Dental",
    date: "2024-03-22T16:00",
    provider: "Smile4Pets Dental",
    notes: ""
  }
];

const reminders = [
  { id: 1, label: "24hr SMS Reminder", enabled: true },
  { id: 2, label: "Push Notification (1hr before)", enabled: false },
  { id: 3, label: "Email Recap after Visit", enabled: true }
];

const documents = [
  { id: 101, name: "Bella-VaccineCard.pdf", uploaded: "2024-05-11", size: "321 KB" },
  { id: 102, name: "Max-GroomingInvoice.pdf", uploaded: "2024-05-03", size: "182 KB" }
];

const mockPets = [
  { name: "Bella", icon: <PetIcon /> },
  { name: "Max", icon: <PetIcon /> }
];

// Helper: Format date
function formatDate(dtString, opts = {}) {
  const optsDef = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(dtString).toLocaleString(undefined, opts.timeOnly ? { hour: "2-digit", minute: "2-digit" } : optsDef);
}

// --- Modal for Booking New Appointment ---
function BookingModal({ open, onClose, onBook }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    pet: mockPets[0]?.name || "",
    type: "Vet - Checkup",
    date: "",
    time: "",
    notes: ""
  });
  function changeField(e) {
    const { name, value } = e.target;
    setData(s => ({ ...s, [name]: value }));
  }
  function onSubmit(e) {
    e.preventDefault();
    onBook(data);
    onClose();
  }
  if (!open) return null;
  return (
    <div className="modal-bg">
      <div className="modal">
        <h2><PlusIcon /> New Appointment</h2>
        <form onSubmit={onSubmit} className="modal-form">
          <label>
            <span>Pet</span>
            <select name="pet" value={data.pet} onChange={changeField}>
              {mockPets.map(p => (
                <option value={p.name} key={p.name}>{p.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Type</span>
            <select name="type" value={data.type} onChange={changeField}>
              <option>Vet - Checkup</option>
              <option>Grooming</option>
              <option>Vaccination</option>
              <option>Dental Cleaning</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            <span>Date</span>
            <input type="date" name="date" value={data.date} onChange={changeField} required />
          </label>
          <label>
            <span>Time</span>
            <input type="time" name="time" value={data.time} onChange={changeField} required />
          </label>
          <label>
            <span>Notes</span>
            <input type="text" name="notes" value={data.notes} onChange={changeField} placeholder="(Optional)" />
          </label>
          <div className="modal-actions">
            <button className="btn" type="button" onClick={onClose} style={{ background: "var(--kavia-dark)" }}>Cancel</button>
            <button className="btn btn-accent" type="submit">Book</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main Appointments Management Page ---
export default function ManageAppointmentsPage() {
  // Section 1: Upcoming
  const [appointments, setAppointments] = useState(upcomingAppointments);
  // Section 2: Calendar demo
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  // Section 3: Booking modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  // Section 4: History filters
  const [historyFilterType, setHistoryFilterType] = useState("All");
  // Section 5: Reminders
  const [remindersList, setRemindersList] = useState(reminders);
  // Section 6: Docs
  const [docList, setDocList] = useState(documents);

  // Booking handler
  function handleBook(newAppt) {
    // Uses mock, just adds to upcoming
    setAppointments([
      ...appointments,
      {
        id: Date.now(),
        pet: newAppt.pet,
        type: newAppt.type,
        date: `${newAppt.date}T${newAppt.time}`,
        location: "TBD",
        notes: newAppt.notes,
      }
    ]);
  }

  // Toggle reminder
  function toggleReminder(reminderId) {
    setRemindersList(remindersList.map(r =>
      r.id === reminderId ? { ...r, enabled: !r.enabled } : r
    ));
  }

  // Document upload (mock)
  function handleDocUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setDocList([
        ...docList,
        {
          id: Date.now(),
          name: file.name,
          uploaded: new Date().toISOString().split("T")[0],
          size: (file.size / 1024).toFixed(0) + " KB",
        }
      ]);
    }
  }

  // Section 2: Calendar simple monthly (mock, not a full calendar lib)
  function renderCalendarGrid(currMonth) {
    // Get the first day of the month
    const firstDate = new Date(currMonth.getFullYear(), currMonth.getMonth(), 1);
    const startDay = firstDate.getDay(); // 0=Sun
    const daysInMonth = new Date(currMonth.getFullYear(), currMonth.getMonth() + 1, 0).getDate();
    // Lay out a 7x6 grid (max possible weeks)
    let d = 1, cells = [];
    for (let r = 0; r < 6; ++r) {
      let row = [];
      for (let c = 0; c < 7; ++c) {
        if (r === 0 && c < startDay) {
          row.push(<td key={c}></td>);
        } else if (d <= daysInMonth) {
          // Check if appointments on this date
          let dtStr = currMonth.toISOString().slice(0, 8) + (d < 10 ? "0" : "") + d;
          let aptToday = appointments.filter(a => a.date.startsWith(dtStr));
          row.push(
            <td key={c} className={aptToday.length ? "calendar-cell-accent" : ""}>
              <div>
                <span>{d}</span>
                {aptToday.length > 0 && (
                  <div className="calendar-apt-dot" title={aptToday[0].pet + ": " + aptToday[0].type}></div>
                )}
              </div>
            </td>
          );
          d++;
        } else {
          row.push(<td key={c}></td>);
        }
      }
      cells.push(<tr key={r}>{row}</tr>);
    }
    return cells;
  }

  // Filtered history view
  const filteredHistory = historyFilterType === "All"
    ? appointmentHistory
    : appointmentHistory.filter(h => h.type === historyFilterType);

  // --- Render ---
  return (
    <div className="appointments-page-bg">
      <div className="appointments-main-grid">
        {/* Section 1: Upcoming Appointments */}
        <section className="appointments-section block-upcoming">
          <header>
            <CalendarIcon />
            <h2>Upcoming</h2>
            <button className="btn btn-accent btn-compact" onClick={() => setBookingModalOpen(true)}>
              <PlusIcon /> Book Appointment
            </button>
          </header>
          {appointments.length === 0 ? (
            <div className="empty-state">No appointments scheduled.</div>
          ) : (
            <div className="card-list upcoming-list">
              {appointments
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(appt => (
                <div className="card upcoming-card" key={appt.id}>
                  <div className="card-title">
                    <PetIcon /> {appt.pet}
                  </div>
                  <div className="card-info">{appt.type}</div>
                  <div className="card-date-loc">
                    <span className="appt-date">{formatDate(appt.date)}</span>
                    <span className="appt-loc">{appt.location}</span>
                  </div>
                  {appt.notes && <div className="appt-notes">{appt.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Interactive Calendar */}
        <section className="appointments-section block-calendar">
          <header>
            <CalendarIcon />
            <h2>Calendar</h2>
            <div className="calendar-controls">
              <button
                className="btn btn-compact"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
                  )
                }
              >
                {"<"}
              </button>
              <span>
                {calendarMonth.toLocaleString(undefined, {
                  month: "long", year: "numeric"
                })}
              </span>
              <button
                className="btn btn-compact"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
                  )
                }
              >
                {">"}
              </button>
            </div>
          </header>
          <div className="calendar-grid-outer">
            <table className="calendar-grid">
              <thead>
                <tr>
                  <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
                </tr>
              </thead>
              <tbody>{renderCalendarGrid(calendarMonth)}</tbody>
            </table>
            <div className="calendar-legend">
              <span className="calendar-apt-dot"></span> = Appointment
            </div>
          </div>
        </section>

        {/* Section 3: Booking/Modal */}
        <BookingModal
          open={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          onBook={handleBook}
        />

        {/* Section 4: Appointment History */}
        <section className="appointments-section block-history">
          <header>
            <h2>History</h2>
            <select
              value={historyFilterType}
              onChange={e => setHistoryFilterType(e.target.value)}
              className="history-filter"
            >
              <option value="All">All Types</option>
              <option value="Vet - Checkup">Vet - Checkup</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Grooming">Grooming</option>
              <option value="Dental Cleaning">Dental Cleaning</option>
            </select>
          </header>
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Provider</th>
                  <th>Notes</th>
                  <th>Rebook</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length ? (
                  filteredHistory.map(h => (
                    <tr key={h.id}>
                      <td className="pet-cell"><PetIcon /> {h.pet}</td>
                      <td>{h.type}</td>
                      <td>{formatDate(h.date)}</td>
                      <td>{h.provider}</td>
                      <td><span className="history-notes">{h.notes}</span></td>
                      <td>
                        <button className="btn btn-accent btn-compact"
                          onClick={() => {
                            setBookingModalOpen(true);
                          }}
                        >Rebook</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">No history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Reminders/Notifications */}
        <section className="appointments-section block-reminders">
          <header>
            <ReminderIcon />
            <h2>Reminders</h2>
          </header>
          <ul className="reminders-list">
            {remindersList.map(rem => (
              <li key={rem.id} className="reminder-row">
                <span>{rem.label}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={rem.enabled}
                    onChange={() => toggleReminder(rem.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 6: Documents */}
        <section className="appointments-section block-docs">
          <header>
            <DocIcon />
            <h2>Documents</h2>
            <label className="custom-upload">
              <input
                type="file"
                accept=".pdf,.jpg,.png,.jpeg"
                style={{ display: "none" }}
                onChange={handleDocUpload}
              />
              <span className="btn btn-accent btn-compact">Upload Doc</span>
            </label>
          </header>
          <div className="docs-list">
            {docList.length === 0 ? (
              <div className="empty-state">No documents uploaded.</div>
            ) : (
              <ul>
                {docList.map(doc => (
                  <li key={doc.id} className="doc-row">
                    <DocIcon />
                    <span className="doc-name">{doc.name}</span>
                    <span className="doc-meta">{doc.uploaded} • {doc.size}</span>
                    <button className="btn btn-compact" style={{ marginLeft: 8 }}>Preview</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
      {/* Inline CSS for demo (extract to CSS file in real prod) */}
      <style>
      {`
      .appointments-page-bg {
        background: linear-gradient(135deg,#fff,#e2dda6 50%,#879d85 120%);
        min-height: 100vh;
        padding: 0 0 60px 0;
        font-family: 'Segoe UI', 'Arial', sans-serif;
      }
      .appointments-main-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(320px,1fr));
        grid-gap: 2.25rem;
        padding: 2.5rem 2vw 2rem 2vw;
        max-width: 1400px;
        margin: auto;
      }
      .appointments-section {
        background: #fff;
        border-radius: 1.2rem;
        box-shadow: 0 7px 32px rgba(80,90,70,0.10);
        padding: 1.7rem 1.4rem;
        display: flex;
        flex-direction: column;
        min-width: 0;
        margin-bottom: 0.5rem;
        transition: box-shadow 0.2s;
      }
      .appointments-section header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
      }
      .appointments-section h2 {
        font-size: 1.4rem;
        font-weight: bold;
        color: var(--kavia-dark);
        margin: 0;
      }
      .appointments-section .btn-compact {
        font-size: 0.92em;
        padding: 4px 13px;
        margin-left: auto;
        font-weight: 600;
      }
      .block-upcoming {
        background: linear-gradient(120deg, #e2dda6 50%, white 100%);
      }
      .block-calendar {
        background: linear-gradient(120deg, #fff 65%, #e2dda6 150%);
      }
      .block-history {
        background: linear-gradient(110deg, #f9f7ec 60%, #879d85 550%);
      }
      .block-reminders {
        background: #faf6e7;
      }
      .block-docs {
        background: #f6f9ef;
      }

      /* Card Styles */
      .card-list {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
      }
      .upcoming-card {
        border: 1.5px solid var(--border-color,#ece8d6);
        border-radius: 1.1em;
        box-shadow: 0 3px 25px rgba(138,162,133,0.08);
        padding: 1.2rem 1.1rem 1.1rem 1.2rem;
        background: white;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .card-title {
        font-size: 1.1rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 0.5em;
        color: var(--kavia-dark);
      }
      .card-info {
        font-size: 1rem;
        color: #656461;
        margin-top: 1px;
      }
      .card-date-loc {
        display: flex;
        justify-content: space-between;
        font-size: 0.98em;
        color: #9c9170;
        margin-top: 6px;
      }
      .appt-date {
        font-weight: 600;
      }
      .appt-notes {
        font-size: 0.96em;
        color: #b18d40;
        margin-top: 5px;
      }
      /* Calendar */
      .calendar-grid-outer {
        margin: 0.3rem 0 0 0;
        padding: 0.2rem 0.1rem 0.1rem 0.1rem;
        background: #fcfaef;
        border-radius: 0.85rem;
        border: 1px solid #ece8d6;
      }
      .calendar-controls {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 0.7em;
      }
      .calendar-grid {
        width: 100%;
        border-collapse: collapse;
        background: none;
      }
      .calendar-grid th, .calendar-grid td {
        text-align: center;
        padding: 0.32em 0.12em;
        font-size: 1em;
        width: 1.6em;
        height: 2.18em;
        border: none;
        position: relative;
      }
      .calendar-grid th {
        color: #bcc1b7;
        font-weight: 500;
      }
      .calendar-cell-accent {
        background: linear-gradient(122deg, #e2dda6 55%, #f7f5ec 140%);
        border-radius: 1.15em;
        box-shadow: 0 1.5px 0.1em #eaf2cb71;
        position: relative;
      }
      .calendar-apt-dot {
        background: var(--kavia-orange,#E87A41);
        width: 9px; height: 9px;
        display: inline-block;
        border-radius: 50%;
        margin-top: 2px;
        margin-left: 0.08em;
      }
      .calendar-legend {
        font-size: 0.93em;
        margin: 0.95em 0 0.2em 0;
        color: #a49242;
        display: flex;
        align-items: center;
        gap: 7px;
      }

      /* Booking Modal */
      .modal-bg {
        position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
        background: rgba(118,119,107,0.33);
        z-index: 2000;
        display: flex; align-items: center; justify-content: center;
      }
      .modal {
        background: white;
        border-radius: 1.2rem;
        box-shadow: 0 11px 75px rgba(100,120,80,0.20);
        min-width: 335px;
        max-width: 99vw;
        padding: 2.3em 2em 1.5em 2em;
        position: relative;
      }
      .modal > h2 {
        display: flex; align-items: center; gap: 0.4em; margin: 0 0 1.3em 0;
        font-size: 1.28em; color: var(--kavia-dark);
      }
      .modal-form label {
        display: flex; flex-direction: column; font-weight: 500; font-size: 1em; margin-bottom: 1em;
        color: #6b6764;
      }
      .modal-form input[type="text"],
      .modal-form input[type="date"],
      .modal-form input[type="time"],
      .modal-form select {
        font-size: 1em; padding: 0.40em 0.7em; border: 1px solid #e7e5db;
        border-radius: 0.5em; margin-top: 0.3em;
        background: #f5f2e9;
        outline: none;
      }
      .modal-actions {
        margin-top: 0.8em;
        display: flex; justify-content: flex-end; gap: 1em;
      }
      .btn-accent {
        background: var(--kavia-orange,#E87A41) !important;
        color: #fff !important;
      }
      .btn {
        padding: 8px 18px;
        border: none;
        border-radius: 1em;
        background: var(--kavia-dark,#333); color: #fff;
        font-size: 1.05em; cursor: pointer; font-weight: 500;
        transition: background 0.15s;
      }
      .btn:active { filter: brightness(1.10);}
      .btn:focus { outline: 3px solid var(--kavia-orange);}
      .btn-compact {
        padding: 5px 10px;
        font-size: 0.93em;
      }

      /* Appointment History Table */
      .history-table-wrapper {
        overflow-x: auto;
      }
      .history-table {
        width: 100%;
        background: none;
        border-spacing: 0;
        font-size: 0.99em;
      }
      .history-table th, .history-table td {
        padding: 7px 10px;
        min-width: 55px;
        text-align: left;
        color: #1a1a1a;
      }
      .history-table th { color: #8c8050; border-bottom: 2px solid #e3e8c3; font-weight: 600;}
      .history-table tbody tr:nth-child(even) { background: #faf7ee;}
      .pet-cell { display: flex; gap: 5px; align-items: center;}
      .history-notes { color: #c0a14a; font-size: 0.97em;}
      .history-filter {
        font-size: 1em; border-radius: 0.7em; padding: 2.5px 13px;
        border: 1px solid #ece8d6; margin-left: auto;
        background: #f6f3e1;
      }

      /* Reminders */
      .reminders-list { list-style: none; margin: 0; padding: 0; }
      .reminder-row {
        display: flex; align-items: center; justify-content: space-between;
        padding: 13px 0;
        border-bottom: 1px solid #f0eada;
        font-size: 1.06em;
      }
      .reminder-row:last-child { border-bottom: none;}

      /* Toggle Switch */
      .switch { position: relative; display: inline-block; width: 45px; height: 24px;}
      .switch input { opacity: 0; width: 0; height: 0;}
      .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
        background-color: #ccc; transition: .3s; border-radius: 1.2em;}
      .slider:before {
        position: absolute;
        content: "";
        height: 17.5px; width: 17.5px; left: 4px; bottom: 3.3px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 0.5px 3px #b18d406f;
        transition: .3s;
      }
      input:checked + .slider { background-color: var(--kavia-orange);}
      input:checked + .slider:before { transform: translateX(20px);}
      .slider.round { border-radius: 1.2em;}
      .slider.round:before { border-radius: 50%;}

      /* Documents */
      .docs-list ul { list-style: none; padding: 0; margin: 0;}
      .doc-row {
        display: flex; align-items: center;
        background: #fff8e7;
        border-radius: 0.8em;
        margin: 0.5em 0;
        padding: 7px 1em;
        font-size: 1.04em;
        box-shadow: 0 1.5px 11px #e6e2c9c4;
        gap: 1em;
      }
      .doc-row .doc-name { font-weight: 600;}
      .doc-row .doc-meta { color: #b18d40; font-size: 0.93em; margin-left: 0.6em;}

      /* Upload */
      .custom-upload { margin-left: auto; }
      .empty-state {
        color: #b1a990; font-size: 1.02em; text-align: center; margin: 1.4em 0 1em 0;
      }

      /* Responsive grid: stack on small screens */
      @media (max-width: 950px) {
        .appointments-main-grid {
          grid-template-columns: 1fr;
          gap: 2.2rem;
        }
        .appointments-section {
          border-radius: 1em;
          min-width: 0;
        }
      }
      `}
      </style>
    </div>
  );
}
