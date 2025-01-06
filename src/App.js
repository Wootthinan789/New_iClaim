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
import HospitalNews from './Components/Hospital_News';
import TestAPI from './Components/Test_Get_API'
import InternalV2 from './Components/Internal_V2'
import ReportTeamiClaim from './Components/Report_Team_Iclaim'
import External3 from './Components/External3';

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
          <Route path="/Dashboard/External3" element={<External3/>} />
          <Route path="/Internal/inet" element={<Ininet/>} />
          <Route path="/Internal/v2" element={<InternalV2/>} />
          <Route path="/Report/Team/iClaim" element={<ReportTeamiClaim/>} />
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
          path='/Hospital/News'
          element={
            (role === "admin" || role === "Admin" || role === "SuperAdmin" || role === "superadmin") ? (
              <HospitalNews/>
            ) : (
              <HospitalEditNotAllowed/>
            )
          }
          />
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

  return <Navigate to="/" replace state={{ from: "/Edit/Hospital" }} />;
};

export default App;
