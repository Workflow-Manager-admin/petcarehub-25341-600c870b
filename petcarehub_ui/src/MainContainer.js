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
        return <PetList />;
      case 'Routines':
        return <RoutineTracker />;
      case 'Medical':
        return <MedicalRecords />;
      case 'Reminders':
        return <Reminders />;
      case 'Settings':
        return <Settings />;
      default:
        return <PetList />;
    }
  }

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
                  <div className="pch-summary-main-value">3</div>
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
