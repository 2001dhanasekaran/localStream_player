import { useRef, useState, useCallback } from "react";

export default function useVideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef(null);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    cancelAnimationFrame(animationRef.current);
  }, []);

  const smoothProgressUpdate = useCallback((callBack) => {
    const video = videoRef.current;

    if (!video) return;

    if (!video.paused && video.duration) {
      callBack(video);
    }

    animationRef.current = requestAnimationFrame(() =>
      smoothProgressUpdate(callBack),
    );
  }, []);

  const startPlayback = useCallback(
    async (callBack) => {
      const video = videoRef.current;
      if (!video) return;

      try {
        stopAnimation();
        await video.play();
        setIsPlaying(true);
        animationRef.current = requestAnimationFrame(() =>
          smoothProgressUpdate(callBack),
        );
      } catch (error) {
        console.error("Error starting video playback:", error);
        return;
      }
    },
    [smoothProgressUpdate, stopAnimation],
  );

  const togglePlay = useCallback(
    (callBack) => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        startPlayback(callBack);
      } else {
        video.pause();
        setIsPlaying(false);
        stopAnimation();
      }
    },
    [startPlayback, stopAnimation],
  );

  return {
    videoRef,
    isPlaying,
    startPlayback,
    togglePlay,
    stopAnimation,
  };
}
