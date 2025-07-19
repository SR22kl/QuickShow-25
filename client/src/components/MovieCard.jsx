import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col justify-between p-3 bg-gray-600/30 rounded-2xl group-hover:not-hover:opacity-50 hover:scale-105 transition duration-300 ease-linear w-64">
        <img
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          src={movie.backdrop_path}
          alt="movieImg"
          className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
        />
        <p className="font-semibold mt-2 truncate">{movie.title}</p>
        <p className="text-sm text-gray-400 mt-2">
          {new Date(movie.release_date).getFullYear()} •{" "}
          {movie.genres
            .slice(0, 2)
            .map((genra) => genra.name)
            .join(" | ")}{" "}
          • {timeFormat(movie.runtime)}
        </p>

        <div className="flex items-center justify-between mt-4 pb-3">
          <button
            onClick={() => {
              navigate(`/movies/${movie._id}`);
              scrollTo(0, 0);
            }}
            className="px-4 py-2 text-xm bg-gradient-to-l from-[#f84565] to-[#d63854] hover:from-[#d63854] hover:to-[#f84565] duration-300 ease-in transition rounded-md font-medium cursor-pointer"
          >
            Book Tickets
          </button>
          <p className="flex items-center gap-1 text-sm text-gray-400 mt-2 pr-2">
            <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            {movie.vote_average.toFixed(1)}
          </p>
        </div>
      </div>
    </>
  );
};

export default MovieCard;
