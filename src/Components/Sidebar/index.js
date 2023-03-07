import React from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { LoginService } from '../../APIs/Services/LoginService';
import { ROUTES } from '../../Consts/Routes';
import { useGeneralContext } from '../Context/GeneralContext';
import "./sidebar.scss";
function Sidebar() {

    const { isSidebarActive } = useGeneralContext();
    const [userRoles, setUserRoles] = React.useState([]);

    const getRoles = React.useCallback(() => {
        LoginService.getRoles().then(res => {
            setUserRoles(res.data);
        });
    });
    React.useEffect(() => {
        getRoles();
    },[]);

    React.useEffect(() => {
        let element = document.getElementById('sidebar');
        if (isSidebarActive) {
            element.classList.add("active");
        }
        else {
            element.classList.remove("active");
        }
    }, [isSidebarActive]);



    return (


        <div className="">
            <div className="d-flex  flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className="fs-5 d-none d-sm-inline">Menu</span>
                </a>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item ">
                        <Link to={ROUTES.SETTINGS} className="nav-link align-middle px-0 text-light">
                            <i className="fs-4 zmdi zmdi-settings "></i> <span className="ms-1 d-none d-sm-inline">Settings</span>
                        </Link>
                        <Link to={ROUTES.PRODUCTS} className="nav-link align-middle px-0 text-light">
                            <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Products</span>
                        </Link>
                        <Link to={ROUTES.PRODUCT_CATEGORIES} className="nav-link align-middle px-0 text-light">
                            <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Product Categories</span>
                        </Link>
                        <Link to={ROUTES.PRODUCT_REVIEWS} className="nav-link align-middle px-0 text-light">
                            <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Product Reviews</span>
                        </Link>
                        <Link to={ROUTES.BLOGS} className="nav-link align-middle px-0 text-light">
                            <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Blogs</span>
                        </Link>
                        <Link to={ROUTES.DEPARTMENTS} className="nav-link align-middle px-0 text-light">
                            <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Departments</span>
                        </Link>
                        <Link to={ROUTES.DOCTORS} className="nav-link align-middle px-0 text-light">
                            <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Doctors</span>
                        </Link>
                        <Link to={ROUTES.ORDERS} className="nav-link align-middle px-0 text-light">
                            <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Orders</span>
                        </Link>
                        <Link to={ROUTES.USERS} className="nav-link align-middle px-0 text-light">
                            <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Users</span>
                        </Link>
                        {userRoles.includes("SuperAdmin") ?
                        (<Link to={ROUTES.ADMINS} className="nav-link align-middle px-0 text-light">
                            <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Admin Users</span>
                        </Link>)
                        :(<></>)
                        }
                        <Link to={ROUTES.MESSAGES} className="nav-link align-middle px-0 text-light">
                            <i className="fs-4 zmdi zmdi-landscape  "></i> <span className="ms-1 d-none d-sm-inline">Messages</span>
                        </Link>
                        

                    </li>

                </ul>

            </div>
        </div>




    );
}

export default Sidebar;