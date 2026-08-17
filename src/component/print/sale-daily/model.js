import { EditableRow, EditableCell } from "../../table/TableEditAble";
import { formatMoney } from "../../../utils/utils";
import { dateFormat } from "utils/utils";
// import {
//   TagCalBom
// } from "../../../../components/badge-and-tag/ERP";

export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};

/* คอลัมน์ของรายงานยอดขายรายวัน
   ใช้ร่วมกันระหว่างหน้าแสดงผลกับหน้าพิมพ์

   - หน้าแสดงผล: ส่ง onInvoiceClick เข้ามา เลข Invoice จะกดได้
   - หน้าพิมพ์  : ไม่ต้องส่ง เลข Invoice จะเป็นข้อความธรรมดา (ลิงก์บนกระดาษไม่มีประโยชน์) */
export const buildAccessColumn = ({ onInvoiceClick } = {}) => [
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
    render: (invno, record) => {
      // แถวรวมไม่มีเลขใบกำกับ และไม่ควรกดได้
      if (record?.sum_amount !== undefined || !invno) return invno;
      if (!onInvoiceClick) return invno;

      return (
        <a
          onClick={(e) => {
            e.stopPropagation();
            onInvoiceClick(invno, record);
          }}
        >
          {invno}
        </a>
      );
    },
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

/* เวอร์ชันสำหรับหน้าพิมพ์ (ไม่มีลิงก์) — คงชื่อเดิมไว้ให้โค้ดเก่าเรียกใช้ได้ */
export const accessColumn = buildAccessColumn();

/* คอลัมน์ "รายละเอียดลวดที่ขาย" ของใบกำกับหนึ่งใบ
   แถวรวมจะเว้นคอลัมน์ซ้ายว่างไว้ แล้วใส่คำว่า "รวม"/"รวมทั้งสิ้น"
   ในคอลัมน์ลักษณะลวด ให้ตรงกับฟอร์มเดิมที่ลูกค้าใช้อยู่ */
const blankOnSum = (render) => (v, record, idx) =>
  record?.isSum ? "" : render(v, record, idx);

export const invoiceDetailColumn = [
  {
    title: "ลำดับที่",
    dataIndex: "index",
    key: "index",
    align: "center",
    width: "7%",
    render: blankOnSum((index) => index + 1),
  },
  {
    title: "ขนาด",
    dataIndex: "diam",
    key: "diam",
    align: "center",
    render: blankOnSum((v) => formatMoney(v, 2)),
  },
  {
    title: "วันที่ขาย",
    dataIndex: "gdsdate",
    key: "gdsdate",
    align: "center",
    render: blankOnSum((v) => dateFormat(v)),
  },
  {
    title: "วันที่ผลิต",
    dataIndex: "pdate",
    key: "pdate",
    align: "center",
    render: blankOnSum((v) => dateFormat(v)),
  },
  {
    title: "Charge No.",
    dataIndex: "charge_no",
    key: "charge_no",
    align: "center",
    render: blankOnSum((v) => v),
  },
  {
    title: "Coil No.",
    dataIndex: "coil_no",
    key: "coil_no",
    align: "center",
    render: blankOnSum((v) => v),
  },
  {
    title: "ลักษณะลวด",
    dataIndex: "pass",
    key: "pass",
    align: "center",
    render: (pass, record) =>
      record?.isSum ? (
        <b>{record?.label}</b>
      ) : pass === "Y" ? (
        "ลวดดี"
      ) : (
        "No Test"
      ),
    onCell: (record) =>
      record?.isSum
        ? {
            style: {
              backgroundColor: record?.isGrand ? "#22c55e" : "#4ade80",
              color: "#0b3d20",
            },
          }
        : {},
  },
  {
    title: "น้ำหนัก",
    dataIndex: "weight",
    key: "weight",
    align: "right",
    render: (v, record) =>
      record?.isSum ? <b>{formatMoney(v, 0)}</b> : formatMoney(v, 0),
    onCell: (record) =>
      record?.isSum ? { style: { backgroundColor: "#fff44f" } } : {},
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
