import './App.css';
import React from 'react';
import Signin from './Components/Signin';
import Home from './Components/Home'
import Profile from './Components/Profile';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const App = () =>{
 /* const token = localStorage.getItem("accessToken");

  if (!token){
    return <Signin/>
  }*/

  return (
      <div className='wrapper'>
        <BrowserRouter>
        <Routes>
        <Route path="/profile" 
            element={<Profile />} 
        />
        <Route path="/" 
            element={<Signin />} 
        />
        </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
