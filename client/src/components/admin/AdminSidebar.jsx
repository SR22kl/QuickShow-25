import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
} from "lucide-react";
import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const user = {
    firstName: "Admin",
    lastName: "User",
    imageUrl: assets.profile,
  };
  const adminNavlinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Shows", path: "/admin/add-shows", icon: PlusSquareIcon },
    { name: "List Shows", path: "/admin/list-shows", icon: ListIcon },
    {
      name: "List Bookings",
      path: "/admin/list-bookings",
      icon: ListCollapseIcon,
    },
  ];
  return (
    <>
      <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-12 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
        <img
          className="h-9 w-9 md:h-14 md:w-14 mx-auto rounded-full"
          src={user.imageUrl}
          alt="profile"
        />
        <p className="mt-2 text-base max-md:hidden">
          {user.firstName} {user.lastName}
        </p>
        <div className="w-full">
          {adminNavlinks.map((link, index) => (
            <NavLink
              className={({ isActive }) =>
                `relative flex items-center max-md:justify-center gap-2 w-full py-3 min-md:pl-10 first:mt-6 text-gray-400 ${
                  isActive && "bg-red-500/15 text-red-500 group"
                }`
              }
              to={link.path}
              key={index}
              end
            >
              {({ isActive }) => (
                <>
                  <link.icon className="w-5 h-5" />
                  <span className="max-md:hidden">{link.name}</span>
                  <span
                    className={`w-1.5 h-10 rounded-md right-0 absolute ${
                      isActive && "bg-red-500"
                    }`}
                  ></span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
