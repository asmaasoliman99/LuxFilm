import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

const TitleCards = ({ title, category, isGenre = false }) => {
  const { theme } = useContext(ThemeContext);
  const { lang } = useContext(LanguageContext);
  const [movies, setMovies] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [page, setPage] = useState(1);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isRowHovered, setIsRowHovered] = useState(false);

  const cardsRef = useRef();
  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  const constructUrl = useCallback(
    (pageNum) => {
      const params = `api_key=${API_KEY}&page=${pageNum}&language=${lang}`;
      if (isGenre)
        return `${BASE_URL}/discover/movie?${params}&with_genres=${category}`;
      if (category.includes("/")) return `${BASE_URL}/${category}?${params}`;
      return `${BASE_URL}/movie/${category || "now_playing"}?${params}`;
    },
    [category, isGenre, API_KEY, lang],
  );

  const pageCount = useMemo(() => {
    const perPage =
      window.innerWidth >= 1280 ? 6 : window.innerWidth >= 768 ? 4 : 2;
    return Math.ceil(movies.length / perPage) || 0;
  }, [movies.length]);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setPage(1);
        setActivePageIndex(0);
        const [g, m] = await Promise.all([
          axios.get(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${lang}`,
          ),
          axios.get(constructUrl(1)),
        ]);
        setGenresList(g.data.genres);
        setMovies(m.data.results);
      } catch (err) {
        console.error("Fetch error:", err);
        setMovies([]);
      }
    };
    loadInitial();
  }, [constructUrl, API_KEY, lang]);

  const scroll = useCallback(
    async (dir) => {
      const container = cardsRef.current;
      if (!container) return;

      const { scrollLeft, clientWidth, scrollWidth } = container;
      container.scrollTo({
        left:
          dir === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth,
        behavior: "smooth",
      });

      setActivePageIndex((prev) =>
        dir === "right"
          ? (prev + 1) % pageCount
          : (prev - 1 + pageCount) % pageCount,
      );

      // Infinite Scroll logic
      if (dir === "right" && scrollLeft + clientWidth >= scrollWidth - 600) {
        try {
          const { data } = await axios.get(constructUrl(page + 1));
          setMovies((prev) => [...prev, ...data.results]);
          setPage((p) => p + 1);
        } catch (err) {
          console.error(err);
        }
      }
    },
    [page, pageCount, constructUrl],
  );

  return (
    <div
      onMouseEnter={() => setIsRowHovered(true)}
      onMouseLeave={() => setIsRowHovered(false)}
      className="group relative flex flex-col gap-2 my-10 transition-all"
      style={{ zIndex: isRowHovered ? 100 : 1 }}
    >
      <div className="flex justify-between items-center mb-2 ml-6 md:ml-12 relative z-[110]">
        <h2
          className={`text-lg md:text-xl font-bold ${theme === "light" ? "text-black" : "text-white"}`}
        >
          {title}
        </h2>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pr-6 md:pr-12">
          {[...Array(Math.min(pageCount, 10))].map((_, i) => (
            <div
              key={i}
              className={`h-[2px] transition-all duration-300 ${i === activePageIndex ? "w-5 bg-red-600" : "w-4 bg-gray-600"}`}
            />
          ))}
        </div>
      </div>

      <div className="relative flex items-center group/arrows w-full">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-[120] h-full w-10 md:w-16 bg-black/60 opacity-0 group-hover/arrows:opacity-100 transition-all flex items-center justify-center"
        >
          <ChevronLeft className="w-8 h-8 md:w-12 md:h-12 text-white" />
        </button>

        <div
          ref={cardsRef}
          className="flex gap-3 overflow-x-scroll no-scrollbar scroll-smooth pt-20 pb-60 -mt-20 -mb-60 px-6 md:px-12 w-full"
        >
          {movies.length > 0 ? (
            movies.map((m, i) => (
              <MovieCard
                key={`${m.id}-${i}`}
                movie={m}
                API_KEY={API_KEY}
                genresList={genresList}
              />
            ))
          ) : (
            <div className="h-40 flex items-center text-gray-500 italic px-12">
              Loading movies...
            </div>
          )}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-[120] h-full w-10 md:w-16 bg-black/60 opacity-0 group-hover/arrows:opacity-100 transition-all flex items-center justify-center"
        >
          <ChevronRight className="w-8 h-8 md:w-12 md:h-12 text-white" />
        </button>
      </div>
    </div>
  );
};

export default TitleCards;
