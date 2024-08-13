import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Table,
  Pagination,
  Button,
  Space,
  Input,
  DatePicker,
  Select,
} from "antd";
import { PrinterFilled } from "@ant-design/icons";
import { dateFormat } from "utils/utils";
import { COLUMN } from "context/column";
const { RangePicker } = DatePicker;

const UIIncomeInfo = () => {
  const [productList, setProductList] = useState([]);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {}, []);

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleChange = (value) => {
    console.log(value);
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
      title: "Charge No.",
      dataIndex: "charge_no",
      key: "charge_no",
    },
    {
      title: "L/C No.",
      dataIndex: "lc_no",
      key: "lc_no",
    },
    {
      title: "ชื่อ Supplier",
      dataIndex: "supp_name",
      key: "supp_name",
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
          <h1 style={{ fontSize: "18px" }}>Income Info</h1>
          <Space>
            <Select
              defaultValue="Test1"
              style={{
                width: 200,
              }}
              onChange={handleChange}
              options={[
                {
                  value: "Test1",
                  label: "Test1",
                },
                {
                  value: "Test2",
                  label: "Test2",
                },
                {
                  value: "Test3",
                  label: "Test3",
                },
              ]}
            />

            <RangePicker onChange={onChange} format={dateFormat} />

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

export default UIIncomeInfo;
