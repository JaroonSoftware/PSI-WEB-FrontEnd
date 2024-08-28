import React from "react";
import { Table, Card } from "antd";

const UIFactoryReport = () => {
  const dataSource = [
    {
      key: "1",
      product: "Test",
      report_process: "1",
      total_pay: "2",
      procut_remain: "3",
    },
  ];

  const columns = [
    {
      title: "ผลิตภัณฑ์",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "รายงารการผลิต",
      dataIndex: "report_process",
      key: "report_process",
    },
    {
      title: "ยอดจ่ายสินค้า",
      dataIndex: "total_pay",
      key: "total_pay",
    },
    {
      title: "สินค้าคงเหลือ",
      dataIndex: "procut_remain",
      key: "procut_remain",
    },
  ];
  return (
    <>
      <Card className="card-dashboard">
        <div>
          <h1 style={{ fontSize: "18px" }}>Factory - Report</h1>
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
export default UIFactoryReport;
