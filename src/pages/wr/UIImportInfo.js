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
import RwiService from "services/RwiService";
import { useReactToPrint } from "react-to-print";
import DocImport from "component/print/DocImport";

const UIImportReport = () => {
  const [dataList, setDataList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [dateQuery, setDateQuery] = useState([]);
  const [currentVendor, setCurrentVendor] = useState();
  const printRef = useRef();

  const { RangePicker } = DatePicker;

  useEffect(() => {
    fetchVendor();
  }, []);

  useEffect(() => {
    if (dateQuery) fetchWireRod();
  }, [dateQuery, currentVendor]);

  const printProcess = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrint = () => {
    if (dateQuery && dataList && dateQuery.length > 0 && dataList.length > 0) {
      printProcess();
    }
  };
  const fetchWireRod = () => {
    let startDate = dateQuery[0];
    let endDate = dateQuery[1];

    if (!startDate || !endDate) return setDataList([]);

    RwiService.getImportWireRod({ startDate, endDate, vendor: currentVendor })
      .then(({ data }) => {
        let { items } = data;

        let obj = {};

        items.forEach((i, idx) => {
          let key = i.vendor + "@" + i.productcode;
          // let key = i.pdate

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

          obj[key]["items"].push({
            index: idx,
            key: i.lc_no + "@" + i.charge_no,
            ...i,
          });
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
            total_weight: obj[k].totalWeight,
            quantity: obj[k].totalQuantity,
            productCode: obj[k].productCode,
            remaining: obj[k].remaining,
          });
        }

        setDataList(arrayItem);
      })
      .catch((err) => console.log(err));
  };

  const fetchVendor = () => {
    RwiService.getVendor()
      .then(({ data }) => {
        let vList = data?.items.map((item) => ({
          value: item.vendor,
          label: item.ven_name,
        }));

        setVendorList(vList);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      title: "ลำดับ",
      key: "index",
      dataIndex: "index",
      align: "center",
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

  const columnsPrint = [
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
            <b style={{ color: "#0ea2d2" }}>{ven_name} </b>
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
          <h1 style={{ fontSize: "18px" }}>ข้อมูลการรับ Wire Rod</h1>
          <Space>
            <Button
              type="primary"
              key="print"
              onClick={handlePrint}
              icon={<PrinterFilled />}
            >
              พิมพ์
            </Button>
            <Select
              placeholder="ค้นหาแบบ ระบุผู้ขาย"
              style={{ width: 300 }}
              onChange={(value) => setCurrentVendor(value)}
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label.toLowerCase() ?? "").includes(
                  input.toLowerCase()
                )
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={vendorList}
            />

            <RangePicker
              name="timeQuery"
              onChange={(value) => {
                if (!value) value = [];
                setDateQuery(value);
              }}
              style={{ width: "230px" }}
              format={"DD/MM/YYYY"}
            />
          </Space>
        </div>

        <Table
          rowClassName={(record) => !record.vendor && "table-row-light"}
          dataSource={dataList}
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
            pageData.forEach(
              ({ vendor, quantity, total_weight, remaining }) => {
                if (vendor) {
                  totalQuantity += quantity;
                  totalWeight += total_weight;
                  totalRemaining += remaining;
                }
              }
            );
            return (
              <>
                <Table.Summary.Row
                  align={"center"}
                  style={{ backgroundColor: "#fafafa" }}
                >
                  <Table.Summary.Cell index={0}>
                    <b>สุทธิ</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={1}
                    colSpan={6}
                  ></Table.Summary.Cell>
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
              </>
            );
          }}
        />
        {dataList && (
          <div style={{ display: "none" }}>
            <DocImport
              ref={printRef}
              printData={dataList}
              columns={columnsPrint}
              date={dateQuery}
            />
          </div>
        )}
      </Card>
    </>
  );
};

export default UIImportReport;
