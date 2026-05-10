import { useEffect, useState } from "react";
import { formatTime } from "../../utils/formateTIme";

export default function ControlBar({
  togglePlay,
  isPlaying,
  progress,
  duration,
  handleSeek,
  currentTime,
  volume,
  isMuted,
  toggleMute,
  handleVolumeChange,
  toggleFullScreen,
  isFullScreen,
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
    };
    if (showSpeedMenu) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showSpeedMenu]);

  return (
    <div
      className="position-absolute bottom-0 start-0 w-100 p-2"
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
      {/* Progress Bar */}
      <div
        className="d-flex align-items-center flex-grow-1 mt-2"
        style={{ minWidth: 0 }}
      >
        {/* Current Time */}
        <div
          className="me-1 text-white small text-wrap"
          style={{ fontSize: "12px" }}
        >
          {formatTime(currentTime)}
        </div>
        <input
          type="range"
          className="form-range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => {
            handleUserInteraction();
            handleSeek(Number(e.target.value));
          }}
        />
        {/* Duration */}
        <div
          className="ms-1 text-white small text-wrap"
          style={{ fontSize: "12px" }}
        >
          {formatTime(duration)}
        </div>
      </div>
      {/* Left Controls */}
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <button className="btn btn-dark btn-sm me-2" onClick={togglePlay}>
          <i className={isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill"} />
        </button>

        <button className="btn btn-dark btn-sm me-2" onClick={toggleMute}>
          <i
            className={
              isMuted || volume === 0
                ? "bi bi-volume-mute-fill"
                : volume < 50
                  ? "bi bi-volume-down-fill"
                  : "bi bi-volume-up-fill"
            }
          />
        </button>

        <input
          type="range"
          className="form-range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => {
            handleUserInteraction();
            handleVolumeChange(Number(e.target.value));
          }}
          style={{ width: window.innerWidth < 576 ? "70px" : "100px" }}
        />

        <div className="ms-2 text-white">{volume}%</div>
        {/* Right Controls */}
        <div className="d-flex align-items-center flex-shrink-0">
          {/* Playback Speed */}
          <div className="position-relative me-2">
            <button
              className="btn btn-dark btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleUserInteraction();
                setShowSpeedMenu((prev) => !prev);
              }}
            >
              {playbackSpeed}x
              <i
                className={`ms-2 ${
                  showSpeedMenu
                    ? "bi bi-caret-up-fill"
                    : "bi bi-caret-down-fill"
                }`}
              />
            </button>

            {showSpeedMenu && (
              <div
                className={`speed-container d-flex flex-wrap gap-2 ${showSpeedMenu ? "show" : ""}`}
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
          </div>

          {/* EQ */}
          <button
            className="btn btn-dark btn-sm  me-2"
            onClick={() => setShowEQ((prev) => !prev)}
          >
            EQ
          </button>

          {/* Fullscreen */}
          <button className="btn btn-dark btn-sm" onClick={toggleFullScreen}>
            <i
              className={
                isFullScreen ? "bi bi-fullscreen-exit" : "bi bi-fullscreen"
              }
            />
          </button>
        </div>
      </div>

      {/* EQ Panel */}
      {showEQ && (
        <div
          className="position-absolute bottom-100 end-0 m-3 p-3 rounded"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            zIndex: 25,
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
    </div>
  );
}
