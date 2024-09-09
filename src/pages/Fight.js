import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import FightImg1 from '../assets/figher.png'
import FightImg2 from '../assets/figher2.png'
import FightImg3 from '../assets/fighter3.png'
import flash from '../assets/flash.png'
import coinImag from '../assets/coin.png'
import LogoImg from '../assets/logo (1).png'
import RightImg from '../assets/right.png'
import LeftImg from '../assets/left.png'
import CheckBtn from '../assets/tick-removebg-preview.png'
import PercentImg from '../assets/percen.png'
import FireImg from '../assets/circle1.png'
import RankImg from '../assets/circle2.png'
import AttackImg from '../assets/circle3.png'
import UpgradeImg from '../assets/upgrade.png'
import FightBtn from '../assets/fightbtn.png'

const Fight = () => {
  const [user, setUser] = useState('user')
  const [coin, setCoin] = useState(0)
  const fighterImages = [FightImg1, FightImg2, FightImg3]

  useEffect(() => {
    console.log('start')
    fetch('/username')
      .then((response) => response.json())
      .then((data) => {
        if (data.coin) {
          setCoin(data.coin)
          setUser(data.username)
        }
      })
      .catch((error) => {
        console.error('Error fetching username:', error)
      })
  }, [])

  // State to keep track of current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? fighterImages.length - 1 : prevIndex - 1
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === fighterImages.length - 1 ? 0 : prevIndex + 1
    )
  }

  const userId = 'user1' // Replace with actual userId
  const opponentId = 'user2' // Replace with actual opponentId

  return (
    <div className='contentfight' style={{ minHeight: '100vh' }}>
      <div className='section'>
        <div className='boxes'>
          <div className='moon-bunny'>
            <img src={LogoImg} />
          </div>
          <h6>{user}</h6>
        </div>
        <div className='boxes'>
          <div className='text level one' style={{ padding: '0px 16px' }}>
            <img
              className='coin'
              src={coinImag}
              alt=''
              style={{ width: '30px', marginRight: '4px' }}
            />
            <p>{coin}</p>
          </div>
        </div>
        <div
          className='boxes'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className='Boost'>
            <img className='coin' src={flash} alt='' />
            <p>6/6</p>
          </div>
        </div>
      </div>
      <div className='level bolt'>
        <div className='logo'>
          <i className='fa fa-bolt' style={{ color: '#fff' }}></i>
        </div>
        <div className='text'>
          <p>LVL 1</p>
        </div>
      </div>

      <div
        className='menu'
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <img className='right' src={RightImg} alt='' onClick={prevImage} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            className='fighter'
            src={fighterImages[currentImageIndex]}
            alt=''
          />
          <div style={{ zIndex: 0, position: 'absolute', bottom: '-24%' }} id='shadow'></div>
        </div>
        <img className='left' src={LeftImg} alt='' onClick={nextImage} />
      </div>

      <h4 style={{ margin: '20px' }} align='center'>
        Character Status Upgrade
      </h4>
      <div className='action'>
        <div className='box1'>
          <div className='circles'>
            <img src={AttackImg} alt='' />
          </div>
          <h6>Attack Damage</h6>
        </div>
        <div className='box2'>
          <img src={PercentImg} alt='' />
          <p>25%</p>
        </div>
        <div className='box3' style={{ marginRight: '10px' }}>
          <img src={coinImag} alt='' />
          <h6>8,534</h6>
        </div>
        <div className='box4'>
          <img src={CheckBtn} alt='' />
        </div>
      </div>
      <div className='action'>
        <div className='box1'>
          <div className='circles'>
            <img src={FireImg} alt='' />
          </div>
          <h6>Fire Rate</h6>
        </div>
        <div className='box2'>
          <img src={PercentImg} alt='' />
          <p>20%</p>
        </div>
        <div className='box3'>
          <img src={coinImag} alt='' />
          <h6>7,689</h6>
        </div>
        <div className='box4'>
          <img src={CheckBtn} alt='' />
        </div>
      </div>
      <div className='action action3'>
        <div className='box1'>
          <div className='circles'>
            <img src={RankImg} alt='' />
          </div>
          <h6>Range</h6>
        </div>
        <div className='box2'>
          <img src={PercentImg} alt='' />
          <p>15%</p>
        </div>
        <div className='box3'>
          <img src={coinImag} alt='' />
          <h6>29,870</h6>
        </div>
        <div className='box4'>
          <img src={CheckBtn} alt='' />
        </div>
      </div>
      <div className='bottom-upgrade' style={{marginBottom: '60px'}}>
        <img src={UpgradeImg} alt='' />
        <NavLink to='/opponet'>
          <img src={FightBtn} alt='' />
        </NavLink>
      </div>
    </div>
  )
}

export default Fight
