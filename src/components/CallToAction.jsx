// CallToAction.jsx
import React from 'react';
import Button from '../Dashboard/Button';

function CallToAction() {
  return (
    <section className="call-to-action">
      <h2>Take the Next Step Towards Sustainable Living</h2>
      <p>
        Join our community and start tracking your spending to maximize your positive impact on the environment.
      </p>
      <Button text="Join Now" onClick={() => window.location.href = '/signup'} />
    </section>
  );
}

export default CallToAction;
