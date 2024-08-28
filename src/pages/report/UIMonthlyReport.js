import React from "react";
import { Card, Table } from "antd";

const UIMonthlyReport = () => {
  const dataSource = [
    {
      key: "1",
      month: "Test",
      week_no: "1",
      total: "2",
    },
  ];

  const columns = [
    {
      title: "MONTH",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "WEEK NO.",
      dataIndex: "week_no",
      key: "week_no",
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
          <h1 style={{ fontSize: "18px" }}>Monthly - Report</h1>
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
export default UIMonthlyReport;
