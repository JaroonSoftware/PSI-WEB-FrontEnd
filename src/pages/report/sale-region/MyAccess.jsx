/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
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
  Radio,
  Select,
  Statistic,
  Spin,
  Alert,
} from "antd";
import {
  SearchOutlined,
  PrinterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import "./MyPage.css";
import ReportService from "services/Report.service";
import { REGION_OPTIONS } from "context/constant";
import { formatMoney } from "utils/utils";
import { regionColumn } from "./model";
import { buildRegionRows } from "./transform";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const PRODUCT_LABEL = { all: "ทั้งหมด", pcw: "PCW", pcs: "PCS", crd: "CRD" };

const DEFAULT_PRODUCT = "all";
const defaultDateRange = () => [dayjs().startOf("year"), dayjs().endOf("year")];

const emptySummary = {
  weight: 0,
  amount: 0,
  customers: 0,
  regions: 0,
  unspecifiedAmount: 0,
  unspecifiedPct: 0,
  unspecifiedCustomers: 0,
};

const UISaleRegionAccess = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [product, setProduct] = useState(DEFAULT_PRODUCT);
  const [region, setRegion] = useState("");
  const [dateRange, setDateRange] = useState(defaultDateRange);

  /* เงื่อนไขที่ค้นหาไปแล้วจริง ๆ แยกจาก state ของฟอร์ม
     กันกรณีเปลี่ยนตัวกรองแล้วกดพิมพ์ทันที จะได้ไม่พิมพ์คนละชุดกับที่เห็น */
  const [printParams, setPrintParams] = useState(null);

  const onSearch = () => {
    if (!dateRange?.[0] || !dateRange?.[1]) {
      message.warning("กรุณาเลือกช่วงวันที่");
      return;
    }

    setLoading(true);
    setSearched(true);

    /* ใช้ขีดคั่น ไม่ใช้ทับ เพราะค่านี้ถูกส่งต่อไปเป็นส่วนหนึ่งของ URL หน้าพิมพ์
       ถ้าเป็น YYYY/MM/DD จะกลายเป็น 3 segment แล้ว route ไม่ match
       ฝั่ง backend เรียก dateFormat() แปลงกลับเป็น YYYY/MM/DD ให้อยู่แล้ว */
    const date1 = dateRange[0].format("YYYY-MM-DD");
    const date2 = dateRange[1].format("YYYY-MM-DD");

    ReportService.SalesByRegion({
      dateQuery: [date1, date2],
      pdCodeQuery: product,
      region,
    })
      .then(({ data: res }) => {
        const items = res?.items ?? [];
        const built = buildRegionRows(items);

        setData(items.length ? built.rows : []);
        setSummary({
          weight: built.grandWeight,
          amount: built.grandAmount,
          customers: built.grandCustomers,
          regions: built.regionCount,
          unspecifiedAmount: built.unspecifiedAmount,
          unspecifiedPct: built.unspecifiedPct,
          unspecifiedCustomers: built.unspecifiedCustomers,
        });
        setPrintParams({ product, region, date1, date2 });

        if (!items.length) message.info("ไม่พบข้อมูลในช่วงวันที่ที่เลือก");
      })
      .catch((err) => {
        console.log(err);
        setData([]);
        setSummary(emptySummary);
        setPrintParams(null);
        message.error(
          err?.response?.data?.message ?? "ดึงข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"
        );
      })
      .finally(() => setLoading(false));
  };

  const onClearSearch = () => {
    setProduct(DEFAULT_PRODUCT);
    setRegion("");
    setDateRange(defaultDateRange());
    setData([]);
    setSummary(emptySummary);
    setPrintParams(null);
    setSearched(false);
  };

  const onPrint = () => {
    if (!printParams) return;

    const base =
      process.env.PUBLIC_URL ||
      (window.location.pathname.startsWith("/webpsi") ? "/webpsi" : "");

    const { product: p, region: r, date1, date2 } = printParams;
    const url =
      `${base}/sale/region-report-print/${p}/${date1}/${date2}` +
      `?region=${encodeURIComponent(r || "")}`;

    const newWindow = window.open(url, "PSI_SALE_REGION_PRINT");
    if (!newWindow) {
      message.warning("Popup ถูกบล็อก กรุณาอนุญาตป๊อปอัปสำหรับไซต์นี้");
      return;
    }
    try {
      newWindow.focus();
    } catch (e) {}
  };

  const hasData = data.length > 0;

  return (
    <div className="region-report">
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Card bordered className="report-toolbar">
          <Row align="middle" gutter={[12, 12]}>
            <Col flex="auto">
              <Title level={4} style={{ margin: 0 }}>
                รายงานยอดขายตามภูมิภาค
              </Title>
              <Text type="secondary">
                ภาคอ้างอิงจากข้อมูลลูกค้า (ที่อยู่ 1) กดค้นหาเพื่อดูข้อมูล
                แล้วจึงกดพิมพ์รายงาน
              </Text>
            </Col>
          </Row>

          <Row align="middle" gutter={[12, 12]} style={{ marginTop: 12 }}>
            <Col flex="auto">
              <Space wrap>
                <Radio.Group
                  onChange={(e) => setProduct(e.target.value)}
                  value={product}
                >
                  <Radio value="all">ทั้งหมด</Radio>
                  <Radio value="pcw">PCW</Radio>
                  <Radio value="pcs">PCS</Radio>
                  <Radio value="crd">CRD</Radio>
                </Radio.Group>

                <Select
                  style={{ width: 220 }}
                  placeholder="ทุกภาค"
                  allowClear
                  value={region || undefined}
                  onChange={(v) => setRegion(v ?? "")}
                  options={REGION_OPTIONS}
                />

                <RangePicker
                  style={{ width: 260 }}
                  format={"DD/MM/YYYY"}
                  onChange={(d) => setDateRange(d)}
                  value={dateRange}
                />
              </Space>
            </Col>
            <Col>
              <Space wrap>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={onSearch}
                  loading={loading}
                >
                  ค้นหา
                </Button>
                <Button
                  icon={<PrinterOutlined />}
                  onClick={onPrint}
                  disabled={!hasData || loading}
                >
                  พิมพ์รายงาน
                </Button>
                <Button
                  danger
                  icon={<ClearOutlined />}
                  onClick={onClearSearch}
                  disabled={loading}
                >
                  ล้าง
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {hasData && summary.unspecifiedCustomers > 0 && (
          <Alert
            type="warning"
            showIcon
            message={`มียอดขาย ${formatMoney(
              summary.unspecifiedAmount,
              2
            )} บาท (${formatMoney(
              summary.unspecifiedPct,
              1
            )}%) จากลูกค้า ${summary.unspecifiedCustomers} ราย ที่ยังไม่ได้ระบุภาค`}
            description="ยอดกลุ่มนี้แสดงอยู่ท้ายตารางในชื่อ (ยังไม่ได้ระบุ) เมื่อกรอกภาคในหน้าข้อมูลลูกค้าครบแล้ว ตัวเลขจะย้ายไปอยู่ในภาคที่ถูกต้องเอง"
          />
        )}

        {hasData && (
          <Card bordered className="report-summary">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={7}>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  ประเภทสินค้า / ช่วงวันที่
                </Text>
                <div style={{ fontSize: 16, marginTop: 4 }}>
                  <b>{PRODUCT_LABEL[printParams?.product] ?? "-"}</b>
                  {" · "}
                  {dayjs(printParams?.date1).format("DD/MM/YYYY")}
                  {" - "}
                  {dayjs(printParams?.date2).format("DD/MM/YYYY")}
                </div>
              </Col>
              <Col xs={12} sm={4}>
                <Statistic title="จำนวนภาค" value={summary.regions} />
              </Col>
              <Col xs={12} sm={4}>
                <Statistic title="จำนวนลูกค้า" value={summary.customers} />
              </Col>
              <Col xs={12} sm={4}>
                <Statistic
                  title="น้ำหนักรวม (กก.)"
                  value={summary.weight}
                  formatter={(v) => formatMoney(v, 0)}
                />
              </Col>
              <Col xs={12} sm={5}>
                <Statistic
                  title="จำนวนเงินรวม (บาท)"
                  value={summary.amount}
                  valueStyle={{ color: "#0ea2d2" }}
                  formatter={(v) => formatMoney(v, 2)}
                />
              </Col>
            </Row>
          </Card>
        )}

        <Card className="table-card" bordered>
          <Spin spinning={loading}>
            {hasData ? (
              <Table
                className="region-table"
                size="small"
                bordered
                rowKey="key"
                rowClassName={(record) => {
                  if (record?.isGrand) return "region-row-grand";
                  if (record?.isSum) return "region-row-sum";
                  if (record?.isRegionHead) return "region-row-head";
                  return "region-row-data";
                }}
                columns={regionColumn}
                dataSource={data}
                scroll={{ x: "max-content" }}
                pagination={false}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: "60px 0" }}
                description={
                  searched && !loading ? (
                    <Text type="secondary">ไม่พบข้อมูลในช่วงวันที่ที่เลือก</Text>
                  ) : (
                    <Space direction="vertical" size={4}>
                      <Text>ยังไม่มีข้อมูล</Text>
                      <Text type="secondary">ขั้นตอนใช้งาน:</Text>
                      <Text>1. เลือกประเภทสินค้า</Text>
                      <Text>2. เลือกภาค (เว้นว่างไว้ = ทุกภาค)</Text>
                      <Text>3. เลือกช่วงวันที่</Text>
                      <Text>4. กด "ค้นหา" เพื่อแสดงข้อมูล</Text>
                    </Space>
                  )
                }
              />
            )}
          </Spin>
        </Card>
      </Space>
    </div>
  );
};

export default UISaleRegionAccess;
