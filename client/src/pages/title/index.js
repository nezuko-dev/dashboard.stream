import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  message,
  Form,
  Input,
  Upload,
  Divider,
  Drawer,
  Row,
  Col,
  Typography,
  Space,
  InputNumber,
  Select,
  Switch,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import "./style.scss";
const Title = (props) => {
  const { Title } = Typography;
  const { Option } = Select;
  const { TextArea } = Input;
  const { id } = props.match.params;
  const insert = props.location.search === "?new" ? true : false;
  const [state, setState] = useState(null);
  const [drawer, OpenDrawer] = useState(insert || false);
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState(null);
  const [form] = Form.useForm();
  const [edit, setEdit] = useState(null);
  const [paid, setPaid] = useState(false);
  const [contents, setContents] = useState([]);
  const load = (status) => {
    setState(null);
    if (id) {
      axios
        .get("/api/franchise/title/" + id)
        .then((response) => {
          if (response.data.status) setState(response.data.data);
        })
        .catch((err) => message.error("Хүсэлт амжилтүй"));
    } else {
      axios
        .get("/api/titles", { params: { franchise: status || false } })
        .then((response) => {
          if (response.data.status) setState(response.data.data);
        })
        .catch((err) => message.error("Хүсэлт амжилтүй"));
    }
  };
  useEffect(() => {
    if (!insert) load();
  }, [insert]);
  const Add = () => (
    <Button
      type="primary"
      className="button-content"
      onClick={() => {
        OpenDrawer(true);
      }}
    >
      Нэмэх
    </Button>
  );
  return (
    <>
      <div className="titles">
        <Card
          tabBarExtraContent={<Add />}
          onTabChange={(key) => load(key)}
          activeTabKey={id ? "true" : "false"}
          tabList={[
            {
              key: false,
              tab: "Бүлэглээгүй",
            },

            {
              key: true,
              tab: "Бүлэглэсэн",
            },
          ]}
        >
          {state?.length}
        </Card>
      </div>
      <Drawer
        title="Шинэ үзвэр нэмэх"
        width={720}
        onClose={() => OpenDrawer(false)}
        visible={drawer}
        footer={
          <div style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => OpenDrawer(false)}>Буцах</Button>
              <Button onClick={() => form.submit()} type="primary">
                Хадгалах
              </Button>
            </Space>
          </div>
        }
        {...(loading || insert
          ? {
              closable: true,
              maskClosable: false,
              onCancel: () => {
                OpenDrawer(false);
                load(true);
              },
            }
          : null)}
      >
        <Form
          form={form}
          layout="vertical"
          className="custom-form title-form"
          initialValues={edit}
          hideRequiredMark
          onFinish={(values) => {
            setError(null);
            setLoading(true);
            axios
              .post(`/api/titles${edit ? `/${edit._id}` : ""}`, {
                name: values.name,
                franchise: id || null,
              })
              .then((response) => {
                if (response.data.status) {
                  message.success("Амжилттай.");
                  setLoading(false);
                  OpenDrawer(false);
                  setEdit(null);
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
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Нэр"
                rules={[
                  {
                    required: true,
                    message: "Нэр оруулна уу!",
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
            </Col>
            <Col span={12}>
              <Form.Item
                name="label"
                label="Label"
                rules={[
                  {
                    required: true,
                    message: "Label оруулна уу!",
                  },
                ]}
                {...(errors && errors.find((error) => error.param === "label")
                  ? {
                      help: errors.find((error) => error.param === "label").msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Input placeholder="Label" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Tөлөв"
                rules={[
                  {
                    required: true,
                    message: "Tөлөв сонгоно уу!",
                  },
                ]}
                {...(errors && errors.find((error) => error.param === "status")
                  ? {
                      help: errors.find((error) => error.param === "status")
                        .msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Select className="custom-select" size="large">
                  <Option value="ongoing">Гарж байгаа</Option>
                  <Option value="finished">Дууссан</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="total_episode"
                label="Нийт анги"
                rules={[
                  {
                    required: true,
                    message: "Нийт анги оруулна уу!",
                  },
                ]}
                {...(errors &&
                errors.find((error) => error.param === "total_episode")
                  ? {
                      help: errors.find(
                        (error) => error.param === "total_episode"
                      ).msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <InputNumber
                  className="custom-number-input"
                  placeholder="Нийт анги"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="plot"
            label="Киноны өрнөл"
            rules={[
              {
                required: true,
                message: "Киноны өрнөл оруулна уу!",
              },
            ]}
            {...(errors && errors.find((error) => error.param === "plot")
              ? {
                  help: errors.find((error) => error.param === "plot").msg,
                  validateStatus: "error",
                }
              : null)}
          >
            <TextArea placeholder="Киноны өрнөл" />
          </Form.Item>
          <Form.Item
            name="cover"
            rules={[
              {
                required: true,
                message: "cover зураг байршуулна уу!",
              },
            ]}
            valuePropName="file"
            {...(errors && errors.find((error) => error.param === "cover")
              ? {
                  help: errors.find((error) => error.param === "cover").msg,
                  validateStatus: "error",
                }
              : null)}
          >
            <ImgCrop aspect={16 / 9}>
              <Upload
                action={`/api/titles/image/cover`}
                maxCount={1}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>
                  Cover зураг байршуулах (1920×1080)
                </Button>
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item
            name="poster"
            rules={[
              {
                required: true,
                message: "poster зураг байршуулна уу!",
              },
            ]}
            valuePropName="file"
            {...(errors && errors.find((error) => error.param === "poster")
              ? {
                  help: errors.find((error) => error.param === "poster").msg,
                  validateStatus: "error",
                }
              : null)}
          >
            <ImgCrop aspect={4 / 6}>
              <Upload
                action={`/api/titles/image/poster`}
                maxCount={1}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>
                  Poster зураг байршуулах (960×1440)
                </Button>
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item
            name="banner"
            rules={[
              {
                required: true,
                message: "Banner зураг байршуулна уу!",
              },
            ]}
            valuePropName="file"
            {...(errors && errors.find((error) => error.param === "banner")
              ? {
                  help: errors.find((error) => error.param === "banner").msg,
                  validateStatus: "error",
                }
              : null)}
          >
            <ImgCrop aspect={16 / 9}>
              <Upload
                action={`/api/titles/image/banner`}
                maxCount={1}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>
                  Banner зураг байршуулах (1920×720)
                </Button>
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Divider dashed />
          <Title level={5}>Tөлбөрийн мэдээлэл</Title>
          <Form.Item name="policy">
            <div className="policy">
              <span>Tөлбөртэй контент</span>
              <Switch onChange={(e) => setPaid(e)} />
            </div>
          </Form.Item>
          {paid ? (
            <Form.Item
              name="price"
              label="Үнэ"
              rules={[
                {
                  required: true,
                  message: "Үнэ оруулна уу.",
                },
              ]}
              {...(errors && errors.find((error) => error.param === "price")
                ? {
                    help: errors.find((error) => error.param === "price").msg,
                    validateStatus: "error",
                  }
                : null)}
            >
              <InputNumber
                min={1}
                className="custom-number-input"
                placeholder="Үнэ"
                size="large"
              />
            </Form.Item>
          ) : null}
          <Divider dashed />
          <Title level={5}>Ангиуд</Title>
          <Form.List
            name="episodes"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(
                      new Error("Доод тал нь 1 ангитай байна.!")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item required={false} key={field.key}>
                    <Row gutter={16}>
                      {
                        <>
                          <Col span={11}>
                            <Form.Item
                              name="name"
                              rules={[
                                {
                                  required: true,
                                  message: "Ангийн нэр оруулна уу.",
                                },
                              ]}
                            >
                              <Input placeholder="Нэр" size="large" />
                            </Form.Item>
                          </Col>
                          <Col span={11}>
                            <Form.Item
                              name="content"
                              rules={[
                                {
                                  required: true,
                                  message: "Контент сонгоно уу.",
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                filterOption={false}
                                notFoundContent={null}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                placeholder="Контент хайх"
                                onSearch={(value) => {
                                  if (value) {
                                    axios
                                      .post("/api/content/search", {
                                        value: value,
                                      })
                                      .then((response) => {
                                        if (response.data.status)
                                          setContents(response.data.data);
                                        else setContents([]);
                                      });
                                  } else setContents([]);
                                }}
                                size="large"
                                className="custom-select"
                              >
                                {contents.map((content) => (
                                  <Option value={content._id} key={content._id}>
                                    {content.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </>
                      }
                      {fields.length > 1 ? (
                        <Col span={2}>
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        </Col>
                      ) : null}
                    </Row>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Анги нэмэх
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Drawer>
    </>
  );
};
export default Title;
