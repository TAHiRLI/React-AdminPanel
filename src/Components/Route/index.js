import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { ROUTES } from '../../Consts/Routes';
import AdminList from '../Admin';
import BlogList from '../Blog';
import DepartmentList from '../Department';
import DoctorList from '../Doctor';
import JwtRoute from '../JwtRoute/JwtRoute';
import Layout from '../Layout/index';
import Login from '../Login';
import MessageList from '../Message';
import OrderList from '../Order';
import OrderDetails from '../OrderDetails';
import ProductList from '../Product';
import ProductCategoryList from '../ProductCategory';
import ProductReviewList from '../ProductReview';
import SettingList from '../Setting/Index';
import SliderList from '../Slider';
import SubscribtionList from '../Subscribtions';
import UserList from '../User';

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
                <JwtRoute path={ROUTES.ORDERS} component={() => <Layout content={OrderList} />} exact />
                <JwtRoute path={ROUTES.ORDER_DETAILS} component={() => <Layout content={OrderDetails} />} exact />
                <JwtRoute path={ROUTES.USERS} component={() => <Layout content={UserList} />} exact />
                <JwtRoute path={ROUTES.ADMINS} component={() => <Layout content={AdminList} />} exact />
                <JwtRoute path={ROUTES.MESSAGES} component={() => <Layout content={MessageList} />} exact />
                <JwtRoute path={ROUTES.SLIDERS} component={() => <Layout content={SliderList} />} exact />
                <JwtRoute path={ROUTES.SUBSCRIBERS} component={() => <Layout content={SubscribtionList} />} exact />
                
            </Switch>
        </Router>
    );
}

export default Routes;