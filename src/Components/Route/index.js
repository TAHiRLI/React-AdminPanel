import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { ROUTES } from '../../Consts/Routes';
import Layout from '../Layout/index';
import Login from '../Login';
import PrivateRoute from '../PrivateRoute';

function Routes() {
    return (
        <Router>
            <Switch>
                <Route path={ROUTES.DASHBOARD.MAIN_PATH} exact>
                    <Layout />
                </Route>
                <PrivateRoute
                    path="/protected"
                    component={Layout}
                    exact
                />
                <Route path={ROUTES.LOGIN} exact>
                    <Login />
                </Route>
            </Switch>
        </Router>
    );
}

export default Routes;