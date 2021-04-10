import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { notification, Row, Col } from "antd";
import Cookie from "js-cookie";
import axios from "axios";
// components
import { PrivateRoute, Header, Drawer } from "components";
// pages
import { Auth, Forgot, Reset, Dashboard, Settings, Genre } from "pages";
// context
import { User } from "context/user";
const App = () => {
  const token = Cookie.get("dashboard-token");
  const [user, setUser] = useState(null);
  const openNotification = ({ message, description }) => {
    notification.error({
      message,
      description,
      onClick: () => {
        Cookie.remove("dashboard-token");
        window.location.reload();
      },
      onClose: () => {
        Cookie.remove("dashboard-token");
        window.location.reload();
      },
    });
  };
  useEffect(() => {
    if (token) {
      axios
        .get("/api/account")
        .then((response) => {
          if (response.data.msg) {
            openNotification({
              message: "Failed to Login",
              description: response.data.msg,
            });
          } else {
            setUser(response.data.user);
          }
        })
        .catch((err) =>
          openNotification({
            message: "Failed to login",
            description: "Please reload this window",
          })
        );
    }
  }, [token]);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <BrowserRouter>
      <User.Provider value={value}>
        {token ? <Header /> : null}
        <div className="app">
          <Row>
            <Drawer />
            <Col
              md={token ? 18 : 24}
              lg={token ? 18 : 24}
              xl={token ? 19 : 24}
              xxl={token ? 20 : 24}
            >
              <div className="main-container">
                <Switch>
                  {/* login, forgot, reset */}
                  <Route path="/" exact component={Auth} />
                  <Route path="/auth/forgot" exact component={Forgot} />
                  <Route
                    path="/auth/reset/:token([0-9a-z]{36})"
                    component={Reset}
                  />
                  {/* main routes */}
                  <PrivateRoute path="/dashboard" exact component={Dashboard} />
                  <PrivateRoute path="/settings" exact component={Settings} />
                  <PrivateRoute path="/genre" exact component={Genre} />
                  <Redirect to="/dashboard" />
                </Switch>
              </div>
            </Col>
          </Row>
        </div>
      </User.Provider>
    </BrowserRouter>
  );
};
export default App;
