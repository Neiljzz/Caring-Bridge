import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/card.css';

export default function ServiceItem({ user, service, flashMessage }) {
  const navigate = useNavigate();

  const AddServiceRecord = () => {
    let token = localStorage.getItem('token');
    if(token){
      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);
      fetch(`http://localhost:5000/elder/buy_service/${service.id}`, {
          method: 'GET',
          headers: myHeaders,
        })
        .then(res => res.json())
        .then(data=>{
          navigate('/servicerecords', { state: { id: data.id }});
          flashMessage("You can talk to him by contact info", "success")
        })
    }
  }

  return (
    <div className="card m-3 service-item-card">
      <div className="row g-0">
        <div className="col-md-2">
          <img src={`http://localhost:5000${ service.caregiver.image }`} className="card-img img-fluid rounded-start" alt="..."/>
        </div>
        <div className="col-md-8">
          <div className="card-body text-start">
            <h5 className="card-title">{ service.caregiver.first_name } { service.caregiver.last_name }</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              { service.caregiver.age } Years Old. Live in { service.caregiver.address }</h6>

              <div className="card-title row fs-5">
                <div className='col'>
                  Service ID: { service.id }
                </div>
                <div className='col'>
                  { service.duration }minutes
                </div>
                <div className='col'>
                  ${ service.price }
                </div>
              </div>
              <h6 className="card-subtitle mb-2 text-muted">
                service remarks: { service.remarks }</h6>
            <p className="card-text">
              { service.caregiver.intro }
            </p>
          </div>
          {user ? (<>
            <div className="text-start mx-3">
              <a className="card-link btn btn-custom-1" onClick={AddServiceRecord}>
              Talk To {service.caregiver.first_name } { service.caregiver.last_name }</a>
            </div>
          </>) : (<></>)}
        </div>
      </div>
    </div>
  )
}