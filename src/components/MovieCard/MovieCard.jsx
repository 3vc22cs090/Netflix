import React from 'react';
import { IMAGE_BASE_URL } from '../../services/api';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import './MovieCard.css';

const MovieCard = ({ movie, isLarge, onClick }) => {
    return (
        <div className={`movieCard ${isLarge && 'movieCard__large'}`} onClick={onClick}>
            <img
                className="movieCard__poster"
                src={`${IMAGE_BASE_URL}${isLarge ? movie.poster_path : movie.backdrop_path}`}
                alt={movie.name || movie.title}
            />
            <div className="movieCard__info">
                <div className="movieCard__icons">
                    <div className="movieCard__iconCircle play" onClick={(e) => { e.stopPropagation(); onClick(); }}>
                        <Play fill="currentColor" />
                    </div>
                    <div className="movieCard__iconCircle"><Plus /></div>
                    <div className="movieCard__iconCircle"><ThumbsUp /></div>
                    <div className="movieCard__iconCircle dropdown"><ChevronDown /></div>
                </div>
                <div className="movieCard__details">
                    <span className="movieCard__match">98% Match</span>
                    <span className="movieCard__rating">{movie.adult ? '18+' : '13+'}</span>
                    <span className="movieCard__duration">2h 15m</span>
                </div>
                <div className="movieCard__genres">
                    <span>Action</span>
                    <span className="dot">•</span>
                    <span>Thriller</span>
                    <span className="dot">•</span>
                    <span>Drama</span>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
