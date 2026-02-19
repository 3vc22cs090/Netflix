import axios from 'axios';

const API_KEY = "abc123";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const requests = {
  fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`,
};

const mockMovies = [
  { id: 1, title: "Stranger Things", backdrop_path: "/56v2Kj0sLzN3m3U3U3U3U3U3U3.jpg", overview: "A young boy vanishes a small town uncovers a mystery involving secret experiments and supernatural forces." },
  { id: 2, title: "The Crown", backdrop_path: "/7vKj0sLzN3m3U3U3U3U3U3U3U.jpg", overview: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century." }
];

export const fetchMovies = async (requestUrl) => {
  try {
    const response = await axios.get(requestUrl);
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results;
    }
    return mockMovies; // Fallback
  } catch (error) {
    console.error("Error fetching movies:", error);
    return mockMovies; // Fallback
  }
};

export const fetchMovieVideos = async (movieId, type = 'movie') => {
  try {
    const response = await axios.get(`${BASE_URL}/${type}/${movieId}/videos?api_key=${API_KEY}`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return [];
  }
};

export { requests, IMAGE_BASE_URL };
