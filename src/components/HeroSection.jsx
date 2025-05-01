//components/HeroSection.jsx

import React, { useEffect, useState, useRef } from "react";
import { FaPlay, FaChevronRight, FaChevronLeft } from "react-icons/fa";

const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [watchType, setWatchType] = useState(null);
  const autoSlideRef = useRef(null); // Track interval

  const apiKey = process.env.REACT_APP_TMDB_API_KEY || "your_fallback_api_key";

  useEffect(() => {
    console.log("TMDB API Key:", apiKey);

    if (!apiKey) {
      console.error("🚨 API Key is missing!");
      return;
    }

    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
        );

        console.log("API Response:", response);

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        setMovies(data.results.slice(0, 4)); // Show only first 4 trending movies
      } catch (error) {
        console.error("❌ Error fetching movies:", error);
      }
    };

    fetchTrendingMovies();
  }, [apiKey]);

  useEffect(() => {
    if (!showModal && movies.length > 0) {
      autoSlideRef.current = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % movies.length);
          setFade(true);
        }, 300);
      }, 5000);
    }

    return () => clearInterval(autoSlideRef.current);
  }, [movies, showModal]);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
      setFade(true);
    }, 300);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
      setFade(true);
    }, 300);
  };

  const fetchTrailer = async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch (err) {
      console.error("❌ Failed to fetch trailer:", err);
    }
  };

  const openModal = (type) => {
    setWatchType(type);
    if (type === "trailer") {
      fetchTrailer(movies[currentIndex].id);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTrailerKey(null);
    setWatchType(null);
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

  return (
    <div
      className={`relative bg-cover bg-center text-white p-8 rounded-2xl shadow-lg my-6 mx-4 lg:flex items-center justify-between transition-opacity duration-500 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg rounded-2xl"></div>

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
          {movie.overview?.length > 250
            ? `${movie.overview.slice(0, 250)}...`
            : movie.overview}
        </p>

        <button
          onClick={() => openModal("movie")}
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black px-5 py-2 rounded-full transition"
        >
          <FaPlay /> Watch Now
        </button>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-20">
        <button
          onClick={handleNext}
          className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md shadow-lg transition"
        >
          <FaChevronRight size={20} />
        </button>
        <button
          onClick={handlePrev}
          className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md shadow-lg transition"
        >
          <FaChevronLeft size={20} />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="bg-zinc-900 rounded-xl p-4 max-w-2xl w-full relative shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-white text-xl hover:text-red-500"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2 text-white">{movie.title}</h2>

            {watchType === "trailer" && trailerKey ? (
              <iframe
                width="100%"
                height="360"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="YouTube trailer"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="rounded"
              ></iframe>
            ) : (
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => openModal("trailer")}
                  className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                >
                  🎬 Watch Trailer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
