import React from 'react'
import '../style/alert.css';

export default function AlertMessage({ category, message, flashMessage }) {
    return (
        <div className={`alert alert-fixed alert-${category} alert-dismissible fade show text-center`} role="alert">
            <strong>{ message }</strong>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => flashMessage(null, null)}></button>
        </div>
    )
}
