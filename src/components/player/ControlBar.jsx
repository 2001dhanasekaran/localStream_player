import { useEffect } from "react";
import { useState } from "react";

export default function ControlBar(
    { 
        togglePlay, 
        isPlaying, 
        progress, 
        duration, 
        handleSeek, 
        currentTime, 
        volume, 
        isMuted, 
        toggleMute, 
        handleVolumeChange, 
        toggleFullScreen,
        isFullScreen,
        showControls,
        playbackSpeed,
        handlePlaybackSpeed
    }
) {
    const [showSpeedMenu, setShowSpeedMenu]= useState(false);

    useEffect(()=>{
        const handleClickOutside = ()=>{
            setShowSpeedMenu(false);
        };

        if(showSpeedMenu){
            window.addEventListener("click", handleClickOutside);
        }

        return ()=>{
            window.addEventListener("click", handleClickOutside);
        }
    },[showSpeedMenu]);

    const formatTime = (time) => {
        if(!time || isNaN(time)) return "00:00:00";

        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        const h= hours.toString().padStart(2, '0');
        const m= minutes.toString().padStart(2, '0');
        const s= seconds.toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
    
    return (
        <div className="position-absolute bottom-0 start-0 w-100 bg-secondary p-2 align-items-center"
            style={{
                display: showControls ? "flex" : "none",
                zIndex: 10
            }}
        >
            <div className="d-flex align-items-center">
                <button className="btn btn-dark me-2" onClick={togglePlay}>
                    <i className={isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill"}></i>
                </button>
                <div className="d-flex align-items-center">
                    <button className="btn btn-dark me-2" onClick={toggleMute}>
                        <i className={
                            isMuted || volume === 0 
                                ? "bi bi-volume-mute-fill" 
                                : volume < 50 
                                ? "bi bi-volume-down-fill"
                                : "bi bi-volume-up-fill"
                            }>
                        </i>
                    </button>

                    <input 
                        type="range" className="form-range" 
                        min="0" max="100" value={volume} 
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                        style={{width: "100px"}}
                    />
                    <div className="ms-1">{volume}%</div>
                </div>
            </div>
            <div className="flex-grow-1 mx-3 mt-2">
                <input 
                    type="range" className="form-range" 
                    min="0" max="100" value={progress}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                />
            </div>
            <div className="text-white small me-3">
                {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div className="position-relative me-2">
                <button className="btn btn-dark" onClick={(e)=>
                    {
                        e.stopPropagation();
                        setShowSpeedMenu(prev=> !prev);
                    }
                }
                    >{playbackSpeed}x
                    <i className={`ms-2 ${showSpeedMenu? "bi bi-caret-up-fill":"bi bi-caret-down-fill"}`}></i>
                    </button>
                {showSpeedMenu && (
                    <div className="speed-container d-flex gap-2">
                        {[0.5, 1, 1.25, 1.5, 2].map((speed)=>(
                            <button 
                                key={speed} 
                                onClick={(e)=>
                                    {
                                        e.stopPropagation();
                                        handlePlaybackSpeed(speed);
                                    }
                                }
                                className={`speed-btn ${playbackSpeed===speed ? "active" : ""}`}
                            >
                                {speed}x
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <button className="btn btn-dark me-2" onClick={toggleFullScreen}>
                    <i className={isFullScreen ? "bi bi-fullscreen-exit" : "bi bi-fullscreen"}></i>
                </button>
            </div>
        </div>

    );
}