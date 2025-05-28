import React, { useState, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * Displays the list of registered pets with add, edit, view, and remove functionality.
 * All CRUD operations update local state. UI is styled per PetCareHub branding.
 */
function PetList() {
  const [pets, setPets] = useState([]);
  const [modal, setModal] = useState({ type: null, pet: null }); // type: null|'add'|'edit'|'view'|'delete'
  const [tempPhoto, setTempPhoto] = useState(null); // For display before saving photo upload
  const photoInputRef = useRef();

  // PUBLIC_INTERFACE
  function openModal(type, pet = null) {
    setModal({ type, pet });
    setTempPhoto(type === 'edit' && pet && pet.photo ? pet.photo : null);
  }

  // PUBLIC_INTERFACE
  function closeModal() {
    setModal({ type: null, pet: null });
    setTempPhoto(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  }

  // PUBLIC_INTERFACE
  function handleAddPet(e) {
    e.preventDefault();
    const form = e.target;
    const newPet = {
      id: Date.now(),
      name: form.name.value.trim(),
      breed: form.breed.value.trim(),
      age: form.age.value.trim(),
      photo: tempPhoto,
    };
    if (!newPet.name || !newPet.breed || !newPet.age) return; // Could show validation
    setPets([...pets, newPet]);
    closeModal();
  }

  // PUBLIC_INTERFACE
  function handleEditPet(e) {
    e.preventDefault();
    const form = e.target;
    const updatedPet = {
      ...modal.pet,
      name: form.name.value.trim(),
      breed: form.breed.value.trim(),
      age: form.age.value.trim(),
      photo: tempPhoto,
    };
    setPets(pets.map(p => (p.id === updatedPet.id ? updatedPet : p)));
    closeModal();
  }

  // PUBLIC_INTERFACE
  function handleDeletePet() {
    setPets(pets.filter(p => p.id !== modal.pet.id));
    closeModal();
  }

  // PUBLIC_INTERFACE
  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setTempPhoto(ev.target.result);
    reader.readAsDataURL(file);
  }

  // Small avatar rendering helper
  function PetAvatar({ photo, fallback, large }) {
    return photo ? (
      <img
        src={photo}
        alt="pet avatar"
        className="pch-pet-photo-mock"
        style={{
          width: large ? 92 : 67,
          height: large ? 92 : 67,
          objectFit: 'cover',
          borderRadius: '50%',
          border: '2.2px solid var(--pch-primary)',
          marginRight: large ? 0 : 9,
          marginBottom: large ? 12 : 7,
          background: 'linear-gradient(125deg, #e2dda6cc 65%, #ffffff 100%)',
        }}
      />
    ) : (
      <div
        className={`pch-pet-photo-mock${large ? ' pch-pet-dog' : ''}`}
        style={{ width: large ? 92 : 67, height: large ? 92 : 67, marginRight: large ? 0 : 9, marginBottom: large ? 12 : 7 }}
        aria-label="photo placeholder"
      >
        <span className="pch-pet-photo-emoji" role="img" aria-label="pet">
          {fallback}
        </span>
      </div>
    );
  }

  // Simple breed → emoji for fun fallback avatars
  function breedToEmoji(breed = "") {
    const b = breed.toLowerCase();
    if (b.includes('cat')) return '🐱';
    if (b.includes('bird')) return '🐦';
    if (b.includes('parrot')) return '🦜';
    if (b.includes('dog') || b.includes('lab')) return '🐶';
    if (b.includes('hamster')) return '🐹';
    if (b.includes('rabbit')) return '🐰';
    if (b.includes('fish')) return '🐟';
    return '🐾';
  }

  // Modal component
  function Modal({ show, children, title, onClose }) {
    if (!show) return null;
    return (
      <div className="pch-modal-overlay" tabIndex={-1} aria-modal="true" role="dialog"
        style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 999,
          background: 'rgba(42,46,38,0.17)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
        <div
          className="pch-modal-card"
          style={{
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 8px 36px 0 #879d8581',
            padding: '38px 32px 26px 32px',
            minWidth: 314,
            maxWidth: 370,
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <button aria-label="Close" className="pch-modal-close-btn" style={{
            position: 'absolute', right: 12, top: 10, background: 'transparent', border: 'none', color: 'var(--pch-accent)', fontSize: '1.4em', cursor: 'pointer'
          }} onClick={onClose}>&times;</button>
          {title && <h3 style={{ margin: '0 0 18px', color: 'var(--kavia-orange)' }}>{title}</h3>}
          {children}
        </div>
      </div>
    );
  }

  // Add / Edit Pet Modal/form
  function PetFormModal({ mode, pet, onSubmit, onClose, tempPhoto, onPhotoChange }) {
    const isEdit = mode === 'edit';
    return (
      <Modal show title={isEdit ? "Edit Pet Profile" : "Add New Pet"} onClose={onClose}>
        <form onSubmit={onSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <PetAvatar photo={tempPhoto} fallback={breedToEmoji(pet?.breed || '')} large />
          <label htmlFor="pet-photo" style={{ fontSize: '0.98em', color: 'var(--pch-accent)', marginBottom: 8, cursor: 'pointer' }}>
            <input
              id="pet-photo"
              name="photo"
              type="file"
              ref={photoInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onPhotoChange}
            />
            <span role="img" aria-label="camera" style={{ marginRight: 3 }}>📸</span>
            {tempPhoto ? "Change photo" : "Upload photo"}
          </label>
          <input
            autoFocus
            name="name"
            placeholder="Name"
            defaultValue={pet?.name || ''}
            style={inputStyle}
            maxLength={32}
            required
            aria-label="Pet Name"
          />
          <input
            name="breed"
            placeholder="Breed (e.g., Labrador)"
            defaultValue={pet?.breed || ''}
            style={inputStyle}
            maxLength={32}
            required
            aria-label="Pet Breed"
          />
          <input
            name="age"
            placeholder="Age in years"
            defaultValue={pet?.age || ''}
            style={inputStyle}
            type="number"
            min="0"
            max="99"
            required
            aria-label="Pet Age"
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 15 }}>
            <button type="submit" className="btn btn-large" style={{ fontWeight: 500, minWidth: 110 }}>
              {isEdit ? "Save Changes" : "Add Pet"}
            </button>
            <button type="button" className="btn btn-large" style={{ background: '#bdbdbd', color: '#4e5439' }} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  // Delete confirmation modal
  function DeleteModal({ pet, onConfirm, onClose }) {
    return (
      <Modal show title="Remove Pet?" onClose={onClose}>
        <div style={{ marginBottom: 14 }}>
          Are you sure you want to remove <b>{pet?.name}</b>?
        </div>
        <PetAvatar photo={pet?.photo} fallback={breedToEmoji(pet?.breed)} large />
        <div style={{ display: 'flex', gap: 12, marginTop: 22, justifyContent: 'center' }}>
          <button className="btn btn-large" style={{ background: 'var(--kavia-orange)' }} onClick={onConfirm}>
            Yes, remove
          </button>
          <button className="btn btn-large" style={{ background: '#e2dda6', color: '#554f23' }} onClick={onClose}>
            Cancel
          </button>
        </div>
      </Modal>
    );
  }

  // Pet detail modal (View)
  function ViewModal({ pet, onClose, onEdit, onDelete }) {
    return (
      <Modal show onClose={onClose}>
        <PetAvatar photo={pet?.photo} fallback={breedToEmoji(pet?.breed)} large />
        <div className="pch-pet-name" style={{ fontSize: '1.28em', margin: '0.6em 0 6px 0' }}>
          {pet?.name}
        </div>
        <div className="pch-pet-details" style={{ fontSize: '1.08em', marginBottom: 10 }}>
          <div>Breed: <b>{pet?.breed}</b></div>
          <div>Age: <b>{pet?.age} {pet?.age === '1' ? 'year' : 'years'}</b></div>
        </div>
        <div style={{ display: 'flex', gap: 11, justifyContent: 'center', marginTop: 21 }}>
          <button className="btn btn-large" style={{ background: 'var(--pch-secondary)', color: '#756f4d' }} onClick={() => { onClose(); onEdit(); }}>
            Edit
          </button>
          <button className="btn btn-large" style={{ background: '#e96258' }} onClick={() => { onClose(); onDelete(); }}>
            Remove
          </button>
        </div>
      </Modal>
    );
  }

  // Input styling for consistency
  const inputStyle = {
    margin: '5px 0',
    padding: '9px 13px',
    borderRadius: 6,
    border: '1.4px solid var(--pch-secondary)',
    fontSize: '1em',
    width: 210,
    background: '#fafcf9',
    color: 'var(--pch-accent)',
    outline: 'none'
  };

  // Widget Section: Main pet cards UI
  return (
    <div style={{ width: '100%', maxWidth: 870, margin: '0 auto', minHeight: 290 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, flex: 1, color: 'var(--pch-primary)', letterSpacing: '0.01em' }}>Your Pets</h2>
        <button className="btn btn-large" style={{ fontSize: "1.1em", fontWeight: 500, marginLeft: 14 }} onClick={() => openModal('add')}>
          + Add Pet
        </button>
      </div>
      {
        pets.length === 0 ? (
          <div className="pch-widget-placeholder" style={{ color: 'var(--pch-accent)', fontSize: '1.08em', padding: '1.7em', textAlign: 'center', opacity: 0.85, background: '#fafd f6', borderRadius: 13, marginTop: 18, border: '1.5px solid var(--pch-secondary)' }}>
            No pets registered yet.<br />Click <b>+ Add Pet</b> to register your first companion!
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(265px, 1fr))', gap: '28px 28px', marginTop: 2
          }}>
            {pets.map(pet => (
              <div key={pet.id} className="pch-widget pch-pet-card"
                tabIndex={0}
                style={{
                  minHeight: 175,
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  paddingLeft: 19,
                  paddingRight: 22,
                  background: 'var(--pch-card-bg)',
                  cursor: 'pointer',
                  border: '2.2px solid var(--pch-primary)',
                  boxShadow: '0 6px 26px 0 rgba(91,120,88,0.08)',
                  maxWidth: 340,
                  outline: 'none'
                }}
                aria-label={`View ${pet.name} profile`}
                onClick={() => openModal('view', pet)}
                onKeyDown={e => { if (e.key === "Enter") openModal('view', pet); }}
              >
                <PetAvatar photo={pet.photo} fallback={breedToEmoji(pet.breed)} />
                <div className="pch-pet-name">{pet.name}</div>
                <div className="pch-pet-details">
                  <span><b>{pet.breed}</b></span>
                  <span>{pet.age} {pet.age === '1' ? 'year' : 'years'}</span>
                </div>
                <span className="pch-card-badge" style={{
                  marginTop: 12,
                }}>{pet.breed.length > 16 ? pet.breed.slice(0, 15) + "…" : pet.breed}</span>
              </div>
            ))}
          </div>
        )
      }
      {/* Add Modal */}
      {
        modal.type === 'add' && (
          <PetFormModal
            mode="add"
            onSubmit={handleAddPet}
            onClose={closeModal}
            tempPhoto={tempPhoto}
            onPhotoChange={handlePhotoChange}
          />
        )
      }
      {/* Edit Modal */}
      {
        modal.type === 'edit' && (
          <PetFormModal
            mode="edit"
            pet={modal.pet}
            onSubmit={handleEditPet}
            onClose={closeModal}
            tempPhoto={tempPhoto}
            onPhotoChange={handlePhotoChange}
          />
        )
      }
      {/* View Modal */}
      {
        modal.type === 'view' && (
          <ViewModal
            pet={modal.pet}
            onClose={closeModal}
            onEdit={() => openModal('edit', modal.pet)}
            onDelete={() => openModal('delete', modal.pet)}
          />
        )
      }
      {/* Delete Modal */}
      {
        modal.type === 'delete' && (
          <DeleteModal pet={modal.pet} onConfirm={handleDeletePet} onClose={closeModal} />
        )
      }
    </div>
  );
}

export default PetList;
