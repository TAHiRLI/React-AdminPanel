import React from 'react'
import { Link } from 'react-router-dom';
import { ROUTES } from '../../Consts/Routes';
import { useGeneralContext } from '../Context/GeneralContext';
import "./sidebar.scss"
function Sidebar() {

    const {isSidebarActive} = useGeneralContext();
   

    React.useEffect(()=>{
        let element = document.getElementById('sidebar');
        if(isSidebarActive){
            element.classList.add("active");
        }
        else{
            element.classList.remove("active")
        }
    },[isSidebarActive])
  return (
    <div id='sidebar' className='sidebar'>Sidebar
    <ul>
      <li><Link to={ROUTES.CATEGORIES}>Categories</Link></li>
      <li><Link to={ROUTES.PRODUCTS}>Product</Link></li>
      <li><Link to={ROUTES.SETTINGS}>Settings</Link></li>
    </ul>
    </div>
  )
}

export default Sidebar