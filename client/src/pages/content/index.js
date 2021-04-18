import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Spin,
  Empty,
  Row,
  Col,
} from "antd";
import { UploadOutlined, PlayCircleFilled } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

import "./style.scss";
const Content = () => {
  const [state, setState] = useState(null);
  const [modal, OpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState(null);
  const [form] = Form.useForm();
  const load = () => {
    setState(null);
    axios
      .get("/api/content")
      .then((response) => {
        if (response.data.status) setState(response.data.data);
      })
      .catch((err) => message.error("Хүсэлт амжилтүй"));
  };
  const Add = () => (
    <Button
      type="primary"
      className="button-content"
      onClick={() => {
        OpenModal(true);
      }}
    >
      Нэмэх
    </Button>
  );
  useEffect(() => load(), []);
  return (
    <>
      <div className="content">
        <Card>
          <div className="title-container">
            <span className="page-title">Контент</span>
            <Add />
          </div>
          {state ? (
            state.length === 0 ? (
              <Empty />
            ) : (
              <Row className="contents">
                {state.map((content) => (
                  <Col xs={24} md={12} xl={6} xxl={5} key={content._id}>
                    <Card>
                      <div className="content-image">
                        {content.status ? (
                          <Link
                            to={`/stream/${content._id}`}
                            className="content-playable"
                          >
                            <PlayCircleFilled />
                          </Link>
                        ) : (
                          <div className="content-processing"></div>
                        )}
                      </div>
                      <div>
                        <div className="content-detail">
                          <div className="content-title">{content.name}</div>
                          <div className="content-status">
                            {moment(content.created).fromNow()}{" "}
                            {content.status ? " • " + content.size : null}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )
          ) : (
            <div className="loading">
              <Spin />
            </div>
          )}
        </Card>
      </div>
      {/* add content modal */}
      <Modal
        visible={modal}
        title={"Контент нэмэх"}
        onCancel={() => OpenModal(false)}
        onOk={() => form.submit()}
        okText="Хадгалах"
        cancelText="Буцах"
        className="custom-modal"
        confirmLoading={loading}
        {...(loading
          ? {
              closable: false,
              maskClosable: false,
              onCancel: () => message.error("Tүр хүлээнэ үү"),
            }
          : null)}
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          className="custom-form"
          //   initialValues={edit}
          onFinish={(values) => {
            setError(null);
            setLoading(true);

            axios
              .post("/api/content", {
                name: values.name,
                filename: values.file.file.response.filename,
              })
              .then((response) => {
                if (response.data.status) {
                  message.success(
                    "Контент амжилттай нэмэгдлээ хөрвүүлж дуустал түр хүлээнэ үү."
                  );
                  setLoading(false);
                  OpenModal(false);
                  form.resetFields();
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
            name="file"
            rules={[
              {
                required: true,
                message: "Контент байршуулна уу!",
              },
            ]}
            valuePropName="file"
            {...(errors && errors.find((error) => error.param === "file")
              ? {
                  help: errors.find((error) => error.param === "file").msg,
                  validateStatus: "error",
                }
              : null)}
          >
            <Upload
              action="/api/content/upload"
              maxCount={1}
              accept="video/*,.mkv"
              onRemove={() => setLoading(false)}
              onChange={(info) => {
                if (info.file.status === "uploading") {
                  setLoading(true);
                }
                if (info.file.status === "done") {
                  setLoading(false);
                } else if (info.file.status === "error") {
                  setLoading(false);
                  message.error(`Байршуулах хүсэлт амжилтгүй боллоо.`);
                }
              }}
            >
              {!loading ? (
                <Button size="large" icon={<UploadOutlined />}>
                  Контент байршуулах
                </Button>
              ) : null}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Content;
