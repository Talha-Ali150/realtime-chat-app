import React, { useEffect } from "react";
import { UserState } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";

const Home = () => {
  const { state, setname, logout } = UserState();
  const { user } = state;
  const { fullName } = state.user;
  const { userID } = state.user;
  console.log(userID);

  const logoutUser = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      logout();
      navigate('/login')
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  };

  const getCurrentUser = async () => {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    try {
      if (docSnap.exists()) {
        setname(docSnap.data().fullname);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center font-extrabold text-3xl my-3">
        Welcome {fullName}
      </h1>

      <button
        className="text-white bg-green-500 p-2 rounded-md cursor-pointer"
        onClick={() => {
          navigate("/friends");
        }}
      >
        Browse Users
      </button>

      {user && (
        <button
          className="text-white bg-green-500 p-2 rounded-md cursor-pointer my-3"
          onClick={() => {
            logoutUser();
          }}
        >
          Log Out
        </button>
      )}
    </div>
  );
};

export default Home;
