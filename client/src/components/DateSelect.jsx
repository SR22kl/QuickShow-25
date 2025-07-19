import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import BlurCircle from "./BlurCircle";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DateSelect = ({ dateTime, id }) => {
  const [selectDate, setSelectDate] = useState(null);

  const navigate = useNavigate();

  const onBookHandler = () => {
    if (!selectDate) {
      return toast.error("Please select a date");
    }
    navigate(`/movies/${id}/${selectDate}`);
    scrollTo(0, 0);
  };
  return (
    <>
      <div id="dateSelect" className="pt-30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-amber-600/10 border-amber-600/20 rounded-lg">
          <BlurCircle top="-100px" left="-100px" />
          <BlurCircle top="100px" right="0px" />
          <div>
            <p className="text-lg font-semibold">Choose Date</p>
            <div className="flex items-center gap-6 text-sm mt-5">
              <ChevronLeftIcon width={28} />
              <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
                {Object.keys(dateTime).map((date) => (
                  <button
                    onClick={() => setSelectDate(date)}
                    className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded-lg cursor-pointer active:scale-95 ${
                      selectDate === date
                        ? "bg-red-500 text-white"
                        : " border border-amber-600/70"
                    }`}
                    key={date}
                  >
                    <span>{new Date(date).getDate()}</span>
                    <span>
                      {new Date(date).toLocaleString("en-US", {
                        month: "short",
                      })}
                    </span>
                  </button>
                ))}
              </span>
              <ChevronRightIcon width={28} />
            </div>
          </div>
          <button
            onClick={onBookHandler}
            className="px-4 py-2 text-sm bg-gradient-to-l from-[#f84565] to-[#d63854] hover:from-[#d63854] hover:to-[#f84565] duration-300 ease-in transition rounded-md font-medium cursor-pointer active:scale-75"
          >
            Book Now!
          </button>
        </div>
      </div>
    </>
  );
};

export default DateSelect;
