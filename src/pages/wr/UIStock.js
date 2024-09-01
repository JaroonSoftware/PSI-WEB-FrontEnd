import React, { useEffect, useState, useRef } from "react";
import { Card, Table, Button, DatePicker, Space } from "antd";
import { dateFormat } from "utils/utils";
import { PrinterFilled } from "@ant-design/icons";
import RwiService from "services/RwiService";
import { useReactToPrint } from "react-to-print";
import DocRemainingStock from "component/print/DocRemainingStock";

const UIStock = () => {
  const [data, setData] = useState([]);
  const [dateQuery, setDateQuery] = useState();
  const printRef = useRef();

  useEffect(() => {
    if (dateQuery) {
      fetchStock();
    } else {
      setData([]);
    }
  }, [dateQuery]);

  const fetchStock = () => {
    RwiService.getStock(dateQuery)
      .then(({ data }) => {
        let { items } = data;

        let obj = {};

        for (let i of items) {
          let key = i.vendor + "@" + i.productcode;

          if (!obj[key]) {
            obj[key] = {
              items: [],
              venCode: i.vendor,
              venName: i.ven_name,
              totalWeight: 0,
              totalQuantity: 0,
              remaining: 0,
              productCode: i.productcode,
            };
          }
          obj[key]["items"].push({ key: i.lc_no + "@" + i.charge_no, ...i });
          obj[key]["totalWeight"] += i.total_weight;
          obj[key]["totalQuantity"] += i.quantity;
          obj[key]["remaining"] += i.remaining;
        }
        console.log(obj);

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
            productCode: obj[k].productCode,
            remaining: obj[k].remaining,
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
    setDateQuery(dateString);
  };

  const printProcess = useReactToPrint({
    content: () => printRef.current,
  });

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
        record?.vendor ? rcv_date : <b>{record?.productCode}</b>,
    },
    {
      title: "ชื่อ Supplier",
      dataIndex: "ven_name",
      key: "ven_name",
      align: "center",
      render: (ven_name, record) =>
        record?.vendor && (
          <>
            <b style={{ color: "#0ea2d2" }}>[{record?.vendor}] </b> {ven_name}
          </>
        ),
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
      title: "คงเหลือ",
      dataIndex: "remaining",
      key: "remaining",
      align: "center",
      render: (remaining, record) =>
        record?.vendor ? (
          remaining?.toLocaleString()
        ) : (
          <b>{remaining?.toLocaleString()}</b>
        ),
    },
    {
      title: "น้ำหนัก",
      dataIndex: "total_weight",
      key: "total_weight",
      align: "right",
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
            <Button
              type="primary"
              key="print"
              onClick={printProcess}
              icon={<PrinterFilled />}
            >
              พิมพ์
            </Button>

            <DatePicker onChange={onChange} format={"YYYY/MM/DD"} />
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
          summary={(pageData) => {
            let totalQuantity = 0;
            let totalWeight = 0;
            let totalRemaining = 0;
            pageData.forEach(({ quantity, total_weight, remaining }) => {
              totalQuantity += quantity;
              totalWeight += total_weight;
              totalRemaining += remaining;
            });
            return (
              <Table.Summary.Row
                align="center"
                style={{ backgroundColor: "#fafafa" }}
              >
                <Table.Summary.Cell index={0}>
                  <b>สุทธิ</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={6}></Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={1}>
                  <b>{totalQuantity?.toLocaleString()}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} colSpan={1}>
                  <b>{totalRemaining?.toLocaleString()}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={4} colSpan={1}>
                  <b>{totalWeight?.toLocaleString()}</b>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />

        {data && (
          <div style={{ display: "none" }}>
            <DocRemainingStock
              ref={printRef}
              printData={data}
              columns={columns}
            />
          </div>
        )}
      </Card>
    </>
  );
};

export default UIStock;
