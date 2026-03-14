import { useState, useEffect, useRef } from "react";
import FilePicker from "../FilePicker";
import ControlBar from "./ControlBar";

export default function VideoPlayer() {
    const videoRef = useRef(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const animationRef = useRef(null);  
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const containerRef = useRef(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef(null);

    const handleFileSelect = (file) => {
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
    }

    const smoothProgressUpdate = () => {
        if (!videoRef.current) return;
        
        const video = videoRef.current;

        if(!video.paused && video.duration){
            const percentProgress = (video.currentTime / video.duration) * 100;
            setProgress(percentProgress);
            setCurrentTime(video.currentTime);
        }

        animationRef.current = requestAnimationFrame(smoothProgressUpdate);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
            animationRef.current = requestAnimationFrame(smoothProgressUpdate);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
            cancelAnimationFrame(animationRef.current);
        }
    }


    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const setVideoDuration = () => {
            setDuration(video.duration);
        }

        const handleVideoEnd = () => {
            setProgress(100);
            setIsPlaying(false);
            cancelAnimationFrame(animationRef.current);
        }
        
        const handleFullScreenChange = () => {
            if(document.fullscreenElement){
                setIsFullScreen(true);
            } else {
                setIsFullScreen(false);
            }
        };
        
        document.addEventListener("fullscreenchange", handleFullScreenChange);
        video.addEventListener("loadedmetadata", setVideoDuration);
        video.addEventListener("ended", handleVideoEnd);
        videoRef.current.volume = volume / 100;

        return () => {
            video.removeEventListener("loadedmetadata", setVideoDuration);
            video.removeEventListener("ended", handleVideoEnd);
            cancelAnimationFrame(animationRef.current);
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
        };
    }, [videoUrl]);

    const handleSeek = (value) => {
        if (!videoRef.current) return;

        const time = (value / 100) * duration;
        videoRef.current.currentTime = time;
        setProgress(value);
    }


    const handleVolumeChange = (value) => {
        if (!videoRef.current) return;
        
        const video= videoRef.current;
        const newVolume = value / 100;

        video.volume = newVolume;
        setVolume(value);

        if(video.muted && newVolume > 0){
            video.muted = false;
            setIsMuted(false);
        }
    }

    const toggleMute = () => {
        if (!videoRef.current) return;
        
        const video= videoRef.current;

        video.muted= !video.muted;
        setIsMuted(video.muted);
    }

    const toggleFullScreen = () => {
        if(!containerRef.current) return;

        if(!document.fullscreenElement){
            containerRef.current.requestFullscreen();
        } else{
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.target.tagName === "INPUT") return;
            if (!videoRef.current) return;

            const video= videoRef.current;

            switch (event.key.toLowerCase()) {
                case " ":
                    event.preventDefault();
                    togglePlay();
                    break;
                case "arrowright":
                    video.currentTime+= 5;
                    break;
                case "arrowleft":
                    video.currentTime-= 5;
                    break;
                case "arrowup":
                    handleVolumeChange(Math.min(volume + 10, 100));
                    break;
                case "arrowdown":
                    handleVolumeChange(Math.max(volume - 10, 0));
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
    }, [volume, isMuted]);

    const handleMouseMove = () => {
        setShowControls(true);

        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    }

    return (
        <div ref={containerRef} onMouseMove={handleMouseMove} className="w-100 h-100 position-relative"> 
            <div className="w-100 h-100 bg-black d-flex justify-content-center align-items-center overflow-hidden">                
                {videoUrl ? (
                    <video 
                        ref={videoRef} src={videoUrl} 
                        className="w-100 h-100" 
                        style={{objectFit: "contain"}} 
                    />
                ) : (
                    <FilePicker onFileSelect={handleFileSelect} />
                )}
            </div>
            <ControlBar 
                videoRef={videoRef}
                togglePlay={togglePlay}
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
            />
        </div>
    );
}