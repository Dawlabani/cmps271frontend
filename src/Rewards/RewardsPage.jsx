import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProfile, getRewards, redeemReward } from '../services/api';
import './RewardsPage.css';

export default function RewardsPage() {
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [redeemCode, setRedeemCode] = useState('');
  const [redeemedReward, setRedeemedReward] = useState(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  // Load profile points and available rewards
  useEffect(() => {
    async function fetchData() {
      try {
        const [{ data: profile }, { data: rewardsList }] = await Promise.all([
          getProfile(),
          getRewards()
        ]);
        setUserPoints(profile.points);
        setRewards(Array.isArray(rewardsList) ? rewardsList : []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load rewards');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle redeem action
  const handleRedeem = async (reward) => {
    if (userPoints < reward.points) {
      setError('Not enough points to redeem this reward.');
      return;
    }
    try {
      const { data } = await redeemReward(reward.id);
      setUserPoints(data.newPoints);
      setRedeemCode(data.code);
      setRedeemedReward(reward);
      setShowRedeemModal(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Redeem failed');
    }
  };

  const closeModal = () => {
    setShowRedeemModal(false);
    setRedeemCode('');
    setRedeemedReward(null);
    setError(null);
  };

  if (loading) return <div className="rewards-page"><p>Loading...</p></div>;
  if (error)   return <div className="rewards-page"><p className="error">{error}</p></div>;

  return (
    <div className="rewards-page">
      <motion.header
        className="rewards-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Redeem Your Rewards</h1>
        <p>You have <strong>{userPoints}</strong> points</p>
      </motion.header>

      <motion.section
        className="rewards-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {rewards.length === 0 ? (
          <p>No rewards available.</p>
        ) : (
          rewards.map(reward => (
            <div key={reward.id} className="reward-card">
              <img
                src={reward.image}
                alt={reward.name}
                onError={e => e.target.src = 'https://via.placeholder.com/150'}
              />
              <div className="reward-info">
                <h2>{reward.name}</h2>
                <p>{reward.description}</p>
                <p className="points-cost">{reward.points} pts</p>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={userPoints < reward.points}
                >
                  Redeem
                </button>
              </div>
            </div>
          ))
        )}
      </motion.section>

      {showRedeemModal && redeemedReward && (
        <div className="redeem-modal">
          <div className="redeem-content">
            <h3>Congrats! You redeemed {redeemedReward.name}</h3>
            <img
              src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${redeemCode}`}
              alt="Redeem barcode"
            />
            <p>Code: <strong>{redeemCode}</strong></p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
