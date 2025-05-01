// components/MovieCard.jsx
import React from "react";
import CommentSection from "./CommentSection"; // ✅ Only new import added

const MovieCard = ({
  movie,
  onOpen,
  onFavorite,
  isFavorite,
  userRating,
  onRate,
  genreList
}) => {
  const handleRatingChange = (e) => {
    const rating = parseInt(e.target.value);
    onRate(movie.id, rating);
  };

  const genreNames = genreList
    ?.filter((g) => movie.genre_ids.includes(g.id))
    .map((g) => g.name)
    .join(", ");

  return (
    <div className="bg-zinc-800 p-4 rounded-xl shadow-md hover:scale-105 transition duration-300 relative">
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : "https://via.placeholder.com/200x300"
        }
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
            isFavorite ? "bg-red-600" : "bg-zinc-700"
          } hover:bg-red-700`}
          onClick={() => onFavorite(movie)}
        >
          {isFavorite ? "★ Favorited" : "Add to Favorites"}
        </button>

        <select
          value={userRating || ""}
          onChange={handleRatingChange}
          className="bg-zinc-700 text-sm px-2 py-1 rounded"
        >
          <option value="">Rate</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} ⭐
            </option>
          ))}
        </select>
      </div>

      <button
        className="w-full bg-red-500 text-sm py-1 rounded hover:bg-red-600"
        onClick={onOpen}
      >
        Watch Now
      </button>

      {/* ✅ Comment Section Integration (only added part) */}
      <div className="mt-3">
        <CommentSection movieId={movie.id} />
      </div>
    </div>
  );
};

export default MovieCard;
