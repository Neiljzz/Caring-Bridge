import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/login.css';
import '../style/custom.css';


export default function Login({ flashMessage, setLoggedIn }) {

  const navigate = useNavigate();

  async function handleLogin(event){
      event.preventDefault();

      let email = event.target.email.value;
      let password = event.target.password.value;

      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'text/plain');
      let stringToEncode = `${email}:${password}`
      myHeaders.append('Authorization', `Basic ${btoa(stringToEncode)}`);

      let formData = JSON.stringify({email, password })
      console.log(formData)

      fetch('http://localhost:5000/elder/token', {
          method: 'POST',
          headers: myHeaders,
          body: formData,
      }).then(res => res.json())
      .then(data => {
          if (data.error){
              flashMessage(data.error, 'danger');
          } else {
              // Get the token and token expiration from the response data
              console.log(data);
              let token = data.token;

              // Store the value in local storage on the browser
              localStorage.setItem('token', token);
              setLoggedIn(true);

              // flash a success message and redirect
              flashMessage('You have successully logged in', 'success');
              navigate('/');
          }
      })
  };

  return (
    <>
      <div className="form-login">
      <img className="mb-4" src="/images/logo.png" alt="" width="200" height="100" />
        <h3 className="text-center">Welcome to Caring Bridge!</h3>
        <form action="" onSubmit={handleLogin}>
          <div className="form-group">
              <input type="email" name="email" className="form-control my-3" placeholder='Enter Email' />
              <input type="password" name="password" className="form-control my-3" placeholder='Enter Password' />
              <input type="submit" value="Log In" 
                className='w-100 btn btn-lg btn-custom-1' />
          </div>
        </form>
        <Link className="btn btn-lg btn-link" to="/register">Register</Link>
        <Link className="btn btn-lg btn-link" to="/home">View as Visitor</Link>
      </div>
    </>
  )
}
