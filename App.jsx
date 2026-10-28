
import { useState } from "react";
import "./App.css";

const API_KEY = "a1de9591";

const trendingMovies = [
  {
    id: 1,
    title: "Interstellar",
    year: "2014",
    genre: "Sci-Fi",
    poster:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: 2,
    title: "Inception",
    year: "2010",
    genre: "Thriller",
    poster:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: "2008",
    genre: "Action",
    poster:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    id: 4,
    title: "Avatar",
    year: "2009",
    genre: "Adventure",
    poster:
      "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
  },
];

export default function App() {
  const [searchMovie, setSearchMovie] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function fetchMovies(event) {
    event?.preventDefault();

    if (!searchMovie.trim()) {
      setError("Type a movie name to begin your movie adventure 🍿");
      setMovies([]);
      setHasSearched(true);
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          searchMovie.trim()
        )}&apikey=${API_KEY}`
      );

      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search || []);
      } else {
        setMovies([]);
        setError(data.Error || "No movies found. Try another title.");
      }
    } catch {
      setMovies([]);
      setError("Unable to connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }

  function chooseMovie(title) {
    setSearchMovie(title);
    setError("");
    setHasSearched(true);

    // Search the selected title.
    searchSelectedMovie(title);
  }

  async function searchSelectedMovie(title) {
    setLoading(true);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          title
        )}&apikey=${API_KEY}`
      );

      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search || []);
        setError("");
      } else {
        setMovies([]);
        setError(data.Error || "No movies found.");
      }
    } catch {
      setMovies([]);
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }

    document.getElementById("movies")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function resetHome() {
    setSearchMovie("");
    setMovies([]);
    setError("");
    setHasSearched(false);
  }

  return (
    <div className="app">
      <header className="navbar">
        <a
          className="brand"
          href="#home"
          onClick={resetHome}
          aria-label="MovieMasala home"
        >
          <span className="brand-icon">🎬</span>
          <span>
            Movie<span className="brand-highlight">Masala</span>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#home" onClick={resetHome}>Home</a>
          <a href="#trending">Trending</a>
          <a href="#movies">Explore</a>
          <a href="#about">About</a>
        </nav>

        <a className="nav-cta" href="#explore">
          Find a movie <span>↗</span>
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-overlay" />

          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              YOUR NEXT FAVORITE MOVIE STARTS HERE
            </div>

            <h1>
              Every movie has
              <br />
              a <span>little magic.</span>
            </h1>

            <p className="hero-description">
              From unforgettable classics to hidden gems,
              find the perfect story for your next movie night.
            </p>

            <form
              className="search-form"
              id="explore"
              onSubmit={fetchMovies}
            >
              <span className="search-icon">⌕</span>

              <input
                type="search"
                placeholder="Search movies, titles, or classics..."
                value={searchMovie}
                onChange={(event) => setSearchMovie(event.target.value)}
                aria-label="Search movies"
              />

              <button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Discover ✨"}
              </button>
            </form>

            <div className="hero-note">
              <span>✦</span> Your next movie night, sorted.
            </div>
          </div>

          <div className="hero-bottom">
            <span>LIGHTS. CAMERA. MASALA.</span>
            <a href="#trending">Scroll to discover ↓</a>
          </div>
        </section>

        <section className="trending-section" id="trending">
          <div className="section-heading">
            <div>
              <span className="section-kicker">HANDPICKED FOR YOU</span>
              <h2>Movie night <span>favorites</span></h2>
              <p>A few unforgettable stories to get you started.</p>
            </div>

            <a href="#explore" className="text-link">
              Find more movies <span>→</span>
            </a>
          </div>

          <div className="movie-grid featured-grid">
            {trendingMovies.map((movie, index) => (
              <button
                className="movie-card featured-card"
                key={movie.id}
                onClick={() => chooseMovie(movie.title)}
                aria-label={`Search for ${movie.title}`}
              >
                <div className="poster-wrap">
                  <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    loading="lazy"
                  />
                  <span className="poster-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="poster-action">Explore movie ↗</span>
                </div>

                <div className="movie-info">
                  <div>
                    <h3>{movie.title}</h3>
                    <p>{movie.year} <span>•</span> {movie.genre}</p>
                  </div>
                  <span className="card-arrow">↗</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {(hasSearched || loading) && (
          <section className="results-section" id="movies">
            <div className="section-heading">
              <div>
                <span className="section-kicker">THE SEARCH IS ON</span>
                <h2>Your discoveries <span>🍿</span></h2>
              </div>
            </div>

            {loading && (
              <p className="status">
                <span className="spinner" />
                Finding something amazing...
              </p>
            )}

            {!loading && error && (
              <div className="empty-state">
                <span className="empty-emoji">🎞️</span>
                <h3>Nothing on the screen yet</h3>
                <p>{error}</p>
              </div>
            )}

            {!loading && movies.length > 0 && (
              <div className="movie-grid search-grid">
                {movies.map((movie) => (
                  <article className="movie-card" key={movie.imdbID}>
                    <div className="poster-wrap">
                      <img
                        src={
                          movie.Poster !== "N/A"
                            ? movie.Poster
                            : "https://placehold.co/400x600/211b32/ffffff?text=No+Poster"
                        }
                        alt={`${movie.Title} poster`}
                        loading="lazy"
                      />
                      <span className="movie-type">{movie.Type}</span>
                    </div>

                    <div className="movie-info">
                      <div>
                        <h3>{movie.Title}</h3>
                        <p>{movie.Year}</p>
                      </div>
                      <span className="card-arrow">↗</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="movie-quote">
          <span className="quote-mark">“</span>
          <p>Sometimes the best journeys happen without leaving your seat.</p>
          <span className="quote-caption">MADE FOR MOVIE LOVERS</span>
        </section>
      </main>

      <footer className="footer" id="about">
        <a className="brand footer-brand" href="#home" onClick={resetHome}>
          <span className="brand-icon">🎬</span>
          <span>
            Movie<span className="brand-highlight">Masala</span>
          </span>
        </a>

        <p>For the love of stories, cinema, and everything in between.</p>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MovieMasala</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}
