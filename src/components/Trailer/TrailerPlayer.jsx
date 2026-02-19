import React from 'react';
import YouTube from 'react-youtube';
import { X } from 'lucide-react';
import './TrailerPlayer.css';

const TrailerPlayer = ({ videoKey, onClose }) => {
    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    if (!videoKey) return null;

    return (
        <div className="trailerPlayer">
            <div className="trailerPlayer__content">
                <button className="trailerPlayer__close" onClick={onClose}>
                    <X size={32} />
                </button>
                <div className="trailerPlayer__video">
                    <YouTube videoId={videoKey} opts={opts} />
                </div>
            </div>
            <div className="trailerPlayer__overlay" onClick={onClose}></div>
        </div>
    );
};

export default TrailerPlayer;
