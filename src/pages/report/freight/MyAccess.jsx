/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
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
import { accessColumn, WEIGHT_COLUMNS, weight0 } from "./model";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const UIFreightReportAccess = () => {
  const [dateRange, setDateRange] = useState(() => [
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [trncode, setTrncode] = useState("");
  const [bandId, setBandId] = useState(null);

  const [transportList, setTransportList] = useState([]);
  const [bands, setBands] = useState([]);

  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [byTransport, setByTransport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    OptionService.TRANSPORT()
      .then(({ data }) => setTransportList(data?.items || []))
      .catch(() => {});
    OptionService.FUEL_BANDS()
      .then(({ data }) => setBands(data?.items || []))
      .catch(() => {});

    fetchReport();
  }, []);

  const fetchReport = async () => {
    if (!dateRange?.[0] || !dateRange?.[1]) {
      message.warning("กรุณาเลือกช่วงวันที่");
      return;
    }

    setLoading(true);
    try {
      const resp = await ReportService.FreightSummary({
        dateQuery: [
          dateRange[0].format("YYYY-MM-DD"),
          dateRange[1].format("YYYY-MM-DD"),
        ],
        trncode,
      });
      const items = resp?.data?.items || [];
      setData(items);
      setSummary(resp?.data?.summary || {});
      setByTransport(resp?.data?.byTransport || []);
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

    const date1 = dateRange[0].format("YYYY-MM-DD");
    const date2 = dateRange[1].format("YYYY-MM-DD");
    const band = bands.find((b) => b.band_id === bandId)?.band_label || "";

    const qs = new URLSearchParams();
    if (trncode) qs.set("trn", trncode);
    if (band) qs.set("band", band);

    const url = `${base}/freight-report-print/${date1}/${date2}${
      qs.toString() ? `?${qs.toString()}` : ""
    }`;

    const newWindow = window.open(url, "PSI_FREIGHT_PRINT");
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
        <Table.Summary.Cell index={0} colSpan={6} align="center">
          <b>รวมทั้งหมด</b>
        </Table.Summary.Cell>
        {WEIGHT_COLUMNS.map((c, i) => (
          <Table.Summary.Cell key={c.key} index={6 + i} align="right">
            <b>{weight0(summary[c.key])}</b>
          </Table.Summary.Cell>
        ))}
        <Table.Summary.Cell index={13} align="right">
          <b>{weight0(summary.w_total)}</b>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={14} colSpan={5} />
      </Table.Summary.Row>
    </Table.Summary>
  );

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <Card>
        <Row gutter={[8, 8]} align="middle">
          <Col xs={24} md={8} lg={7}>
            <RangePicker
              value={dateRange}
              onChange={(v) => setDateRange(v)}
              format="DD/MM/YYYY"
              allowClear={false}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={5} lg={4}>
            <Select
              value={trncode || undefined}
              onChange={(v) => setTrncode(v || "")}
              allowClear
              placeholder="ทุกบริษัทขนส่ง"
              style={{ width: "100%" }}
              options={(transportList || []).map((t) => ({
                value: t.trncode,
                label: t.name,
              }))}
            />
          </Col>
          <Col xs={24} sm={12} md={5} lg={4}>
            <Select
              value={bandId}
              onChange={setBandId}
              allowClear
              placeholder="เลทน้ำมัน (สำหรับพิมพ์)"
              style={{ width: "100%" }}
              options={(bands || []).map((b) => ({
                value: b.band_id,
                label: `${b.band_label} บาท/ลิตร`,
              }))}
            />
          </Col>
          <Col xs={24} md={6} lg={9}>
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
        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
          <Title level={4} style={{ margin: 0 }}>
            สรุปรายงานค่าขนส่ง
          </Title>
        </Flex>

        <Table
          rowKey="key"
          size="small"
          bordered
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={false}
          scroll={{ x: 2100, y: 540 }}
          summary={data.length ? summaryRow : undefined}
        />
      </Card>

      {byTransport.length > 0 && (
        <Card>
          <Title level={5} style={{ marginTop: 0 }}>
            สรุปตามบริษัทขนส่ง
          </Title>
          <Table
            rowKey="transport"
            size="small"
            bordered
            pagination={false}
            dataSource={byTransport}
            style={{ maxWidth: 620 }}
            columns={[
              { title: "บริษัทขนส่ง", dataIndex: "transport", key: "transport" },
              {
                title: "จำนวนเที่ยว",
                dataIndex: "trips",
                key: "trips",
                align: "right",
                width: 120,
              },
              {
                title: "น้ำหนักรวม (กก.)",
                dataIndex: "weight",
                key: "weight",
                align: "right",
                width: 160,
                render: weight0,
              },
              {
                title: "ค่าขนส่ง (บาท)",
                key: "cost",
                align: "right",
                width: 140,
                render: () => <span style={{ color: "#bfbfbf" }}>-</span>,
              },
            ]}
          />
        </Card>
      )}
    </Space>
  );
};

export default UIFreightReportAccess;
