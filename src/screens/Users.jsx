import React, { useEffect, useState } from "react";
import { UserState } from "../context/UserContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Users = () => {
  const { state } = UserState();
  const { user } = state;
  const userID = user.userID;
  const [usersList, setUsersList] = useState([]);

  const fetchAllUsers = () => {
    try {
      onSnapshot(collection(db, "users"), (querySnapshot) => {
        const users = [];

        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setUsersList(users.filter((c) => c.id !== userID));
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div>
      <h1 className="font-bold text-center">Users You May Know</h1>
      <ul>
        {usersList.map((item) => {
          return <li key={item.id}>{item.fullname}</li>;
        })}
      </ul>
    </div>
  );
};

export default Users;
