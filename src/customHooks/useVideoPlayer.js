import { useRef, useState } from "react";

export default function useVideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef(null);

  const smoothProgressUpdate = (callBack) => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (!video.paused && video.duration) {
      callBack(video);
    }

    animationRef.current = requestAnimationFrame(() =>
      smoothProgressUpdate(callBack),
    );
  };

  const startPlayback = (callBack) => {
    if (!videoRef.current) return;

    videoRef.current.play();
    setIsPlaying(true);
    animationRef.current = requestAnimationFrame(() =>
      smoothProgressUpdate(callBack),
    );
  };

  const togglePlay = (callBack) => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      startPlayback(callBack);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      cancelAnimationFrame(animationRef.current);
    }
  };

  const stopAnimation = () => {
    cancelAnimationFrame(animationRef.current);
  };

  return {
    videoRef,
    isPlaying,
    startPlayback,
    togglePlay,
    stopAnimation,
  };
}
