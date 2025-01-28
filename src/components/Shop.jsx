import React, { useState } from "react";
import Web3 from "web3";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Backend URL

export default function Shop() {
  const [status, setStatus] = useState("");

  const RPC_URL = "https://rpc.testnet.immutable.com"; // Immutable zkEVM testnet RPC URL
  const TOKEN_CONTRACT_ADDRESS = "0xd9c159a9c2fdeed9a1750681cf1af13e16cdfa1d";
  const TOKEN_ABI = [
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      type: "function",
    },
  ];

  const CHAIN_ID = 13473; // Immutable zkEVM testnet chain ID
  const FIXED_WALLET_ADDRESS = "0x6F3E3D58ED302345d680Fe512Df7c738Cc4B8A20";
  const FIXED_AMOUNT = 5; // Assuming the price is 5 COX

  // const MINT_API_URL = `${BACKEND_URL}mint_nft`; // Flask API endpoint
  const MINT_API_URL = "https://api.cryptoquest.studio/BPR/mint_nft"; // Flask API endpoint

  const handleTransfer = async () => {
    try {
      if (!window.ethereum) {
        setStatus("MetaMask is not installed.");
        return;
      }

      setStatus("Connecting to MetaMask...");
      const web3 = new Web3(window.ethereum);

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // Ensure the user is connected to the correct chain
      let chainId = await web3.eth.getChainId();
      chainId = Number(chainId);
      if (chainId !== CHAIN_ID) {
        setStatus(`Please switch to the correct chain (ID: ${CHAIN_ID}).`);
        return;
      }

      const contract = new web3.eth.Contract(TOKEN_ABI, TOKEN_CONTRACT_ADDRESS);

      // Convert amount to smallest unit (using toWei)
      const value = web3.utils.toWei(FIXED_AMOUNT.toString(), "ether");

      setStatus("Preparing transaction...");
      const gasPrice = await web3.eth.getGasPrice();

      // Estimate gas
      const gasLimit = await contract.methods
        .transfer(FIXED_WALLET_ADDRESS, value)
        .estimateGas({ from: account });

      // Send transaction
      const tx = await contract.methods
        .transfer(FIXED_WALLET_ADDRESS, value)
        .send({
          from: account,
          gas: gasLimit,
          gasPrice,
        });

      setStatus(`Transfer successful! Transaction hash: ${tx.transactionHash}`);

      // Send a mint request to the Flask API
      setStatus("Minting NFT...");
      const mintResponse = await fetch(MINT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerAddress: account }),
      });

      if (mintResponse.ok) {
        const mintResult = await mintResponse.json();
        setStatus(`NFT minted successfully! ${mintResult.message}`);
      } else {
        const errorResult = await mintResponse.json();
        setStatus(`Failed to mint NFT: ${errorResult.error}`);
      }
    } catch (error) {
      console.error(error);
      setStatus(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-gray-100 bg-opacity-25 p-4 rounded-lg shadow-md w-[400px]">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Buy NFT</h2>
          <img
            src="https://igodhackerr.github.io/sample/BPR.PNG"
            alt="NFT Image"
            className="w-40 h-40 mb-4"
          />
          <p className="text-lg mb-2">Price: 5 COX</p>
          <button
            onClick={handleTransfer}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Buy Now
          </button>
          {status && <p className="text-sm text-gray-600 mt-4">{status}</p>}
          <button
            onClick={() => (window.location.href = "/inventory")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Go to Inventory
          </button>
        </div>
      </div>
    </div>
  );
}
