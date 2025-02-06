
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './Navbar'
import Footer from './Footer'
import BASE_URL from '../utils/constants.js'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice.js';
import { useSelector } from 'react-redux';


const Body = () => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const getUserDetails = async () => {
    if (user) return;
    try {
      // if token is there no need for login.
      const response = await axios.get(BASE_URL + "profile/view", {
      withCredentials:true
    });
    dispatch(addUser(response.data.user));
    } catch (error) {
      navigate('/login');
      console.log(error);
    }
  }

  useEffect(() => {
    getUserDetails( )
  }, []);
  return (
      
      <div className='flex flex-col '>
         <Navbar />
          <div className='flex-1 min-h-[90vh]'><Outlet /></div>
        <Footer />
        </div>
  )
}

export default Body