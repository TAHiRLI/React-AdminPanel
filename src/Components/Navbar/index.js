import React from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useGeneralContext } from '../Context/GeneralContext';
import './navbar.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

function Navbar() {

  const {isSidebarActive, setIsSidebarActive} = useGeneralContext();
  const handleMenuClick =()=>{
  setIsSidebarActive(!isSidebarActive);
    console.log(isSidebarActive);
  }

  const {push} = useHistory();
  const handleLogOut =()=>{
    sessionStorage.removeItem('token')
    window.location.reload();
  }

  return (
    <div className='navbar'>
        <div className='navbar_container'>
           <div className='navbar_container_boxLeft'>
            <img src="" alt="" />
           <button onClick={handleMenuClick} className=" btn btn-outline-light" ><FontAwesomeIcon icon={faBars}/></button> 
           </div>
           <div className='navbar_container_boxRight'>
            <button onClick={handleLogOut} className=" btn btn-outline-light"><FontAwesomeIcon icon={faRightFromBracket}/></button>
           </div>
        </div>
    </div>
  )
}

export default Navbar