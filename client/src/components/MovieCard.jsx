import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../appContext/AppContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();

  return (
    <div className="relative w-64 h-full max-h-[26rem] group">
      <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b from-slate-800/60 to-slate-900/60 transform transition duration-300 ease-linear group-hover:scale-105">
        <div className="relative">
          <img
            onClick={() => {
              navigate(`/movies/${movie._id}`);
              scrollTo(0, 0);
            }}
            src={image_base_url + movie.backdrop_path}
            alt={movie.title}
            className="w-full h-52 object-cover object-right-bottom cursor-pointer transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <span className="absolute left-3 top-3 bg-black/60 text-xs text-white px-2 py-1 rounded-full font-semibold">
            {new Date(movie.release_date).getFullYear()}
          </span>

          <span className="absolute right-3 top-3 bg-yellow-500/95 text-xs text-slate-900 px-2 py-1 rounded-full font-bold flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-slate-900" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : "--"}
          </span>
        </div>

        <div className="p-4">
          <p className="font-semibold text-lg leading-tight truncate">
            {movie.title}
          </p>

          <p className="text-sm text-gray-300 mt-1 line-clamp-2">
            {movie.overview
              ? movie.overview
              : movie.tagline
                ? movie.tagline
                : "No description available."}
          </p>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-400">
              {movie.genres && movie.genres.length > 0
                ? movie.genres
                    .slice(0, 2)
                    .map((g) => g.name)
                    .join(" • ") +
                  " • " +
                  timeFormat(movie.runtime)
                : timeFormat(movie.runtime)}
            </div>

            <button
              onClick={() => {
                navigate(`/movies/${movie._id}`);
                scrollTo(0, 0);
              }}
              className="px-3 py-2 bg-gradient-to-l from-[#f84565] to-[#d63854] hover:opacity-95 rounded-md text-sm font-medium text-white shadow-sm"
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
