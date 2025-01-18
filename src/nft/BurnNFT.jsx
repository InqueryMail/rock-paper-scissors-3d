import React, { useState } from "react";
import Web3 from "web3";
import { ABI } from "./ERC721-ABI";

const BurnNFTComponent = () => {
  const [status, setStatus] = useState("");
  const [tokenIds, setTokenIds] = useState(""); // Input field for token IDs

  const RPC_URL = "https://rpc.testnet.immutable.com";
  const CONTRACT_ADDRESS = "0x29f51c15546a1cf2d5145d75a11e1920c5c9d21a";
  const CHAIN_ID = 13473; // IMX testnet chain ID

  const abi = ABI;

  const handleBurn = async () => {
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
        console.log(chainId);
        console.log(CHAIN_ID);
        return;
      }

      const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

      // Prepare token IDs
      const tokenIdArray = tokenIds.split(",").map((id) => id.trim());

      setStatus("Preparing transaction...");
      const gasPrice = await web3.eth.getGasPrice();

      // Estimate gas
      const gasLimit = await contract.methods
        .burnBatch(tokenIdArray)
        .estimateGas({ from: account });

      const tx = await contract.methods.burnBatch(tokenIdArray).send({
        from: account,
        gas: gasLimit,
        gasPrice,
      });

      setStatus(
        `Burn transaction successful! Transaction hash: ${tx.transactionHash}`
      );
    } catch (error) {
      console.error(error);
      setStatus(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-gray-100 bg-opacity-25 p-4 rounded-lg shadow-md max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Burn NFTs
        </h2>
        <input
          type="text"
          placeholder="Enter token IDs (comma-separated)"
          value={tokenIds}
          onChange={(e) => setTokenIds(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
        />
        <button
          onClick={handleBurn}
          className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Burn NFTs
        </button>
        {status && (
          <p className="text-sm text-gray-600 mt-4 text-center">{status}</p>
        )}
      </div>
    </div>
  );
};

export default BurnNFTComponent;
