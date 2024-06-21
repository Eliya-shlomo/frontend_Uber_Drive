'use client';
import React, { useState } from 'react';
import DriverForm from './components/DriverForm'; 
import RiderForm from './components/RiderForm';   

const TravelInformation = () => {
  const [driverDetails, setDriverDetails] = useState(null);
  const [riderDetails, setRiderDetails] = useState(null);

  const handleDriverSubmit = (walletAddress) => {
    setDriverDetails({ walletAddress });
  };

  const handleRiderSubmit = (walletAddress, privateKey, driverAddress) => {
    setRiderDetails({ walletAddress, privateKey, driverAddress });
  };

  return (
    <div>
      <h1>Travel Information</h1>
      <div style={{ marginBottom: '2rem' }}>
        <DriverForm onSubmit={handleDriverSubmit} />
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <RiderForm onRiderSubmit={handleRiderSubmit} />
      </div>
      <div>
        <h2>Submitted Details</h2>
        {driverDetails && (
          <div style={{ marginBottom: '1rem' }}>
            <h3>Driver Details:</h3>
            <p>Wallet Address: {driverDetails.walletAddress}</p>
          </div>
        )}
        {riderDetails && (
          <div style={{ marginBottom: '1rem' }}>
            <h3>Rider Details:</h3>
            <p>Wallet Address: {riderDetails.walletAddress}</p>
            <p>Private Key: {riderDetails.privateKey}</p>
            <p>Driver Address: {riderDetails.driverAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelInformation;
