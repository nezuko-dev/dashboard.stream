import React, { useState, useRef } from "react";
import {
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  Button,
  Space,
  message,
  Table,
  Divider,
  Empty,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/mn_MN";
import axios from "axios";
import html2pdf from "html2pdf.js";
import "./style.scss";

const Report = () => {
  const { Option } = Select;
  const download = useRef(null);
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const [state, setState] = useState(null);
  const [type, setType] = useState(null);
  const [loading, load] = useState(false);
  const columns = () => {
    switch (type) {
      case "user":
        return [
          {
            title: "Имэйл",
            dataIndex: "email",
          },
          {
            title: "IP",
            dataIndex: "ip",
          },
          {
            title: "Бүртгүүлсэн огноо",
            dataIndex: "created",
            render: (text) => moment(text).fromNow(),
          },
        ];
      case "invoice":
        return [
          {
            title: "Хэрэглэгч",
            dataIndex: "user",
            render: (text) => (text ? text.email : <i>Идэвхгүй хэрэглэгч</i>),
          },

          {
            title: "Үзвэр",
            dataIndex: "title",
            render: (text) => text?.name,
          },
          {
            title: "Үнийн дүн",
            dataIndex: "amount",
          },
          {
            title: "Үүсгэсэн огноо",
            dataIndex: "created",
            render: (text) => moment(text).fromNow(),
          },
          {
            title: "Tөлөв",
            dataIndex: "status",
            render: (text, record) =>
              !text ? (
                <Tag color="#f50">Tөлөөгүй</Tag>
              ) : (
                <Tooltip title={moment(record.paid).format("YYYY MM DD")}>
                  <Tag color="#87d068">Tөлсөн</Tag>
                </Tooltip>
              ),
          },
        ];
      case "title":
        return [
          {
            title: "Нэр",
            dataIndex: "name",
          },
          {
            title: "Бүлэг",
            dataIndex: "franchise",
            render: (text) => text?.name,
          },
          {
            title: "Нийт анги",
            dataIndex: "total_episode",
          },
          {
            title: "Үнэ",
            dataIndex: "price",
            render: (text) =>
              text.amount === 0 ? (
                <Tag color="#87d068">Үнэгүй</Tag>
              ) : (
                text.amount + "₮"
              ),
          },
          {
            title: "Tөлөв",
            dataIndex: "status",
            render: (text) => (
              <Tag>{text === "finished" ? "Дууссан" : "Гарч байгаа"}</Tag>
            ),
          },
          {
            title: "Үүсгэсэн огноо",
            dataIndex: "created",
            render: (text) => moment(text).fromNow(),
          },
        ];
      default:
        console.log(`invalid type 😒`);
    }
  };

  return (
    <div className="report">
      <div className="title-container">
        <span className="page-title">Tайлан</span>
      </div>
      <Form
        className="custom-form"
        name="basic"
        form={form}
        onFinish={(values) => {
          load(true);
          setState(null);
          axios
            .post("/api/dashboard/report/" + type, { ...values })
            .then((response) => {
              if (response.data.status) {
                setState(response.data.data);
              } else message.error("Хүсэлт амжилтгүй.");
              load(false);
            })
            .catch(() => message.error("Хүсэлт амжилтгүй."));
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="type"
              rules={[
                { required: true, message: "Tайлан гаргах төрлөө сонгоно уу." },
              ]}
            >
              <Select
                placeholder="Tайлан гаргах төрлөө сонгоно уу "
                size="large"
                className="custom-select"
                onChange={(type) => {
                  setState(null);
                  setType(type);
                }}
              >
                <Option value="invoice">Орлогын тайлан</Option>
                <Option value="title">Үзвэрийн тайлан</Option>
                <Option value="user">Хэрэглэгчийн тайлан</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="range"
              rules={[{ required: true, message: "Огноо сонгоно уу" }]}
            >
              <RangePicker locale={locale} size="large" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  shape="round"
                  htmlType="submit"
                  size="large"
                  icon={<SearchOutlined />}
                  loading={loading}
                >
                  Хайх
                </Button>
                <Button
                  shape="round"
                  disabled={Boolean(!state)}
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    html2pdf()
                      .set({
                        margin: 5,
                        filename: `report-${type}-${moment().format(
                          "YYYY-MM-DD"
                        )}`,
                      })
                      .from(download.current)
                      .save();
                  }}
                >
                  Tатах
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />
      <div ref={download}>
        <Row justify="space-between">
          <p>
            Нийт өгөгдөл: {state?.length}, төрөл: {type}
          </p>
          <p>Хэвлэсэн огноо: {moment().format("YYYY-MM-DD HH:mm")}</p>
        </Row>
        {state ? (
          <Table
            dataSource={state}
            columns={columns()}
            rowKey={(record) => record._id}
            pagination={false}
            locale={{
              emptyText: (
                <Empty description={<span>Өгөгдөл олдсонгүй 🤣</span>} />
              ),
            }}
          />
        ) : (
          <Empty description={<span>Хоосон 🥺</span>} />
        )}
      </div>
    </div>
  );
};
export default Report;
