/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Row,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PiPrinterFill } from "react-icons/pi";
import dayjs from "dayjs";

import ReportService from "services/Report.service";
import OptionService from "services/Option.service";
import { accessColumn, MONTHS, weight0 } from "./model";

const { Title } = Typography;

const UICustomerYearlyAccess = () => {
  const [year, setYear] = useState(dayjs());
  const [saleno, setSaleno] = useState("");
  const [onlyWithSales, setOnlyWithSales] = useState(true);

  const [sellers, setSellers] = useState([]);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [bySeller, setBySeller] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    OptionService.SELLER()
      .then(({ data }) => setSellers(data?.items || []))
      .catch(() => {});

    fetchReport();
  }, []);

  const fetchReport = async () => {
    if (!year) {
      message.warning("กรุณาเลือกปี");
      return;
    }

    setLoading(true);
    try {
      const resp = await ReportService.CustomerYearlySales({
        year: year.year(),
        saleno,
        onlyWithSales,
      });
      const items = resp?.data?.items || [];
      setData(items);
      setSummary(resp?.data?.summary || {});
      setBySeller(resp?.data?.bySeller || []);
      if (!items.length) message.info("ไม่พบข้อมูล");
    } catch (err) {
      console.log(err);
      message.error("ดึงข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const openPrint = () => {
    if (!data || data.length === 0) {
      message.warning("ยังไม่มีข้อมูลสำหรับพิมพ์");
      return;
    }

    const base =
      process.env.PUBLIC_URL ||
      (window.location.pathname.startsWith("/webpsi") ? "/webpsi" : "");

    const qs = new URLSearchParams();
    if (saleno) qs.set("saleno", saleno);
    if (onlyWithSales) qs.set("only", "1");

    const url = `${base}/customer-yearly-print/${year.year()}${
      qs.toString() ? `?${qs.toString()}` : ""
    }`;

    const newWindow = window.open(url, "PSI_CUSTOMER_YEARLY_PRINT");
    if (newWindow) {
      try {
        newWindow.focus();
      } catch (e) {}
    } else {
      message.warning("Popup ถูกบล็อก กรุณาอนุญาตป๊อปอัปสำหรับไซต์นี้");
    }
  };

  const columns = useMemo(() => accessColumn(false), []);

  const summaryRow = () => (
    <Table.Summary fixed>
      <Table.Summary.Row style={{ background: "#fafafa" }}>
        <Table.Summary.Cell index={0} colSpan={4} align="center">
          <b>รวม</b>
        </Table.Summary.Cell>
        {MONTHS.map((m, i) => (
          <Table.Summary.Cell key={m.key} index={4 + i} align="right">
            <b>{weight0(summary[m.key])}</b>
          </Table.Summary.Cell>
        ))}
        <Table.Summary.Cell index={16} align="right">
          <b>{weight0(summary.total)}</b>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <Card>
        <Row gutter={[8, 8]} align="middle">
          <Col xs={24} sm={8} md={4}>
            <DatePicker
              picker="year"
              value={year}
              onChange={(v) => setYear(v)}
              allowClear={false}
              style={{ width: "100%" }}
              placeholder="เลือกปี"
            />
          </Col>
          <Col xs={24} sm={10} md={5}>
            <Select
              value={saleno || undefined}
              onChange={(v) => setSaleno(v || "")}
              allowClear
              placeholder="พนักงานขายทั้งหมด"
              style={{ width: "100%" }}
              options={(sellers || []).map((s) => ({
                value: s.saleno,
                label: `${s.namesale ?? ""} ${s.lastname ?? ""}`.trim(),
              }))}
            />
          </Col>
          <Col xs={24} sm={6} md={5}>
            <Checkbox
              checked={onlyWithSales}
              onChange={(e) => setOnlyWithSales(e.target.checked)}
            >
              แสดงเฉพาะที่มียอดขาย
            </Checkbox>
          </Col>
          <Col xs={24} md={10}>
            <Flex gap={8}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={fetchReport}
                loading={loading}
              >
                ค้นหา
              </Button>
              <Button
                icon={<PiPrinterFill style={{ fontSize: "1.1rem" }} />}
                onClick={openPrint}
              >
                พิมพ์รายงาน
              </Button>
            </Flex>
          </Col>
        </Row>
      </Card>

      <Card>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 12 }}
          wrap="wrap"
        >
          <Title level={4} style={{ margin: 0 }}>
            สรุปลูกค้าแต่ละรายทั้งปี {year ? year.year() : ""}
          </Title>
          <span style={{ color: "#8c8c8c" }}>
            {data.length.toLocaleString()} ราย
          </span>
        </Flex>

        <Table
          rowKey="key"
          size="small"
          bordered
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={false}
          scroll={{ x: 1800, y: 540 }}
          summary={data.length ? summaryRow : undefined}
        />
      </Card>

      {bySeller.length > 0 && (
        <Card>
          <Title level={5} style={{ marginTop: 0 }}>
            สรุปตามพนักงานขาย
          </Title>
          <Table
            rowKey="seller"
            size="small"
            bordered
            pagination={false}
            dataSource={bySeller}
            style={{ maxWidth: 560 }}
            columns={[
              { title: "พนักงานขาย", dataIndex: "seller", key: "seller" },
              {
                title: "จำนวนลูกค้า",
                dataIndex: "customers",
                key: "customers",
                align: "right",
                width: 130,
              },
              {
                title: "ยอดรวม (กก.)",
                dataIndex: "total",
                key: "total",
                align: "right",
                width: 160,
                render: (v) => <b>{weight0(v)}</b>,
              },
            ]}
          />
        </Card>
      )}
    </Space>
  );
};

export default UICustomerYearlyAccess;
