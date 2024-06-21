'use client';
import React, { useState, useEffect } from 'react';
import './page.css'; 
import { ethers } from 'ethers';
import contract from './contract.json';
import axios from 'axios';

const HomePage = () => {
  const abi = contract.abi;
  const bytecode = contract.bytecode;

  const [SmartContractFactory, setSmartContractFactory] = useState(null);
  const [RiderPrivateKey, setRiderPrivateKey] = useState('');
  const [RiderAddress, setRiderAddress] = useState('');
  const [DriverAddress, setDriverAddress] = useState('');
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [distance, setDistance] = useState(null);
  const [smartContract, setSmartContract] = useState(null); 
  const [Nonce, setNonce] = useState(0);
  const [RiderWallet, setRiderWallet] = useState(null);
  const [rideCost, setRideCost] = useState(null);
  const [gasFee, setGasFee] = useState(null);
  const [isDriveEnded, setIsDriveEnded] = useState(false);

  useEffect(() => {
    connectToProvider(); 
  }, []);

  const connectToProvider = async () => {
    try {
      const provider = new ethers.WebSocketProvider("wss://eth-sepolia.g.alchemy.com/v2/VJ3P4EvkGue0YoBdA5D57iQpULsTC5rg");
      setProvider(provider);
      console.log("Connected to provider");
    } catch (err) {
      console.error("Error connecting to provider:", err);
    }
  };

  const MakeRiderWallet = async () => {
    try {
      const riderWallet = new ethers.Wallet(RiderPrivateKey, provider);
      setRiderWallet(riderWallet);
    } catch (error) {
      console.error("Error creating Rider Wallet:", error);
    }
  };

  const MakeContractFactory = async () => {
    try {
      console.log("Creating Smart Contract Factory");
      await MakeRiderWallet();  

      const smartContractFactory = new ethers.ContractFactory(abi, bytecode, RiderWallet);
      setSmartContractFactory(smartContractFactory);
      console.log("Smart Contract Factory created");
    } catch (error) {
      console.error("Error creating Smart Contract Factory:", error);
    }
  };

  const MakeContractInstance = async () => {
    try {
      await GetNonce();
      const overrides = {
        gasLimit: 3000000,
        gasPrice: ethers.parseUnits('4', 'gwei'),
        nonce: Nonce,
      };
      console.log("Deploying contract...");
      const smartContract = await SmartContractFactory.deploy(RiderAddress, DriverAddress, overrides);
      await smartContract.deployed();
      console.log('Contract deployed at address:', smartContract.address);
      setSmartContract(smartContract);
    } catch (error) {
      console.error('Error deploying contract:', error);
    }
  };

  const GetNonce = async () => {
    try {
      console.log("Getting nonce");
      const nonce = await provider.getTransactionCount(RiderAddress);
      setNonce(nonce);
      console.log("Nonce value is:", nonce);
    } catch (error) {
      console.error("Error getting nonce:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await processFormData({
      originAddress,
      destinationAddress
    });
    console.log("Creating Smart Contract Factory");
    await MakeContractFactory();
    await MakeContractInstance();
    console.log("Smart Contract Factory created");
    await bookDrive();
  };

  const processFormData = async (formData) => {
    try {
      const response = await axios.get('http://localhost:3000/distance', {
        params: {
          origin: formData.originAddress,
          destination: formData.destinationAddress
        }
      });
      const distance = response.data.distance; 
      setDistance(response.data.distance);
      console.log(`Distance: ${distance} km`);
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
  };

  const bookDrive = async () => {
    try {
      await GetNonce();
      const sendValue = ethers.parseEther(distance.toString()); 
      console.log("Booking drive with the following details:");
      console.log("Driver Address:", DriverAddress);
      console.log("Rider Address:", RiderAddress);
      console.log("Send Value:", sendValue.toString());

      await smartContract.bookDrive(DriverAddress, { value: sendValue, nonce: Nonce });
      console.log("Drive booked successfully!");
    } catch (err) {
      console.error("Error booking drive:", err);
      alert("Error booking drive!");
    }
  };

  const completeDrive = async () => {
    try {
      await GetNonce();
      console.log("Completing drive with the following details:");
      await smartContract.completeDrive(DriverAddress, { nonce: Nonce });
      console.log("Drive completed successfully!");
      
      const rideCost = ethers.parseEther(distance.toString()); 
      const gasFee = ethers.parseUnits('4', 'gwei') * 3000000;

      setRideCost(ethers.formatEther(rideCost));
      setGasFee(ethers.formatUnits(gasFee, 'gwei'));

      setIsDriveEnded(true);

      const balance = await provider.getBalance(RiderAddress);
      const formattedBalance = ethers.formatEther(balance);
      console.log(`Your ETH balance: ${formattedBalance} ETH`);
    } catch (err) {
      console.error("Error completing drive:", err);
      alert("Error completing drive");
    }
  };

  const handleEndDrive = () => {
    completeDrive();
    console.log('End Drive');
  };

  return (
    <div className="container">
      <h1 className="headline">UberDrive - Escrow Contract</h1>
      <div className="side-by-side">
        <div className="box">
          <h2>Recipe</h2>
          {isDriveEnded ? (
            <div>
              <p><strong>Driver Address:</strong> {DriverAddress}</p>
              <p><strong>Rider Address:</strong> {RiderAddress}</p>
              <p><strong>Ride Cost:</strong> {rideCost} ETH</p>
              <p><strong>Gas Fee:</strong> {gasFee} Gwei</p>
            </div>
          ) : (
            <div style={{ marginTop: 'auto' }}>
              <p>No ride details available. Please complete a ride first.</p>
            </div>
          )}
        </div>
        <div className="box">
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>RIDER WALLET ADDRESS</label>
              <input
                type="text"
                value={RiderAddress}
                onChange={(e) => setRiderAddress(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>RIDER PRIVATE KEY</label>
              <input
                type="password"
                value={RiderPrivateKey}
                onChange={(e) => setRiderPrivateKey(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>DRIVER WALLET ADDRESS</label>
              <input
                type="text"
                value={DriverAddress}
                onChange={(e) => setDriverAddress(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>WHERE I AM</label>
              <input
                type="text"
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>WHERE I WANT TO GO</label>
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit">START DRIVE</button>
              <button type="button" className="end-drive-btn" onClick={handleEndDrive}>END DRIVE</button>
            </div>
          </form>
        </div>
      </div>
      <div className="signature">© 2024 Eliya Shlomo</div>
    </div>
  );
};

export default HomePage;
