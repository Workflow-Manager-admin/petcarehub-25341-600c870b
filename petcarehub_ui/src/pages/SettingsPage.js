import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
function SettingsPage() {
  const location = useLocation();

  // Display basic breadcrumbs for Settings and subpage context (optional)
  const getSubpageLabel = () => {
    if (location.pathname.endsWith('/settings')) return null;
    if (location.pathname.includes('/settings/support')) return 'Support / Help';
    if (location.pathname.includes('/settings/account/login')) return 'Account Login';
    if (location.pathname.includes('/settings/account/signup')) return 'Account Signup';
    return null;
  };
  const subLabel = getSubpageLabel();

  return (
    <div className="pch-widget" tabIndex={0} style={{margin: 'auto', maxWidth: 600, minWidth: 260, textAlign: 'center', padding: '2em 0'}}>
      <div style={{fontSize: '2.5em', marginBottom: 8}} role="img" aria-label="settings"></div>
      <h2 style={{marginBottom: subLabel ? '0.7em' : '0'}}>Settings</h2>
      {subLabel && (
        <div style={{fontSize: '1.2em', color: 'var(--kavia-orange)', fontWeight: 600, marginBottom: 18}}>
          {subLabel}
        </div>
      )}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
export default SettingsPage;
