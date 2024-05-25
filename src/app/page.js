'use client';
import React, { useState, useEffect } from 'react';
import './page.css'; 
import { config } from 'dotenv';
config();import { ethers } from 'ethers';
import { contract } from './contract.js';
import axios from 'axios';

const HomePage = () => {
  const [driverAddress, setDriverAddress] = useState('');
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [signer, setSigner] = useState();
  const [distance, setDistance] = useState(null);
  const [smartContract, setSmartContract] = useState(null); // Define smartContract state

  useEffect(() => {
    connectToMetamask(); // Call connectToMetamask function
  }, []);

  const connectToMetamask = async () => {
    try {
      const provider = new ethers.BrowserProvider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setSigner(signer);
      console.log("Account:", await signer.getAddress());
      const contractInstance = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
      );
      setSmartContract(contractInstance); // Set smartContract state
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await processFormData({
      driverAddress,
      originAddress,
      destinationAddress
    });
    bookDrive();
  };

  const processFormData = async (formData) => {
    try {
      const response = await axios.get('./api/getDistance', {
        params: {
          origin: formData.originAddress,
          destination: formData.destinationAddress
        }
      });
      const distance = response.data.distance; // Adjust this based on the actual structure of the response

      // Update the state with the distance
      setDistance(response.data.distance);
      console.log(`Distance: ${distance} km`);
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
  };

  const bookDrive = async () => {
    try {
      console.log("ditance is it:",distance);
      const sendValue = ethers.parseEther(distance.toString()); // Convert distance to ether
      console.log("sendvalue is:" ,sendValue);
      const riderAddress = await signer.getAddress(); // Get rider's address from MetaMask signer
      console.log("Booking drive with the following details:");
      console.log("Driver Address:", driverAddress);
      console.log("Rider Address:", riderAddress);
      console.log("Send Value:", sendValue.toString());
      await smartContract.bookDrive(driverAddress, riderAddress, sendValue); // Call bookDrive function
      console.log("Drive booked successfully!");
    } catch (err) {
      console.error("Error booking drive:", err);
      alert("Error booking drive!");
    }
  };

  const completeDrive = async () => {
    try {
      const sendValue = ethers.parseEther(distance.toString()); // Convert distance to ether
      console.log("Completing drive with the following details:");
      console.log("Rider Address:", signer);
      console.log("Send Value:", sendValue.toString());
      await smartContract.completeDrive(1, sendValue); // Call completeDrive function
      console.log("Drive completed successfully!");
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
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>DRIVER WALLET ADDRESS</label>
          <input
            type="text"
            value={driverAddress}
            onChange={(e) => setDriverAddress(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>ORIGIN ADDRESS</label>
          <input
            type="text"
            value={originAddress}
            onChange={(e) => setOriginAddress(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>DESTINATION ADDRESS</label>
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
  );
};


export default HomePage;




