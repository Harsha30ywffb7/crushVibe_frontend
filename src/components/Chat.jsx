
import { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket.js';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_URL from "../utils/constants.js";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([])
  const [targetName, setTargetName] = useState("");
  const [targetPhoto, setTargetPhoto] = useState("");
  const user = useSelector(state => state.user);
  const userId = user?._id;
  const sentSound = new Audio('../../public/sound/MessageSent.mp3');
  const messagesEndRef = useRef(null);

  const scrollToEnd = () => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }
  
  const photoUrl = user?.photoUrl;
  const { targetUserId } = useParams();

  const sendMessage = () => {
    // send message to same room of users.
    const socket = createSocketConnection();
    socket.emit("sendMessage", { firstName: user.firstName, userId, targetUserId, text: message.trim(), photoUrl });
    sentSound.play();
    setMessage("");
  }

  const getChat = async() => {
    try {
      const response = await axios.get(API_URL + "chat/" + targetUserId, { withCredentials: true });
      console.log(response.data.data[0].messages);
      const chatMessages = response.data.data[0].messages.map((chat) => {
        if (chat.senderId._id !== userId) {
          setTargetName(chat.senderId.firstName + " " + chat.senderId.lastName);
          setTargetPhoto(chat.senderId.photoUrl);
        }
        console.log(targetName, targetPhoto);
        return {
          userId:chat.senderId._id,
          firstName: chat.senderId.firstName,
        lastName: chat.senderId.lastName,
      photoUrl:chat.senderId.photoUrl,
        text: chat.text,

        //photoUrl:
      }
      })
      setMessages(chatMessages);
      //console.log(messages);
    } catch (error) {
      console.log(error);
    }

  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
     // event.preventDefault();
      sendMessage();
    }
  }

  useEffect(() => {
    scrollToEnd();
  },[messages])

  useEffect(() => {
    getChat()
  }, []);

  useEffect(() => {
    const socket = createSocketConnection();
    socket.emit("joinChat", { firstName: user?.firstName, userId, targetUserId });
    
    socket.on("messageReceived", ({ firstName, text, userId, photoUrl }) => {
      // received msgs

      setMessages((messages) => [...messages, { firstName, text, userId, photoUrl }]);
    })    
    return() => {
      socket.disconnect();
    }
  },[userId, targetUserId])
  
   if (!userId) {
    return;
  }
    
  return (
    <div className="w-8/12 mx-auto border border-gray-600 m-5 h-[80vh] flex flex-col">
      
        <div className="bg-base-300 h-12 px-5 align-middle py-1 flex border-gray-600 border-b">
        <img src={targetPhoto} alt="" className="h-10 w-10 rounded-full" />
        <div>
          <p className="ml-3">{targetName}</p>
        <p className="text-xs ml-3">{ "online"}</p>
        </div>
      </div>
      <div ref={messagesEndRef} className="flex-1 overflow-scroll p-5 bg-base-300">
        {messages.map((msg, index) => (
        <div key={index} className={`chat ${msg.userId === userId ? "chat-end" : "chat-start"}`}>
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src={msg.photoUrl}
              />
            </div>
          </div>
          <div className="chat-header">
            {msg.firstName}
            <time className="text-xs opacity-50">{new Date().getHours()}:{new Date().getMinutes()}</time>
          </div>
          <div className="chat-bubble">{msg.text}</div>
        </div>
      ))}
      </div>
      
      <div className="flex justify-between space-between border-t border-gray-400 bg-base-100 py-3 px-5"> 
          <input onKeyDown={handleKeyPress}  placeholder="Enter your message" className="h-10 rounded-lg w-10/12 bg-base-300 p-2 border border-base-700" type="text" onChange={(e) => setMessage(e.target.value)} value={message} />
          <button className="bg-blue-800 py-1 px-3  rounded-lg" onClick={()=> sendMessage()}>Send</button>
      </div>
    </div>
  );
};
export default Chat;


