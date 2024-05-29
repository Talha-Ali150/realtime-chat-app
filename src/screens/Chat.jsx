import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { UserState } from "../context/UserContext";

const Chat = () => {
  const { receiverID } = useParams();
  const { state } = UserState();
  const { user } = state;
  const { userID } = user;
  const [chatRoomID, setChatRoomID] = useState("");
  console.log("this is receiver id", receiverID);
  console.log("this is user id", userID);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const q = query(
        collection(db, "chatrooms"),
        where(`users.${userID}.status`, "==", true),
        where(`users.${receiverID}.status`, "==", true)
      );

      const querySnapshot = await getDocs(q);

      let room = null;
      querySnapshot.forEach((doc) => {
        room = { _id: doc.id, ...doc.data() };
      });

      if (!room) {
        console.log("No existing chat room found.");
      }

      console.log("Chat room found:", room);
      console.log("Chat room id:", room._id);
      setChatRoomID(room._id);

      return room;
    } catch (error) {
      console.error("Error checking chat room:", error);
    }
  };

  async function sendMessageToDb(text, userID, chatRoomID) {
    console.log("message sending");
    try {
      const message = { text, createdAt: Date.now(), userID: userID };
      await addDoc(
        collection(db, "chatrooms", chatRoomID, "messages"),
        message
      );
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <div>
      <h1>Chat</h1>
      <button
        onClick={() => {
          sendMessageToDb("hello", userID, chatRoomID);
        }}
      >
        send message
      </button>
    </div>
  );
};

export default Chat;
