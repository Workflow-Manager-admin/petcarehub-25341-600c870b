import React from 'react';

// PUBLIC_INTERFACE
/** 
 * Modern placeholder for Reminders with inviting icon and mock reminder list.
 */
function Reminders() {
  return (
    <div className="pch-widget" tabIndex={0} style={{margin:'auto', maxWidth: 420, textAlign: 'center'}}>
      <div className="pch-widget-icon" style={{fontSize: '2.4em', marginBottom: 12}} role="img" aria-label="reminder">🔔</div>
      <h2>Reminders</h2>
      <div className="pch-widget-placeholder">
        <div>No urgent tasks – you’re caught up! 🎉</div>
        <div style={{marginTop: '1em', opacity:0.72}}>
          <strong>Upcoming:</strong>
          <ul style={{listStyle:'none',padding:0}}>
            <li>Grooming for Rex – May 20</li>
            <li>Annual checkup for Sunny</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Reminders;
