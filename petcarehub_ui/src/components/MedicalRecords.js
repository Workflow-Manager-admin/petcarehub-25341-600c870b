import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * MedicalRecords manages CRUD for a selected pet's medical data:
 * - history, vaccinations, prescriptions, vet visits
 * Receives all pet data, current petId, and record state as props.
 */
function MedicalRecords({
  pets,
  selectedPetId,
  selectPet,           // function to change selected pet
  medical,
  setMedicalRecords    // function: (petId, newMedical) => void
}) {
  // Find selected pet
  const selectedPet = pets.find(p => p.id === selectedPetId) || null;

  // Section configs
  const sections = [
    {
      key: 'history', icon: '', label: 'Medical History',
      fields: [
        { name: 'condition', label: 'Condition', type: 'text', required: true, max: 48 },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'notes', label: 'Notes', type: 'textarea', max: 256 }
      ]
    },
    {
      key: 'vaccinations', icon: '', label: 'Vaccinations',
      fields: [
        { name: 'vaccine', label: 'Vaccine', type: 'text', required: true, max: 64 },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'vet', label: 'Vet/Clinic', type: 'text', max: 60 }
      ]
    },
    {
      key: 'prescriptions', icon: '', label: 'Prescriptions',
      fields: [
        { name: 'medicine', label: 'Medicine', type: 'text', required: true, max: 64 },
        { name: 'dosage', label: 'Dosage', type: 'text', required: true, max: 40 },
        { name: 'start', label: 'Start Date', type: 'date', required: true },
        { name: 'end', label: 'End Date', type: 'date' }
      ]
    },
    {
      key: 'visits', icon: '', label: 'Vet Visits',
      fields: [
        { name: 'reason', label: 'Reason', type: 'text', required: true, max: 64 },
        { name: 'date', label: 'Visit Date', type: 'date', required: true },
        { name: 'vet', label: 'Vet/Clinic', type: 'text', max: 60 },
        { name: 'outcome', label: 'Outcome', type: 'textarea', max: 260 }
      ]
    }
  ];

  // UI state for modals and form actions
  const [modal, setModal] = useState({
    type: null, // 'add'|'edit'|'delete'
    sectionKey: null, // eg 'history'
    idx: null,        // for edit/delete
    values: {}
  });
  const [showAll, setShowAll] = useState(false);

  // Get/ensure the selected pet's records exist
  function getEmptyRecords() {
    return { history: [], vaccinations: [], prescriptions: [], visits: [] };
  }
  function getRecordsForSelected() {
    if (!selectedPet) return getEmptyRecords();
    return (medical && medical[selectedPet.id]) ? medical[selectedPet.id] : getEmptyRecords();
  }
  const records = getRecordsForSelected();

  // ---- CRUD ACTIONS ----
  // Open modal for a CRUD op
  function openModal(type, sectionKey, idx = null, values = {}) {
    setModal({ type, sectionKey, idx, values });
  }
  // Close modal
  function closeModal() {
    setModal({ type: null, sectionKey: null, idx: null, values: {} });
  }
  // Handle create/update
  function handleSave(e) {
    e.preventDefault();
    const { type, sectionKey, idx, values } = modal;
    const sectionConf = sections.find(sec => sec.key === sectionKey);
    // Prepare new item from fields
    let newItem = {};
    for (const f of sectionConf.fields) {
      newItem[f.name] = values[f.name] || "";
    }

    // Validation: Required fields
    for (const f of sectionConf.fields) {
      if (f.required && !newItem[f.name]) {
        return; // Required missing - skip save
      }
    }
    // Limit field lengths
    for (const f of sectionConf.fields) {
      if (f.max && typeof newItem[f.name] === "string" && newItem[f.name].length > f.max) {
        newItem[f.name] = newItem[f.name].slice(0, f.max);
      }
    }

    // Do update
    let out = { ...records };
    let arr = [...out[sectionKey]];
    if (type === "add") {
      arr.push({ ...newItem });
    } else if (type === "edit" && idx !== null) {
      arr[idx] = { ...newItem };
    }
    out[sectionKey] = arr;
    setMedicalRecords(selectedPet.id, out);
    closeModal();
  }
  // Set form value in modal state
  function updateModalValue(name, value) {
    setModal(prev => ({ ...prev, values: { ...prev.values, [name]: value } }));
  }
  // Open delete
  function handleDelete() {
    const { idx, sectionKey } = modal;
    let out = { ...records };
    let arr = [...out[sectionKey]];
    if (idx !== null) {
      arr.splice(idx, 1);
    }
    out[sectionKey] = arr;
    setMedicalRecords(selectedPet.id, out);
    closeModal();
  }

  // --- Section Table / List rendering ---
  function renderSection(section, items) {
    return (
      <div className="pch-med-section" key={section.key} style={{
        background: "#f7faf5",
        borderRadius: 15,
        padding: 16,
        marginBottom: 18,
        boxShadow: "0 1px 8px #879d8541"
      }}>
        <div style={{display:'flex',alignItems:'center',marginBottom:8}}>
          <span style={{fontSize:'1.24em',marginRight:8}} role="img" aria-label={section.label}>{section.icon}</span>
          <span style={{fontWeight:600, fontSize:"1.11em", color:"var(--pch-accent)"}}>{section.label}</span>
          <span style={{flex:1}}></span>
          <button className="btn"
            style={{fontSize: "0.98em", padding: "4px 18px", marginLeft: 7, background:"var(--kavia-orange)"}}
            onClick={() => openModal("add",section.key)}
          >
            + Add
          </button>
        </div>
        {items.length === 0 ? (
          <div className="pch-widget-placeholder" style={{fontSize:"1.04em",color:"var(--text-secondary)",margin:'18px 0 4px 0',paddingBottom:2}}>
            No records yet.
          </div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table style={{width:"100%",background:"#fff",borderRadius:8,boxShadow:"0 1px 5px #879d8529", borderCollapse:'separate', borderSpacing:0}}>
              <thead>
                <tr>
                  {section.fields.map(f=>(
                    <th key={f.name} style={{textAlign:"left",padding:"7px 7px",fontWeight:500, color:"var(--pch-primary)",borderBottom:'1px solid var(--pch-secondary)',fontSize:"0.97em"}}>{f.label}</th>
                  ))}
                  <th style={{width:80}}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx)=>(
                  <tr key={idx} style={{background:idx%2 ? "#fafae5" : "#f2f6ed"}}>
                    {section.fields.map(f=>(
                      <td key={f.name} style={{padding:"7px 7px",fontSize:"0.99em",maxWidth:180,overflow:'hidden',textOverflow:'ellipsis'}}>
                        {item[f.name]}
                      </td>
                    ))}
                    <td>
                      <button className="btn" style={{fontSize:"0.92em", padding:"3.5px 10px", background:"#879d85",marginRight:3}}
                        onClick={()=>openModal("edit",section.key,idx, item)}>
                        Edit
                      </button>
                      <button className="btn" style={{fontSize:"0.92em",padding:"3.5px 10px",background:"#e96565"}}
                        onClick={()=>openModal("delete",section.key,idx)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // --- Modal for add/edit ---
  function renderFormModal() {
    if (!modal.type || !modal.sectionKey) return null;
    const sectionConf = sections.find(sec=>sec.key===modal.sectionKey);
    if(!sectionConf) return null;
    const isEdit = modal.type === "edit";
    return (
      <div className="pch-modal-overlay" tabIndex={-1} aria-modal="true" role="dialog"
        style={{
          position: 'fixed',
          left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 999,
          background: 'rgba(42,46,38,0.17)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 36px 0 #879d8581',
          padding: '28px 28px 18px 28px',
          minWidth: 290, maxWidth: 370,
          textAlign: 'center',
          position:'relative'
        }}>
          <button aria-label="Close" style={{
            position: 'absolute', right: 11, top: 9, background: 'transparent', border: 'none', color: 'var(--pch-accent)', fontSize: '1.28em', cursor: 'pointer'
          }} onClick={closeModal}>&times;</button>
          <h3 style={{ margin: '0 0 12px', color: 'var(--kavia-orange)' }}>{isEdit ? "Edit" : "Add"} {sectionConf.label}</h3>
          <form style={{display:'flex',flexDirection:'column',gap:8,alignItems:'center'}} onSubmit={handleSave}>
            {sectionConf.fields.map(f => (
              <div key={f.name} style={{width:'100%', marginBottom:4}}>
                <label>
                  <span style={{fontSize:"0.98em", color:"var(--pch-accent)"}}>{f.label} {f.required?"*":""}</span><br/>
                  {f.type === "textarea" ? (
                    <textarea
                      name={f.name}
                      value={modal.values[f.name] || ""}
                      maxLength={f.max}
                      required={!!f.required}
                      onChange={e=>updateModalValue(f.name, e.target.value)}
                      style={{width:"100%",minHeight:52,padding:"6px 10px",borderRadius:6,border:'1.4px solid var(--pch-secondary)',background:'#fafcf9',color:'var(--pch-accent)',fontSize:"1em"}}
                    />
                  ):(
                    <input
                      type={f.type}
                      name={f.name}
                      value={modal.values[f.name] || ""}
                      maxLength={f.max}
                      required={!!f.required}
                      onChange={e=>updateModalValue(f.name, e.target.value)}
                      style={{width:"100%",padding:"7px 10px",borderRadius:6,border:'1.4px solid var(--pch-secondary)',background:'#fafcf9',color:'var(--pch-accent)',fontSize:"1em"}}
                    />
                  )}
                </label>
              </div>
            ))}
            <div style={{display:'flex',gap:14,marginTop:13,justifyContent:'center'}}>
              <button type="submit" className="btn btn-large" style={{fontWeight:500,minWidth:98}}>
                {isEdit ? "Save Changes" : "Add"}
              </button>
              <button type="button" className="btn btn-large" style={{background:'#bdbdbd',color:'#4e5439'}} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- Modal for delete ---
  function renderDeleteModal() {
    if (!(modal.type === "delete" && modal.sectionKey)) return null;
    const sectionConf = sections.find(sec=>sec.key===modal.sectionKey);
    return (
      <div className="pch-modal-overlay" tabIndex={-1} aria-modal="true" role="dialog"
        style={{
          position: 'fixed',
          left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 999,
          background: 'rgba(42,46,38,0.17)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
        <div style={{
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 8px 36px 0 #879d8581',
          padding: '24px 23px 11px 23px',
          minWidth: 265, maxWidth: 350,
          textAlign: 'center',
          position:'relative'
        }}>
          <button aria-label="Close" style={{
            position: 'absolute', right: 12, top: 10, background: 'transparent', border: 'none', color: 'var(--pch-accent)', fontSize: '1.2em', cursor: 'pointer'
          }} onClick={closeModal}>&times;</button>
          <h3 style={{ margin: '0 0 8px', color: '#e96565', fontWeight:600 }}>Delete {sectionConf.label.slice(0,-1)}</h3>
          <div style={{marginBottom:14}}>Are you sure you want to delete this record?</div>
          <div style={{display:'flex', gap:14, justifyContent:'center',marginTop:12}}>
            <button className="btn btn-large" style={{background:'#e96565'}} onClick={handleDelete}>
              Delete
            </button>
            <button className="btn btn-large" style={{background:'#e2dda6',color:'#554f23'}} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Pet picker control ---
  function renderPetPicker() {
    if (!pets || pets.length === 0) return null;
    return (
      <div style={{marginBottom:18, display:'flex', alignItems:'center', gap: 9}}>
        <span className="pch-widget-icon" style={{fontSize:'2em',marginRight:7}} role="img" aria-label="pet">🐾</span>
        <span style={{fontWeight:500, color:"var(--pch-accent)",marginRight:4}}>Pet:</span>
        <select
          value={selectedPet ? selectedPet.id : ""}
          style={{minWidth:110,padding:"5px 11px",borderRadius:7,border:'1.7px solid var(--pch-secondary)',fontSize:"1.08em",background:"#fff"}}
          onChange={e=>selectPet(Number(e.target.value))}
        >
          {pets.map(p=>(
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button
          className="btn"
          onClick={()=>setShowAll(val=>!val)}
          style={{marginLeft:12, background:showAll?'var(--pch-secondary)':'var(--pch-primary)',color:showAll?'#6a6102':'#fff',fontWeight:500}}
        >
          {showAll ? "Show Current Only" : "See All Pets"}
        </button>
      </div>
    );
  }

  // --- ALL PETS "summary table" (for admins/multi-pet owners)
  function renderAllPetsTable() {
    // Colapse all medical sections into display per pet
    return (
      <div style={{margin:'30px 0',padding:'14px 9px', borderRadius:14, background:'#fafcf9',boxShadow:'0 1px 12px #879d8579'}}>
        <h3 style={{color:"var(--pch-accent)",margin:'0 0 16px 0', fontWeight:600}}>All Pets - Medical Snapshots</h3>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', background:'#fff',borderRadius:7,boxShadow:"0 1px 5px #879d8538", borderCollapse:'separate', borderSpacing:0}}>
            <thead>
              <tr>
                <th style={{padding:"6px 10px",color:'var(--pch-primary)'}}>Pet</th>
                <th colSpan={4}># History</th>
                <th colSpan={4}># Vaccinations</th>
                <th colSpan={4}># Prescriptions</th>
                <th colSpan={4}># Vet Visits</th>
              </tr>
            </thead>
            <tbody>
              {pets.map(p=>(
                <tr key={p.id}>
                  <td style={{padding:"5px 7px",fontWeight:500}}>{p.name}</td>
                  <td style={{textAlign:'center'}} colSpan={4}>{(medical && medical[p.id]?.history?.length)||0}</td>
                  <td style={{textAlign:'center'}} colSpan={4}>{(medical && medical[p.id]?.vaccinations?.length)||0}</td>
                  <td style={{textAlign:'center'}} colSpan={4}>{(medical && medical[p.id]?.prescriptions?.length)||0}</td>
                  <td style={{textAlign:'center'}} colSpan={4}>{(medical && medical[p.id]?.visits?.length)||0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Main Content Render
  return (
    <div className="pch-widget" tabIndex={0} style={{margin:'auto', maxWidth: 920, minWidth:280, textAlign: 'left', padding:32}}>
      <div className="pch-widget-icon" style={{fontSize: '2.4em', marginBottom: 12}} role="img" aria-label="medical">💉</div>
      <h2 style={{color:'var(--pch-primary)', textAlign:"left"}}>Medical Records</h2>
      <div className="pch-main-subtitle" style={{marginBottom:22,fontSize:"1.06em"}}>Manage and track all your pets' health data in one place.</div>
      {renderPetPicker()}
      {showAll && renderAllPetsTable()}
      {!showAll && selectedPet && (
        <div>
          {sections.map(sec =>
            renderSection(sec, records[sec.key])
          )}
        </div>
      )}
      {!selectedPet && pets.length === 0 && (
        <div style={{textAlign:'center', padding:'2.3em 0', color:'var(--pch-accent)'}}>
          <b>No pets registered yet.</b><br/>
          Register a pet to manage medical records!
        </div>
      )}
      {renderFormModal()}
      {renderDeleteModal()}
    </div>
  );
}

export default MedicalRecords;
