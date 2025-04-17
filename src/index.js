import 'bootstrap/dist/css/bootstrap.min.css';
// If you need Bootstrap's JavaScript-based components (like modals, tooltips):
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './index.css'; // or wherever your main custom CSS is
// ...the rest of your imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // optional global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
