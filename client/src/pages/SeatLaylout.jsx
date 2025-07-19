import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loader from "../components/Loader";
import { ArrowRight, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";

const SeatLaylout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { id, date } = useParams();
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
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

  const handleTimeClick = (time) => {
    setSelectedTime((prev) => (prev === time ? null : time));
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast.error("Please Select Show Time");
    }

    if (!selectedSeat.includes(seatId) && selectedSeat.length > 4) {
      return toast.error("You can select only 5 seats");
    }
    setSelectedSeat((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeat = (row, count = 9) => (
    <div key={row} className="flex md:gap-2 gap-1 mt-2">
      {Array.from({ length: count }, (_, i) => {
        const seatId = `${row}${i + 1}`;
        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            className={`md:h-8 md:w-8 w-4 h-4 md:rounded-md rounded border border-red-500/60 cursor-pointer ${
              selectedSeat.includes(seatId) && "bg-red-500 text-white"
            }`}
          >
            {seatId}
          </button>
        );
      })}
    </div>
  );

  useEffect(() => {
    getShow();
  }, [id]);

  console.log(show);

  return show ? (
    <>
      <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
        {/* Available Timeings */}
        <div className="w-60 bg-red-400/10 border border-amber-500/20 rounded-lg py-10 h-max md:sticky md:top-30">
          <p className="text-lg font-semibold px-6">Available Timings</p>
          <div className="mt-5 space-y-1">
            {show.dateTime[date].map((item) => (
              <div
                key={item.time}
                onClick={() => handleTimeClick(item)}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition duration-300 ease-in ${
                  selectedTime?.time === item.time
                    ? "bg-red-500 text-white"
                    : "hover:bg-red-500/40"
                }`}
              >
                <ClockIcon className="w-5 h-5" />
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Seat Laylout */}
        <div className="relative flex-1 flex flex-col items-center max-md:mt-16 ">
          <BlurCircle top="-100px" left="-100px" />
          <BlurCircle bottom="0px" right="0px" />
          <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>
          <img src={assets.screenImage} alt="screen" />
          <p className="text-gray-400 text-sm mb-6 uppercase">Screen side</p>

          <div className="flex flex-col items-center mt-10 md:text-xs text-[8px] text-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-1 md:gap-1 mb-6">
              {groupRows[0].map((row) => renderSeat(row))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:gap-10 gap-5 md:text-xs text-[8px] text-gray-300">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeat(row))}</div>
            ))}
          </div>

          {/* Booking Summary and Action Button */}
          <div className="mt-10 p-4 bg-red-400/10 rounded-lg w-full max-w-xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-[2px] text-white text-sm mb">
              <p>
                Selected Seats:&nbsp;
                <span className={`${selectedSeat.length > 0 ? "text-green-300" : "text-gray-300"}`}>
                  {selectedSeat.length > 0 ? selectedSeat.join(", ") : "None"}
                </span>
              </p>
              <p>
                Show Time:&nbsp;
                <span
                  className={`${
                    selectedTime ? "text-indigo-300" : "text-gray-300"
                  }`}
                >
                  {selectedTime
                    ? isoTimeFormat(selectedTime.time)
                    : "Not selected"}
                </span>
              </p>
            </div>
            <button
              onClick={() => {
                if (selectedSeat.length === 0 || !selectedTime) {
                  toast.error("Please select seats and show time.");
                } else {
                  navigate("/mybookings");
                }
              }}
              className="group flex items-center gap-1 px-6 py-3 text-sm bg-gradient-to-b from-[#f84565] to-[#d63854] hover:from-[#d63854] hover:to-[#f84565] duration-300 ease-in transition rounded-md font-medium cursor-pointer opacity-80"
            >
              Proceed to Book
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 duration-300 ease-in" />
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Loader />
    </>
  );
};

export default SeatLaylout;
