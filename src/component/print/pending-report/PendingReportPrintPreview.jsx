/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button, Space, Table, Typography } from "antd";
import { PiPrinterFill } from "react-icons/pi";
import dayjs from "dayjs";

import ReportService from "services/Report.service";
import { formatMoney } from "utils/utils";

import "./pending-report.css";

const { Title, Text } = Typography;

function PendingReportPrintPreview() {
  const { status, date1, date2 } = useParams();
  const componentRef = useRef(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const money0 = (v) => formatMoney(Number(v) || 0, 0);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "pending-delivery-report",
    removeAfterPrint: true,
  });

  const statusLabel = useMemo(() => {
    const s = String(status || "pending").toLowerCase();
    if (s === "closed") return "ปิดจ่าย";
    if (s === "all") return "ทั้งหมด";
    return "รอปิดจ่าย";
  }, [status]);

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
      },
      { title: "เลขที่ใบอนุมัติ", dataIndex: "approval_no", key: "approval_no", width: 140 },
      { title: "ลูกค้า", dataIndex: "customer_name", key: "customer_name" },
      {
        title: "วันที่สั่งซื้อ",
        dataIndex: "order_date",
        key: "order_date",
        width: 130,
        align: "center",
        render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
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

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const reqData = {
          status,
          dateQuery: [date1, date2 || date1],
        };
        const resp = await ReportService.DeliveryRemainingByPO(reqData);
        setData(resp?.data?.items || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [status, date1, date2]);

  return (
    <div className="pending-report-print">
      <div className="title-preview no-print">
        <Button onClick={handlePrint} icon={<PiPrinterFill style={{ fontSize: "1.1rem" }} />}>
          PRINT
        </Button>
      </div>

      <div ref={componentRef} className="print-area">
        <div className="print-header">
          <Title level={4} style={{ margin: 0, textAlign: "center" }}>
            รายงานค้างส่งตาม PO สั่งซื้อลูกค้า
          </Title>
          <Space size={16} style={{ width: "100%", justifyContent: "center" }}>
            <Text>สถานะ: {statusLabel}</Text>
            <Text>
              ช่วงเวลา: {dayjs(date1).format("DD/MM/YYYY")} ถึง {dayjs(date2 || date1).format("DD/MM/YYYY")}
            </Text>
          </Space>
        </div>

        <Table
          size="small"
          bordered
          rowKey={(r) => r.key || r.approval_no}
          dataSource={data}
          columns={columns}
          loading={loading}
          pagination={false}
          summary={summary}
        />
      </div>
    </div>
  );
}

export default PendingReportPrintPreview;
