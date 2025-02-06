import axios from "axios";
import  { useState } from "react";
import API_URL from "../utils/constants";
import { removeFeed } from "../utils/addFeed";
import { useDispatch } from 'react-redux';


// *need to add distance and verified
const UserCard = ({ user }) => {
  const [hovered, setHovered] = useState(false);
  const dispatcher = useDispatch();
  if (user === undefined) {
    return <h1 className="text-center my-10">No New Users Found</h1>
  }
  const { _id, about, lastName, photoUrl, age, gender, firstName, distance, verified } = user;
  
    // Preload audio files for fast playback
  const likeSound = new Audio('../../public/sound/Tick.wav'); // Tick sound for like
  const rejectSound = new Audio("../../public/sound/ignore.wav"); // Vibrate/reject sound for ignore

  const handleSendRequest = async (status, reqId) => {

    await axios.post(API_URL + "request/send/" + status + "/" + reqId, {}, { withCredentials: true });
    dispatcher(removeFeed(reqId));
    
    if (status === 'interested') {
      likeSound.play();
    } else {
      rejectSound.play();
    }
    
  };


  return (
    <div className="flex justify-center items-center mt-8">
      {/* Card Container */}
      <div
        className="relative w-80 h-[450px] rounded-xl shadow-2xl overflow-hidden transform transition-transform hover:scale-102"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* User Image */}
        <img
          src={photoUrl}
          alt="user photo"
          className="w-full h-full object-cover absolute inset-0"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

        {/* Verified Badge & Distance */}
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full flex items-center shadow-md">
          { <span className="text-blue-500 font-bold mr-2">✔</span>}
          <p className="text-gray-700 text-sm">{200} miles away</p>
        </div>

        {/* Swipe Indicators */}
        <div className="absolute left-2 top-1/2 text-white opacity-30 text-2xl font-bold rotate-[-30deg]">
          👈 Nope
        </div>
        <div className="absolute right-2 top-1/2 text-white opacity-30 text-2xl font-bold rotate-[30deg]">
          Like 👉
        </div>

        {/* User Details Overlay with Glassmorphism */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-white/20 backdrop-blur-md rounded-t-xl">
          <h2 className="text-2xl font-bold">{firstName} {lastName}</h2>
          {age && gender && <p className="text-base mt-1">{age} • {gender}</p>}
          <p className="text-sm mt-2 line-clamp-2">{about}</p>
        </div>

        {/* Action Buttons - Only Visible on Hover */}
        {hovered && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-6 transition-opacity duration-300">
            <button className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition" onClick={()=>handleSendRequest("ignored",_id)}>
              ❌
            </button>
            <button className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition" onClick={()=>handleSendRequest("interested",_id)}>
              ❤️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
