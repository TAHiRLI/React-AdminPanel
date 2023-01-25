import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../Consts/Routes';
import { useGeneralContext } from '../Context/GeneralContext';

function Login() {
  
    const {
        isAuthenticated, isAuthorized, userRole
    } = useSelector(state => state);
    const myDispatch = useDispatch();
    console.log(isAuthenticated, isAuthorized, userRole);

    const handleSubmit =()=>{
        myDispatch({type:"SUBMIT_LOGIN"})
        console.log('logged in')
    }
    return (
        <div>Login
            <br/>
            <button onClick={handleSubmit}>Login</button>
            <br/>
            <Link to={"/protected"}>Go to protected</Link>
        </div>
    );
}

export default Login;