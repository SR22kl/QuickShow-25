import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { TicketPlus } from "lucide-react";

const AdminNavbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between bg-gradient-to-t from-gray-800  px-6 py-5 md:px-10 ">
        <Link to={"/"}>
          <img src={assets.logo} alt="logo" className="w-36 h-auto" />
        </Link>
        {user && (
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
    </>
  );
};

export default AdminNavbar;
