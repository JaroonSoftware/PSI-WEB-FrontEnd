import { Tag } from "antd";

export const METHOD = {
  GET: "get",
  POST: "post",
  DELETE: "delete",
  PATCH: "patch",
  PUT: "put",
};

export const sectionOption = [
  { label: "กลางวัน", value: "D" },
  { label: "กลางคืน", value: "N" },
];

export const qcOption = [
  { label: "ยังไม่ทดสอบ", value: "N" },
  { label: "ทดสอบแล้ว", value: "Y" },
];

export const SELECTOR_CUSTOMER = "CUSTOMER_SELECT";
export const SELECTOR_SELLER = "SELLER_SELECT";
export const SELECTOR_TRANSPORT = "TRANSPORT_SELECT";

export const REPORT_TYPE = {
  DAILY: "daily",
  MONTHLY: "monthly",
  STOCK_CARD: "stockCard",
  LOCATION: "location",
  BY_DATE: "byDate",
};

const PCW4_SPECIFICATION = [
  {
    procode: "FIX-1",
    charge: "SPECIFICATION",
    diameter: "+0.05",
    area: "12.26",
    tensile: "MIN",
    yield_str: "MIN",
    reverse: "MIN",
    indent: "0.05",
    elong: "MIN",
    u_weight: "96.90",
    tens_ld: "MIN",
    yield_ld: "MIN",
    camber: "MAX",
  },
  {
    procode: "FIX-2",
    diameter: "4.00",
    area: "TO",
    tensile: "180",
    yield_str: "154",
    re_area: "25-45",
    reverse: "3",
    indent: "TO",
    elong: "3.50",
    u_weight: "TO",
    tens_ld: 2274,
    yield_ld: 1886,
    camber: 30,
  },
  {
    procode: "FIX-3",
    diameter: "-0.05",
    area: "12.89",
    indent: "0.20",
    u_weight: "100.90",
  },
];

const PCW4_CRIMP_SPECIFICATION = [
  {
    procode: "FIX-1",
    charge: "SPECIFICATION",
    diameter: "+0.05",
    area: "12.26",
    tensile: "MIN",
    yield_str: "MIN",
    reverse: "MIN",
    indent: "0.40",
    elong: "MIN",
    u_weight: "96.90",
    tens_ld: "MIN",
    yield_ld: "MIN",
    camber: "MAX",
  },
  {
    procode: "FIX-2",
    diameter: "4.00",
    area: "TO",
    tensile: 180,
    yield_str: 154,
    re_area: "25-45",
    reverse: "3",
    indent: "TO",
    elong: "3.50",
    u_weight: "TO",
    tens_ld: 2274,
    yield_ld: 1886,
    camber: 30,
  },
  {
    procode: "FIX-3",
    diameter: "-0.05",
    area: "12.89",
    indent: "0.80",
    u_weight: "100.90",
  },
];

const PCW5_SPECIFICATION = [
  {
    procode: "FIX-1",
    charge: "SPECIFICATION",
    diameter: "+0.05",
    area: "19.25",
    tensile: "MIN",
    yield_str: "MIN",
    reverse: "MIN",
    indent: "0.05",
    elong: "MIN",
    u_weight: "150.90",
    tens_ld: "MIN",
    yield_ld: "MIN",
    camber: "MAX",
  },
  {
    procode: "FIX-2",
    diameter: "5.00",
    area: "TO",
    tensile: 180,
    yield_str: 154,
    re_area: "25-45",
    reverse: "3",
    indent: "TO",
    elong: "3.50",
    u_weight: "TO",
    tens_ld: 3537,
    yield_ld: 2936,
    camber: 30,
  },
  {
    procode: "FIX-3",
    diameter: "-0.05",
    area: "20.04",
    indent: "0.20",
    u_weight: "157.10",
  },
];

const PCW7_SPECIFICATION = [
  {
    procode: "FIX-1",
    charge: "SPECIFICATION",
    diameter: "+0.05",
    area: "37.95",
    tensile: "MIN",
    yield_str: "MIN",
    reverse: "MIN",
    indent: "0.10",
    elong: "MIN",
    u_weight: "297.70",
    tens_ld: "MIN",
    yield_ld: "MIN",
    camber: "MAX",
  },
  {
    procode: "FIX-2",
    diameter: "7.00",
    area: "TO",
    tensile: 170,
    yield_str: 141,
    re_area: "25-45",
    reverse: 3,
    indent: "TO",
    elong: "3.50",
    u_weight: "TO",
    tens_ld: 6555,
    yield_ld: 5443,
    camber: 30,
  },
  {
    procode: "FIX-3",
    diameter: "-0.05",
    area: "39.05",
    indent: "0.25",
    u_weight: "306.30",
  },
];

const PCW9_SPECIFICATION = [
  {
    procode: "FIX-1",
    charge: "SPECIFICATION",
    diameter: "+0.05",
    area: "62.94",
    tensile: "MIN",
    yield_str: "MIN",
    reverse: "MIN",
    indent: "0.15",
    elong: "MIN",
    u_weight: "491.80",
    tens_ld: "MIN",
    yield_ld: "MIN",
    camber: "MAX",
  },
  {
    procode: "FIX-2",
    diameter: "9.00",
    area: "TO",
    tens_ld: 9532,
    tensile: 149,
    yield_ld: 7625,
    yield_str: 119,
    reverse: "3",
    indent: "TO",
    elong: "3.50",
    camber: 30,
    re_area: "25-45",
    u_weight: "TO",
  },
  {
    procode: "FIX-3",
    diameter: "-0.05",
    area: "64.35",
    indent: "0.25",
    u_weight: "506.20",
  },
];

export const getFixedQcRow = (code) => {
  switch (code) {
    case "PCW42":
      return PCW4_SPECIFICATION;
    case "PCW43":
      return PCW4_CRIMP_SPECIFICATION;
    case "PCW52":
      return PCW5_SPECIFICATION;
    case "PCW72":
      return PCW7_SPECIFICATION;
    case "PCW90":
      return PCW9_SPECIFICATION;
    case "PCW92":
      return PCW9_SPECIFICATION;
    default:
      return PCW4_SPECIFICATION;
  }
};
