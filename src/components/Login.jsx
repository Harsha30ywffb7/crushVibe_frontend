import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

import BASE_URL from "../utils/constants.js";
import API_URL from "../utils/constants.js";

// definetly required fields
//firstname , lastname, email, password

const Login = () => {
  const dispatcher = useDispatch();
  const navigate = useNavigate();
  const [isSignin, setSignin] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMsg, setErrorMsg] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async() => {
        try {
            const response = await axios.post(BASE_URL+'login',
                {
                    email: email,
                    password: password
                },
                {
                    withCredentials: true
                }
            );
          dispatcher(addUser(response?.data?.user));
          navigate("/");
        } catch (error) {
          if (error.status == 400) {
            setErrorMsg("Invalid login credentials");
          }
          console.log(error);
          navigate('/login');
        }
        
    }
  
  const handleSignup = async() => {
    try {
      const response = axios.post(API_URL + "signup", { firstName: firstName, lastName: lastName, email: email, password: password }, { withCredentials: true });

      dispatcher(addUser(response?.data?.user));
      return navigate('/profile');
    } catch (error) {
          if (error.status == 400) {
            setErrorMsg("Invalid login credentials");
          }
          console.log(error);
          navigate('/login');
        }
  }

  const toggleSignIn = () => {
    setSignin(!isSignin);
  }
  return (
    <>
      <div className="flex justify-center my-20">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
            <p className="flex justify-center font-bold text-xl">{!isSignin ?"Login" :"Sign Up"}</p>

            {isSignin && <><label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">First Name</span>
            </div>
            <input
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              placeholder=""
              className="input input-bordered w-full max-w-xs "
            />
            </label>
            
            <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Last Name</span>
            </div>
            <input
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              placeholder=""
              className="input input-bordered w-full max-w-xs "
            />
          </label></>}

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email ID</span>
            </div>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder=""
              className="input input-bordered w-full max-w-xs "
            />
            </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder=""
              className="input input-bordered w-full max-w-xs"
            />
            </label>
            
            <p>{isSignin? "Already account":"New user"}? <span className="underline text-blue-600 cursor-pointer" onClick={()=>toggleSignIn()}>{isSignin?"Login":"signup"}</span></p>

          <p className="text-red-500">{ errorMsg}</p>

          <div className="card-actions justify-center my-2">
              <button className="btn btn-primary py-1" onClick={!isSignin?handleLogin:handleSignup}>{!isSignin? "Login" :"Sign Up"}</button>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default Login;
