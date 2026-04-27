import { useEffect } from "react";
import { useCallback, useRef } from "react";
export default function useAudioEQ(videoRef) {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const bassRef = useRef(null);
  const midRef = useRef(null);
  const trebleRef = useRef(null);

  const setupAudio = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (audioContextRef.current) {
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioCtx();
    const source = audioContext.createMediaElementSource(video);

    const bass = audioContext.createBiquadFilter();
    bass.type = "lowshelf";
    bass.frequency.value = 200;

    const mid = audioContext.createBiquadFilter();
    mid.type = "peaking";
    mid.frequency.value = 1000;

    const treble = audioContext.createBiquadFilter();
    treble.type = "highshelf";
    treble.frequency.value = 3000;

    source.connect(bass);
    bass.connect(mid);
    mid.connect(treble);
    treble.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    sourceRef.current = source;
    bassRef.current = bass;
    midRef.current = mid;
    trebleRef.current = treble;
    await audioContext.resume();
  }, [videoRef]);

  const changeBass = useCallback((value) => {
    if (bassRef.current) {
      bassRef.current.gain.value = value;
    }
  }, []);

  const changeMid = useCallback((value) => {
    if (midRef.current) {
      midRef.current.gain.value = value;
    }
  }, []);

  const changeTreble = useCallback((value) => {
    if (trebleRef.current) {
      trebleRef.current.gain.value = value;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    setupAudio,
    changeBass,
    changeMid,
    changeTreble,
  };
}
