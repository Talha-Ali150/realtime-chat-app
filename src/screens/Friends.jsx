import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { UserState } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Friends = () => {
  const navigate = useNavigate();
  const { state } = UserState();
  const { user } = state;
  const userID = user.userID;

  const [friendsList, setFriendsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

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
        console.log("this is users list", usersList);
        setUsersList(users.filter((c) => c.id !== userID));
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const filterFriendsFromUsers = (usersArray, friendsArray) => {
  //   return usersArray.filter((user) => !friendsArray.includes(user.id));
  // };

  const filterFriendsFromUsers = (usersArray, friendsArray) => {
    const friendIDs = friendsArray.map(friend => friend.id);
    return usersArray.filter(user => !friendIDs.includes(user.id));
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
    <div>
      <h1 className="text-center font-bold">Friends</h1>
      {friendsList.length > 0 && (
        <ul>
          {friendsList.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                navigate(`/chat/${item.id}`);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
      <h1 className="text-center font-bold">People You May Know</h1>
      {filteredUsers && (
        <ul>
          {filteredUsers.map((item) => (
            <li key={item.id}>{item.fullname}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Friends;
