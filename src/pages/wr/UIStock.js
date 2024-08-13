import React, { useEffect, useState } from "react";
import { Card, Table, Button, DatePicker, Space } from "antd";
import { dateFormat } from "utils/utils";
import { PrinterFilled } from "@ant-design/icons";

const UIStock = () => {
  const [productList, setProductList] = useState([]);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {}, []);

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const dataSource = [
    {
      key: "1",
      get_date: "Test",
      supp_name: "1",
      lc_no: "2",
      charge_no: "3",
      size: "4",
      grade: "5",
      amount: "6",
      weight: "7",
    },
  ];

  const columns = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
    },
    {
      title: "วันที่รับ",
      dataIndex: "get_date",
      key: "get_date",
    },
    {
      title: "ชื่อ Supplier",
      dataIndex: "supp_name",
      key: "supp_name",
    },
    {
      title: "L/C No.",
      dataIndex: "lc_no",
      key: "lc_no",
    },
    {
      title: "Charge No.",
      dataIndex: "charge_no",
      key: "charge_no",
    },
    {
      title: "ขนาด",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "เกรด",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "จำนวน",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "น้ำหนัก",
      dataIndex: "weight",
      key: "weight",
    },
  ];

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
            <DatePicker onChange={onChange} format={dateFormat} />

            <Button
              type="primary"
              style={{
                width: "100%",
                maxWidth: "138px",
                margin: "0",
                backgroundColor: "#ffc107",
              }}
              onClick={() => {}}
            >
              แสดงรายงาน
            </Button>
          </Space>
        </div>

        <Table
          dataSource={dataSource}
          columns={columns}
          style={{ marginTop: "1rem" }}
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
        />
      </Card>
    </>
  );
};

export default UIStock;
