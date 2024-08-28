import React, { useEffect, useState } from "react";
import { Card, Table, Button, DatePicker, Space } from "antd";
import { dateFormat } from "utils/utils";
import { PrinterFilled } from "@ant-design/icons";
import RwiService from "services/RwiService";

const UIStock = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = () => {
    RwiService.getStock()
      .then(({ data }) => {
        let { items } = data;

        let obj = {};

        for (let i of items) {
          let key = i.vendor;

          if (!obj[key]) {
            obj[key] = {
              items: [],
              venCode: key,
              venName: i.ven_name,
              totalWeight: 0,
              totalQuantity: 0,
            };
          }
          obj[key]["items"].push({ key: i.lc_no + "@" + i.charge_no, ...i });
          obj[key]["totalWeight"] += i.total_weight;
          obj[key]["totalQuantity"] += i.quantity;
        }

        let arrayItem = [];
        let totalKeys = Object.keys(obj);

        for (let k of totalKeys) {
          arrayItem = [...arrayItem, ...obj[k].items];
          arrayItem.push({
            key: k + "#SUM",
            venCode: obj[k].venCode,
            venName: obj[k].venName,
            total_weight: obj[k].totalWeight,
            quantity: obj[k].totalQuantity,
          });
        }

        // console.log(arrayItem);
        setData(arrayItem);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChange = (date, dateString) => {
    console.log(date);
  };

  const columns = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (text, record, idx) => (record?.vendor ? idx + 1 : <b>รวม</b>),
    },
    {
      title: "วันที่รับ",
      dataIndex: "rcv_date",
      key: "rcv_date",
      align: "center",
      render: (rcv_date, record) =>
        record?.vendor ? rcv_date : <b>[{record?.venCode}]</b>,
    },
    {
      title: "ชื่อ Supplier",
      dataIndex: "ven_name",
      key: "ven_name",
      align: "center",
      render: (ven_name, record) =>
        record?.vendor ? ven_name : <b>{record?.venName}</b>,
    },
    {
      title: "L/C No.",
      dataIndex: "lc_no",
      key: "lc_no",
      align: "center",
    },
    {
      title: "Charge No.",
      dataIndex: "charge_no",
      key: "charge_no",
      align: "center",
    },
    {
      title: "ขนาด",
      dataIndex: "size",
      key: "size",
      align: "center",
    },
    {
      title: "เกรด",
      dataIndex: "grade",
      key: "grade",
      align: "center",
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (quantity, record) =>
        record?.vendor ? (
          quantity?.toLocaleString()
        ) : (
          <b>{quantity?.toLocaleString()}</b>
        ),
    },
    {
      title: "น้ำหนัก",
      dataIndex: "total_weight",
      key: "total_weight",
      align: "center",
      render: (total_weight, record) =>
        record?.vendor ? (
          total_weight?.toLocaleString()
        ) : (
          <b>{total_weight?.toLocaleString()}</b>
        ),
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
            <DatePicker onChange={onChange} format={"DD/MM/YYYY"} />

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
          dataSource={data}
          columns={columns}
          style={{ marginTop: "1rem" }}
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
          bordered
        />
      </Card>
    </>
  );
};

export default UIStock;
