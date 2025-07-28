import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../appContext/AppContext";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";

const FeatureSection = () => {
  const navigate = useNavigate();

  const { show } = useAppContext();

  return (
    <>
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
        <div className=" relative flex items-center justify-between pt-20 pb-10">
          <BlurCircle top="0" right="-80px" />
          <p className="text-gray-300 font-medium text-lg">Now Showing!</p>
          <button
            onClick={() => navigate("/movies")}
            className="group flex items-center gap-2 text-sm cursor-pointer"
          >
            View All
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 duration-300 ease-in" />
          </button>
        </div>

        <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">
          {show.slice(0, 4).map((show) => (
            <div key={show._id} className="justify-self-center">
              <MovieCard movie={show} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <button
            onClick={() => {
              navigate("/movies");
              scrollTo(0, 0);
            }}
            className="px-10 py-3 text-sm bg-gradient-to-l from-[#f84565] to-[#d63854] hover:from-[#d63854] hover:to-[#f84565] duration-300 ease-in transition rounded-md font-medium cursor-pointer"
          >
            Show More
          </button>
        </div>
      </div>
    </>
  );
};

export default FeatureSection;
