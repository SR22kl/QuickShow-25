import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircle, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const navigate = useNavigate();

  const getShow = async () => {
    const show = dummyShowsData.find((show) => show._id === id);
    if (show) {
      setShow({
        movie: show,
        dateTime: dummyDateTimeData,
      });
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);
  return show ? (
    <>
      <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
        <div className=" flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          <img
            className="max-md:mx-auto rounded-xl h-104 object-cover"
            src={show?.movie?.poster_path}
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
              <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gradient-to-b from-[#e63455] to-[#db7d18] hover:from-[#db7d18] hover:to-[#f84565] duration-300 ease-linear transition rounded-md font-medium cursor-pointer active:scale-95">
                <PlayCircle className="w-5 h-5" />
                Watch Trailer
              </button>
              <a
                href="#dateSelect"
                className="px-10 py-3 text-sm bg-gradient-to-t from-[#e63455] to-[#db7d18] hover:from-[#db7d18] hover:to-[#f84565] duration-300 ease-in transition rounded-md font-medium cursor-pointer active:scale-95"
              >
                Buy Tickets
              </a>
              <button className=" flex items-center gap-2 px-3 py-3 text-sm  bg-gray-800 hover:bg-gray-700 duration-300 ease-in transition rounded-full font-medium cursor-pointer active:scale-95">
                <Heart className="w-5 h-5" />
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
                  src={cast?.profile_path}
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
        <div className="flex flex-wrap max-sm:justify-center gap-5">
          {dummyShowsData.slice(0, 4).map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
        </div>
        <div className="flex justify-center mt-20">
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
    </>
  ) : (
    <>
      <Loader />
    </>
  );
};

export default MovieDetails;
