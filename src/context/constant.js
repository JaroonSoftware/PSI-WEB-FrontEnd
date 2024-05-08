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
