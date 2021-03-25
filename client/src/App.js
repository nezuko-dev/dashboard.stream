import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { notification, Row, Col } from "antd";
import Cookie from "js-cookie";
import axios from "axios";
// components
import { PrivateRoute } from "components";
// pages
import { Auth } from "pages";
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
        <div className="app">
          <Row>
            <Col
              md={token ? 18 : 24}
              lg={token ? 18 : 24}
              xl={token ? 19 : 24}
              xxl={token ? 20 : 24}
            >
              <div className="main-container">
                <Switch>
                  <Route path="/" exact component={Auth} />
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
