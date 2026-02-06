import { EditableRow, EditableCell } from "../../table/TableEditAble";
import { formatMoney } from "../../../utils/utils";
import { dateFormat } from "utils/utils";
// import {
//   TagCalBom
// } from "../../../../components/badge-and-tag/ERP";

export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};

export const accessColumn = [
  {
    title: "ลำดับ",
    key: "index",
    dataIndex: "index",
    align: "center",
    width: "5%",
    render: (index, record) =>
      record?.sum_amount !== undefined ? "" : index + 1,
  },
  {
    title: "ขนาด",
    dataIndex: "size",
    key: "size",
    align: "center",
    render: (v, record) => {
      return record?.sum_amount !== undefined ? "" : formatMoney(v, 2);
    },
  },
  {
    title: "ชื่อลูกค้า",
    dataIndex: "customer_name",
    key: "customer_name",
    align: "center",
    render: (text, record) =>
      record?.isGrand ? <b>รวมทั้งสิ้น</b> : (record?.sum_amount !== undefined ? <b>รวม</b> : text),
    onCell: (record) => {
      if (record?.sum_amount !== undefined) {
        return {
          colSpan: 3, // merge customer + date + invoice
          style: { backgroundColor: "#c7f3c7" },
        };
      }
      return {};
    },
  },
  {
    title: "วันที่ขาย",
    dataIndex: "gdsdate",
    key: "gdsdate",
    align: "center",
    onCell: (record) =>
      record?.sum_amount !== undefined ? { colSpan: 0 } : {},
  },
  {
    title: "Invoice No.",
    dataIndex: "invno",
    key: "invno",
    align: "center",
    onCell: (record) =>
      record?.sum_amount !== undefined ? { colSpan: 0 } : {},
  },
  {
    title: "น้ำหนัก",
    dataIndex: "tot_unt",
    key: "tot_unt",
    align: "center",
    onCell: (record) =>
      record?.sum_amount !== undefined
        ? { style: { backgroundColor: "#fff4b3", fontWeight: 600 } }
        : {},
    render: (v) => {
      return formatMoney(v, 0);
    },
  },
  {
    title: "ราคา",
    dataIndex: "u_price",
    key: "u_price",
    align: "center",
    onCell: (record) =>
      record?.sum_amount !== undefined ? { colSpan: 1 } : {},
  },
  {
    title: "จำนวนเงิน",
    dataIndex: "remaining",
    key: "remaining",
    align: "center",
    render: (v, d) => {
      const isSum = d?.sum_amount !== undefined;
      const amount = isSum
        ? Number(d.sum_amount) || 0
        : (Number(d?.tot_unt) || 0) * (Number(d?.u_price) || 0);
      return formatMoney(amount, 2);
    },
    onCell: (record) =>
      record?.sum_amount !== undefined
        ? { style: { backgroundColor: "#fff4b3", fontWeight: 600 } }
        : {},
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
