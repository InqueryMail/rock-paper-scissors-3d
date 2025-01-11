import React, { useState, useEffect } from "react";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [userInfo, setUserInfo] = useState("");
  const [walletStatus, setWalletStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState(""); // State to store the username

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
            checkUserAndLogin(address);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    }
    checkConnection();
  }, []);

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
        checkUserAndLogin(address); // Use checkUserAndLogin for manual connection as well
      } catch (error) {
        console.error("MetaMask connection error:", error);
        setErrorStatus("Failed to connect to MetaMask. Please try again.");
      }
    } else {
      setErrorStatus(
        "MetaMask is not installed. Please install it and try again."
      );
    }
  };

  const checkUserAndLogin = async (address) => {
    try {
      const response = await sendWalletAddress(address, null); // First check without username
      if (response.newUser) {
        const username = prompt("Welcome! Please enter your username:");
        if (username) {
          setUserName(username); // Update userName state
          const updatedResponse = await sendWalletAddress(address, username); // Send with username
          setUserInfo(`Welcome, ${updatedResponse.username}!`);
          setWalletStatus(`Wallet: ${address}`);
          setShowOptions(true);
          setIsConnected(true);
        }
      } else {
        // Existing user
        setUserInfo(`Welcome back, ${response.username}!`);
        setWalletStatus(`Wallet: ${address}`);
        setShowOptions(true);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setErrorStatus("Error checking user. Please try again.");
    }
  };

  const sendWalletAddress = async (address, username) => {
    // Use the parameter 'username'
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address, username }), // Send 'username'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to log in with wallet address."
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending wallet address:", error);
      setErrorStatus("Failed to save wallet address. Please try again.");
      throw error;
    }
  };

  const navigate = (route) => {
    window.location.href = route;
  };

  return (
    <div className="bg-gray-100 bg-opacity-25 p-4 rounded-lg shadow-md max-w-md ">
      <h1 className="text-3xl font-bold text-center mb-4">
        Welcome to Game Dashboard
      </h1>
      <div className="mb-4">
        {!isConnected && (
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
      {showOptions && (
        <div className="flex flex-col items-center">
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
        </div>
      )}
    </div>
  );
}

export default App;

// import React, { useState, useEffect } from "react";

// function Login() {
//   const [walletAddress, setWalletAddress] = useState(null);
//   const [username, setUsername] = useState("");
//   const [errorStatus, setErrorStatus] = useState("");
//   const [userInfo, setUserInfo] = useState("");
//   const [optionsVisible, setOptionsVisible] = useState(false);

//   useEffect(() => {
//     // Initial setup or cleanup if needed
//   }, []);

//   async function checkMetamaskInstalled() {
//     if (typeof window.ethereum !== "undefined") {
//       try {
//         const accounts = await ethereum.request({
//           method: "eth_requestAccounts",
//         });
//         setWalletAddress(accounts[0]);

//         let currentUsername = username;
//         if (!currentUsername) {
//           currentUsername = prompt("Please enter your username:");
//           if (currentUsername) {
//             setUsername(currentUsername);
//           }
//         }

//         localStorage.setItem("walletAddress", accounts[0]);

//         const response = await sendWalletAddress(accounts[0], currentUsername);

//         if (response.newUser) {
//           setUserInfo(`Welcome, ${response.username || currentUsername}!`);
//         } else {
//           setUserInfo(`Welcome back, ${response.username}!`);
//         }

//         setOptionsVisible(true);
//       } catch (error) {
//         console.error("MetaMask connection error:", error);
//         setErrorStatus("Failed to connect to MetaMask. Please try again.");
//       }
//     } else {
//       setErrorStatus(
//         "MetaMask is not installed. Please install it and try again."
//       );
//     }
//   }

//   async function sendWalletAddress(address, username) {
//     try {
//       const response = await fetch("http://localhost:5000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ walletAddress: address, username }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.error || "Failed to log in with wallet address."
//         );
//       }
//       return await response.json();
//     } catch (error) {
//       console.error("Error sending wallet address:", error);
//       setErrorStatus("Failed to save wallet address. Please try again.");
//     }
//   }

//   function navigate(route) {
//     window.location.href = route;
//   }

//   return (
//     <div className="login-container">
//       <h1 className="title">Welcome to Game Dashboard</h1>
//       <div className="metamask-status">
//         <button className="connect-btn" onClick={checkMetamaskInstalled}>
//           Connect with MetaMask
//         </button>
//         <p className="user-info">{userInfo}</p>
//         <p className="wallet-status">Wallet: {walletAddress}</p>
//         {errorStatus && <p className="error-status">{errorStatus}</p>}
//       </div>
//       {optionsVisible && (
//         <div className="options-container">
//           <button className="nav-btn" onClick={() => navigate("/rps")}>
//             Rock Paper Scessors
//           </button>
//           <button className="nav-btn" onClick={() => navigate("/check")}>
//             Tic Tac Toe
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Login;
