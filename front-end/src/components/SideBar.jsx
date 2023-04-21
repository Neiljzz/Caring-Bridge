import React from 'react';
import { Link } from 'react-router-dom';

export default function SideBar({ user, loggedIn, logUserOut, activeLink, setActiveLink }) {

  return (
    <>
      <div id="sideBar" className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <img className="bi me-2" src="/images/logo.png" width="30" height="16" />
          <span className="fs-4">Caring Bridge</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link className={`nav-link text-white ${activeLink == 'home' ? 'bg-custom-1 fw-bold': ''}`} to=""
              onClick={() => setActiveLink('home')}>
              <i className="bi me-2 bi-house-door"></i>
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link className={`nav-link text-white ${activeLink == 'services' ? 'bg-custom-1 fw-bold': ''}`} to="services"
              onClick={() => setActiveLink('services')}>
              <i className="bi me-2 bi-heart"></i>
              Services
            </Link>
          </li>
          { user ? (
            <li className="nav-item">
              <Link className={`nav-link text-white ${activeLink == 'servicerecords' ? 'bg-custom-1 fw-bold': ''}`} to="servicerecords"
                onClick={() => setActiveLink('servicerecords')}>
                <i className="bi me-2 bi-grid"></i>
                Service Records
                </Link>
            </li>
          ) : (<></>)}
        </ul>

        {user ? (
          <>
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <Link className={`nav-link text-white ${activeLink == 'user' ? 'bg-custom-1 fw-bold': ''}`} to="user"
                onClick={() => setActiveLink('user')}>
                <img src="/images/care1.png" alt="" width="32" height="32" className="rounded-circle me-2" />
                <strong>
                    {user.first_name} {user.last_name }
                </strong>
              </Link>
            </li>
            <hr />
            <li className="nav-item">
              <button className="nav-link text-light"
                onClick={() => logUserOut()}>Log Out</button>
            </li>
          </ul>
          </>) : 
        (<>
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/login">Log In</Link>
            </li>
          </ul>
        </>) }

      </div>
    </>
      
  )
}
