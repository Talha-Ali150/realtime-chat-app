import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { UserState } from "../context/UserContext";

const Friends = () => {
  const [friendsList, setFriendsList] = useState([]);
  const { state } = UserState();
  const { user } = state;
  const userID = user.userID;
  const fetchAllFriends = async () => {
    try {
      const q = query(
        collection(db, "chatrooms"),
        where(`users.${userID}.status`, "==", true)
      );

      const querySnapshot = await getDocs(q);

      const friends = [];
      querySnapshot.forEach((doc) => {
        friends.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log(friends);
      setFriendsList(friends);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllFriends();
  }, []);
  return (
    <div>
      <h1 className="text-center font-bold">All Friends</h1>
      {friendsList.map((item) => {
        const userKeys = Object.keys(item.users);
        console.log(item.users);
        return userKeys.map(
          (key) => key !== userID && <li key={key}>{item.users[key].name}</li>
        );
      })}
    </div>
  );
};

export default Friends;
