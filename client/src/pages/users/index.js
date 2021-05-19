import React, { useState, useEffect } from "react";
import { message, Table, Card, Spin, Empty, Form, Input } from "antd";
import moment from "moment";
import axios from "axios";

import "./style.scss";
const Users = () => {
  const [state, setState] = useState(null);
  const [search, setSearch] = useState(null);

  const load = () => {
    setState(null);
    axios
      .get("/api/users")
      .then((response) => {
        if (response.data.status) setState(response.data.data);
      })
      .catch((err) =>
        message.error(
          err.response.data.message
            ? err.response.data.message
            : "Хүсэлт амжилтгүй"
        )
      );
  };
  const columns = [
    {
      title: "Имэйл",
      dataIndex: "email",
    },

    {
      title: "Бүртгүүлсэн огноо",
      dataIndex: "created",
      render: (text) => moment(text).fromNow(),
    },
  ];
  useEffect(() => load(), []);

  return (
    <>
      <div className="users">
        <Card>
          {state ? (
            <>
              <div className="title-container">
                <span className="page-title">Хэрэглэгч</span>
              </div>
              <div className="">
                <Form.Item>
                  <Input
                    placeholder="Имэйл хаягаар хайх"
                    size="large"
                    className="custom-input"
                    autoFocus={true}
                    disabled={state.length === 0 ? true : false}
                    onChange={(e) => {
                      var search = e.target.value;
                      if (search) {
                        setSearch(
                          state.filter((user) =>
                            user.email
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          )
                        );
                      } else {
                        setSearch(state);
                      }
                    }}
                  />
                </Form.Item>
              </div>
              <Table
                dataSource={search ? search : state}
                columns={columns}
                rowKey={(record) => record._id}
                locale={{
                  emptyText: (
                    <Empty
                      description={<span>Хэрэглэгч бүргүүлээгүй байна</span>}
                    />
                  ),
                }}
              />
            </>
          ) : (
            <div className="loading">
              <Spin />
            </div>
          )}
        </Card>
      </div>
    </>
  );
};
export default Users;
