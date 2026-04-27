import { useState, useEffect, useCallback } from "react";

export default function useProgress(videoRef, isPlaying, videoUrl) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleProgressUpdate = useCallback((video) => {
    if (!video?.duration) return;

    const percentProgress = (video.currentTime / video.duration) * 100;
    setProgress(percentProgress);
    setCurrentTime(video.currentTime);
  }, []);

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
  }, [videoUrl]);

  const handleSeek = useCallback(
    (value) => {
      const video = videoRef.current;
      if (!video?.duration) return;

      const time = (value / 100) * video.duration;
      video.currentTime = time;
      setProgress(value);
      setCurrentTime(time);
    },
    [videoRef],
  );

  return {
    progress,
    currentTime,
    duration,
    handleSeek,
    handleProgressUpdate,
    setProgress,
  };
}
