import { dateFormat, formatMoney } from "utils/utils";
// import {
//   TagCalBom
// } from "../../../../components/badge-and-tag/ERP";

export const accessColumn = [
  {
    title: "วันที่",
    dataIndex: "trx_date",
    key: "trx_date",
    align: "center",
    width: 80,
    render: (v, record) => {
      if (record?.isHeader) return <b>{record?.productcode}</b>;
      if (!v) return "";
      return dateFormat(v);
    },
    onCell: (record) => {
      if (record?.isHeader) {
        return { colSpan: 6, style: { fontWeight: 600, backgroundColor: "#f5f5f5" } };
      }
      return {};
    },
  },
  {
    title: "ใบสำคัญ",
    dataIndex: "doc_no",
    key: "doc_no",
    align: "center",
    width: 100,
    onCell: (record) => (record?.isHeader ? { colSpan: 0 } : {}),
  },
  {
    title: "รายการ",
    dataIndex: "description",
    key: "description",
    onCell: (record) => (record?.isHeader ? { colSpan: 0 } : {}),
    render: (v, record) => {
      if (record?.isTotal) return <b>{v}</b>;
      if (record?.isOpening) return <b>{v}</b>;
      return v;
    },
  },
  {
    title: "รับ",
    dataIndex: "rcv_weight",
    key: "rcv_weight",
    align: "right",
    width: 100,
    onCell: (record) => (record?.isHeader ? { colSpan: 0 } : {}),
    render: (v, record) => (record?.isTotal ? <b>{formatMoney(v || 0, 0)}</b> : formatMoney(v || 0, 0)),
  },
  {
    title: "จ่าย",
    dataIndex: "iss_weight",
    key: "iss_weight",
    align: "right",
    width: 100,
    onCell: (record) => (record?.isHeader ? { colSpan: 0 } : {}),
    render: (v, record) => (record?.isTotal ? <b>{formatMoney(v || 0, 0)}</b> : formatMoney(v || 0, 0)),
  },
  {
    title: "คงเหลือ",
    dataIndex: "balance",
    key: "balance",
    align: "right",
    width: 100,
    onCell: (record) => (record?.isHeader ? { colSpan: 0 } : {}),
    render: (v, record) => (record?.isTotal || record?.isOpening ? <b>{formatMoney(v || 0, 0)}</b> : formatMoney(v || 0, 0)),
  },
];

export const materialColumn = ({}) => [
  {
    title: "รหัส วัตถุดิบ",
    dataIndex: "mat_code",
    key: "mat_code",
    sorter: (a, b) => (a?.mat_code || "").localeCompare(b?.mat_code || ""),
    width: 140,
  },
  {
    title: "ชื่อวัตถุดิบ",
    dataIndex: "mat_name",
    key: "mat_name",
  },
  // {
  //   title: "รหัสวัตถุดิบหลัก",
  //   dataIndex: "parent_item_code",
  //   key: "parent_item_code",
  //   width: 300,
  // },
  {
    title: "Stock",
    align: "left",
    key: "stock",
    dataIndex: "stock",
    width: 140,
  },
  {
    title: "จำนวนต้องการ",
    align: "left",
    key: "qty",
    dataIndex: "qty",
    width: 140,
    render: (t, v) => formatMoney(Number(v.qty), 2),
  },
  {
    title: "จำนวนขาด/เกิน",
    align: "left",
    key: "diff",
    dataIndex: "diff",
    width: 140,
    render: (t, v) => formatMoney(Number(v.stock) - Number(v.qty), 2),
  },
  {
    title: "หน่วย",
    align: "center",
    key: "unit",
    dataIndex: "unit",
    width: 140,
  },
];
