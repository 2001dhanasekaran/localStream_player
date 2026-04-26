import { useState, useEffect, useRef } from "react";
import FilePicker from "../FilePicker";
import ControlBar from "./ControlBar";
import useVideoPlayer from "../../customHooks/useVideoPlayer";
import useProgress from "../../customHooks/useProgress";
import useVolume from "../../customHooks/useVolume";
import useControlsVisibility from "../../customHooks/useControlsVisibility";
import useResumePlayback from "../../customHooks/useResumePlayback";
import useAudioEQ from "../equalizer/useAudioEQ";

// Main component for rendering the video player UI and handling its logic
export default function VideoPlayer() {
  const { videoRef, isPlaying, startPlayback, togglePlay, stopAnimation } =
    useVideoPlayer();
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const {
    progress,
    currentTime,
    duration,
    handleSeek,
    handleProgressUpdate,
    setProgress,
  } = useProgress(videoRef, isPlaying);

  const {
    volume,
    isMuted,
    showVolume,
    handleVolumeChange,
    toggleMute,
    handleVolumeKey,
  } = useVolume(videoRef);

  const containerRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [seekIndicator, setSeekIndicator] = useState(null);
  const seekOverlayTimer = useRef(null);

  const { showControls, showCursor, handleUserInteraction } =
    useControlsVisibility();

  const {
    savedTime,
    showResume,
    setShowResume,
    resumePlayback,
    restartPlayback,
    clearSavedProgress,
  } = useResumePlayback(videoRef, videoName, videoUrl);

  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const { setupAudio, changeBass, changeMid, changeTreble } =
    useAudioEQ(videoRef);

  // Handles file selection and sets video URL and name
  const handleFileSelect = (file) => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoName(file.name);
  };

  // Toggles play and pause state of the video
  const handlePlayPause = () => {
    setupAudio();
    togglePlay(handleProgressUpdate);
  };

  // Handles video metadata loading, end event, and fullscreen changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setProgress(100);
      stopAnimation();
      clearSavedProgress();
      setShowResume(false);
    };

    const handleFullScreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    video.addEventListener("ended", handleVideoEnd);

    return () => {
      video.removeEventListener("ended", handleVideoEnd);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      stopAnimation();
    };
  }, [videoUrl, videoName, setProgress, stopAnimation, clearSavedProgress]);

  // Toggles fullscreen mode for the video player
  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Handles keyboard shortcuts for video controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
      if (!videoRef.current) return;

      const video = videoRef.current;

      switch (event.key.toLowerCase()) {
        case " ":
          event.preventDefault();
          handlePlayPause();
          handleUserInteraction();
          break;
        case "arrowright":
          video.currentTime += 5;
          break;
        case "arrowleft":
          video.currentTime -= 5;
          break;
        case "arrowup":
          handleVolumeKey("up");
          break;
        case "arrowdown":
          handleVolumeKey("down");
          break;
        case "f":
          toggleFullScreen();
          break;
        case "m":
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handlePlayPause,
    toggleFullScreen,
    toggleMute,
    handleVolumeKey,
    handleUserInteraction,
  ]);

  // Cleans up timers on component unmount
  useEffect(() => {
    return () => {
      clearTimeout(seekOverlayTimer.current);
    };
  }, []);

  // Handles double-click to seek video forward or backward
  const handleDoubleClick = (event) => {
    if (!videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    const containerWidth = containerRef.current.clientWidth;
    const clickPosition = event.clientX;

    if (clickPosition < containerWidth / 2) {
      video.currentTime -= 10;
      setSeekIndicator("Backward");
    } else {
      video.currentTime += 10;
      setSeekIndicator("Forward");
    }

    if (seekOverlayTimer.current) {
      clearTimeout(seekOverlayTimer.current);
    }

    seekOverlayTimer.current = setTimeout(() => {
      setSeekIndicator(null);
    }, 800);
  };

  // Sets the playback speed of the video
  const handlePlaybackSpeed = (speed) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  // Pauses video when resume prompt is shown
  useEffect(() => {
    if (showResume && videoRef.current) videoRef.current.pause();
  }, [showResume]);

  return (
    <div
      className="w-100 h-100 position-relative"
      ref={containerRef}
      onMouseMove={handleUserInteraction}
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      style={{ cursor: showCursor ? "default" : "none" }}
    >
      <div className="w-100 h-100 bg-black d-flex justify-content-center align-items-center overflow-hidden">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-100 h-100"
            style={{ objectFit: "contain" }}
            onClick={handlePlayPause}
            onDoubleClick={handleDoubleClick}
          />
        ) : (
          <FilePicker onFileSelect={handleFileSelect} />
        )}
        {showVolume && (
          <div
            className="position-absolute top-0 end-0 text-white m-3 px-4 py-2 rounded"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(10px)",
              zIndex: 20,
            }}
          >
            Volume {volume}%
          </div>
        )}
        {seekIndicator && (
          <div
            className="position-absolute top-50 translate-middle-y text-white rounded-circle d-flex justify-content-center align-items-center"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(5px)",
              zIndex: 20,
              width: "70px",
              height: "70px",
              left: seekIndicator === "Forward" ? "80%" : "20%",
            }}
          >
            <div>{seekIndicator === "Forward" ? "+10s" : "-10s"}</div>
          </div>
        )}
        <div
          className="position-absolute top-50 start-50 translate-middle text-center"
          style={{
            zIndex: 20,
            display: showResume ? "block" : "none",
          }}
        >
          <button
            className="btn btn-dark"
            onClick={() => {
              resumePlayback();
              startPlayback(handleProgressUpdate);
            }}
          >
            Resume
          </button>
          <button
            className="btn btn-secondary ms-3"
            onClick={() => {
              restartPlayback();
              startPlayback(handleProgressUpdate);
            }}
          >
            Start Over
          </button>
        </div>
      </div>
      <ControlBar
        videoRef={videoRef}
        togglePlay={handlePlayPause}
        isPlaying={isPlaying}
        progress={progress}
        duration={duration}
        handleSeek={handleSeek}
        currentTime={currentTime}
        volume={volume}
        isMuted={isMuted}
        toggleMute={toggleMute}
        handleVolumeChange={handleVolumeChange}
        toggleFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen}
        showControls={showControls}
        playbackSpeed={playbackSpeed}
        handlePlaybackSpeed={handlePlaybackSpeed}
        handleUserInteraction={handleUserInteraction}
        changeBass={changeBass}
        changeMid={changeMid}
        changeTreble={changeTreble}
      />
    </div>
  );
}
