import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./Game";
import Interface from "./Interface";
import Login from "./Login";
import Admin from "./Admin";
import GameData from "./GameData"; // Import GameData component
import notFoundImage from "../public/assets/404.png";

const App = () => {
  console.log("API Key:", import.meta.env.VITE_API_KEY); // Outputs: your_api_key_here
  console.log("API URL:", import.meta.env.VITE_API_URL); // Outputs: https://api.example.com
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/interface" element={<Interface />} />
        <Route
          path="/rps"
          element={
            <>
              <Game />
              <Interface />
            </>
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="/game-data/:walletAddress" element={<GameData />} />{" "}
        {/* Fixed */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

// Optional: A NotFound component for undefined routes
// const NotFound = () => {
//   return (
//     <div>
//       <h1>404 - Page Not Found</h1>
//       <p>The page you are looking for does not exist.</p>
//     </div>
//   );
// };

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 bg-opacity-25">
      {/* <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600">The page you are looking for does not exist.</p> */}
      <img
        src={notFoundImage}
        alt="404 Not Found"
        className="w-400 h-400 text-gray-400"
      />
    </div>
  );
};

export default App;
