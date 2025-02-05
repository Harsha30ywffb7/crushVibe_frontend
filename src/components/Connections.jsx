import { useState, useEffect } from "react";
import API_URL from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router";

const Connections = () => {

  const navigate = useNavigate();

  const [connections, setConnections] = useState([]);

  const getConnections = async () => {
    try {
      const res = await axios.get(API_URL + "user/connections", {
        withCredentials: true,
      });
      setConnections(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  return (
    <div>
      <p className="text-xl font-bold text-center my-10">Connections</p>
      {connections.length ===0 && <p className="text-center my-20 text-xl font-bold">No Connections found</p>}
         
      
      <div>
        {connections.map((connection) => {
          const { _id, firstName, lastName, age, photoUrl,gender,about } = connection;
          return (
            <div key={_id} className="card card-side bg-base-300 shadow-xl mb-4 w-1/2 mx-auto px-5">
              <figure>
                <img
                  src={photoUrl}
                  alt={firstName}
                  className="w-20 rounded-full"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{firstName + " " + lastName}</h2>
                {age && gender && <p>{age} {", " + gender}</p>}
                {about && <p className="line-clamp-1">{about}</p>}
                <div className="card-actions justify-end">
                  <button className="btn btn-primary" onClick={()=>navigate(`/chat/${_id}`)}>Message</button>
                  <button className="btn btn-ghost">View Profile</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
