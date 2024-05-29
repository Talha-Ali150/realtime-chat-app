// import {
//   addDoc,
//   collection,
//   getDocs,
//   onSnapshot,
//   query,
//   where,
// } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { db } from "../firebase";
// import { UserState } from "../context/UserContext";

// const Chat = () => {
//   const { receiverID } = useParams();
//   const { state } = UserState();
//   const { user } = state;
//   const { userID } = user;
//   const [chatRoomID, setChatRoomID] = useState("");
//   const [message, setMessage] = useState("");
//   const [chats, setChats] = useState([]);

//   useEffect(() => {
//     fetchChats();
//     fetchMessages();
//   }, []);

//   useEffect(() => {
//     fetchMessages();
//   }, [chatRoomID]);

//   const fetchChats = async () => {
//     try {
//       const q = query(
//         collection(db, "chatrooms"),
//         where(`users.${userID}.status`, "==", true),
//         where(`users.${receiverID}.status`, "==", true)
//       );

//       const querySnapshot = await getDocs(q);

//       let room = null;
//       querySnapshot.forEach((doc) => {
//         room = { _id: doc.id, ...doc.data() };
//       });

//       if (!room) {
//         console.log("No existing chat room found.");
//       }

//       setChatRoomID(room._id);

//       return room;
//     } catch (error) {
//       console.error("Error checking chat room:", error);
//     }
//   };

//   const fetchMessages = () => {
//     try {
//       onSnapshot(
//         collection(db, "chatrooms", `${chatRoomID}`, "messages"),
//         (querySnapshot) => {
//           const chats = [];

//           querySnapshot.forEach((doc) => {
//             chats.push({ id: doc.id, ...doc.data() });
//           });
//           console.log(chats);
//           setChats(chats);
//         }
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   async function sendMessageToDb(text, userID, chatRoomID) {
//     console.log("message sending");
//     try {
//       const message = { text, createdAt: Date.now(), userID: userID };
//       await addDoc(
//         collection(db, "chatrooms", chatRoomID, "messages"),
//         message
//       );
//       console.log("Message sent successfully");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   }

//   return (
//     <div>
//       <h1>Chat</h1>
//       <input
//         placeholder="type message..."
//         value={message}
//         onChange={(e) => {
//           setMessage(e.target.value);
//         }}
//       />
//       <button
//         onClick={() => {
//           if (message.trim() === "") {
//             return console.log("Please enter a message");
//           }
//           try {
//             sendMessageToDb(message, userID, chatRoomID);
//             setMessage("");
//           } catch (error) {
//             console.log(error);
//           }
//         }}
//       >
//         send message
//       </button>
//       <h1>my messages</h1>
//       <ul>
//         {chats &&
//           chats.map((item) => {
//             return <li key={item.id}>{item.text}</li>;
//           })}
//       </ul>
//     </div>
//   );
// };

// export default Chat;

import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
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
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);

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
    <div>
      <h1>Chat</h1>
      <input
        placeholder="type message..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button
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
      >
        send message
      </button>
      <h1>my messages</h1>
      <ul className="bg-orange-300 w-[80vw] mx-auto p-3 rounded-md h-[400px] overflow-y-scroll">
        {chats &&
          chats.map((item) => {
            return (
              <li
                className={`  p-2 rounded-md my-2  flex flex-col ${
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
    </div>
  );
};

export default Chat;
