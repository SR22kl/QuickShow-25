import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loader = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate("/" + nextUrl);
      }, 8000);
    }
  }, [nextUrl]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#09090b] md:mt-0 -mt-10">
      {/* Spinner container */}
      <div className="relative md:w-24 md:h-24 w-20 h-20">
        {/* Outer ring (background) */}
        <div className="w-full h-full rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
        {/* Inner spinning ring */}
        <div className="w-full h-full rounded-full absolute top-0 left-0 border-8 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent animate-spin dark:border-t-red-500 dark:border-r-red-500"></div>
      </div>
    </div>
  );
};

export default Loader;
