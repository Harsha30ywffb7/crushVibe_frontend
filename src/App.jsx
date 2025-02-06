import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import Body from './components/Body';
import Chat from './components/Chat'; 
import Login from './components/Login';
import appStore from './utils/appStore';
import Feed from './components/Feed';
import Error from './components/Error'
import Profile from './components/Profile';
import Connections from './components/Connections';
import Requests from './components/Requests';

const App = () => {
   
  return (
    <div className='w-full h-full'> 
      <Provider store={appStore}>
      <BrowserRouter basename='/'>
        <Routes>
            <Route path="/" element={<Body />}>
              {/* <Route path="/" element={<Hero />} /> */}
               <Route path="/" element={<Feed />} />
               <Route path="chat/:targetUserId" element={<Chat />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests/>} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/login" element={<Login/>} /> 
            
            <Route path="/Error" element={<Error/>}/>
          
        </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
