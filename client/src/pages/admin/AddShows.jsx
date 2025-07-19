import { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import Loader from "../../components/Loader";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import kConverter from "../../lib/kConverter";
import toast from "react-hot-toast";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Fetches the list of movies currently playing in theaters.
   * NOTE: This is a placeholder function and will be replaced with a real API call.
   */
  /*******  12d18fe7-91af-439f-816b-3908fed80359  *******/
  const fetchNowPlayingMovies = async () => {
    setNowPlayingMovies(dummyShowsData);
  };

  // console.log(selectedMovie);

  const dateTimeHandler = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return {
          ...prev,
          [date]: [...times, time],
        };
      }
      return prev;
    });
  };

  const handleRemoveTimeDate = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredtime = prev[date].filter((t) => t !== time);
      if (filteredtime.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filteredtime,
      };
    });
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return nowPlayingMovies.length > 0 ? (
    <>
      <div className="relative mt-10">
        <Title text1="Add" text2="Shows" />
        <BlurCircle top="-10px" left="0px" />
        <div className="overflow-x-auto pb-4 no-scrollbar">
          <div className="flex flex-wrap group gap-4 mt-4 w-max">
            {nowPlayingMovies.map((movie) => (
              <div
                onClick={() => {
                  setSelectedMovie(movie.id);
                  movie?.vote_count;
                  toast.success("Movie Show Selected");
                }}
                key={movie.id}
                className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-50 hover:scale-105 transition duration-300 ease-in `}
              >
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={movie?.poster_path}
                    alt="poster"
                    className="w-full object-cover brightness-90"
                  />
                  <div className=" absolute bottom-0 left-0 w-full flex items-center justify-between text-sm p-2 bg-black/50">
                    <p className="flex items-center gap-1 text-gray-400">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </p>
                    <p className="text-gray-300">
                      {kConverter(movie?.vote_count)} Votes
                    </p>
                  </div>
                </div>
                {selectedMovie === movie.id && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                    <div className="bg-green-500/70 rounded-md flex items-center justify-center p-2">
                      <CheckIcon
                        className="w-5 h-5 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                )}
                <p className="font-medium truncate">{movie?.title}</p>
                <p className="text-gray-400 text-sm">{movie?.release_date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Show Price Input */}
      <div className="mt-8">
        <BlurCircle top="450px" right="200px" />
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min={0}
            className="outline-none"
            type="number"
            placeholder="Enter Show Price"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Select Date & Time
        </label>
        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            className="outline-none rounded-md"
            type="datetime-local"
            placeholder="Enter Show Price"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
          />
          <button
            className="bg-red-500/80 px-3 py-2 rounded-lg hover:bg-red-500 text-sm text-white cursor-pointer"
            onClick={dateTimeHandler}
          >
            Add Time
          </button>
        </div>
      </div>

      {/* Display Selected Date & Time */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6 ">
          <h1 className="mb-2">Selected Date & Time</h1>
          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className="font-medium">{date}</div>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {times.map((time) => (
                    <div
                      key={time}
                      className="flex border border-red-500 px-3 py-1 items-center rounded-md"
                    >
                      <span>{time}</span>

                      <DeleteIcon
                        width={15}
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => handleRemoveTimeDate(date, time)}
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Show Button */}
      <button className=" mt-6 px-8 py-2 rounded-lg bg-gradient-to-b from-red-500 to-red-700 hover:bg-gradient-to-b hover:from-red-700 hover:to-red-500 transition duration-300 ease-in mb-6 active:scale-95 text-white cursor-pointer">
        Add Show
      </button>
    </>
  ) : (
    <>
      <Loader />
    </>
  );
};

export default AddShows;
