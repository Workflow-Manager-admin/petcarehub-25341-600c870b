import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./NavigationBar.css";

/**
 * PUBLIC_INTERFACE
 * NavigationBar: Responsive top navigation bar for PetCareHub
 * Features:
 * - Clickable logo/title (routes to PetCareHub landing page)
 * - Dropdowns: My Pets, Appointments, Settings (multi-level)
 * - Responsive design for mobile/desktop
 */
const NavigationBar = () => {
  // For controlling which dropdown/submenu is open
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState({});

  // Handlers for opening/closing menus
  const handleMenuEnter = (menu) => setOpenMenu(menu);
  const handleMenuLeave = () => setOpenMenu(null);

  const handleSubMenuEnter = (menu, sub) =>
    setOpenSubMenu((prev) => ({ ...prev, [menu]: sub }));
  const handleSubMenuLeave = (menu) =>
    setOpenSubMenu((prev) => ({ ...prev, [menu]: null }));

  // Logo and title link
  const logo = (
    <Link to="/" className="nav-logo">
      <span role="img" aria-label="PetCareHub logo" className="pet-logo">
        🐾
      </span>
      <span className="nav-title">PetCareHub</span>
    </Link>
  );

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {logo}

        <ul className="nav-menu">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Dashboard
            </NavLink>
          </li>

          {/* My Pets Dropdown */}
          <li
            className="nav-dropdown"
            onMouseEnter={() => handleMenuEnter("mypets")}
            onMouseLeave={handleMenuLeave}
          >
            <span className="nav-link dropdown-toggle">
              My Pets <span className="dropdown-caret">▼</span>
            </span>
            {openMenu === "mypets" && (
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/mypets/profile" className="dropdown-link">
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/mypets/health" className="dropdown-link">
                    Health Tracker
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/mypets/nutrition" className="dropdown-link">
                    Diet &amp; Nutrition
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/mypets/activity" className="dropdown-link">
                    Activity
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Appointments Dropdown */}
          <li
            className="nav-dropdown"
            onMouseEnter={() => handleMenuEnter("appointments")}
            onMouseLeave={handleMenuLeave}
          >
            <span className="nav-link dropdown-toggle">
              Appointments <span className="dropdown-caret">▼</span>
            </span>
            {openMenu === "appointments" && (
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/appointments/manage" className="dropdown-link">
                    Manage
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/appointments/notes" className="dropdown-link">
                    Notes/Documents
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Notifications
            </NavLink>
          </li>

          {/* Settings Dropdown: Multi-level */}
          <li
            className="nav-dropdown"
            onMouseEnter={() => handleMenuEnter("settings")}
            onMouseLeave={handleMenuLeave}
          >
            <span className="nav-link dropdown-toggle">
              Settings <span className="dropdown-caret">▼</span>
            </span>
            {openMenu === "settings" && (
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/settings" className="dropdown-link">
                    Settings Home
                  </NavLink>
                </li>
                <li
                  className="nav-subdropdown"
                  onMouseEnter={() => handleSubMenuEnter("settings", "support")}
                  onMouseLeave={() => handleSubMenuLeave("settings")}
                >
                  <span className="dropdown-link dropdown-toggle">
                    Support <span className="dropdown-caret">▶</span>
                  </span>
                  {openSubMenu.settings === "support" && (
                    <ul className="dropdown-submenu">
                      <li>
                        <NavLink
                          to="/settings/support/contact"
                          className="dropdown-link"
                        >
                          Contact / Help
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/settings/support/about"
                          className="dropdown-link"
                        >
                          About &amp; Privacy
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
                <li
                  className="nav-subdropdown"
                  onMouseEnter={() => handleSubMenuEnter("settings", "account")}
                  onMouseLeave={() => handleSubMenuLeave("settings")}
                >
                  <span className="dropdown-link dropdown-toggle">
                    Account <span className="dropdown-caret">▶</span>
                  </span>
                  {openSubMenu.settings === "account" && (
                    <ul className="dropdown-submenu">
                      <li>
                        <NavLink to="/login" className="dropdown-link">
                          Login
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/signup" className="dropdown-link">
                          Sign Up
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
