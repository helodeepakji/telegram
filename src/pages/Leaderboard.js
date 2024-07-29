import React , { useState, useEffect, useRef } from "react";
import coinImage from '../assets/coin.png';
import profileImage from '../assets/image.jpg';

const Leaderboard = () => {
  const [earned, setEarned] = useState(0);
  const [leaders, setLeaders] = useState([]);
  const [userid, setUserid] = useState(0);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(response => response.json())
      .then(data => {
        setLeaders(data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

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

  let i = 0;

  const textToCopy = 'https://t.me/Hypermovegamebot?start='+userid;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      // alert('Text copied to clipboard');
    }).catch(err => {
      // console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="container" style={{ padding: '10px', marginBottom: '100px' }}>
      <div className="header-container">
        <div className="header">
          <img src={coinImage} alt="Coin" className="coin-img" />
          <h1 className="heading-primary">{earned}</h1>
        </div>
        <h2>Leaderboard</h2>
      </div>
      {leaders.map(value => (
        <div className="profile-card">
          <div className={`profile-item ${value.user_id === userid ? 'myrank' : ''}`}>
            <div className="number">{++i}</div>
            <img src={profileImage} className="circular-image" alt="Profile" />
            <div className="profile-title">{value.username}</div>
            <div className="right-content">
              <img src={coinImage} className="coin-image-card" alt="Coin" />
              <span>{value.coin}</span>
            </div>
          </div>
        </div>
      ))}
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
    </div>
  );
};

export default Leaderboard;