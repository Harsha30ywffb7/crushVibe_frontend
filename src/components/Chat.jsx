import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket.js";
import { useSelector } from "react-redux";
import axios from "axios";
import API_URL from "../utils/constants.js";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [targetUser, setTargetUser] = useState({});
  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const sentSound = new Audio("../../public/sound/MessageSent.mp3");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const photoUrl = user?.photoUrl;
  const { targetUserId } = useParams();

  console.log(targetUserId);

  const handleVideoCall = () => {
    navigate('/videoCall/' + targetUserId);
  };

  const handleAudioCall = () => {
    console.log("handle funcion for audio call")
  }

  const scrollToEnd = () => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };


  const sendMessage = () => {
    // send message to same room of users.
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: message.trim(),
      photoUrl,
    });
    sentSound.play();
    setMessage("");
  };

  const getChat = async () => {
    try {
      const response = await axios.get(API_URL + "chat/" + targetUserId, {
        withCredentials: true,
      });
      setTargetUser(response?.data.targetUser);
      const chatMessages = response.data.data[0].messages.map((chat) => {
        return {
          userId: chat.senderId._id,
          firstName: chat.senderId.firstName,
          lastName: chat.senderId.lastName,
          photoUrl: chat.senderId.photoUrl,
          text: chat.text,

          //photoUrl:
        };
      });

      setMessages(chatMessages);
      //console.log(messages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  useEffect(() => {
    getChat();
  }, []);

  useEffect(() => {
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, text, userId, photoUrl }) => {
      // received msgs
      setMessages((messages) => [
        ...messages,
        { firstName, text, userId, photoUrl },
      ]);
    });

    socket.on("userStatusUpdate", ({ userId, isOnline, lastSeen }) => {
      setMessages((prev) =>
        prev.map((p) =>
          p.user._id === userId ? { ...p, isOnline, lastSeen } : p
        )
      );
    });
    console.log("messages", messages);
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  if (!userId) {
    return;
  }

  return (
    <div className="w-8/12 mx-auto border border-gray-600 m-5 h-[80vh] flex flex-col">
      <div className="bg-base-300 h-12 px-5 align-middle py-1 flex border-gray-600 border-b justify-between ">
        <div className="flex items-center">
          <img
            src={targetUser.photoUrl}
            alt=""
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="ml-3">
              {targetUser.firstName + " " + targetUser.lastName}
            </p>
            <p className="text-xs ml-3">{"online"}</p>
          </div>
        </div>


        <div className="flex p-1">
                  <div
          className="mr-6 cursor-pointer hover:opacity-75 hover:bg-gray-700 rounded-full h-8 w-8 items-center align-middle p-[6px] flex justify-center"
          onClick={() => handleAudioCall()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
            />
          </svg>
        </div>

        <div
          className="mr-6 cursor-pointer hover:opacity-75 hover:bg-gray-700 rounded-full h-8 w-8 items-center align-middle p-1 flex justify-center"
          onClick={() => handleVideoCall()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
</div>
      </div>

      <div
        ref={messagesEndRef}
        className="flex-1 overflow-scroll p-5 bg-base-300"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.userId === userId ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img alt="User Avatar" src={msg.photoUrl} />
              </div>
            </div>
            <div className="chat-header">
              {msg.firstName}
              <time className="text-xs opacity-50">
                {new Date().getHours()}:{new Date().getMinutes()}
              </time>
            </div>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between space-between border-t border-gray-400 bg-base-100 py-3 px-5">
        <input
          onKeyDown={handleKeyPress}
          placeholder="Enter your message"
          className="h-10 rounded-lg w-10/12 bg-base-300 p-2 border border-base-700"
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button
          className="bg-blue-800 py-1 px-3  rounded-lg"
          onClick={() => sendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;
