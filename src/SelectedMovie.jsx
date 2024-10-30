import { useEffect, useState } from "react";

const KEY = process.env.REACT_APP_OMDB_KEY;

export default function SelectedMovie({ selectedId, onCloseMovie }) {
  const [movieDetails, setMovieDetails] = useState("");

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetails;

  useEffect(() => {
    async function fetchSelectedMovie() {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await response.json();
      console.log(data);
      setMovieDetails(data);
    }
    fetchSelectedMovie();
  }, [selectedId]);

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          &larr;
        </button>
        {/* // Hier gibt es keinen zu übergebendes Argument, deshalb braucht das onClick-Event keine Arrow-Function */}

        <img src={poster} alt={`Poster of ${title} movie`}></img>
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>

      <setion>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </setion>
    </div>
  );
}
