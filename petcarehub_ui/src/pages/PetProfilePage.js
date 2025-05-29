import React, { useState, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * PetProfilePage - Modern, organized, animated profile view for a single pet, with full details, edit, uploads, and responsive UI.
 * All sections: header (photo+edit), basic info, owner/caretaker, medical overview, vaccinations panel, notes, attachments.
 * Sans-serif font, Lucide/FontAwesome icons, responsive columns, glassy cards, subtle slide/hover animation. No external state.
 */
function PetProfilePage() {
  // Demo state for mock data; in real app these would arrive via props or context
  const [pet, setPet] = useState({
    name: "Luna",
    breed: "Golden Retriever",
    age: 4,
    gender: "Female",
    photo: null,
    color: "Golden",
    weight: "52 lbs",
    microchip: "985112003215321",
    dob: "2019-04-05",
    owner: {
      name: "Alex Pawsome",
      email: "alex.petparent@email.com",
      phone: "+1 415 555 1234",
      address: "101 Main St, Petville"
    },
    medical: {
      status: "Up-to-date",
      tags: ["No allergies", "Spayed", "Friendly"],
      vet: "Dr. Smith (HappyTails Clinic)",
      lastVisit: "2023-11-22"
    },
    vaccinations: [
      { name: "Rabies", date: "2023-06-10", status: "valid" },
      { name: "Distemper", date: "2022-12-02", status: "valid" },
      { name: "Parvovirus", date: "2021-09-14", status: "expired" }
    ],
    notes: "Luna is friendly with kids. Prefers chicken treats. Needs monthly grooming for skin health.",
    attachments: []
  });
  const [editingField, setEditingField] = useState(null);
  const [isBasicInfoEdit, setIsBasicInfoEdit] = useState(false);
  const [basicInfoDraft, setBasicInfoDraft] = useState({});
  const [noteDraft, setNoteDraft] = useState(pet.notes);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [newVaccine, setNewVaccine] = useState({ name: "", date: "", status: "valid" });
  const [vacExpanded, setVacExpanded] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const fileInputRef = useRef();

  // ---- BASIC INFO EDIT HANDLERS ----
  function handleBasicInfoBeginEdit() {
    setBasicInfoDraft({
      breed: pet.breed,
      dob: pet.dob,
      color: pet.color,
      age: pet.age,
      microchip: pet.microchip,
      weight: pet.weight,
    });
    setIsBasicInfoEdit(true);
  }

  function handleBasicInfoChange(field, value) {
    setBasicInfoDraft(prev => ({ ...prev, [field]: value }));
  }

  function handleBasicInfoSave() {
    setPet(prev => ({
      ...prev,
      breed: basicInfoDraft.breed,
      dob: basicInfoDraft.dob,
      color: basicInfoDraft.color,
      age: basicInfoDraft.age,
      microchip: basicInfoDraft.microchip,
      weight: basicInfoDraft.weight,
    }));
    setIsBasicInfoEdit(false);
  }

  function handleBasicInfoCancel() {
    setIsBasicInfoEdit(false);
    setBasicInfoDraft({});
  }

  // ---- PET IMAGE/AVATAR LOGIC ----
  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new window.FileReader();
    reader.onload = ev =>
      setPet(prev => ({ ...prev, photo: ev.target.result }));
    reader.readAsDataURL(file);
  }

  // ---- EDITABLE INLINE LOGIC (for basic info) ----
  function startEdit(field) {
    setEditingField(field);
  }
  function doneEdit(field, value) {
    setPet(prev => ({ ...prev, [field]: value }));
    setEditingField(null);
  }

  // ---- NOTES LOGIC ----
  function saveNotes() {
    setPet(prev => ({ ...prev, notes: noteDraft }));
    setEditingField(null);
  }

  // ---- VACCINE ADD/DELETE ----
  function addVaccine(e) {
    e.preventDefault();
    if (!newVaccine.name || !newVaccine.date) return;
    setPet(prev => ({
      ...prev,
      vaccinations: [
        ...prev.vaccinations,
        { ...newVaccine, status: "valid" }
      ]
    }));
    setNewVaccine({ name: "", date: "", status: "valid" });
  }
  function deleteVaccine(idx) {
    setPet(prev => ({
      ...prev,
      vaccinations: prev.vaccinations.filter((_, i) => i !== idx)
    }));
  }

  // ---- ATTACHMENTS LOGIC ----
  function handleUpload(e) {
    const files = e.target.files;
    if (!files?.length) return;
    const arr = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev =>
        setUploadFiles(prev =>
          [...prev, { name: file.name, data: ev.target.result, type: file.type }]
        );
      reader.readAsDataURL(file);
    });
  }
  function removeUpload(idx) {
    setUploadFiles(arr => arr.filter((_, i) => i !== idx));
  }

  // ---- ICON UTILS (Lucide, FA, fallback) ----
  function icon(name, props = {}) {
    // Lucide as default, fallback to FA
    const lucideMap = {
      paw: "paw-print",
      cake: "cake",
      tag: "tag",
      dog: "dog",
      info: "info",
      user: "user-round",
      edit: "edit-3",
      mail: "mail",
      map: "map-pin",
      phone: "phone",
      shield: "shield-check",
      syringe: "syringe",
      check: "check",
      x: "x",
      plus: "plus",
      calendar: "calendar-days",
      smile: "smile",
      pen: "pen-line",
      attachment: "paperclip",
      upload: "upload-cloud",
      file: "file",
      trash: "trash-2",
      chevronDown: "chevron-down",
      chevronUp: "chevron-up",
      clipboard: "clipboard-list"
    };
    const luc = lucideMap[name] || name;
    return <i className={`lucide lucide-${luc}`} {...props} />;
  }

  // ---- RENDERING HELPERS ----
  // For status coloring (valid = green, expired = red, soon = yellow)
  function vaccStatusColor(status) {
    return status === "valid"
      ? "var(--success)"
      : status === "expired"
      ? "var(--error)"
      : "var(--warning)";
  }

  // ---- HEADER SECTION ----
  const header = (
    <div className="card card-glass card-animated" style={{
      display: "flex",
      alignItems: "center",
      gap: 26,
      padding: "2.2em 1.3em",
      background: "var(--glass-light)",
      marginBottom: 32,
      borderRadius: 22,
      boxShadow: "var(--shadow-card)"
    }}>
      {/* Pet image and edit overlay */}
      <div style={{ position: "relative" }}>
        {pet.photo ? (
          <img
            src={pet.photo}
            alt="Pet"
            style={{
              width: 110, height: 110, borderRadius: "50%",
              border: "2.5px solid var(--primary)", objectFit: "cover",
              background: "#fafcf8",
              boxShadow: "0 7px 29px #e2dda642"
            }}
          />
        ) : (
          <div style={{
            width: 110, height: 110, borderRadius: "50%",
            background: "linear-gradient(129deg,#e2dda641 55%,#fafcf7 100%)",
            border: "2.5px dashed var(--primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "3.4em", color: "var(--accent)"
          }}>
            {icon("paw", { style: { opacity: 0.54 } })}
          </div>
        )}
        {/* Edit button overlay */}
        <label style={{
          position: "absolute", right: 4, bottom: 6,
          background: "var(--glass-light)", borderRadius: "50%",
          boxShadow: "var(--shadow-btn)", cursor: "pointer", padding: ".37em"
        }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
            aria-label="Upload photo"
          />
          {icon("edit", { style: { fontSize: "1.25em", color: "var(--accent)" }, title: "Edit photo" })}
        </label>
      </div>

      <div style={{ flex: "1 1 58%", minWidth: 0 }}>
        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-poppins)",
          fontWeight: 700,
          color: "var(--primary)",
          fontSize: "2.15em",
          letterSpacing: "0.01em",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          {editingField === "name" ? (
            <input
              type="text"
              style={{
                fontSize: "1.2em", border: "1.2px solid var(--secondary)",
                borderRadius: 8, background: "#fafcf7", padding: "2px 9px", fontFamily: "var(--font-inter)", color: "var(--primary)"
              }}
              value={pet.name}
              onChange={e => setPet(prev => ({ ...prev, name: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={e => e.key === "Enter" && doneEdit("name", pet.name)}
              autoFocus
              maxLength={32}
            />
          ) : (
            <>
              {pet.name}
              <button className="btn btn-glass" style={{
                marginLeft: 9, fontSize: "0.9em", padding: "5px",
                background: "#fafdfe"
              }} aria-label="Edit pet name" onClick={() => startEdit("name")}>
                {icon("edit")} Edit
              </button>
            </>
          )}
        </h1>
        <div style={{
          color: "var(--accent)", fontSize: "1.14em",
          fontFamily: "var(--font-inter)", fontWeight: 550, marginTop: 5
        }}>
          {pet.breed}
        </div>
        <div style={{
          color: "var(--text-secondary)", fontSize: "1em",
          fontFamily: "var(--font-inter)", marginTop: 2
        }}>
          {pet.age} {pet.age === 1 ? "year" : "years"}, {pet.gender} <span style={{ marginLeft: 7 }}>{icon("smile")} </span>
        </div>
      </div>
    </div>
  );

  // ---- BASIC INFO CARD ----
  const basicInfo = (
    <div className="card card-animated" style={{
      background: "var(--glass-light)",
      marginBottom: 24,
      borderRadius: 16,
      boxShadow: "var(--shadow-glass-light)",
      animationDelay: "0.15s"
    }}>
      <div className="grid grid-2-cols" style={{ gap: "1.7em", alignItems: "start" }}>
        <div>
          <InfoRow
            icon={icon("tag")}
            label="Breed"
            value={pet.breed}
            editable
            field="breed"
            editingField={editingField}
            onStartEdit={() => startEdit("breed")}
            onEdit={val => doneEdit("breed", val)}
          />
          <InfoRow
            icon={icon("cake")}
            label="DOB"
            value={pet.dob}
            editable
            type="date"
            field="dob"
            editingField={editingField}
            onStartEdit={() => startEdit("dob")}
            onEdit={val => doneEdit("dob", val)}
          />
          <InfoRow
            icon={icon("paw")}
            label="Color"
            value={pet.color}
            editable
            field="color"
            editingField={editingField}
            onStartEdit={() => startEdit("color")}
            onEdit={val => doneEdit("color", val)}
          />
        </div>
        <div>
          <InfoRow
            icon={icon("calendar")}
            label="Age"
            value={pet.age + " yrs"}
            editable
            type="number"
            field="age"
            editingField={editingField}
            onStartEdit={() => startEdit("age")}
            onEdit={val => doneEdit("age", val)}
          />
          <InfoRow
            icon={icon("shield")}
            label="Microchip"
            value={pet.microchip}
            editable
            field="microchip"
            editingField={editingField}
            onStartEdit={() => startEdit("microchip")}
            onEdit={val => doneEdit("microchip", val)}
          />
          <InfoRow
            icon={icon("clipboard")}
            label="Weight"
            value={pet.weight}
            editable
            field="weight"
            editingField={editingField}
            onStartEdit={() => startEdit("weight")}
            onEdit={val => doneEdit("weight", val)}
          />
        </div>
      </div>
    </div>
  );

  // ---- COLLAPSIBLE OWNER INFO ----
  const ownerInfo = (
    <section className="card card-glass card-animated" style={{
      marginBottom: 18,
      borderRadius: 15,
      boxShadow: "var(--shadow-md)",
      transition: "box-shadow .18s, background .18s",
      animationDelay: "0.22s",
    }}>
      <button
        className="btn btn-glass"
        aria-controls="owner-content"
        aria-expanded={ownerOpen}
        style={{
          display: "flex", alignItems: "center",
          fontWeight: 600, fontSize: "1.1em",
          marginBottom: 0, width: "100%",
          background: "var(--glass-light)",
          boxShadow: "none",
        }}
        onClick={() => setOwnerOpen(x => !x)}
      >
        {icon("user", { style: { marginRight: 7 } })}
        Owner / Caretaker Info
        <span style={{
          marginLeft: "auto",
          transition: "transform 0.21s",
          transform: ownerOpen ? "rotate(180deg)" : undefined,
        }}>{icon(ownerOpen ? "chevronUp" : "chevronDown")}</span>
      </button>
      {ownerOpen && (
        <div
          id="owner-content"
          className="fadein"
          style={{
            marginTop: 9,
            marginBottom: 9,
            padding: "0 0.6em",
            fontFamily: "var(--font-inter)",
            fontSize: "1.06em",
            color: "var(--accent)"
          }}
        >
          <div style={{ marginBottom: 5 }}>
            {icon("user")} {pet.owner.name}
          </div>
          <div style={{ marginBottom: 5 }}>
            {icon("mail")} <a style={{ color: "var(--primary)", textDecoration: "underline" }} href={`mailto:${pet.owner.email}`}>{pet.owner.email}</a>
          </div>
          <div style={{ marginBottom: 5 }}>
            {icon("phone")} <a style={{ color: "var(--primary)", textDecoration: "underline" }} href={`tel:${pet.owner.phone}`}>{pet.owner.phone}</a>
          </div>
          <div>
            {icon("map")} {pet.owner.address}
          </div>
        </div>
      )}
    </section>
  );

  // ---- MEDICAL OVERVIEW ----
  const medicalOverview = (
    <section className="card card-glass card-animated" style={{
      marginBottom: 18,
      borderRadius: 15,
      boxShadow: "var(--shadow-md)",
      animationDelay: "0.26s",
      transition: "box-shadow .17s"
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        {icon("syringe", { style: { fontSize: "1.4em", marginRight: 10, color: "var(--success)" } })}
        <div>
          <div style={{
            fontSize: "1.06em", fontWeight: 600, color: "var(--primary)", marginBottom: 2
          }}>Medical Status</div>
          <div style={{ fontSize: "0.96em", color: "var(--accent)", fontWeight: 500 }}>
            {pet.medical.status}
          </div>
        </div>
        <span style={{ flex: 1 }} />
        <button
          className="btn btn-glass"
          style={{ fontSize: "0.95em", padding: "7px 18px", boxShadow: "var(--shadow-btn)" }}
          onClick={() => window.location.href = "/health"}
        >{icon("clipboard", { style: { marginRight: 5 } })} Vet Visits</button>
      </div>
      <div style={{ margin: "10px 0 0 2px" }}>
        {pet.medical.tags.map((t, i) =>
          <span key={i} className="badge tag" style={{
            background: "var(--secondary)", color: "var(--accent)",
            fontWeight: 500, padding: "0.14em 1em", marginRight: 6, marginBottom: 3, fontSize: "0.97em"
          }}>{t}</span>
        )}
      </div>
      <div style={{ marginTop: 12, color: "var(--text-secondary)", fontSize: "0.96em" }}>
        Vet: {pet.medical.vet} <span style={{ marginLeft: 13, color: "#b6b7ac" }}>|</span> Last Visit: <span style={{ color: "#879d85", fontWeight: 600 }}>{pet.medical.lastVisit}</span>
      </div>
    </section>
  );

  // ---- VACCINATIONS PANEL ----
  const vaccinationsPanel = (
    <section className="card card-animated" style={{
      background: "var(--glass-light)",
      marginBottom: 22, borderRadius: 16, boxShadow: "var(--shadow-card)",
      animationDelay: "0.30s"
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        {icon("syringe", { style: { fontSize: "1.35em", color: "#e7c341", marginRight: 8 } })}
        <div style={{
          fontSize: "1.09em", fontWeight: 600, color: "var(--primary)", flex: 1
        }}>
          Vaccinations
        </div>
        <button className="btn btn-glass"
          style={{ fontSize: "0.93em", background: "var(--secondary)", color: "var(--accent)", padding: "0.4em 1.27em", fontWeight: 600 }}
          onClick={() => setVacExpanded(e => !e)}
        >
          {vacExpanded ? icon("chevronUp") : icon("plus")} {vacExpanded ? "Hide" : "Add"}
        </button>
      </div>
      {/* List */}
      <div style={{ margin: "9px 0" }}>
        <table style={{
          width: "100%", background: "#fff", borderRadius: 10, boxShadow: "0 1px 7px #879d8526", overflow: "hidden"
        }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "7px 7px", fontSize: "0.97em" }}>Vaccine</th>
              <th style={{ textAlign: "left", padding: "7px 7px", fontSize: "0.97em" }}>Date</th>
              <th style={{ textAlign: "center", padding: "7px 7px", fontSize: "0.97em" }}>Status</th>
              <th style={{ width: 49 }} />
            </tr>
          </thead>
          <tbody>
            {pet.vaccinations.map((v, idx) =>
              <tr key={idx} style={{ background: idx % 2 ? "#f8faf6" : "#fafcf7" }}>
                <td style={{ padding: "7px 7px" }}>{v.name}</td>
                <td style={{ padding: "7px 7px" }}>{v.date}</td>
                <td style={{ textAlign: "center" }}>
                  <span style={{
                    color: vaccStatusColor(v.status), fontWeight: 600,
                    fontSize: "1em"
                  }}>
                    {icon(
                      v.status === "valid"
                        ? "check"
                        : v.status === "expired"
                        ? "x"
                        : "info",
                      { style: { marginRight: 4 } }
                    )}
                    {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="btn btn-glass"
                    style={{
                      fontSize: "0.87em",
                      padding: "2.3px 10px",
                      background: "#e96565",
                      color: "#fff"
                    }}
                    title="Delete"
                    onClick={() => deleteVaccine(idx)}
                  >
                    {icon("trash")}
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Add form */}
      {vacExpanded && (
        <form style={{
          marginTop: 12, display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap"
        }} onSubmit={addVaccine}>
          <input
            required maxLength={40}
            placeholder="Vaccine name"
            style={inputStyle}
            value={newVaccine.name}
            onChange={e => setNewVaccine(v => ({ ...v, name: e.target.value }))}
          />
          <input
            required type="date"
            style={inputStyle}
            value={newVaccine.date}
            onChange={e => setNewVaccine(v => ({ ...v, date: e.target.value }))}
          />
          <button className="btn btn-large" style={{ fontWeight: 600, fontSize: "1em", padding: "7px 18px", marginLeft: 8, background: "var(--success)" }}>
            {icon("plus")} Add
          </button>
        </form>
      )}
    </section>
  );

  // ---- NOTES ----
  const notesSection = (
    <section className="card card-glass card-animated" style={{
      marginBottom: 22,
      borderRadius: 15,
      animationDelay: "0.34s"
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        {icon("info", { style: { fontSize: "1.11em", color: "#e7c341", marginRight: 7 } })}
        <div style={{ fontSize: "1.05em", fontWeight: 600, color: "var(--accent)", flex: 1 }}>
          Additional Notes & Info
        </div>
        <button
          className="btn btn-glass"
          style={{ fontSize: "0.94em", background: "#fafdfe", color: "#656461", padding: "4px 17px" }}
          aria-label="Edit notes"
          onClick={() => setEditingField("notes")}
        >
          {icon("pen")} {editingField === "notes" ? "Editing" : "Edit"}
        </button>
      </div>
      {/* Notes actual */}
      {editingField === "notes" ? (
        <div>
          <textarea
            style={{ width: "98%", minHeight: 48, fontSize: "1.04em", fontFamily: "var(--font-nunito)", padding: "7px 13px", borderRadius: 8, border: "1.4px solid var(--pch-secondary)" }}
            value={noteDraft}
            maxLength={300}
            onChange={e => setNoteDraft(e.target.value)}
          />
          <div style={{ margin: "9px 0 0 0", display: "flex", gap: 12 }}>
            <button className="btn btn-glass" style={{ background: "var(--success)", color: "#fff", fontWeight: 600 }} onClick={saveNotes}>Save</button>
            <button className="btn btn-glass" style={{ background: "#bdbdbd", color: "#656461" }} onClick={() => { setNoteDraft(pet.notes); setEditingField(null); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{
          marginTop: 4,
          fontSize: "1.06em",
          fontFamily: "var(--font-nunito)",
          color: "#656461",
          opacity: 0.93
        }}>
          {pet.notes}
        </div>
      )}
    </section>
  );

  // ---- ATTACHMENTS ----
  const attachmentsSection = (
    <section className="card card-animated" style={{
      background: "var(--glass-light)",
      marginBottom: 0, borderRadius: 15, boxShadow: "var(--shadow-glass-light)",
      animationDelay: "0.38s"
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        {icon("attachment", { style: { fontSize: "1.15em", color: "#879d85", marginRight: 8 } })}
        <div style={{
          fontSize: "1.04em", fontWeight: 600, color: "var(--primary)", flex: 1
        }}>
          Attachments
        </div>
        <label className="btn btn-glass" style={{
          fontSize: "0.96em", padding: "4px 19px",
          background: "#e2dda6", color: "#656461", fontWeight: 600, marginLeft: 10
        }}>
          {icon("upload", { style: { marginRight: 7 } })} Upload
          <input
            type="file"
            multiple
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleUpload}
            aria-label="Upload attachments"
          />
        </label>
      </div>
      {/* File thumbnails/list */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8em", marginTop: 8 }}>
        {uploadFiles.length === 0 && (
          <div style={{ color: "var(--text-muted)", fontSize: "0.99em" }}>
            No files uploaded yet.
          </div>
        )}
        {uploadFiles.map((f, i) =>
          <div key={i} style={{
            border: "1.2px solid var(--primary)", borderRadius: 8, background: "#fff",
            padding: "0.55em 0.9em 0.2em 0.9em", minWidth: 108, maxWidth: 172,
            boxShadow: "0 2px 9px #e2dda617", fontSize: "0.96em", color: "#656461", textAlign: "center", position: "relative"
          }}>
            {/* File preview image if image, else icon */}
            {f.type && f.type.startsWith("image") ?
              <img src={f.data} alt={f.name} style={{
                maxWidth: 106, maxHeight: 60, display: "block", margin: "0 auto 5px auto", borderRadius: 4, boxShadow: "0 4px 11px #879d8548"
              }} />
              : <div style={{ fontSize: "1.6em", marginBottom: 3 }}>{icon("file")}</div>
            }
            <div style={{
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.99em"
            }}>{f.name}</div>
            <button className="btn btn-glass" style={{
              position: "absolute", right: 6, top: 5,
              fontSize: "1em", background: "#e96565", color: "#fff", borderRadius: 7
            }} title="Remove" onClick={() => removeUpload(i)}>
              {icon("trash")}
            </button>
          </div>
        )}
      </div>
    </section>
  );

  // ---- INPUT STYLE ----
  const inputStyle = {
    margin: "5px 0",
    padding: "7px 11px",
    borderRadius: 7,
    border: "1.4px solid var(--pch-secondary)",
    fontSize: "1em",
    background: "#fafcf9",
    color: "var(--pch-accent)",
    outline: "none"
  };

  // ---- MAIN RENDER ----
  return (
    <div style={{
      margin: "0 auto", padding: "2.1em 0.4em",
      maxWidth: 960, minWidth: 0,
      fontFamily: "var(--font-sans)",
      animation: "card-in 1.18s cubic-bezier(.19,.8,.39,1) both"
    }}
      className="container card-glass"
    >
      {header}
      <div className="grid grid-2-cols" style={{ gap: "2em", alignItems: "start", marginBottom: 0 }}>
        <div>
          {basicInfo}
          {ownerInfo}
          {medicalOverview}
        </div>
        <div>
          {vaccinationsPanel}
          {notesSection}
          {attachmentsSection}
        </div>
      </div>
    </div>
  );
}


// ---- InfoRow Component (for basic info fields) ----
function InfoRow({ icon, label, value, editable, type, field, editingField, onStartEdit, onEdit }) {
  const [inputValue, setInputValue] = useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 13 }}>
      <span style={{ marginRight: 10, color: "var(--accent)", fontSize: "1.1em" }}>{icon}</span>
      <span style={{ minWidth: 64, fontWeight: 500, color: "#656461" }}>{label}:</span>
      <span style={{ marginLeft: 7, flex: 1, fontSize: "1.04em", color: "#1A1A1A" }}>
        {editingField === field ? (
          <input
            type={type || "text"}
            style={{
              minWidth: 55,
              fontSize: "1.03em",
              border: "1.2px solid var(--secondary)",
              borderRadius: 7,
              background: "#fafcf7",
              padding: "4px 8px",
              fontFamily: "var(--font-inter)",
              color: "var(--primary)"
            }}
            value={inputValue}
            autoFocus
            maxLength={32}
            onChange={e => setInputValue(e.target.value)}
            onBlur={() => onEdit(inputValue)}
            onKeyDown={e => e.key === "Enter" && onEdit(inputValue)}
          />
        ) : (
          <span>{value}
            {editable &&
              <button
                className="btn btn-glass"
                style={{
                  marginLeft: 11, fontSize: "0.92em",
                  padding: "5px 9px",
                  background: "#fafdfe",
                  color: "#656461"
                }}
                onClick={onStartEdit}
                aria-label={`Edit ${label}`}
              >Edit</button>}
          </span>
        )}
      </span>
    </div>
  );
}

export default PetProfilePage;
