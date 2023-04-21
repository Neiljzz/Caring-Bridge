import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserInfo({ loggedIn, user, setActiveLink, flashMessage }) {
  const navigate = useNavigate();

  useEffect(()=>{
    if (!loggedIn){
      flashMessage('You must be logged in to view user', 'danger');
      navigate('/login');
    }

    setActiveLink("user");
  }, [user])

  return (
    <>
      <h3 className="text-start p-1">User Info</h3>
      <hr/>
      
      {user ? (
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0"> Full Name</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0"> { user.first_name } { user.last_name }</p>
                </div>
              </div>
              <hr />
              
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Email</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0"> { user.email } </p>
                </div>
              </div>
              <hr />

              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Phone</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0"> { user.phone } </p>
                </div>
              </div>
              <hr />

              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0"> Birthday </p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0"> { user.birthday } </p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Address</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0"> { user.address } </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ): (<></>)}
    </>
  )
}