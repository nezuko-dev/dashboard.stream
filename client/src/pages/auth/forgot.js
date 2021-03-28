import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Divider, Card, Row, Col, message } from "antd";
import { Link, Redirect } from "react-router-dom";
import Cookie from "js-cookie";
import "./style.scss";
const Forgot = () => {
  const [form] = Form.useForm();
  const [disabled, disable] = useState(false);
  const [errors, setError] = useState(null);
  return Cookie.get("dashboard-token") ? (
    <Redirect to="/dashboard" />
  ) : (
    <div className="auth">
      <Row justify="center">
        <Col xs={24} sm={18} md={14} lg={12} xl={10} xxl={8}>
          <Card>
            <h2>Нууц үг сэргээх</h2>
            <Divider />
            <span>
              Tа Удирдлагын хэсэгт бүртгэлтэй Email хаяг аа оруулснаар нууц үг
              сэргээх эрхээ email хаяг дээрээ авах боломжтой.
            </span>
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                setError(null);
                disable(true);
                axios
                  .post("/api/account/forgot", { ...values })
                  .then((response) => {
                    if (response.data.status) {
                      message.success("Tа Имэйл хаяг аа шалгана уу.");
                    } else {
                      message.error("Хүсэлт амжилтгүй боллоо.");
                    }
                    disable(false);
                  })
                  .catch((err) => {
                    setError(err.response.data.errors);
                    disable(false);
                  });
              }}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    // type: "email",
                    message: "Email хаяг аа зөв оруулна уу!",
                  },
                ]}
                validateStatus={
                  errors && errors.find((error) => error.param === "email")
                    ? "error"
                    : null
                }
                help={
                  errors && errors.find((error) => error.param === "email")
                    ? errors.find((error) => error.param === "email").msg
                    : null
                }
              >
                <Input
                  placeholder="Email"
                  size="large"
                  //   type="email"
                  disabled={disabled}
                />
              </Form.Item>
              <Divider />
              <div className="forgot-action">
                <Row justify="end">
                  <Link to="/">
                    <Button type="secondary" size="large">
                      Цуцлах
                    </Button>
                  </Link>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    disabled={disabled}
                  >
                    Сэргээх
                  </Button>
                </Row>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Forgot;
