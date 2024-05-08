import {
  ImportOutlined,
  ExportOutlined,
  PrinterOutlined,
  SettingOutlined,
  FileDoneOutlined,
  AppstoreAddOutlined,
  ShopOutlined,
} from "@ant-design/icons";

export const nav = [
  { label: "PRODUCT", key: "sub1", type: "sub" },
  {
    key: "1",
    icon: <AppstoreAddOutlined className="icon-menubar" />,
    label: "รายการสินค้า",
    path: "/psi/product",
  },
  { label: "QC", key: "sub2", type: "sub" },
  {
    key: "2",
    icon: <FileDoneOutlined className="icon-menubar" />,
    label: "ตรวจสอบสินค้า",
    path: "/psi/qc",
  },
  { label: "SALE ORDER", key: "sub3", type: "sub" },
  {
    key: "3",
    icon: <ShopOutlined className="icon-menubar" />,
    label: "ใบอนุมัติจ่าย",
    path: "/psi/sale-order",
  },
  {
    key: "4",
    icon: <ShopOutlined className="icon-menubar" />,
    label: "ใบส่งของ",
    path: "/psi/invoice",
  },
  { label: "ACCOUNT", key: "sub4", type: "sub" },
  {
    key: "5",
    icon: <ShopOutlined className="icon-menubar" />,
    label: "ใบกำกับภาษี",
    path: "/psi/tax-invoice",
  },
  { label: "WIREROD", key: "sub5", type: "sub" },
  {
    key: "6",
    icon: <ImportOutlined className="icon-menubar" />,
    label: "รายการนำเข้า",
    path: "/psi/wr/import",
  },
  {
    key: "7",
    icon: <PrinterOutlined className="icon-menubar" />,
    label: "พิมพ์ Tags Wirerod",
    path: "/psi/wr/print",
  },
  {
    key: "8",
    icon: <ExportOutlined className="icon-menubar" />,
    label: "รายการเบิก",
    path: "/psi/wr/export",
  },
  { label: "SYSTEM", key: "sub6", type: "sub" },
  {
    key: "9",
    icon: <SettingOutlined className="icon-menubar" />,
    label: "ตั้งค่าระบบ",
    path: "/psi/setting",
  },
];
