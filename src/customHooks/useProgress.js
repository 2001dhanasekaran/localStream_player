import { useState, useEffect } from "react";

export default function useProgress(videoRef, isPlaying) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleProgressUpdate = (video) => {
    if (!video.duration) return;

    const percentProgress = (video.currentTime / video.duration) * 100;
    setProgress(percentProgress);
    setCurrentTime(video.currentTime);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setVideoDuration = () => {
      setDuration(video.duration);
    };

    video.addEventListener("loadedmetadata", setVideoDuration);

    return () => {
      video.removeEventListener("loadedmetadata", setVideoDuration);
    };
  }, [videoRef]);

  const handleSeek = (value) => {
    if (!video.duration) return;

    const time = (value / 100) * duration;
    videoRef.current.currentTime = time;
    setProgress(value);
    setCurrentTime(time);
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      handleProgressUpdate(videoRef.current);
    }
  }, [isPlaying]);

  return {
    progress,
    currentTime,
    duration,
    handleSeek,
    handleProgressUpdate,
    setProgress,
  };
}
