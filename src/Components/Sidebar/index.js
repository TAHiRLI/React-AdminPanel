import React from 'react'
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
    <aside id='sidebar' className='sidebar'>Sidebar</aside>
  )
}

export default Sidebar