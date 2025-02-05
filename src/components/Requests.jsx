import axios from 'axios';
import { useEffect, useState } from 'react'
import API_URL from '../utils/constants';
import { addRequest, removeRequest } from '../utils/requestSlice';
import { useDispatch } from 'react-redux';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const dispatcher = useDispatch();

  const reviewRequest = async(status, reqId) => {
    const review = await axios.post(API_URL + "request/review/" + status + "/" + reqId, {}, {
      withCredentials:true
    });
    dispatcher(removeRequest(reqId));
    console.log(review);
  }

  const fetchRequests = async () => {
    const response = await axios.get(API_URL + "user/requests/received", {
      withCredentials: true
    });
    dispatcher(addRequest(response.data.data));
    
    setRequests(response.data.data);
  }

  useEffect(() => {
    fetchRequests()
  }, []);

  if (requests?.length === 0) {
    return <h1 className='text-center my-20 text-xl font-bold'>No Requests Found</h1>
  }

  return (
    <div>
      {
        requests.map((req) => {
          const { _id, firstName, lastName, age, gender, photoUrl, about } = req;
          return (
            <div key={_id} className="card card-side bg-base-300 shadow-xl mb-4 w-1/2 mx-auto px-5">
              <figure>
                <img
                  src={photoUrl}
                  alt={firstName}
                  className="w-20 rounded-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{firstName + " " + lastName}</h2>
                {age && gender && <p>{age} {", " + gender}</p>}
                {about && <p className="line-clamp-1">{about}</p>}
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-sm" onClick={()=>reviewRequest("accepted",_id)}>Accept</button>
                  <button className="btn btn-outline btn-error btn-sm" onClick={() => { reviewRequest("rejected", _id) }}>reject</button>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Requests