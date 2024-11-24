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

        items.forEach((i, idx) => {
          let key = i.productcode;

          if (!obj[key]) {
            obj[key] = {
              items: [],
              venCode: i.vendor,
              venName: i.ven_name,
              totalSupWeight: 0,
              totalWeight: 0,
              totalQuantity: 0,
              remaining: 0,
              productCode: i.productcode,
            };
          }
          obj[key]["items"].push({
            index: idx,
            key: i.lc_no + "@" + i.charge_no,
            ...i,
          });
          obj[key]["totalSupWeight"] += i.total_sup_weight;
          obj[key]["totalWeight"] += i.total_weight;
          obj[key]["totalQuantity"] += i.quantity;
          obj[key]["remaining"] += i.remaining;
        });

        let arrayItem = [];
        let totalKeys = Object.keys(obj);

        for (let k of totalKeys) {
          arrayItem = [...arrayItem, ...obj[k].items];
          arrayItem.push({
            key: k + "#SUM",
            venCode: obj[k].venCode,
            venName: obj[k].venName,
            total_sup_weight: obj[k].totalSupWeight,
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

  const handlePrint = () => {
    if (dateQuery && data && dateQuery.length > 0 && data.length > 0) {
      printProcess();
    }
  };

  const columns = [
    {
      title: "ลำดับ",
      key: "index",
      dataIndex: "index",
      align: "center",
      width: "5%",
      render: (index, record) => (record?.vendor ? index + 1 : <b>รวม</b>),
    },
    {
      title: "วันที่รับ",
      dataIndex: "rcv_date",
      key: "rcv_date",
      align: "center",
      render: (rcv_date, record) =>
        record?.vendor ? dateFormat(rcv_date) : <b>{record?.productCode}</b>,
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
      title: "จำนวนรับเข้า",
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
    {
      title: "น้ำหนักจริง",
      dataIndex: "total_sup_weight",
      key: "total_sup_weight",
      align: "right",
      render: (total_sup_weight, record) =>
        record?.vendor ? (
          total_sup_weight ? (
            total_sup_weight.toLocaleString()
          ) : (
            0
          )
        ) : (
          <b>{total_sup_weight?.toLocaleString()}</b>
        ),
    },
  ];

  const columnsPrint = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "5%",
      render: (text, record, idx) =>
        record?.key === "#SUM_TOTAL" ? (
          <b>สุทธิ</b>
        ) : record?.vendor ? (
          idx + 1
        ) : (
          <b>รวม</b>
        ),
    },
    {
      title: "วันที่รับ",
      dataIndex: "rcv_date",
      key: "rcv_date",
      align: "center",
      render: (rcv_date, record) =>
        record?.vendor ? dateFormat(rcv_date) : <b>{record?.productCode}</b>,
    },
    {
      title: "ชื่อ Supplier",
      dataIndex: "ven_name",
      key: "ven_name",
      align: "center",
      render: (ven_name, record) =>
        record?.vendor && <b style={{ color: "#0ea2d2" }}>{ven_name}</b>,
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
      title: "จำนวนรับเข้า",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (quantity, record) =>
        record?.key === "#SUM_TOTAL" ? (
          <b>{record?.totalQuantity?.toLocaleString()}</b>
        ) : record?.vendor ? (
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
        record?.key === "#SUM_TOTAL" ? (
          <b>{record?.totalRemaining?.toLocaleString()}</b>
        ) : record?.vendor ? (
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
        record?.key === "#SUM_TOTAL" ? (
          <b>{record?.totalWeight?.toLocaleString()}</b>
        ) : record?.vendor ? (
          total_weight?.toLocaleString()
        ) : (
          <b>{total_weight?.toLocaleString()}</b>
        ),
    },
    // {
    //   title: "SUP",
    //   dataIndex: "total_sup_weight",
    //   key: "total_sup_weight",
    //   align: "right",
    //   render: (total_sup_weight, record) =>
    //     record?.vendor ? (
    //       total_sup_weight?.toLocaleString()
    //     ) : (
    //       <b>{total_sup_weight?.toLocaleString()}</b>
    //     ),
    // },
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
              onClick={handlePrint}
              icon={<PrinterFilled />}
            >
              พิมพ์
            </Button>

            <DatePicker onChange={onChange} format={"YYYY/MM/DD"} />
          </Space>
        </div>

        <Table
          rowClassName={(record) => !record.vendor && "table-row-light"}
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
            let totalSupWeight = 0;
            pageData.forEach(
              ({
                vendor,
                quantity,
                total_weight,
                remaining,
                total_sup_weight,
              }) => {
                if (vendor) {
                  totalQuantity += quantity;
                  totalWeight += total_weight;
                  totalRemaining += remaining;
                  totalSupWeight += total_sup_weight;
                }
              }
            );
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
                <Table.Summary.Cell align="right" index={4} colSpan={1}>
                  <b>{totalSupWeight?.toLocaleString()}</b>
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
              columns={columnsPrint}
              date={dateQuery}
            />
          </div>
        )}
      </Card>
    </>
  );
};

export default UIStock;
