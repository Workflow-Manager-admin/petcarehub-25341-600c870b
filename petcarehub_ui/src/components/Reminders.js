import React, { useState, useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * Reminders UI: full CRUD support, with association to pets, routines, or medical records.
 * Prominent dashboard notifications for urgent/upcoming reminders.
 * Styling/theme matches PetCareHub. State is managed by MainContainer, and reminders update live with other app sections.
 */
function Reminders({
  reminders = [],
  pets = [],
  routines = [],
  medicalRecords = {},
  onAdd,
  onEdit,
  onDelete,
  onToggleDone
}) {
  // Modal state: {mode: 'add'|'edit'|'delete', data, open}
  const [modal, setModal] = useState({ open: false });

  // --- Helper: option lists for association ---
  // For this version, routines/medical are placeholder arrays (routine support can be added similarly)
  // For demo, just aggregate medical events into one flat array
  const medicalEventOptions = useMemo(() => {
    let arr = [];
    Object.entries(medicalRecords || {}).forEach(([petId, med]) => {
      const vvisits = (med.visits || []).map((v, idx) => ({
        type: 'medical', id: `visit_${petId}_${idx}`,
        petId, label: `${v.reason} (${v.date})`, raw: v
      }));
      arr = arr.concat(vvisits);
    });
    return arr;
  }, [medicalRecords]);

  // --- Sort reminders by due date (soonest at top), then done at bottom
  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => {
      if ((a.done ? 1 : 0) !== (b.done ? 1 : 0)) return a.done ? 1 : -1;
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [reminders]);

  const now = new Date();

  // Returns urgency: "overdue"|"soon"|"normal"
  function getUrgency(reminder) {
    if (!reminder.dueDate) return "normal";
    const due = new Date(reminder.dueDate);
    const diff = due - now;
    if (reminder.done) return "normal";
    if (diff < 0) return "overdue";
    if (diff < 2 * 24 * 60 * 60 * 1000) return "soon"; // <2 days
    return "normal";
  }

  // ---- Modal UI for add/edit reminder ----
  function openModal(mode, rdata = {}) {
    setModal({ open: true, mode, data: { ...rdata } });
  }
  function closeModal() {
    setModal({ open: false, mode: null, data: {} });
  }

  // --- Handler for form save (add/edit) ---
  function handleFormSave(e) {
    e.preventDefault();
    const { mode, data } = modal;
    // Validation - require title, petId, dueDate.
    if (!data.title?.trim() || !data.petId || !data.dueDate) return;
    if (mode === "add") {
      onAdd && onAdd({ ...data, done: false });
    } else if (mode === "edit") {
      onEdit && onEdit(data.id, data);
    }
    closeModal();
  }

  // --- Handler for delete confirm ---
  function handleDelete() {
    if (modal.data && modal.data.id) {
      onDelete && onDelete(modal.data.id);
    }
    closeModal();
  }

  // --- Quick helpers ---
  function getPetName(id) {
    const pet = pets.find(p => p.id === Number(id));
    return pet ? pet.name : "Unknown";
  }

  // --- Reminders Panel, with urgency markers ---
  function ReminderBadge({ reminder, onEdit, onDelete, onToggleDone }) {
    const urgency = getUrgency(reminder);
    const color =
      urgency === "overdue"
        ? "#e96565"
        : urgency === "soon"
        ? "#e7c341"
        : "var(--pch-primary)";
    const border =
      urgency === "overdue"
        ? "2.1px solid #e96565"
        : urgency === "soon"
        ? "2.1px solid #e2dda6"
        : "2.1px solid var(--pch-primary)";
    return (
      <div
        className="pch-summary-highlight"
        style={{
          background:
            urgency === "overdue"
              ? "linear-gradient(95deg,#ffded2 70%,#e96565bb 100%)"
              : urgency === "soon"
              ? "linear-gradient(98deg,#f9f4d3 71%,#e2dda6 100%)"
              : "linear-gradient(97deg, #f3f6e6 62%, #e2dda6cc 100%)",
          marginBottom: 13,
          border,
          boxShadow:
            urgency !== "normal"
              ? "0 3px 22px 0 #e965658e"
              : "0 3px 18px 0 rgba(135,157,133,0.15)",
          opacity: reminder.done ? 0.5 : 1,
          position: "relative",
          cursor: "pointer",
          minHeight: 64,
          transition: "box-shadow .18s"
        }}
      >
        <div style={{
          fontSize: "2em",
          marginRight: 19,
          filter: "drop-shadow(0 6px 12px #879d8577)",
          opacity: reminder.done ? 0.67 : 1
        }}>🔔</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: "bold",
            fontSize: "1.08em",
            color,
            textDecoration: reminder.done ? 'line-through' : undefined
          }}>
            {reminder.title}
            {urgency === 'overdue' && <span style={{marginLeft: 7,color:'#b12f2f',fontSize:"1.1em"}} title="Overdue">⚠️</span>}
            {urgency === 'soon' && <span style={{marginLeft: 7,color:'#a48a15',fontSize:"1.1em"}} title="Upcoming!">⏰</span>}
          </div>
          <div style={{ fontSize: "0.98em", color: "#ad9533", opacity: 0.92 }}>
            {reminder.dueDate &&
              <span>
                Due: {formatDate(reminder.dueDate)}{' '}
              </span>
            }
            {reminder.petId && (
              <>
                <span style={{ color: "#757832",marginLeft:7 }}>
                  for <strong>{getPetName(reminder.petId)}</strong>
                </span>
              </>
            )}
            {reminder.linkedType === "medical" && (
              <span style={{ marginLeft: 7, fontStyle: "italic", color: "#6f5c09" }}>+ Medical Event</span>
            )}
            {reminder.linkedType === "routine" && (
              <span style={{ marginLeft: 7, fontStyle: "italic", color: "#556f85" }}>+ Routine</span>
            )}
          </div>
          {reminder.notes && (
            <div style={{ marginTop: 2, fontSize: "0.97em", color: "#97955c", opacity: 0.79, maxWidth: 320, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {reminder.notes}
            </div>
          )}
        </div>
        <div style={{marginLeft:18,display:"flex",flexDirection:"column",gap:7,alignItems:"flex-end"}}>
          <button
            className="btn"
            style={{
              padding: "4px 14px",
              fontSize: "0.92em",
              background: "#879d85",
              marginBottom: 2,
              borderRadius: 7
            }}
            onClick={e => {(e.stopPropagation && e.stopPropagation()); onEdit(reminder);}}
            tabIndex={0}
          >
            Edit
          </button>
          <button
            className="btn"
            style={{
              padding: "4px 12px",
              fontSize: "0.87em",
              background: "#e96565",
              borderRadius: 7
            }}
            onClick={e => {(e.stopPropagation && e.stopPropagation()); onDelete(reminder);}}
            tabIndex={0}
          >
            Delete
          </button>
          <button
            className="btn"
            style={{
              padding: "2.8px 10px",
              fontSize: "0.85em",
              background: reminder.done ? "#979d98" : "#e7c341",
              color: reminder.done ? "#fff" : "#453b12",
              borderRadius: 7,
              marginTop:2
            }}
            onClick={e => {(e.stopPropagation && e.stopPropagation()); onToggleDone && onToggleDone(reminder.id);}}
            tabIndex={0}
          >
            {reminder.done ? "Mark Active" : "Mark Done"}
          </button>
        </div>
      </div>
    )
  }

  // --- Date formatting ---
  function formatDate(val) {
    try {
      if (!val) return '';
      const dt = new Date(val)
      return dt.toLocaleString(undefined, {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    } catch (e) { return val; }
  }

  // --- Form modal for add/edit ---
  function renderReminderForm() {
    if (!modal.open || (modal.mode !== "add" && modal.mode !== "edit")) return null;
    const isEdit = modal.mode === "edit";
    const d = modal.data || {};
    return (
      <div
        className="pch-modal-overlay"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{
          position: "fixed",
          left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 999,
          background: "rgba(42,46,38,0.17)", display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <div style={{
          background: "#fff", borderRadius: 14,
          boxShadow: "0 8px 36px 0 #879d8581",
          padding: "36px 30px 18px 30px",
          minWidth: 314, maxWidth: 420, textAlign: "center", position: "relative"
        }}>
          <button
            aria-label="Close"
            style={{
              position: "absolute", right: 11, top: 9, background: "transparent", border: "none", color: "var(--pch-accent)", fontSize: "1.28em", cursor: "pointer"
            }}
            onClick={closeModal}
          >&times;</button>
          <h3 style={{ margin: "0 0 11px", color: "var(--kavia-orange)" }}>
            {isEdit ? "Edit Reminder" : "Add Reminder"}
          </h3>
          <form onSubmit={handleFormSave} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            <input
              name="title"
              placeholder="Reminder title"
              value={d.title || ""}
              maxLength={50}
              required
              style={inputStyle}
              autoFocus
              onChange={e => setModal(m => ({ ...m, data: { ...m.data, title: e.target.value } }))}
              aria-label="title"
            />
            <input
              type="datetime-local"
              name="dueDate"
              value={d.dueDate ? d.dueDate.slice(0, 16) : ""}
              required
              style={inputStyle}
              onChange={e => setModal(m => ({ ...m, data: { ...m.data, dueDate: e.target.value } }))}
              aria-label="Due date"
            />
            <select
              name="petId"
              value={d.petId || ""}
              required
              style={inputStyle}
              onChange={e => setModal(m => ({ ...m, data: { ...m.data, petId: Number(e.target.value) } }))}
              aria-label="Pet"
            >
              <option value="">Select a Pet</option>
              {pets.map((p) =>
                <option key={p.id} value={p.id}>{p.name}</option>
              )}
            </select>
            {/* Association with routine or medical */}
            <select
              name="linkedType"
              value={d.linkedType || ""}
              style={inputStyle}
              onChange={e => setModal(m => ({
                ...m,
                data: { ...m.data, linkedType: e.target.value, linkedId: "" }
              }))}
              aria-label="Link type"
            >
              <option value="">No Link</option>
              <option value="routine">Routine</option>
              <option value="medical">Medical Event</option>
            </select>
            {d.linkedType === "medical" && (
              /* Flat list of medical events (pet-specific) */
              <select
                name="linkedId"
                value={d.linkedId || ""}
                style={inputStyle}
                onChange={e => setModal(m => ({
                  ...m, data: { ...m.data, linkedId: e.target.value }
                }))}
                aria-label="Medical event"
              >
                <option value="">Link to a medical event…</option>
                {medicalEventOptions
                  .filter(mo => Number(mo.petId) === Number(d.petId))
                  .map(mo =>
                    <option key={mo.id} value={mo.id}>{mo.label}</option>
                  )}
              </select>
            )}
            {/* notes */}
            <textarea
              name="notes"
              placeholder="Add notes (optional)"
              value={d.notes || ""}
              maxLength={120}
              style={{ ...inputStyle, minHeight: 54, resize: "vertical" }}
              onChange={e => setModal(m => ({ ...m, data: { ...m.data, notes: e.target.value } }))}
              aria-label="Notes"
            />
            <div style={{ display: "flex", gap: 14, marginTop: 13, justifyContent: "center" }}>
              <button type="submit" className="btn btn-large" style={{ fontWeight: 500, minWidth: 98 }}>
                {isEdit ? "Save Changes" : "Add"}
              </button>
              <button type="button" className="btn btn-large" style={{ background: '#bdbdbd', color: '#4e5439' }} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // --- Confirm delete modal ---
  function renderDeleteModal() {
    if (!(modal.open && modal.mode === "delete")) return null;
    const d = modal.data || {};
    return (
      <div
        className="pch-modal-overlay"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{
          position: "fixed",
          left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 999,
          background: "rgba(42,46,38,0.17)", display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <div style={{
          background: "#fff", borderRadius: 14,
          boxShadow: "0 8px 36px 0 #879d8581",
          padding: "26px 23px 11px 23px",
          minWidth: 265, maxWidth: 350, textAlign: "center", position: "relative"
        }}>
          <button
            aria-label="Close"
            style={{
              position: "absolute", right: 12, top: 10, background: "transparent", border: "none", color: "var(--pch-accent)", fontSize: "1.2em", cursor: "pointer"
            }}
            onClick={closeModal}
          >&times;</button>
          <h3 style={{ margin: "0 0 8px", color: "#e96565", fontWeight: 600 }}>Delete Reminder?</h3>
          <div style={{ marginBottom: 14 }}>Are you sure you want to delete this reminder?</div>
          <div style={{ fontWeight: 600, color: "var(--kavia-orange)" }}>{d.title}</div>
          <div style={{ fontSize: "1em", color: "var(--pch-accent)", opacity: 0.76 }}>{d.notes}</div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 12 }}>
            <button className="btn btn-large" style={{ background: '#e96565' }} onClick={handleDelete}>
              Delete
            </button>
            <button className="btn btn-large" style={{ background: '#e2dda6', color: '#554f23' }} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Input style for forms
  const inputStyle = {
    margin: '5px 0',
    padding: '7px 12px',
    borderRadius: 6,
    border: '1.4px solid var(--pch-secondary)',
    fontSize: '1em',
    width: 224,
    background: '#fafcf9',
    color: 'var(--pch-accent)',
    outline: 'none'
  };

  // --- Main UI ---
  return (
    <div style={{ width: '100%', maxWidth: 700, margin: '0 auto', minHeight: 265 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <div className="pch-widget-icon" style={{ fontSize: '2.3em', marginRight: 12 }} role="img" aria-label="reminder">🔔</div>
        <h2 style={{ flex: 1, color: 'var(--pch-primary)', letterSpacing: '0.01em', margin: 0 }}>Reminders & Notifications</h2>
        <button className="btn btn-large" style={{ fontSize: "1.06em", fontWeight: 500, marginLeft: 13 }} onClick={() => openModal('add')}>
          + Add Reminder
        </button>
      </div>

      {/* Urgent panel / Alert panel */}
      <div style={{ marginBottom: 20 }}>
        {sortedReminders.length === 0 && (
          <div className="pch-widget-placeholder"
            style={{
              color: 'var(--pch-accent)', fontSize: '1.08em', padding: '1.5em 1em', textAlign: 'center', opacity: 0.82,
              background: '#fafd f6', borderRadius: 13, border: '1.5px solid var(--pch-secondary)'
            }}>
            No reminders set yet! Click <b>+ Add Reminder</b> to keep your pet care on track.
          </div>
        )}
        {sortedReminders.length > 0 && (
          <>
            {sortedReminders
              .filter(r => !r.done && (getUrgency(r) === 'overdue' || getUrgency(r) === 'soon'))
              .length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{
                    fontWeight: 600, color: "#b02418", fontSize: "1.12em",
                    marginBottom: 9, marginTop: 3,
                  }}>Urgent/Upcoming:</div>
                  {sortedReminders.filter(r => !r.done && (getUrgency(r) === 'overdue' || getUrgency(r) === 'soon')).map(r =>
                    <ReminderBadge
                      key={r.id}
                      reminder={r}
                      onEdit={() => openModal('edit', r)}
                      onDelete={() => openModal('delete', r)}
                      onToggleDone={onToggleDone}
                    />)}
                </div>
              )}
          </>
        )}
      </div>

      {/* Full reminders badge list */}
      <div>
        {sortedReminders.filter(r => r.done).length > 0 && (
          <div style={{ margin: "12px 0 5px", fontWeight: 500, color: "#a3a186" }}>Completed:</div>
        )}
        {sortedReminders.length > 0 &&
          sortedReminders.map(r =>
            <ReminderBadge
              key={r.id}
              reminder={r}
              onEdit={() => openModal('edit', r)}
              onDelete={() => openModal('delete', r)}
              onToggleDone={onToggleDone}
            />
          )
        }
      </div>

      {renderReminderForm()}
      {renderDeleteModal()}
    </div>
  );
}

export default Reminders;
