import React, { useState, useEffect } from 'react';
import ServiceItem from '../components/ServiceItem';


export default function Services({ user, setActiveLink, flashMessage }) {
  const [serviceList, setServiceList] = useState([]);
  const [serviceKind, setServiceKind] = useState('');
  const [subType, setSubType] = useState('');
  const [serviceTypes, setServiceTypes] = useState(null);

  useEffect(() => {
    setActiveLink("services");
    fetch('http://localhost:5000/care/servicetypes')
      .then(res => res.json())
      .then(data=>{
        setServiceTypes(data)
        setServiceKind(data.kinds[0]);
        setSubType(data.data[data.kinds[0]][0].stid);
      })

  }, []);

  useEffect(() => {
    if(subType){
      console.log("Debug for services, 1")
      fetch(`http://localhost:5000/elder/services?stid=${subType}`)
        .then(res => res.json())
        .then(data=>{
          setServiceList(data)
          console.log("Debug for services, 2")
        })
  
      console.log("Debug for services, 3")
    }

  }, [subType]);

  const changeServiceKind = (event) => {
    setServiceKind(event.target.value);
    setSubType(serviceTypes.data[event.target.value][0].stid);
  }

  const handleSearch = event => {
    event.preventDefault();

    let cname = event.target.cname.value;
    fetch(`http://localhost:5000/elder/services?stid=${subType}&cname=${cname}`)
      .then(res => res.json())
      .then(data=>{setServiceList(data)})
  }

  return (
    <>
      <h3 className="text-start p-1">
        Services
        <form className='float-end row search-form' onSubmit={handleSearch}>
          { serviceTypes ? (<>
            <select className="col form-select mx-1" onChange={changeServiceKind} value={serviceKind}>
              <option disabled="disabled">Service Kind</option>
              {serviceTypes.kinds.map( kind => (<option key={kind} value={kind}>{kind}</option>)
              )}
            </select>
            <select className="col form-select mx-1" value={subType} onChange={e => setSubType(e.target.value) } >
              <option disabled="disabled">Sub Kind</option>
              {
                serviceKind ?
                serviceTypes.data[serviceKind].map(sub_item => 
                  (<option key={sub_item.stid} value={sub_item.stid}>{sub_item.sub_type}</option>)
                )
                :
                (<></>)
              }
            </select>
          </>): (<></>)}
          
          <input type="text" id="search-name" name="cname" className="col-md-auto form-control mx-1" placeholder="CareGiver Name" aria-label="Search"></input>
          <input type="submit" value="Search" className='col-md-auto btn btn-custom-1' />
        </form>
      </h3>
      <hr/>
      {serviceKind ? (<>
        <div className="text-start p-1 row fs-6 text-muted">
          <div className='col-auto fw-bolder'>
            Service Description: 
          </div>
          <div className='col text-wrap'>
            {serviceTypes.data[serviceKind].filter(st => st.stid == subType).map(st=>st.desc)}
          </div>
        </div>
      </>) : (<></>)}

      <div className="card-list">
        {serviceList.map( 
          service => <ServiceItem key={service.id} user={user} service={service} flashMessage={flashMessage}/>
        )}
      </div>
      
    </>
  )
}