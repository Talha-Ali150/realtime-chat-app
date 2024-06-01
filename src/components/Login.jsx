import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { UserState } from "../context/UserContext";
import { CiMail } from "react-icons/ci";
import { MdKey } from "react-icons/md";

const Login = () => {
  const { state, login, logout } = UserState();
  const { user } = state;

  const logoutUser = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      logout();
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  };

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const submitForm = async (e) => {
    e.preventDefault();

    const validateForm = () => {
      const errors = {};
      if (!userInfo.email) {
        errors.email = "Please enter email";
      }
      if (!userInfo.password) {
        errors.password = "Please enter password";
      }
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    if (!validateForm()) {
      return;
    }

    try {
      const response = await signInWithEmailAndPassword(
        auth,
        userInfo.email,
        userInfo.password
      );
      login({ email: response.user.email, userID: response.user.uid });
      navigate("/");
    } catch (error) {
      setError(error.code);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-customGreen h-screen flex flex-col justify-center items-center">
      <form
        className="flex flex-col text-white  p-3 rounded-lg text-center w-[25rem] mx-auto bg-opacity-50"
        onSubmit={submitForm}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
      >
        <p className="text-center m-3">Sign In</p>
        <p className="text-center m-3">Login to manage your account</p>
        <div className="flex justify-center items-center mb-3">
          <CiMail className="text-2xl m-3" />
          <input
            type="email"
            id="email"
            placeholder="Eg: John@mail.com"
            className="bg-transparent outline-none text-white placeholder-gray-400 border-b-2 border-white focus:border-green-300 transition-colors duration-300 w-full"
            value={userInfo.email}
            onChange={(e) => {
              setUserInfo({ ...userInfo, email: e.target.value });
            }}
          />
        </div>
        <p className="text-red-500">{formErrors.email}</p>

        <div
          className="flex justify-center items-center mb-3"
        >
          <MdKey className="text-2xl m-3" />
          <input
            type="password"
            id="password"
            placeholder="john1234"
            // className="bg-transparent outline-none"
            className="bg-transparent outline-none text-white placeholder-gray-400 border-b-2 border-white focus:border-green-300 transition-colors duration-300 w-full"
            value={userInfo.password}
            onChange={(e) => {
              setUserInfo({ ...userInfo, password: e.target.value });
            }}
          />
        </div>

        <p className="text-red-500">{formErrors.password}</p>
        <p className="text-red-500">{error}</p>

        <button
          type="submit"
          className="m-3 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300"
        >
          Log in
        </button>
      </form>

      {user && (
        <button className="text-white m-3" onClick={logoutUser}>
          logout
        </button>
      )}
    </div>
  );
};

export default Login;
