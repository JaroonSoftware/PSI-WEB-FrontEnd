/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button, Table } from "antd";
import { PiPrinterFill } from "react-icons/pi";
import dayjs from "dayjs";

import ReportService from "services/Report.service";
import useDimensions from "hook/useDimensions";
import {
  accessColumn,
  MONTHS,
  weight0,
} from "pages/report/customer-yearly/model";
import logo from "assets/image/psi.jpg";

import "./customer-yearly.css";

function CustomerYearlyPrintPreview() {
  const { year } = useParams();
  const [searchParams] = useSearchParams();
  const saleno = searchParams.get("saleno") || "";
  const onlyWithSales = searchParams.get("only") === "1";

  const componentRef = useRef(null);
  const { width: viewportWidth, height: viewportHeight } = useDimensions();

  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [bySeller, setBySeller] = useState([]);
  const [loading, setLoading] = useState(false);

  const previewScale = useMemo(() => {
    const mmToPx = 96 / 25.4;
    const pageWidthPx = 305 * mmToPx;
    const pageHeightPx = 218 * mmToPx;
    const availableWidth = Math.max(viewportWidth - 48, 320);
    const availableHeight = Math.max(viewportHeight - 120, 320);

    return Math.min(
      1,
      availableWidth / pageWidthPx,
      availableHeight / pageHeightPx
    );
  }, [viewportHeight, viewportWidth]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `customer-yearly-sales-${year}`,
    pageStyle: `
      @page {
        size: landscape !important;
        size: A4 landscape !important;
        margin-top: 4mm;
        margin-bottom: 8mm;
        margin-inline: 5mm;
      }
      @media print {
        html, body {
          width: 297mm;
          min-height: 210mm;
          margin: 0 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
    removeAfterPrint: true,
  });

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const resp = await ReportService.CustomerYearlySales({
          year: Number(year),
          saleno,
          onlyWithSales,
        });
        setData(resp?.data?.items || []);
        setSummary(resp?.data?.summary || {});
        setBySeller(resp?.data?.bySeller || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [year, saleno, onlyWithSales]);

  const columns = useMemo(() => accessColumn(true), []);

  const summaryRow = () => (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={4} align="center">
          <b>รวม</b>
        </Table.Summary.Cell>
        {MONTHS.map((m, i) => (
          <Table.Summary.Cell key={m.key} index={4 + i} align="right">
            {weight0(summary[m.key])}
          </Table.Summary.Cell>
        ))}
        <Table.Summary.Cell index={16} align="right">
          {weight0(summary.total)}
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );

  const printedAt = dayjs();
  const sellerLabel =
    saleno && data.length > 0 ? data[0]?.seller : "ทั้งหมด";

  return (
    <div
      className="page-show customer-yearly-print"
      id="customer-yearly"
      style={{ "--preview-scale": previewScale }}
    >
      <div className="title-preview no-print">
        <Button
          onClick={handlePrint}
          icon={<PiPrinterFill style={{ fontSize: "1.1rem" }} />}
        >
          PRINT
        </Button>
      </div>

      <div className="print-layout-page">
        <div ref={componentRef} className="print-area customer-yearly-page-form">
          <style media="print">
            {`
              @page {
                size: landscape !important;
                size: A4 landscape !important;
                margin-top: 4mm !important;
                margin-bottom: 8mm !important;
                margin-inline: 5mm !important;
              }

              html, body {
                width: 297mm !important;
                min-height: 210mm !important;
                margin: 0 !important;
              }
            `}
          </style>

          {/* ---------- หัวรายงาน ---------- */}
          <div className="print-header">
            <div className="cy-brand">
              <img src={logo} alt="logo" />
              <div className="cy-company">
                PENSIRI STEEL INDUSTRIES CO., LTD.
                <small>บริษัท เพ็นซิริ สตีล อินดัสตรี้ จำกัด</small>
              </div>
            </div>

            <div className="cy-title">
              <h2>สรุปลูกค้าแต่ละรายทั้งปี</h2>
              <span className="cy-chip">ปี {year}</span>
              <span className="cy-chip">พนักงานขาย : {sellerLabel}</span>
            </div>

            <div className="cy-meta">
              วันที่พิมพ์ : <b>{printedAt.format("DD/MM/YYYY")}</b>
              <br />
              เวลา : <b>{printedAt.format("HH:mm")}</b>
              <br />
              จำนวน : <b>{data.length}</b> ราย
            </div>
          </div>

          {/* ---------- ตาราง ---------- */}
          <Table
            rowKey="key"
            size="small"
            bordered
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
            summary={data.length ? summaryRow : undefined}
          />

          {/* ---------- สรุปรายพนักงานขาย ---------- */}
          {bySeller.length > 0 && (
            <div className="cy-summary">
              <div className="cy-summary-title">สรุปตามพนักงานขาย</div>
              <table className="cy-sum-table">
                <thead>
                  <tr>
                    <th>พนักงานขาย</th>
                    <th>จำนวนลูกค้า</th>
                    <th>ยอดรวม (กก.)</th>
                  </tr>
                </thead>
                <tbody>
                  {bySeller.map((s) => (
                    <tr key={s.seller}>
                      <td>{s.seller}</td>
                      <td className="num">{weight0(s.customers)}</td>
                      <td className="num">{weight0(s.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerYearlyPrintPreview;
