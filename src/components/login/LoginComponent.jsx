import React, { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Backend URL

export default function LoginComponent() {
  const [walletAddress, setWalletAddress] = useState(
    localStorage.getItem("walletAddress") || null
  );
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("userInfo") || ""
  );
  const [walletStatus, setWalletStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [showOptions, setShowOptions] = useState(
    localStorage.getItem("showOptions") === "true"
  );
  const [isConnected, setIsConnected] = useState(
    localStorage.getItem("isConnected") === "true"
  );
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(
    localStorage.getItem("isMetaMaskConnected") === "true"
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(
    localStorage.getItem("profileImageURL") || ""
  );

  useEffect(() => {
    setIsConnected(false);
  }, []);

  useEffect(() => {
    async function checkConnection() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            setIsConnected(true);
            localStorage.setItem("walletAddress", address);
            localStorage.setItem("isConnected", "true");
            console.log("Wallet already connected:", address);
          } else {
            console.log("No wallet connected.");
          }
        } catch (error) {
          console.error("Error checking connection:", error);
          setErrorStatus("Failed to check wallet connection.");
        }
      } else {
        console.warn("MetaMask not detected.");
      }
    }
    if (!walletAddress) checkConnection();
  }, [walletAddress]);

  const connectMetamask = async () => {
    setErrorStatus("");
    setUserInfo("");

    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);
        setIsMetaMaskConnected(true);
        localStorage.setItem("walletAddress", address);
        localStorage.setItem("isConnected", "true");
        localStorage.setItem("isMetaMaskConnected", "true");
        console.log("Wallet connected successfully:", address);
      } catch (error) {
        console.error("MetaMask connection error:", error);
        setErrorStatus("Failed to connect to MetaMask. Please try again.");
      }
    } else {
      console.error("MetaMask is not installed.");
      setErrorStatus(
        "MetaMask is not installed. Please install it and try again."
      );
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Profile image selected:", file.name);
      setProfileImage(file);
    } else {
      console.warn("No file selected for profile image.");
    }
  };

  const handleSubmit = async () => {
    if (!userName || !profileImage || !walletAddress) {
      setErrorStatus("Please fill all fields before submitting.");
      console.warn("Form submission failed: Missing fields.");
      return;
    }

    const formData = new FormData();
    formData.append("walletAddress", walletAddress);
    formData.append("username", userName);
    formData.append("profile_image", profileImage);

    try {
      console.log("Submitting form data to backend...");
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error response:", errorData);
        throw new Error(errorData.error || "Failed to log in.");
      }

      const data = await response.json();
      console.log("Login response from backend:", data);
      setUserInfo(`Welcome, ${data.username}!`);
      setWalletStatus(`Wallet: ${walletAddress}`);
      setProfileImageURL(data.profile_image);
      setShowOptions(true);
      setIsConnected(false);
      setIsMetaMaskConnected(true);
      setErrorStatus("");

      // Persist session data
      localStorage.setItem("userInfo", `Welcome, ${data.username}!`);
      localStorage.setItem("profileImageURL", data.profile_image);
      localStorage.setItem("showOptions", "true");
    } catch (error) {
      console.error("Error during submission:", error);
      setErrorStatus("Failed to save user data. Please try again.");
    }
  };

  const navigate = (route) => {
    console.log("Navigating to route:", route);
    window.location.href = route;
  };

  const logout = () => {
    console.log("Logging out...");

    // Clear localStorage
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("profileImageURL");
    localStorage.removeItem("showOptions");
    localStorage.removeItem("isConnected");
    localStorage.removeItem("isMetaMaskConnected");
    localStorage.removeItem("userName");

    // Reset all states
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

    console.log("User logged out.");
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-gray-100 bg-opacity-25 p-4 rounded-lg shadow-md max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome to Game Dashboard
        </h1>
        <div className="mb-4">
          {!isMetaMaskConnected && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={connectMetamask}
            >
              Connect with MetaMask
            </button>
          )}
          <p className="text-gray-700 mt-2">{userInfo}</p>
          <p className="text-gray-700">Wallet: {walletAddress}</p>
          {errorStatus && <p className="text-red-500">{errorStatus}</p>}
        </div>
        {isConnected && (
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
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
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
              onClick={() => navigate("/rps")}
            >
              Rock Paper Scissors
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate("/admin")}
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
      </div>
    </div>
  );
}
