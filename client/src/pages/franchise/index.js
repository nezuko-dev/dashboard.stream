import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Spin,
  message,
  Modal,
  Table,
  Empty,
  InputNumber,
  Select,
  Popover,
  Space,
  Row,
  Col,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import "./style.scss";
import axios from "axios";
const Franchise = () => {
  const { Option } = Select;
  const [state, setState] = useState(null);
  const [genre, setGenre] = useState(null);
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modal, OpenModal] = useState(false);
  const [form] = Form.useForm();
  const [errors, setError] = useState(null);
  const [edit, setEdit] = useState(null);
  const load = () => {
    setState(null);
    axios
      .get("/api/franchise")
      .then((response) => {
        if (response.data.status) setState(response.data.data);
      })
      .catch((err) => message.error("Хүсэлт амжилтүй"));
    axios
      .get("/api/genre")
      .then((response) => {
        if (response.data.status) setGenre(response.data.data);
      })
      .catch((err) => message.error("Хүсэлт амжилтүй"));
  };
  const columns = [
    {
      title: "Нэр",
      dataIndex: "name",
    },
    {
      title: "Насны ангилал",
      dataIndex: "age_rating",
    },
    {
      title: "Tөрөл",
      dataIndex: "type",
    },
    {
      title: "Үүсгэсэн огноо",
      dataIndex: "created",
      render: (text) => moment(text).fromNow(),
    },
    {
      title: "Ангилал",
      dataIndex: "genre",
      render: (text) => (
        <Popover
          title="Ангилалууд"
          content={
            <div>
              {text.map((data) => (
                <div key={data._id}>{data.name}</div>
              ))}
            </div>
          }
        >
          <Button>{text.length}</Button>
        </Popover>
      ),
    },
    {
      title: "Нийт үзвэрүүд",
      dataIndex: "titles",
      render: (text, record) => (
        <Button type={text.length === 0 ? "primary" : "secondary"}>
          <Link to={`/titles/${record._id}${text.length === 0 ? "?new" : ""}`}>
            {text.length ? "Үзэх" : "Нэмэх"}
          </Link>
        </Button>
      ),
    },
    {
      title: "",
      render: (record, text) => (
        <Space>
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
                content: `Энэ бүлгийн ${record.titles.length} үзвэрийн мэдээлэл давхар устахыг анхаарна уу.`,
                okText: "Устгах",
                cancelText: "Буцах",
                onOk: () => {
                  axios
                    .delete(`/api/franchise/${record._id}`)
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
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (!edit) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        ...edit,
        genre: edit.genre.map((data) => data._id),
      });
    }
  }, [form, edit]);
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
  useEffect(() => load(), []);
  return (
    <>
      <div className="franchise">
        <Card>
          {state ? (
            <>
              <div className="title-container">
                <span className="page-title">Бүлэг</span>
                <Add />
              </div>
              <div className="">
                <Form.Item>
                  <Input
                    placeholder="Бүлэг хайх"
                    size="large"
                    className="custom-input"
                    autoFocus={true}
                    disabled={state.length === 0 ? true : false}
                    onChange={(e) => {
                      var search = e.target.value;
                      if (search) {
                        setSearch(
                          state.filter((franchise) =>
                            franchise.name
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
                    <Empty description={<span>Tа үзвэр үүсгэнэ үү.</span>}>
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
        title={edit ? "Үзвэрийн мэдээлэл засах" : "Үзвэр нэмэх"}
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
          autoComplete="off"
          onFinish={(values) => {
            setError(null);
            setLoading(true);
            axios
              .post(`/api/franchise${edit ? `/${edit._id}` : ""}`, {
                ...values,
              })
              .then((response) => {
                if (response.data.status) {
                  message.success("Үзвэр амжилттай нэмэгдлээ.");
                  setLoading(false);
                  OpenModal(false);
                  form.resetFields();
                  load();
                }
              })
              .catch((err) => {
                if (err.response.data.message)
                  message.error(err.response.data.message);
                else {
                  setError(err.response.data.errors);
                  setLoading(false);
                }
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age_rating"
                label="Насны зэрэглэл"
                rules={[
                  {
                    required: true,
                    message: "Насны зэрэглэл оруулна уу!",
                  },
                ]}
                {...(errors &&
                errors.find((error) => error.param === "age_rating")
                  ? {
                      help: errors.find((error) => error.param === "age_rating")
                        .msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <InputNumber
                  min={0}
                  max={180}
                  placeholder="Насны зэрэглэл"
                  className="custom-number-input"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Tөрөл"
                rules={[
                  {
                    required: true,
                    message: "Tөрөл сонгоно уу!",
                  },
                ]}
                {...(errors && errors.find((error) => error.param === "type")
                  ? {
                      help: errors.find((error) => error.param === "type").msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Select className="custom-select" size="large">
                  <Option value="movie">Кино</Option>
                  <Option value="series">Цуврал</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="genre"
            label="Ангилал"
            rules={[
              {
                required: true,
                message: "Ангилал сонгоно уу!",
              },
            ]}
            {...(errors && errors.find((error) => error.param === "genre")
              ? {
                  help: errors.find((error) => error.param === "genre").msg,
                  validateStatus: "error",
                }
              : null)}
          >
            <Select
              mode="multiple"
              className="custom-select"
              allowClear
              placeholder="Ангилалууд сонгоно уу."
              loading={genre ? false : true}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              size="large"
            >
              {genre
                ? genre.map((children) => (
                    <Option key={children._id} value={children._id}>
                      {children.name}
                    </Option>
                  ))
                : null}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Franchise;
