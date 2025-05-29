import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPaw,
  FaRegIdBadge,
  FaHeartbeat,
  FaBowlFood,
  FaRunning,
  FaCalendarAlt,
  FaFileAlt,
  FaBell,
  FaCog,
  FaLifeRing,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaHome,
  FaUserCog
} from "react-icons/fa";
import { MdPets, MdOutlineVaccines, MdOutlineFastfood, MdOutlineDirectionsRun } from "react-icons/md";
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

  // Logo and title link with slight style for flex
  const logo = (
    <Link to="/" className="nav-logo">
      <span role="img" aria-label="PetCareHub logo" className="pet-logo">
        <MdPets />
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
              <span className="nav-icon-lbl">
                <FaTachometerAlt className="nav-item-icon" /> Dashboard
              </span>
            </NavLink>
          </li>
          {/* My Pets Dropdown */}
          <li
            className="nav-dropdown"
            onMouseEnter={() => handleMenuEnter("mypets")}
            onMouseLeave={handleMenuLeave}
          >
            <span className="nav-link dropdown-toggle">
              <span className="nav-icon-lbl">
                <MdPets className="nav-item-icon" /> My Pets
              </span>
              <span className="dropdown-caret">▼</span>
            </span>
            {openMenu === "mypets" && (
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/mypets/profile" className="dropdown-link">
                    <span className="nav-icon-lbl">
                      <FaRegIdBadge className="nav-item-icon" /> Profile
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/mypets/health" className="dropdown-link">
                    <span className="nav-icon-lbl">
                      <MdOutlineVaccines className="nav-item-icon" /> Health Tracker
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/mypets/nutrition" className="dropdown-link">
                    <span className="nav-icon-lbl">
                      <MdOutlineFastfood className="nav-item-icon" /> Diet &amp; Nutrition
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/mypets/activity" className="dropdown-link">
                    <span className="nav-icon-lbl">
                      <MdOutlineDirectionsRun className="nav-item-icon" /> Activity
                    </span>
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
              <span className="nav-icon-lbl">
                <FaCalendarAlt className="nav-item-icon" /> Appointments
              </span>
              <span className="dropdown-caret">▼</span>
            </span>
            {openMenu === "appointments" && (
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/appointments/manage" className="dropdown-link">
                    <span className="nav-icon-lbl">
                      <FaCog className="nav-item-icon" /> Manage
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/appointments/notes" className="dropdown-link">
                    <span className="nav-icon-lbl">
                      <FaFileAlt className="nav-item-icon" /> Notes/Documents
                    </span>
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
              <span className="nav-icon-lbl">
                <FaBell className="nav-item-icon" /> Notifications
              </span>
            </NavLink>
          </li>
          {/* Settings Dropdown: Multi-level */}
          <li
            className="nav-dropdown"
            onMouseEnter={() => handleMenuEnter("settings")}
            onMouseLeave={handleMenuLeave}
          >
            <span
              className="nav-link dropdown-toggle"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={openMenu === "settings"}
            >
              <span className="nav-icon-lbl">
                <FaCog className="nav-item-icon" /> Settings
              </span>
              <span className="dropdown-caret">▼</span>
            </span>
            {openMenu === "settings" && (
              <ul className="dropdown-menu" role="menu" aria-label="Settings dropdown">
                <li>
                  <NavLink to="/settings" className="dropdown-link" role="menuitem">
                    <span className="nav-icon-lbl">
                      <FaHome className="nav-item-icon" />
                      Settings Home
                    </span>
                  </NavLink>
                </li>
                {/* Support Sub-dropdown */}
                <li
                  className="nav-subdropdown"
                  onMouseEnter={() => handleSubMenuEnter("settings", "support")}
                  onMouseLeave={() => handleSubMenuLeave("settings")}
                >
                  <span
                    className="dropdown-link dropdown-toggle"
                    tabIndex={0}
                    aria-haspopup="true"
                    aria-expanded={openSubMenu.settings === "support"}
                  >
                    <span className="nav-icon-lbl">
                      <FaLifeRing className="nav-item-icon" /> Support
                    </span>
                    <span className="dropdown-caret">▶</span>
                  </span>
                  {openSubMenu.settings === "support" && (
                    <ul className="dropdown-submenu" role="menu" aria-label="Support submenu">
                      <li>
                        <NavLink
                          to="/settings/support/contact"
                          className="dropdown-link"
                          role="menuitem"
                        >
                          <span className="nav-icon-lbl">
                            <FaUserCog className="nav-item-icon" /> Contact / Help
                          </span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/settings/support/about"
                          className="dropdown-link"
                          role="menuitem"
                        >
                          <span className="nav-icon-lbl">
                            <FaFileAlt className="nav-item-icon" /> About &amp; Privacy
                          </span>
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
                {/* Account Sub-dropdown */}
                <li
                  className="nav-subdropdown"
                  onMouseEnter={() => handleSubMenuEnter("settings", "account")}
                  onMouseLeave={() => handleSubMenuLeave("settings")}
                >
                  <span
                    className="dropdown-link dropdown-toggle"
                    tabIndex={0}
                    aria-haspopup="true"
                    aria-expanded={openSubMenu.settings === "account"}
                  >
                    <span className="nav-icon-lbl">
                      <FaUserCircle className="nav-item-icon" /> Account
                    </span>
                    <span className="dropdown-caret">▶</span>
                  </span>
                  {openSubMenu.settings === "account" && (
                    <ul className="dropdown-submenu" role="menu" aria-label="Account submenu">
                      <li>
                        <NavLink to="/login" className="dropdown-link" role="menuitem">
                          <span className="nav-icon-lbl">
                            <FaSignInAlt className="nav-item-icon" /> Login
                          </span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/signup" className="dropdown-link" role="menuitem">
                          <span className="nav-icon-lbl">
                            <FaUserPlus className="nav-item-icon" /> Sign Up
                          </span>
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
