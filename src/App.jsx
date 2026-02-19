import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Row from './components/Row/Row';
import TrailerPlayer from './components/Trailer/TrailerPlayer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { requests, fetchMovieVideos } from './services/api';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function NetflixLandingPage({ onPlay, videoKey, setVideoKey }) {
  return (
    <div className="app">
      <Header />
      <Hero onPlay={onPlay} />

      <div className="app__rows">
        <Row
          title="NETFLIX ORIGINALS"
          fetchUrl={requests.fetchNetflixOriginals}
          isLargeRow
          onMovieClick={onPlay}
        />
        <Row title="Trending Now" fetchUrl={requests.fetchTrending} onMovieClick={onPlay} />
        <Row title="New & Popular" fetchUrl={requests.fetchTopRated} onMovieClick={onPlay} />
        <Row title="Recommended Videos" fetchUrl={requests.fetchNetflixOriginals} onMovieClick={onPlay} />
        <Row title="Top Rated" fetchUrl={requests.fetchTopRated} onMovieClick={onPlay} />
        <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} onMovieClick={onPlay} />
        <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} onMovieClick={onPlay} />
        <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} onMovieClick={onPlay} />
        <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} onMovieClick={onPlay} />
        <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} onMovieClick={onPlay} />
      </div>

      <TrailerPlayer videoKey={videoKey} onClose={() => setVideoKey(null)} />
    </div>
  );
}

function App() {
  const [videoKey, setVideoKey] = useState(null);

  const handlePlay = async (movie) => {
    if (videoKey) {
      setVideoKey(null);
    } else {
      const videos = await fetchMovieVideos(movie.id, movie.first_air_date ? 'tv' : 'movie');
      const trailer = videos.find(vid => vid.type === 'Trailer') || videos[0];
      if (trailer) {
        setVideoKey(trailer.key);
      } else {
        alert("Sorry, no trailer available for this title.");
      }
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <NetflixLandingPage
                onPlay={handlePlay}
                videoKey={videoKey}
                setVideoKey={setVideoKey}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
