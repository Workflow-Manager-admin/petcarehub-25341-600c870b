import React from 'react';

// PUBLIC_INTERFACE
/** 
 * Minimal, visually attractive placeholder for Settings.
 * Uses an inviting icon and sample config options.
 */
function Settings() {
  return (
    <div className="pch-widget" tabIndex={0} style={{margin:'auto', maxWidth: 400, textAlign: 'center'}}>
      <div className="pch-widget-icon" style={{fontSize: '2.6em', marginBottom: 12}} role="img" aria-label="settings"></div>
      <h2>Settings</h2>
      <div className="pch-widget-placeholder" style={{fontSize: '1.03em', margin: '0.7em 0 0'}}>
        <ul style={{listStyle: 'none', padding: 0}}>
          <li>Account Preferences</li>
          <li>Notification Settings</li>
          <li>Theme: Auto</li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;
