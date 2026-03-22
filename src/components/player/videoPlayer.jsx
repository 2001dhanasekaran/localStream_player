import { useState, useEffect, useRef } from "react";
import FilePicker from "../FilePicker";
import ControlBar from "./ControlBar";

export default function VideoPlayer() {
    const videoRef = useRef(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [videoName, setVideoName]= useState(null);
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
    const [showCursor, setShowCursor] = useState(true);
    const [showVolume, setShowVolume] = useState(false);
    const volumeOverlayTimer = useRef(null);
    const [seekIndicator, setSeekIndicator] = useState(null);
    const seekOverlayTimer = useRef(null);
    const [playbackSpeed, setPlaybackSpeed]= useState(1);
    const [savedTime, setSavedTime]= useState(null);
    const [showResume, setShowResume]= useState(false);

    const handleFileSelect = (file) => {
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        setVideoName(file.name);
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

    const startPlayback=()=>{
        if(!videoRef.current) return;

        videoRef.current.play();
        setIsPlaying(true);
        animationRef.current=requestAnimationFrame(smoothProgressUpdate);
    }

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            startPlayback();
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

            const time= localStorage.getItem(videoName);

            if(time && Number(time)>5 && Number(time)< video.duration-5){
                setSavedTime(time);
                setShowResume(true);
            }
        };

        const handleVideoEnd = () => {
            setProgress(100);
            setIsPlaying(false);
            cancelAnimationFrame(animationRef.current);
            if(videoName) localStorage.removeItem(videoName);
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

    useEffect(()=>{
        if(!videoUrl) return;

        const interval= setInterval(()=>{
            if(videoRef.current && !videoRef.current.paused) {
                localStorage.setItem(videoName, videoRef.current.currentTime);
            }
        },2000);

        return(()=>clearInterval(interval));
    },[videoUrl]);

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
        showVolumeOverlay();
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        
        const video= videoRef.current;

        video.muted= !video.muted;
        setIsMuted(video.muted);
    };

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
                    handleVolumeChange(Math.min(video.volume * 100 + 10, 100));
                    break;
                case "arrowdown":
                    handleVolumeChange(Math.max(video.volume * 100 - 10, 0));
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
    }, []);

    const handleUserInteraction = () => {
        setShowControls(true);
        setShowCursor(true);

        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
            setShowCursor(false);
        }, 3000);
    };

    const showVolumeOverlay = () => {
        setShowVolume(true);

        if(volumeOverlayTimer.current){
            clearTimeout(volumeOverlayTimer.current);
        }

        volumeOverlayTimer.current = setTimeout(() => {
            setShowVolume(false);
        }, 3000);

    };

    useEffect(() => {
        return () => {
            clearTimeout(volumeOverlayTimer.current);
            clearTimeout(controlsTimeoutRef.current);
        };
    }, []);

    const handleDoubleClick = (event) => {
        if(!videoRef.current || !containerRef.current) return;

        const video = videoRef.current;
        const containerWidth = containerRef.current.clientWidth;
        const clickPosition = event.clientX;

        if(clickPosition < containerWidth / 2){
            video.currentTime -= 10;
            setSeekIndicator("Backward");
        } else {
            video.currentTime += 10;
            setSeekIndicator("Forward");
        }

        if(seekOverlayTimer.current){
            clearTimeout(seekOverlayTimer.current);
        }

        seekOverlayTimer.current= setTimeout(()=>{
            setSeekIndicator(null);
        },800);
    };

    const handlePlaybackSpeed=(speed)=>{
        if(!videoRef.current) return;

        videoRef.current.playbackRate= speed;
        setPlaybackSpeed(speed);
    };

    const handleResume=()=>{
        const video= videoRef.current;
        video.currentTime= savedTime;
        startPlayback(); 
        setShowResume(false);
    };

    const handleRestart=()=>{
        const video= videoRef.current;
        video.currentTime= 0;
        startPlayback();       
        setShowResume(false);
    };

    useEffect(()=>{
        if(showResume && videoRef.current) videoRef.current.pause();
    },[showResume]);

    return (
        <div className="w-100 h-100 position-relative"
            ref={containerRef} onMouseMove={handleUserInteraction} onClick={handleUserInteraction}
            style={{cursor: showCursor ? "default" : "none"}}
        >
            <div className="w-100 h-100 bg-black d-flex justify-content-center align-items-center overflow-hidden">                
                {videoUrl ? (
                    <video 
                        ref={videoRef} src={videoUrl} 
                        className="w-100 h-100" 
                        style={{objectFit: "contain"}}
                        onClick={togglePlay}
                        onDoubleClick={handleDoubleClick}
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
                playbackSpeed={playbackSpeed}
                handlePlaybackSpeed={handlePlaybackSpeed}
                handleUserInteraction={handleUserInteraction}
            />
            {showVolume && (
                <div className="position-absolute top-0 end-0 text-white px-3 py-2 m-3 rounded" 
                    style={
                        {
                            backgroundColor: "rgba(0,0,0,0.6)",
                            fontSize: "18px",
                            fontWeight: "500",
                            zIndex: 20,
                        }
                    }
                >
                    Volume: {volume}%
                </div>
            )}
            {seekIndicator && (
                <div className="position-absolute top-50 start-50 translate-middle text-white px-4 py-2 rounded d-flex align-items-center gap-2" 
                    style={
                        {
                            backgroundColor: "rgba(0,0,0,0.6)",
                            fontSize: "18px",
                            fontWeight: "500",
                            zIndex: 20,
                        }
                    }
                >
                    {seekIndicator === "Forward" ? (
                            <>
                                <i className="bi-fast-forward-fill fs-2"></i>
                                <span>10s</span>
                            </>
                        ) : (
                            <>
                                <i className="bi-rewind-fill fs-2"></i>
                                <span>10s</span>
                            </>
                    )}
                </div>
            )}
            {showResume && (
                <div className="position-absolute top-50 start-50 translate-middle text-center"
                    style={{
                        background: "rgba(0,0,0,0.7)",
                        padding: "20px",
                        borderRadius: "10px",
                        zIndex: 30
                    }}
                >
                    <div className="text-white mb-3">
                        Resume from {Math.floor(savedTime)}s ?
                    </div>
                    <div className="d-flex gap-3 justify-content-center">
                        <button className="btn btn-light" onClick={handleResume}>Resume</button>
                        <button className="btn btn-outline-light" onClick={handleRestart}>Start Over</button>
                    </div>
                </div>
            )}
        </div>
    );
}