import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UserIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../appContext/AppContext";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import Loader from "../../components/Loader";
import dateFormat from "../../lib/dateFormat";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, user, getToken, image_base_url } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    totalBooking: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBooking || "0",
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: currency + dashboardData.totalRevenue || "0",
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length || "0",
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      icon: UserIcon,
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching dashboard data", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return !loading ? (
    <>
      <div className="mt-14 md:mt-10">
        <Title text1={"Admin"} text2={"Dashboard"} />
        <div className="relative flex flex-wrap gap-4 mt-6">
          <BlurCircle top="-100px" left="0px" />
          <div className="flex flex-wrap gap-4 w-full">
            {dashboardCards.map((card, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-3 max-w-50 w-full bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <div>
                  <h1 className="text-xs md:text-[1rem] font-medium text-gray-300">
                    {card.title}
                  </h1>
                  <p className="md:text-2xl text-xl font-semibold mt-2">
                    {card.value}
                  </p>
                </div>
                <card.icon className="w-6 h-6 text-red-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <h1 className="mt-10 font-medium text-lg">Active Shows</h1>

      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl ">
        <BlurCircle top="100px" right="-100px" />
        {dashboardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-red-500/10 border border-red-500/20 hover:-translate-y-1.5 transition duration-300 ease-in cursor-pointer"
          >
            <img
              src={image_base_url + show?.movie?.poster_path}
              alt="poster"
              className="h-full w-full"
            />
            <p className="font-medium text-lg p-2 truncate">
              {show?.movie?.title}
            </p>
            <div className="flex items-center justify-between px-2">
              <p className="text-sm font-medium">
                {currency}
                {show?.showPrice}
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {show?.movie?.vote_average.toFixed(1)}
              </p>
            </div>
            <p className="px-2 pt-2 text-sm text-gray-500">
              {dateFormat(show?.showDateTime)}
            </p>
          </div>
        ))}
      </div>
    </>
  ) : (
    <>
      <Loader />
    </>
  );
};

export default Dashboard;
