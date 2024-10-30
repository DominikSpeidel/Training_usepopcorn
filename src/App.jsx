import { useState, useEffect } from "react";
import NavBar from "./Nav.Bar";
import Main from "./Main";
import NumResults from "./NumResults";
import Logo from "./Logo";
import Search from "./Search";
import Box from "./ListBox";
import MovieList from "./MovieList";
import WatchedSummary from "./WatchedSummary";
import WatchedMovieList from "./WatchMovieList";
import SelectedMovie from "./SelectedMovie";

const KEY = process.env.REACT_APP_OMDB_KEY;
console.log(KEY);

export default function App() {
  const [query, setQuery] = useState("");

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
    // Alternativ: id === selectedId ? setSelectedId(null) : setSelectedId(id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // useEffect( () => {
  //   async function myFetch() {
  //     const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`);
  //     const data = await response.json();
  //     console.log(data.Search)
  //   }
  //   myFetch();
  // }, [])

  // useEffect(function () {
  //   fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //     .then((response) => response.json())
  //     .then((data) => setMovies(data.Search));
  // }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovie() {
      try {
        setIsLoading(true);
        setError(""); //reset error
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Wir haben ein Problem");

        const data = await response.json();

        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error.message);
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    handleCloseMovie();
    fetchMovie();
    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <p>Es lädt gerade</p>}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error}></ErrorMessage>}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}
