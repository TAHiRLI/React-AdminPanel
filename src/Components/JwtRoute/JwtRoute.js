

import React, { Component, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { LoginService } from '../../APIs/Services/LoginService';



function JwtRoute({ component: Component, ...rest }) {
    let token = JSON.parse(sessionStorage.getItem("token")) 
    const {isLoading}  = useSelector(state => state);
    const myDispatch = useDispatch();
    const [statusCode, setStatusCode] = React.useState()
    
    
    let isMounted = useRef(true)
    React.useEffect(()=>{

        myDispatch({type: "LOADING"})
        LoginService.CheckAuth(token).then((data)=>{
            if(isMounted.current){
                setStatusCode(data.status)
                console.log("data status is", data.status)
            }
     }).catch(error => {
        setStatusCode(401)
        console.log(error)
     })
     .finally(()=>{
         myDispatch({type: "LOADED"})
     } )

     return ()=>{
        isMounted.current = false;
     }
     },[ ])


   if(isLoading || statusCode == undefined){
    return <div> Loading ...</div>
   }
   console.log(statusCode)
   if(statusCode == 204){
      return (
        <Route {...rest} render={(props) =>  (<Component />)} />
    );
   }
   else{
       console.log("worked")
       console.log(isLoading)
       return <Redirect to={"/login"}/>
       return <div>return else</div>

   }
  
}
export default JwtRoute;