import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MovieSection from "./components/MovieSection";
import MovieModal from "./components/MovieModal";

const API_KEY = "554977e3cfe3a7170a85791feebc49a6";
const BASE_URL = "https://api.themoviedb.org/3";

const App = () => {
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
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0); // ✅ Added

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

  const handleFavorite = (movie) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === movie.id)
        ? prev.filter((fav) => fav.id !== movie.id)
        : [...prev, movie]
    );
  };

  const handleRate = (movieId, rating) => {
    setUserRatings((prev) => ({ ...prev, [movieId]: rating }));
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

  // ✅ Added only this
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