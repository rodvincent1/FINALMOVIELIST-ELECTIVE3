// App.js
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MovieSection from "./components/MovieSection";
import MovieModal from "./components/MovieModal";
import Login from "./components/Login";

const API_KEY = "353ea94a6e7c360f351b58173512b084";
const BASE_URL = "https://api.themoviedb.org/3";

const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("USER");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("FAVORITES");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [userRatings, setUserRatings] = useState(() => {
    const storedRatings = localStorage.getItem("userRatings");
    return storedRatings ? JSON.parse(storedRatings) : {};
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genreList, setGenreList] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [currentView, setCurrentView] = useState("HOME");
  const [genreFilter, setGenreFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingRes, latestRes, popularRes, topRatedRes, genresRes] = await Promise.all([
          fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
        ]);

        const trendingData = await trendingRes.json();
        const latestData = await latestRes.json();
        const popularData = await popularRes.json();
        const topRatedData = await topRatedRes.json();
        const genresData = await genresRes.json();

        setTrendingMovies(trendingData.results);
        setLatestMovies(latestData.results);
        setPopularMovies(popularData.results);
        setTopRatedMovies(topRatedData.results);
        setGenreList(genresData.genres);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (ratingFilter || genreFilter) {
      setSuggestedMovies(
        filteredMovies([
          ...trendingMovies,
          ...latestMovies,
          ...popularMovies,
          ...topRatedMovies,
        ])
      );
    }
  }, [ratingFilter, genreFilter]);

  useEffect(() => {
    localStorage.setItem("FAVORITES", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("userRatings", JSON.stringify(userRatings));
  }, [userRatings]);

  const handleOpenModal = (movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const handleFavorite = async (movie) => {
    const updatedFavorites = favorites.some((fav) => fav.id === movie.id)
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];
  
    setFavorites(updatedFavorites);
  
    // Save to backend
    await fetch("http://localhost:5000/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, favorites: updatedFavorites }),
    });
  };
  

  const handleRate = async (movieId, rating) => {
    const updatedRatings = { ...userRatings, [movieId]: rating };
    setUserRatings(updatedRatings);
  
    // Save to backend
    await fetch("http://localhost:5000/api/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, movieId, rating }),
    });
  };
  

  const handleHomeClick = () => {
    setCurrentView("HOME");
    setSearchTerm("");
    setRatingFilter(null);
    setGenreFilter(null);
  };

  const handleTopTMDBClick = () => {
    setCurrentView("top-rated");
    setRatingFilter(null);
    setGenreFilter(null);
  };

  const handleFavoritesClick = () => {
    setCurrentView("FAVORITES");
  };

  const handleSearchSubmit = async (query) => {
    if (!query) return;
    try {
      const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
      const data = await res.json();
      setMovies(data.results);
      setCurrentView("search-results");
    } catch (error) {
      console.error("Error searching for movies:", error);
    }
  };

  const getGenreId = (genreName) => {
    const genre = genreList.find((g) => g.name === genreName);
    return genre ? genre.id : null;
  };

  const filteredMovies = (moviesList) => {
    const genreId = genreFilter ? getGenreId(genreFilter) : null;
    return moviesList.filter((movie) => {
      const ratingMatch = ratingFilter ? movie.vote_average >= ratingFilter : true;
      const genreMatch = genreId ? movie.genre_ids.includes(genreId) : true;
      return ratingMatch && genreMatch;
    });
  };

  const handleHeroNext = () => {
    setCurrentHeroIndex((prev) =>
      prev === trendingMovies.length - 1 ? 0 : prev + 1
    );
  };

  const handleHeroPrev = () => {
    setCurrentHeroIndex((prev) =>
      prev === 0 ? trendingMovies.length - 1 : prev - 1
    );
  };

  const handleLogin = async (username, password) => {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
  
    if (res.ok) {
      alert("Login successful!");
      localStorage.removeItem("FAVORITES");
      localStorage.removeItem("userRatings");
      setUser(data.user);
      setFavorites(data.user.favorites || []);
      setUserRatings(data.user.ratings || {});
    } else {
      alert(data.error || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("favorites");
    localStorage.removeItem("token");
    // optionally clear localStorage entirely
    // localStorage.clear();
    navigate("/login"); // or your route
  };  

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-primary text-secondary min-h-screen">
      <Navbar
        setCurrentView={setCurrentView}
        setRatingFilter={setRatingFilter}
        setGenreFilter={setGenreFilter}
        setSearchTerm={handleSearchSubmit}
        genres={genreList}
        onLogoClick={handleHomeClick}
        onTopTMDBClick={handleTopTMDBClick}
        onFavoritesClick={handleFavoritesClick}
        username={user.username}
        onLogout={handleLogout}
      />

      {currentView === "HOME" && trendingMovies.length > 0 && (
        <HeroSection
          featuredMovies={trendingMovies}
          currentIndex={currentHeroIndex}
          onPrev={handleHeroPrev}
          onNext={handleHeroNext}
        />
      )}

      <div className="container mx-auto px-6 py-8">
        {currentView === "HOME" && (
          <>
            <MovieSection
              title="Trending Now"
              movies={filteredMovies(trendingMovies)}
              onOpen={handleOpenModal}
              onFavorite={handleFavorite}
              favorites={favorites}
              userRatings={userRatings}
              onRate={handleRate}
              genreList={genreList}
            />

            <MovieSection
              title="Latest Releases"
              movies={filteredMovies(latestMovies)}
              onOpen={handleOpenModal}
              onFavorite={handleFavorite}
              favorites={favorites}
              userRatings={userRatings}
              onRate={handleRate}
              genreList={genreList}
            />

            {suggestedMovies.length > 0 && (
              <MovieSection
                title="Suggested Movies"
                movies={suggestedMovies}
                onOpen={handleOpenModal}
                onFavorite={handleFavorite}
                favorites={favorites}
                userRatings={userRatings}
                onRate={handleRate}
                genreList={genreList}
              />
            )}
          </>
        )}

        {currentView === "FAVORITES" && (
          <MovieSection
            title="Your Favorites"
            movies={favorites}
            onOpen={handleOpenModal}
            onFavorite={handleFavorite}
            favorites={favorites}
            userRatings={userRatings}
            onRate={handleRate}
            genreList={genreList}
          />
        )}

        {currentView === "search-results" && (
          <MovieSection
            title={`Search Results for "${searchTerm}"`}
            movies={movies}
            onOpen={handleOpenModal}
            onFavorite={handleFavorite}
            favorites={favorites}
            userRatings={userRatings}
            onRate={handleRate}
            genreList={genreList}
          />
        )}

        {currentView === "top-rated" && (
          <MovieSection
            title="Top Rated Movies (TMDB)"
            movies={filteredMovies(topRatedMovies)}
            onOpen={handleOpenModal}
            onFavorite={handleFavorite}
            favorites={favorites}
            userRatings={userRatings}
            onRate={handleRate}
            genreList={genreList}
          />
        )}
      </div>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
};
export default App;