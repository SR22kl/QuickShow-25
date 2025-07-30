import { Heart, PlayCircle, StarIcon, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../appContext/AppContext";
import BlurCircle from "../components/BlurCircle";
import DateSelect from "../components/DateSelect";
import Loader from "../components/Loader";
import MovieCard from "../components/MovieCard";
import timeFormat from "../lib/timeFormat";
import ReactPlayer from "react-player";

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [recommendedShows, setRecommendedShow] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  const tmdbBase_url = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  console.log("Current trailerUrl state (from your console.log):", trailerUrl);

  const fetchRecommendedShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) {
        setRecommendedShow(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const {
    axios,
    user,
    getToken,
    favoriteMovies,
    fetchFavoriteMovies,
    image_base_url,
  } = useAppContext();

  const navigate = useNavigate();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const fectchMovieTrailers = async () => {
    try {
      const data = axios.get(
        `${tmdbBase_url}/movie/${id}/videos?api_key=${API_KEY}`
      );
      const response = await data;
      const trailers = response.data.results;
      const trailer = trailers.find((trailer) => trailer.type === "Trailer");
      setTrailerUrl(
        trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) {
        return toast.error("Please login to add to favorites");
      }
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/update-favorite",
        {
          movieId: id,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        fetchFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchRecommendedShows();
    fectchMovieTrailers();
  }, [id, axios, API_KEY]);

  useEffect(() => {
    getShow();
  }, [id, axios]);

  return show ? (
    <>
      <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
        <div className=" flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          <img
            className="max-md:mx-auto rounded-xl h-104 object-cover"
            src={image_base_url + show?.movie?.poster_path}
            alt="moviePoster"
          />

          <div className="relative flex flex-col gap-3">
            <BlurCircle top="-100px" right="0px" />
            <p className=" text-[#f84565] uppercase">English</p>
            <h1 className="text-4xl font-semibold max-w-96 text-balance">
              {show?.movie?.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-300">
              <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <p
                className={`${
                  show?.movie?.vote_average >= 8
                    ? "text-green-500"
                    : show?.movie?.vote_average < 6
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {show?.movie?.vote_average.toFixed(1)}
              </p>
              <span className="text-gray-300">User Rating</span>
            </div>
            <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
              {show?.movie?.overview}
            </p>

            <p>
              {timeFormat(show?.movie?.runtime || "NA")} •{" "}
              {show?.movie?.genres.map((genra) => genra.name).join(", ")} •{" "}
              {show?.movie?.release_date.split("-")[0]}
            </p>

            <div className="flex items-center flex-wrap mt-2 gap-2">
              <button
                onClick={() => {
                  if (trailerUrl) {
                    setShowTrailerModal(true);
                  } else {
                    toast("No trailer available yet.", { icon: "ℹ️" });
                  }
                }}
                className="flex items-center gap-2 px-7 py-3 text-sm bg-gradient-to-b from-[#e63455] to-[#db7d18] hover:from-[#db7d18] hover:to-[#f84565] duration-300 ease-linear transition rounded-md font-medium cursor-pointer active:scale-95"
              >
                <PlayCircle className="w-5 h-5" />
                Watch Trailer
              </button>
              <a
                href="#dateSelect"
                className="px-10 py-3 text-sm bg-gradient-to-t from-[#e63455] to-[#db7d18] hover:from-[#db7d18] hover:to-[#f84565] duration-300 ease-in transition rounded-md font-medium cursor-pointer active:scale-95"
              >
                Buy Tickets
              </a>
              <button
                onClick={handleFavorite}
                className=" flex items-center gap-2 px-3 py-3 text-sm  bg-gray-800 hover:bg-gray-700 duration-300 ease-in transition rounded-full font-medium cursor-pointer active:scale-95"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favoriteMovies?.find((movie) => movie._id === id)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <p className="text-xl md:text-2xl font-semibold mt-10 text-gray-400">
          Cast
        </p>
        <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
          <div className="flex items-center gap-4 w-max px-4">
            {show?.movie?.casts?.slice(0, 12).map((cast, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <img
                  className="rounded-md w-22 md:w-26 object-cover"
                  src={image_base_url + cast?.profile_path}
                  alt="castImg"
                />
                <p className="font-medium text-xs mt-2 text-gray-400 ">
                  {cast?.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <DateSelect dateTime={show?.dateTime} id={id} />

        <p className="text-xl md:text-2xl font-semibold mt-10 text-gray-400 mb-5">
          You may also like
        </p>
        <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8 pb-20">
          <div className="flex flex-wrap max-sm:justify-center gap-5">
            {recommendedShows?.slice(0, 4).map((movie, index) => (
              <MovieCard key={index} movie={movie} />
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-10 mb-10">
          <button
            onClick={() => {
              navigate("/movies");
              scrollTo(0, 0);
            }}
            className="px-10 py-3 text-sm bg-gradient-to-t from-[#e63455] to-[#db7d18] hover:from-[#db7d18] hover:to-[#f84565] duration-300 ease-in transition rounded-md font-medium cursor-pointer active:scale-95"
          >
            Show More
          </button>
        </div>
      </div>

      {/* Trailer Modal*/}
      {showTrailerModal && trailerUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          {/* Changed background to a direct RGBA for more control (40% opacity) */}
          <div className="relative w-full max-w-4xl mx-auto p-4">
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute -top-10 right-0 text-white text-4xl p-2 z-50 rounded-full hover:scale-110 transition-transform duration-200"
            >
              <XCircle className="w-10 h-10 text-gray-300 hover:text-red-500" />
            </button>
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
              <ReactPlayer
                src={trailerUrl}
                controls={true}
                playing={false}
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <>
      <Loader />
    </>
  );
};

export default MovieDetails;
