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
  WEIGHT_COLUMNS,
  weight0,
  money2,
} from "pages/report/freight/model";
import logo from "assets/image/psi.jpg";

import "./freight-report.css";

function FreightReportPrintPreview() {
  const { date1, date2 } = useParams();
  const [searchParams] = useSearchParams();
  const trncode = searchParams.get("trn") || "";
  const bandLabel = searchParams.get("band") || "";
  const bandId = searchParams.get("bandId") || null;

  const componentRef = useRef(null);
  const { width: viewportWidth, height: viewportHeight } = useDimensions();

  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [byTransport, setByTransport] = useState([]);
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
    documentTitle: "freight-summary-report",
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
        const resp = await ReportService.FreightSummary({
          dateQuery: [date1, date2 || date1],
          trncode,
          bandId,
        });
        setData(resp?.data?.items || []);
        setSummary(resp?.data?.summary || {});
        setByTransport(resp?.data?.byTransport || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [date1, date2, trncode, bandId]);

  const columns = useMemo(() => accessColumn(true), []);

  const summaryRow = () => (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={6} align="center">
          <b>รวมทั้งหมด</b>
        </Table.Summary.Cell>
        {WEIGHT_COLUMNS.map((c, i) => (
          <Table.Summary.Cell key={c.key} index={6 + i} align="right">
            {weight0(summary[c.key])}
          </Table.Summary.Cell>
        ))}
        <Table.Summary.Cell index={13} align="right">
          {weight0(summary.w_total)}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={14} colSpan={5} />
        <Table.Summary.Cell index={19} align="right">
          {money2(summary.cost)}
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );

  const printedAt = dayjs();

  return (
    <div
      className="page-show freight-report-print"
      id="freight-report"
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
        <div ref={componentRef} className="print-area freight-report-page-form">
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
            <div className="fr-brand">
              <img src={logo} alt="logo" />
              <div className="fr-company">
                PENSIRI STEEL INDUSTRIES CO., LTD.
                <small>บริษัท เพ็นซิริ สตีล อินดัสตรี้ จำกัด</small>
              </div>
            </div>

            <div className="fr-title">
              <h2>สรุปรายงานค่าขนส่ง</h2>
              <span className="fr-chip">
                {dayjs(date1).format("DD/MM/YYYY")} -{" "}
                {dayjs(date2 || date1).format("DD/MM/YYYY")}
              </span>
              {bandLabel ? (
                <span className="fr-chip">เลทน้ำมัน {bandLabel} บาท/ลิตร</span>
              ) : null}
            </div>

            <div className="fr-meta">
              วันที่พิมพ์ : <b>{printedAt.format("DD/MM/YYYY")}</b>
              <br />
              เวลา : <b>{printedAt.format("HH:mm")}</b>
              <br />
              จำนวน : <b>{data.length}</b> รายการ
            </div>
          </div>

          {/* ---------- ตารางรายการ ---------- */}
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

          {/* ---------- สรุปรายบริษัทขนส่ง ---------- */}
          {byTransport.length > 0 && (
            <div className="fr-summary">
              <div className="fr-summary-title">สรุปตามบริษัทขนส่ง</div>
              <table className="fr-sum-table">
                <thead>
                  <tr>
                    <th>บริษัทขนส่ง</th>
                    <th>จำนวนเที่ยว</th>
                    <th>น้ำหนักรวม (กก.)</th>
                    <th>ค่าขนส่ง (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {byTransport.map((t) => (
                    <tr key={t.transport}>
                      <td>{t.transport}</td>
                      <td className="num">{weight0(t.trips)}</td>
                      <td className="num">{weight0(t.weight)}</td>
                      <td className="num">{money2(t.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ---------- ท้ายรายงาน ---------- */}
          <div className="fr-foot">
            <div className="fr-note">
              หมายเหตุ : ค่าขนส่ง = เลทราคา (ปัดเป็นจำนวนเต็ม) x น้ำหนัก (ตัน)
              อ้างอิงตามช่วงราคาน้ำมันที่เลือก
            </div>
            <div className="fr-sign">
              <div className="fr-sign-line">ผู้ตรวจสอบ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreightReportPrintPreview;
