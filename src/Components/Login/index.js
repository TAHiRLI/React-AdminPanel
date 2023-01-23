import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../Consts/Routes';
import { useGeneralContext } from '../Context/GeneralContext';

function Login() {
    const {
        setIsAuthenticated, setIsAuthorized, setUserRole,
        isAuthenticated, isAuthorized, userRole
    } = useGeneralContext();

    console.log(isAuthenticated, isAuthorized, userRole);

    const handleSubmit =()=>{
        setIsAuthenticated(true);
        setIsAuthorized(true);
        setUserRole("Admin");

        console.log('logged in')
    }
    return (
        <div>Login
            <button onClick={handleSubmit}>Login</button>
            <Link to={"/protected"}>Go to protected</Link>
        </div>
    );
}

export default Login;