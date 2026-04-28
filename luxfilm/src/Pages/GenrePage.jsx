import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import axios from "axios";
import MovieCard from "../Components/MovieCard";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";

const GenrePage = () => {
   const { theme } = useContext(ThemeContext);
  const { genreId, genreName } = useParams();
  const [movies, setMovies] = useState([]);
  const { t, lang } = useContext(LanguageContext);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=${lang} ${theme === "light" ? "text-black" : ""}`,
        );
        setMovies(res.data.results);
      } catch (err) {
        console.error("Error fetching genre movies", err);
      }
    };
    fetchGenreMovies();
  }, [genreId, API_KEY, lang]);

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen p-8 pt-24">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">
        {genreName} {t("movies")}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            API_KEY={API_KEY}
            genresList={[]}
          />
        ))}
      </div>
    </div>
  );
};

export default GenrePage;
