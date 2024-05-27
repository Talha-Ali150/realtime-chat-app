import React, { useEffect, useState } from "react";
import { UserState } from "../context/UserContext";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const [fullName, setFullName] = useState("");
  const [usersList, setUsersList] = useState([]);
  useEffect(() => {
    getUserFromDB();
    getAllUsersFromDB();
  }, []);
  const getUserFromDB = async () => {
    try {
      const docRef = doc(db, "users", user.userID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setFullName(docSnap.data().fullname);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { state } = UserState();
  const { user } = state;

  const getAllUsersFromDB = () => {
    onSnapshot(collection(db, "users"), (querySnapshot) => {
      const users = [];

      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      //   console.log(users.filter((c) => c.id !== user.userID));
      setUsersList(users.filter((c) => c.id !== user.userID));
    });
  };

  return (
    <div>
      <h1>WELCOME {fullName} </h1>
      <button onClick={getAllUsersFromDB}>get users</button>
      {usersList && (
        <ul>
          {usersList.map((item) => {
            return <li key={item.id}>{item.fullname}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

export default Home;
