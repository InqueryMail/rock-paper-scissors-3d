// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Admin = () => {
//   const [users, setUsers] = useState([]);
//   const [walletAddress, setWalletAddress] = useState("");
//   const [username, setUsername] = useState("");
//   const [message, setMessage] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get("http://localhost:5001/users");
//       setUsers(response.data.users);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       setMessage("Failed to fetch users.");
//     }
//   };

//   const handleAddUser = async () => {
//     if (!walletAddress || !username) {
//       setMessage("Both Wallet Address and Username are required.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5001/users", {
//         wallet_address: walletAddress,
//         username,
//       });
//       setMessage(response.data.message);
//       fetchUsers();
//     } catch (error) {
//       console.error("Error adding user:", error);
//       setMessage("Failed to add user.");
//     }
//   };

//   const handleEditUser = async (walletAddress) => {
//     const newUsername = prompt("Enter new username:");
//     if (!newUsername) return;

//     try {
//       const response = await axios.put(
//         `http://localhost:5001/users/${walletAddress}`,
//         { username: newUsername }
//       );
//       setMessage(response.data.message);
//       fetchUsers();
//     } catch (error) {
//       console.error("Error editing user:", error);
//       setMessage("Failed to edit user.");
//     }
//   };

//   const handleDeleteUser = async (walletAddress) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:5001/users/${walletAddress}`
//       );
//       setMessage(response.data.message);
//       fetchUsers();
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       setMessage("Failed to delete user.");
//     }
//   };

//   const handleViewGameData = (walletAddress) => {
//     navigate(`/game-data/${walletAddress}`);
//   };

//   return (
//     <div>
//       <h1>User Management</h1>
//       <div>
//         <input
//           type="text"
//           placeholder="Wallet Address"
//           value={walletAddress}
//           onChange={(e) => setWalletAddress(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <button onClick={handleAddUser}>Add User</button>
//       </div>
//       <h2>Users</h2>
//       {message && <p>{message}</p>}
//       <ul>
//         {users.map((user) => (
//           <li key={user.wallet_address}>
//             <strong>{user.username}</strong> ({user.wallet_address})
//             <button onClick={() => handleEditUser(user.wallet_address)}>
//               Edit
//             </button>
//             <button onClick={() => handleDeleteUser(user.wallet_address)}>
//               Delete
//             </button>
//             <button onClick={() => handleViewGameData(user.wallet_address)}>
//               View Game Data
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Admin;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Failed to fetch users.");
    }
  };

  const handleEditUser = async (walletAddress) => {
    const newUsername = prompt("Enter new username:");
    if (!newUsername) return;

    try {
      const response = await axios.put(
        `http://localhost:5001/users/${walletAddress}`,
        { username: newUsername }
      );
      setMessage(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error("Error editing user:", error);
      setMessage("Failed to edit user.");
    }
  };

  const handleDeleteUser = async (walletAddress) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/users/${walletAddress}`
      );
      setMessage(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Failed to delete user.");
    }
  };

  const handleViewGameData = (walletAddress) => {
    navigate(`/game-data/${walletAddress}`);
  };

  return (
    <div className="bg-gray-100 bg-opacity-25 p-4 rounded-lg shadow-md h-full w-full flex items-center flex-col ">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <h2>Users</h2>
      {message && <p className="text-red-500">{message}</p>}
      <ul className="list-none">
        {users.map((user) => (
          <li key={user.wallet_address} className="mb-2">
            <strong className="text-lg">{user.username}</strong> (
            {user.wallet_address})
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditUser(user.wallet_address)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user.wallet_address)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => handleViewGameData(user.wallet_address)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
              >
                View Game Data
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
