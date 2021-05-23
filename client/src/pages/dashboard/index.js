import React, { useState, useEffect } from "react";
import { Col, message, Row, Divider, Spin } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  SmileTwoTone,
  IdcardTwoTone,
  ProfileTwoTone,
  VideoCameraTwoTone,
  DollarCircleTwoTone,
  FileZipTwoTone,
  PlaySquareTwoTone,
  HourglassTwoTone,
} from "@ant-design/icons";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "./style.scss";
const Dashboard = () => {
  const [state, setState] = useState(null);
  const [income, setIncome] = useState(null);

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
        key: "admins",
        title: "Админ",
        count: 0,
        icon: <SmileTwoTone />,
        path: "/admins",
      },
      {
        key: "genres",
        title: "Контентын төрөл",
        count: 0,
        icon: <ProfileTwoTone />,
        path: "/genre",
      },
      {
        key: "contents",
        title: "Нийт контент",
        count: 0,
        icon: <VideoCameraTwoTone />,
        path: "/contents",
      },
      {
        key: "franchises",
        title: "Нийт бүлэг",
        count: 0,
        icon: <FileZipTwoTone />,
        path: "/franchise",
      },
      {
        key: "titles",
        title: "Нийт үзвэрүүд",
        count: 0,
        icon: <PlaySquareTwoTone />,
        path: "/titles",
      },
      {
        key: "invoices",
        title: "Биелэгдсэн нэхэмжлэлүүд",
        count: 0,
        icon: <DollarCircleTwoTone />,
        path: "/invoice",
      },
      {
        key: "rents",
        title: "Идэвхтэй түрээсүүд",
        count: 0,
        icon: <HourglassTwoTone />,
        path: "/rents",
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
    axios
      .get("/api/dashboard/income")
      .then((response) => {
        if (response.data.status) {
          // response.data.data.map((data) => {
          //   amount.push(data.title.price.amount);
          //   labels.push(moment(data).format("YYYY MM DD"));
          // });
          setIncome(response.data.data);
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
      <Divider />
      <div className="title-container">
        <span className="page-title">Энэ сарын орлогууд</span>
      </div>
      {income ? (
        <Line
          data={{
            labels: income.map((data) => {
              return moment(data).format("YYYY MM DD");
            }),
            datasets: [
              {
                label: " Tүрээсийн дүн",
                data: income.map((data) => {
                  return data.title.price.amount;
                }),
                fill: false,
                backgroundColor: "rgb(24, 144, 255)",
                borderColor: "rgba(24, 144, 255,0.2)",
              },
            ],
          }}
        />
      ) : (
        <div className="loading">
          <Spin />
        </div>
      )}
    </div>
  );
};
export default Dashboard;
