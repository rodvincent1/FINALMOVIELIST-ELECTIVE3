import React from "react";
import CommentSection from "./CommentSection"; 

const MovieCard = ({
  movie,
  onOpen,
  onFavorite,
  isFavorite,
  userRating,
  onRate,
  genreList
}) => {
  const handleRatingKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const rating = parseInt(e.target.value);
      if (rating >= 1 && rating <= 10) {
        try {
          const response = await fetch(`http://localhost:5000/api/ratings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`,
            },
            body: JSON.stringify({ movieId: movie.id, rating }),
          });

          if (response.ok) {
            onRate(movie.id, rating);
          } else {
            alert("Failed to save rating");
          }
        } catch (error) {
          console.error("Error saving rating:", error);
        }
      } else {
        alert("Please enter a rating between 1 and 10.");
      }
    }
  };

  const genreNames = (genreList || [])  // Safeguard for undefined genreList
    .filter((g) => (movie.genre_ids || []).includes(g.id))  // Safeguard for undefined movie.genre_ids
    .map((g) => g.name)
    .join(", ");

  return (
    <div className="bg-zinc-800 p-4 rounded-xl shadow-md hover:scale-105 transition duration-300 relative">
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : "https://via.placeholder.com/200x300"}
        alt={movie.title}
        className="w-full h-64 object-cover rounded-lg mb-3"
      />
      <h2 className="text-lg font-semibold mb-1">{movie.title}</h2>
      <p className="text-sm text-zinc-400 mb-1">Year: {movie.release_date?.slice(0, 4)}</p>
      <p className="text-sm text-zinc-400 mb-1">Rating: ⭐ {movie.vote_average?.toFixed(1)}</p>
      <p className="text-sm text-zinc-400 mb-1">Genres: {genreNames || "N/A"}</p>
      <p className="text-sm text-zinc-400 mb-2 line-clamp-3">
        {movie.overview || "No description available."}
      </p>

      <div className="flex items-center justify-between mb-2">
        <button
          className={`text-sm px-3 py-1 rounded ${
            isFavorite || false ? "bg-red-600" : "bg-zinc-700"
          } hover:bg-red-700`}
          onClick={() => onFavorite(movie)}
        >
          {isFavorite ? "★ Favorited" : "Add to Favorites"}
        </button>

        <input
          type="number"
          min="1"
          max="10"
          value={userRating || ""}
          onChange={(e) => onRate(movie.id, parseInt(e.target.value) || 0)}
          onKeyDown={handleRatingKeyDown}
          placeholder="Rate 1-10"
          className="bg-zinc-700 text-sm px-2 py-1 rounded w-16 text-center"
        />
      </div>

      <button
        className="w-full bg-red-500 text-sm py-1 rounded hover:bg-red-600"
        onClick={onOpen}
      >
        Watch Now
      </button>

      <div className="mt-3">
        <CommentSection movieId={movie.id} />
      </div>
    </div>
  );
};

export default MovieCard;
