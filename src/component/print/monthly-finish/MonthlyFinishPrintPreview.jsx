import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, message, Spin } from "antd";
import { PrinterFilled } from "@ant-design/icons";
import dayjs from "dayjs";

import ReportService from "services/Report.service";
import "./monthly-finish.css";

const MONTHS = [
  { key: "jan", label: "JAN" },
  { key: "feb", label: "FEB" },
  { key: "mar", label: "MAR" },
  { key: "apr", label: "APR" },
  { key: "may", label: "MAY" },
  { key: "jun", label: "JUN" },
  { key: "jul", label: "JUL" },
  { key: "aug", label: "AUG" },
  { key: "sep", label: "SEP" },
  { key: "oct", label: "OCT" },
  { key: "nov", label: "NOV" },
  { key: "dec", label: "DEC" },
];

const fmt = (v, rowType) => {
  if (rowType === "planning") return "-";
  const n = Number(v) || 0;
  if (!n) return "-";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export default function MonthlyFinishPrintPreview() {
  const { year } = useParams();
  const y = Number(year) || dayjs().year();

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const title = useMemo(() => `Monthly Finish Product  ${y} (PSI)`, [y]);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      try {
        const start = dayjs(`${y}-01-01`).format("YYYY/MM/DD");
        const end = dayjs(`${y}-12-31`).format("YYYY/MM/DD");

        const { data } = await ReportService.MonthlyFinishBySize({
          dateQuery: [start, end],
        });

        const items = Array.isArray(data?.items) ? data.items : [];

        const sum = MONTHS.reduce(
          (acc, m) => {
            acc[m.key] = 0;
            return acc;
          },
          { total: 0 },
        );

        items.forEach((r) => {
          MONTHS.forEach((m) => {
            sum[m.key] += Number(r?.[m.key]) || 0;
          });
          sum.total += Number(r?.total) || 0;
        });

        const actualRow = { key: "#ACTUAL", product: "ACTUAL", rowType: "actual", ...sum };
        const planningRow = {
          key: "#PLANNING",
          product: "PLANNING",
          rowType: "planning",
          ...MONTHS.reduce((acc, m) => {
            acc[m.key] = null;
            return acc;
          }, {}),
          total: null,
        };
        const diffRow = { key: "#DIFF", product: "DIFF.", rowType: "diff", ...sum };

        setRows([
          ...items.map((it) => ({ ...it, rowType: "data" })),
          actualRow,
          planningRow,
          diffRow,
        ]);
      } catch (err) {
        setRows([]);
        message.error(
          `[${err?.response?.data?.status ?? 500}] : ${err?.response?.data?.message ?? "เกิดข้อผิดพลาด"}`,
        );
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [y]);

  return (
    <div className="page-show" id="monthly-finish">
      <style>
        {`
          @page {
            size: A4 landscape;
            margin-top: 2mm;
            margin-bottom: 8mm;
            margin-inline: 4mm;
          }
          @media print {
            html, body {
              background: #ffffff !important;
              color: #000000 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>
      <div className="title-preview">
        <Button icon={<PrinterFilled />} onClick={() => window.print()}>
          PRINT
        </Button>
      </div>

      <div className="print-layout-page">
        <div className="monthly-finish-page-form monthly-finish-print">
          <div className="print-title">{title}</div>

          {isLoading ? (
            <Spin />
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Product / Month</th>
                  {MONTHS.map((m) => (
                    <th key={m.key}>{m.label}</th>
                  ))}
                  <th style={{ width: 60 }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.key}
                    className={
                      r.rowType === "actual"
                        ? "row-actual"
                        : r.rowType === "planning"
                          ? "row-planning"
                          : r.rowType === "diff"
                            ? "row-diff"
                            : ""
                    }
                  >
                    <td>{r.product}</td>
                    {MONTHS.map((m) => (
                      <td key={m.key} style={{ textAlign: "center" }}>{fmt(r[m.key], r.rowType)}</td>
                    ))}
                    <td style={{ textAlign: "center" }}>{fmt(r.total, r.rowType)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
