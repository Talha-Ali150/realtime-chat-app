import React from "react";
import ReactDOM from "react-dom/client";
import UserContext from "../src/context/UserContext";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./screens/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Users from "./screens/Users";
import Friends from "./screens/Friends";
import Chat from "./screens/Chat";

const root = ReactDOM.createRoot(document.getElementById("root"));
const user = JSON.parse(localStorage.getItem("user"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* <Route path="/" element={<Layout />}> */}
      {/* if(user){<Route path="/" element={<Home />}></Route>}
      else{<Route path="/login" element={<Login />}></Route>} */}
      {user ? (
        <>
          <Route path="/" element={<Home />} />
        </>
      ) : (
        <Route path="/" element={<Navigate to="/login" />} />
      )}
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Signup />}></Route>
      <Route path="/users" element={<Users />}></Route>
      <Route path="/friends" element={<Friends />}></Route>
      <Route path="/chat/:receiverID" element={<Chat />}></Route>
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
