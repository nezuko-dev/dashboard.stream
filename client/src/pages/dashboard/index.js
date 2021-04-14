import React, { useState, useEffect } from "react";
import { Col, message, Row } from "antd";
import { Link } from "react-router-dom";
import {
  SmileTwoTone,
  IdcardTwoTone,
  ProfileTwoTone,
  VideoCameraTwoTone,
  DollarCircleTwoTone,
} from "@ant-design/icons";
import axios from "axios";
import "./style.scss";
const Dashboard = () => {
  const [state, setState] = useState(null);
  useEffect(() => {
    var data = [
      {
        key: "users",
        title: "Нийт хэрэглэгч",
        count: 0,
        icon: <IdcardTwoTone />,
        path: "/users",
      },
      {
        key: "contents",
        title: "Нийт контент",
        count: 0,
        icon: <VideoCameraTwoTone />,
        path: "/content",
      },
      {
        key: "invoices",
        title: "Биелэгдсэн нэхэмжлэлүүд",
        count: 0,
        icon: <DollarCircleTwoTone />,
        path: "/invoice",
      },
      {
        key: "genres",
        title: "Контентын ангилал",
        count: 0,
        icon: <ProfileTwoTone />,
        path: "/genre",
      },
      {
        key: "admins",
        title: "Админ",
        count: 0,
        icon: <SmileTwoTone />,
        path: "/admins",
      },
    ];
    axios
      .get("/api/dashboard")
      .then((response) => {
        if (response.data.status) {
          var items = data.map((item) => ({
            ...item,
            count: response.data[item.key] || 0,
          }));
          setState(items);
        }
      })
      .catch((err) => message.error("Хүсэлт амжилтгүй"));
  }, []);
  return (
    <div className="dashboard">
      <div className="title-container">
        <span className="page-title">Статистик</span>
      </div>
      <Row>
        {state
          ? state.map((item, index) => (
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={6}
                key={index}
                className="ant-list-item"
              >
                <Link to={item.path} className="dashboard-item">
                  <div className="dashboard-item-icon">{item.icon}</div>
                  <div className="dashboard-item-title">
                    {item.title} ({item.count})
                  </div>
                </Link>
              </Col>
            ))
          : null}
      </Row>
    </div>
  );
};
export default Dashboard;
