import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import logo from "../../../assets/image/logopsi.jpg";
import "./sale-daily.css";

import { invoiceDetailColumn } from "./model";
import { buildInvoiceDetailRows } from "./transform";

import RwiService from "../../../services/RwiService";
import { Button, Table, Typography, Flex } from "antd";
import { PiPrinterFill } from "react-icons/pi";

/* ใช้ฟอร์ม header ชุดเดียวกับ "พิมพ์ยอดขายรายวัน"
   (โลโก้ + ที่อยู่บริษัท + sale-daily.css + กลไกตัดหน้า) */
function SaleDailyDetailPrintPreview() {
  const { invNo } = useParams();
  const componentRef = useRef(null);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice-${invNo}`,
    onBeforePrint: () => {
      handleCheckMultiPages();
    },
    onAfterPrint: () => {
      const parm = document.getElementById("form-body-main");
      if (parm) parm.style.pageBreakBefore = "auto";
    },
    removeAfterPrint: true,
  });

  const [header, setHeader] = useState(null);
  const [data, setData] = useState([]);

  const handleCheckMultiPages = () => {
    const limitPage = 930;

    const head = document.getElementById("form-head");
    const parm = document.getElementById("form-body-main");

    if (parm) parm.style.pageBreakBefore = "auto";

    const getHeight = (el) =>
      el
        ? Number(
            window
              .getComputedStyle(el)
              .getPropertyValue("height")
              ?.replace("px", "")
          )
        : 0;

    const headHieght = getHeight(head);
    const parmHieght = getHeight(parm);

    if (headHieght + parmHieght > limitPage) {
      if (parm) parm.style.pageBreakBefore = "always";
    }

    printRef.current = componentRef.current;
    return printRef.current;
  };

  const PrintHeaderPage = () => (
    <div className="head-page">
      <div className="print-logo">
        <img src={logo} alt="Company logo" />
      </div>
      <div className="print-head">
        <p className="th-text">PENSIRI STEEL INDUSTRIES CO.,LTD</p>
        <p className="ts-text">
          154/23 หมู่ 2 ตำบล บึง อำเภอ ศรีราชา จังหวัด ชลบุรี รหัสไปรษณีย์ 20230
        </p>
        <p className="ts-text">Tel. 038-064-613 -614 Fax.038-064-567</p>
      </div>
    </div>
  );

  const HeaderData = () => (
    <div className="head-data" style={{ marginBottom: 0, paddingBottom: 0 }}>
      <div className="text-center" style={{ marginBottom: 0, paddingBottom: 0 }}>
        <Typography.Title level={5} className="uppercase mb-0.5">
          รายละเอียดลวดที่ขายของ {(header?.group || "").toUpperCase()} หมายเลข
          Invoice {invNo}
          {header?.customer_name ? ` - ${header.customer_name}` : ""}
        </Typography.Title>
      </div>
    </div>
  );

  const BodyDataMain = () => (
    <div className="body-data">
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
    </div>
  );

  const PrintComponent = () => (
    <div className="sale-daily-page-form" ref={componentRef}>
      <table style={{ width: "100%", fontFamily: "inherit" }}>
        <thead>
          <tr>
            <th>
              <PrintHeaderPage />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr id="form-head">
            <td>
              <HeaderData />
            </td>
          </tr>
          <tr id="form-body-main">
            <td>
              <BodyDataMain />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  useEffect(() => {
    if (!invNo) return;

    RwiService.getSaleDailyInvoiceDetail(invNo)
      .then(({ data: res }) => {
        const { rows } = buildInvoiceDetailRows(res?.items ?? []);
        setHeader(res?.header ?? null);
        setData(rows);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [invNo]);

  return (
    <div className="page-show" id="sale-daily">
      <div className="title-preview">
        <Button
          className="bn-center bg-blue-400"
          onClick={handlePrint}
          icon={<PiPrinterFill style={{ fontSize: "1.1rem" }} />}
        >
          PRINT
        </Button>
      </div>
      <div className="print-layout-page">
        <PrintComponent />
      </div>
      <div className="hidden">
        <div ref={printRef}></div>
      </div>
    </div>
  );
}

export default SaleDailyDetailPrintPreview;
