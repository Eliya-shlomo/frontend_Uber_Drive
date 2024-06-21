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
  const [provider, setProvider] = useState(null);
  const [distance, setDistance] = useState(null);
  const [smartContract, setSmartContract] = useState(null); 
  const [nonce, setNonce] = useState(0);
  const [RiderWallet, setRiderWallet] = useState(null);
  const [signer, setSigner] = useState(null);
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
      const currentNonce = await provider.getTransactionCount(riderWallet.address, 'latest');
      setNonce(currentNonce);
      console.log("Nonce when initialized:", currentNonce);

      // Set the signer after wallet creation
      const signer = riderWallet.connect(provider);
      setSigner(signer);

    } catch (error) {
      console.error("Error creating Rider Wallet:", error);
    }
  };

  const MakeContractFactory = async () => {
    try {
      console.log("Creating Smart Contract Factory");
      await MakeRiderWallet();  // Ensure the wallet is created before using it

      // Ensure signer is set after MakeRiderWallet
      if (!signer) {
        throw new Error("Signer is not set");
      }

      const smartContractFactory = new ethers.ContractFactory(abi, bytecode, signer);
      setSmartContractFactory(smartContractFactory);
      console.log("Smart Contract Factory created:", smartContractFactory);
    } catch (error) {
      console.error("Error creating Smart Contract Factory:", error);
    }
  };

  const MakeContractInstance = async () => {
    try {
      if (!SmartContractFactory) {
        throw new Error("SmartContractFactory is not set");
      }

      const overrides = {
        gasLimit: 3000000,
        gasPrice: ethers.parseUnits('4', 'gwei'),
        nonce: await provider.getTransactionCount(RiderWallet.address, 'latest'),
      };
      console.log("Deploying contract...");
      const smartContract = await SmartContractFactory.deploy(RiderAddress, DriverAddress, overrides);
      await smartContract.waitForDeployment();
      setNonce(prevNonce => prevNonce + 1);  // Increment nonce after using it
      console.log('Contract deployed at address:', smartContract.address);
      setSmartContract(smartContract);
      return smartContract;  // Return the smart contract instance
    } catch (error) {
      console.error('Error deploying contract:', error);
      throw error;  // Re-throw the error to handle it in handleSubmit
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

    // Ensure SmartContractFactory is set before proceeding
    if (SmartContractFactory) {
      try {
        const contractInstance = await MakeContractInstance();
        console.log("Smart Contract Factory created");
        await bookDrive(contractInstance);
      } catch (error) {
        console.error("Error creating contract instance:", error);
      }
    } else {
      console.error("SmartContractFactory was not created successfully");
    }
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

  const bookDrive = async (contractInstance) => {
    try {
      const sendValue = ethers.parseEther(distance.toString()); 
      console.log("Booking drive with the following details:");
      console.log("Driver Address:", DriverAddress);
      console.log("Rider Address:", RiderAddress);
      console.log("Send Value:", sendValue.toString());

      await contractInstance.bookDrive(DriverAddress, { value: sendValue, nonce: await provider.getTransactionCount(RiderWallet.address, 'latest') });
      setNonce(prevNonce => prevNonce + 1);  // Increment nonce after using it
      console.log("Drive booked successfully!");
    } catch (err) {
      console.error("Error booking drive:", err);
      alert("Error booking drive!");
    }
  };

  const completeDrive = async () => {
    try {
      console.log("Completing drive with the following details:");
      await smartContract.completeDrive(DriverAddress, { nonce: await provider.getTransactionCount(RiderWallet.address, 'latest') });
      setNonce(prevNonce => prevNonce + 1);  // Increment nonce after using it
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
