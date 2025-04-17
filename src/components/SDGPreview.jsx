// src/components/SDGPreview.jsx
import React from 'react';
import Lottie from 'react-lottie';
import sdgAnimation from '../animations/sdg.json';
import Button from '../Dashboard/Button';

function SDGPreview() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: sdgAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <section className="sdg-preview">
      <div className="container">
        <h2 className="section-title">Our Impact Through the SDG Circle</h2>
        <div className="sdg-content">
          <div className="sdg-animation">
            <Lottie options={defaultOptions} height={250} width={250} />
          </div>
          <div className="sdg-description">
            <p>
              Our SDG Circle animation represents the interconnected nature of the United Nations Sustainable Development Goals. It visualizes how each financial decision contributes to environmental, social, and economic impacts.
            </p>
            <p>
              Each segment of the circle symbolizes a key goal—from clean energy and sustainable cities to responsible consumption. By tracking your spending, our platform identifies opportunities to drive positive change in your community and beyond.
            </p>
            <Button text="Learn More" onClick={() => alert('More information coming soon!')} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SDGPreview;
