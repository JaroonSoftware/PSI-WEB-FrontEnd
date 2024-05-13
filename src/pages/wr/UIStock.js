import React, { useEffect, useRef, useState } from "react";
import { Card, Table, Pagination, Button, Space, Input, Form } from "antd";
import { PrinterFilled } from "@ant-design/icons";
import { COLUMN } from "context/column";

const UIStock = () => {
  const [productList, setProductList] = useState([]);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {}, []);

  return (
    <>
      <Card className="card-dashboard">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "18px" }}>Remaining Stock</h1>
          <Space>
            <Input.Search
              placeholder="ค้นหา"
              allowClear
              style={{ width: 200 }}
            />

            <Button
              type="primary"
              icon={<PrinterFilled />}
              style={{
                width: "100%",
                maxWidth: "138px",
                margin: "0",
                backgroundColor: "#ffc107",
              }}
              onClick={() => {}}
            >
              รายงาน
            </Button>

            <Button
              type="primary"
              style={{ width: "100%", maxWidth: "138px", margin: "0" }}
              onClick={() => {}}
            >
              เพิ่ม
            </Button>
          </Space>
        </div>

        <Table
          dataSource={productList}
          columns={COLUMN.PRODUCT({ page, pageLimit })}
          onRow={(record) => () => {}}
          scroll={{ x: 900 }}
          style={{ marginTop: "1rem" }}
          pagination={false}
          className="table-click-able"
          size="small"
          rowKey="procode"
        />
        <Pagination
          showSizeChanger
          total={totalItems}
          showTotal={(total) => `จำนวนทั้งหมด ${total?.toLocaleString()}`}
          defaultPageSize={10}
          defaultCurrent={1}
          current={page}
          pageSize={pageLimit}
          style={{ marginTop: "20px", textAlign: "right" }}
          onChange={(newPage) => setPage(newPage)}
          onShowSizeChange={(current, limit) => setPageLimit(limit)}
        />
      </Card>
    </>
  );
};

export default UIStock;
