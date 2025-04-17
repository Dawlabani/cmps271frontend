// src/components/EmpowermentSection.jsx
import React from 'react';
import './EmpowermentSection.css';

function EmpowermentSection() {
  return (
    <section className="empowerment-section">
      <h2>How We Empower You</h2>
      <p>
        Our platform helps you take control of your finances while making a
        positive impact on the world. From tracking expenses to earning
        eco-rewards, we provide the tools you need to live sustainably
        and prosperously.
      </p>
      <div className="empowerment-features">
        <div className="empowerment-card">
          <h3>Inclusive Tools</h3>
          <p>
            Whether you're a seasoned investor or just starting out,
            our platform welcomes everyone to take part in sustainable finance.
          </p>
        </div>
        <div className="empowerment-card">
          <h3>Community Support</h3>
          <p>
            Join a growing community of users who share tips and
            experiences to help each other thrive financially.
          </p>
        </div>
        <div className="empowerment-card">
          <h3>Global Impact</h3>
          <p>
            Every sustainable choice you make has a ripple effect—
            together, we can drive meaningful global change.
          </p>
        </div>
      </div>
    </section>
  );
}

export default EmpowermentSection;
