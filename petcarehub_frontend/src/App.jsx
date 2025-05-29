import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import PetCareHubLandingPage from "./pages/PetCareHubLandingPage";

// Placeholder components for routes
const Placeholder = ({ label }) => (
  <div style={{ paddingTop: 85, textAlign: "center", color: "#656461" }}>
    <h1>{label}</h1>
    <p>Content coming soon...</p>
  </div>
);

// Define all routes mapped to their paths
const routeConfig = [
  { path: "/", element: <PetCareHubLandingPage /> },
  { path: "/dashboard", element: <Placeholder label="Dashboard" /> },
  { path: "/mypets/profile", element: <Placeholder label="My Pets: Profile" /> },
  { path: "/mypets/health", element: <Placeholder label="My Pets: Health Tracker" /> },
  { path: "/mypets/nutrition", element: <Placeholder label="My Pets: Diet & Nutrition" /> },
  { path: "/mypets/activity", element: <Placeholder label="My Pets: Activity" /> },
  { path: "/appointments/manage", element: <Placeholder label="Appointments: Manage" /> },
  { path: "/appointments/notes", element: <Placeholder label="Appointments: Notes/Documents" /> },
  { path: "/notifications", element: <Placeholder label="Notifications" /> },
  { path: "/settings", element: <Placeholder label="Settings Home" /> },
  { path: "/settings/support/contact", element: <Placeholder label="Support: Contact / Help" /> },
  { path: "/settings/support/about", element: <Placeholder label="Support: About & Privacy" /> },
  { path: "/login", element: <Placeholder label="Account: Login" /> },
  { path: "/signup", element: <Placeholder label="Account: Sign Up" /> }
];

function App() {
  return (
    <Router>
      <NavigationBar />
      <div style={{ marginTop: 62 }}>
        <Routes>
          {routeConfig.map((rc) => (
            <Route key={rc.path} path={rc.path} element={rc.element} />
          ))}
          {/* Redirect any unknown URL to home/landing */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
