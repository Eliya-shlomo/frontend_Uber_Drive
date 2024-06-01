'use client';
import React, { useState, useEffect } from 'react';
import './page.css'; 
import { config } from 'dotenv';
config();
import { Wallet, ethers } from 'ethers';
import contract from './contract.json';
import axios from 'axios';




const HomePage = () => {
  const abi = contract.abi;
  const bytecode = contract.bytecode;

  const [SmartContractFactory, setSmartContractFactory] = useState('');
  const [RiderPrivateKey, setRiderPrivateKey] = useState('');
  const [RiderAddress, setRiderAddress] = useState('');
  const [DriverAddress, setDriverAddress] = useState('');
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [signer, setSigner] = useState();
  const [provider, setProvider] = useState();

  const [distance, setDistance] = useState(null);
  const [smartContract, setSmartContract] = useState(null); 
  const [Nonce, setNonce] = useState(0);
  const [RiderWallet, setRiderWallet] = useState(null);



  useEffect(() => {
    connectToMetamask(); 
  }, []);

  const connectToMetamask = async () => {
    try {
      // in case of using testnet blockchian as sopelia
      // const provider = new ethers.BrowserProvider(
      //   window.ethereum,
      //   "any"
      // );
      // await provider.send("eth_requestAccounts", []);

      // using localhost


      const provider = new ethers.WebSocketProvider("ws://127.0.0.1:8545");
      setProvider(provider);
      const signer = await provider.getSigner();
      setSigner(signer);
      console.log("Account:", await signer.getAddress());

    } catch (err) {
      console.error(err);
    }
  };


  const MakeRiderWallet = async() => {
    try {
      const Riderwallet = new ethers.Wallet(RiderPrivateKey,provider);
      setRiderWallet(Riderwallet)
    } catch (error) {
      console.error(err);
    }
  }

  
  const MakeContractFactory = async () =>{
    try {
      console.log("trying make a wallet");
      MakeRiderWallet();
      console.log("sucsses making a wallet");
      console.log("trying make a Smart Contract Factory");
      const SmartContractFactory =  new ethers.ContractFactory(
        abi,
        bytecode,
        RiderWallet
      );
      console.log("succsse makeing a Smart Contract Factory");
  
      setSmartContractFactory(SmartContractFactory);
    } catch (error) {
      console.log(error);
    }
  }


  const MakeContractInstance = async () => {

      try {
       
        await GetNonce(); 
        //set price for miners
        const overrides = {
          gasLimit: 3000000,
          gasPrice: ethers.parseUnits('4', 'gwei'),
          nonce: Nonce,
        };
  
        await GetNonce(); 
        console.log("Deploying contract...");
        const smartContract = await SmartContractFactory.deploy(RiderAddress, DriverAddress, overrides);
        await smartContract.deploymentTransaction().wait(2); // Wait for the transaction to be mined
        
        console.log('Contract deployed at address:', smartContract.address);
        setSmartContract(smartContract);
  
      } catch (error) {
        console.error('Error deploying contract:', error);
        return null;
      }
  };


  const GetNonce = async() => {
    try {
      console.log("trying getting nonce");
      const newNonce = Nonce + 1;
      console.log("success getting Nonce");
      setNonce(newNonce);  // Update the state with the new nonce value
      console.log("Nonce value is:" , Nonce);
    } catch (error) {
      console.log(error);
    }
  }




  const handleSubmit = async (event) => {
    event.preventDefault();
    await processFormData({
      originAddress,
      destinationAddress
    });

    //initialize generic way for contract facotry
    console.log("Trying make Factory");
    MakeContractFactory();
    console.log("success makeing Factory");


    bookDrive();
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
      await smartContract.bookDrive(DriverAddress,{value : sendValue , nonce: Nonce }); 
      console.log("Drive booked successfullyyy!");
    } catch (err) {
      console.error("Error booking drive:", err);
      alert("Error booking drive!");
    }
  };



  const completeDrive = async () => {
    try {
      await GetNonce();
      console.log("Completing drive with the following details:");
      await smartContract.completeDrive(DriverAddress , {nonce: Nonce}); 
      console.log("Drive completed successfully!");
      
      const balance = await provider.getBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
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
          <label>WHERE I AM </label>
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
  );
};


export default HomePage;




