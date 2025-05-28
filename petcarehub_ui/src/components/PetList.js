import React from 'react';

// PUBLIC_INTERFACE
/** 
 * Minimal visually attractive placeholder for Pets (PetList).
 * Uses an inviting icon and sample content. 
 * Styled to fit PetCareHub's dashboard.
 */
function PetList() {
  return (
    <div className="pch-widget pch-widget-highlight" tabIndex={0} style={{margin:'auto', maxWidth: 450, textAlign: 'center'}}>
      <div className="pch-widget-icon" style={{fontSize: '2.7em', marginBottom: 12}} role="img" aria-label="pet">🐾</div>
      <h2 style={{marginTop: 0}}>Registered Pets</h2>
      <div className="pch-widget-placeholder" style={{fontSize: '1.1em'}}>
        Meet your companions!
        <ul style={{listStyle: 'none', padding: 0, margin: '14px 0 0 0'}}>
          <li>🐱 Luna (2y, British Shorthair)</li>
          <li>🐶 Rex (5y, Labrador)</li>
          <li>🐦 Sunny (1y, Parakeet)</li>
        </ul>
      </div>
    </div>
  );
}

export default PetList;
