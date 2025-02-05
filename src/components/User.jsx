import React from 'react'
import { useNavigate } from 'react-router'

const User = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="card w-92 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">John Doe</h2>
          <p>Click the button to start chatting with John Doe.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary h-2 " onClick={() => navigate('/chat')}>Chat</button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export default User

/*

*/