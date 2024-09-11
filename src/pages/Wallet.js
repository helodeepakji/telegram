import React from 'react'
import WalletImag from '../assets/bag.png'

const Wallet = () => {
  return (
    <div
      className='text-center'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '32px'
      }}
    >
      <div className='center'>
        <img
          src={WalletImag}
          style={{ width: '150px' }}
          className='bag'
          alt=''
        />
      </div>
      <div>
        <h4 className='text' style={{marginTop: '16px'}}>Connect Wallet</h4>
        <h5 className='smalltxt'>
          connect wallet to access upcoming earning features coming
        </h5>
        <h5>Soon!</h5>
        <br />
      </div>
      <div className='comesoonimg' style={{marginBottom: '100px'}}>
        <button className='coming_soon'>Coming Soon</button>
      </div>
    </div>
  )
}

export default Wallet
