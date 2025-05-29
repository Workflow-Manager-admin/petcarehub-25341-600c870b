import React, { useState, useEffect } from 'react';
import { Outlet, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';

import PetList from './components/PetList';
import RoutineTracker from './components/RoutineTracker';
import MedicalRecords from './components/MedicalRecords';
import Reminders from './components/Reminders';
import Settings from './components/Settings';
import SettingsPage from './pages/SettingsPage';
import ContactHelp from './pages/ContactHelp';
import AboutPrivacy from './pages/AboutPrivacy';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PetProfilePage from './pages/PetProfilePage';

/**
 * PUBLIC_INTERFACE
 * MainContainer is the primary layout wrapper for PetCareHub's dashboard zone.
 * Handles state for dashboard resources. Routing and sticky top navigation now standardized.
 */
function MainContainer() {
  // PET and MEDICAL STATEFUL DATA
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState({});
  const [reminders, setReminders] = useState([]);

  function handleAddReminder(reminder) {
    setReminders(prev => [
      ...prev,
      {
        ...reminder,
        id: Date.now() + Math.floor(Math.random() * 10000),
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

  useEffect(() => {
    setReminders(prev => prev.filter(r =>
      r.petId == null || pets.some(p => p.id === r.petId)
    ));
  }, [pets]);
  useEffect(() => {
    if (pets.length && (selectedPetId === null || !pets.find(p => p.id === selectedPetId))) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);
  function handlePetsChange(newPets) {
    setPets(newPets);
    if (selectedPetId && !newPets.some(p => p.id === selectedPetId)) {
      setSelectedPetId(newPets.length ? newPets[0].id : null);
    }
  }
  function handleSelectPet(petId) {
    setSelectedPetId(petId);
  }
  function handleMedicalChange(petId, newMedical) {
    setMedicalRecords(prev => ({
      ...prev,
      [petId]: newMedical
    }));
  }

  return (
    <div className="pch-main-layout with-navbar">
      <Navigation />
      <main className="pch-main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <Dashboard
              pets={pets}
              reminders={reminders}
              selectedPetId={selectedPetId}
              setSelectedPetId={setSelectedPetId}
              medicalRecords={medicalRecords}
              onAddReminder={handleAddReminder}
              onEditReminder={handleEditReminder}
              onDeleteReminder={handleDeleteReminder}
              onToggleDoneReminder={handleToggleDoneReminder}
            />
          } />
          <Route path="/pets" element={
            <PetList
              pets={pets}
              setPets={handlePetsChange}
              selectedPetId={selectedPetId}
              setSelectedPetId={setSelectedPetId}
            />
          } />
          <Route path="/pet-profile" element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <PetProfilePage
                pets={pets}
                selectedPetId={selectedPetId}
                setSelectedPetId={setSelectedPetId}
                medicalRecords={medicalRecords}
                setMedicalRecords={handleMedicalChange}
              />
            </React.Suspense>
          } />
          <Route path="/health" element={
            <MedicalRecords
              pets={pets}
              selectedPetId={selectedPetId ?? (pets.length ? pets[0].id : null)}
              selectPet={handleSelectPet}
              medical={medicalRecords}
              setMedicalRecords={handleMedicalChange}
            />
          } />
          <Route path="/diet" element={<div>Diet & Nutrition Placeholder</div>} />
          <Route path="/activity" element={<div>Activity Placeholder</div>} />
          <Route path="/appointments" element={<div>Appointment Manager Placeholder</div>} />
          <Route path="/notes" element={<div>Notes / Documents Placeholder</div>} />
          <Route path="/notifications" element={
            <Reminders
              reminders={reminders}
              pets={pets}
              routines={[]}
              medicalRecords={medicalRecords}
              onAdd={handleAddReminder}
              onEdit={handleEditReminder}
              onDelete={handleDeleteReminder}
              onToggleDone={handleToggleDoneReminder}
            />
          } />

          {/* Settings and nested routes */}
          <Route path="/settings" element={<SettingsPage />}>
            <Route index element={<Settings />} />
            <Route path="support" element={<ContactHelp />} />
            <Route path="account/login" element={<Login />} />
            <Route path="account/signup" element={<Signup />} />
          </Route>
          {/* Backward compatibility redirects or fallbacks for old paths */}
          <Route path="/contact" element={<ContactHelp />} />
          <Route path="/about" element={<AboutPrivacy />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Routes>
        <Outlet />
      </main>
    </div>
  );
}

export default MainContainer;
