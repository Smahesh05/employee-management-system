import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  // fetching object from session storage
  var data = window.sessionStorage.getItem("key");
  data = JSON.parse(data);
  return (
    <Route
      {...rest}
      render={(props) =>
        // if obejct is present display component 
        data ? (
          <Component {...props} />
        ) : (
          // else redirect to login page
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
