import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { getProfile, updateProfile, getExpenses, getTotalRewards } from '../services/api';

function ProfilePage() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const defaultAvatar =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  // Profile state; initial values loaded from backend
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    location: '',
    bio: '',
    avatar: defaultAvatar,
    createdAt: null,
    points: 0,
    goals: [],
  });
  const [loading, setLoading] = useState(true);

  // New stats: number of expenses logged & rewards redeemed
  const [expenseCount, setExpenseCount] = useState(0);
  const [redeemedRewardCount, setRedeemedRewardCount] = useState(0);

  // Modal states
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);

  // New goal form state
  const [newGoal, setNewGoal] = useState({ title: '', progress: '' });

  // State for editing an existing goal
  const [editingGoalIndex, setEditingGoalIndex] = useState(null);
  const [editGoalData, setEditGoalData] = useState({ title: '', progress: '', achieved: false });

  // Define handleEditGoalInputChange to update goal edits
  const handleEditGoalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditGoalData({
      ...editGoalData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Fetch profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  // Fetch expense count and redeemed rewards count on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const expensesRes = await getExpenses();
        setExpenseCount(expensesRes.data.length);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      }
      try {
        const rewardsRes = await getTotalRewards();
        // Assuming the endpoint returns an object like { total: <number> }
        setRedeemedRewardCount(rewardsRes.data.total);
      } catch (error) {
        console.error("Failed to fetch redeemed rewards:", error);
      }
    };
    if (isLoggedIn) {
      fetchStats();
    }
  }, [isLoggedIn]);

  // Profile Editing Handlers
  const handleProfileInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
    }
  };

  const handleRemoveAvatar = () => {
    setProfile({ ...profile, avatar: defaultAvatar });
  };

  // Update profile (including bio and goals) on backend
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(profile);
      console.log('Profile updated:', response.data);
      setProfile(response.data);
      setIsEditProfileModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Add Goal Handlers
  const handleAddGoalSubmit = async (e) => {
    e.preventDefault();
    if (newGoal.title && newGoal.progress) {
      const updatedGoals = [...profile.goals, { ...newGoal, achieved: false }];
      const updatedProfile = { ...profile, goals: updatedGoals };
      try {
        const response = await updateProfile(updatedProfile);
        console.log('Goal added:', response.data);
        setProfile(response.data);
        setNewGoal({ title: '', progress: '' });
        setIsAddGoalModalOpen(false);
      } catch (error) {
        console.error("Failed to update profile with new goal:", error);
      }
    }
  };

  // Edit Goal Handlers
  const openEditGoalModal = (index) => {
    setEditingGoalIndex(index);
    setEditGoalData(profile.goals[index]);
    setIsEditGoalModalOpen(true);
  };

  const handleEditGoalSubmit = async (e) => {
    e.preventDefault();
    const updatedGoals = [...profile.goals];
    updatedGoals[editingGoalIndex] = editGoalData;
    const updatedProfile = { ...profile, goals: updatedGoals };
    try {
      const response = await updateProfile(updatedProfile);
      console.log('Goal updated:', response.data);
      setProfile(response.data);
      setIsEditGoalModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile after editing goal:", error);
    }
  };

  const handleRemoveGoalInEdit = async () => {
    if (window.confirm('Are you sure you want to remove this goal?')) {
      const updatedGoals = [...profile.goals];
      updatedGoals.splice(editingGoalIndex, 1);
      const updatedProfile = { ...profile, goals: updatedGoals };
      try {
        const response = await updateProfile(updatedProfile);
        console.log('Goal removed:', response.data);
        setProfile(response.data);
        setIsEditGoalModalOpen(false);
      } catch (error) {
        console.error("Failed to remove goal:", error);
      }
    }
  };

  // Sign Out Handler
  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location = '/login';
  };

  if (!isLoggedIn) {
    return (
      <div className="profile-page">
        <div className="profile-placeholder">
          <h2>Please Sign In</h2>
          <p>You need to sign in to view your profile.</p>
          <button className="btn signin-btn" onClick={() => (window.location = '/login')}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="profile-page"><p>Loading profile...</p></div>;
  }

  return (
    <div className="profile-page">
      <h1 className="main-heading">My Finance Dashboard</h1>
      <p className="main-subheading">Welcome to your personal finance portal</p>
      <div className="profile-dashboard">
        <div className="dashboard-left">
          <div className="profile-info-card glass-card">
            <div className="profile-info-header">
              <img src={profile.avatar} alt="Profile" className="profile-avatar" />
              <div>
                <h2 className="profile-name">{profile.name}</h2>
                <p className="profile-location">{profile.location}</p>
              </div>
            </div>
            <div className="profile-contact">
              <h3 className="contact-heading">Email</h3>
              <p className="profile-email">{profile.email}</p>
              <h3 className="contact-heading">Bio</h3>
              <p className="profile-bio">{profile.bio}</p>
            </div>
            <button className="btn edit-profile-btn" onClick={() => setIsEditProfileModalOpen(true)}>
              Edit Profile
            </button>
          </div>
          <div className="profile-eco glass-card">
            <p>
              Eco-conscious since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}!
              &nbsp;You currently have {profile.points} points.
            </p>
          </div>
        </div>
        <div className="dashboard-right">
          <div className="profile-stats glass-card">
            <h2>My Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Expenses Logged</h3>
                <p>{expenseCount}</p>
              </div>
              <div className="stat-card">
                <h3>Rewards Redeemed</h3>
                <p>{redeemedRewardCount}</p>
              </div>
            </div>
          </div>
          <div className="profile-goals glass-card">
            <h2>Goals & Milestones</h2>
            <div className="goals-list">
              {(Array.isArray(profile.goals) ? profile.goals : []).map((goal, idx) => (
                <div className="goal-item" key={idx}>
                  <div className="goal-text">
                    <h4>{goal.title}</h4>
                    <p>Progress: {goal.progress}</p>
                    {goal.achieved && <p className="goal-achieved">Achieved</p>}
                  </div>
                  <div className="goal-buttons">
                    <button className="btn goal-edit-btn" onClick={() => openEditGoalModal(idx)}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn add-goal-btn" onClick={() => setIsAddGoalModalOpen(true)}>
              Add Goal
            </button>
          </div>
          <div className="sign-out-card">
            <button className="sign-out-btn" onClick={handleSignOut} aria-label="Sign out of your account">
              Sign Out
            </button>
          </div>
        </div>
      </div>
      {isEditProfileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <form onSubmit={handleEditProfileSubmit} className="modal-form">
              <label>Name:</label>
              <input type="text" name="name" value={profile.name} onChange={handleProfileInputChange} required />
              <label>Email:</label>
              <input type="email" name="email" value={profile.email} onChange={handleProfileInputChange} required />
              <label>Location:</label>
              <input type="text" name="location" value={profile.location} onChange={handleProfileInputChange} required />
              <label>Bio:</label>
              <textarea name="bio" value={profile.bio} onChange={handleProfileInputChange} required></textarea>
              <label htmlFor="avatar-upload" style={{ cursor: 'pointer', color: 'var(--secondary)' }}>
                Change Profile Picture
              </label>
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              <button type="button" className="btn modal-submit-btn" onClick={handleRemoveAvatar}>
                Remove Profile Picture
              </button>
              <div className="modal-buttons">
                <button type="submit" className="btn modal-submit-btn">
                  Save Changes
                </button>
                <button type="button" className="btn modal-cancel-btn" onClick={() => setIsEditProfileModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAddGoalModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Goal</h3>
            <form onSubmit={handleAddGoalSubmit} className="modal-form">
              <label>Goal Title:</label>
              <input type="text" placeholder="Goal Title" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} required />
              <label>Progress:</label>
              <input type="text" placeholder="Progress" value={newGoal.progress} onChange={(e) => setNewGoal({ ...newGoal, progress: e.target.value })} required />
              <div className="modal-buttons">
                <button type="submit" className="btn modal-submit-btn">
                  Add Goal
                </button>
                <button type="button" className="btn modal-cancel-btn" onClick={() => setIsAddGoalModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditGoalModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Goal</h3>
            <form onSubmit={handleEditGoalSubmit} className="modal-form">
              <label>Goal Title:</label>
              <input type="text" name="title" value={editGoalData.title} onChange={handleEditGoalInputChange} required />
              <label>Progress:</label>
              <input type="text" name="progress" value={editGoalData.progress} onChange={handleEditGoalInputChange} required />
              <label>
                <input type="checkbox" name="achieved" checked={editGoalData.achieved} onChange={handleEditGoalInputChange} />{' '}
                Mark as Achieved
              </label>
              <div className="modal-buttons">
                <button type="submit" className="btn modal-submit-btn">
                  Save Changes
                </button>
                <button type="button" className="btn modal-cancel-btn" onClick={() => setIsEditGoalModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn modal-cancel-btn" onClick={handleRemoveGoalInEdit}>
                  Remove Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
