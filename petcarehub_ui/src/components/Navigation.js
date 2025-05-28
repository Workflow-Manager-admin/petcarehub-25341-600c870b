import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navigation.css';

// PUBLIC_INTERFACE
/**
 * Modern sticky top navigation bar with dropdowns for major categories and routes.
 * Categories: Dashboard, Pet Profile, Health, Diet/Nutrition, Activity, Appointments, Documents, Notifications, Settings, Contact/Help, About/Privacy, Auth
 */
function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Dropdown structure for 13+ core sections.
  const navConfig = [
    { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
    {
      label: 'My Pets',
      icon: '🐾',
      to: '/pets',
      dropdown: [
        { label: 'Profile', to: '/pet-profile' },
        { label: 'Health Tracker', to: '/health' },
        { label: 'Diet & Nutrition', to: '/diet' },
        { label: 'Activity', to: '/activity' },
      ]
    },
    {
      label: 'Appointments',
      icon: '📅',
      to: '/appointments',
      dropdown: [
        { label: 'Manage', to: '/appointments' },
        { label: 'Notes / Documents', to: '/notes' },
      ]
    },
    { label: 'Notifications', icon: '🔔', to: '/notifications' },
    {
      label: 'Settings',
      icon: '⚙️',
      to: '/settings',
      dropdown: [
        { label: 'Settings Home', to: '/settings' },
        {
          label: 'Support',
          to: '/contact',
          dropdown: [
            { label: 'Contact / Help', to: '/contact' },
            { label: 'About & Privacy', to: '/about' }
          ]
        },
        {
          label: 'Account',
          to: '/auth',
          dropdown: [
            { label: 'Login', to: '/auth/login' },
            { label: 'Sign Up', to: '/auth/signup' }
          ]
        }
      ]
    }
  ];

  // Close dropdowns on route change
  React.useEffect(() => setActiveDropdown(null), [location]);

  return (
    <nav className="pch-navbar sticky" aria-label="Site main navigation">
      <div className="pch-navbar-container">
        <NavLink to="/" className="pch-navbar-logo" aria-label="PetCareHub Home">
          <span role="img" aria-label="paw" className="pch-logo-icon">🐾</span>
          <span className="pch-logo-title">PetCareHub</span>
        </NavLink>
        <ul className="pch-navbar-links">
          {navConfig.map(nav =>
            nav.dropdown ? (
              <li
                className={`pch-navbar-dropdown${activeDropdown === nav.label ? ' open' : ''}`}
                key={nav.label}
                onMouseEnter={() => setActiveDropdown(nav.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span className="pch-navbar-link" tabIndex={0} aria-haspopup="true">
                  <span className="pch-nav-icon" role="img" aria-label={nav.label}>{nav.icon}</span>
                  {nav.label}
                  <span className="pch-dropdown-arrow">▼</span>
                </span>
                <ul className="pch-dropdown-menu">
                  {nav.dropdown.map(sub =>
                    <li key={sub.to}>
                      <NavLink
                        className={({ isActive }) =>
                          "pch-navbar-link" + (isActive ? " active" : "")
                        }
                        to={sub.to}
                        aria-current={location.pathname === sub.to ? "page" : undefined}
                      >
                        {sub.label}
                      </NavLink>
                    </li>
                  )}
                </ul>
              </li>
            ) : (
              <li key={nav.to}>
                <NavLink
                  to={nav.to}
                  className={({ isActive }) =>
                    "pch-navbar-link" + (isActive ? " active" : "")
                  }
                  aria-current={location.pathname === nav.to ? "page" : undefined}
                >
                  <span className="pch-nav-icon" role="img" aria-label={nav.label}>{nav.icon}</span>
                  {nav.label}
                </NavLink>
              </li>
            )
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
