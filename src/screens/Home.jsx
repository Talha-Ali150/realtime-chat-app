import React, { useEffect, useState } from "react";
import { UserState } from "../context/UserContext";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const [fullName, setFullName] = useState("");
  const [usersList, setUsersList] = useState([]);
  const { state } = UserState();
  const { user } = state;

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

  const getAllUsersFromDB = () => {
    onSnapshot(collection(db, "users"), (querySnapshot) => {
      const users = [];

      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      setUsersList(users.filter((c) => c.id !== user.userID));
    });
  };

  const checkChatroom = async (receiverID, receiverName) => {
    console.log("Checking chat room...");

    try {
      const q = query(
        collection(db, "chatrooms"),
        where(`users.${user.userID}.status`, "==", true),
        where(`users.${receiverID}.status`, "==", true)
      );

      const querySnapshot = await getDocs(q);

      let room = null;
      querySnapshot.forEach((doc) => {
        room = { _id: doc.id, ...doc.data() };
      });

      if (!room) {
        console.log("No existing chat room found. Creating a new one...");
        const newChat = await createChatroom(receiverID, receiverName);
        return newChat;
      }

      console.log("Chat room found:", room);
      return room;
    } catch (error) {
      console.error("Error checking chat room:", error);
      throw new Error("Failed to check chat room");
    }
  };

  const createChatroom = async (receiverID, receiverName) => {
    const obj = {
      users: {
        [user.userID]: {
          status: true,
          name: fullName,
        },
        [receiverID]: {
          status: true,
          name: receiverName,
        },
      },
      createdAt: Date.now(),
    };

    try {
      const docRef = await addDoc(collection(db, "chatrooms"), obj);
      const newChatRoom = { _id: docRef.id, ...obj };
      console.log("New chat room created:", newChatRoom);

      await updateFriendsList(user.userID, receiverID);
      await updateFriendsList(receiverID, user.userID);

      return newChatRoom;
    } catch (error) {
      console.error("Error creating chat room:", error);
      throw new Error("Failed to create chat room");
    }
  };

  const updateFriendsList = async (userID, friendID) => {
    try {
      const userRef = doc(db, "users", userID);
      await updateDoc(userRef, {
        friends: arrayUnion(friendID),
      });
      console.log(`Added ${friendID} to ${userID}'s friends list`);
    } catch (error) {
      console.error("Error updating friends list:", error);
      throw new Error("Failed to update friends list");
    }
  };

  return (
    <div>
      <h1>
        WELCOME {fullName} <span className="text-sky-500">{user.userID}</span>
      </h1>
      <button onClick={getAllUsersFromDB}>get users</button>
      {usersList && (
        <ul>
          {usersList.map((item) => {
            return (
              <li key={item.id}>
                {item.fullname}
                <span className="text-sky-500"> {item.id} </span>
                <button
                  className="text-yellow-500"
                  onClick={() => {
                    checkChatroom(item.id, item.fullname);
                  }}
                >
                  check chat room
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Home;
