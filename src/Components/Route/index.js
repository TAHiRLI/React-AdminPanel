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
import ProductCategoryList from '../ProductCategory';
import SettingList from '../Setting/Index';

function Routes() {
    return (
        <Router>
            <Switch>
                <Route path={ROUTES.DASHBOARD.MAIN_PATH} exact>
                    <Layout content={SettingList} />
                </Route>
             
                <Route path={ROUTES.LOGIN} exact>
                    <Login />
                </Route>
                <JwtRoute path="/jwt" component={()=><Layout content={SettingList}/>} exact/>
                <JwtRoute path={ROUTES.CATEGORIES} component={()=><Layout content={CategoryList}/>} exact/>
                <JwtRoute path={ROUTES.ProductCategories} component={()=><Layout content={ProductCategoryList}/>} exact/>
                <JwtRoute path={ROUTES.PRODUCTS} component={()=><Layout content={ProductList}/>} exact/>
                <JwtRoute path ={ROUTES.SETTINGS} component={()=><Layout content={SettingList}/>} exact/>
            </Switch>
        </Router>
    );
}

export default Routes;