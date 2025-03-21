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
    <nav className="w-full px-6 py-4 flex flex-wrap items-center justify-between backdrop-blur-lg bg-transparent z-50">
      {/* Left: Logo */}
      <div className="text-3xl font-bold text-red-500 cursor-pointer font-orbitron tracking-wide" onClick={handleHomeClick}>
        MOVIE<span className="text-white">LIST</span> 🎬
      </div>

      {/* Right Section: Nav Items */}
      <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto gap-4 md:gap-6 mt-4 md:mt-0">
        {/* Navigation Buttons */}
        <div className="flex gap-4 text-sm md:text-base uppercase font-medium tracking-wider text-white font-orbitron">
          <button onClick={handleHomeClick} className="hover:text-red-400 transition">HOME</button>
          <button onClick={handleFavoritesClick} className="hover:text-red-400 transition">FAVORITES</button>
          <button onClick={handleTopTmdbClick} className="hover:text-red-400 transition">TOP TMDB</button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-4 py-1 w-full md:w-96">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="bg-transparent w-full text-sm text-white placeholder-white outline-none"
          />
          <button type="submit" className="text-red-400 hover:text-white text-lg ml-2">🔍</button>
        </form>

        {/* Rating Filter */}
        <select
          value={selectedRating}
          onChange={handleRatingChange}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm px-3 py-1 rounded-md focus:border-red-400 transition"
        >
          <option value="" className="text-black">Rating</option>
          {[5, 6, 7, 8, 9, 10].map((rating) => (
            <option key={rating} value={rating} className="text-black">{rating}+ ⭐</option>
          ))}
        </select>

        {/* Genre Filter */}
        <select
          value={selectedGenre}
          onChange={handleGenreChange}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm px-3 py-1 rounded-md focus:border-red-400 transition"
        >
          <option value="" className="text-black">Genre</option>
          {(genres.length > 0 ? genres : defaultGenres).map((genre) => (
            <option key={genre.id} value={genre.name} className="text-black">{genre.name}</option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default Navbar;