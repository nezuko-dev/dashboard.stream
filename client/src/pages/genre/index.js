import React, { useState, useEffect } from "react";
import {
  message,
  Table,
  Button,
  Card,
  Spin,
  Empty,
  Modal,
  Form,
  Input,
} from "antd";
import moment from "moment";
import axios from "axios";

import "./style.scss";
const Genre = () => {
  const [state, setState] = useState(null);
  const [modal, OpenModal] = useState(false);
  const [form] = Form.useForm();
  const [errors, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const load = () => {
    setState(null);
    axios
      .get("/api/genre")
      .then((response) => {
        if (response.data.status) setState(response.data.data);
      })
      .catch((err) => message.error("Хүсэлт амжилтүй"));
  };
  const columns = [
    {
      title: "Нэр",
      dataIndex: "name",
    },
    {
      title: "Tүлхүүр үг",
      dataIndex: "keyword",
    },
    {
      title: "Үүсгэсэн огноо",
      dataIndex: "created",
      render: (text) => moment(text).fromNow(),
    },
  ];
  useEffect(() => load(), []);
  const Add = () => (
    <Button
      type="primary"
      className="button-content"
      onClick={() => OpenModal(true)}
    >
      Нэмэх
    </Button>
  );
  return (
    <>
      <div className="genre">
        <Card>
          {state ? (
            <>
              <div className="title-container">
                <span className="page-title">Tөрөл</span>
                <Add />
              </div>
              <Table
                dataSource={state}
                columns={columns}
                rowKey={(record) => record._id}
                locale={{
                  emptyText: (
                    <Empty description={<span>Tа төрөл үүсгэнэ үү.</span>}>
                      <Add />
                    </Empty>
                  ),
                }}
              />
            </>
          ) : (
            <div className="loading">
              <Spin />
            </div>
          )}
        </Card>
      </div>
      <Modal
        visible={modal}
        title="Tөрөл нэмэх"
        onCancel={() => OpenModal(false)}
        onOk={() => form.submit()}
        okText="Хадгалах"
        cancelText="Буцах"
        className="custom-modal"
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          className="custom-form"
          onFinish={(values) => {
            setError(null);
            setLoading(true);
            axios
              .post("/api/genre", { ...values })
              .then((response) => {
                if (response.data.status) {
                  message.success("Tөрөл амжилттай нэмэгдлээ.");
                  setLoading(false);
                  OpenModal(false);
                  form.resetFields();
                  load();
                }
              })
              .catch((err) => {
                setError(err.response.data.errors);
                setLoading(false);
              });
          }}
        >
          <Form.Item
            name="name"
            label="Нэр"
            rules={[
              {
                required: true,
                message: "Нэр ээ оруулна уу!",
              },
            ]}
            {...(errors && errors.find((error) => error.param === "name")
              ? {
                  help: errors.find((error) => error.param === "name").msg,
                  validateStatus: "error",
                }
              : null)}
          >
            <Input placeholder="Нэр" size="large" />
          </Form.Item>
          <Form.Item
            name="keyword"
            label="Tүлхүүр үг"
            {...(errors && errors.find((error) => error.param === "keyword")
              ? {
                  help: errors.find((error) => error.param === "keyword").msg,
                  validateStatus: "error",
                }
              : null)}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Genre;
