import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ServiceRecord from '../components/ServiceRecord';


export default function ServiceRecords({loggedIn, user, setActiveLink, flashMessage}) {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("0");
  const navigate = useNavigate();

  useEffect(()=>{
    if (!loggedIn){
      flashMessage('You must be logged in to view service records', 'danger');
      navigate('/login');
    }
    setActiveLink("servicerecords");
  }, [user])

  const {state} = useLocation();
  const recordId = state ? state.id : -1;

  useEffect(() => {
    let token = localStorage.getItem('token');
    if(token){
      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);
      fetch(`http://localhost:5000/elder/service_records?status=${status}`, {
          method: 'GET',
          headers: myHeaders,
        })
        .then(res => res.json())
        .then(data=>{
          setRecords(data)
        })
    }

  }, [recordId, status]);

  const cancelRecord = (cancelRecordId) => {
    let token = localStorage.getItem('token');
    if(token && status == "1"){
      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);

      fetch(`http://localhost:5000/elder/service_record/${cancelRecordId}`, {
          method: 'DELETE',
          headers: myHeaders,
      }).then(res => res.json())
      .then(data => {
        if (data.success){
          console.log("Cancel Record OK.")
          flashMessage(`Success Cancel Record ${cancelRecordId}.`, 'success');
          setRecords(records.filter(record => record.id != cancelRecordId))
        }else{
          flashMessage(`Fail to reason: ${data.error}.`, 'danger');
        }
      })
    }
  }

  const reviewRecord = (reviewRecordId, rating, comment) => {
    let formData = JSON.stringify({rating, comment })
    let token = localStorage.getItem('token');
    if(token){
      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);
      fetch(`http://localhost:5000/elder/service_record/${reviewRecordId}`, {
        method: 'PUT',
        headers: myHeaders,
        body: formData,
      }).then(res => res.json())
        .then(data => {
          if (data.error){
            flashMessage(data.error, 'danger');
          } else {
            flashMessage(`Review record ${reviewRecordId} success`, 'success');
            setRecords(records.filter(record => record.id != reviewRecordId))
          }
        })
    }
  }

  // get text for html
  const getOpText = () => {
    if(status == "0") {
      return (<th scope="col">
        Contact
      </th>)
    } else if(status == "1" || status == "5")  {
      return (<th scope="col">
        Operation
      </th>)
    } else if(status == "6")  {
      return (<th scope="col">
        Your Review
      </th>)
    }
  }

  return (
    <>
      <h3 className="text-start p-1">Service Records
        <form className='float-end row'>
          <label className='col-md-auto col-form-label fs-5' htmlFor='recordStatus'>Record Status</label>
          <select className="col form-select mx-1" id="recordStatus"
            value={status} onChange={e => setStatus(e.target.value)}
          >
            <option value="0">0 - Wait Care</option>
            <option value="1">1 - Care Accept</option>
            <option value="2">2 - Care Refuse</option>
            <option value="3">3 - Cancel By Me</option>
            <option value="4">4 - Cancel By Care</option>
            <option value="5">5 - Finished</option>
            <option value="6">6 - Reviewed</option>
          </select>
        </form>
      
      </h3>
      <hr/>
      <div className="record-list">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">Record ID</th>
              <th scope="col">Service</th>
              <th scope="col">CareGiver</th>
              <th scope="col">Duration</th>
              <th scope="col">
                {
                  status == "5" || status == "6" ?  "Price" : "Inital Price"
                }
              </th>
              <th scope="col">
                {
                  status == "5" || status == "6" ? "Record Remarks" : "Service Remarks"
                }
              </th>
              <th scope="col">
                {
                  status == "5" || status == "6" ? "Finish Date" : "Created Date"
                }
              </th>
              { getOpText() }
            </tr>
          </thead>
          <tbody>
            {records.map( 
              record => <ServiceRecord key={record.id} record={record} cancelRecord={cancelRecord}
                status={status} recordId={recordId} flashMessage={flashMessage} reviewRecord={reviewRecord} />
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}