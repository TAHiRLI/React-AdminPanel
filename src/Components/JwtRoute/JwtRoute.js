

import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { LoginService } from '../../APIs/LoginService';
import { ROUTES } from '../../Consts/Routes';
let token = "3eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiVGFoaXJBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IlRhaGlyQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiYWQ4MTEwYWMtMzFhNi00M2NkLWIxZjUtOWYyOWU3N2MxOGJjIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJBZG1pbiIsImV4cCI6MTY3NDY1OTM1MSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzA1Ny8iLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MDU3LyJ9.D2r-YBzqQjk0pDvb0SkYvHnFXOJgbyBVfyEijmWhFL8";
function JwtRoute({ component: Component, ...rest }) {
    // LoginService.SubmitLogin({ username: "TahirAdmin", password: "admin123" }, {}).then(data => console.log(data.data.token));
    const [statusCode, setStatusCode] = React.useState(401);
    

    const CheckAuth = React.useCallback(()=>{
          LoginService.CheckAuth(token).then(data=>{
            setStatusCode(data.status)
        } )
    })
     
    React.useEffect(()=>{
        CheckAuth();
    },[statusCode])
   

    return (
        <Route {...rest} render={(props) => statusCode == 204? (<Component />): (<Redirect to={ROUTES.LOGIN}/>)} />
    );
}

export default JwtRoute;