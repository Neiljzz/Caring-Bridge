import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import RecentRecord from '../components/RecentRecord';


export default function HomeInfo({user, setActiveLink}) {
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    let token = localStorage.getItem('token');
    if(token){
      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);
      fetch(`http://localhost:5000/elder/service_records?status=0`, {
          method: 'GET',
          headers: myHeaders,
        })
        .then(res => res.json())
        .then(data=>{
          setRecentRecords(data.slice(0, 3))
        })
    }

  }, []);

  useEffect(()=>{
    setActiveLink("home");
  }, [])

  return (
    <>
      <h3 className="text-start p-1">Welcome to Care App</h3>
      <hr/>
      <p className="text-start p-2">Our website is a comprehensive platform that offers a range of caregiving services to seniors, all in one place. <br /><br />
      
      <p>Our goal is to make it easy for seniors and their families to find the care they need, whether it's in-home care, assisted living, or other types of support.</p> 

<p>On our website, seniors and their families can browse and compare different caregiving options, based on their specific needs and preferences. We offer a wide range of services, including personal care, medical care, companionship, housekeeping, and more.</p>

<p>Our platform is easy to use and accessible from anywhere, making it convenient for seniors and their families to find and book the care they need. We also provide resources and tools to help seniors and their families make informed decisions about their care, such as customer reviews, ratings, and cost comparisons.</p>

At our website, we are committed to providing high-quality, compassionate care to seniors, and we work closely with caregivers and care providers to ensure that our clients receive the best possible care. Whether you need short-term or long-term care, we are here to help you find the right caregiving solution for your unique needs.</p>
      {user ? (<>
        <hr/>
        <h5 className="text-start p-2 w-50">
          Recent Service Record
          <Link className='float-end btn btn-link' to="servicerecords">View More</Link>
        </h5>
        <div class="list-group w-50">
          {recentRecords.map(record=> <RecentRecord key={record.id} record={record} />)}
        </div>
      </>) : (<></>)}
      
    </>
  )
}