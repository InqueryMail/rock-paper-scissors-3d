import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers"; // Assuming you're using Ethers.js

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        setLibrary(provider);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    };

    if (window.ethereum) {
      connectWallet();
    } else {
      console.error("No Ethereum provider found.");
    }
  }, []);

  return (
    <Web3Context.Provider value={{ library }}>{children}</Web3Context.Provider>
  );
};

export { Web3Context, Web3Provider };
