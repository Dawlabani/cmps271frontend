import React from 'react';
import Card from './Card';

function FeaturesSection() {
  return (
    <div className="features-section">
      <h2>Our Features</h2>
      <div className="features-cards">
        <Card title="Real-Time Tracking" value="Monitor your spending in real-time." />
        <Card title="Sustainability Score" value="Measure your eco-impact with precision." />
        <Card title="Eco-Rewards" value="Earn rewards for making green choices." />
      </div>
    </div>
  );
}

export default FeaturesSection;
