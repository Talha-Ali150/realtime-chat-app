import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { MdKey } from "react-icons/md";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "", fullname: "" });
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const submitForm = async (e) => {
    e.preventDefault();

    const validateForm = () => {
      const errors = {};
      if (!user.email) {
        errors.email = "Please enter email";
      }
      if (!user.password) {
        errors.password = "Please enter password";
      }
      if (!user.fullname) {
        errors.fullname = "Please enter full name";
      }
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    if (!validateForm()) {
      return;
    }

    function addUserToDb(userInfo, uid) {
      const { email, fullname } = userInfo;

      return setDoc(doc(db, "users", uid), { email, fullname });
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      let userInfo = {};
      userInfo.email = user.email;
      userInfo.fullname = user.fullname;
      navigate("/login");
      await addUserToDb(userInfo, userCredential.user.uid);
    } catch (error) {
      setError(error.code);
    }
  };
  return (
    <div className="bg-gradient-to-r from-slate-900 to-customGreen h-screen flex flex-col justify-center items-center">
      <form
        className="flex flex-col text-white  p-3 rounded-lg text-center w-[90vw] mx-auto bg-opacity-50 md:w-[50vw]"
        onSubmit={submitForm}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
      >
        <p className="text-center m-3">Sign Up</p>
        <div className="flex justify-center items-center mb-3">
          <CiMail className="text-2xl m-3" />
          <input
            type="email"
            id="email"
            placeholder="Eg: John@mail.com"
            className="bg-transparent outline-none text-white placeholder-gray-400 border-b-2 border-white focus:border-green-300 transition-colors duration-300 w-full"
            value={user.email}
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
            }}
          />
          <p className="text-red-500">{formErrors.email}</p>
        </div>

        <div className="flex justify-center items-center mb-3">
          <MdKey className="text-2xl m-3" />
          <input
            type="password"
            id="password"
            placeholder="john1234"
            className="bg-transparent outline-none text-white placeholder-gray-400 border-b-2 border-white focus:border-green-300 transition-colors duration-300 w-full"
            value={user.password}
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />
          <p className="text-red-500">{formErrors.password}</p>
        </div>

        <div className="flex justify-center items-center mb-3">
          <MdOutlineDriveFileRenameOutline className="text-2xl m-3" />
          <input
            type="text"
            id="fullname"
            placeholder="john doe"
            className="bg-transparent outline-none text-white placeholder-gray-400 border-b-2 border-white focus:border-green-300 transition-colors duration-300 w-full"
            value={user.fullname}
            onChange={(e) => {
              setUser({ ...user, fullname: e.target.value });
            }}
          />
        </div>
        <p className="text-red-500">{formErrors.fullname}</p>
        <p className="text-red-500">{error}</p>
        <button
          type="submit"
          className="m-3 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300"
        >
          Sign Up
        </button>
        <p>OR</p>
        <button
onClick={(e) => {
  e.preventDefault();
  navigate("/login");
}}
          className="m-3 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Signup;
