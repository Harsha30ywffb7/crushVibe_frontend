
import UserCard from "./UserCard";
import { useState } from "react";
import axios from "axios";
import API_URL from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
const EditProfile = ({ user }) => {
  const [email, setEmail] = useState(user?.email);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [about, setAbout] = useState(user?.about);
    const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
    const [age, setAge] = useState(user?.age);
    const [gender, setGender] = useState(user?.gender);
    const [errorMsg, setErrorMsg] = useState("");

    const [makeVisible, setMakeVisible] = useState(false);

    //const user = useSelector(state => state.user);
    const dispatcher = useDispatch();

    const handleSave = async () => {
        
        setErrorMsg("");
        try {
            //save changes in db
            const res = await axios.patch(API_URL + 'profile/edit', {
                firstName, lastName, about, photoUrl, age, gender
            },{withCredentials:true})
            console.log(res.data.user);
            // updates user UI 
            setMakeVisible(true);
            setTimeout(() => {
                setMakeVisible(false);
            },2000)
            dispatcher(addUser(res.data.user));

        } catch (error) {
            console.log(error);
      }
  };

    return (
      <>
            {makeVisible&&(<div className="toast toast-top toast-center">
  
  <div className="alert alert-success">
                    <span>{"Profile updated successfully"}</span>
  </div>
</div>)}
            
            <div className="flex justify-center my-20 gap-x-20">
      <div className="flex justify-center mt-10">
        <div className="card bg-base-300 w-96 shadow-xl">
          <div className="card-body">
            <p className="flex justify-center font-bolds">Edit Profile</p>
            <label className="form-control w-full max-w-xs">
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
                <span className="label-text">LastName</span>
              </div>
              <input
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                placeholder=""
                className="input input-bordered w-full max-w-xs"
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email ID</span>
              </div>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder=""
                className="input input-bordered w-full max-w-xs"
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Gender</span>
              </div>
              <input
                type="text"
                onChange={(e) => setGender(e.target.value)}
                value={gender}
                placeholder=""
                className="input input-bordered w-full max-w-xs"
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">photoUrl</span>
              </div>
              <input
                type="text"
                onChange={(e) => setPhotoUrl(e.target.value)}
                value={photoUrl}
                placeholder=""
                className="input input-bordered w-full max-w-xs"
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">age</span>
              </div>
              <input
                type="text"
                onChange={(e) => setAge(e.target.value)}
                value={age}
                placeholder=""
                className="input input-bordered w-full max-w-xs"
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">About</span>
              </div>
              <input
                type="text"
                onChange={(e) => setAbout(e.target.value)}
                value={about}
                placeholder=""
                className="input input-bordered w-full max-w-xs"
              />
                      </label>
                      
                      {errorMsg && <p className="text-red-500 ">{ errorMsg}</p>}

            <div className="card-actions justify-center my-2">
              <button className="btn btn-primary py-1" onClick={()=>handleSave()}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
          <UserCard user={{ email, firstName, lastName, about, photoUrl, age , gender}} />
    </div>
      
      </>
      
  );
};

export default EditProfile;
