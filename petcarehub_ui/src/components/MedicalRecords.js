import React from 'react';

// PUBLIC_INTERFACE
/** 
 * Minimal, stylish placeholder for Medical records.
 * Features an inviting health-related icon, matching UI.
 */
function MedicalRecords() {
  return (
    <div className="pch-widget" tabIndex={0} style={{margin:'auto', maxWidth: 420, textAlign: 'center'}}>
      <div className="pch-widget-icon" style={{fontSize: '2.4em', marginBottom: 12}} role="img" aria-label="medical">💉</div>
      <h2>Medical Records</h2>
      <div className="pch-widget-placeholder">
        <div style={{marginBottom: '0.5em'}}>Recent Health Updates:</div>
        <ul style={{listStyle: 'none', padding: 0}}>
          <li>🐱 Luna: Vaccine - May 15</li>
          <li>🐶 Rex: Grooming - May 20</li>
          <li>🐦 Sunny: Annual Checkup due</li>
        </ul>
      </div>
    </div>
  );
}

export default MedicalRecords;
