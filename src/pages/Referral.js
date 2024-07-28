import React , { useState, useEffect, useRef } from 'react';
import coinImage from '../assets/coin.png'; // Adjust the path as needed
import profileImage from '../assets/image.jpg'; // Adjust the path as needed

const InviteFriends = () => {
  const [earned, setEarned] = useState(0);
  const [userid, setUserid] = useState(0);

  useEffect(() => {
    console.log('start');
    fetch('/username')
      .then(response => response.json())
      .then(data => {
        if (data.coin) {
          setEarned(data.coin);
          setUserid(data.user_id);
        }
      })
      .catch(error => {
        console.error('Error fetching username:', error);
      });
  }, []);

  const textToCopy = 'https://telegram-rp37.onrender.com/auth/';
  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Text copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="container" style={{ padding: '10px', marginBottom: '100px' }}>
      <div className="header-container">
        <div className="header">
          <img src={coinImage} alt="Coin" className="coin-img" />
          <h1 className="heading-primary">{earned}</h1>
        </div>
        <h2>Invite Friends</h2>
      </div>
      <div className="list-tile">
        <div className="title-subtitle">
          <div className="title">Invite a Friend</div>
          <div className="subtitle">To earn more rewards</div>
        </div>
        <div className="copy-button-bg">
          <button onClick={copyToClipboard} className="copy-button"><span>Copy Link</span></button>
        </div>
        <div className="circle top-left">
          <img src={coinImage} style={{ width: '100%' }} alt="" />
        </div>
        <div className="circle top-right">
          <img
            src={coinImage}
            style={{
              width: '100%',
              zIndex: 10,
              borderRadius: '50%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
            alt=""
          />
        </div>
        <div className="circle middle">
          <img src={coinImage} style={{ width: '100%' }} alt="" />
        </div>
      </div>
      <h4>Top Referrals</h4>
      <div className="profile-card">
        <div className="profile-item">
          <div className="number">1</div>
          <img src={profileImage} className="circular-image" alt="Profile" />
          <div className="profile-title">Lemmyux</div>
          <div className="right-content">
            <img src={coinImage} className="coin-image-card" alt="Coin" />
            <span>49853416</span>
          </div>
        </div>
      </div>
      <div className="profile-card">
        <div className="profile-item">
          <div className="number">2</div>
          <img src={profileImage} className="circular-image" alt="Profile" />
          <div className="profile-title">Lemmyux</div>
          <div className="right-content">
            <img src={coinImage} className="coin-image-card" alt="Coin" />
            <span>49853416</span>
          </div>
        </div>
      </div>
      <div className="profile-card">
        <div className="profile-item">
          <div className="number">3</div>
          <img src={profileImage} className="circular-image" alt="Profile" />
          <div className="profile-title">Lemmyux</div>
          <div className="right-content">
            <img src={coinImage} className="coin-image-card" alt="Coin" />
            <span>49853416</span>
          </div>
        </div>
      </div>
      <div className="profile-card">
        <div className="profile-item">
          <div className="number">5</div>
          <img src={profileImage} className="circular-image" alt="Profile" />
          <div className="profile-title">Lemmyux</div>
          <div className="right-content">
            <img src={coinImage} className="coin-image-card" alt="Coin" />
            <span>49853416</span>
          </div>
        </div>
      </div>
      <h4><span style={{ color: '#ffc227' }}>0</span> Referrals Yet</h4>
      <div className="referral-card">
        <img src={coinImage} className="referral-card-coin-left" alt="Coin" />
        <div className="referral-card-content">
          <h1 className="referral-card-title">Invite a Friend</h1>
          <p className="referral-card-subtitle">
            <span style={{ color: '#ffc227' }}>+2000 </span>for you when you invite a
            friend
          </p>
        </div>
        <div className="circle top-right" style={{ width: '50px', height: '50px' }}>
          <img
            src={coinImage}
            style={{
              width: '100%',
              zIndex: 10,
              borderRadius: '50%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
            alt=""
          />
        </div>
      </div>
      <div className="referral-card">
        <img src={coinImage} className="referral-card-coin-left" alt="Coin" />
        <div className="referral-card-content">
          <h1 className="referral-card-title">
            Invite a Friend With Telegram Premium
          </h1>
          <p className="referral-card-subtitle">
            <span style={{ color: '#ffc227' }}>+2000 </span>for you when you invite a
            friend
          </p>
        </div>
        <div className="circle top-right" style={{ width: '50px', height: '50px' }}>
          <img
            src={coinImage}
            style={{
              width: '100%',
              zIndex: 10,
              borderRadius: '50%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default InviteFriends;
