import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';

import AlertMessage from './components/AlertMessage';


function App() {

  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') || false);
  const [message, setMessage] = useState(null);
  const [category, setCategory] = useState(null);

  function flashMessage(message, category){
      setMessage(message);
      setCategory(category);
  };

  return (
      <div className="App">
        {message ? <AlertMessage message={message} category={category} 
          flashMessage={flashMessage} /> : null}
        <Routes>
            <Route path='/*' element={<Home loggedIn={loggedIn} setLoggedIn={setLoggedIn} flashMessage={flashMessage} />} /> 
            <Route path='/login' element={<Login flashMessage={flashMessage} setLoggedIn={setLoggedIn} />} />
            <Route path='/register' element={<Register flashMessage={flashMessage} />} />
        </Routes>
      </div>
  );
}

export default App;
