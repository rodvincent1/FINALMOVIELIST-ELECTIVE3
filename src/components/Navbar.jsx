import React, { useState, useEffect } from "react";

const Navbar = ({ setCurrentView, setSearchTerm, setRatingFilter, setGenreFilter, genres = [] }) => {
  const [query, setQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    if (selectedRating || selectedGenre) {
      setCurrentView("HOME");
    }
  }, [selectedRating, selectedGenre, setCurrentView]);

  const handleHomeClick = () => {
    setSearchTerm("");
    setRatingFilter("");
    setGenreFilter("");
    setSelectedRating("");
    setSelectedGenre("");
    setCurrentView("HOME");
  };

  const handleFavoritesClick = () => {
    setCurrentView("FAVORITES");
  };

  const handleTopTmdbClick = () => {
    setCurrentView("top-tmdb");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(query);
    setCurrentView("HOME");
  };

  const handleRatingChange = (e) => {
    const newRating = e.target.value;
    setSelectedRating(newRating);
    setRatingFilter(newRating);
  };

  const handleGenreChange = (e) => {
    const newGenre = e.target.value;
    setSelectedGenre(newGenre);
    setGenreFilter(newGenre);
  };

  const defaultGenres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  return (
    <nav className="flex flex-wrap items-center justify-between px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl shadow-md mb-6 border border-white/10">
      {/* Logo */}
      <h1
        className="text-3xl font-bold cursor-pointer text-red-500 hover:text-white transition duration-300 tracking-wide font-orbitron"
        onClick={handleHomeClick}
      >
        MOVIE<span className="text-white">LIST</span> 🎬
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-grow max-w-2xl flex items-center bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-4 py-2 mx-6"
      >
        <input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-white placeholder-white outline-none px-2 font-light"
        />
        <button type="submit" className="text-red-400 hover:text-white text-xl ml-2">🔍</button>
      </form>

      {/* Filters */}
      <div className="flex space-x-4 items-center">
        {/* Filter by Rating */}
        <select
          className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 backdrop-blur-md focus:border-red-500 transition text-sm font-inter"
          value={selectedRating}
          onChange={handleRatingChange}
        >
          <option value="" className="text-black">Rating</option>
          {[5, 6, 7, 8, 9, 10].map((rating) => (
            <option key={rating} value={rating} className="text-black">
              {rating}+ ⭐
            </option>
          ))}
        </select>

        {/* Filter by Genre */}
        <select
          className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 backdrop-blur-md focus:border-red-500 transition text-sm font-inter"
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="" className="text-black">Genre</option>
          {(genres.length > 0 ? genres : defaultGenres).map((genre) => (
            <option key={genre.id} value={genre.name} className="text-black">
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-6 mt-4 md:mt-0 text-base font-bold uppercase tracking-wider text-white font-orbitron">
        <button className="hover:text-red-400 transition text-lg" onClick={handleHomeClick}>
          HOME
        </button>
        <button className="hover:text-red-400 transition text-lg" onClick={handleFavoritesClick}>
          FAVORITES
        </button>
        <button className="hover:text-red-400 transition text-lg" onClick={handleTopTmdbClick}>
          TOP TMDB
        </button>
      </div>
    </nav>
  );
};

export default Navbar;