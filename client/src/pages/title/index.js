import React, { useState, useEffect } from "react";
import { Card, Button, message, Modal, Form, Input } from "antd";
import axios from "axios";
const Title = (props) => {
  const { id } = props.match.params;
  const insert = props.location.search === "?new" ? true : false;
  const { TextArea } = Input;

  const [state, setState] = useState(null);
  const [modal, OpenModal] = useState(insert);
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState(null);
  const [form] = Form.useForm();
  const [edit, setEdit] = useState(null);
  const load = (status) => {
    setState(null);
    if (id) {
      axios
        .get("/api/franchise/titles/" + id)
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
  }, []);
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
  return (
    <>
      <div className="franchise-add">
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
      <Modal
        visible={modal}
        title={"Үзвэр нэмэх"}
        onCancel={() => {
          // if (edit) setEdit(null);
          OpenModal(false);
        }}
        onOk={() => {
          // form.submit()}
        }}
        okText="Хадгалах"
        cancelText="Буцах"
        className="custom-modal"
        confirmLoading={loading}
        {...(loading || insert
          ? {
              closable: true,
              maskClosable: false,
              onCancel: () => {
                OpenModal(false);
                load(true);
              },
            }
          : null)}
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          className="custom-form"
          initialValues={edit}
          onFinish={(values) => {
            setError(null);
            setLoading(true);
            axios
              .post(`/api/title${edit ? `/${edit._id}` : ""}`, {
                name: values.name,
                franchise: id || null,
              })
              .then((response) => {
                if (response.data.status) {
                  message.success("Амжилттай.");
                  setLoading(false);
                  OpenModal(false);
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
          {id ? (
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
          ) : null}
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
        </Form>
      </Modal>
    </>
  );
};
export default Title;
