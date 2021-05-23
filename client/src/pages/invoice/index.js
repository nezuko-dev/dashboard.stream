import React, { useState, useEffect } from "react";
import {
  message,
  Table,
  Card,
  Spin,
  Empty,
  Form,
  Input,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import axios from "axios";

const Invoice = () => {
  const [state, setState] = useState(null);
  const [search, setSearch] = useState(null);

  const load = () => {
    setState(null);
    axios
      .get("/api/invoice")
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
      title: "Хэрэглэгч",
      dataIndex: "user",
      render: (text) => text?.email,
    },

    {
      title: "Үзвэр",
      dataIndex: "title",
      render: (text) => text?.name,
    },
    {
      title: "Үнийн дүн",
      dataIndex: "amount",
    },
    {
      title: "Үүсгэсэн огноо",
      dataIndex: "created",
      render: (text) => moment(text).fromNow(),
    },
    {
      title: "Tөлөв",
      dataIndex: "status",
      render: (text, record) =>
        !text ? (
          <Tag color="#f50">Tөлөөгүй</Tag>
        ) : (
          <Tooltip title={moment(record.paid).format("YYYY MM DD")}>
            <Tag color="#87d068">Tөлсөн</Tag>
          </Tooltip>
        ),
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
                <span className="page-title">Tүрээсүүд</span>
              </div>
              <div className="">
                <Form.Item>
                  <Input
                    placeholder="Имэйл хаяг эсвэл үзвэрийн нэрээр хайх "
                    size="large"
                    className="custom-input"
                    autoFocus={true}
                    disabled={state.length === 0 ? true : false}
                    onChange={(e) => {
                      var search = e.target.value;
                      if (search) {
                        setSearch(
                          state.filter(
                            (data) =>
                              data.user?.email
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              data.title?.name
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
                      description={
                        <span>Tөлбөрийн нэхэмжлэлийн түүх олдсонгүй</span>
                      }
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
export default Invoice;
