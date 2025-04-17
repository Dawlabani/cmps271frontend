// src/components/SignInForm.jsx
import React, { useState } from 'react';
import './SignInForm.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';  // Import our API login function

const SignInForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login(formData.email, formData.password);
      // Store token in localStorage for subsequent API requests
      localStorage.setItem('token', response.data.token);
      // Redirect to a protected route, e.g., dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">

        {/* Catchphrase Box */}
        <div className="catchphrase-container">
          <h1 className="big-headline">Unlock Your Financial Future</h1>
        </div>

        {/* Sign In Title */}
        <h2>Sign In</h2>

        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="submit-btn">Sign In</button>
      </form>
    </div>
  );
};

export default SignInForm;
