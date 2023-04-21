import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import HomeInfo from '../views/HomeInfo';
import UserInfo from '../views/UserInfo';
import Services from '../views/Services';
import ServiceRecords from '../views/ServiceRecords';

import SideBar from '../components/SideBar';

import '../style/home.css';
import '../style/custom.css';


export default function Home({loggedIn, setLoggedIn, flashMessage}) {

  const [user, setUser] = useState();
  const [activeLink, setActiveLink] = useState();

  useEffect(() => {
      if (!loggedIn){
        setUser(null)
      }else{
        let token = localStorage.getItem('token');
        if(token){
          let myHeaders = new Headers();
          myHeaders.append('Content-Type', 'application/json');
          myHeaders.append('Authorization', `Bearer ${token}`);

          fetch('http://localhost:5000/elder/me', {
              method: 'GET',
              headers: myHeaders,
          }).then(res => res.json())
          .then(data => {
            if (data.error){
              localStorage.removeItem('token');
              setLoggedIn(false);
              flashMessage(data.error, 'danger');
            }else{
              setUser(data)
            }
          })
        }
      }
  }, [loggedIn])

  function logUserOut(){
    localStorage.removeItem('token');
    setUser(null);
    setLoggedIn(false);
    flashMessage('You have logged out', 'primary')
  };

  return (
      <div className="home">
        <SideBar user={user} loggedIn={loggedIn} logUserOut={logUserOut} 
          activeLink={activeLink} setActiveLink={setActiveLink} />
        <div className='container my-3'>
          <Routes>
              <Route path='/user' element={<UserInfo loggedIn={loggedIn} user={user} setActiveLink={setActiveLink} flashMessage={flashMessage}/>} /> 
              <Route path='/' element={<HomeInfo user={user} setActiveLink={setActiveLink} flashMessage={flashMessage}/>} /> 
              <Route path='/services' element={
                <Services user={user} setActiveLink={setActiveLink} flashMessage={flashMessage} />}/> 
              <Route path='/servicerecords' element={
                <ServiceRecords loggedIn={loggedIn} user={user} setActiveLink={setActiveLink} flashMessage={flashMessage} />} /> 
          </Routes>
        </div>
      </div>
  )
}
