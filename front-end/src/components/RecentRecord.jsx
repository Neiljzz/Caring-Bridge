import React from 'react';

export default function RecentRecord({ record }) {
  return (
  <div href="#" className="list-group-item list-group-item-action" aria-current="true">
    <div className="d-flex w-100 justify-content-between">
      <h5 className="mb-1">{record.id} . {record.service.service_type.kind} {record.service.service_type.sub_type}  - {record.service.id}
        </h5>
      <small>
        {record.date_created[0]}
      </small>
    </div>
    <p className="mb-1">
      <span className='mx-2'>
        {record.service.caregiver.first_name} {record.service.caregiver.last_name}
      </span>
      <span className='mx-2'>
        {record.service.duration} min
      </span>
      <span className='mx-2'>
        ${record.service.price}
      </span>
    </p>
    <h6 className='text-custom-1 fw-bold'>
      <span className='mx-2'>
        Email: {record.service.caregiver.email}
      </span>
      <span className='mx-2'>
        Phone: {record.service.caregiver.phone}
      </span>
    </h6>
  </div>)
}
