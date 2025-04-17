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

  // Helper to ensure goals is always an array
  const normalizeGoals = (goalsData) => {
    if (Array.isArray(goalsData)) return goalsData;
    if (typeof goalsData === 'string') {
      try {
        return JSON.parse(goalsData) || [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Fetch profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const data = response.data;
        // Normalize goals to array
        data.goals = normalizeGoals(data.goals);
        setProfile(data);
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
      // Ensure goals array before sending
      const payload = { ...profile, goals: normalizeGoals(profile.goals) };
      const response = await updateProfile(payload);
      const updated = response.data;
      updated.goals = normalizeGoals(updated.goals);
      console.log('Profile updated:', updated);
      setProfile(updated);
      setIsEditProfileModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Add Goal Handlers
  const handleAddGoalSubmit = async (e) => {
    e.preventDefault();
    if (newGoal.title && newGoal.progress) {
      const updatedGoals = [...normalizeGoals(profile.goals), { ...newGoal, achieved: false }];
      const payload = { ...profile, goals: updatedGoals };
      try {
        const response = await updateProfile(payload);
        const updated = response.data;
        updated.goals = normalizeGoals(updated.goals);
        console.log('Goal added:', updated);
        setProfile(updated);
        setNewGoal({ title: '', progress: '' });
        setIsAddGoalModalOpen(false);
      } catch (error) {
        console.error("Failed to update profile with new goal:", error);
      }
    }
  };

  // Edit Goal Handlers
  const openEditGoalModal = (index) => {
    const goalsArr = normalizeGoals(profile.goals);
    setEditingGoalIndex(index);
    setEditGoalData({ ...goalsArr[index] });
    setIsEditGoalModalOpen(true);
  };

  const handleEditGoalSubmit = async (e) => {
    e.preventDefault();
    const goalsArr = normalizeGoals(profile.goals);
    goalsArr[editingGoalIndex] = editGoalData;
    const payload = { ...profile, goals: goalsArr };
    try {
      const response = await updateProfile(payload);
      const updated = response.data;
      updated.goals = normalizeGoals(updated.goals);
      console.log('Goal updated:', updated);
      setProfile(updated);
      setIsEditGoalModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile after editing goal:", error);
    }
  };

  const handleRemoveGoalInEdit = async () => {
    if (window.confirm('Are you sure you want to remove this goal?')) {
      const goalsArr = normalizeGoals(profile.goals);
      goalsArr.splice(editingGoalIndex, 1);
      const payload = { ...profile, goals: goalsArr };
      try {
        const response = await updateProfile(payload);
        const updated = response.data;
        updated.goals = normalizeGoals(updated.goals);
        console.log('Goal removed:', updated);
        setProfile(updated);
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
      {/* rest of the rendering unchanged, using profile.goals safely */}
      {/* ... */}
    </div>
  );
}

export default ProfilePage;
