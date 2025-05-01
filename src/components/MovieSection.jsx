// components/MovieSection.jsx
import React from "react";
import MovieCard from "./MovieCard";

const MovieSection = ({ title, movies, onOpen, onFavorite, favorites, userRatings, onRate, genreList }) => {
  return (
    <section className="py-8">
      <h2 className="text-3xl font-semibold text-secondary mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onOpen={() => onOpen(movie)}
            onFavorite={onFavorite}
            isFavorite={favorites.some((fav) => fav.id === movie.id)}
            userRating={userRatings[movie.id] || 0}
            onRate={onRate}
            genreList={genreList}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieSection;