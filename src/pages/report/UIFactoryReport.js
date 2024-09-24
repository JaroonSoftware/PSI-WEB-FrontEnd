import React, { useState } from "react";
import { Table, Card, DatePicker, Button, Space } from "antd";

const UIFactoryReport = () => {
  const [dataList, setDataList] = useState([]);

  const columns = [
    {
      title: "ผลิตภัณฑ์",
      dataIndex: "product",
      key: "product",
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
      dataIndex: "product2",
      key: "product2",
      align: "center",
      colSpan: 0,
    },
    {
      title: "รายงารการผลิต",
      children: [
        {
          title: "Daily",
          dataIndex: "daily",
          key: "daily",
          align: "center",
        },
        {
          title: "Total Act.",
          dataIndex: "total_act",
          key: "total_act",
          align: "center",
        },
        {
          title: "Actual",
          dataIndex: "actual",
          key: "actual",
          align: "center",
        },
      ],
    },
    {
      title: "ยอดจ่ายสินค้า",
      children: [
        {
          title: "Date",
          dataIndex: "date",
          key: "date",
          align: "center",
        },
        {
          title: "Month",
          dataIndex: "month",
          key: "month",
          align: "center",
        },
        {
          title: "Previous Month",
          dataIndex: "previous_month",
          key: "previous_month",
          align: "center",
        },
      ],
    },
    {
      title: "สินค้าคงเหลือ",
      children: [
        {
          title: "PSI",
          dataIndex: "psi",
          key: "psi",
          align: "center",
        },
        {
          title: "No Test",
          dataIndex: "no_test",
          key: "no_test",
          align: "center",
        },
      ],
    },
  ];

  const data = [
    {
      key: "1",
      product: "PC Wire",
      product2: "C4.00",
    },
    {
      key: "2",
      product2: "4.00",
    },
    {
      key: "3",
      product2: "5.00",
    },
    {
      key: "4",
      product2: "7.00",
    },
    {
      key: "5",
      product2: "9.00",
    },
    {
      key: "6",
      product2: "Total",
    },
    {
      key: "7",
      product: "PC Strand",
      product2: "9.30",
    },
    {
      key: "8",
      product2: "9.53",
    },
    {
      key: "9",
      product2: "12.70",
    },
    {
      key: "10",
      product2: "Total",
    },
    {
      key: "11",
      product: "Cold Drawn",
      product2: "2.8",
    },
    {
      key: "12",
      product2: "3.0",
    },
    {
      key: "13",
      product2: "4.0",
    },
    {
      key: "14",
      product2: "Total",
    },
  ];

  const footer = () => (
    <div>
      <strong>Grand Total</strong>
    </div>
  );

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
          rowClassName={(record, idx) =>
            idx === 5 || idx === 9 || idx === 13 ? "table-row-light" : ""
          }
          dataSource={data}
          columns={columns}
          style={{ marginTop: "1rem" }}
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
          bordered
          summary={(data) => {
            let totalQuantity = 0;
            let totalWeight = 0;
            let totalRemaining = 0;
            // data.forEach(({ quantity, total_weight, remaining }) => {
            //   totalQuantity += quantity;
            //   totalWeight += total_weight;
            //   totalRemaining += remaining;
            // });
            return (
              <Table.Summary.Row
                align="center"
                style={{ backgroundColor: "#fafafa" }}
              >
                <Table.Summary.Cell index={0}>
                  <b>Grand Total</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={1}>
                  <b>-</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} colSpan={1}>
                  <b>-</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} colSpan={1}>
                  <b>-</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} colSpan={1}>
                  <b>-</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} colSpan={1}>
                  <b>-</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} colSpan={1}>
                  <b>-</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} colSpan={1}>
                  <b>-</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9} colSpan={1}>
                  <b>-</b>
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
