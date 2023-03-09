import React from 'react';
import ReactPaginate from 'react-paginate';
import { NavLink } from 'react-router-dom';
import { LoginService } from '../../APIs/Services/LoginService';
import { ROUTES } from '../../Consts/Routes';
import { useGeneralContext } from '../Context/GeneralContext';
import "./sidebar.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faDolly, faGear, faList, faCommentDots, faNewspaper, faSitemap, faUserNurse, faUsers, faUserTie, faEnvelopesBulk, faImages, faAt, faImage, faLightbulb, faChartLine } from '@fortawesome/free-solid-svg-icons';

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
    }, []);

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
            <div className="d-flex  flex-column align-items-center align-items-sm-start pt-2 text-white min-vh-100">
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item ">
                        <NavLink to={ROUTES.DASHBOARD} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faChartLine} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                        </NavLink>
                        <NavLink to={ROUTES.PRODUCTS} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faBoxOpen} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Products</span>
                        </NavLink>
                        <NavLink to={ROUTES.PRODUCT_CATEGORIES} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faList} className="pe-2 sidebar-icon" /><span className="ms-1 d-none d-sm-inline">Product Categories</span>
                        </NavLink>
                        <NavLink to={ROUTES.PRODUCT_REVIEWS} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faCommentDots} className="pe-2 sidebar-icon" /><span className="ms-1 d-none d-sm-inline">Product Reviews</span>
                        </NavLink>
                        <NavLink to={ROUTES.BLOGS} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faNewspaper} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Blogs</span>
                        </NavLink>
                        <NavLink to={ROUTES.BLOG_CATEGORIES} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faList} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Blog Categories</span>
                        </NavLink>
                        <NavLink to={ROUTES.DEPARTMENTS} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faSitemap} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Departments</span>
                        </NavLink>
                        <NavLink to={ROUTES.DOCTORS} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faUserNurse} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Doctors</span>
                        </NavLink>
                        <NavLink to={ROUTES.ORDERS} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faDolly} className="pe-2 sidebar-icon" /><span className="ms-1 d-none d-sm-inline">Orders</span>
                        </NavLink>
                     
                        <NavLink to={ROUTES.MESSAGES} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faEnvelopesBulk} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Messages</span>
                        </NavLink>
                        <NavLink to={ROUTES.SLIDERS} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faImages} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Sliders</span>
                        </NavLink>
                        <NavLink to={ROUTES.SUBSCRIBERS} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faAt} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Subscribers</span>
                        </NavLink>
                        <NavLink to={ROUTES.AMENITY_iMAGES} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faImage} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Amenity Images</span>
                        </NavLink>
                        <NavLink to={ROUTES.VALUES} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faLightbulb} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Values</span>
                        </NavLink>
                        <NavLink to={ROUTES.USERS} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faUsers} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Users</span>
                        </NavLink>
                        {userRoles.includes("SuperAdmin") ?
                            (<NavLink to={ROUTES.ADMINS} className="nav-link align-middle  text-light">
                                <FontAwesomeIcon icon={faUserTie} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Admin Users</span>
                            </NavLink>)
                            : (<></>)
                        }
                        <NavLink to={ROUTES.SETTINGS} className="nav-link align-middle  text-light">
                            <FontAwesomeIcon icon={faGear} className="pe-2 sidebar-icon" /> <span className="ms-1 d-none d-sm-inline">Settings</span>
                        </NavLink>
                    </li>

                </ul>

            </div>
        </div>




    );
}

export default Sidebar;