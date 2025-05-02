// components/Navbar.jsx
import React, { useState } from "react";

const Navbar = ({
  setCurrentView,
  setSearchTerm,
  setRatingFilter,
  setGenreFilter,
  genres = [],
  onLogoClick,
  onTopTMDBClick,
  onFavoritesClick,
  username,
  onLogout,
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setSearchInput("");
  };

  return (
    <nav className="bg-primary p-4 flex flex-col md:flex-row md:items-center justify-between shadow-md">
      {/* Left Side: Logo */}
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <button
          onClick={onLogoClick}
          className="text-2xl font-bold text-secondary"
        >
          🎬 MovieList
        </button>
      </div>

      {/* Middle: Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="p-2 rounded-l bg-zinc-700 text-white outline-none"
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-r"
          >
            Search
          </button>
        </form>

        {/* Genre Filter */}
        <select
          onChange={(e) => setGenreFilter(e.target.value)}
          className="p-2 rounded bg-zinc-700 text-white"
          defaultValue=""
        >
          <option value="">Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          onChange={(e) => setRatingFilter(Number(e.target.value))}
          className="p-2 rounded bg-zinc-700 text-white"
          defaultValue=""
        >
          <option value="">Rating</option>
          {[8, 7, 6, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating}+ Stars
            </option>
          ))}
        </select>
      </div>

      {/* Right Side: Navigation & User */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
        <button onClick={onLogoClick}>Home</button>
        <button onClick={onFavoritesClick}>Favorites</button>
        <button onClick={onTopTMDBClick}>Top TMDB</button>

        {/* Username and Logout */}
        {username && (
          <div className="flex items-center gap-2">
            <span>👤 {username}</span>
            <button
              onClick={onLogout}
              className="text-red-400 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;