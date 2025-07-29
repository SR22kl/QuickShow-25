import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";
import { useAppContext } from "../appContext/AppContext";

const INITIAL_DISPLAY_LIMIT = 4; // Number of trailers to show initially

const TrailerSection = () => {
  const { axios, image_base_url } = useAppContext();

  const [trendingTrailers, setTrendingTrailers] = useState([]);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(INITIAL_DISPLAY_LIMIT); // State for current display limit

  // Access your VITE_TMDB_API_KEY from environment variables
  const TMDB_V3_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchTrendingMovieTrailers = async () => {
      setLoading(true);
      setError(null);

      if (!TMDB_V3_API_KEY) {
        setError(
          "TMDb API key is not configured. Please check your .env file."
        );
        setLoading(false);
        return;
      }

      try {
        const imageBaseUrl = image_base_url;
        // Fetch trending movies
        const trendingMoviesResponse = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_V3_API_KEY}`
        );
        const movies = trendingMoviesResponse.data.results;

        const trailersData = [];

        // For each movie, fetch its videos and find a trailer
        for (const movie of movies) {
          const videosResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_V3_API_KEY}`
          );
          const videos = videosResponse.data.results;

          // Find the official trailer, or any trailer/teaser
          const trailer = videos.find(
            (video) =>
              video.site === "YouTube" &&
              (video.type === "Trailer" || video.type === "Teaser")
          );

          if (trailer) {
            trailersData.push({
              id: movie.id,
              title: movie.title,
              videoUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
              image: imageBaseUrl + movie.poster_path,
            });
          }
        }

        setTrendingTrailers(trailersData);
        if (trailersData.length > 0) {
          setCurrentTrailer(trailersData[0]);
        }
      } catch (err) {
        console.error("Error fetching trending movie trailers:", err);
        setError("Failed to load trailers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovieTrailers();
  }, [axios, TMDB_V3_API_KEY]);

  // Function to handle "Show More" / "Show Less" button click
  const handleToggleDisplay = () => {
    if (displayLimit === INITIAL_DISPLAY_LIMIT) {
      setDisplayLimit(trendingTrailers.length);
    } else {
      setDisplayLimit(INITIAL_DISPLAY_LIMIT);
    }
  };

  // Determine which trailers to display
  const trailersToDisplay = trendingTrailers.slice(0, displayLimit);
  const showToggleButton = trendingTrailers.length > INITIAL_DISPLAY_LIMIT;
  const isShowingAll = displayLimit === trendingTrailers.length;

  if (loading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-10 md:py-20 text-center text-gray-400">
        Loading trailers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-10 md:py-20 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (trendingTrailers.length === 0) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-10 md:py-20 text-center text-gray-400">
        No trending trailers found.
      </div>
    );
  }

  return (
    <>
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-10 md:py-20 overflow-hidden">
        <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto text-center md:text-left">
          Trending Trailers
        </p>
        <div className="relative mt-6 max-w-[960px] mx-auto overflow-hidden">
          <BlurCircle top="-100px" right="-100px" />
          <div className="relative pt-[56.25%]">
            <ReactPlayer
              className="absolute top-0 left-0"
              width="100%"
              height="100%"
              src={currentTrailer?.videoUrl}
              controls={true}
              playing={true}
            />
          </div>
        </div>
        <div className="group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
          {trailersToDisplay.map((trailer) => (
            <div
              key={trailer.id}
              className="relative group-hover:not-hover:opacity-50 hover:scale-110 duration-300 ease-linear transition max-md:h-60 cursor-pointer rounded-lg overflow-hidden"
              onClick={() => setCurrentTrailer(trailer)}
            >
              <img
                src={trailer?.image}
                alt={trailer?.title}
                className="w-full h-full object-cover brightness-75"
              />
              <PlayCircleIcon
                strokeWidth={1.6}
                className="absolute top-1/2 left-1/2 w-8 h-8 md:w-12 md:h-12 transform -translate-x-1/2 -translate-y-1/2 text-white"
              />
              <p className="absolute bottom-2 left-2 text-white text-sm font-semibold w-11/12">
                <span className="bg-black/60 p-1 rounded inline-block truncate max-w-full">
                  {trailer.title}
                </span>
              </p>
            </div>
          ))}
        </div>
        {showToggleButton && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleToggleDisplay}
              className="bg-gradient-to-l from-[#f84565] to-[#d63854] hover:from-[#d63854] hover:to-[#f84565]  text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out cursor-pointer"
            >
              {isShowingAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TrailerSection;
