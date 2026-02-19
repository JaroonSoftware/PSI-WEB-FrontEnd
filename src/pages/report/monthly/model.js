
import {
  EditableRow,
  EditableCell,
} from "../../../component/table/TableEditAble";
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
      title: "จำนวนรับเข้า",
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
    {
      title: "น้ำหนักเฉลี่ย",
      dataIndex: "total_sup_weight",
      key: "total_sup_weight",
      align: "right",
      render: (total_sup_weight, record) =>
        record?.vendor ? (
          total_sup_weight ? (
            total_sup_weight.toLocaleString()
          ) : (
            0
          )
        ) : (
          <b>{total_sup_weight?.toLocaleString()}</b>
        ),
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
    render: (t, v) => (formatMoney(Number(v.qty), 2)),
  },
  {
    title: "จำนวนขาด/เกิน",
    align: "left",
    key: "diff",
    dataIndex: "diff",
    width: 140,
    render: (t, v) => (formatMoney(Number(v.stock) - Number(v.qty), 2)),
  },
  {
    title: "หน่วย",
    align: "center",
    key: "unit",
    dataIndex: "unit",
    width: 140,
  },
];


