import React, { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { constants } from "../utils/constants";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  // toast message hook
  const { toast } = useToast();

  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies([
    constants.COOKIES_KEY.AUTH_TOKEN,
    constants.COOKIES_KEY.USER_ID,
  ]);
  const logout = async (e) => {
    e.preventDefault();

    toast({
      title: "Logging out... Please wait.",
    });

    try {
      setCookie(constants.COOKIES_KEY.AUTH_TOKEN, null);
      setCookie(constants.COOKIES_KEY.USER_ID, null);

      setTimeout(() => {
        navigate("/login");
        toast({
          title: "Logged out successfully!",
        });
      }, 3000);
    } catch (error) {
      console.error("Error while logging out: ", error);
      toast({
        variant: "destructive",
        title: "Error while logging out. Please try again later.",
      });
    }
  };

  return (
    <nav className="text-white px-4 py-2 shadow-md">
      <div className="flex justify-between ">
        <div className="text-lg font-bold">Custom Sheets </div>
        <div className="flex space-x-4">
          {/* <Link to="/" className="hover:cursor-not-allowed transition-colors">
            Home
          </Link>
          <Link
            to="/about"
            className="hover:cursor-not-allowed transition-colors"
          >
            About
          </Link> */}
          <Button onClick={logout} className="cursor-pointer transition-colors">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
