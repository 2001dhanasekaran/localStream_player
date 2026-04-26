import { useCallback } from "react";
import { useRef } from "react";
export default function useAudioEQ(videoRef) {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const bassRef = useRef(null);
  const midRef = useRef(null);
  const trebleRef = useRef(null);

  const setupAudio = useCallback(() => {
    if (audioContextRef.current) return;

    const video = videoRef.current;
    if (!video) return;

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
  }, [videoRef]);

  const changeBass = (value) => {
    if (bassRef.current) {
      bassRef.current.gain.value = value;
    }
  };

  const changeMid = (value) => {
    if (midRef.current) {
      midRef.current.gain.value = value;
    }
  };

  const changeTreble = (value) => {
    if (trebleRef.current) {
      trebleRef.current.gain.value = value;
    }
  };

  return {
    setupAudio,
    changeBass,
    changeMid,
    changeTreble,
  };
}
