import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../../services/api';
import MovieCard from '../MovieCard/MovieCard';
import './Row.css';

const Row = ({ title, fetchUrl, isLargeRow, onMovieClick }) => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const movieResults = await fetchMovies(fetchUrl);
            setMovies(movieResults);
        }
        fetchData();
    }, [fetchUrl]);

    return (
        <div className="row">
            <h2 className="row__title">{title}</h2>
            <div className="row__posters">
                {movies.map((movie) => (
                    (isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path) ? (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            isLarge={isLargeRow}
                            onClick={() => onMovieClick(movie)}
                        />
                    ) : null
                ))}
            </div>
        </div>
    );
};

export default Row;
