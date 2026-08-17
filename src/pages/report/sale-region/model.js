import { formatMoney } from "utils/utils";

/* คอลัมน์รายงานยอดขายตามภูมิภาค
   ใช้ทั้งหน้าจอและหน้าพิมพ์ ตัวเลขจะได้ตรงกัน

   โครงแถวมี 3 แบบ
     - isRegionHead : หัวกลุ่มของภาค
     - แถวปกติ      : 1 ลูกค้า
     - isSum        : รวมของภาค / รวมทั้งสิ้น */

const cellStyleFor = (record) => {
  if (record?.isGrand) {
    return { backgroundColor: "#bbf7d0", fontWeight: 700 };
  }
  if (record?.isSum) {
    return { backgroundColor: "#dcfce7", fontWeight: 600 };
  }
  if (record?.isRegionHead) {
    return { backgroundColor: "#dbeafe", fontWeight: 700, color: "#14346b" };
  }
  return {};
};

const onCellCommon = (record) => {
  const style = cellStyleFor(record);
  return Object.keys(style).length ? { style } : {};
};

export const regionColumn = [
  {
    title: "ลำดับ",
    dataIndex: "index",
    key: "index",
    align: "center",
    width: 70,
    render: (index, record) =>
      record?.isRegionHead || record?.isSum ? "" : index + 1,
    onCell: onCellCommon,
  },
  {
    title: "ภาค / ลูกค้า",
    dataIndex: "customer_name",
    key: "customer_name",
    render: (text, record) => {
      if (record?.isRegionHead) return <b>{record.region}</b>;
      if (record?.isSum) return <b>{record.label}</b>;
      return (
        <>
          <b style={{ color: "#0ea2d2" }}>[{record?.cusno}] </b>
          {text}
        </>
      );
    },
    onCell: (record) => {
      const base = onCellCommon(record);
      // หัวกลุ่มกินพื้นที่ยาว ๆ ให้ชื่อภาคเด่น
      if (record?.isRegionHead) {
        return { ...base, style: { ...base.style, paddingLeft: 12 } };
      }
      if (!record?.isSum) {
        return { ...base, style: { ...base.style, paddingLeft: 28 } };
      }
      return base;
    },
  },
  {
    title: "จำนวนลูกค้า",
    dataIndex: "customers",
    key: "customers",
    align: "center",
    width: 110,
    render: (v, record) => (record?.isRegionHead ? v : ""),
    onCell: onCellCommon,
  },
  {
    title: "จำนวนใบกำกับ",
    dataIndex: "invoices",
    key: "invoices",
    align: "center",
    width: 120,
    render: (v, record) =>
      record?.isRegionHead || record?.isSum ? "" : Number(v || 0).toLocaleString(),
    onCell: onCellCommon,
  },
  {
    title: "น้ำหนัก (กก.)",
    dataIndex: "total_weight",
    key: "total_weight",
    align: "right",
    width: 130,
    render: (v) => formatMoney(Number(v) || 0, 0),
    onCell: (record) => {
      const base = onCellCommon(record);
      if (record?.isSum) {
        return {
          style: { ...base.style, backgroundColor: "#fff4b3" },
        };
      }
      return base;
    },
  },
  {
    title: "จำนวนเงิน (บาท)",
    dataIndex: "total_amount",
    key: "total_amount",
    align: "right",
    width: 150,
    render: (v) => formatMoney(Number(v) || 0, 2),
    onCell: (record) => {
      const base = onCellCommon(record);
      if (record?.isSum) {
        return {
          style: { ...base.style, backgroundColor: "#fff4b3" },
        };
      }
      return base;
    },
  },
  {
    title: "สัดส่วน",
    dataIndex: "pct",
    key: "pct",
    align: "right",
    width: 90,
    render: (v, record) =>
      record?.isRegionHead ? "" : `${formatMoney(Number(v) || 0, 1)}%`,
    onCell: onCellCommon,
  },
];

export default regionColumn;
