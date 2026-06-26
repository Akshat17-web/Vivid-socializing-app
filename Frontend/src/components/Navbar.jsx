import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/logout");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
  });

  const handleLogout = () => {
    logoutMutation();
  };

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        h-16
        bg-base-200/80
        backdrop-blur-md
        border-b border-base-300
      "
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Mobile Logo */}
        {isChatPage && (
          <div className="pl-5">
            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary  tracking-wider">
                Vivid
              </span>
            </Link>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <Link to="/notification">
            <button className="btn btn-ghost btn-circle hover:bg-base-300">
              <BellIcon className="size-5" />
            </button>
          </Link>

          <ThemeSelector />

          <button className="btn btn-ghost btn-circle">
            <div className="avatar">
              <div className="w-8 rounded-full ring ring-primary ring-offset-2 ring-offset-base-200">
                <img src={authUser?.profilePic} alt="Profile" />
              </div>
            </div>
          </button>

          <button
            className="btn btn-ghost btn-circle hover:bg-error/10 hover:text-error"
            onClick={handleLogout}
          >
            <LogOutIcon className="size-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
