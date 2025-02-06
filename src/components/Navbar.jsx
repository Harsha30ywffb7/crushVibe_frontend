import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import API_URL from "../utils/constants.js";
import axios from "axios";
import { useLocation } from "react-router";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  let user = useSelector((state) => state.user);

  const handleLogout = async () => {
    dispatcher(removeUser());
    await axios.post(
      API_URL + "logout",
      {},
      {
        withCredentials: true,
      }
    );
    //console.log(res);
    navigate('/login');
  };
  console.log("for pathname",location.pathname)

  return (
    <div>
      <div className="navbar bg-base-100 px-10 bg-transparent flex justify-between items-center">
        <div className="">
          <Link to ="/" className="btn btn-ghost text-xl">
            CrushVibe
          </Link>
        </div>

        <div>
          <ul className=" flex justify-center gap-20">
            <Link
      to="/connections"
      className={` ${
        location.pathname === "/connections" ? " text-[#a28bf0] font-bold" : "text-white"
      }`}
    >
      Connections
    </Link>
            <Link to="/requests" className={` ${
        location.pathname === "/requests" ? " text-[#a28bf0] font-bold" : "text-white"
      }`}>Requests</Link>
            <Link to="/" className={` ${
        location.pathname === "/contact" ? " text-[#a28bf0] font-bold" : "text-white"
      }`}>Contact</Link>
          </ul>
        </div>

        <div className="flex items-center align-middle">
          {user && (
            <div className="flex gap-2 items-center">
              <div className="mr-2">
                <p>Welcome, {user?.firstName}</p>
              </div>
              <div
                role="button"
                className="btn btn-ghost btn-circle avatar"
                onClick={()=>navigate("/profile")}
              >
                <div className="w-10 rounded-full">
                  <img alt="user Profile" src={user?.photoUrl} />
                </div>
              </div>
              <div>
                <button
                  className="btn btn-primary h-3"
                  onClick={() => handleLogout()}
                >
                  logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
