import React, { useEffect, useState } from "react";
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
        );
        const data = await response.json();
        setMovies(data.results.slice(0, 4)); // Show only first 4 trending movies
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    fetchTrendingMovies();
  }, [apiKey]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  if (movies.length === 0) {
    return (
      <div className="text-white text-center text-xl py-10">
        Loading featured movie...
      </div>
    );
  }

  const movie = movies[currentIndex];
  const imageUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title)}+official+trailer`;

  return (
    <div
      className="relative bg-cover bg-center text-white p-8 rounded-2xl shadow-lg my-6 mx-4 lg:flex items-center justify-between"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      {/* Blurred Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg rounded-2xl"></div>

      {/* Movie Content */}
      <div className="relative z-10 w-full lg:w-2/3">
        <img
          src={imageUrl}
          alt={movie.title}
          className="rounded-2xl shadow-xl w-full max-h-[450px] object-cover"
        />
      </div>
      <div className="relative z-10 w-full lg:w-1/2 px-6 mt-6 lg:mt-0">
        <div className="flex items-center space-x-2 mb-2 text-sm text-cyan-300">
          <span>{movie.release_date?.split("-")[0]}</span>
          <span className="bg-cyan-500 text-black px-2 py-0.5 rounded">
            {movie.vote_average?.toFixed(1)}
          </span>
        </div>
        <h2 className="text-3xl font-bold mb-3">{movie.title}</h2>
        <p className="text-gray-300 mb-5">
          {movie.overview?.length > 250 ? `${movie.overview.slice(0, 250)}...` : movie.overview}
        </p>
        <a
          href={trailerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black px-5 py-2 rounded-full transition"
        >
          <FaPlay /> Watch Now
        </a>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
};

export default HeroSection;