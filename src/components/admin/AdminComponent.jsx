import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL_CRUD = import.meta.env.VITE_BACKEND_URL_CRUD; // 5001

export default function AdminComponent() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL_CRUD}/users`);
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
        `${BACKEND_URL_CRUD}/users/${walletAddress}`,
        {
          username: newUsername,
        }
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
        `${BACKEND_URL_CRUD}/users/${walletAddress}`
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
}
