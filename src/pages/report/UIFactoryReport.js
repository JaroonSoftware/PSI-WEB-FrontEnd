import React, { useState, useEffect } from "react";
import { Table, Card, DatePicker, Button, Space } from "antd";
import OptionService from "services/Option.service.js";
import ReportService from "services/Report.service.js";
import dayjs from "dayjs";
import { formatMoney } from "utils/utils.js";
import { render } from "@testing-library/react";
const UIFactoryReport = () => {
  const [dataList, setDataList] = useState([]);
  const [date, setDate] = useState(dayjs());

  const masterProductList = [
    { code: "PCW43", productname: "C4.00", productcolumn: "PC Wire" },
    { code: "PCW42", productname: "4.00", productcolumn: "PC Wire" },
    { code: "PCW52", productname: "5.00", productcolumn: "PC Wire" },
    { code: "PCW72", productname: "7.00", productcolumn: "PC Wire" },
    { code: "PCW92", productname: "9.00", productcolumn: "PC Wire" },
    { code: "PCS93", productname: "9.30", productcolumn: "PC Strand" },
    { code: "PCS95", productname: "9.53", productcolumn: "PC Strand" },
    { code: "PCS127", productname: "12.70", productcolumn: "PC Strand" },
    { code: "CRD28", productname: "2.8", productcolumn: "Cold Drawn" },
    { code: "CRD30", productname: "3.0", productcolumn: "Cold Drawn" },
    { code: "CRD40", productname: "4.0", productcolumn: "Cold Drawn" },
    // เพิ่มรายการอื่นๆ ตามต้องการ
  ];

  const fetchReport = (value) => {
  let reqData = { dateQuery: value };

  ReportService.FactoryReport(reqData).then((res) => {
    if (res.status === 200) {
      // สร้าง map จาก code สำหรับข้อมูลที่ได้จาก SQL
      const sqlDataMap = {};
      res.data.items.forEach((item) => {
        sqlDataMap[item.code] = item;
      });
      // สร้าง dataList โดยวน masterProductList แล้วเติมข้อมูลจาก SQL ถ้ามี
      const addColumn = masterProductList.map((master) => ({
        ...master,
        ...sqlDataMap[master.code], // ถ้ามีข้อมูลจาก SQL จะถูกนำมาทับ
      }));

      // ฟังก์ชันรวมค่าทุกคอลัมน์
      const sumCols = (arr, cols) => {
        const result = {};
        cols.forEach((col) => {
          result[col] = arr.reduce((sum, item) => sum + (item[col] || 0), 0);
        });
        return result;
      };

      // รายชื่อคอลัมน์ที่ต้องการรวม
      const sumColumns = [
        "daily",
        "total_act",
        "actual",
        "sold_daily",
        "sold_total_act",
        "sold_actual",
        "stock",
        "no_test",
      ];

      // ผลรวมแต่ละกลุ่ม
      // Cold Drawn
      const coldDrawnStartIdx = addColumn.findIndex((item) => item.code === "CRD28");
      const coldDrawnEndIdx = addColumn.findIndex((item) => item.code === "CRD40");
      const coldDrawnArr = addColumn.slice(coldDrawnStartIdx, coldDrawnEndIdx + 1);
      const totalColdDrawn = sumCols(coldDrawnArr, sumColumns);
      addColumn.splice(coldDrawnEndIdx + 1, 0, {
        key: "total-coldrawn",
        productcolumn: "",
        productname: "Total",
        ...totalColdDrawn,
      });

      // PC Strand
      const pcStrandStartIdx = addColumn.findIndex((item) => item.code === "PCS93");
      const pcStrandEndIdx = addColumn.findIndex((item) => item.code === "PCS127");
      const pcStrandArr = addColumn.slice(pcStrandStartIdx, pcStrandEndIdx + 1);
      const totalPCStrand = sumCols(pcStrandArr, sumColumns);
      addColumn.splice(pcStrandEndIdx + 1, 0, {
        key: "total-pcstrand",
        productcolumn: "",
        productname: "Total",
        ...totalPCStrand,
      });

      // PC Wire
      const pcWireStartIdx = addColumn.findIndex((item) => item.code === "PCW43");
      const pcWireEndIdx = addColumn.findIndex((item) => item.code === "PCW92");
      const pcWireArr = addColumn.slice(pcWireStartIdx, pcWireEndIdx + 1);
      const totalPCWire = sumCols(pcWireArr, sumColumns);
      addColumn.splice(pcWireEndIdx + 1, 0, {
        key: "total-pcwire",
        productcolumn: "",
        productname: "Total",
        ...totalPCWire,
      });

      setDataList(addColumn);
    } else {
      console.error("Failed to fetch data:", res);
    }
  });
};

  useEffect(() => {
    // เรียกใช้ fetchReport เมื่อคอมโพเนนต์ถูกโหลด
    fetchReport(date);
  }, [date]);

  const columns = [
    {
      title: "ผลิตภัณฑ์",
      dataIndex: "productcolumn",
      key: "productcolumn",
      align: "center",
      colSpan: 2,
      onCell: (_, index) => {
        if (index === 0) {
          return {
            rowSpan: 6,
          };
        }
        if (index === 6 || index === 10) {
          return {
            rowSpan: 4,
          };
        }
        if (
          index === 1 ||
          index === 2 ||
          index === 3 ||
          index === 4 ||
          index === 5 ||
          index === 7 ||
          index === 8 ||
          index === 9 ||
          index === 11 ||
          index === 12 ||
          index === 13
        ) {
          return {
            rowSpan: 0,
          };
        }
        return {};
      },
    },
    {
      title: "ผลิตภัณฑ์2",
      dataIndex: "productname",
      key: "productname",
      align: "center",
      colSpan: 0,
    },
    {
      title: "รายงานการผลิต",
      children: [
        {
          title: "Daily",
          dataIndex: "daily",
          key: "daily",
          align: "center",
          render: (v) => {
            return v !== undefined && v !== null && v !== "" && v !== 0
              ? formatMoney(v, 0)
              : "-";
          },
        },
        {
          title: "Total Act.",
          dataIndex: "total_act",
          key: "total_act",
          align: "center",
          render: (v) => {
            return v !== undefined && v !== null && v !== "" && v !== 0
              ? formatMoney(v, 0)
              : "-";
          },
        },
        {
          title: "Actual",
          dataIndex: "actual",
          key: "actual",
          align: "center",
          render: (v) => {
            return v !== undefined && v !== null && v !== "" && v !== 0
              ? formatMoney(v, 0)
              : "-";
          },
        },
      ],
    },
    {
      title: "ยอดจ่ายสินค้า",
      children: [
        {
          title: "Date",
          dataIndex: "sold_daily",
          key: "sold_daily",
          align: "center",
          render: (v) => {
            return v !== undefined && v !== null && v !== "" && v !== 0
              ? formatMoney(v, 0)
              : "-";
          },
        },
        {
          title: "Month",
          dataIndex: "sold_total_act",
          key: "sold_total_act",
          align: "center",
          render: (v) => {
            return v !== undefined && v !== null && v !== "" && v !== 0
              ? formatMoney(v, 0)
              : "-";
          },
        },
        {
          title: "Previous Month",
          dataIndex: "sold_actual",
          key: "sold_actual",
          align: "center",
          render: (v) => {
            return v !== undefined && v !== null && v !== "" && v !== 0
              ? formatMoney(v, 0)
              : "-";
          },
        },
      ],
    },
    {
      title: "สินค้าคงเหลือ",
      children: [
        {
          title: "PSI",
          dataIndex: "stock",
          key: "stock",
          align: "center",
          render: (v) => {
            return v !== undefined && v !== null && v !== "" && v !== 0
              ? formatMoney(v, 0)
              : "-";
          },
        },
        {
          title: "No Test",
          dataIndex: "no_test",
          key: "no_test",
          align: "center",
          render: (v) => {
            return v !== undefined && v !== null && v !== "" && v !== 0
              ? formatMoney(v, 0)
              : "-";
          },
        },
      ],
    },
  ];

  return (
    <>
      <Card className="card-dashboard" style={{ minHeight: "800px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "18px" }}>Factory - Report</h1>
          <Space>
            <DatePicker
              onChange={(v) => {
                setDate(v);
              }}
              format={"YYYY/MM/DD"}
            />
          </Space>
        </div>

        <Table
          rowClassName={(record, idx) =>
            idx === 5 || idx === 9 || idx === 13 ? "table-row-light" : ""
          }
          dataSource={dataList}
          columns={columns}
          style={{ marginTop: "1rem" }}
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
          bordered
          summary={(pageData) => {
            // รวมเฉพาะแถวที่ productname === "Total"
            const totalRows = pageData.filter(
              (row) => row.productname === "Total"
            );

            // ฟังก์ชันรวมค่าทุกคอลัมน์
            const sumCol = (col) =>
              totalRows.reduce((sum, row) => sum + (row[col] || 0), 0);

            const grandTotalDaily = sumCol("daily");
            const grandTotalTotalAct = sumCol("total_act");
            const grandTotalActual = sumCol("actual");
            const grandTotalSoldDaily = sumCol("sold_daily");
            const grandTotalSoldTotalAct = sumCol("sold_total_act");
            const grandTotalSoldActual = sumCol("sold_actual");
            const grandTotalPsi = sumCol("psi");
            const grandTotalNoTest = sumCol("no_test");

            return (
              <Table.Summary.Row
                align="center"
                style={{ backgroundColor: "#fafafa" }}
              >
                <Table.Summary.Cell index={0} colSpan={2}>
                  <b>Grand Total</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <b>{grandTotalDaily.toLocaleString()}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <b>{grandTotalTotalAct.toLocaleString()}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <b>{grandTotalActual.toLocaleString()}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <b>{grandTotalSoldDaily.toLocaleString()}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <b>{grandTotalSoldTotalAct.toLocaleString()}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  <b>{grandTotalSoldActual.toLocaleString()}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  <b>{grandTotalPsi.toLocaleString()}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}>
                  <b>{grandTotalNoTest.toLocaleString()}</b>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </>
  );
};
export default UIFactoryReport;
