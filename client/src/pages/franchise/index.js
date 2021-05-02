import React, { useState } from "react";
import { Card, Button, Form, Input, Spin } from "antd";
import "./style.scss";
const Franchise = () => {
  const [state, setState] = useState(null);
  const [search, setSearch] = useState(null);
  const Add = () => (
    <Button
      type="primary"
      className="button-content"
      onClick={() => {
        // setEdit(null);
        // OpenModal(true);
      }}
    >
      Нэмэх
    </Button>
  );
  return (
    <div className="franchise">
      <Card>
        {" "}
        {state ? (
          <>
            <div className="title-container">
              <span className="page-title">Tөрөл</span>
              <Add />
            </div>
            <div className="">
              <Form.Item>
                <Input
                  placeholder="Tөрөл хайх"
                  size="large"
                  className="custom-input"
                  autoFocus={true}
                  disabled={state.length === 0 ? true : false}
                  onChange={(e) => {
                    var search = e.target.value;
                    if (search) {
                      setSearch(
                        state.filter(
                          (genre) =>
                            genre.name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            genre.keyword
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
            {/* <Table
              dataSource={search ? search : state}
              columns={columns}
              rowKey={(record) => record._id}
              locale={{
                emptyText: (
                  <Empty description={<span>Tа төрөл үүсгэнэ үү.</span>}>
                    <Add />
                  </Empty>
                ),
              }}
            /> */}
          </>
        ) : (
          <div className="loading">
            <Spin />
          </div>
        )}
      </Card>
    </div>
  );
};
export default Franchise;
