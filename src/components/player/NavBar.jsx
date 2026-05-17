import { useState, useEffect } from "react";
import logo from "../imgs/Local_stream_player_logo.png";

export default function NavBar({
  title,
  showControls,
  playbackSpeed,
  handlePlaybackSpeed,
  handleUserInteraction,
  changeBass,
  changeMid,
  changeTreble,
}) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showEQ, setShowEQ] = useState(false);
  const [bassValue, setBassValue] = useState(0);
  const [midValue, setMidValue] = useState(0);
  const [trebleValue, setTrebleValue] = useState(0);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSpeedMenu(false);
      setShowEQ(false);
    };
    if (showSpeedMenu) {
      window.addEventListener("click", handleClickOutside);
    }

    if (showEQ) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showSpeedMenu, showEQ]);

  return (
    <nav
      className="position-absolute top-0 start-0 w-100 p-2"
      style={{
        display: showControls ? "flex" : "none",
        flexDirection: "column",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(40px)",
        zIndex: 10,
      }}
      onMouseMove={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="d-flex align-items-center gap-2">
        <img
          className="rounded-circle"
          src={logo}
          alt="Logo"
          style={{ width: "30px" }}
        />
        <div>{title}</div>
      </div>
      <div className="position-absolute top-0 end-0 m-2 d-flex align-items-center gap-2">
        <button
          disabled={!title}
          className="btn btn-dark btn-sm me-2"
          onClick={(e) => {
            e.stopPropagation();
            handleUserInteraction();
            setShowEQ(false);
            setShowSpeedMenu((prev) => !prev);
          }}
        >
          {playbackSpeed}x
          <i
            className={`ms-2 ${
              showSpeedMenu ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"
            }`}
          />
        </button>
        {showSpeedMenu && (
          <div
            className={`speed-container d-flex flex-row p-2 gap-1 ${showSpeedMenu ? "show" : ""}`}
          >
            {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
              <button
                key={speed}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserInteraction();
                  handlePlaybackSpeed(speed);
                  setShowSpeedMenu(false);
                }}
                className={`speed-btn btn-sm ${
                  playbackSpeed === speed ? "active" : ""
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        )}
        {/* EQ */}
        <button
          disabled={!title}
          className="btn btn-dark btn-sm"
          onClick={() => {
            handleUserInteraction();
            setShowSpeedMenu(false);
            setShowEQ((prev) => !prev);
          }}
        >
          EQ
        </button>
      </div>
      {/* EQ Panel */}
      {showEQ && (
        <div
          className="position-absolute top-100 end-0 m-3 p-3 rounded"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            zIndex: 25,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            width: window.innerWidth < 576 ? "180px" : "220px",
          }}
        >
          <div className="text-white mb-2">Equalizer</div>

          <label className="text-white small">Bass</label>
          <span className="text-white small mx-3">{bassValue}</span>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={bassValue}
            className="form-range"
            onChange={(e) => {
              handleUserInteraction();
              const value = Number(e.target.value);
              setBassValue(value);
              changeBass(value);
            }}
          />

          <label className="text-white small">Mid</label>
          <span className="text-white small mx-3">{midValue}</span>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={midValue}
            className="form-range"
            onChange={(e) => {
              handleUserInteraction();
              const value = Number(e.target.value);
              setMidValue(value);
              changeMid(value);
            }}
          />

          <label className="text-white small">Treble</label>
          <span className="text-white small mx-3">{trebleValue}</span>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={trebleValue}
            className="form-range"
            onChange={(e) => {
              handleUserInteraction();
              const value = Number(e.target.value);
              setTrebleValue(value);
              changeTreble(value);
            }}
          />
        </div>
      )}
    </nav>
  );
}
