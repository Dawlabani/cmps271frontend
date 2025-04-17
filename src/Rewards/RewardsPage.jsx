import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './RewardsPage.css';

function RewardsPage() {
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0); // from the DB now
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState('');
  const [redeemedReward, setRedeemedReward] = useState(null);
  const [showRedeemBox, setShowRedeemBox] = useState(false);

  // Fetch user profile & rewards in parallel or sequentially
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        // 1) Fetch user profile to get up-to-date points
        const profileRes = await fetch('/profile', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!profileRes.ok) {
          throw new Error('Failed to fetch user profile.');
        }
        const userData = await profileRes.json();
        setUserPoints(userData.points);

        // 2) Fetch rewards
        const rewardsRes = await fetch('/rewards', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!rewardsRes.ok) {
          throw new Error('Failed to fetch rewards.');
        }
        const rewardsData = await rewardsRes.json();
        setRewards(rewardsData);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Redeem a reward by POSTing to /rewards/redeem
  const handleRedeemReward = async (reward) => {
    if (userPoints < reward.points) {
      // Not enough points
      setRedeemedReward(null);
      setIsRedeeming(true);
      setShowRedeemBox(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/rewards/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rewardId: reward.id }),
      });
      const data = await res.json();

      if (data.success) {
        // Update local userPoints to reflect DB
        setUserPoints(data.newPoints);
        setRedeemedCode(data.code);
        setRedeemedReward(reward);
        setShowRedeemBox(true);
      } else {
        alert(data.message);
      }
      setIsRedeeming(true);
    } catch (err) {
      console.error('Error redeeming reward:', err);
      setError(err.message);
    }
  };

  const handleDone = () => {
    setShowRedeemBox(false);
    setIsRedeeming(false);
  };

  return (
    <div className="rewards-page">
      <motion.div className="rewards-content"       
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <header className="rewards-header">
          <h1>Redeem Your Rewards</h1>
          <p>Use your points for rewards!</p>
          <h2 className="points-available">You have {userPoints} points!</h2>
        </header>

        {loading ? (
          <p>Loading rewards...</p>
        ) : error ? (
          <p className='ErrorMessage'>Error: {error}</p>
        ) : rewards.length > 0 ? (
          <section className="rewards-list">
            {rewards.map((reward) => (
              <div key={reward.id} className="reward-card">
                <img
                  src={reward.image}
                  alt={reward.name}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=No+Image')}
                />
                <h2>{reward.name}</h2>
                <p>{reward.description}</p>
                <p>{reward.points} pts</p>
                <button className="redeem-btn" onClick={() => handleRedeemReward(reward)}>Redeem</button>
              </div>
            ))}
          </section>
        ) : (
          <p>No rewards available.</p>
        )}
      </motion.div>

      {isRedeeming && showRedeemBox && redeemedReward && (
        <div className="redeem-modal">
          <div className="redeem-content">
            <h3>Congrats! You redeemed {redeemedReward.name}</h3>
            <img
              src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${redeemedCode}`}
              alt="Barcode"
            />
            <p>Your code: {redeemedCode}</p>
            <button onClick={handleDone}>Done</button>
          </div>
        </div>
      )}

      {isRedeeming && !showRedeemBox && (
        <div className="redeem-modal">
          <div className="redeem-content">
            <h3>Not enough points!</h3>
            <button onClick={handleDone}>Okay</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RewardsPage;
