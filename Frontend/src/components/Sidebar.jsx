import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router-dom";
import {
  BellIcon,
  HomeIcon,
  ShipWheelIcon,
  UsersIcon,
} from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: HomeIcon,
    },
    {
      name: "Friends",
      path: "/friends",
      icon: UsersIcon,
    },
    {
      name: "Notifications",
      path: "/notification",
      icon: BellIcon,
    },
  ];

  return (
    <aside
      className="
        hidden lg:flex
        flex-col
        w-72
        h-screen
        sticky
        top-0
        bg-base-100
        border-r border-base-300
        shadow-lg
      "
    >
      {/* Logo */}
      <div className="h-16 border-b border-base-300 px-6 flex items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <ShipWheelIcon className="size-7 text-primary" />
          </div>

          <span className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Vivid
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-content shadow-md"
                  : "hover:bg-base-200"
              }`}
            >
              <Icon
                className={`size-5 ${
                  isActive
                    ? "text-primary-content"
                    : "text-base-content/70"
                }`}
              />

              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-base-300 bg-base-200">
        <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-base-300 transition">
          <div className="avatar">
            <div className="w-12 rounded-full ring ring-primary ring-offset-2 ring-offset-base-200">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="font-semibold truncate">
              {authUser?.fullName}
            </p>

            <p className="text-sm text-success flex items-center gap-2">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;