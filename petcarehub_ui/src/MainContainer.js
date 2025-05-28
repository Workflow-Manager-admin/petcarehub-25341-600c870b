import React from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * MainContainer is the primary layout wrapper for PetCareHub. 
 * It features a fixed-height sidebar with navigation links
 * and a modern, visually-attractive main content area.
 */
function MainContainer() {
  return (
    <div className="pch-main-layout">
      <aside className="pch-sidebar">
        <div className="pch-sidebar-logo">
          <span role="img" aria-label="paw" className="pch-logo-icon">🐾</span>
          <span className="pch-logo-title">PetCareHub</span>
        </div>
        <nav className="pch-nav">
          <a href="#" className="pch-nav-link active">
            <span className="pch-nav-icon" role="img" aria-label="pets">🐶</span>
            Pets
          </a>
          <a href="#" className="pch-nav-link">
            <span className="pch-nav-icon" role="img" aria-label="calendar">⏰</span>
            Routines
          </a>
          <a href="#" className="pch-nav-link">
            <span className="pch-nav-icon" role="img" aria-label="medical">💉</span>
            Medical
          </a>
          <a href="#" className="pch-nav-link">
            <span className="pch-nav-icon" role="img" aria-label="reminder">🔔</span>
            Reminders
          </a>
          <a href="#" className="pch-nav-link">
            <span className="pch-nav-icon" role="img" aria-label="settings">⚙️</span>
            Settings
          </a>
        </nav>
        <footer className="pch-sidebar-footer">
          <span>© FurEverCare</span>
        </footer>
      </aside>
      <main className="pch-main-content">
        <header className="pch-main-header">
          <h1>Welcome to PetCareHub</h1>
          <p className="pch-main-subtitle">Your modern pet parenting dashboard</p>
        </header>
        <section className="pch-widget-section">
          {/* Placeholder for future Pet Cards, Routines, Health, etc. */}
          <div className="pch-widget pch-widget-highlight">
            <h2>Pets</h2>
            <div className="pch-widget-placeholder">Feature coming soon!</div>
          </div>
          <div className="pch-widget">
            <h2>Routines</h2>
            <div className="pch-widget-placeholder">Stay tuned...</div>
          </div>
          <div className="pch-widget">
            <h2>Medical</h2>
            <div className="pch-widget-placeholder">Soon you’ll track health here!</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainContainer;
