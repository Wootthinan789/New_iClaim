import React, { useEffect } from 'react';
import swal from 'sweetalert';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Signin from './Components/Signin';
import Internal from './Components/Internal';
import Edithospital from './Components/Edit_hospital';
import Log from './Components/Log';
import Profile from './Components/Profile';
// import Profiletest from './Components/test_Checkbox';
// import Teststyle from './Components/Test_style';
// import DownloadFile from './Components/DowloadFile';
import SetPermissions from './Components/Set_Permissions';
import Ininet from './Components/In_inet';
import Hospital_News from './Components/Hospital_News';
import TestAPI from './Components/Test_Get_API'

const App = () =>{
  const token = localStorage.getItem("access_token");
  //const user_role = localStorage.getItem("user_role")
  const role = localStorage.getItem("role")

  if (!token){
    return <Signin/>
  }
  
  return (
    <div className='wrapper'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Profile/>} />
          <Route path="/Dashboard/External" element={<Profile/>} />
          <Route path="/Dashboard/Internal" element={<Internal/>} />
          <Route path='/TEST/API' element={<TestAPI/>} />
          <Route 
          path="/Set/Permission" 
          element={
            (role === "admin" || role === "Admin" || role === "SuperAdmin" || role === "superadmin") ? (
              <SetPermissions/>
            ) : (
              <HospitalEditNotAllowed />
            )
          } 
          />
          <Route 
            path="/Log" 
            element={
              (role === "admin" || role === "user" || role === "Admin" || role === "User" || role === "SuperAdmin" || role === "superadmin") ? (
                <Log/>
              ) : (
                <HospitalEditNotAllowed />
              )
            } 
            />
          <Route
            path="/Edit/Hospital"
            element={
              (role === "admin" || role === "Admin" || role === "SuperAdmin" || role === "superadmin") ? (
                <Edithospital/>
              ) : (
                <HospitalEditNotAllowed />
              )
            }
          />
          <Route 
            path="/Internal/inet" 
            element={
              (role === "admin" || role === "Admin" || role === "SuperAdmin" || role === "superadmin") ? (
                <Ininet/>
              ) : (
                <HospitalEditNotAllowed />
              )
            } 
            />
          <Route
          path='/Hospital/News'
          element={
            (role === "admin" || role === "Admin" || role === "SuperAdmin" || role === "superadmin") ? (
              <Hospital_News/>
            ) : (
              <HospitalEditNotAllowed/>
            )
          }
          />
          {/* <Route path="/Test/Style" element={<Teststyle/>} />
          <Route path="/Download/File" element={<DownloadFile/>} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const HospitalEditNotAllowed = () => {
  useEffect(() => {
    swal({
      text: 'ไม่ได้รับอนุญาตให้เข้าถึงหน้านี้!!',
      icon: 'error',
      buttons: false,
      timer: 4000
    });
  }, []);

  return <Navigate to="/" replace state={{ from: "/Edit/Hospital" }} />; // Redirect back to home
};

export default App;
