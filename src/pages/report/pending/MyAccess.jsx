/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from "react";
import { Button, Card, Col, DatePicker, Empty, Row, Space, Table, Typography, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { TbFileExport } from "react-icons/tb";
import dayjs from "dayjs";

import ReportService from "services/Report.service";
import { dateFormat, formatMoney } from "utils/utils";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const UIPendingAccess = () => {
  const [status] = useState("pending");
  const [dateRange, setDateRange] = useState(() => {
    const today = dayjs();
    return [today, today];
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    if (!dateRange?.[0] || !dateRange?.[1]) {
      message.warning("กรุณาเลือกช่วงวันที่");
      return;
    }

    const reqData = {
      status,
      dateQuery: [dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD")],
    };

    setLoading(true);
    try {
      const resp = await ReportService.DeliveryRemainingByPO(reqData);
      const items = resp?.data?.items || [];
      setData(items);
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

    if (!dateRange?.[0] || !dateRange?.[1]) {
      message.warning("กรุณาเลือกช่วงวันที่");
      return;
    }

    const base = process.env.PUBLIC_URL || (window.location.pathname.startsWith("/webpsi") ? "/webpsi" : "");

    const date1 = dateRange?.[0]?.format("YYYY-MM-DD");
    const date2 = dateRange?.[1]?.format("YYYY-MM-DD");

    const url = `${base}/pending-report-print/${status}/${date1}${date2 ? `/${date2}` : ""}`;
    const newWindow = window.open(url, "PSI_PENDING_PRINT");
    if (newWindow) {
      try {
        newWindow.focus();
      } catch (e) {}
    }
    if (!newWindow) {
      message.warning("Popup ถูกบล็อก กรุณาอนุญาตป๊อปอัปสำหรับไซต์นี้");
    }
  };

  const money0 = (v) => formatMoney(Number(v) || 0, 0);

  const columns = useMemo(() => {
    const qtyCols = [
      { title: "PCW42", dataIndex: "ord_pcw42", key: "ord_pcw42", align: "right", render: money0 },
      { title: "PCW43", dataIndex: "ord_pcw43", key: "ord_pcw43", align: "right", render: money0 },
      { title: "PCW52", dataIndex: "ord_pcw52", key: "ord_pcw52", align: "right", render: money0 },
      { title: "PCW72", dataIndex: "ord_pcw72", key: "ord_pcw72", align: "right", render: money0 },
      { title: "PCW92", dataIndex: "ord_pcw92", key: "ord_pcw92", align: "right", render: money0 },
    ];

    const soldCols = [
      { title: "PCW42", dataIndex: "sold_pcw42", key: "sold_pcw42", align: "right", render: money0 },
      { title: "PCW43", dataIndex: "sold_pcw43", key: "sold_pcw43", align: "right", render: money0 },
      { title: "PCW52", dataIndex: "sold_pcw52", key: "sold_pcw52", align: "right", render: money0 },
      { title: "PCW72", dataIndex: "sold_pcw72", key: "sold_pcw72", align: "right", render: money0 },
      { title: "PCW92", dataIndex: "sold_pcw92", key: "sold_pcw92", align: "right", render: money0 },
    ];

    const remCols = [
      { title: "PCW42", dataIndex: "rem_pcw42", key: "rem_pcw42", align: "right", render: money0 },
      { title: "PCW43", dataIndex: "rem_pcw43", key: "rem_pcw43", align: "right", render: money0 },
      { title: "PCW52", dataIndex: "rem_pcw52", key: "rem_pcw52", align: "right", render: money0 },
      { title: "PCW72", dataIndex: "rem_pcw72", key: "rem_pcw72", align: "right", render: money0 },
      { title: "PCW92", dataIndex: "rem_pcw92", key: "rem_pcw92", align: "right", render: money0 },
    ];

    return [
      {
        title: "ลำดับ",
        key: "idx",
        width: 70,
        align: "center",
        render: (_v, _r, idx) => idx + 1,
        fixed: "left",
      },
      {
        title: "เลขที่ใบอนุมัติ",
        dataIndex: "approval_no",
        key: "approval_no",
        width: 140,
        fixed: "left",
      },
      { title: "ลูกค้า", dataIndex: "customer_name", key: "customer_name", width: 260 },
      {
        title: "วันที่สั่งซื้อ",
        dataIndex: "order_date",
        key: "order_date",
        width: 130,
        align: "center",
        render: (v) => dateFormat(v),
      },
      {
        title: "ราคา",
        dataIndex: "u_price",
        key: "u_price",
        width: 90,
        align: "right",
        render: (v) => formatMoney(Number(v) || 0, 2),
      },
      {
        title: "สถานะ",
        children: [
          { title: "จำนวน", children: qtyCols },
          { title: "ขายแล้ว", children: soldCols },
          { title: "ค้างส่ง", children: remCols },
        ],
      },
      { title: "sales", dataIndex: "sale_name", key: "sale_name", width: 160 },
    ];
  }, []);

  const summary = (pageData) => {
    if (!pageData?.length) return null;

    const sum = (key) => pageData.reduce((acc, it) => acc + (Number(it?.[key]) || 0), 0);

    const totals = {
      ord_pcw42: sum("ord_pcw42"),
      ord_pcw43: sum("ord_pcw43"),
      ord_pcw52: sum("ord_pcw52"),
      ord_pcw72: sum("ord_pcw72"),
      ord_pcw92: sum("ord_pcw92"),
      sold_pcw42: sum("sold_pcw42"),
      sold_pcw43: sum("sold_pcw43"),
      sold_pcw52: sum("sold_pcw52"),
      sold_pcw72: sum("sold_pcw72"),
      sold_pcw92: sum("sold_pcw92"),
      rem_pcw42: sum("rem_pcw42"),
      rem_pcw43: sum("rem_pcw43"),
      rem_pcw52: sum("rem_pcw52"),
      rem_pcw72: sum("rem_pcw72"),
      rem_pcw92: sum("rem_pcw92"),
    };

    const cell = (value) => <Table.Summary.Cell align="right">{money0(value)}</Table.Summary.Cell>;

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={5}>
            <b>รวม</b>
          </Table.Summary.Cell>
          {cell(totals.ord_pcw42)}
          {cell(totals.ord_pcw43)}
          {cell(totals.ord_pcw52)}
          {cell(totals.ord_pcw72)}
          {cell(totals.ord_pcw92)}
          {cell(totals.sold_pcw42)}
          {cell(totals.sold_pcw43)}
          {cell(totals.sold_pcw52)}
          {cell(totals.sold_pcw72)}
          {cell(totals.sold_pcw92)}
          {cell(totals.rem_pcw42)}
          {cell(totals.rem_pcw43)}
          {cell(totals.rem_pcw52)}
          {cell(totals.rem_pcw72)}
          {cell(totals.rem_pcw92)}
          <Table.Summary.Cell index={20} />
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <Card className="card-dashboard">
      <Row align="middle" gutter={[12, 12]}>
        <Col flex="auto">
          <Title level={4} style={{ margin: 0 }}>
            รายงานค้างส่งตาม PO สั่งซื้อลูกค้า
          </Title>
          <Text type="secondary">เลือกช่วงวันที่ จากนั้นกดค้นหา</Text>
        </Col>
        <Col>
          <Space wrap>
            <RangePicker
              style={{ width: 260 }}
              format={"DD/MM/YYYY"}
              value={dateRange}
              onChange={setDateRange}
              inputReadOnly
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={fetchReport}>
              ค้นหา
            </Button>
            <Button icon={<TbFileExport />} onClick={openPrint} disabled={!data || data.length === 0}>
              Print
            </Button>
          </Space>
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        {data && data.length > 0 ? (
          <Table
            size="small"
            bordered
            rowKey={(r) => r.key || r.approval_no}
            dataSource={data}
            columns={columns}
            loading={loading}
            pagination={false}
            scroll={{ x: "max-content", y: 520 }}
            summary={summary}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text>ยังไม่มีข้อมูล</Text>} style={{ marginTop: 32 }} />
        )}
      </div>
    </Card>
  );
};

export default UIPendingAccess;
