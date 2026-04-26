import { useState, useCallback, useEffect } from "react";

export default function useResumePlayback(videoRef, videoName, videoUrl) {
  const [savedTime, setSavedTime] = useState(null);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoName) return;

    const handleLoadedMetadata = () => {
      const savedTime = localStorage.getItem(videoName);

      if (
        savedTime &&
        Number(savedTime) > 5 &&
        Number(savedTime) < video.duration - 5
      ) {
        setSavedTime(savedTime);
        setShowResume(true);
      } else {
        setSavedTime(null);
        setShowResume(false);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoRef, videoName, videoUrl]);

  useEffect(() => {
    if (!videoUrl || !videoName) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video && !video.paused) {
        localStorage.setItem(videoName, video.currentTime);
      }
    }, 2000);
    return () => clearInterval(interval);

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
  }, [videoRef, videoName, videoUrl]);

  const resumePlayback = useCallback(() => {
    if (!videoRef.current || savedTime == null) return;
    videoRef.current.currentTime = savedTime;
    setShowResume(false);
  }, [videoRef, savedTime]);

  const restartPlayback = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setShowResume(false);
  }, [videoRef]);

  const clearSavedProgress = useCallback(() => {
    if (!videoName) return;
    localStorage.removeItem(videoName);
  }, [videoName]);

  return {
    savedTime,
    showResume,
    setShowResume,
    resumePlayback,
    restartPlayback,
    clearSavedProgress,
  };
}
