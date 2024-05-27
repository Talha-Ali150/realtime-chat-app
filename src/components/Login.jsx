import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { UserState } from "../context/UserContext";

const Login = () => {
  const { state, login, logout } = UserState();
  const { user } = state;

  // const currentUserId = () => {
  //   const userId = auth.currentUser.uid;
  // };

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
    <div>
      <form
        className="flex flex-col bg-red-700 text-center w-[40rem] mx-auto"
        onSubmit={submitForm}
      >
        <label htmlFor="email">EMAIL</label>
        <input
          type="email"
          id="email"
          placeholder="Eg: John@mail.com"
          value={userInfo.email}
          onChange={(e) => {
            setUserInfo({ ...userInfo, email: e.target.value });
          }}
        />
        <p className="text-red-500">{formErrors.email}</p>
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          id="password"
          placeholder="john1234"
          value={userInfo.password}
          onChange={(e) => {
            setUserInfo({ ...userInfo, password: e.target.value });
          }}
        />
        <p className="text-red-500">{formErrors.password}</p>
        <p className="text-red-500">{error}</p>
        <button type="submit">Log in</button>
      </form>

      {user && (
        <button className="bg-orange-300" onClick={logoutUser}>
          logout
        </button>
      )}
    </div>
  );
};

export default Login;
