/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Statistic,
  Spin,
} from "antd";
import {
  SearchOutlined,
  PrinterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import "./MyPage.css";
import RwiService from "services/RwiService";
import { buildAccessColumn } from "../../../component/print/sale-daily/model";
import { buildSaleDailyRows } from "../../../component/print/sale-daily/transform";
import { formatMoney } from "../../../utils/utils";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const PRODUCT_LABEL = {
  all: "ทั้งหมด",
  pcw: "PCW",
  pcs: "PCS",
  crd: "CRD",
};

/* จำเงื่อนไขที่ค้นหาล่าสุดไว้ เพื่อให้กด "กลับ" จากหน้ารายละเอียด
   แล้วเห็นผลค้นหาเดิมทันที ไม่ต้องกดค้นหาใหม่ */
const SEARCH_STATE_KEY = "psi_sale_daily_search";

const DEFAULT_PRODUCT = "pcw";
const defaultDateRange = () => [dayjs(), dayjs()];

const UISaleDailyAccess = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ weight: 0, amount: 0, count: 0 });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [product, setProduct] = useState(DEFAULT_PRODUCT);
  const [dateRange, setDateRange] = useState(defaultDateRange);

  /* เก็บเงื่อนไขที่ "ค้นหาไปแล้วจริง ๆ" ไว้ต่างหาก
     กันกรณีผู้ใช้เปลี่ยนวันที่แล้วกด Print ทันที จะได้ไม่พิมพ์คนละชุดกับที่เห็นบนจอ */
  const [printParams, setPrintParams] = useState(null);

  const onDateChange = (date) => setDateRange(date);
  const onProductChange = (e) => setProduct(e.target.value);

  /* กลับมาจากหน้ารายละเอียด -> ค้นหาซ้ำด้วยเงื่อนไขเดิมให้อัตโนมัติ */
  useEffect(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem(SEARCH_STATE_KEY) || "null"
      );
      if (!saved?.product || !saved?.date1 || !saved?.date2) return;

      const range = [dayjs(saved.date1), dayjs(saved.date2)];
      setProduct(saved.product);
      setDateRange(range);
      runSearch(saved.product, range);
    } catch (e) {
      /* ignore */
    }
  }, []);

  const onSearch = () => runSearch(product, dateRange);

  /* ล้างทั้งเงื่อนไขและผลลัพธ์ กลับไปเป็นสถานะเริ่มต้น
     ต้องลบ sessionStorage ด้วย ไม่งั้นเข้าหน้านี้รอบหน้าจะเด้งผลเก่ากลับมา */
  const onClearSearch = () => {
    setProduct(DEFAULT_PRODUCT);
    setDateRange(defaultDateRange());
    setData([]);
    setSummary({ weight: 0, amount: 0, count: 0 });
    setPrintParams(null);
    setSearched(false);
    sessionStorage.removeItem(SEARCH_STATE_KEY);
  };

  const runSearch = (pdCode, range) => {
    if (!range?.[0] || !range?.[1]) {
      message.warning("กรุณาเลือกช่วงวันที่");
      return;
    }

    setLoading(true);
    setSearched(true);

    const date1 = range[0].format("MM-DD-YYYY");
    const date2 = range[1].format("MM-DD-YYYY");

    RwiService.getSaleDaily({
      pdCodeQuery: pdCode,
      dateQuery: [date1, date2],
    })
      .then(({ data }) => {
        const items = data?.items ?? [];
        const { rows, grandWeight, grandAmount } = buildSaleDailyRows(items);

        setData(items.length ? rows : []);
        setSummary({
          weight: grandWeight,
          amount: grandAmount,
          count: items.length,
        });
        const params = { product: pdCode, date1, date2 };
        setPrintParams(params);
        sessionStorage.setItem(SEARCH_STATE_KEY, JSON.stringify(params));

        if (!items.length) message.info("ไม่พบข้อมูลในช่วงวันที่ที่เลือก");
      })
      .catch((err) => {
        console.log(err);
        setData([]);
        setSummary({ weight: 0, amount: 0, count: 0 });
        setPrintParams(null);
        message.error("ดึงข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      })
      .finally(() => setLoading(false));
  };

  const onPrint = () => {
    if (!printParams) return;

    const base =
      process.env.PUBLIC_URL ||
      (window.location.pathname.startsWith("/webpsi") ? "/webpsi" : "");

    const { product: p, date1, date2 } = printParams;
    const url = `${base}/sale/daily-report-print/${p}/${date1}${
      date2 ? `/${date2}` : ""
    }`;

    const newWindow = window.open(url, "PSI_SALE_DAILY_PRINT");
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
    <div className="saledaily-report">
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Card bordered className="report-toolbar">
          <Row align="middle" gutter={[12, 12]}>
            <Col flex="auto">
              <Title level={4} style={{ margin: 0 }}>
                รายงานสรุปยอดขายรายวัน
              </Title>
              <Text type="secondary">
                เลือกประเภทสินค้าและช่วงวันที่ กดค้นหาเพื่อดูข้อมูล
                แล้วจึงกดพิมพ์รายงาน
              </Text>
            </Col>
            <Col>
              <Space wrap>
                <Radio.Group onChange={onProductChange} value={product}>
                  <Radio value="all">ทั้งหมด</Radio>
                  <Radio value="pcw">PCW</Radio>
                  <Radio value="pcs">PCS</Radio>
                  <Radio value="crd">CRD</Radio>
                </Radio.Group>
                <RangePicker
                  style={{ width: 260 }}
                  format={"DD/MM/YYYY"}
                  onChange={onDateChange}
                  value={dateRange}
                />
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

        {hasData && (
          <Card bordered className="report-summary">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
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
              <Col xs={12} sm={5}>
                <Statistic title="จำนวนรายการ" value={summary.count} />
              </Col>
              <Col xs={12} sm={5}>
                <Statistic
                  title="น้ำหนักรวม"
                  value={summary.weight}
                  formatter={(v) => formatMoney(v, 0)}
                />
              </Col>
              <Col xs={24} sm={6}>
                <Statistic
                  title="จำนวนเงินรวม"
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
                size="small"
                bordered
                rowKey="key"
                rowClassName={(record) =>
                  record?.isGrand
                    ? "grand-row"
                    : record?.sum_amount !== undefined
                    ? "sum-row"
                    : ""
                }
                columns={buildAccessColumn({
                  onInvoiceClick: (invno) =>
                    navigate(
                      `/webpsi/sale/daily-report/${encodeURIComponent(invno)}`
                    ),
                })}
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
                    <Text type="secondary">
                      ไม่พบข้อมูลในช่วงวันที่ที่เลือก
                    </Text>
                  ) : (
                    <Space direction="vertical" size={4}>
                      <Text>ยังไม่มีข้อมูล</Text>
                      <Text type="secondary">ขั้นตอนใช้งาน:</Text>
                      <Text>1. เลือกประเภทสินค้า</Text>
                      <Text>2. เลือกช่วงวันที่ที่ต้องการ</Text>
                      <Text>3. กด "ค้นหา" เพื่อแสดงข้อมูล</Text>
                      <Text>4. กด "พิมพ์รายงาน" เพื่อเปิดหน้าพิมพ์</Text>
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

export default UISaleDailyAccess;
