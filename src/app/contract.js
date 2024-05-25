export const contract = { 
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi:  [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "rideId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "driver",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "rider",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "isCompleted",
            "type": "bool"
          }
        ],
        "name": "DriveBooked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "rideId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "driver",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "rider",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "isCompleted",
            "type": "bool"
          }
        ],
        "name": "DriveCompleted",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address payable",
            "name": "_driver",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "_rider",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_price",
            "type": "uint256"
          }
        ],
        "name": "bookDrive",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "rideId",
            "type": "uint256"
          }
        ],
        "name": "completeDrive",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "drives",
        "outputs": [
          {
            "internalType": "address payable",
            "name": "driver",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "rider",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isCompleted",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "drivesCounter",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    
}