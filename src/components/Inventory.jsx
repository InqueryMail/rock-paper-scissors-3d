import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Inventory() {
  const [walletAddress, setWalletAddress] = useState("");
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedWalletAddress = localStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  // Function to fetch assets from the Flask backend
  const fetchAssets = async () => {
    if (!walletAddress) {
      setError("Wallet address is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://api.cryptoquest.studio/invt/fetch-assets",
        {
          walletAddress: walletAddress,
        }
      );

      if (response.data.assets) {
        setAssets(response.data.assets);
      } else {
        setError("No assets found");
      }
    } catch (error) {
      setError("An error occurred while fetching assets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      {/* <div className="bg-gray-100 bg-opacity-25 p-4 rounded-lg shadow-md max-w-md"></div> */}
      <div className="bg-gray-100 bg-opacity-25 rounded-lg shadow-md w-[400px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Player Inventory
        </h1>
        <div className="mb-6">
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchAssets}
              className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Fetch Assets
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-center text-lg text-gray-500">Loading...</p>
        )}
        {error && <p className="text-center text-red-500 text-lg">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.length > 0 ? (
            assets.map((asset, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
              >
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{asset.name}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  {asset.description}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Token ID:</strong> {asset.token_id}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Contract:</strong> {asset.contract_address}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No assets found for this wallet address.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
