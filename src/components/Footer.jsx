import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} SDG Finance. All rights reserved.</p>
      <div className="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </footer>
  );
}

export default Footer;
