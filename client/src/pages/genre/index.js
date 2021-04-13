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
  Row,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";

import "./style.scss";
const Genre = () => {
  const [state, setState] = useState(null);
  const [search, setSearch] = useState(null);
  const [modal, OpenModal] = useState(false);
  const [form] = Form.useForm();
  const [errors, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // edit
  const [edit, setEdit] = useState(null);
  useEffect(() => {
    if (!edit) {
      form.resetFields();
    }
    form.setFieldsValue(edit);
  }, [form, edit]);
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
    {
      title: "",
      render: (record, text) => (
        <Row justify="end">
          <Button
            type="link"
            onClick={() => {
              OpenModal(true);
              setEdit(record);
            }}
          >
            Засах
          </Button>
          <Button
            type="link"
            danger
            onClick={() =>
              Modal.confirm({
                title: "Анхааруулга",
                icon: <ExclamationCircleOutlined />,
                content: "Та устгахдаа итгэлтэй байна уу?",
                okText: "Tийм",
                cancelText: "Буцах",
                onOk: () => {
                  axios
                    .delete(`/api/genre/${record._id}`)
                    .then((response) => {
                      if (response.data.status) {
                        message.success("Амжилттай устгагдлаа.");
                        load();
                      }
                    })
                    .catch((err) => message.error("Хүсэлт амжилтгүй"));
                },
              })
            }
          >
            Устгах
          </Button>
        </Row>
      ),
    },
  ];
  useEffect(() => load(), []);
  const Add = () => (
    <Button
      type="primary"
      className="button-content"
      onClick={() => {
        setEdit(null);
        OpenModal(true);
      }}
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
              <div className="">
                <Form.Item>
                  <Input
                    placeholder="Tөрөл хайх"
                    size="large"
                    className="custom-input"
                    autoFocus={true}
                    onChange={(e) => {
                      var search = e.target.value;
                      if (search) {
                        setSearch(
                          state.filter(
                            (genre) =>
                              genre.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              genre.keyword
                                .toLowerCase()
                                .includes(search.toLowerCase())
                          )
                        );
                      } else {
                        setSearch(state);
                      }
                    }}
                  />
                </Form.Item>
              </div>
              <Table
                dataSource={search ? search : state}
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
        title={edit ? "Контентийн төрлийн мэдээлэл засах" : "Tөрөл нэмэх"}
        onCancel={() => OpenModal(false)}
        onOk={() => form.submit()}
        okText="Хадгалах"
        cancelText="Буцах"
        className="custom-modal"
        confirmLoading={loading}
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          className="custom-form"
          initialValues={edit}
          autoComplete="off"
          onFinish={(values) => {
            setError(null);
            setLoading(true);
            axios
              .post(`/api/genre${edit ? `/${edit._id}` : ""}`, { ...values })
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
