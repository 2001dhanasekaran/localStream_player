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

        video.addEventListener("loadedmetadata", setVideoDuration);
        video.addEventListener("ended", handleVideoEnd);

        return () => {
            video.removeEventListener("loadedmetadata", setVideoDuration);
            video.removeEventListener("ended", handleVideoEnd);
            cancelAnimationFrame(animationRef.current);
        };
    }, [videoUrl]);

    const handleSeek = (value) => {
        if (!videoRef.current) return;

        const time = (value / 100) * duration;
        videoRef.current.currentTime = time;
        setProgress(value);
    }

    return (
        <div className="w-100 h-100 d-flex flex-column"> 
            <div className="flex-grow-1 bg-black d-flex justify-content-center align-items-center overflow-hidden">                {videoUrl ? (
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
            />
        </div>
    );
}