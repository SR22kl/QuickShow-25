import { useAppContext } from "../appContext/AppContext";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";

const Movies = () => {
  const { show } = useAppContext();

  return show.length > 0 ? (
    <>
      <div className="relative mt-40 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] ">
        <BlurCircle top="150px" left="0px" />
        <BlurCircle bottom="50px" right="50px" />
        <h1 className="text-gray-300 font-medium text-xl my-4">Now Showing!</h1>
        <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8 pb-20">
          {show?.map((show) => (
            <div key={show._id} className="justify-self-center">
              <MovieCard movie={show} />
            </div>
          ))}
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">
          No Movies Shows Are Available At The Moment
        </h1>
      </div>
    </>
  );
};

export default Movies;
