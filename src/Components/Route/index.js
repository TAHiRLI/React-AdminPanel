import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { ROUTES } from '../../Consts/Routes';
import CategoryList from '../Category';
import JwtRoute from '../JwtRoute/JwtRoute';
import Layout from '../Layout/index';
import Login from '../Login';
import ProductList from '../Product';

function Routes() {
    return (
        <Router>
            <Switch>
                <Route path={ROUTES.DASHBOARD.MAIN_PATH} exact>
                    <Layout content={Login} />
                </Route>
             
                <Route path={ROUTES.LOGIN} exact>
                    <Login />
                </Route>
                <JwtRoute path="/jwt" component={()=><Layout content={Login}/>} exact/>
                <JwtRoute path={ROUTES.CATEGORIES} component={()=><Layout content={CategoryList}/>} exact/>
                <JwtRoute path={ROUTES.PRODUCTS} component={()=><Layout content={ProductList}/>} exact/>
            </Switch>
        </Router>
    );
}

export default Routes;