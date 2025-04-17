// src/components/SignUpForm.jsx
import React, { useState } from "react";
import "./SignUpForm.css";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api";  // Import the signup API call

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    location: "",
    password: "",
    bio: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Password validation: must include a capital letter, a number, and be between 9-25 characters.
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[0-9]).{9,25}$/;
    return regex.test(password);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must include a capital letter, a number, and be between 9-25 characters.";
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await signup(formData);
        alert("Signup successful! Please sign in.");
        navigate("/login");
      } catch (err) {
        console.error("Signup error:", err);
        setErrors({ form: err.response?.data?.error || "Signup failed." });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <div className="sign-up-form-container">
        <form onSubmit={handleSubmit} className="sign-up-form">
          <h1>Sign Up</h1>
          {errors.form && <p className="error-text">{errors.form}</p>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              placeholder="Enter your location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              rows="3"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
            />
          </div>
          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
