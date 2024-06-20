import React, { useState } from 'react';

const RiderForm = ({ onRiderSubmit }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [driverAddress, setDriverAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRiderSubmit(walletAddress, privateKey, driverAddress);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label>Rider Wallet Address</label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label>Rider Private Key</label>
        <input
          type="password"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label>Driver Wallet Address</label>
        <input
          type="text"
          value={driverAddress}
          onChange={(e) => setDriverAddress(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RiderForm;
