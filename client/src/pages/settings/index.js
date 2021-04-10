import React, { useContext, useState } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Spin,
  Button,
  Modal,
  Space,
  message,
} from "antd";
import { User } from "context/user";
import axios from "axios";
import "./style.scss";

const Settings = () => {
  const { user, setUser } = useContext(User);
  const [errors, setError] = useState(null);
  const [information] = Form.useForm();
  const [password] = Form.useForm();
  const [email] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [verification, setVerification] = useState(false);
  const [disabled, disable] = useState("");
  return (
    <div className="settings">
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16} xxl={12}>
          <Card title="Хувийн мэдээлэл">
            {user ? (
              <>
                <Form
                  form={information}
                  layout="vertical"
                  className="custom-form"
                  onFinish={(values) => {
                    setError(null);
                    disable("information");
                    if (values.name !== user.name) {
                      axios
                        .post("/api/account/information", { name: values.name })
                        .then((response) => {
                          if (response.data.status) {
                            information.setFieldsValue({
                              name: response.data.updated,
                            });
                            setUser({ ...user, name: response.data.updated });
                            message.success("Tаны нэр амжилттай шинэчлэгдлээ.");
                          }
                        })
                        .catch((err) => {
                          setError(err.response.data.errors);
                        });
                    }
                  }}
                  initialValues={{
                    name: user.name,
                    email: user.email.value,
                    role: user.role,
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
                      {
                        min: 5,
                        message: "Tаны нэр доод тал нь 5 оронтой байна.",
                      },
                      {
                        max: 22,
                        message: "Tаны нэр дээд тал нь 22 оронтой байна.",
                      },
                    ]}
                    {...(errors &&
                    errors.find((error) => error.param === "name")
                      ? {
                          help: errors.find((error) => error.param === "name")
                            .msg,
                          validateStatus: "error",
                        }
                      : null)}
                  >
                    <Input
                      placeholder="Нэр"
                      size="large"
                      onChange={(e) => disable("")}
                    />
                  </Form.Item>
                  <Form.Item label="Эрх" name="role">
                    <Input size="large" disabled={true} />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <Input placeholder="Email" size="large" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      disabled={disabled === "information" && true}
                    >
                      Хадгалах
                    </Button>
                  </Form.Item>
                </Form>
                <Modal
                  visible={open}
                  centered
                  maskClosable={false}
                  closable={false}
                  footer={null}
                  className="email-modal"
                >
                  <h4>
                    {verification
                      ? "Баталгаажуулах код оруулна уу"
                      : "Email хаяг солих"}
                  </h4>
                  {verification ? (
                    <Form
                      form={email}
                      layout="vertical"
                      className="custom-form email-update"
                      onFinish={(values) => {
                        setError(null);
                        disable("email");
                        axios
                          .post("/api/account/email/save", {
                            ...values,
                          })
                          .then((response) => {
                            if (response.data.status) {
                              console.log(response.data.status);
                              if (response.data.status) {
                                setError(null);
                                setOpen(false);
                                information.setFieldsValue({
                                  email: response.data.updated,
                                });
                                message.success(
                                  "Tаны email хаяг амжилттай шинэчлэгдлээ."
                                );
                                setVerification(false);
                                email.resetFields();
                                disable("");
                              }
                            }
                          })
                          .catch((err) => {
                            setError(err.response.data.errors);
                            disable("");
                          });
                      }}
                    >
                      <Form.Item
                        required
                        name="pin"
                        {...(errors &&
                        errors.find((error) => error.param === "pin")
                          ? {
                              help: errors.find(
                                (error) => error.param === "pin"
                              ).msg,
                              validateStatus: "error",
                            }
                          : null)}
                      >
                        <Input
                          placeholder="Баталгаажуулах код"
                          size="large"
                          autoComplete="off"
                          type="number"
                          disabled={disabled === "email" && true}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Row justify="end">
                          <Button
                            type="primary"
                            htmlType="submit"
                            disabled={disabled === "email" && true}
                          >
                            Үргэлжлүүлэх
                          </Button>
                        </Row>
                      </Form.Item>
                    </Form>
                  ) : (
                    <Form
                      form={email}
                      layout="vertical"
                      className="custom-form email-update"
                      onFinish={(values) => {
                        setError(null);
                        disable("email");
                        axios
                          .post("/api/account/email", {
                            email: values.new_email,
                            password: values.check_password,
                          })
                          .then((response) => {
                            if (response.data.status) {
                              setVerification(true);
                              message.info(
                                "Баталгаажуулах код илгээлээ. Tа имэйлээ шалгана уу"
                              );
                              disable(false);
                            }
                          })
                          .catch((err) => {
                            setError(err.response.data.errors);
                            disable(false);
                          });
                        email.setFieldsValue({ check_password: "" });
                      }}
                    >
                      <Form.Item
                        name="new_email"
                        rules={[
                          {
                            required: true,
                            type: "email",
                            message: "Email хаяг аа зөв оруулна уу!",
                          },
                        ]}
                        {...(errors &&
                        errors.find((error) => error.param === "new_email")
                          ? {
                              help: errors.find(
                                (error) => error.param === "new_email"
                              ).msg,
                              validateStatus: "error",
                            }
                          : null)}
                      >
                        <Input
                          placeholder="Шинэ Email"
                          size="large"
                          type="email"
                          autoFocus={true}
                          disabled={disabled === "email" && true}
                        />
                      </Form.Item>
                      <Form.Item
                        name="check_password"
                        rules={[
                          {
                            required: true,
                            message: "Нууц үгээ оруулна уу!",
                          },
                        ]}
                        {...(errors &&
                        errors.find((error) => error.param === "check_password")
                          ? {
                              help: errors.find(
                                (error) => error.param === "check_password"
                              ).msg,
                              validateStatus: "error",
                            }
                          : null)}
                      >
                        <Input
                          placeholder="Нууц үг"
                          size="large"
                          type="password"
                          disabled={disabled === "email" && true}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Row justify="end">
                          <Space>
                            <Button
                              type="secondary"
                              disabled={disabled === "email" && true}
                              onClick={() => setOpen(false)}
                            >
                              Цуцлах
                            </Button>
                            <Button
                              type="primary"
                              htmlType="submit"
                              disabled={disabled === "email" && true}
                            >
                              Үргэлжлүүлэх
                            </Button>
                          </Space>
                        </Row>
                      </Form.Item>
                    </Form>
                  )}
                </Modal>
              </>
            ) : (
              <div className="loading">
                <Spin />
              </div>
            )}
          </Card>

          <Card title="Нууц үг солих">
            <Form
              form={password}
              layout="vertical"
              className="custom-form"
              onFinish={(values) => {
                const { new_password, confirm_password } = values;
                setError(null);
                if (new_password !== confirm_password) {
                  setError([
                    {
                      param: "confirm_password",
                      msg: "Нууц үг таарахгүй байна.",
                    },
                  ]);
                } else {
                  disable("password");
                  axios
                    .post("/api/account/password", { ...values })
                    .then((response) => {
                      if (response.data.status) {
                        message.success(
                          `Tаны нууц үг амжилттай шинэчлэгдлээ. ${
                            response.data.duplicate ? "🤔" : ""
                          }`
                        );
                        disable("");
                      }
                    })
                    .catch((err) => {
                      setError(err.response.data.errors);
                      disable("");
                    });
                  password.resetFields();
                }
              }}
            >
              <Form.Item
                name="current_password"
                label="Нууц үг"
                rules={[
                  {
                    required: true,
                    message: "Нууц үгээ оруулна уу!",
                  },
                  { min: 6, message: "Нууц үг доод тал нь 6 оронтой байна." },
                  { max: 32, message: "Нууц үг дээд тал нь 32 оронтой байна." },
                ]}
                {...(errors &&
                errors.find((error) => error.param === "current_password")
                  ? {
                      help: errors.find(
                        (error) => error.param === "current_password"
                      ).msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Input.Password
                  placeholder="Одоо ашиглаж буй нууц үг"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="new_password"
                label="Шинэ нууц үг"
                rules={[
                  {
                    required: true,
                    message: "Нууц үгээ оруулна уу!",
                  },
                  { min: 6, message: "Нууц үг доод тал нь 6 оронтой байна." },
                  { max: 32, message: "Нууц үг дээд тал нь 32 оронтой байна." },
                ]}
                {...(errors &&
                errors.find((error) => error.param === "new_password")
                  ? {
                      help: errors.find(
                        (error) => error.param === "new_password"
                      ).msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Input.Password placeholder="Шинэ нууц үг" size="large" />
              </Form.Item>
              <Form.Item
                name="confirm_password"
                label="Нууц үг давтах"
                rules={[
                  {
                    required: true,
                    message: "Нууц үгээ оруулна уу!",
                  },
                  { min: 6, message: "Нууц үг доод тал нь 6 оронтой байна." },
                  { max: 32, message: "Нууц үг дээд тал нь 32 оронтой байна." },
                ]}
                {...(errors &&
                errors.find((error) => error.param === "confirm_password")
                  ? {
                      help: errors.find(
                        (error) => error.param === "confirm_password"
                      ).msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Input.Password
                  placeholder="Шинэ нууц үгээ давтан оруулна уу"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  disabled={disabled === "password" && true}
                >
                  Хадгалах
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Settings;
