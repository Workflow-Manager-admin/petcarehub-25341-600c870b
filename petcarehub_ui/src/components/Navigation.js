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
    { label: 'Dashboard', to: '/dashboard', icon: '' },
    {
      label: 'My Pets',
      icon: '',
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
      icon: '',
      to: '/appointments',
      dropdown: [
        { label: 'Manage', to: '/appointments/manage' },
        { label: 'Notes / Documents', to: '/notes' },
      ]
    },
    { label: 'Notifications', icon: '', to: '/notifications' },
    {
      label: 'Settings',
      icon: '',
      to: '/settings',
      dropdown: [
        { label: 'Settings Home', to: '/settings' },
        {
          label: 'Support',
          dropdown: [
            { label: 'Contact / Help', to: '/contact' },
            { label: 'About & Privacy', to: '/about' }
          ]
        },
        {
          label: 'Account',
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

  // Support rendering of up to 2-level nested dropdowns
  function renderNavItem(nav, level = 0) {
    // If there is a dropdown (children)
    if (nav.dropdown) {
      const isActive = activeDropdown === nav.label;
      return (
        <li
          className={`pch-navbar-dropdown${isActive ? ' open' : ''} pch-navbar-dropdown-level${level}`}
          key={nav.label}
          onMouseEnter={() => setActiveDropdown(nav.label)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          {nav.to ? (
            <span className="pch-navbar-link" tabIndex={0} aria-haspopup="true">
              {nav.icon && <span className="pch-nav-icon" role="img" aria-label={nav.label}>{nav.icon}</span>}
              {nav.label}
              <span className="pch-dropdown-arrow">{level === 0 ? '▼' : '▶'}</span>
            </span>
          ) : (
            <span className="pch-navbar-link" tabIndex={0} aria-haspopup="true">
              {nav.icon && <span className="pch-nav-icon" role="img" aria-label={nav.label}>{nav.icon}</span>}
              {nav.label}
              <span className="pch-dropdown-arrow">{level === 0 ? '▼' : '▶'}</span>
            </span>
          )}
          <ul className="pch-dropdown-menu pch-dropdown-menu-nest">
            {nav.dropdown.map((sub, i) =>
              sub.dropdown
                ? renderNavItem(sub, level + 1)
                : (
                  <li key={sub.to || sub.label + '-' + i}>
                    {sub.to ? (
                      <NavLink
                        className={({ isActive }) =>
                          "pch-navbar-link" + (isActive ? " active" : "")
                        }
                        to={sub.to}
                        aria-current={location.pathname === sub.to ? "page" : undefined}
                      >
                        {sub.label}
                      </NavLink>
                    ) : (
                      // Submenu heading (should not occur, but fallback)
                      <span className="pch-navbar-link">{sub.label}</span>
                    )}
                  </li>
                )
            )}
          </ul>
        </li>
      );
    } else {
      return (
        <li key={nav.to}>
          <NavLink
            to={nav.to}
            className={({ isActive }) =>
              "pch-navbar-link" + (isActive ? " active" : "")
            }
            aria-current={location.pathname === nav.to ? "page" : undefined}
          >
            {nav.icon && (
              <span className="pch-nav-icon" role="img" aria-label={nav.label}>{nav.icon}</span>
            )}
            {nav.label}
          </NavLink>
        </li>
      );
    }
  }

  return (
    <nav className="pch-navbar sticky" aria-label="Site main navigation">
      <div className="pch-navbar-container">
        <NavLink to="/" className="pch-navbar-logo" aria-label="PetCareHub Home">
          <span className="pch-logo-title">PetCareHub</span>
        </NavLink>
        <ul className="pch-navbar-links">
          {navConfig.map(nav => renderNavItem(nav, 0))}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
