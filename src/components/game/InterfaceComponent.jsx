import { useEffect, useState } from "react";
import useGame from "../../stores/useGame.js";

export default function InterfaceComponent() {
  const {
    mode,
    setMode,
    round,
    resetRound,
    restart,
    playerScore,
    setPlayerScore,
    computerScore,
    setComputerScore,
  } = useGame();

  /**
   * Mode
   */
  const [modeName, setModeName] = useState(mode);

  useEffect(() => {
    switch (mode) {
      case "threeWins":
        setModeName("Three Wins");
        break;
      case "fiveWins":
        setModeName("Five Wins");
        break;
      case "sevenWins":
        setModeName("Seven Wins");
        break;
      case "endless":
        setModeName("endless");
        break;
    }
  }, [mode]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const clearData = () => {
    window.localStorage.clear();
  };

  const handleRestart = () => {
    restart();
    resetRound();
    setPlayerScore(0);
    setComputerScore(0);
  };

  const [selectedMode, setSelectedMode] = useState(null);

  useEffect(() => {
    setSelectedMode(modeOptions.find((m) => m.name === mode));
  }, []);

  function handleModeClick(mode) {
    setSelectedMode(mode);
  }

  let modes = [
    { id: "0", text: "Three Wins", name: "threeWins" },
    { id: "1", text: "Five Wins", name: "fiveWins" },
    { id: "2", text: "Seven Wins", name: "sevenWins" },
    { id: "3", text: "Endless", name: "endless" },
  ];

  const modeOptions = modes.map((mode) => (
    <div
      key={mode.id}
      className={`mode-selection ${
        selectedMode && selectedMode.name === mode.name ? "selected-mode" : ""
      }`}
      onClick={() => {
        handleModeClick(mode);
        setMode(mode.name);
        window.localStorage.setItem("mode", mode.name);
        handleRestart();
      }}
    >
      {mode.text}
    </div>
  ));

  return (
    <>
      <div className="control-buttons">
        <div
          className="control-button"
          id="menu"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <img src="./icons/menu.svg" alt="menu" />
        </div>
      </div>
      <div className="score">
        <div className="individual-score">
          Round {round}
          <div className="mode-info">{modeName}</div>
        </div>
        <div className="individual-score">You: {playerScore}</div>
        <div className="individual-score">Computer: {computerScore}</div>
      </div>
      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Menu</div>

            <div className="modal-main">
              <div className="section-title">Mode</div>
              <div className="mode-area">{modeOptions}</div>
              <div className="section-title">Data</div>
              <div
                className="modal-button"
                onClick={() => {
                  clearData();
                  handleRestart();
                }}
              >
                Clear Data
              </div>
            </div>
            <div className="modal-about-area"></div>
          </div>
        </div>
      )}
    </>
  );
}
