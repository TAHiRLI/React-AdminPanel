import React from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useGeneralContext } from '../Context/GeneralContext';
import './navbar.scss'
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
           <button onClick={handleMenuClick} >Menu</button> 
           </div>
           <div className='navbar_container_boxRight'>
            <button onClick={handleLogOut}>Log Out</button>
           </div>
        </div>
    </div>
  )
}

export default Navbar