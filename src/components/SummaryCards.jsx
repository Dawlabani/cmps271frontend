import React from 'react';
import Card from './Card';

function SummaryCards() {
  return (
    <div className="summary-cards">
      <Card title="Monthly Budget" value="$2,500" />
      <Card title="Sustainability Score" value="82/100" />
      <Card title="Eco-Points" value="450" />
    </div>
  );
}

export default SummaryCards;
