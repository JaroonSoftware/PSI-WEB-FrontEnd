/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button, Table, Typography } from "antd";
import { PiPrinterFill } from "react-icons/pi";
import dayjs from "dayjs";

import ReportService from "services/Report.service";
import useDimensions from "hook/useDimensions";
import { formatMoney } from "utils/utils";

import "./factory-report.css";

const { Title, Text } = Typography;

const masterProductList = [
  { code: "PCW43", productname: "C4.00", productcolumn: "PC Wire" },
  { code: "PCW42", productname: "4.00", productcolumn: "PC Wire" },
  { code: "PCW52", productname: "5.00", productcolumn: "PC Wire" },
  { code: "PCW72", productname: "7.00", productcolumn: "PC Wire" },
  { code: "PCW92", productname: "9.00", productcolumn: "PC Wire" },
  { code: "PCS93", productname: "9.30", productcolumn: "PC Strand" },
  { code: "PCS95", productname: "9.53", productcolumn: "PC Strand" },
  { code: "PCS127", productname: "12.70", productcolumn: "PC Strand" },
  { code: "CRD28", productname: "2.8", productcolumn: "Cold Drawn" },
  { code: "CRD30", productname: "3.0", productcolumn: "Cold Drawn" },
  { code: "CRD40", productname: "4.0", productcolumn: "Cold Drawn" },
];

function buildDataList(items) {
  const sqlDataMap = {};
  items.forEach((item) => { sqlDataMap[item.code] = item; });

  const addColumn = masterProductList.map((master) => ({
    ...master,
    ...sqlDataMap[master.code],
  }));

  const sumCols = (arr, cols) => {
    const result = {};
    cols.forEach((col) => {
      result[col] = arr.reduce((sum, item) => sum + (item[col] || 0), 0);
    });
    return result;
  };

  const sumColumns = ["daily", "total_act", "actual", "sold_daily", "sold_total_act", "sold_actual", "stock", "no_test"];

  const coldDrawnStartIdx = addColumn.findIndex((i) => i.code === "CRD28");
  const coldDrawnEndIdx = addColumn.findIndex((i) => i.code === "CRD40");
  addColumn.splice(coldDrawnEndIdx + 1, 0, {
    key: "total-coldrawn", productcolumn: "", productname: "Total",
    ...sumCols(addColumn.slice(coldDrawnStartIdx, coldDrawnEndIdx + 1), sumColumns),
  });

  const pcStrandStartIdx = addColumn.findIndex((i) => i.code === "PCS93");
  const pcStrandEndIdx = addColumn.findIndex((i) => i.code === "PCS127");
  addColumn.splice(pcStrandEndIdx + 1, 0, {
    key: "total-pcstrand", productcolumn: "", productname: "Total",
    ...sumCols(addColumn.slice(pcStrandStartIdx, pcStrandEndIdx + 1), sumColumns),
  });

  const pcWireStartIdx = addColumn.findIndex((i) => i.code === "PCW43");
  const pcWireEndIdx = addColumn.findIndex((i) => i.code === "PCW92");
  addColumn.splice(pcWireEndIdx + 1, 0, {
    key: "total-pcwire", productcolumn: "", productname: "Total",
    ...sumCols(addColumn.slice(pcWireStartIdx, pcWireEndIdx + 1), sumColumns),
  });

  return addColumn;
}

function FactoryReportPrintPreview() {
  const { date } = useParams();
  const componentRef = useRef(null);
  const { width: viewportWidth, height: viewportHeight } = useDimensions();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fmt = (v) =>
    v !== undefined && v !== null && v !== "" && v !== 0 ? formatMoney(v, 0) : "-";

  const previewScale = useMemo(() => {
    const mmToPx = 96 / 25.4;
    const pageWidthPx = 305 * mmToPx;
    const pageHeightPx = 218 * mmToPx;
    const availableWidth = Math.max(viewportWidth - 48, 320);
    const availableHeight = Math.max(viewportHeight - 120, 320);
    return Math.min(1, availableWidth / pageWidthPx, availableHeight / pageHeightPx);
  }, [viewportWidth, viewportHeight]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "factory-report",
    pageStyle: `
      @page { size: A4 landscape !important; margin: 0 !important; }
      @media print {
        html, body { width: 297mm; height: 210mm; margin: 0 !important;
          -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .factory-report-page-form { width: 297mm; height: 210mm; overflow: hidden; padding: 4mm 5mm; }
        .ant-table { font-size: 9px !important; }
        .ant-table-cell { padding: 1px 3px !important; border-width: 1px !important; border-color: #1565c0 !important; }
        .ant-table-thead > tr > th, .ant-table-thead > tr > td {
          background-color: #c8e6c9 !important; font-weight: 600 !important; -webkit-print-color-adjust: exact !important; }
        .ant-table-tbody > tr > td { background-color: #fffde7 !important; -webkit-print-color-adjust: exact !important; }
        .ant-table-tbody tr.row-stripe > td { background-color: #e0f7fa !important; -webkit-print-color-adjust: exact !important; }
        .ant-table-tbody tr.row-total > td { background-color: #a5d6a7 !important; font-weight: bold; -webkit-print-color-adjust: exact !important; }
        .ant-table-summary > tr > td { background-color: #a5d6a7 !important; font-weight: bold; -webkit-print-color-adjust: exact !important; }
        .print-header { margin-bottom: 4px !important; }
      }
    `,
    removeAfterPrint: true,
  });

  const columns = useMemo(() => [
    {
      title: "ผลิตภัณฑ์",
      dataIndex: "productcolumn",
      key: "productcolumn",
      align: "center",
      colSpan: 2,
      onCell: (_, index) => {
        if (index === 0) return { rowSpan: 6 };
        if (index === 6 || index === 10) return { rowSpan: 4 };
        if ([1,2,3,4,5,7,8,9,11,12,13].includes(index)) return { rowSpan: 0 };
        return {};
      },
    },
    { title: "ผลิตภัณฑ์2", dataIndex: "productname", key: "productname", align: "center", colSpan: 0 },
    {
      title: "รายงานการผลิต",
      children: [
        { title: "Daily", dataIndex: "daily", key: "daily", align: "center", render: fmt },
        { title: "Total Act.", dataIndex: "total_act", key: "total_act", align: "center", render: fmt },
        { title: "Actual", dataIndex: "actual", key: "actual", align: "center", render: fmt },
      ],
    },
    {
      title: "ยอดจ่ายสินค้า",
      children: [
        { title: "Date", dataIndex: "sold_daily", key: "sold_daily", align: "center", render: fmt },
        { title: "Month", dataIndex: "sold_total_act", key: "sold_total_act", align: "center", render: fmt },
        { title: "Previous Month", dataIndex: "sold_actual", key: "sold_actual", align: "center", render: fmt },
      ],
    },
    {
      title: "สินค้าคงเหลือ",
      children: [
        { title: "PSI", dataIndex: "stock", key: "stock", align: "center", render: fmt },
        { title: "No Test", dataIndex: "no_test", key: "no_test", align: "center", render: fmt },
      ],
    },
  ], []);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    ReportService.FactoryReport({ dateQuery: date })
      .then((res) => {
        if (res.status === 200) setData(buildDataList(res.data.items));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <div
      className="page-show factory-report-print"
      id="factory-report"
      style={{ "--preview-scale": previewScale }}
    >
      <div className="title-preview no-print">
        <Button onClick={handlePrint} icon={<PiPrinterFill style={{ fontSize: "1.1rem" }} />}>
          PRINT
        </Button>
      </div>

      <div className="print-layout-page">
        <div ref={componentRef} className="print-area factory-report-page-form">
          <div className="print-header">
            <Title level={5} style={{ margin: 0, textAlign: "center" }}>Factory Report</Title>
            <Text style={{ display: "block", textAlign: "center", fontSize: 11 }}>
              วันที่: {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
            </Text>
          </div>

          <Table
            size="small"
            bordered
            rowKey={(r) => r.key || r.code}
            rowClassName={(record, idx) =>
              record.productname === "Total" ? "row-total" : idx % 2 !== 0 ? "row-stripe" : ""
            }
            dataSource={data}
            columns={columns}
            loading={loading}
            pagination={false}
            summary={(pageData) => {
              const totalRows = pageData.filter((r) => r.productname === "Total");
              const sumCol = (col) => totalRows.reduce((s, r) => s + (r[col] || 0), 0);
              const cell = (idx, val) => (
                <Table.Summary.Cell index={idx} align="center">
                  <b>{val ? formatMoney(val, 0) : "-"}</b>
                </Table.Summary.Cell>
              );
              return (
                <Table.Summary.Row align="center">
                  <Table.Summary.Cell index={0} colSpan={2}><b>Grand Total</b></Table.Summary.Cell>
                  {cell(2, sumCol("daily"))}
                  {cell(3, sumCol("total_act"))}
                  {cell(4, sumCol("actual"))}
                  {cell(5, sumCol("sold_daily"))}
                  {cell(6, sumCol("sold_total_act"))}
                  {cell(7, sumCol("sold_actual"))}
                  {cell(8, sumCol("stock"))}
                  {cell(9, sumCol("no_test"))}
                </Table.Summary.Row>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default FactoryReportPrintPreview;
