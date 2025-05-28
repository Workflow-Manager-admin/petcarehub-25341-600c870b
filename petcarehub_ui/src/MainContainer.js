import React, { useState } from 'react';
import './App.css';

// Placeholder imports
import PetList from './components/PetList';
import RoutineTracker from './components/RoutineTracker';
import MedicalRecords from './components/MedicalRecords';
import Reminders from './components/Reminders';
import Settings from './components/Settings';

/**
 * PUBLIC_INTERFACE
 * MainContainer is the primary layout wrapper for PetCareHub. 
 * It features a responsive, modern sidebar and a beautiful dashboard with engaging widgets and graphic placeholders.
 */
function MainContainer() {
  // Track selected navigation tab
  const [active, setActive] = useState('Pets');

  // PETS and MEDICAL STATEFUL DATA
  const [pets, setPets] = useState([]); // [{id, name, age, breed, ...}]
  // Track the currently "selected" pet by id (for Medical section) - we'll default to first pet if available
  const [selectedPetId, setSelectedPetId] = useState(null);

  // Dictionary of petId to their medical records (scoped per pet)
  const [medicalRecords, setMedicalRecords] = useState({}); // {petId: { history: [...], vaccinations: [...], prescriptions: [...], visits: [...] }}

  // Update Pets (CRUD performed in PetList, flows up and down)
  function handlePetsChange(newPets) {
    setPets(newPets);
    // If a pet is deleted, and it was selected, update selectedPetId to another or null
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

  // List of section mappings
  const navSections = [
    { key: 'Pets', icon: '🐶', label: 'Pets' },
    { key: 'Routines', icon: '⏰', label: 'Routines' },
    { key: 'Medical', icon: '💉', label: 'Medical' },
    { key: 'Reminders', icon: '🔔', label: 'Reminders' },
    { key: 'Settings', icon: '⚙️', label: 'Settings' },
  ];
  // Returns the active placeholder
  function getActiveSection(tab) {
    switch(tab) {
      case 'Pets':
        // Propagate pet state to PetList for CRUD operations
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
        // Only show MedicalRecords if pets exist
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
        return <Reminders />;
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

  // Update selectedPetId if pets are loaded but selectedPetId is null
  React.useEffect(() => {
    if (pets.length && (selectedPetId === null || !pets.find(p => p.id === selectedPetId))) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  return (
    <div className="pch-main-layout">
      <aside className="pch-sidebar" aria-label="Sidebar Navigation">
        <div className="pch-sidebar-logo">
          <span role="img" aria-label="paw" className="pch-logo-icon">🐾</span>
          <span className="pch-logo-title">PetCareHub</span>
        </div>
        <nav className="pch-nav">
          {navSections.map(nav => (
            <a
              key={nav.key}
              href="#"
              className={`pch-nav-link${active === nav.key ? ' active' : ''}`}
              onClick={e => { e.preventDefault(); setActive(nav.key); }}
              tabIndex={0}
              aria-current={active === nav.key ? 'page' : undefined}
            >
              <span className="pch-nav-icon" role="img" aria-label={nav.label.toLowerCase()}>{nav.icon}</span>
              {nav.label}
            </a>
          ))}
        </nav>
        <footer className="pch-sidebar-footer">
          <span>© FurEverCare</span>
        </footer>
      </aside>
      <main className="pch-main-content">
        <header className="pch-main-header">
          <h1>
            Welcome to PetCareHub
            <span aria-label="paw" className="pch-main-paw-header" style={{marginLeft: 10}}>🐾</span>
          </h1>
          <p className="pch-main-subtitle">Your modern pet parenting dashboard</p>
        </header>
        {/* Render summary highlights only on dashboard (Pets) */}
        {active === 'Pets' && (
          <>
            <section className="pch-dashboard-summary" aria-label="Summary Highlights">
              <div className="pch-summary-highlight pch-summary-pets">
                <span className="pch-summary-graphic" role="img" aria-label="pets">🐱🐶</span>
                <div>
                  <span className="pch-summary-title">Registered Pets</span>
                  <div className="pch-summary-main-value">{pets.length}</div>
                  <span className="pch-summary-desc">Track all your furry friends!</span>
                </div>
              </div>
              <div className="pch-summary-highlight pch-summary-routine">
                <span className="pch-summary-graphic" role="img" aria-label="routine">🗓️</span>
                <div>
                  <span className="pch-summary-title">Routines Today</span>
                  <div className="pch-summary-main-value">5</div>
                  <span className="pch-summary-desc">From walks to feeding times</span>
                </div>
              </div>
              <div className="pch-summary-highlight pch-summary-health">
                <span className="pch-summary-graphic" role="img" aria-label="health">🩺</span>
                <div>
                  <span className="pch-summary-title">Health Tasks</span>
                  <div className="pch-summary-main-value">2</div>
                  <span className="pch-summary-desc">Upcoming vet visits</span>
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
