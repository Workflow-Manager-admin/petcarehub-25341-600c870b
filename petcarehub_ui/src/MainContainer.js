import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

import PetList from './components/PetList';
import RoutineTracker from './components/RoutineTracker';
import MedicalRecords from './components/MedicalRecords';
import Reminders from './components/Reminders';
import Settings from './components/Settings';

/**
 * PUBLIC_INTERFACE
 * MainContainer is the primary layout wrapper for PetCareHub.
 * Now features a modern, top-positioned, glassy navbar and a responsive dashboard.
 */
function MainContainer() {
  // Track selected navigation tab
  const [active, setActive] = useState('Pets');

  // PETS and MEDICAL STATEFUL DATA
  const [pets, setPets] = useState([]); // [{id, name, age, breed, ...}]
  // Track the currently "selected" pet by id (for Medical section)
  const [selectedPetId, setSelectedPetId] = useState(null);

  // Dictionary of petId to their medical records (scoped per pet)
  const [medicalRecords, setMedicalRecords] = useState({}); // {petId: { history: [...], vaccinations: [...], prescriptions: [...], visits: [...] }}

  // -- REMINDERS STATE & HANDLERS --
  // Each reminder: {id, title, dueDate, petId, linkedType:'routine'|'medical', linkedId, notes, done:boolean}
  const [reminders, setReminders] = useState([]);

  // Reminders CRUD
  function handleAddReminder(reminder) {
    setReminders(prev => [
      ...prev,
      {
        ...reminder,
        id: Date.now() + Math.floor(Math.random() * 10000), // Ensure mostly unique
        done: false
      }
    ]);
  }
  function handleEditReminder(id, values) {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, ...values } : r)
    );
  }
  function handleDeleteReminder(id) {
    setReminders(prev => prev.filter(r => r.id !== id));
  }
  function handleToggleDoneReminder(id) {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, done: !r.done } : r)
    );
  }

  // Update reminders if pets are deleted -- clean up dangling reminders
  useEffect(() => {
    setReminders(prev => prev.filter(r =>
      r.petId == null ||
      pets.some(p => p.id === r.petId)
    ));
  }, [pets]);

  // Update selectedPetId if pets change
  useEffect(() => {
    if (pets.length && (selectedPetId === null || !pets.find(p => p.id === selectedPetId))) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  // Handler: Change pets (add/edit/delete)
  function handlePetsChange(newPets) {
    setPets(newPets);
    if (selectedPetId && !newPets.some(p => p.id === selectedPetId)) {
      setSelectedPetId(newPets.length ? newPets[0].id : null);
    }
  }

  // Handler: Called to change selected pet (e.g., from dropdown UI in medical records)
  function handleSelectPet(petId) {
    setSelectedPetId(petId);
  }

  // Handler: CRUD for medical records per pet
  function handleMedicalChange(petId, newMedical) {
    setMedicalRecords(prev => ({
      ...prev,
      [petId]: newMedical
    }));
  }

  // Dashboard Summary Panel Logic --------------------------

  // Helpers for reminders
  function getNextReminderUrgency(reminder) {
    if (!reminder?.dueDate || reminder.done) return "normal";
    const now = new Date();
    const due = new Date(reminder.dueDate);
    const diff = due - now;
    if (diff < 0) return "overdue";
    if (diff < 2 * 24 * 60 * 60 * 1000) return "soon"; // <2 days
    return "normal";
  }

  // Next reminder (soonest, not done, by dueDate)
  const nextReminder = useMemo(() => {
    const notDone = reminders.filter(r => !r.done && r.dueDate);
    if (notDone.length === 0) return null;
    notDone.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return notDone[0];
  }, [reminders]);

  // Format time difference for next reminder and medical events
  function formatTimeDistance(dueDate) {
    try {
      const now = new Date();
      const due = new Date(dueDate);
      let diff = due - now;
      let pfx = '';
      if (diff < 0) {
        diff = Math.abs(diff);
        pfx = '';
      }
      const min = 60 * 1000, hr = 60 * min, day = 24 * hr;
      if (diff < hr)
        return `${Math.round(diff / min)} min`;
      if (diff < day)
        return `${Math.round(diff / hr)} hr`;
      return `${Math.round(diff / day)} day${Math.round(diff / day) !== 1 ? 's' : ''}`;
    } catch {
      return '';
    }
  }

  // Routines today (demo uses static, can be replaced with state in routine feature)
  const todayRoutineCount = 0; // Replace with future routines state

  // Medical/Health - upcoming vet visits or vaccinations due "soon"
  // Scan all pets' med records for visits and vaccinations within next 30 days
  const dueHealthList = useMemo(() => {
    const now = new Date();
    const soonThreshold = 30 * 24 * 60 * 60 * 1000;
    let dueArr = [];
    pets.forEach(pet => {
      const med = medicalRecords[pet.id] || {};
      // Vet Visits
      (med.visits || []).forEach(v => {
        if (v.date) {
          const visitDate = new Date(v.date);
          const diff = visitDate - now;
          if (diff > 0 && diff < soonThreshold) {
            dueArr.push({ petId: pet.id, type: 'visit', label: `Vet Visit`, date: v.date, vet: v.vet });
          }
        }
      });
      // Upcoming vaccinations
      (med.vaccinations || []).forEach(vc => {
        if (vc.date) {
          const vaxDate = new Date(vc.date);
          const diff = vaxDate - now;
          if (diff > 0 && diff < soonThreshold) {
            dueArr.push({ petId: pet.id, type: 'vaccination', label: `Vaccination`, date: vc.date, name: vc.vaccine });
          }
        }
      });
    });
    return dueArr;
  }, [medicalRecords, pets]);

  const dueHealthCount = dueHealthList.length;

  // Label for medical/health summary
  let dueHealthLabel = '';
  if (dueHealthCount > 0) {
    // Give a quick summary - up to two events, show which pets
    dueHealthLabel = dueHealthList.slice(0,2)
      .map(ev => {
        const pname = pets.find(p => p.id === ev.petId)?.name || "";
        let dt = '';
        try { dt = new Date(ev.date).toLocaleDateString(undefined, {month:"short", day:"numeric"}); } catch {}
        return `${ev.label} for ${pname} (${dt})`;
      })
      .join(', ');
    if (dueHealthCount > 2) dueHealthLabel += ` and ${dueHealthCount-2} more`;
  } else {
    dueHealthLabel = "No health events soon";
  }

  // Nav sections
  const navSections = [
    { key: 'Pets', icon: '🐶', label: 'Pets' },
    { key: 'Routines', icon: '⏰', label: 'Routines' },
    { key: 'Medical', icon: '💉', label: 'Medical' },
    { key: 'Reminders', icon: '🔔', label: 'Reminders' },
    { key: 'Settings', icon: '⚙️', label: 'Settings' },
  ];

  // Section content
  function getActiveSection(tab) {
    switch(tab) {
      case 'Pets':
        return (
          <PetList
            pets={pets}
            setPets={handlePetsChange}
            selectedPetId={selectedPetId}
            setSelectedPetId={setSelectedPetId}
          />
        );
      case 'Routines':
        return <RoutineTracker />;
      case 'Medical':
        return (
          <MedicalRecords
            pets={pets}
            selectedPetId={selectedPetId ?? (pets.length ? pets[0].id : null)}
            selectPet={handleSelectPet}
            medical={medicalRecords}
            setMedicalRecords={handleMedicalChange}
          />
        );
      case 'Reminders':
        return (
          <Reminders
            reminders={reminders}
            pets={pets}
            routines={[]} // Routine linkage future
            medicalRecords={medicalRecords}
            onAdd={handleAddReminder}
            onEdit={handleEditReminder}
            onDelete={handleDeleteReminder}
            onToggleDone={handleToggleDoneReminder}
          />
        );
      case 'Settings':
        return <Settings />;
      default:
        return (
          <PetList
            pets={pets}
            setPets={handlePetsChange}
            selectedPetId={selectedPetId}
            setSelectedPetId={setSelectedPetId}
          />
        );
    }
  }

  // --- RENDER ---
  return (
    <div className="pch-main-layout top-navbar">
      {/* Top Navbar */}
      <nav className="pch-top-navbar" aria-label="Main Navigation">
        <div className="pch-navbar-logo">
          <span role="img" aria-label="paw" className="pch-logo-icon">🐾</span>
          <span className="pch-logo-title">PetCareHub</span>
        </div>
        <div className="pch-navbar-navlinks">
          {navSections.map(nav => (
            <a
              key={nav.key}
              href="#"
              className={`pch-navbar-link${active === nav.key ? ' active' : ''}`}
              onClick={e => { e.preventDefault(); setActive(nav.key); }}
              tabIndex={0}
              aria-current={active === nav.key ? 'page' : undefined}
            >
              <span className="pch-nav-icon" role="img" aria-label={nav.label.toLowerCase()}>{nav.icon}</span>
              {nav.label}
            </a>
          ))}
        </div>
        <div className="pch-navbar-footer">
          <span>© FurEverCare</span>
        </div>
      </nav>
      <main className="pch-main-content with-navbar">
        <header className="pch-main-header">
          <h1>
            Welcome to PetCareHub
            <span aria-label="paw" className="pch-main-paw-header" style={{marginLeft: 10}}>🐾</span>
          </h1>
          <p className="pch-main-subtitle">Your modern pet parenting dashboard</p>
        </header>
        {/* Dashboard summary only on Pets */}
        {active === 'Pets' && (
          <>
            {/* DASHBOARD SUMMARY CARDS - Responsive, state driven */}
            <section className="pch-dashboard-summary" aria-label="Summary Highlights">
              {/* Registered Pets */}
              <div className="pch-summary-highlight pch-summary-pets">
                <span className="pch-summary-graphic" role="img" aria-label="pets">🐱🐶</span>
                <div>
                  <span className="pch-summary-title">Registered Pets</span>
                  <div className="pch-summary-main-value">{pets.length}</div>
                  <span className="pch-summary-desc">Track all your furry friends!</span>
                </div>
              </div>
              {/* Next Reminder */}
              <div className="pch-summary-highlight pch-summary-reminder" tabIndex={0} style={{cursor:'pointer', transition:'box-shadow .18s'}}>
                <span className="pch-summary-graphic" role="img" aria-label="reminder">🔔</span>
                <div>
                  <span className="pch-summary-title">Next Reminder</span>
                  <div className="pch-summary-main-value" style={{
                    color: getNextReminderUrgency(nextReminder) === 'overdue'
                      ? '#e96565'
                      : getNextReminderUrgency(nextReminder) === 'soon'
                        ? '#e7c341'
                        : undefined
                  }}>
                    {nextReminder
                      ? <>
                          {nextReminder.title}
                          {getNextReminderUrgency(nextReminder) === 'overdue' && <span style={{marginLeft:6, color:'#b12f2f'}}>⚠️</span>}
                          {getNextReminderUrgency(nextReminder) === 'soon' && <span style={{marginLeft:6, color:'#a48a15'}}>⏰</span>}
                        </>
                      : <span style={{color:'#757832'}}>No reminders</span>
                    }
                  </div>
                  <span className="pch-summary-desc" style={{fontSize:'0.97em'}}>
                    {nextReminder
                      ? (nextReminder.dueDate && !nextReminder.done
                        ? (
                          <span>
                            {getNextReminderUrgency(nextReminder) === 'overdue'
                              ? `Overdue by ${formatTimeDistance(nextReminder.dueDate)}`
                              : `In ${formatTimeDistance(nextReminder.dueDate)}`}
                            {nextReminder.petId && pets.find(p=>p.id===nextReminder.petId)
                              ? <> for <b>{pets.find(p=>p.id===nextReminder.petId).name}</b></>
                              : null}
                          </span>
                        ) : <span>Completed</span>)
                      : "Stay on top of your pet care!"
                    }
                  </span>
                </div>
              </div>
              {/* Routines (static for demo; ready for future stateful wireup) */}
              <div className="pch-summary-highlight pch-summary-routine" tabIndex={0}>
                <span className="pch-summary-graphic" role="img" aria-label="routine">🗓️</span>
                <div>
                  <span className="pch-summary-title">Routines Today</span>
                  <div className="pch-summary-main-value">{typeof todayRoutineCount === "number" ? todayRoutineCount : 0}</div>
                  <span className="pch-summary-desc">From walks to feeding times</span>
                </div>
              </div>
              {/* Medical/Health summary */}
              <div className="pch-summary-highlight pch-summary-health" tabIndex={0}>
                <span className="pch-summary-graphic" role="img" aria-label="health">🧺</span>
                <div>
                  <span className="pch-summary-title">Health Tasks</span>
                  <div className="pch-summary-main-value">
                    {dueHealthCount > 0
                      ? dueHealthCount
                      : <span style={{color:'#757832'}}>None</span>
                    }
                  </div>
                  <span className="pch-summary-desc">
                    {dueHealthLabel}
                  </span>
                </div>
              </div>
            </section>
          </>
        )}
        <section
          className="pch-widget-section"
          aria-label={`${active} Main Section`}
          style={active === 'Pets' ? {} : {marginTop: 24}}
        >
          {getActiveSection(active)}
        </section>
      </main>
    </div>
  );
}

export default MainContainer;
