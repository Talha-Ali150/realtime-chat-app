import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { UserState } from "../context/UserContext";
import { IoMdSend } from "react-icons/io";

const Chat = () => {
  const { receiverID } = useParams();
  const { state } = UserState();
  const { user } = state;
  const { userID } = user;
  const [chatRoomID, setChatRoomID] = useState("");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [receiverName, setReceiverName] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
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
        setReceiverName(room.users[receiverID].name);
        if (!room) {
          console.log("No existing chat room found.");
        } else {
          setChatRoomID(room._id);
        }
      } catch (error) {
        console.error("Error checking chat room:", error);
      }
    };

    fetchChats();
  }, [userID, receiverID]);

  useEffect(() => {
    if (chatRoomID) {
      const fetchMessages = () => {
        try {
          const q = query(
            collection(db, "chatrooms", chatRoomID, "messages"),
            orderBy("createdAt", "asc")
          );
          onSnapshot(q, (querySnapshot) => {
            const chats = [];

            querySnapshot.forEach((doc) => {
              chats.push({ id: doc.id, ...doc.data() });
            });
            console.log(chats);
            setChats(chats);
          });
        } catch (error) {
          console.log(error);
        }
      };

      fetchMessages();
    }
  }, [chatRoomID]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const sendMessageToDb = async (text, userID, chatRoomID) => {
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
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-customGreen h-screen flex flex-col justify-center">
      <p className="text-center text-white">{receiverName}</p>
      <ul
        ref={chatContainerRef}
        className="bg-orange-300 w-[80vw] h-[70vh] mx-auto p-3 rounded-md overflow-y-scroll md:h-[400px]"
      >
        {chats &&
          chats.map((item) => {
            return (
              <li
                className={`p-2 rounded-md my-2 flex flex-col ${
                  item.userID === userID
                    ? "items-start bg-white text-sky-500"
                    : "items-end bg-green-500 text-white"
                }`}
                key={item.id}
              >
                {item.text}
              </li>
            );
          })}
      </ul>
      <div className="w-[80vw] mx-auto p-3 rounded-md flex items-center">
        <input
          className="p-1 w-[75vw] rounded-md"
          placeholder="type message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <IoMdSend
          className="text-green-500 mx-3 text-2xl"
          onClick={() => {
            if (message.trim() === "") {
              return console.log("Please enter a message");
            }
            try {
              sendMessageToDb(message, userID, chatRoomID);
              setMessage("");
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
