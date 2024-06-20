import React, { useState } from 'react';

const DriverForm = ({ onSubmit }) => {
  const [walletAddress, setWalletAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(walletAddress);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label>Driver Wallet Address</label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default DriverForm;
