// src/App.jsx
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';

// Import pages
import HomePage from './HomePage';
import Dashboard from './Dashboard/Dashboard';
import BudgetPage from './Budget/BudgetPage';
import ProfilePage from './Profile/ProfilePage';
import RewardsPage from './Rewards/RewardsPage';
import ChatBot from './Chatbot/Chatbot';
import SignUpForm from './Profile/SignUpForm';
import SignInForm from './Profile/SignInForm';

function App() {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<SignInForm />} />
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
