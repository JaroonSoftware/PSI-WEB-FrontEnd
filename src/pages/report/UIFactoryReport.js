import React, { useState } from "react";
import { Table, Card, DatePicker, Button, Space } from "antd";

const UIFactoryReport = () => {
  const [dataList, setDataList] = useState([]);

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
            <DatePicker onChange={() => {}} format={"YYYY/MM/DD"} />
          </Space>
        </div>

        <Table
          dataSource={dataList}
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
export default UIFactoryReport;
