import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register({ flashMessage }) {

  const navigate = useNavigate();

  const handleRegister = event => {
    event.preventDefault();
    let password = event.target.password.value;
    let confirmPass = event.target.confirmPass.value;
    if (password !== confirmPass){
        flashMessage('Passwords do not match', 'warning');
    } else{
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        let formData = JSON.stringify({
            first_name: event.target.firstName.value,
            last_name: event.target.lastName.value,
            email: event.target.email.value,
            phone: event.target.phone.value,
            birthday: event.target.birthday.value,
            address: event.target.address.value,
            password
        })

        fetch('http://localhost:5000/elder/sign_up', {
            method: 'POST',
            headers: myHeaders,
            body: formData
        })
          .then(res => res.json())
          .then(data => {
              if (data.error){
                  flashMessage(data.error, 'danger');
              } else {
                  flashMessage(`User ${data.email} has been created`, 'success');
                  navigate('/login');
              }
          })
    }
  }

  return (
    <>
      <div className="form-login">
        <img className="mb-4" src="/images/logo.png" alt="" width="100" height="50" />
        <h3 className="text-center">Sign Up Here!</h3>
        <form action="" onSubmit={handleRegister}>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6">
                <input type="text" name="firstName" className="form-control" placeholder='Enter First Name' />
              </div>
              <div className="col-sm-6">
                <input type="text" name="lastName" className="form-control" placeholder='Enter Last Name' />
              </div>
            </div>
            <input type="email" name="email" className="form-control my-3" placeholder='Enter Email' />
            <input type="text" name="phone" className="form-control my-3" placeholder='Enter Phone' />
            <input type="date" name="birthday" className="form-control my-3" placeholder='Enter Birthday' />
            <input type="text" name="address" className="form-control my-3" placeholder='Enter Address' />
            
            <input type="password" name="password" className="form-control my-3" placeholder='Enter Password' />
            <input type="password" name="confirmPass" className="form-control my-3" placeholder='Confirm Password' />
            <input type="submit" value="Sign Up" className='btn btn-success w-100' />
          </div>
        </form>
        <Link className="btn btn-lg btn-link" to="/login">Return to login page</Link>
      </div>
    </>
  )
}
