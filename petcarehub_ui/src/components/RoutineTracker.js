import React from 'react';

// PUBLIC_INTERFACE
/** 
 * Minimal visually attractive placeholder for Routines (RoutineTracker).
 * Uses icon and sample summary.
 */
function RoutineTracker() {
  return (
    <div className="pch-widget" tabIndex={0} style={{margin:'auto', maxWidth: 420, textAlign: 'center'}}>
      <div className="pch-widget-icon" style={{fontSize: '2.5em', marginBottom: 12}} role="img" aria-label="routine">⏰</div>
      <h2>Today's Routines</h2>
      <div className="pch-widget-placeholder" style={{fontSize: '1.04em'}}>
        <ul style={{listStyle: 'none', padding: 0}}>
          <li>🐕 Walk Luna & Rex – 8:00 AM</li>
          <li>🍖 Feed all pets – 7:00 AM</li>
          <li>🎲 Playtime – 6:00 PM</li>
        </ul>
      </div>
    </div>
  );
}

export default RoutineTracker;
