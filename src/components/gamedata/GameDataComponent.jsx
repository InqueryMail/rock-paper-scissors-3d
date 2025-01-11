import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BACKEND_URL_CRUD = import.meta.env.VITE_BACKEND_URL_CRUD; // 5001

export default function GameDataComponent() {
  const { walletAddress } = useParams();
  const [gameData, setGameData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchGameData();
  }, []);

  const fetchGameData = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL_CRUD}/game-data/${walletAddress}`
      );
      setGameData(response.data.game_data);
    } catch (error) {
      console.error("Error fetching game data:", error);
      setMessage("Failed to fetch game data.");
    }
  };

  return (
    // <div className="bg-gray-100 p-4 rounded-lg shadow-md h-full">
    <div className="bg-gray-100 bg-opacity-25 p-4 rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4 w-full text-center">
        Game Data for Wallet: {walletAddress}
      </h1>
      {message && <p className="text-red-500">{message}</p>}
      {gameData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Mode</th>
              <th className="border border-gray-300 p-2">Rounds</th>
              <th className="border border-gray-300 p-2">Winner</th>
              <th className="border border-gray-300 p-2">Player Score</th>
              <th className="border border-gray-300 p-2">Computer Score</th>
              <th className="border border-gray-300 p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {gameData.map((data, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="border border-gray-300 p-2">{data.mode}</td>
                <td className="border border-gray-300 p-2">{data.rounds}</td>
                <td className="border border-gray-300 p-2">{data.winner}</td>
                <td className="border border-gray-300 p-2">
                  {data.player_score}
                </td>
                <td className="border border-gray-300 p-2">
                  {data.computer_score}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(data.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No game data available for this user.</p>
      )}
    </div>
  );
}
