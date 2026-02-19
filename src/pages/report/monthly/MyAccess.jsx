/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Space,
  Card,
  message,
  DatePicker,
  Typography,
  Empty,
  Button,
  Table,
} from "antd";
import { SearchOutlined, PrinterFilled } from "@ant-design/icons";

import "./MyPage.css";
import dayjs from "dayjs";
import ReportService from "services/Report.service";

const { Title, Text } = Typography;

const numberCell = (value, record) => {
  if (record?.rowType === "planning") return "-";
  const n = Number(value) || 0;
  if (!n) return "-";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const UIMonthlyAccess = () => {
  const [data, setData] = useState([]);
  const [yearValue, setYearValue] = useState(dayjs());
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("year"),
    dayjs().endOf("year"),
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // const { Text } = Typography;

  // useEffect(() => {
  //   if (dateRange) {
  //     fetchStock();
  //   } else {
  //     setData([]);
  //   }
  // }, [dateRange]);

  const onYearChange = (date) => {
    if (!date) {
      setYearValue(null);
      setDateRange([]);
      return;
    }

    setYearValue(date);
    setDateRange([dayjs(date).startOf("year"), dayjs(date).endOf("year")]);
  };

  const columns = useMemo(() => {
    const monthCols = [
      { key: "jan", title: "JAN", dataIndex: "jan" },
      { key: "feb", title: "FEB", dataIndex: "feb" },
      { key: "mar", title: "MAR", dataIndex: "mar" },
      { key: "apr", title: "APR", dataIndex: "apr" },
      { key: "may", title: "MAY", dataIndex: "may" },
      { key: "jun", title: "JUN", dataIndex: "jun" },
      { key: "jul", title: "JUL", dataIndex: "jul" },
      { key: "aug", title: "AUG", dataIndex: "aug" },
      { key: "sep", title: "SEP", dataIndex: "sep" },
      { key: "oct", title: "OCT", dataIndex: "oct" },
      { key: "nov", title: "NOV", dataIndex: "nov" },
      { key: "dec", title: "DEC", dataIndex: "dec" },
    ].map((c) => ({
      ...c,
      align: "center",
      render: numberCell,
      width: 92,
    }));

    return [
      {
        title: "Product / Month",
        dataIndex: "product",
        key: "product",
        fixed: "left",
        width: 120,
        render: (v) => v,
      },
      ...monthCols,
      {
        title: "TOTAL",
        dataIndex: "total",
        key: "total",
        align: "center",
        width: 110,
        render: numberCell,
      },
    ];
  }, []);

  const fetchStock = async () => {
    if (!dateRange?.[0] || !dateRange?.[1]) {
      message.warning("กรุณาเลือกปี");
      return;
    }

    const reqData = {
      dateQuery: [
        dayjs(dateRange[0]).format("YYYY/MM/DD"),
        dayjs(dateRange[1]).format("YYYY/MM/DD"),
      ],
    };

    setIsLoading(true);
    try {
      const { data: resp } = await ReportService.MonthlyFinishBySize(reqData);
      const items = Array.isArray(resp?.items) ? resp.items : [];

      const sum = {
        jan: 0,
        feb: 0,
        mar: 0,
        apr: 0,
        may: 0,
        jun: 0,
        jul: 0,
        aug: 0,
        sep: 0,
        oct: 0,
        nov: 0,
        dec: 0,
        total: 0,
      };

      items.forEach((r) => {
        Object.keys(sum).forEach((k) => {
          sum[k] += Number(r?.[k]) || 0;
        });
      });

      const actualRow = { key: "#ACTUAL", product: "ACTUAL", rowType: "actual", ...sum };
      const planningRow = {
        key: "#PLANNING",
        product: "PLANNING",
        rowType: "planning",
        jan: null,
        feb: null,
        mar: null,
        apr: null,
        may: null,
        jun: null,
        jul: null,
        aug: null,
        sep: null,
        oct: null,
        nov: null,
        dec: null,
        total: null,
      };
      const diffRow = { key: "#DIFF", product: "DIFF.", rowType: "diff", ...sum };

      setData([
        ...items.map((it) => ({ ...it, rowType: "data" })),
        actualRow,
        planningRow,
        diffRow,
      ]);
    } catch (err) {
      setData([]);
      message.error(
        `[${err?.response?.data?.status ?? 500}] : ${err?.response?.data?.message ?? "เกิดข้อผิดพลาด"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    const y = yearValue ? dayjs(yearValue).year() : dayjs().year();
    const base =
      process.env.PUBLIC_URL ||
      (window.location.pathname.startsWith("/webpsi") ? "/webpsi" : "");
    const url = `${base}/monthly/finish-product-print/${y}`;
    const newWindow = window.open(url, "PSI_MONTHLY_FINISH_PRODUCT_PRINT");
    if (newWindow) {
      try {
        newWindow.focus();
      } catch (e) {}
    }
    if (!newWindow) {
      message.warning("Popup ถูกบล็อก กรุณาอนุญาตป๊อปอัปสำหรับไซต์นี้");
    }
  };

  return (
    <div className="monthly-report">
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Card bordered className="report-toolbar">
          <Row align="middle" gutter={[12, 12]}>
            <Col flex="auto">
              <Title level={4} style={{ margin: 0 }}>Monthly Finish Product (PSI) By Size</Title>
              <Text type="secondary">เลือกช่วงปี จากนั้นกดค้นหา</Text>
            </Col>
            <Col>
              <Space wrap>
                <DatePicker
                  style={{ width: 260 }}
                  picker="year"
                  format={"YYYY"}
                  onChange={onYearChange}
                  value={yearValue}
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={fetchStock} loading={isLoading}>
                  ค้นหา
                </Button>
                <Button icon={<PrinterFilled />} onClick={handlePrint} disabled={!data?.length}>
                  Print
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card className="table-card" style={{ height: "600px" }} bordered>
          {data && data.length > 0 ? (
            <Table
              className="monthly-finish-table"
              size="small"
              bordered
              rowKey={(record) => record.key}
              columns={columns}
              dataSource={data}
              loading={isLoading}
              pagination={false}
              scroll={{ x: "max-content" }}
              rowClassName={(record) => {
                if (record?.rowType === "actual") return "monthly-row-actual";
                if (record?.rowType === "planning") return "monthly-row-planning";
                if (record?.rowType === "diff") return "monthly-row-diff";
                return "";
              }}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text>กดค้นหาเพื่อแสดงรายงาน</Text>} />
          )}
        </Card>
      </Space>
    </div>
  );
};

export default UIMonthlyAccess;
