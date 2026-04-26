import { useState, useCallback, useEffect, useRef } from "react";

export default function useVolume(videoRef) {
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("volume");
    return savedVolume ? Number(savedVolume) : 100;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const volumeOverlayTimer = useRef(null);

  // Sync video element + persist volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
    localStorage.setItem("volume", volume);
  }, [volume, videoRef]);

  const showVolumeOverlay = useCallback(() => {
    setShowVolume(true);

    if (volumeOverlayTimer.current) {
      clearTimeout(volumeOverlayTimer.current);
    }

    volumeOverlayTimer.current = setTimeout(() => {
      setShowVolume(false);
    }, 1500);
  }, []);

  const handleVolumeChange = useCallback(
    (value) => {
      if (!videoRef.current) return;

      const video = videoRef.current;
      const newVolume = value / 100;
      video.volume = newVolume;
      setVolume(value);

      if (video.muted && newVolume > 0) {
        video.muted = false;
        setIsMuted(false);
      }
      showVolumeOverlay();
    },
    [showVolumeOverlay],
  );

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    showVolumeOverlay();
  }, [videoRef, showVolumeOverlay]);

  const handleVolumeKey = useCallback(
    (direction) => {
      if (!videoRef.current) return;

      if (direction === "up") {
        handleVolumeChange(Math.min(volume + 10, 100));
      } else if (direction === "down") {
        handleVolumeChange(Math.max(volume - 10, 0));
      }
    },
    [volume, handleVolumeChange],
  );

  useEffect(() => {
    return () => {
      clearTimeout(volumeOverlayTimer.current);
    };
  }, []);

  return {
    volume,
    isMuted,
    showVolume,
    handleVolumeChange,
    toggleMute,
    handleVolumeKey,
  };
}
