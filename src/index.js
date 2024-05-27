import React from "react";
import ReactDOM from "react-dom/client";
import UserContext from "../src/context/UserContext";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./screens/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* <Route path="/" element={<Layout />}> */}
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Signup />}></Route>
    </Route>
  )
);
root.render(
  <React.StrictMode>
    <UserContext>
      <RouterProvider router={router} />
    </UserContext>
  </React.StrictMode>
);
