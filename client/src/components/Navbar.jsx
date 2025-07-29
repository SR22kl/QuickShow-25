import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../appContext/AppContext";

const Navbar = () => {
  const [isopen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { favoriteMovies } = useAppContext();

  // console.log(favoriteMovies);

  const toggleMenu = () => {
    setIsOpen(!isopen);
  };

  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled more than 50px from the top
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 transition-all duration-300 ease-in-out ${
          scrolled ? "backdrop-blur-sm bg-black/40" : "bg-transparent"
        }`}
      >
        <Link to={"/"} className="max-md:flex-1">
          <img src={assets.logo} alt="logo" className="w-36 h-auto" />
        </Link>

        <div
          className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-4 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur-md bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-all duration-300 ease-in ${
            isopen ? "max-md:w-full" : "max-md:w-0"
          }`}
        >
          <XIcon
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute w-8 h-8 top-6 right-6 hover:text-red-500 duration-300 ease-linear cursor-pointer"
          />
          <Link
            onClick={() => {
              setIsOpen(false), scrollTo(0, 0);
            }}
            to={"/"}
            className="relative text-white no-underline inline-block py-2 group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            onClick={() => {
              setIsOpen(false);
              scrollTo(0, 0);
            }}
            to={"/movies"}
            className="relative text-white no-underline inline-block py-2 group"
          >
            Movies
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            onClick={() => {
              setIsOpen(false);
              scrollTo(0, 0);
            }}
            to={"/"}
            className="relative text-white no-underline inline-block py-2 group"
          >
            Theaters
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {user && favoriteMovies?.length > 0 && (
            <Link
              onClick={() => {
                setIsOpen(false);
                scrollTo(0, 0);
              }}
              to={"/favorite"}
              className="relative text-white no-underline inline-block py-2 group"
            >
              Favorites
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}
          <Link
            onClick={() => {
              setIsOpen(false);
              scrollTo(0, 0);
            }}
            to={"/admin"}
            className="relative text-white no-underline inline-block py-2 group"
          >
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6 lg:gap-10">
          <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
          {!user ? (
            <button
              onClick={openSignIn}
              className="px-4 py-2 sm:px-7 sm:py-2 bg-gradient-to-b from-[#ff4d6d] to-[#ff6f61] hover:from-[#ef6c15] hover:to-[#e1062e] duration-300 ease-in text-white transition rounded-full font-medium"
            >
              Login
            </button>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<TicketPlus width={15} />}
                  onClick={() => navigate("/mybookings")}
                />
              </UserButton.MenuItems>
            </UserButton>
          )}
        </div>
        <MenuIcon
          onClick={toggleMenu}
          className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        />
      </nav>
    </>
  );
};

export default Navbar;
