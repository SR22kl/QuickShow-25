import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col justify-center items-start gap-4 px-6 md:px-16 lg:px-36 bg-[url('/bgImg.png')] bg-cover bg-center h-screen">
        <img
          src={assets.marvelLogo}
          alt="logo"
          className="max-h-11 lg:h-11"
        />
        <h1 className="text-4xl sm:text-5xl md:text-[70px] font-semibold md:leading-18">
          Gurandians <br />
          of the Galaxy Vol. 3
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-gray-300">
          <span>Action| Adventure | Sci-Fi</span>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            2023
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5" />
            2h 29m
          </div>
        </div>
        <p className="max-w-md text-gray-300">
          Still reeling from the loss of Gamora, Peter Quill must rally his team
          to defend the universe and protect one of their own. If the mission is
          not completely successful, it could possibly lead to the end of the
          Guardians as we know them.
        </p>
        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-1 px-6 py-3 text-sm bg-gradient-to-b from-[#f84565] to-[#d63854] hover:from-[#d63854] hover:to-[#f84565] duration-300 ease-in transition rounded-full font-medium cursor-pointer"
        >
          Explore Movies!
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 duration-300 ease-in" />
        </button>
      </div>
    </>
  );
};

export default Banner;