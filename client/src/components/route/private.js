import React from "react";
import Cookie from "js-cookie";
import { Route, Redirect } from "react-router-dom";
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Cookie.get("dashboard-token") ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);
export default PrivateRoute;
