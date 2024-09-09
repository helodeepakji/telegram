import { NavLink } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import coinImag from '../assets/coin.png'
import Avtar from '../assets/Avtar.png'
import flash from '../assets/flash.png'
import LogoImg from '../assets/logo (1).png'

const Home = () => {
  const [energy, setEnergy] = useState(500)
  const [earned, setEarned] = useState(0)
  const [user, setUser] = useState('user')

  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    console.log('start')
    fetch('/username')
      .then((response) => response.json())
      .then((data) => {
        if (data.coin) {
          setEarned(data.coin)
          setEnergy(data.energy)
          setUser(data.username)
        }
      })
      .catch((error) => {
        console.error('Error fetching username:', error)
      })
  }, [])

  const [showAnimation, setShowAnimation] = useState(false)
  const timerRef = useRef(null)

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      if (energy < 500) {
        setEnergy((prev) => {
          const newEnergy = Math.min(prev + 1, 500)
          addEnergy(newEnergy)
          return newEnergy
        })
      }
    }, 1000)
  }

  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const addCoin = async (energy) => {
    try {
      const response = await fetch(`/api/addCoin/${energy}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Coin added:', result)
      } else {
        console.error('Error adding coin:', response.statusText)
      }
    } catch (error) {
      console.error('Error adding coin:', error)
    }
  }

  const debouncedAddCoin = debounce(addCoin, 300)

  const minusEnergy = async (coin) => {
    if (coin >= 0) {
      try {
        const response = await fetch(`/api/useEnergy/${coin}`, {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const result = await response.json()
          console.log('Coin added:', result)
        } else {
          console.error('Error adding coin:', response.statusText)
        }
      } catch (error) {
        console.error('Error adding coin:', error)
      }
    }
  }

  const addEnergy = async (coin) => {
    if (coin <= 500) {
      try {
        const response = await fetch(`/api/addEnergy/${coin}`, {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const result = await response.json()
          console.log('Coin added:', result)
        } else {
          console.error('Error adding coin:', response.statusText)
        }
      } catch (error) {
        console.error('Error adding coin:', error)
      }
    }
  }

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [energy])

  const handleClick = (e) => {
    setEnergy((prev) => {
      const newEnergy = prev - 1
      if (prev > 0) {
        minusEnergy(newEnergy)
        return newEnergy
      } else {
        return 0
      }
    })
    setEarned((prev) => {
      const newEarned = prev + 1
      debouncedAddCoin(newEarned)
      return newEarned
    })

    resetTimer()
    setShowAnimation(true)

    const rect = e.target.getBoundingClientRect()
    setAnimationPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    setTimeout(() => setShowAnimation(false), 1000)

    setIsScaled(true)
    setTimeout(() => setIsScaled(false), 200)
  }

  const [isScaled, setIsScaled] = useState(false)

  return (
    <div className='content container-sm' style={{ minHeight: '100vh' }}>
      <div className='section'>
        <div className='moon-bunny'>
          <img src={LogoImg} alt='' />
          <h6>{user}</h6>
        </div>
      </div>
      <div className='section'>
        <div
          className='level'
          style={{
            padding: '0px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className='logo' style={{ marginRight: '8px', marginLeft: '0' }}>
            <i className='fa fa-bolt'></i>
          </div>
          <div className='text' style={{ marginTop: '0' }}>
            <p style={{ margin: '0' }}>LVL 1</p>
          </div>
        </div>
        <div className='coin'>
          <img src={coinImag} alt='' />
          <h3 id='point'>{earned}</h3>
        </div>
      </div>
      <div
        className={`center ${isScaled ? 'scaled' : ''}`}
        style={{ position: 'relative' }}
      >
        {showAnimation && (
          <span
            className='new-earnpoint'
            style={{
              top: `${animationPosition.y}px`,
              left: `${animationPosition.x}px`,
            }}
          >
            +1
          </span>
        )}
        <img
          src={coinImag}
          className='coinimg'
          alt=''
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />
        <div
          style={{ zIndex: 0, position: 'absolute', bottom: '-20%' }}
          id='shadow'
        ></div>
        <img
          src={Avtar}
          className='Avtar'
          alt=''
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className='pro-bar'>
        <div className='text'>
          {energy} / 500 <img src={flash} alt='' />
        </div>
        <div className='progress progress-striped'>
          <div
            className='progress-bar'
            style={{ width: (energy / 500) * 100 + '%' }}
          ></div>
        </div>
      </div>

      <div className='list-tile'>
        <div className='title-subtitle'>
          <div className='title'>Choose And Fight Opponents</div>
          <div className='subtitle'>To earn more rewards</div>
        </div>
        <div className='copy-button-bg'>
          <NavLink to='/fight' className='copy-button'>
            <span>Fight</span>
          </NavLink>
        </div>
        <div className='circle top-left'>
          <img src={coinImag} style={{ width: '100%' }} alt='' />
        </div>
        <div className='circle top-right'>
          <img
            src={coinImag}
            style={{
              width: '100%',
              zIndex: 10,
              borderRadius: '50%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            }}
            alt=''
          />
        </div>
        <div className='circle middle'>
          <img src={coinImag} style={{ width: '100%' }} alt='' />
        </div>
      </div>
    </div>
  )
}

export default Home
