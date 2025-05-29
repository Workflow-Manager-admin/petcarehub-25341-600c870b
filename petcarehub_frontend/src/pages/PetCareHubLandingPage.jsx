import React from "react";
import "./PetCareHubLandingPage.css";

/**
 * PUBLIC_INTERFACE
 * PetCareHubLandingPage: Main landing page for PetCareHub (home route)
 */
const PetCareHubLandingPage = () => (
  <div className="pch-landing">
    <h1>Welcome to PetCareHub</h1>
    <p>
      FurEverCare is your all-in-one solution to organize, track, and care for your pets.
      Register pets, manage activities, and never miss an important health event!
    </p>
    <img
      src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80"
      alt="Playful dog and cat"
      className="pch-landing-img"
    />
  </div>
);

export default PetCareHubLandingPage;
