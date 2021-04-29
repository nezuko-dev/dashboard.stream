import React, { useEffect, useState, useRef } from "react";
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
  Dropdown,
  Menu,
} from "antd";
import ImgCrop from "antd-img-crop";
import {
  UploadOutlined,
  PlayCircleFilled,
  MoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import HLS from "hls.js";
import "./style.scss";
const Content = () => {
  const video = useRef(null);
  const [state, setState] = useState(null);
  const [modal, OpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState(null);
  const [form] = Form.useForm();
  const [stream, setStream] = useState(null);
  const destroy = () => {
    window.hls.stopLoad();
    window.hls.detachMedia();
    window.hls.destroy();
  };

  const load = (key) => {
    setState(null);
    axios
      .get("/api/content", { params: { status: key || "ready" } })
      .then((response) => {
        if (response.data.status) setState(response.data.data);
      })
      .catch((err) => message.error("Хүсэлт амжилтүй"));
  };
  useEffect(() => {
    console.log(stream);
    if (stream) {
      if (HLS.isSupported()) {
        if (window.hls) destroy();
        window.hls = new HLS({ maxBufferSize: 1 });
        window.hls.loadSource(`/content/stream/${stream._id}/master.nez`);
        window.hls.attachMedia(video.current);
      } else if (video.current.canPlayType("application/vnd.apple.mpegurl")) {
        video.current.src = `/content/stream/${stream._id}/mobile.m3u8`;
      } else {
        message.error("Not Supported Device");
      }
    }
  }, [stream]);
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
        <Card
          tabBarExtraContent={<Add />}
          onTabChange={(key) => load(key)}
          tabList={[
            {
              key: "ready",
              tab: "Бэлэн",
            },
            {
              key: "processing",
              tab: "Боловсруулагдаж буй",
            },
            {
              key: "failed",
              tab: "Амжилтгүй",
            },
          ]}
        >
          {state ? (
            state.length === 0 ? (
              <Empty />
            ) : (
              <Row className="contents">
                {state.map((content) => (
                  <Col xs={24} md={12} xl={6} xxl={5} key={content._id}>
                    <Card>
                      <div className="content-image">
                        {content.status === "ready" ? (
                          <div
                            className="content-playable"
                            onClick={() => setStream(content)}
                          >
                            <PlayCircleFilled />
                          </div>
                        ) : (
                          <div className="content-processing"></div>
                        )}
                      </div>
                      <div>
                        <div className="content-detail">
                          <div className="content-title">{content.name}</div>
                          <div className="content-status">
                            {moment(content.created).fromNow() +
                              " • " +
                              content.size}
                          </div>
                        </div>
                      </div>
                      <div className="content-action">
                        <div>
                          <Dropdown
                            overlay={
                              <Menu>
                                <Menu.Item>Засах</Menu.Item>
                                <Menu.Item>
                                  <ImgCrop aspect={16 / 9}>
                                    <Upload
                                      action={`/api/content/image/${content._id}`}
                                      maxCount={1}
                                      accept="image/jpeg,png"
                                    >
                                      Зураг нэмэх
                                    </Upload>
                                  </ImgCrop>
                                </Menu.Item>
                                <Menu.Item
                                  danger
                                  onClick={() =>
                                    Modal.confirm({
                                      title: "Анхааруулга",
                                      icon: <ExclamationCircleOutlined />,
                                      content:
                                        "Та устгахдаа итгэлтэй байна уу?",
                                      okText: "Tийм",
                                      cancelText: "Буцах",
                                      onOk: () => {
                                        axios
                                          .delete(`/api/content/${content._id}`)
                                          .then((response) => {
                                            if (response.data.status) {
                                              load();
                                            }
                                          });
                                      },
                                    })
                                  }
                                >
                                  Устгах
                                </Menu.Item>
                              </Menu>
                            }
                          >
                            <Button shape="circle" icon={<MoreOutlined />} />
                          </Dropdown>
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
      <Modal
        title={stream ? stream.name : "N/A"}
        visible={stream ? true : false}
        onCancel={() => {
          setStream(null);
          destroy();
        }}
        footer={null}
        className="custom-modal"
        width={800}
        centered
      >
        <video ref={video} controls className="stream-video" />
      </Modal>
    </>
  );
};
export default Content;
