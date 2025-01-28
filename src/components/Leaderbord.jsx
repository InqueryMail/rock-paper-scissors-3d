import React, { useEffect, useState } from "react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leaderboard data from the API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          "https://api.cryptoquest.studio/lead/leaderboard"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        setLeaderboard(data.leaderboard);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-lg font-medium py-8">
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg py-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
      <div className="overflow-x-auto bg-gray-100 bg-opacity-25 p-4 rounded-lg ">
        <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                Rank
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                User Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                Wallet Address
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                Wins
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-white hover:bg-gray-50"
                    : "bg-gray-50 hover:bg-gray-100"
                }
              >
                <td className="py-3 px-4 text-sm text-gray-700 font-medium">
                  {index + 1}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {entry.userName}
                </td>
                <td
                  className="py-3 px-4 text-sm text-gray-700 truncate"
                  title={entry.walletAddress}
                >
                  {entry.walletAddress}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {entry.wins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
