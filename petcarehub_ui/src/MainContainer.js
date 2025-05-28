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
  return (
    <div className="pch-main-layout">
      <aside className="pch-sidebar" aria-label="Sidebar Navigation">
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
          <h1>
            Welcome to PetCareHub
            <span aria-label="paw" className="pch-main-paw-header" style={{marginLeft: 10}}>🐾</span>
          </h1>
          <p className="pch-main-subtitle">Your modern pet parenting dashboard</p>
        </header>
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
        <section className="pch-widget-section" aria-label="Dashboard Placeholders">
          {/* Pet Cards - visually engaging mock cards */}
          <div className="pch-widget pch-widget-highlight pch-pet-card">
            <div className="pch-pet-photo-mock">
              <span role="img" aria-label="cat" className="pch-pet-photo-emoji">🐱</span>
            </div>
            <h2 className="pch-pet-name">Luna</h2>
            <div className="pch-pet-details">
              <span>Breed: British Shorthair</span>
              <span>Age: 2</span>
            </div>
            <div className="pch-card-badge">Next vaccine: 15 May</div>
          </div>
          <div className="pch-widget pch-pet-card">
            <div className="pch-pet-photo-mock pch-pet-dog">
              <span role="img" aria-label="dog" className="pch-pet-photo-emoji">🐶</span>
            </div>
            <h2 className="pch-pet-name">Rex</h2>
            <div className="pch-pet-details">
              <span>Breed: Labrador</span>
              <span>Age: 5</span>
            </div>
            <div className="pch-card-badge">Next grooming: 20 May</div>
          </div>
          <div className="pch-widget pch-pet-card">
            <div className="pch-pet-photo-mock pch-pet-bird">
              <span role="img" aria-label="bird" className="pch-pet-photo-emoji">🐦</span>
            </div>
            <h2 className="pch-pet-name">Sunny</h2>
            <div className="pch-pet-details">
              <span>Breed: Parakeet</span>
              <span>Age: 1</span>
            </div>
            <div className="pch-card-badge">Healthy &amp; Cheerful!</div>
          </div>
        </section>
        <section className="pch-widget-section" style={{marginTop: 44}} aria-label="Action Containers">
          {/* Modern & visually engaging actionable containers, placeholders only */}
          <div className="pch-widget pch-widget-cta" tabIndex={0}>
            <div className="pch-widget-icon" role="img" aria-label="routine reminder">⏰</div>
            <div>
              <h2>Today's Routines</h2>
              <div className="pch-widget-placeholder">Morning walk at 8:00<br/>Feed all pets by 7:00</div>
            </div>
            <button className="btn btn-large" style={{marginTop:'18px'}} aria-label="View Routines">View more</button>
          </div>
          <div className="pch-widget pch-widget-cta" tabIndex={0}>
            <div className="pch-widget-icon" role="img" aria-label="add pet">➕</div>
            <div>
              <h2>Add a New Pet</h2>
              <div className="pch-widget-placeholder">Register your newest companion!</div>
            </div>
            <button className="btn btn-large" style={{marginTop:'18px'}} aria-label="Add Pet">Start Now</button>
          </div>
          <div className="pch-widget pch-widget-cta" tabIndex={0}>
            <div className="pch-widget-icon" role="img" aria-label="notifications">🔔</div>
            <div>
              <h2>Reminders</h2>
              <div className="pch-widget-placeholder">No urgent tasks – you’re caught up!</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainContainer;
