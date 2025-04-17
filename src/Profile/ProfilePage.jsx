import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import {
  getProfile,
  updateProfile,
  getExpenses,
  getTotalRewards,
} from '../services/api';

function ProfilePage() {
  /* ------------------------------------------------------------------
     Auth / defaults
  ------------------------------------------------------------------ */
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const defaultAvatar =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  /* ------------------------------------------------------------------
     React state
  ------------------------------------------------------------------ */
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
  const [expenseCount, setExpenseCount] = useState(0);
  const [redeemedRewardCount, setRedeemedRewardCount] = useState(0);

  /* modals */
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);

  /* goal forms */
  const [newGoal, setNewGoal] = useState({ title: '', progress: '' });
  const [editingGoalIndex, setEditingGoalIndex] = useState(null);
  const [editGoalData, setEditGoalData] = useState({
    title: '',
    progress: '',
    achieved: false,
  });

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  const normalizeGoals = (goalsData) => {
    if (Array.isArray(goalsData)) return goalsData;
    if (typeof goalsData === 'string') {
      try {
        const parsed = JSON.parse(goalsData);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  /* ------------------------------------------------------------------
     Effects – fetch profile & stats
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      try {
        const { data } = await getProfile();
        data.goals = normalizeGoals(data.goals);
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      try {
        const expensesRes = await getExpenses();
        setExpenseCount(expensesRes.data.length);
      } catch (err) {
        console.error('Failed to fetch expenses:', err);
      }
      try {
        const rewardsRes = await getTotalRewards();
        setRedeemedRewardCount(rewardsRes.data.total);
      } catch (err) {
        console.error('Failed to fetch redeemed rewards:', err);
      }
    })();
  }, [isLoggedIn]);

  /* ------------------------------------------------------------------
     Profile Handlers
  ------------------------------------------------------------------ */
  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfile({ ...profile, avatar: URL.createObjectURL(file) });
  };
  const handleRemoveAvatar = () =>
    setProfile({ ...profile, avatar: defaultAvatar });

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...profile, goals: normalizeGoals(profile.goals) };
      const { data } = await updateProfile(payload);
      data.goals = normalizeGoals(data.goals);
      setProfile(data);
      setIsEditProfileModalOpen(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  /* ------------------------------------------------------------------
     Goal Handlers
  ------------------------------------------------------------------ */
  const handleAddGoalSubmit = async (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.progress) return;
  
    const updatedGoals = [
      ...normalizeGoals(profile.goals),
      { ...newGoal, achieved: false },
    ];
  
    try {
      // Send the updated goals array to the server
      await updateProfile({ ...profile, goals: updatedGoals });
  
      // Re-fetch the full profile so we get the server’s authoritative data
      const resp = await getProfile();
      resp.data.goals = normalizeGoals(resp.data.goals);
      setProfile(resp.data);
  
      // Clear and close
      setNewGoal({ title: '', progress: '' });
      setIsAddGoalModalOpen(false);
    } catch (err) {
      console.error('Failed to add goal:', err);
    }
  };  

  const openEditGoalModal = (idx) => {
    setEditingGoalIndex(idx);
    setEditGoalData({ ...normalizeGoals(profile.goals)[idx] });
    setIsEditGoalModalOpen(true);
  };

  const handleEditGoalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditGoalData({
      ...editGoalData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEditGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      const goals = normalizeGoals(profile.goals);
      goals[editingGoalIndex] = editGoalData;
      const { data } = await updateProfile({ ...profile, goals });
      data.goals = normalizeGoals(data.goals);
      setProfile(data);
      setIsEditGoalModalOpen(false);
    } catch (err) {
      console.error('Failed to update goal:', err);
    }
  };

  const handleRemoveGoalInEdit = async () => {
    if (!window.confirm('Remove this goal?')) return;
    try {
      const goals = normalizeGoals(profile.goals);
      goals.splice(editingGoalIndex, 1);
      const { data } = await updateProfile({ ...profile, goals });
      data.goals = normalizeGoals(data.goals);
      setProfile(data);
      setIsEditGoalModalOpen(false);
    } catch (err) {
      console.error('Failed to remove goal:', err);
    }
  };

  /* ------------------------------------------------------------------
     Sign‑out
  ------------------------------------------------------------------ */
  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location = '/login';
  };

  /* ------------------------------------------------------------------
     Guards
  ------------------------------------------------------------------ */
  if (!isLoggedIn) {
    return (
      <div className="profile-page">
        <div className="profile-placeholder">
          <h2>Please Sign In</h2>
          <p>You need to sign in to view your profile.</p>
          <button
            className="btn signin-btn"
            onClick={() => (window.location = '/login')}>
            Sign In
          </button>
        </div>
      </div>
    );
  }
  if (loading) return <div className="profile-page">Loading…</div>;

  const goalsArr = normalizeGoals(profile.goals);

  /* ------------------------------------------------------------------
     JSX
  ------------------------------------------------------------------ */
  return (
    <div className="profile-page">
      <h1 className="main-heading">My Finance Dashboard</h1>
      <p className="main-subheading">
        Welcome to your personal finance portal
      </p>

      <div className="profile-dashboard">
        {/* LEFT COLUMN */}
        <div className="dashboard-left">
          <div className="profile-info-card glass-card">
            <div className="profile-info-header">
              <img
                src={profile.avatar}
                alt="Profile avatar"
                className="profile-avatar"
              />
              <div>
                <h2 className="profile-name">{profile.name}</h2>
                <p className="profile-location">{profile.location}</p>
              </div>
            </div>
            <div className="profile-contact">
              <h3>Email</h3>
              <p>{profile.email}</p>
              <h3>Bio</h3>
              <p>{profile.bio}</p>
            </div>
            <button
              className="btn edit-profile-btn"
              onClick={() => setIsEditProfileModalOpen(true)}>
              Edit Profile
            </button>
          </div>
          <div className="profile-eco glass-card">
            Eco‑conscious since{' '}
            {profile.createdAt
              ? new Date(profile.createdAt).toLocaleDateString()
              : 'N/A'}
            . You currently have {profile.points} points.
          </div>
        </div>

        {/* RIGHT COLUMN */}
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
              {goalsArr.map((goal, idx) => (
                <div className="goal-item" key={idx}>
                  <div className="goal-text">
                    <h4>{goal.title}</h4>
                    <p>Progress: {goal.progress}</p>
                    {goal.achieved && <p className="goal-achieved">Achieved</p>}
                  </div>
                  <div className="goal-buttons">
                    <button
                      className="btn goal-edit-btn"
                      onClick={() => openEditGoalModal(idx)}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn add-goal-btn"
              onClick={() => setIsAddGoalModalOpen(true)}>
              Add Goal
            </button>
          </div>

          <div className="sign-out-card">
            <button className="sign-out-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditProfileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <form
              onSubmit={handleEditProfileSubmit}
              className="modal-form"
              noValidate
            >
              <label>Name:</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />

              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
              />

              <label>Location:</label>
              <input
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                required
              />

              <label>Bio:</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
              />

              <label
                htmlFor="avatar-upload"
                style={{ cursor: 'pointer', color: 'var(--secondary)' }}>
                Change Profile Picture
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
              />

              <button
                type="button"
                className="btn modal-submit-btn"
                onClick={handleRemoveAvatar}>
                Remove Picture
              </button>

              <div className="modal-buttons">
                <button type="submit" className="btn modal-submit-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn modal-cancel-btn"
                  onClick={() => setIsEditProfileModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD GOAL MODAL */}
      {isAddGoalModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Goal</h3>
            <form
              onSubmit={handleAddGoalSubmit}
              className="modal-form"
              noValidate
            >
              <label>Goal Title:</label>
              <input
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                required
              />

              <label>Progress:</label>
              <input
                value={newGoal.progress}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, progress: e.target.value })
                }
                required
              />

              <div className="modal-buttons">
                <button type="submit" className="btn modal-submit-btn">
                  Add Goal
                </button>
                <button
                  type="button"
                  className="btn modal-cancel-btn"
                  onClick={() => setIsAddGoalModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT GOAL MODAL */}
      {isEditGoalModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Goal</h3>
            <form onSubmit={handleEditGoalSubmit} className="modal-form">
              <label>Goal Title:</label>
              <input
                name="title"
                value={editGoalData.title}
                onChange={handleEditGoalChange}
                required
              />

              <label>Progress:</label>
              <input
                name="progress"
                value={editGoalData.progress}
                onChange={handleEditGoalChange}
                required
              />

              <label>
                <input
                  type="checkbox"
                  name="achieved"
                  checked={editGoalData.achieved}
                  onChange={handleEditGoalChange}
                />{' '}
                Achieved
              </label>

              <div className="modal-buttons">
                <button type="submit" className="btn modal-submit-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="btn modal-cancel-btn"
                  onClick={() => setIsEditGoalModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn modal-cancel-btn"
                  onClick={handleRemoveGoalInEdit}>
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
