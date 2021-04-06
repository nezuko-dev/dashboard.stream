import React, { useContext } from "react";
import { Menu, Affix, Col, Spin, Modal } from "antd";
import { User } from "context/user";
import { Link, useLocation } from "react-router-dom";
import Cookie from "js-cookie";
import {
  DashboardOutlined,
  TeamOutlined,
  SolutionOutlined,
  UnorderedListOutlined,
  PlaySquareOutlined,
  CreditCardOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./style.scss";
const Drawer = () => {
  const { user, setUser } = useContext(User);
  const token = Cookie.get("dashboard-token");
  const location = useLocation();
  const routes = [
    {
      title: "Үндсэн",
      items: [
        {
          to: "/dashboard",
          title: "Хянах самбар",
          icon: <DashboardOutlined />,
        },
        {
          to: "/users",
          title: "Хэрэглэгч",
          icon: <TeamOutlined />,
        },
        {
          to: "/managers",
          title: "Админ",
          icon: <SolutionOutlined />,
        },
      ],
    },
    {
      title: "Контент",
      items: [
        {
          to: "/genre",
          title: "Tөрөл",
          icon: <UnorderedListOutlined />,
        },
        {
          to: "/titles",
          title: "Контентууд",
          icon: <PlaySquareOutlined />,
        },
        {
          to: "/invoice",
          title: "Tөлбөрүүд",
          icon: <CreditCardOutlined />,
        },
      ],
    },
    {
      title: "Хэрэглэгч",
      items: [
        {
          to: "/settings",
          title: "Tохиргоо",
          icon: <SettingOutlined />,
        },
        {
          to: "/profile",
          title: "Хувийн мэдээлэл",
          icon: <UserOutlined />,
        },
        {
          to: "/logout",
          title: "Системээс гарах",
          icon: <LogoutOutlined />,
          onClick: (e) => {
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
          },
        },
      ],
    },
  ];

  return token ? (
    <Col md={6} lg={6} xl={5} xxl={4} className="main-menu">
      <Affix>
        {user ? (
          <div className="main-menu-inner">
            <Menu selectedKeys={location.pathname} mode="inline">
              {routes.map((route, index) => (
                <Menu.ItemGroup key={index} title={route.title}>
                  {route.items.map((item) => (
                    <Menu.Item key={item.to} icon={item.icon}>
                      <Link to={item.to} onClick={item.onClick}>
                        {item.title}
                      </Link>
                    </Menu.Item>
                  ))}
                </Menu.ItemGroup>
              ))}
            </Menu>
          </div>
        ) : (
          <div className="drawer-spin">
            <Spin />
          </div>
        )}
      </Affix>
    </Col>
  ) : null;
};
export default Drawer;
