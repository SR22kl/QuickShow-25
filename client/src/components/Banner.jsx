import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Banner = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [genresMap, setGenresMap] = useState({});

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  // Fetch TMDB genre list once and store id->name map
  useEffect(() => {
    const fetchGenres = async () => {
      if (!TMDB_API_KEY) return;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`,
        );
        const data = await res.json();
        const map = {};
        (data.genres || []).forEach((g) => {
          map[g.id] = g.name;
        });
        setGenresMap(map);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, [TMDB_API_KEY]);

  // Fetch trending movies from TMDB
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`,
        );
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin">
          <div className="h-16 w-16 border-4 border-gray-600 border-t-red-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <p className="text-gray-400">No movies available</p>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];
  const backdropUrl = currentMovie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${currentMovie.backdrop_path}`
    : null;

  console.log(currentMovie?.genre_ids);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: backdropUrl ? `url('${backdropUrl}')` : "none",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center items-start gap-4 px-6 md:px-16 lg:px-36">
          <h1 className="text-4xl sm:text-5xl md:text-[70px] font-semibold md:leading-[80px] max-w-2xl text-white">
            {currentMovie?.title || currentMovie?.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-300">
            {(currentMovie.genres || currentMovie.genre_ids) && (
              <span className="text-sm md:text-base">
                {currentMovie.genres
                  ? currentMovie.genres.map((g) => g.name).join(" | ")
                  : currentMovie.genre_ids
                      .map((id) => genresMap[id] || id)
                      .join(" | ")}
              </span>
            )}
            {currentMovie.release_date && (
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base">
                  {new Date(currentMovie.release_date).getFullYear()}
                </span>
              </div>
            )}
            {currentMovie.vote_average && (
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base">
                  ⭐ {currentMovie.vote_average.toFixed(1)}/10
                </span>
              </div>
            )}
          </div>

          <p className="max-w-md text-gray-300 text-sm md:text-base line-clamp-3">
            {currentMovie.overview}
          </p>

          <button
            onClick={() => navigate("/movies")}
            className="group flex items-center gap-1 px-6 py-3 text-sm bg-gradient-to-b from-[#f84565] to-[#d63854] hover:from-[#d63854] hover:to-[#f84565] duration-300 ease-in transition rounded-full font-medium cursor-pointer mt-4"
          >
            Explore Movies!
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 duration-300 ease-in" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-2 rounded-full transition-all duration-300"
          aria-label="Previous movie"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-2 rounded-full transition-all duration-300"
          aria-label="Next movie"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </button>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex % 5
                ? "w-8 bg-red-600"
                : "w-2 bg-gray-500 hover:bg-gray-400"
            }`}
            aria-label={`Go to movie ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
