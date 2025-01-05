import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import { AxiosPost } from "../utils/axiosCaller";
import { useCookies } from "react-cookie";
import { constants } from "../utils/constants";
import { useToast } from "@/hooks/use-toast";
import { AppContext } from "@/lib/Appcontext";

const Login = () => {
  // toast message hook
  const { toast } = useToast();

  // to set the token (user's information) in the cookies
  const [cookies, setCookie] = useCookies([
    constants.COOKIES_KEY.AUTH_TOKEN,
    constants.COOKIES_KEY.USER_ID,
  ]);

  // to navigate to the home page after successful login
  const navigate = useNavigate();

  const [formInputs, setFormInputs] = useState({}); // to store the form inputs
  const [passwordVisible, setPasswordVisible] = useState(false); // to toggle the password visibility

  const handleFormInputChange = (key, value) => {
    setFormInputs((prevInputs) => ({
      ...prevInputs,
      [key]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    toast({
      title: "Logging in... Please wait.",
    });

    try {
      const body = {
        email: formInputs.email,
        password: formInputs.password,
      };

      const api = "api/auth/login";
      const { data } = await AxiosPost(api, body);
      setCookie(constants.COOKIES_KEY.AUTH_TOKEN, data.data.token);
      setCookie(constants.COOKIES_KEY.USER_ID, data.data.userId);

      setTimeout(() => {
        navigate("/home");
        toast({
          title: "Logged in successfully!",
        });
      }, 3000);
    } catch (error) {
      console.error("Error while logging up: ", error);
      toast({
        variant: "destructive",
        title:
          error?.response?.data?.message ||
          "Error while logging in. Please try again later.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-md bg-white text-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-yellow-600 mb-6 flex items-center justify-center">
          <FontAwesomeIcon icon={faUser} className="mr-3" /> Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* email input Field */}
          <div>
            <input
              id="email"
              type="email"
              placeholder="Email"
              onChange={(event) =>
                handleFormInputChange("email", event.target.value)
              }
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>

          {/* password input field  */}
          <div className="relative">
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              onChange={(event) =>
                handleFormInputChange("password", event.target.value)
              }
              className="w-full mt-1 px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <FontAwesomeIcon
                icon={!passwordVisible ? faEyeSlash : faEye}
                className="text-xl"
              />
            </button>
          </div>

          {/* form submission button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-200"
          >
            Login
          </button>
        </form>

        {/* to signup page navigation button  */}
        <div className="mt-6 flex justify-center items-center space-x-4">
          <p className="text-sm">
            Don't have an account?{" "}
            <span
              className="font-semibold  text-blue-600  hover:underline cursor-pointer transition duration-200"
              onClick={() => navigate("/signup")}
            >
              Sign up!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
