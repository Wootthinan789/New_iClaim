import './App.css';
import React from 'react';
import Signin from './Components/Signin';
import Internal from './Components/Internal';
import Edithospital from './Components/Edit_hospital';
import Home from './Components/Home'
import Log from './Components/Log'
import Profile from './Components/Profile';
import TestGetAPI from './Components/Test_Get_API';
import TestLog from './Components/Test_Log'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Profiletest from './Components/test_Checkbox'
import Teststyle from './Components/Test_style';

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
          element={<TestGetAPI/>}
        />
        <Route path="/Test_Checkbox"
          element={<Profiletest/>}
        />
        <Route path="/Log" 
            element={<Log/>} 
        />
        <Route path="/Home" 
            element={<Home/>} 
        />
        <Route path="/Edit/Hospital" 
            element={<Edithospital/>} 
        />
        <Route path="/Test_Log" 
            element={<TestLog/>} 
        />
        <Route path="/Test/Style" 
            element={<Teststyle/>} 
        />
        </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
