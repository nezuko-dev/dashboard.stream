import React, { useEffect, useState } from "react";
import {
  Card,
  message,
  Modal,
  Button,
  Form,
  Input,
  Checkbox,
  DatePicker,
  Table,
  Empty,
  Spin,
  Row,
} from "antd";
import moment from "moment";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/mn_MN";
import "./style.scss";
import axios from "axios";
const Admin = () => {
  const [state, setState] = useState(null);
  const [search, setSearch] = useState(null);
  const [modal, OpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState(null);
  const [form] = Form.useForm();
  const [expire, setExpire] = useState(false);
  const load = () => {
    setState(null);
    axios
      .get("/api/admin")
      .then((response) => response.data.status && setState(response.data.data))
      .catch((err) => message.error("Хүсэлт амжилтгүй"));
  };
  const columns = [
    {
      title: "Email хаяг",
      dataIndex: "email",
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: "Нэр",
      dataIndex: "name",
    },
    {
      title: "Tөлөв",
      dataIndex: "",
      render: (record, text) => (
        <div className="admin-status">
          <span className="status">
            {record.active ? (
              <>
                <CheckCircleOutlined style={{ color: "#1a863a" }} />
                <span className="label">Идэвхтэй</span>
              </>
            ) : (
              <>
                <ExclamationCircleOutlined style={{ color: "orange" }} />
                <span className="label">Идэвхгүй</span>
              </>
            )}
          </span>
          <div className="expires">
            {record.expires
              ? moment(record.expires).format("YYYY-MM-DD")
              : "Хугацаагүй"}
          </div>
        </div>
      ),
    },
    {
      title: "Үүсгэсэн",
      dataIndex: "created",
      render: (text) => moment(text).fromNow(),
    },
    {
      title: "Үйлдэл",
      render: (record, text) => (
        <Row justify="end">
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
                    .delete(`/api/admin/${record._id}`)
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
  useEffect(() => {
    load();
  }, []);
  const Add = () => (
    <Button
      type="primary"
      className="button-content"
      onClick={() => {
        // setEdit(null);
        setExpire(false);
        setError(null);
        OpenModal(true);
      }}
    >
      Админ нэмэх
    </Button>
  );
  return (
    <>
      <div className="admins">
        <Card>
          {state ? (
            <>
              <div className="title-container">
                <span className="page-title">Админууд</span>
                <Add />
              </div>
              <div className="">
                <Form.Item>
                  <Input
                    placeholder="Админ хайх"
                    size="large"
                    className="custom-input"
                    autoFocus={true}
                    disabled={state.length === 0 ? true : false}
                    onChange={(e) => {
                      var search = e.target.value;
                      if (search) {
                        setSearch(
                          state.filter(
                            (genre) =>
                              genre.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              genre.email
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
                    <Empty description={<span>Tа шинэ админ нэмнэ үү.</span>}>
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
        title={`Шинэ админ нэмэх`}
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
          // initialValues={}
          autoComplete="off"
          onFinish={(values) => {
            setError(null);
            setLoading(true);
            axios
              .post(`/api/admin/`, { ...values })
              .then((response) => {
                if (response.data.status) {
                  message.success("Шинэ админ амжилттай нэмэгдлээ.");
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
            rules={[
              {
                required: true,
                message: "Утга оруулна уу!",
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
            name="email"
            rules={[
              {
                required: true,
                message: "Утга оруулна уу!",
              },
            ]}
            {...(errors && errors.find((error) => error.param === "email")
              ? {
                  help: errors.find((error) => error.param === "email").msg,
                  validateStatus: "error",
                }
              : null)}
          >
            <Input placeholder="Email хаяг" size="large" type="email" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 10 }}>
            <Checkbox
              checked={expire}
              onChange={(e) => setExpire(e.target.checked)}
            >
              Эрхийн дуусах хугацаа тохируулах.
            </Checkbox>
          </Form.Item>
          {expire ? (
            <Form.Item
              name="expires"
              rules={[
                {
                  required: true,
                  message: "Огноо сонгоно уу!",
                },
              ]}
            >
              <DatePicker
                locale={locale}
                showToday={false}
                size="large"
                disabledDate={(current) => current < moment()}
              />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </>
  );
};
export default Admin;
