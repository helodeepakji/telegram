import React from "react";
import LogoImg from "../assets/x_logo.png";
import coinImag from "../assets/coin.png";
import checkImg from "../assets/check_img.png";
import teleLogo from "../assets/tele_logo.png";
import ytLogo from "../assets/yt_logo.png";

const Task = () => {
  return (
    <div className="container">
      <div className="header-container">
        <h2>Tasks</h2>
      </div>
      <div className="referral-container">
        <div className="referral-overlay">
          <div className="tasks-card">
            <div style={{display: 'flex'}}>
              <img src={LogoImg} className="tasks-card-coin-left" />
              <div className="referral-card-content">
                <h1 className="referral-card-title task-card-title">Follow us on X</h1>
                <p className="referral-card-subtitle" style={{display: 'flex' ,  gap: '5px' , alignItems: 'center'}} >
                  <span style={{ color: '#ffc227' }}>
                    <img style={{ width: '12px', height: '12px' }} src={coinImag} /></span>90,000
                </p>
              </div>
            </div>
            <img src={checkImg} style={{ width: '30px' }} />
          </div>
        </div>
      </div>
      <div className="referral-container">
        <div className="referral-overlay">
          <div className="tasks-card">
            <div style={{display: 'flex'}}>
              <img src={teleLogo} className="tasks-card-coin-left"  alt="Coin" />
              <div className="referral-card-content">
                <h1 className="referral-card-title task-card-title">Join our Telegram channel</h1>
                <p className="referral-card-subtitle" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <span style={{ color: '#ffc227' }} >
                    <img style={{ width: '12px', height: '12px' }} src={coinImag} />
                  </span>
                  90,000
                </p>
              </div>
            </div>
            <div>
              <i className="fa fa-angle-right fa-2x" style={{ color: '#fff' }} aria-hidden="true" ></i>
            </div>
          </div>
        </div>
      </div>
      <div className="referral-container">
        <div className="referral-overlay">
          <div className="tasks-card">
            <div style={{display: 'flex'}}>
              <img src={LogoImg} className="tasks-card-coin-left" alt="Coin" />
              <div className="referral-card-content">
                <h1 className="referral-card-title task-card-title">Like and RT pinned tweet</h1>
                <p className="referral-card-subtitle" style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                  <span style={{color: '#ffc227'}}>
                    <img style={{width: '12px', height: '12px'}} src={coinImag} /></span>
                    90,000
                </p>
              </div>
            </div>
            <img src={checkImg} style={{width: '30px'}} />
          </div>
        </div>
      </div>
      <div className="referral-container">
        <div className="referral-overlay">
          <div className="tasks-card">
            <div style={{display: 'flex'}}>
              <img src={ytLogo} className="tasks-card-coin-left" alt="Coin"/>
              <div className="referral-card-content">
                <h1 className="referral-card-title task-card-title">Like this video on YouTube.</h1>
                <p className="referral-card-subtitle" style={{display: 'flex' , gap: '5px' , alignItems: 'center'}}>
                  <span style={{color: '#ffc227'}}>
                  <img style={{width: '12px', height: '12px'}} src={coinImag} /></span>90,000
                </p>
              </div>
            </div>
            <div>
              <i className="fa fa-angle-right fa-2x" style={{color: '#fff'}} aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;