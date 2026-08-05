import dayjs from "dayjs";
import { formatMoney } from "utils/utils";

export const WEIGHT_COLUMNS = [
  { key: "w_c400", label: "C4.00 mm." },
  { key: "w_400", label: "4.00 mm." },
  { key: "w_500", label: "5.00 mm." },
  { key: "w_700", label: "7.00 mm." },
  { key: "w_900", label: "9.00 mm." },
  { key: "w_crd", label: "CRD" },
  { key: "w_scrap", label: "เศษลวด" },
];

export const weight0 = (v) => {
  const n = Number(v) || 0;
  return n === 0 ? "" : formatMoney(n, 0);
};

const blank = () => <span style={{ color: "#bfbfbf" }}>-</span>;

export const money2 = (v) => {
  if (v === null || v === undefined || v === "") return "";
  return formatMoney(Number(v), 2);
};

/**
 * คอลัมน์รายงานค่าขนส่ง
 * @param {boolean} compact ใช้สำหรับหน้าพิมพ์ (คอลัมน์แคบลง)
 */
export const accessColumn = (compact = false) => {
  const w = (a, b) => (compact ? b : a);

  return [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: w(60, 45),
      render: (_v, _r, idx) => idx + 1,
    },
    {
      title: "เลขที่ใบจ่ายสินค้า",
      dataIndex: "gdspay",
      key: "gdspay",
      align: "center",
      width: w(130, 92),
    },
    {
      title: "วันที่",
      dataIndex: "gdsdate",
      key: "gdsdate",
      align: "center",
      width: w(105, 78),
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : ""),
    },
    {
      title: "เลขที่ใบกำกับภาษี",
      dataIndex: "taxNo",
      key: "taxNo",
      align: "center",
      width: w(130, 88),
    },
    {
      title: "รหัสลูกค้า",
      dataIndex: "cusCode",
      key: "cusCode",
      align: "center",
      width: w(95, 66),
    },
    {
      title: "ชื่อลูกค้า",
      dataIndex: "cusName",
      key: "cusName",
      width: w(240, 175),
      ellipsis: true,
    },
    ...WEIGHT_COLUMNS.map((c) => ({
      title: c.label,
      dataIndex: c.key,
      key: c.key,
      align: "right",
      width: w(95, 64),
      render: weight0,
    })),
    {
      title: "รวมน้ำหนัก",
      dataIndex: "w_total",
      key: "w_total",
      align: "right",
      width: w(110, 76),
      render: (v) => <b>{weight0(v)}</b>,
    },
    {
      title: "ขนส่ง",
      dataIndex: "transport",
      key: "transport",
      width: w(130, 88),
      ellipsis: true,
    },
    {
      title: "พขร.",
      dataIndex: "driver",
      key: "driver",
      align: "center",
      width: w(90, 62),
      render: (v) => v || blank(),
    },
    {
      title: "จังหวัด",
      dataIndex: "province",
      key: "province",
      width: w(140, 95),
      ellipsis: true,
    },
    {
      title: "ประเภทรถ",
      dataIndex: "carType",
      key: "carType",
      align: "center",
      width: w(100, 66),
      render: (v) => v || blank(),
    },
    {
      title: "เลทราคา",
      dataIndex: "rate",
      key: "rate",
      align: "right",
      width: w(105, 70),
      render: (v) => (v === null || v === undefined ? blank() : money2(v)),
    },
    {
      title: "ค่าขนส่ง",
      dataIndex: "cost",
      key: "cost",
      align: "right",
      width: w(115, 78),
      render: (v) =>
        v === null || v === undefined ? blank() : <b>{money2(v)}</b>,
    },
  ];
};
