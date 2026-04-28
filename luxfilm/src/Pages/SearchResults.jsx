import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";
import MovieCard from "../Components/MovieCard";
import { LanguageContext } from "../context/LanguageContext.js";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const selectedGenre = searchParams.get("genre") || "";
  const { t, lang } = useContext(LanguageContext);
  const [movies, setMovies] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${lang}`,
        );
        setGenresList(data.genres || []);
      } catch (err) {
        console.error("Error fetching genres list", err);
      }
    };

    loadGenres();
  }, [API_KEY, lang]);

  useEffect(() => {
    const loadResults = async () => {
      if (!query && !selectedGenre) {
        setMovies([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        if (query) {
          const { data } = await axios.get(`${BASE_URL}/search/movie`, {
            params: {
              api_key: API_KEY,
              query,
              include_adult: false,
              page: 1,
              language: lang,
            },
          });

          const results = data.results || [];
          const filtered = selectedGenre
            ? results.filter((movie) =>
                movie.genre_ids?.includes(Number(selectedGenre)),
              )
            : results;

          setMovies(filtered);
        } else {
          const { data } = await axios.get(`${BASE_URL}/discover/movie`, {
            params: {
              api_key: API_KEY,
              with_genres: selectedGenre,
              sort_by: "popularity.desc",
              page: 1,
              language: lang,
            },
          });

          setMovies(data.results || []);
        }
      } catch (err) {
        console.error("Error fetching search results", err);
        setError(t("errorLoading"));
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [API_KEY, query, selectedGenre, t, lang]);

  const genreName = genresList.find(
    (genre) => genre.id === Number(selectedGenre),
  )?.name;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-28 px-5 md:px-10 pb-14">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {query ? `${t("searchResults")} "${query}"` : t("searchByGenre")}
          </h1>
          {genreName && (
            <p className="text-gray-300">
              {t("category")}: {genreName}
            </p>
          )}
          {!query && !selectedGenre && (
            <p className="text-gray-400 mt-2">{t("enterName")}</p>
          )}
        </div>

        {loading && <div className="text-gray-300">{t("searching")}</div>}
        {error && (
          <div className="text-red-400">{error || t("errorLoading")}</div>
        )}

        {!loading &&
          !error &&
          movies.length === 0 &&
          (query || selectedGenre) && (
            <div className="text-gray-300">{t("noResults")}</div>
          )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              API_KEY={API_KEY}
              genresList={genresList}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
