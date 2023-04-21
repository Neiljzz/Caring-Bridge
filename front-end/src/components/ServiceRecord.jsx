import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ServiceRecord({ record, status, recordId, cancelRecord, reviewRecord, flashMessage }) {

  const handleSubmit = (event) => {
    event.preventDefault();
    let rating = event.target.rating.value;
    let comment = event.target.comment.value;
    reviewRecord(record.id, rating, comment)
  }

  const getOpText = () => {
    if(status == "0") {
      return (<td>
        phone: {record.service.caregiver.phone}<br /> 
        email: {record.service.caregiver.email}
      </td>)
    } else if (status == "1") {
      return (<td>
          <a className='btn btn-link' data-bs-toggle="modal"
            data-bs-target={`#cancelRecord-${ record.id }`}>
              Cancel
          </a>

          <div className="modal fade" id={`cancelRecord-${ record.id }`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Cancel Service Record ?</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to cancel Service Record { record.id }: <br />
                  {record.service.service_type.kind} {record.service.service_type.sub_type} {record.service.id} ?
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={()=>cancelRecord(record.id)}>Confirm Cancel</button>
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
      </td>)
    } else if (status == "5") {
      return (<td>
        <a className='btn btn-link' data-bs-toggle="modal" 
        data-bs-target={`#reviewRecord-${ record.id }`}>Review</a>

          <div className="modal fade" id={`reviewRecord-${ record.id }`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Review Your Service { record.id }</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="" onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className='row m-1'>
                      <div className='col-sm-3 col-form-label'>Rating</div>
                      <div className='col-sm-9'>
                      <select className="col form-select" name="rating">
                        <option value="5">5 - Best</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Medium</option>
                        <option value="2">2 - Bad</option>
                        <option value="1">1 - Worst</option>
                      </select>
                      </div>
                    </div>
                    <div className='row m-1'>
                      <div className='col-sm-3 col-form-label'>comment</div>
                      <div className='col-sm-9'>
                        <textarea name="comment" className="form-control" placeholder='Enter Comment' rows="3"></textarea>
                      </div>
                    </div>
                  </div>
                    <div className="modal-footer">
                    <input type="submit" value="Submit Review" className='btn btn-success' data-bs-dismiss="modal" />
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
      </td>)
    } else if (status == "6") {
      return (<td>
        <div> 
          {[...Array(record.rating)].map((e, i) => (<i className="bi bi-star-fill text-danger" key={i}></i>) )}
        </div>
        {record.comment}
      </td>)
    }
  }

  return (
    <tr className={`${status ==0 && record.id == recordId? "table-danger fw-bold": ""}`}>
      <th scope="row">{record.id}</th>
      <td>{record.service.service_type.kind} 
        <br />{record.service.service_type.sub_type} 
        -{record.service.id}</td>
      <td>
        {record.service.caregiver.first_name} <br /> 
        {record.service.caregiver.last_name}
      </td>
      <td>{record.service.duration} min</td>
      
      {
        status == "5" || status == "6" ?  
          (<td>Actual: ${record.price} <br /> 
            <span className='text-muted'>Inital: ${record.service.price} </span></td>)
          : (<td>${record.service.price}</td>)
      }
      
      <td>
        {
          status == "5" || status == "6" ? record.service_remark : record.service.remarks
        }
      </td>
      {
        status == "5" || status == "6" ? (<td>
          {record.service_time[0]}
          <br />{record.service_time[1]}
        </td>) : (<td>
          {record.date_created[0]}
          <br />{record.date_created[1]}
        </td>)
      }
      
      { getOpText() }
    </tr>
  )
}