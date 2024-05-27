import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
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
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    if (!validateForm()) {
      return;
    }

    try {
      const response = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      console.log("form submitted");
      console.log(user.email);
      console.log(user.password);
      console.log(response.user.uid);
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
          value={user.email}
          onChange={(e) => {
            setUser({ ...user, email: e.target.value });
          }}
        />
        <p className="text-red-500">{formErrors.email}</p>
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          id="password"
          placeholder="john1234"
          value={user.password}
          onChange={(e) => {
            setUser({ ...user, password: e.target.value });
          }}
        />
        <p className="text-red-500">{formErrors.password}</p>
        <p className="text-red-500">{error}</p>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default Login;
