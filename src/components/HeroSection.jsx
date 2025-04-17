// HeroSection.jsx
import React from 'react';
import Button from '../Dashboard/Button';

function HeroSection() {
  return (
    <div className="hero-section">
      <video autoPlay loop muted className="hero-video">
        <source src="path_to_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-overlay">
        <h1>Empower your finances, impact the world</h1>
        <p>Transform every transaction into a step toward sustainability.</p>
        <Button 
          text="Get Started" 
          onClick={() => {
            const featuresSection = document.querySelector('.features-section');
            if (featuresSection) {
              window.scrollTo({ top: featuresSection.offsetTop, behavior: 'smooth' });
            }
          }} 
        />
      </div>
    </div>
  );
}

export default HeroSection;
