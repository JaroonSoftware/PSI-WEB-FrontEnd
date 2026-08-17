/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Space,
  Card,
  message,
  Typography,
  Empty,
  Button,
  Table,
  Statistic,
  Spin,
} from "antd";
import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";

import "./MyPage.css";
import RwiService from "services/RwiService";
import { invoiceDetailColumn } from "../../../component/print/sale-daily/model";
import { buildInvoiceDetailRows } from "../../../component/print/sale-daily/transform";
import { formatMoney, dateFormat } from "../../../utils/utils";

const { Title, Text } = Typography;

const UISaleDailyDetailAccess = () => {
  const { invNo } = useParams();
  const navigate = useNavigate();

  const [header, setHeader] = useState(null);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ weight: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invNo) return;

    setLoading(true);
    RwiService.getSaleDailyInvoiceDetail(invNo)
      .then(({ data: res }) => {
        const items = res?.items ?? [];
        const { rows, grandWeight, count } = buildInvoiceDetailRows(items);

        setHeader(res?.header ?? null);
        setData(items.length ? rows : []);
        setSummary({ weight: grandWeight, count });

        if (!items.length) message.info("ไม่พบรายละเอียดลวดของใบกำกับนี้");
      })
      .catch((err) => {
        console.log(err);
        setData([]);
        setHeader(null);
        setSummary({ weight: 0, count: 0 });
        message.error(
          err?.response?.data?.message ?? "ดึงข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"
        );
      })
      .finally(() => setLoading(false));
  }, [invNo]);

  const onPrint = () => {
    const base =
      process.env.PUBLIC_URL ||
      (window.location.pathname.startsWith("/webpsi") ? "/webpsi" : "");

    const newWindow = window.open(
      `${base}/sale/daily-report-detail-print/${encodeURIComponent(invNo)}`,
      "PSI_SALE_DAILY_DETAIL_PRINT"
    );
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
                รายละเอียดลวดที่ขาย
              </Title>
              <Text type="secondary">
                หมายเลข Invoice {invNo}
                {header?.customer_name ? ` - ${header.customer_name}` : ""}
              </Text>
            </Col>
            <Col>
              <Space wrap>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/webpsi/sale/daily-report")}
                >
                  กลับ
                </Button>
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  onClick={onPrint}
                  disabled={!hasData || loading}
                >
                  พิมพ์รายงาน
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {hasData && (
          <Card bordered className="report-summary">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={7}>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  ลูกค้า
                </Text>
                <div style={{ fontSize: 16, marginTop: 4 }}>
                  <b>{header?.customer_name || "-"}</b>
                </div>
              </Col>
              <Col xs={12} sm={5}>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  ประเภทสินค้า
                </Text>
                <div style={{ fontSize: 16, marginTop: 4 }}>
                  <b>{(header?.group || "-").toUpperCase()}</b>
                </div>
              </Col>
              <Col xs={12} sm={5}>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  วันที่ขาย
                </Text>
                <div style={{ fontSize: 16, marginTop: 4 }}>
                  <b>{header?.gdsdate ? dateFormat(header.gdsdate) : "-"}</b>
                </div>
              </Col>
              <Col xs={12} sm={3}>
                <Statistic title="จำนวนคอยล์" value={summary.count} />
              </Col>
              <Col xs={12} sm={4}>
                <Statistic
                  title="น้ำหนักรวม"
                  value={summary.weight}
                  valueStyle={{ color: "#0ea2d2" }}
                  formatter={(v) => formatMoney(v, 0)}
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
                  record?.isGrand ? "grand-row" : record?.isSum ? "sum-row" : ""
                }
                columns={invoiceDetailColumn}
                dataSource={data}
                scroll={{ x: "max-content" }}
                pagination={false}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: "60px 0" }}
                description={
                  <Text type="secondary">
                    {loading
                      ? "กำลังโหลดข้อมูล..."
                      : "ไม่พบรายละเอียดลวดของใบกำกับนี้"}
                  </Text>
                }
              />
            )}
          </Spin>
        </Card>
      </Space>
    </div>
  );
};

export default UISaleDailyDetailAccess;
