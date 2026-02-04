import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-lg transition-all duration-300"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative h-[calc(100vh-64px)] flex flex-col items-center pt-8 w-64 md:w-60 border-r border-gray-300/20 bg-gradient-to-b from-gray-900 to-black text-sm transition-all duration-300 ease-in-out z-40 ${
          isOpen ? "left-0" : "-left-64 md:left-0"
        }`}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8 w-full px-4">
          <div className="relative">
            <img
              className="h-16 w-16 rounded-full border-3 border-red-500/50 object-cover"
              src={user.imageUrl}
              alt="profile"
            />
            <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-black"></div>
          </div>
          <p className="mt-4 text-base font-semibold text-gray-100">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-400 mt-1">Administrator</p>
        </div>

        {/* Navigation Links */}
        <div className="w-full flex-1 space-y-2 px-3">
          {adminNavlinks.map((link, index) => (
            <NavLink
              className={({ isActive }) =>
                `relative flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-500 shadow-lg shadow-red-500/20"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`
              }
              to={link.path}
              key={index}
              end
              onClick={() => setIsOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`}
                  />
                  <span className="flex-1">{link.name}</span>
                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer Section */}
        <div className="w-full px-3 py-4 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 text-center">
            QuickShow Admin Panel v1.0
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
