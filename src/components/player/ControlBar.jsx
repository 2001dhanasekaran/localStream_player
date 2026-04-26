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
      className="position-absolute bottom-0 start-0 w-100 bg-secondary p-2 d-flex align-items-center"
      style={{
        display: showControls ? "flex" : "none",
        zIndex: 10,
      }}
    >
      {/* Left Controls */}
      <div className="d-flex align-items-center flex-shrink-0">
        <button className="btn btn-dark me-2" onClick={togglePlay}>
          <i className={isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill"} />
        </button>

        <button className="btn btn-dark me-2" onClick={toggleMute}>
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
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          style={{ width: "100px" }}
        />

        <div className="ms-2 text-white">{volume}%</div>
      </div>

      {/* Progress Bar */}
      <div className="flex-grow-1 mx-3 mt-2" style={{ minWidth: 0 }}>
        <input
          type="range"
          className="form-range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => handleSeek(Number(e.target.value))}
        />
      </div>

      {/* Time */}
      <div className="text-white small me-3 flex-shrink-0">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Right Controls */}
      <div className="d-flex align-items-center flex-shrink-0">
        {/* Playback Speed */}
        <div className="position-relative me-2">
          <button
            className="btn btn-dark"
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
              className="speed-container d-flex gap-2 position-absolute bottom-100 end-0 mb-2"
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
                  className={`speed-btn ${
                    playbackSpeed === speed ? "active" : ""
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fullscreen */}
        <button className="btn btn-dark me-2" onClick={toggleFullScreen}>
          <i
            className={
              isFullScreen
                ? "bi bi-fullscreen-exit"
                : "bi bi-fullscreen"
            }
          />
        </button>

        {/* EQ */}
        <button
          className="btn btn-dark"
          onClick={() => setShowEQ((prev) => !prev)}
        >
          EQ
        </button>
      </div>

      {/* EQ Panel */}
      {showEQ && (
        <div
          className="position-absolute bottom-100 end-0 m-3 p-3 rounded"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            zIndex: 25,
            width: "220px",
          }}
        >
          <div className="text-white mb-2">Equalizer</div>

          <label className="text-white small">Bass</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            className="form-range"
            onChange={(e) => changeBass(Number(e.target.value))}
          />

          <label className="text-white small">Mid</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            className="form-range"
            onChange={(e) => changeMid(Number(e.target.value))}
          />

          <label className="text-white small">Treble</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            className="form-range"
            onChange={(e) => changeTreble(Number(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}