import React from "react";
import { Card, Table } from "antd";
const UIReportSaleMonthly = () => {
  const dataSource = [
    {
      key: "1",
      prodmonth: "Test",
      jan: "jan",
      feb: "feb",
      mar: "mar",
      apr: "apr",
      may: "may",
      jul: "jul",
      aug: "aug",
      sep: "sep",
      oct: "oct",
      nov: "nov",
      dec: "dec",
      total: "total",
    },
  ];

  const columns = [
    {
      title: "Product / Month",
      dataIndex: "prodmonth",
      key: "prodmonth",
    },
    {
      title: "JAN",
      dataIndex: "jan",
      key: "jan",
    },
    {
      title: "FEB",
      dataIndex: "feb",
      key: "feb",
    },
    {
      title: "MAR",
      dataIndex: "mar",
      key: "mar",
    },
    {
      title: "APR",
      dataIndex: "apr",
      key: "apr",
    },
    {
      title: "MAY",
      dataIndex: "may",
      key: "may",
    },
    {
      title: "JUL",
      dataIndex: "jul",
      key: "jul",
    },
    {
      title: "AUG",
      dataIndex: "aug",
      key: "aug",
    },
    {
      title: "SEP",
      dataIndex: "sep",
      key: "sep",
    },
    {
      title: "OCT",
      dataIndex: "oct",
      key: "oct",
    },
    {
      title: "NOV",
      dataIndex: "nov",
      key: "nov",
    },
    {
      title: "DEC",
      dataIndex: "dec",
      key: "dec",
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      key: "total",
    },
  ];

  return (
    <>
      <Card className="card-dashboard">
        <div>
          <h1 style={{ fontSize: "18px" }}>Sale - Monthly</h1>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          style={{ marginTop: "1rem" }}
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
        />
        ;
      </Card>
    </>
  );
};
export default UIReportSaleMonthly;
