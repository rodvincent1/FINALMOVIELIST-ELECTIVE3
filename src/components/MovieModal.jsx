import React, { useEffect, useState } from "react";

const API_KEY = "554977e3cfe3a7170a85791feebc49a6";

const MovieModal = ({ movie, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(true); // Toggle between trailer and movie

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
        );
        const data = await res.json();
        const trailer = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (err) {
        console.error("Failed to fetch trailer:", err);
      }
    };

    fetchTrailer();
  }, [movie]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-zinc-900 rounded-xl p-4 max-w-2xl w-full relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-xl hover:text-red-500"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
        <p className="text-sm text-zinc-300 mb-4">{movie.overview}</p>

        {/* Toggle Buttons for Trailer and Movie */}
        <div className="mb-4 flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded ${
              showTrailer ? "bg-red-600" : "bg-zinc-700"
            }`}
            onClick={() => setShowTrailer(true)}
          >
            Watch Trailer
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${
              !showTrailer ? "bg-red-600" : "bg-zinc-700"
            }`}
            onClick={() => setShowTrailer(false)}
          >
            Watch Movie
          </button>
        </div>

        {showTrailer ? (
          trailerKey ? (
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
            <p className="text-sm text-red-400">Trailer not available</p>
          )
        ) : (
          <iframe
            width="100%"
            height="360"
            src={`https://www.2embed.cc/embed/${movie.id}`}
            title="Movie Stream"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default MovieModal;