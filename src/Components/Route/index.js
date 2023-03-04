import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { ROUTES } from '../../Consts/Routes';
import BlogList from '../Blog';
import DepartmentList from '../Department';
import DoctorList from '../Doctor';
import JwtRoute from '../JwtRoute/JwtRoute';
import Layout from '../Layout/index';
import Login from '../Login';
import ProductList from '../Product';
import ProductCategoryList from '../ProductCategory';
import ProductReviewList from '../ProductReview';
import SettingList from '../Setting/Index';

function Routes() {
    return (
        <Router>
            <Switch>
                <Route path={ROUTES.LOGIN} exact>
                    <Login />
                </Route>
                <JwtRoute path={ROUTES.DASHBOARD.MAIN_PATH} exact>
                    <div> Dashboard here</div>
                </JwtRoute>

                <JwtRoute path={ROUTES.SETTINGS} component={() => <Layout content={SettingList} />} exact />
                <JwtRoute path={ROUTES.PRODUCTS} component={() => <Layout content={ProductList} />} exact />
                <JwtRoute path={ROUTES.PRODUCT_CATEGORIES} component={() => <Layout content={ProductCategoryList} />} exact />
                <JwtRoute path={ROUTES.PRODUCT_REVIEWS} component={() => <Layout content={ProductReviewList} />} exact />
                <JwtRoute path={ROUTES.BLOGS} component={() => <Layout content={BlogList} />} exact />
                <JwtRoute path={ROUTES.DEPARTMENTS} component={() => <Layout content={DepartmentList} />} exact />
                <JwtRoute path={ROUTES.DOCTORS} component={() => <Layout content={DoctorList} />} exact />
                
            </Switch>
        </Router>
    );
}

export default Routes;