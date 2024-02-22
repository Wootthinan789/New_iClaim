import './App.css';
import React from 'react';
import Signin from './Components/Signin';
import Internal from './Components/Internal';
import Home from './Components/Home'
import Log from './Components/Log'
import Profile from './Components/Profile';
import Test_Get_API from './Components/Test_Get_API';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Profile_test from './Components/test_Checkbox'

const App = () =>{
  const token = localStorage.getItem("access_token");

  if (!token){
    return <Signin/>
  }

  return (
      <div className='wrapper'>
        <BrowserRouter>
        <Routes>
        <Route path="/" 
            element={<Profile/>} 
        />
        <Route path="/Dashboard/External" 
            element={<Profile/>} 
        />
        <Route path="/Dashboard/Internal" 
            element={<Internal/>} 
        />
        <Route path="/Test_api"
          element={<Test_Get_API/>}
        />
        <Route path="/Test_Checkbox"
          element={<Profile_test/>}
        />
        <Route path="/Log" 
            element={<Log/>} 
        />
        <Route path="/Home" 
            element={<Home/>} 
        />
        </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
