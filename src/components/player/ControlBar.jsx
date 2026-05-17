import { useEffect, useState } from "react";
import { formatTime } from "../../utils/formateTIme";

export default function ControlBar({
  title,
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
  handleUserInteraction,
}) {
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
          disabled={!title}
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
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <button
          disabled={!title}
          className="btn btn-dark btn-sm me-2"
          onClick={togglePlay}
        >
          <i className={isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill"} />
        </button>
        {/* Volume */}
        <button
          disabled={!title}
          className="btn btn-dark btn-sm me-2"
          onClick={toggleMute}
        >
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
          disabled={!title}
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
        {/* Fullscreen */}
        <div
          className="position-absolute end-0 me-2"
          title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          <button
            disabled={!title}
            className="btn btn-dark btn-sm"
            onClick={toggleFullScreen}
          >
            <i
              className={
                isFullScreen ? "bi bi-fullscreen-exit" : "bi bi-fullscreen"
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
}
