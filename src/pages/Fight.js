import React, { useState, useEffect, useRef } from "react";
import FightImg1 from "../assets/figher.png";
import FightImg2 from "../assets/figher2.png";
import FightImg3 from "../assets/fighter3.png";
import flash from "../assets/flash.png";
import coinImag from "../assets/coin.png";
import LogoImg from "../assets/logo (1).png";
import RightImg from "../assets/right.png";
import LeftImg from "../assets/left.png";
import CheckBtn from "../assets/tick-removebg-preview.png";
import PercentImg from "../assets/percen.png";
import FireImg from "../assets/circle1.png";
import RankImg from "../assets/circle2.png";
import AttackImg from "../assets/circle3.png";
import UpgradeImg from "../assets/upgrade.png";
import FightBtn from "../assets/fightbtn.png";


const Fight = () => {
  const [user, setUser] = useState('user');
  const [coin, setCoin] = useState(0);
  const fighterImages = [FightImg1, FightImg2, FightImg3];

  useEffect(() => {
    console.log('start');
    fetch('/username')
      .then(response => response.json())
      .then(data => {
        if (data.coin) {
          setCoin(data.coin);
          setUser(data.username);
        }
      })
      .catch(error => {
        console.error('Error fetching username:', error);
      });
  }, []);

  // State to keep track of current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? fighterImages.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === fighterImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="content container-sm contentfight">
      <div className="section">
        <div className="boxes">
          <div className="moon-bunny">
            <img src={LogoImg} />
          </div>
          <h6>{user}</h6>
        </div>
        <div className="boxes">
          <div className="text level one">
            <img className="coin" src={coinImag} alt="" style={{ width: '30px' }} />
            <p>{coin}</p>
          </div>
        </div>
        <div className="boxes">
          <div className="Boost">
            <img className="coin" src={flash} alt="" style={{ width: '30px' }} />
            <p>2/6</p>
          </div>
        </div>
      </div>
      <div className="level bolt">
        <div className="logo">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <div className="text">
          <p>LVL 6</p>
        </div>
      </div>
      <div className="menu">
        <img className="right" src={RightImg} alt="" onClick={prevImage} />
        <img className="fighter" src={fighterImages[currentImageIndex]} alt="" />
        <img className="left" src={LeftImg} alt="" onClick={nextImage} />
        <div id="shadow"></div>
      </div>
      <h4 align="center">Character Status Upgrade</h4>
      <div className="action ">
        <div className="box1">
          <div className="circles">
            <img src={AttackImg} alt="" />
          </div>
          <h6>Attack Damage</h6>
        </div>
        <div className="box2">
          <img src={PercentImg} alt="" />
          <p>25%</p>
        </div>
        <div className="box3">
          <img src={coinImag} alt="" />
          <h6>8,534</h6>
        </div>
        <div className="box4">
          <img src={CheckBtn} alt="" />
        </div>
      </div>
      <div className="action action1">
        <div className="box1">
          <div className="circles">
            <img src={FireImg} alt="" />
          </div>
          <h6>Fire Rate</h6>
        </div>
        <div className="box2">
          <img src={PercentImg} alt="" />
          <p>20%</p>
        </div>
        <div className="box3">
          <img src={coinImag} alt="" />
          <h6>7,689</h6>
        </div>
        <div className="box4">
          <img src={CheckBtn} alt="" />
        </div>
      </div>
      <div className="action action3">
        <div className="box1">
          <div className="circles">
            <img src={RankImg} alt="" />
          </div>
          <h6>Range</h6>
        </div>
        <div className="box2">
          <img src={PercentImg} alt="" />
          <p>15%</p>
        </div>
        <div className="box3">
          <img src={coinImag} alt="" />
          <h6>29,870</h6>
        </div>
        <div className="box4">
          <img src={CheckBtn} alt="" />
        </div>
      </div>
      <div className="bottom-upgrade">
        <img src={UpgradeImg} alt="" />
        <img src={FightBtn} alt="" />
      </div>
    </div>
  );
};

export default Fight;