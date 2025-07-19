import { useState } from "react";
import ReactPlayer from "react-player";
import { dummyTrailers } from "../assets/assets";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
  return (
    <>
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-10 md:py-20 overflow-hidden">
        <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto text-center md:text-left">
          Trailers
        </p>
        <div className="relative mt-6 max-w-[960px] mx-auto overflow-hidden">
          {" "}
          {/* Added max-w and overflow-hidden */}
          <BlurCircle top="-100px" right="-100px" />
          {/* Responsive ReactPlayer wrapper */}
          <div className="relative pt-[56.25%]">
            {" "}
            {/* 16:9 Aspect Ratio (height / width = 9 / 16 = 0.5625) */}
            <ReactPlayer
              className="absolute top-0 left-0"
              width="100%"
              height="100%"
              src={currentTrailer?.videoUrl}
              controls={true} // Changed to true for better user experience on mobile
            />
          </div>
        </div>
        {/* Adjusted grid for responsiveness */}
        <div className="group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
          {dummyTrailers.map((trailer) => (
            <div
              key={trailer.image}
              className="relative group-hover:not-hover:opacity-50 hover:scale-110 duration-300 ease-linear transition max-md:h-60 cursor-pointer rounded-lg overflow-hidden" // Added rounded-lg and overflow-hidden
              onClick={() => setCurrentTrailer(trailer)}
            >
              <img
                src={trailer?.image}
                alt="trailer"
                className="w-full h-full object-cover brightness-75" // Ensure image fills container
              />
              <PlayCircleIcon
                strokeWidth={1.6}
                className="absolute top-1/2 left-1/2 w-8 h-8 md:w-12 md:h-12 transform -translate-x-1/2 -translate-y-1/2 text-white" // Added text-white for visibility
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TrailerSection;
