import { formatMoney } from "utils/utils";

export const MONTHS = [
  { key: "m1", label: "ม.ค" },
  { key: "m2", label: "ก.พ" },
  { key: "m3", label: "มี.ค" },
  { key: "m4", label: "เม.ย" },
  { key: "m5", label: "พ.ค" },
  { key: "m6", label: "มิ.ย" },
  { key: "m7", label: "ก.ค" },
  { key: "m8", label: "ส.ค" },
  { key: "m9", label: "ก.ย" },
  { key: "m10", label: "ต.ค" },
  { key: "m11", label: "พ.ย" },
  { key: "m12", label: "ธ.ค" },
];

export const weight0 = (v) => {
  const n = Number(v) || 0;
  return n === 0 ? "" : formatMoney(n, 0);
};

/**
 * คอลัมน์รายงานยอดขายลูกค้าทั้งปี
 * @param {boolean} compact สำหรับหน้าพิมพ์ (แคบลง)
 */
export const accessColumn = (compact = false) => {
  const w = (a, b) => (compact ? b : a);

  return [
    {
      title: "NO",
      key: "no",
      align: "center",
      width: w(60, 38),
      fixed: compact ? undefined : "left",
      render: (_v, _r, idx) => idx + 1,
    },
    {
      title: "ผู้ขาย",
      dataIndex: "seller",
      key: "seller",
      width: w(130, 82),
      fixed: compact ? undefined : "left",
      ellipsis: true,
    },
    {
      title: "รหัส",
      dataIndex: "cusCode",
      key: "cusCode",
      align: "center",
      width: w(80, 52),
    },
    {
      title: "รายชื่อลูกค้า",
      dataIndex: "cusName",
      key: "cusName",
      width: w(260, 165),
      ellipsis: true,
    },
    ...MONTHS.map((m) => ({
      title: m.label,
      dataIndex: m.key,
      key: m.key,
      align: "right",
      width: w(92, 58),
      render: weight0,
    })),
    {
      title: "รวม",
      dataIndex: "total",
      key: "total",
      align: "right",
      width: w(110, 72),
      render: (v) => <b>{weight0(v)}</b>,
    },
  ];
};
