import {
  ImportOutlined,
  ExportOutlined,
  PrinterOutlined,
  SettingOutlined,
  FileDoneOutlined,
  AppstoreAddOutlined,
  ShopOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  UserOutlined,
  StockOutlined,
} from "@ant-design/icons";

export const nav = [
  { label: "WIRE ROD", key: "sub1", type: "sub" },
  {
    key: "1",
    icon: <AppstoreAddOutlined className="icon-menubar" />,
    label: "ข้อมูล Wire Rod",
    path: "/webpsi/wirerod",
  },
  {
    key: "2",
    icon: <FileDoneOutlined className="icon-menubar" />,
    label: "ข้อมูลการรับ",
    path: "/webpsi/wirerod/import",
  },
  {
    key: "3",
    icon: <FileDoneOutlined className="icon-menubar" />,
    label: "ข้อมูลการจ่าย",
    path: "/webpsi/wirerod/export",
  },
  {
    key: "4",
    icon: <StockOutlined className="icon-menubar" />,
    label: "สต๊อคคงเหลือ",
    path: "/webpsi/wirerod/stock",
  },
  {
    key: "5",
    icon: <FileTextOutlined className="icon-menubar" />,
    label: "รายงาน - การรับ",
    path: "/webpsi/wirerod/import-report",
  },
  {
    key: "6",
    icon: <FileTextOutlined className="icon-menubar" />,
    label: "รายงาน - อายุ",
    path: "/webpsi/wirerod/life-time-report",
  },
  { label: "รายงานภาพรวม", key: "sub2", type: "sub" },
  {
    key: "7",
    icon: <FileSearchOutlined className="icon-menubar" />,
    label: "Factory Report",
    path: "/webpsi/factory-report",
  },
  {
    key: "8",
    icon: <FileSearchOutlined className="icon-menubar" />,
    label: "Weekly Report",
    path: "/webpsi/weekly-report",
  },
  {
    key: "9",
    icon: <FileSearchOutlined className="icon-menubar" />,
    label: "Monthly Report",
    path: "/webpsi/monthly-report",
  },
  {
    key: "10",
    icon: <FileSearchOutlined className="icon-menubar" />,
    label: "Yearly Report",
    path: "/webpsi/yearly-report",
  },
  {
    key: "11",
    icon: <FileSearchOutlined className="icon-menubar" />,
    label: "QC Report",
    path: "/webpsi/qc-report",
  },
  { label: "รายงานยอดขาย", key: "sub3", type: "sub" },
  {
    key: "12",
    icon: <FileTextOutlined className="icon-menubar" />,
    label: "รายวัน",
    path: "/webpsi/daily-report",
  },
  {
    key: "13",
    icon: <FileTextOutlined className="icon-menubar" />,
    label: "วันที่ขาย",
    path: "/webpsi/date-report",
  },
  {
    key: "14",
    icon: <FileTextOutlined className="icon-menubar" />,
    label: "รายเดือน",
    path: "/webpsi/sale/report-monthly",
  },
  {
    key: "15",
    icon: <UserOutlined className="icon-menubar" />,
    label: "ลูกค้า 1",
    path: "/webpsi/sale/report-customer-1",
  },
  {
    key: "15",
    icon: <UserOutlined className="icon-menubar" />,
    label: "ลูกค้า 2",
    path: "/webpsi/sale/report-customer-2",
  },
  {
    key: "16",
    icon: <FileTextOutlined className="icon-menubar" />,
    label: "การสั่งซื้อปัจจุบัน",
    path: "/webpsi/",
  },
];
