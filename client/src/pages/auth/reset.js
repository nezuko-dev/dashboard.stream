import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Divider, Card, Row, Col, message } from "antd";
import { Link, Redirect } from "react-router-dom";
import Cookie from "js-cookie";
import "./style.scss";
const Reset = (props) => {
  const [form] = Form.useForm();
  const [disabled, disable] = useState(false);
  const [errors, setError] = useState(null);
  const { token } = props.match.params;
  return Cookie.get("dashboard-token") ? (
    <Redirect to="/dashboard" />
  ) : (
    <div className="auth">
      <Row justify="center">
        <Col xs={24} sm={18} md={14} lg={12} xl={10} xxl={8}>
          <Card>
            <h2>Шинэ нууц үгээ оруулна уу</h2>
            <Divider />
            <span>
              Tа нууц үгээ өөрийн болон удирдлагын хэсгийн аюулгүй байдлыг
              хангаж 6-с дээш тэмдэгттэй амархан таах боломжгүй нууц үг сонгохыг
              анхаарна уу.
            </span>
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                setError(null);
                disable(true);
                axios
                  .post("/api/account/reset", { ...values, token })
                  .then((response) => {
                    if (response.data.status) {
                      document.location.href = "/dashboard";
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
                name="password"
                rules={[
                  {
                    required: true,
                    min: 6,
                    message: "Нууц үг доод тал нь 6 оронтой байна.",
                  },
                ]}
                {...(errors &&
                errors.find((error) =>
                  ["password", "token"].includes(error.param)
                )
                  ? {
                      help: errors.find((error) =>
                        ["password", "token"].includes(error.param)
                      ).msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Input.Password
                  type="password"
                  placeholder="Шинэ нууц үг"
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
                    Үргэлжлүүлэх
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
export default Reset;
