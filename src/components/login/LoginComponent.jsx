import React, { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Backend URL

export default function LoginComponent() {
  const [walletAddress, setWalletAddress] = useState(
    localStorage.getItem("walletAddress") || null
  );
  const [userInfo, setUserInfo] = useState("");
  const [walletStatus, setWalletStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [showOptions, setShowOptions] = useState(false); // Default false
  const [isConnected, setIsConnected] = useState(false); // Default false
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);

  // useEffect(() => {
  //   if (walletAddress && isConnected) {
  //     // setShowOptions(true); // Enable options only if user is logged in
  //   }
  // }, [walletAddress, isConnected]);

  useEffect(() => {
    async function checkConnection() {
      if (window.ethereum) {
        try {
          setLoading(true);
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            localStorage.setItem("walletAddress", address);
            await checkUserExists(address); // Check if user exists in backend
            setIsConnected(true);
            setLoading(false);
          } else {
            console.log("No wallet connected.");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
          setErrorStatus("Failed to check wallet connection.");
          setLoading(false);
        }
      } else {
        console.warn("MetaMask not detected.");
        setLoading(false);
      }
    }
    if (!walletAddress) checkConnection();
  }, [walletAddress]);

  const checkUserExists = async (address) => {
    try {
      const response = await fetch(`${BACKEND_URL}/check-user/${address}`);
      const data = await response.json();
      if (response.ok && data.exists) {
        setUserExists(true);
        setUserInfo(`Welcome back, ${data.username}!`);
        setProfileImageURL(data.profile_image);
        setShowOptions(true); // Enable options for existing users
      } else {
        setUserExists(false);
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      setErrorStatus("Failed to check user existence. Please try again.");
    }
  };

  const connectMetamask = async () => {
    setErrorStatus("");
    setUserInfo("");
    setLoading(true);

    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setWalletAddress(address);
        localStorage.setItem("walletAddress", address);
        await checkUserExists(address); // Check if user exists in backend
        setIsConnected(true);
        setIsMetaMaskConnected(true);
        setLoading(false);
      } catch (error) {
        console.error("MetaMask connection error:", error);
        setErrorStatus("Failed to connect to MetaMask. Please try again.");
        setLoading(false);
      }
    } else {
      console.error("MetaMask is not installed.");
      setErrorStatus(
        "MetaMask is not installed. Please install it and try again."
      );
      setLoading(false);
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    } else {
      console.warn("No file selected for profile image.");
    }
  };

  const handleSubmit = async () => {
    if (!userName || !profileImage || !walletAddress) {
      setErrorStatus("Please fill all fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("walletAddress", walletAddress);
    formData.append("username", userName);
    formData.append("profile_image", profileImage);

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to log in.");
      }

      const data = await response.json();
      setUserInfo(`Welcome, ${data.username}!`);
      setWalletStatus(`Wallet: ${walletAddress}`);
      setProfileImageURL(data.profile_image);
      setShowOptions(true); // Enable options after successful login
      setErrorStatus("");
      setUserExists(true);
    } catch (error) {
      setErrorStatus("Failed to save user data. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("walletAddress");
    setWalletAddress(null);
    setUserInfo("");
    setWalletStatus("");
    setErrorStatus("");
    setShowOptions(false);
    setIsConnected(false);
    setIsMetaMaskConnected(false);
    setUserName("");
    setProfileImage(null);
    setProfileImageURL("");
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-gray-100 bg-opacity-25 p-4 rounded-lg shadow-md max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome to Game Dashboard
        </h1>
        {loading ? (
          <div className="text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="w-full flex justify-center">
                {!isMetaMaskConnected && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={connectMetamask}
                  >
                    Connect with MetaMask
                  </button>
                )}
              </div>
              <p className="text-gray-700 mt-2">{userInfo}</p>
              <p className="text-gray-700">
                {isConnected && `Wallet: ${walletAddress}`}
              </p>
              {errorStatus && <p className="text-red-500">{errorStatus}</p>}
            </div>
            {!userExists && isConnected && (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Enter Username:
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Upload Profile Image:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="border p-2 w-full"
                    onChange={handleProfileImageChange}
                  />
                </div>
                <div className="w-full flex justify-center">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
            {profileImageURL && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Profile Image:</h3>
                <img
                  src={`${BACKEND_URL}/${profileImageURL}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full"
                />
              </div>
            )}
            {showOptions && (
              <div className="flex flex-col items-center mt-4">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
                  onClick={() => (window.location.href = "/rps")}
                >
                  Rock Paper Scissors
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => (window.location.href = "/admin")}
                >
                  Admin
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
