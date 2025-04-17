// src/components/ImpactOverview.jsx
import React from 'react';
import './ImpactOverview.css';

function ImpactOverview() {
  return (
    <section className="impact-overview">
      <h2>Your Sustainable Impact</h2>
      <p>
        Learn how your everyday choices contribute to a healthier planet 
        and a more equitable society.
      </p>
      <div className="impact-stats">
        <div className="impact-card">
          <h3>CO₂ Reduced</h3>
          <p>120 kg</p>
          <small>this month</small>
        </div>
        <div className="impact-card">
          <h3>Water Saved</h3>
          <p>300 L</p>
          <small>through eco-friendly actions</small>
        </div>
        <div className="impact-card">
          <h3>Charitable Donations</h3>
          <p>$80</p>
          <small>directed to green causes</small>
        </div>
      </div>
    </section>
  );
}

export default ImpactOverview;
