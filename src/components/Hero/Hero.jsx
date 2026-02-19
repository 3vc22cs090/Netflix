import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { fetchMovies, requests, IMAGE_BASE_URL, fetchMovieVideos } from '../../services/api';
import './Hero.css';

const Hero = ({ onPlay }) => {
    const [movie, setMovie] = useState(null);
    const [trailerKey, setTrailerKey] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const movies = await fetchMovies(requests.fetchNetflixOriginals);
            const featured = movies[Math.floor(Math.random() * movies.length)] || movies[0];
            setMovie(featured);

            if (featured) {
                const videos = await fetchMovieVideos(featured.id, 'tv');
                const trailer = videos.find(v => v.type === 'Trailer') || videos[0];
                if (trailer) {
                    setTrailerKey(trailer.key);
                    // Show video after a short delay
                    setTimeout(() => setShowVideo(true), 3000);
                }
            }
        }
        fetchData();
    }, []);

    const videoOptions = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            mute: 1,
            loop: 1,
        },
    };

    function truncate(str, n) {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    }

    if (!movie) return <div className="hero" style={{ height: '80vh', backgroundColor: '#111' }} />;

    return (
        <header className="hero">
            {showVideo && trailerKey ? (
                <div className="hero__videoContainer">
                    <YouTube
                        videoId={trailerKey}
                        opts={videoOptions}
                        className="hero__video"
                        onEnd={(e) => e.target.playVideo()} // Loop
                    />
                </div>
            ) : (
                <div
                    className="hero__image"
                    style={{
                        backgroundImage: `url(${IMAGE_BASE_URL}${movie?.backdrop_path})`,
                    }}
                />
            )}

            <div className="hero__contents">
                <h1 className="hero__title">
                    {movie?.title || movie?.name || movie?.original_name}
                </h1>

                <div className="hero__buttons">
                    <button className="hero__button play" onClick={() => onPlay(movie)}>
                        <Play fill="currentColor" /> Play
                    </button>
                    <button className="hero__button info">
                        <Info /> More Info
                    </button>
                    {showVideo && (
                        <button className="hero__mute" onClick={() => setIsMuted(!isMuted)}>
                            {isMuted ? <VolumeX /> : <Volume2 />}
                        </button>
                    )}
                </div>

                <h1 className="hero__description">{truncate(movie?.overview, 150)}</h1>
            </div>

            <div className="hero--fadeBottom" />
        </header>
    );
};

export default Hero;
