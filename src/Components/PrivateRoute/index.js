import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, useRouteMatch } from 'react-router-dom';
import { ROUTES } from '../../Consts/Routes';
import { useGeneralContext } from '../Context/GeneralContext';

function PrivateRoute({ component: Component, ...rest }) {

    // const {isAuthenticated, isAuthorized, userRole} = useGeneralContext();

    // React.useEffect(()=>{
    //     console.log(isAuthenticated, isAuthorized, userRole);
    // },[isAuthenticated, isAuthorized, userRole])

    // using redux here
   

    const myDispatch = useDispatch();
    
    
    React.useEffect(()=>{
        myDispatch({type: 'SUBMIT_LOGIN', userRole:"tahir"})
    },[])
    const {isAuthenticated, isAuthorized, userRole} = useSelector(state => state);
        
        console.log(isAuthenticated, isAuthorized, userRole)
    


    return (
        
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated && isAuthorized && (userRole === "SuperAdmin" || userRole === "Admin") ?
                    (
                        <Component {...props} />)
                    :
                    (
                        // <Redirect to={ROUTES.LOGIN}
                        //     exact />
                        <div>redirect

                            
                        </div>
                    )
            }
        />
    );
};

export default PrivateRoute;