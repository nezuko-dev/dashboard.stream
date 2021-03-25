import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Divider } from "antd";
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
      <div className="auth-container">
        <h5>Log Into Dashboard</h5>
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
                message: "Please input your Email!",
              },
            ]}
          >
            <Input placeholder="Email" size="large" disabled={disabled} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
            {...error}
          >
            <Input
              placeholder="Password"
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
                Login
              </Button>
            </Form.Item>
            <Divider />
            <Link to="/auth/forgot">Forgot password?</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Auth;
