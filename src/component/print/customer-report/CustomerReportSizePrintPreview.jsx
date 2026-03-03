/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import { Button, Table, Typography } from "antd";
import { PiPrinterFill } from "react-icons/pi";
import dayjs from "dayjs";

import logo from "../../../assets/image/logopsi.jpg";
import "../stock-card/stock-card.css";
import "./customer-report-size.css";

import RwiService from "services/RwiService";
import { dateFormat, formatMoney } from "utils/utils";

const { Title, Text } = Typography;

function CustomerReportSizePrintPreview() {
  const { product, date1, date2 } = useParams();
  const componentRef = useRef(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "customer-report-by-size",
    removeAfterPrint: true,
  });

  const productLabel = useMemo(() => {
    const p = String(product || "all").toLowerCase();
    if (p === "pcw") return "PCW";
    if (p === "pcs") return "PCS";
    return "ทั้งหมด";
  }, [product]);

  const money2 = (v) => formatMoney(Number(v) || 0, 2);

  const preparedData = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    const customerGroups = {};

    rows.forEach((r) => {
      const name = (r?.name || "-").trim() || "-";
      if (!customerGroups[name]) customerGroups[name] = [];
      customerGroups[name].push(r);
    });

    const names = Object.keys(customerGroups).sort((a, b) => a.localeCompare(b));
    const out = [];

    names.forEach((name) => {
      const items = customerGroups[name] || [];

      items.forEach((it, idx) => {
        out.push({
          ...it,
          key: `${name}_${it?.invno || idx}`,
          seq: idx + 1,
          isSummary: false,
        });
      });

      const totalUnit = items.reduce((sum, it) => sum + (Number(it?.total_unit) || 0), 0);
      const totalPrice = items.reduce((sum, it) => sum + (Number(it?.total_price) || 0), 0);

      out.push({
        key: `SUM_${name}`,
        isSummary: true,
        label: name,
        total_unit: totalUnit,
        total_price: totalPrice,
      });
    });

    return out;
  }, [data]);

  const columns = useMemo(() => {
    return [
      {
        title: "ลำดับ",
        key: "idx",
        width: 60,
        align: "center",
        render: (_v, record) => {
          if (record?.isSummary) return record?.label || "รวม";
          return record?.seq || "";
        },
        onCell: (record) => {
          if (record?.isSummary) {
            return { colSpan: 5, style: { fontWeight: 600, textAlign: "left" } };
          }
          return {};
        },
      },
      {
        title: "ขนาด",
        dataIndex: "size",
        key: "size",
        align: "center",
        width: 70,
        onCell: (record) => (record?.isSummary ? { colSpan: 0 } : {}),
        render: (value) => {
          const numValue = Number(value);
          return value ? numValue.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "";
        },
      },
      {
        title: "ชื่อลูกค้า",
        dataIndex: "name",
        key: "name",
        onCell: (record) => (record?.isSummary ? { colSpan: 0 } : {}),
        ellipsis: true,
      },
      {
        title: "วันที่ขาย",
        dataIndex: "gdsdate",
        key: "gdsdate",
        width: 95,
        onCell: (record) => (record?.isSummary ? { colSpan: 0 } : {}),
        render: (v, record) => (record?.isSummary ? "" : v ? dateFormat(v) : ""),
      },
      {
        title: "Invoice No.",
        dataIndex: "invno",
        key: "invno",
        width: 95,
        onCell: (record) => (record?.isSummary ? { colSpan: 0 } : {}),
        ellipsis: true,
      },
      {
        title: "น้ำหนัก",
        dataIndex: "total_unit",
        key: "total_unit",
        align: "right",
        width: 90,
        render: (v, record) => {
          const txt = v ? Number(v).toLocaleString() : "0";
          return record?.isSummary ? <b>{txt}</b> : txt;
        },
      },
      {
        title: "ราคา",
        dataIndex: "u_price",
        key: "u_price",
        align: "right",
        width: 95,
        render: (v, record) => (record?.isSummary ? "" : v ? money2(v) : ""),
      },
      {
        title: "จำนวนเงิน (บาท)",
        dataIndex: "total_price",
        key: "total_price",
        align: "right",
        width: 120,
        render: (v, record) => {
          if (record?.isSummary) return <b>{money2(v)}</b>;
          return money2(v);
        },
      },
      {
        title: "เครดิต",
        dataIndex: "credit",
        key: "credit",
        align: "center",
        width: 60,
        render: (v, record) => (record?.isSummary ? "" : v || ""),
      },
      {
        title: "ชื่อ Sale",
        dataIndex: "sale_name",
        key: "sale_name",
        width: 110,
        render: (v, record) => (record?.isSummary ? "" : v || ""),
        ellipsis: true,
        className: "hide-when-print",
        onHeaderCell: () => ({ className: "hide-when-print" }),
      },
    ];
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const pdCodeQuery = String(product || "all").toLowerCase() === "all" ? "" : String(product || "");
        const reqData = {
          pdCodeQuery,
          dateQuery: [date1, date2 || date1],
          type: 2,
        };
        const resp = await RwiService.getCustomerReport(reqData);
        setData(resp?.data?.items || []);
      } catch (err) {
        console.log(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [product, date1, date2]);

  const PrintHeaderPage = () => {
    return (
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
  };

  const HeaderData = () => {
    const d1 = dayjs(date1).format("DD/MM/YYYY");
    const d2 = dayjs(date2 || date1).format("DD/MM/YYYY");

    return (
      <div className="head-data" style={{ marginBottom: 0, paddingBottom: 0 }}>
        <div className="text-center" style={{ marginBottom: 0, paddingBottom: 0 }}>
          <Title level={5} className="uppercase mb-0.5" style={{ margin: 0 }}>
            รายงานยอดขายลูกค้า 2 (ขนาด) สินค้า {productLabel} ประจำวันที่ {d1} ถึง {d2}
          </Title>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <Text>สินค้า: {productLabel}</Text>
            <Text>
              ช่วงเวลา: {d1} ถึง {d2}
            </Text>
          </div>
        </div>
      </div>
    );
  };

  const BodyDataMain = () => {
    return (
      <div className="body-data">
        <Table
          size="small"
          bordered
          rowKey={(r) => r.key}
          dataSource={preparedData}
          columns={columns}
          loading={loading}
          pagination={false}
          rowClassName={(record) => (record?.isSummary ? "sum-row" : "")}
          tableLayout="fixed"
        />
      </div>
    );
  };

  const PrintComponent = () => {
    return (
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
  };

  return (
    <div className="page-show customer-report-size-print" id="sale-daily">
      <div className="title-preview">
        <Button className="bn-center  bg-blue-400" onClick={handlePrint} icon={<PiPrinterFill style={{ fontSize: "1.1rem" }} />}>
          PRINT
        </Button>
      </div>

      <div className="print-layout-page">
        <PrintComponent />
      </div>
    </div>
  );
}

export default CustomerReportSizePrintPreview;
