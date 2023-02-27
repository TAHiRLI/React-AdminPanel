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


    <div className="">
        <div className="d-flex  flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-5 d-none d-sm-inline">Menu</span>
            </a>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                <li className="nav-item ">
                    <Link to={ROUTES.SETTINGS} className="nav-link align-middle px-0 text-light">
                        <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Settings</span>
                    </Link>
                    <Link to={ROUTES.ProductCategories} className="nav-link align-middle px-0 text-light">
                        <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Product Categories</span>
                    </Link>
                    <Link to={ROUTES.PRODUCT_REVIEWS} className="nav-link align-middle px-0 text-light">
                        <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Product Reviews</span>
                    </Link>
                    <Link to={ROUTES.BLOGS} className="nav-link align-middle px-0 text-light">
                        <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Blogs</span>
                    </Link>
                </li>
         
            </ul>
         
        </div>
    </div>
   


   
  )
}

export default Sidebar