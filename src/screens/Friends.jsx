import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { UserState } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaRegMessage } from "react-icons/fa6";
import { IoIosPersonAdd } from "react-icons/io";

const Friends = () => {
  const navigate = useNavigate();
  const { state, setname } = UserState();
  const { user } = state;
  const userID = user.userID;

  const [fullName, setFullName] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

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
        [userID]: {
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

  const fetchFriends = async () => {
    try {
      onSnapshot(collection(db, "users"), (querySnapshot) => {
        const users = [];

        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });

        const user = users.find((c) => c.id === userID);
        if (user && user.friends) {
          const fList = user.friends.map((friendID) => {
            const friend = users.find((u) => u.id === friendID);
            return friend
              ? { id: friendID, name: friend.fullname }
              : { id: friendID, name: friendID };
          });
          console.log("this is friends list", fList);
          setFriendsList(fList);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllUsers = () => {
    try {
      onSnapshot(collection(db, "users"), (querySnapshot) => {
        const users = [];

        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setUsersList(users.filter((c) => c.id !== userID));
        setFullName(users.filter((c) => c.id === userID)[0].fullname);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const filterFriendsFromUsers = (usersArray, friendsArray) => {
    const friendIDs = friendsArray.map((friend) => friend.id);
    return usersArray.filter((user) => !friendIDs.includes(user.id));
  };

  useEffect(() => {
    fetchFriends();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (usersList.length > 0) {
      const filtered = filterFriendsFromUsers(usersList, friendsList);
      setFilteredUsers(filtered);
    }
  }, [friendsList, usersList]);

  return (
    <div className="bg-gradient-to-r from-slate-900 to-customGreen text-white">
      <div className="h-[50vh] overflow-y-scroll">
        <h1 className="text-center font-bold">Friends</h1>
        {friendsList.length > 0 && (
          <ul>
            {friendsList.map((item) => (
              <li
                key={item.id}
                className="flex items-center text-2xl font-bold p-2 justify-center"
              >
                <p>{item.name}</p>
                <FaRegMessage
                  className="mx-2 cursor-pointer"
                  onClick={() => {
                    navigate(`/chat/${item.id}`);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="h-[50vh] overflow-y-scroll">
        <h1 className="text-center font-bold">People You May Know</h1>
        {filteredUsers && (
          <ul>
            {filteredUsers.map((item) => (
              <li
                className="flex items-center text-2xl font-bold p-2 justify-center"
                key={item.id}
              >
                <p>{item.fullname}</p>
                <IoIosPersonAdd
                  className="mx-2 cursor-pointer"
                  onClick={() => {
                    checkChatroom(item.id, item.fullname);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Friends;
