import React from "react";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";
import {
  SmileTwoTone,
  IdcardTwoTone,
  ProfileTwoTone,
  VideoCameraTwoTone,
  DollarCircleTwoTone,
} from "@ant-design/icons";
import "./style.scss";
const Dashboard = () => {
  const data = [
    {
      title: "Нийт хэрэглэгч",
      count: 23,
      icon: <IdcardTwoTone />,
      path: "/users",
    },
    {
      title: "Нийт контент",
      count: 10,
      icon: <VideoCameraTwoTone />,
      path: "/users",
    },
    {
      title: "Биелэгдсэн нэхэмжлэлүүд",
      count: 600,
      icon: <DollarCircleTwoTone />,
      path: "/users",
    },
    {
      title: "Контентын ангилал",
      count: 18,
      icon: <ProfileTwoTone />,
      path: "/genre",
    },
    {
      title: "Админ",
      count: 5,
      icon: <SmileTwoTone />,
      path: "/admins",
    },
  ];
  return (
    <div className="dashboard">
      <h3>статистик</h3>
      <Row>
        {data.map((item, index) => (
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
        ))}
      </Row>
    </div>
  );
};
export default Dashboard;
