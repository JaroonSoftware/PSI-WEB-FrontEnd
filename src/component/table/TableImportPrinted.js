import React from "react";
import { Table } from "antd";
import { dateFormat } from "utils/utils";

const TableImportPrinted = ({ data }) => {
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

  return (
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
        pageData.forEach(({ vendor, quantity, total_weight, remaining }) => {
          if (vendor) {
            totalQuantity += quantity;
            totalWeight += total_weight;
            totalRemaining += remaining;
          }
        });
        return (
          <>
            <Table.Summary.Row
              align={"center"}
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
          </>
        );
      }}
    />
  );
};

export default TableImportPrinted;
