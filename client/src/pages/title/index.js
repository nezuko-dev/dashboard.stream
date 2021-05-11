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
  Popconfirm,
  Modal,
  Empty,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  ExclamationCircleOutlined,
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
  const [franchise, setFranchise] = useState(null);
  const [state, setState] = useState(null);
  const [drawer, OpenDrawer] = useState(insert || false);
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState(null);
  const [form] = Form.useForm();
  const [edit, setEdit] = useState(null);
  const [paid, setPaid] = useState(false);
  const [contents, setContents] = useState([]);
  const setFileValue = (info, field) => {
    if (info.file.status === "done") {
      form.setFieldsValue({
        [field]: info.file.response.filename,
      });
    }
  };
  const load = () => {
    setState(null);
    axios
      .get("/api/titles", { params: id && { franchise: id } })
      .then((response) => {
        if (response.data.status) {
          setState(response.data.data);
          if (id) setFranchise(response.data.franchise);
        }
      })
      .catch((err) => message.error("Хүсэлт амжилтүй"));
    // fetch contents
    axios
      .get("/api/content", { params: { status: "ready" } })
      .then((response) => {
        if (response.data.status) setContents(response.data.data);
      })
      .catch((err) => message.error("Хүсэлт амжилтүй"));
  };
  useEffect(() => {
    if (!edit) {
      form.resetFields();
    }
    if (edit) {
      form.setFieldsValue({
        ...edit,
        cover: edit.images.cover.original,
        poster: edit.images.poster.original,
        banner: edit.images.banner,
      });
      setPaid(Boolean(edit.price));
    }
  }, [form, edit]);

  // eslint-disable-next-line
  useEffect(() => load(), []);
  const Add = () => (
    <Button
      type="primary"
      className="button-content"
      onClick={() => {
        OpenDrawer(true);
        setEdit(null);
      }}
    >
      Нэмэх
    </Button>
  );
  return (
    <>
      <div className="titles">
        <Card>
          <>
            <div className="title-container">
              <Title level={5}>
                {id && franchise ? `Бүлэг: ${franchise.name}` : "Бүх үзвэрүүд"}
              </Title>
              <Add />
            </div>
            <Divider style={{ marginTop: 0 }} />
          </>
          {state ? (
            state.length === 0 ? (
              <Empty />
            ) : (
              <Row gutter={[16, 16]}>
                {state.map((title) => (
                  <Col xs={24} md={12} xl={6} xxl={5} key={title._id}>
                    <Card
                      size="small"
                      title={title.name}
                      hoverable
                      onClick={() => {
                        setEdit(title);
                        OpenDrawer(true);
                      }}
                    >
                      <p>
                        Нийт анги: {title.episodes.length}/{title.total_episode}
                      </p>
                      <p></p>
                      <p></p>
                    </Card>
                  </Col>
                ))}
              </Row>
            )
          ) : null}
        </Card>
      </div>
      <Drawer
        forceRender
        title={edit ? "Үзвэр засах" : "Шинэ үзвэр нэмэх"}
        width={720}
        onClose={() => {
          OpenDrawer(false);
          setEdit(null);
        }}
        visible={drawer}
        footer={
          <Row justify="space-between">
            {edit ? (
              <Button
                type="primary"
                onClick={() =>
                  Modal.confirm({
                    title: "Анхааруулга",
                    icon: <ExclamationCircleOutlined />,
                    content: `Энэ үзвэрийг устахдаа итгэлтэй байна уу`,
                    okText: "Tийм",
                    cancelText: "Буцах",
                    onOk: () => {
                      axios
                        .delete("/api/titles/" + edit._id)
                        .then((response) => {
                          if (response.data.status) {
                            message.success("Амжилттай устгагдлаа.");
                            OpenDrawer(false);
                            setEdit(null);
                            load();
                          }
                        })
                        .catch((err) => message.error("Хүсэлт амжилтгүй"));
                    },
                  })
                }
                danger
              >
                Устгах
              </Button>
            ) : (
              <div></div>
            )}
            <div style={{ textAlign: "right" }}>
              <Space>
                <Button onClick={() => OpenDrawer(false)}>Буцах</Button>
                <Button onClick={() => form.submit()} type="primary">
                  Хадгалах
                </Button>
              </Space>
            </div>
          </Row>
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
          hideRequiredMark
          onFinish={(values) => {
            setError(null);
            setLoading(true);
            axios
              .post(`/api/titles${edit ? `/${edit._id}` : ""}`, {
                ...values,
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
                  <Option value="ongoing">Гарч байгаа</Option>
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
                onChange={(info) => setFileValue(info, "cover")}
              >
                <Button icon={<UploadOutlined />}>
                  Cover зураг {edit ? "солих" : "байршуулах"} (1920×1080)
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
                onChange={(info) => setFileValue(info, "poster")}
              >
                <Button icon={<UploadOutlined />}>
                  Poster зураг {edit ? "солих" : "байршуулах"} (960×1440)
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
                onChange={(info) => setFileValue(info, "banner")}
              >
                <Button icon={<UploadOutlined />}>
                  Banner зураг {edit ? "солих" : "байршуулах"} (1920×720)
                </Button>
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Divider dashed />
          <Title level={5}>Tөлбөрийн мэдээлэл</Title>
          <div className="policy">
            <span>Tөлбөртэй контент</span>
            <Switch checked={paid} onChange={(e) => setPaid(e)} />
          </div>

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
                  <Row gutter={16} key={field.key}>
                    {
                      <>
                        <Col span={11}>
                          <Form.Item
                            {...field}
                            name={[field.name, "name"]}
                            fieldKey={[field.fieldKey, "name"]}
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
                            {...field}
                            name={[field.name, "content"]}
                            fieldKey={[field.fieldKey, "content"]}
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
                    {fields.length > 1 && index !== 0 ? (
                      <Col span={2}>
                        <Popconfirm
                          placement="left"
                          title="Энэ ангийг устгах уу?"
                          onConfirm={() => remove(field.name)}
                          okText="Tийм"
                          cancelText="Болих"
                        >
                          <MinusCircleOutlined className="dynamic-delete-button" />
                        </Popconfirm>
                      </Col>
                    ) : null}
                  </Row>
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
