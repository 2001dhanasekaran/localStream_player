import { useState, useRef, useCallback, useEffect } from "react";

export default function useControlsVisibility() {
  const [showControls, setShowControls] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const controlsTimeoutRef = useRef(null);

  const clearTimer = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const startHideTimer = useCallback(() => {
    clearTimer();
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
      setShowCursor(false);
    }, 3000);
  }, []);

  const handleUserInteraction = useCallback(() => {
    setShowControls(true);
    setShowCursor(true);
    startHideTimer();
  }, [startHideTimer]);

  useEffect(() => {
    startHideTimer();
    return () => clearTimer();
  }, [startHideTimer]);

  return { showControls, showCursor, handleUserInteraction };
}
