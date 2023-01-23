import React from 'react'
import { useGeneralContext } from '../Context/GeneralContext';
import './navbar.scss'
function Navbar() {

  const {isSidebarActive, setIsSidebarActive} = useGeneralContext();
  const handleMenuClick =()=>{
  setIsSidebarActive(!isSidebarActive);
    console.log(isSidebarActive);
  }

  return (
    <div className='navbar'>
        <div className='navbar_container'>
           <div className='navbar_container_boxLeft'>
            <img src="" alt="" />
           <button onClick={handleMenuClick} >Menu</button> 
           </div>
           <div className='navbar_container_boxRight'>b</div>
        </div>
    </div>
  )
}

export default Navbar