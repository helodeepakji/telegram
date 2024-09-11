import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import coinImage from '../assets/coin.png'
import profileImage from '../assets/image.jpg'
import { io } from 'socket.io-client'

const socket = io('https://telegram.softairtechnology.com')

const Opponet = () => {
  const [earned, setEarned] = useState(0)
  const [opponet, setOpponet] = useState([])
  const [userid, setUserid] = useState(0)

  useEffect(() => {
    console.log('start')
    fetch('/username')
      .then((response) => response.json())
      .then((data) => {
        if (data.coin) {
          setEarned(data.coin)
          setUserid(data.user_id)
          socket.emit('userLogin', {
            userId: data.user_id,
            username: data.username,
          })
        }
      })
      .catch((error) => {
        console.error('Error fetching username:', error)
      })

    socket.on('updateUsers', (users) => {
      setOpponet(users)
    })

    // Clean up on component unmount
    return () => {
      socket.off('updateUsers')
    }
  }, [])

  let i = 0

  return (
    <div
      className='container'
      style={{ padding: '10px', marginBottom: '100px', minHeight: '100vh' }}
    >
      <div className='header-container'>
        <div className='header'>
          <h1 className='heading-primary'>Add Opponet</h1>
        </div>
      </div>
      {opponet.map((value) => (
        <div className='profile-card'>
          <div
            className={`profile-item ${
              value.userId === userid ? 'myrank' : ''
            }`}
          >
            <div className='number'>{++i}</div>
            <img src={profileImage} className='circular-image' alt='Profile' />
            <div className='profile-title'>{value.username}</div>
            <div className='right-content'>
              <Link to='/battle' state={{ opponentId: value.userId }}>
                <span>{value.userId}</span>{' '}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Opponet
