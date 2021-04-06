import React, { useContext } from "react";
import { Row, Col, Button, Dropdown, Menu, Modal } from "antd";
import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { User } from "context/user";
import axios from "axios";
import Cookie from "js-cookie";
import "./style.scss";

const Header = () => {
  const { user, setUser } = useContext(User);
  const settings = (
    <Menu>
      <Menu.Item icon={<DashboardOutlined />}>
        <Link to="/dashboard">Хянах самбар</Link>
      </Menu.Item>
      <Menu.Item icon={<SettingOutlined />}>
        <Link to="/settings">Тохиргоо</Link>
      </Menu.Item>
      <Menu.Item icon={<UserOutlined />}>
        <Link to="/profile">Хувийн мэдээлэл</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item icon={<LogoutOutlined />}>
        <Link
          to="/logout"
          onClick={(e) => {
            e.preventDefault();
            return Modal.confirm({
              title: "Анхааруулга",
              icon: <ExclamationCircleOutlined />,
              content: "Та системээс гарахдаа итгэлтэй байна уу?",
              okText: "Tийм",
              cancelText: "Буцах",
              onOk: () => {
                axios.get("/api/account/logout").then((response) => {
                  if (response.data.status) {
                    Cookie.remove("dashboard-token");
                    setUser(false);
                  }
                });
              },
            });
          }}
        >
          Системээс гарах
        </Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <div id="header">
      <Row>
        <Col xs={24} sm={24} md={6} lg={6} xl={5} xxl={4}>
          <div className="logo-container">
            <h3>
              <Link to="/">Logo</Link>
            </h3>
          </div>
        </Col>
        <Col xs={0} sm={0} md={18} lg={18} xl={19} xxl={20}>
          {user ? (
            <div className="menu-row">
              <div className="menu-item">
                <Dropdown overlay={settings} placement="bottomCenter">
                  <Button type="secondary">{user.name}</Button>
                </Dropdown>
              </div>
            </div>
          ) : null}
        </Col>
      </Row>
    </div>
  );
};
export default Header;
