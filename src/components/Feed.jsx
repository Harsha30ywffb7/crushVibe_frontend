import { useSelector, useDispatch } from "react-redux";
import API_URL from "../utils/constants";
import axios from "axios";
import { addFeed } from "../utils/addFeed";
import { useEffect } from "react";
import UserCard from "./UserCard";


const Feed = () => {
  const feed = useSelector(state => state.feed);
  const dispatcher = useDispatch();

  const fetchData = async () => {
    console.log(feed);
    if (feed?.length === 0) {
      return <h1 className="text-center my-10">No New Users Found</h1>
    }
    if (feed !== null){
    try {
      const res = await axios.get(API_URL + "user/feed", {
        withCredentials: true
      });
      console.log(res.data.data);
      dispatcher(addFeed(res?.data?.data))
    } catch (error) {
      console.log(error)
    }
    } else {
      console.log(" noo feed")
    }
  }

  useEffect(() => {
    fetchData()
  }, []);
   
  return (
    feed && (<div className="flex justify-center py-4">
      <UserCard user={feed[0]}/>
    </div>)
  )
}

export default Feed