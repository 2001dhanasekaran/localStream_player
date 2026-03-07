export default function ControlBar({ videoRef, togglePlay, isPlaying, progress, duration, handleSeek, currentTime }) {
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
        <div className="bg-secondary p-2 d-flex align-items-center justify-content-center">
            <div>
                <button className="btn btn-dark me-2" onClick={togglePlay}>
                    <i className={isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill"}></i>
                </button>
                <button className="btn btn-dark me-2">
                    <i className="bi bi-volume-up-fill"></i>
                </button>
            </div>
            <div className="flex-grow-1 mx-3">
                <input 
                    type="range" className="form-range" 
                    min="0" max="100" value={progress}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                />
            </div>
            <div className="text-white small me-3">
                {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div>
                <button className="btn btn-dark me-2">
                    <i className="bi bi-fullscreen"></i>
                </button>
            </div>
        </div>

    );
}