import { dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";

const Movies = () => {
  return dummyShowsData.length > 0 ? (
    <>
      <div className="relative mt-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] ">
        <BlurCircle top="150px" left="0px" />
        <BlurCircle bottom="50px" right="50px" />
        <h1 className="text-gray-300 font-medium text-lg my-4">Now Showing!</h1>
        <div className="flex flex-wrap group gap-8 max-sm:justify-center ">
          {dummyShowsData.map((movie) => (
            <MovieCard movie={movie} key={movie._id} />
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
