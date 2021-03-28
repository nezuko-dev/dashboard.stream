import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Divider, Card, Row, Col } from "antd";
import { Link, Redirect } from "react-router-dom";
import Cookie from "js-cookie";
import "./style.scss";
const Auth = () => {
  const [form] = Form.useForm();
  const [disabled, disable] = useState(false);
  const [error, setError] = useState({});
  return Cookie.get("dashboard-token") ? (
    <Redirect to="/dashboard" />
  ) : (
    <div className="auth">
      <Row justify="center">
        <Col xs={24} sm={16} md={12} lg={10} xl={8} xxl={6}>
          <Card>
            <h5>Удирдлагын хэсэгт нэвтрэх</h5>
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                setError({});
                disable(true);
                axios
                  .post("/api/account/auth", { ...values })
                  .then((response) => {
                    if (response.data.status) {
                      document.location.href = "/dashboard";
                    } else {
                      setError({
                        validateStatus: "error",
                        help: response.data.message,
                      });
                      disable(false);
                    }
                  })
                  .catch((err) => {
                    console.log(err.data);
                  });
              }}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Email хаяг аа зөв оруулна уу!",
                  },
                ]}
              >
                <Input
                  placeholder="Email"
                  size="large"
                  type="email"
                  disabled={disabled}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Нууц үгээ оруулна уу!" }]}
                {...error}
              >
                <Input
                  placeholder="Нууц үг"
                  type="password"
                  size="large"
                  disabled={disabled}
                />
              </Form.Item>

              <div className="form-action">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    shape="round"
                    disabled={disabled}
                  >
                    Нэвтрэх
                  </Button>
                </Form.Item>
                <Divider />
                <Link to="/auth/forgot">Нууц үг сэргээх</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Auth;
