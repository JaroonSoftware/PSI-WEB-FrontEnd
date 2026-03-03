/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import { Button, Table, Typography } from "antd";
import { PiPrinterFill } from "react-icons/pi";
import dayjs from "dayjs";

import logo from "../../../assets/image/logopsi.jpg";
import "../stock-card/stock-card.css";

import RwiService from "services/RwiService";
import { formatMoney } from "utils/utils";

const { Title, Text } = Typography;

function CustomerReportCustomerPrintPreview() {
  const { product, date1, date2 } = useParams();
  const componentRef = useRef(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "customer-report-by-customer",
    removeAfterPrint: true,
  });

  const productLabel = useMemo(() => {
    const p = String(product || "all").toLowerCase();
    if (p === "pcw") return "PCW";
    if (p === "pcs") return "PCS";
    return "ทั้งหมด";
  }, [product]);

  const money2 = (v) => formatMoney(Number(v) || 0, 2);

  const columns = useMemo(() => {
    return [
      {
        title: "ลำดับ",
        key: "idx",
        width: 70,
        align: "center",
        render: (_v, _r, idx) => idx + 1,
      },
      {
        title: "รหัสลูกค้า",
        dataIndex: "cusno",
        key: "cusno",
        width: 120,
      },
      {
        title: "ชื่อลูกค้า",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "เครดิต",
        dataIndex: "total_credit",
        key: "total_credit",
        align: "right",
        width: 120,
        render: (v) => (v ? Number(v).toLocaleString() : "0"),
      },
      {
        title: "ปริมาณ(ตัน)",
        dataIndex: "total_unit",
        key: "total_unit",
        align: "right",
        width: 140,
        render: (v) => {
          const ton = (Number(v) || 0) / 1000;
          return ton.toLocaleString("en-US", { minimumFractionDigits: 3 });
        },
      },
      {
        title: "จำนวนเงิน(บาท)",
        dataIndex: "total_price",
        key: "total_price",
        align: "right",
        width: 160,
        render: (v) => money2(v),
      },
    ];
  }, []);

  const totals = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    const totalUnit = rows.reduce((sum, r) => sum + (Number(r?.total_unit) || 0), 0);
    const totalPrice = rows.reduce((sum, r) => sum + (Number(r?.total_price) || 0), 0);
    return { totalUnit, totalPrice };
  }, [data]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const pdCodeQuery = String(product || "all").toLowerCase() === "all" ? "" : String(product || "");
        const reqData = {
          pdCodeQuery,
          dateQuery: [date1, date2 || date1],
          type: 1,
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
            รายงานยอดขายลูกค้า 1 (ลูกค้า) สินค้า {productLabel} ประจำวันที่ {d1} ถึง {d2}
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
          rowKey={(r) => r.cusno}
          dataSource={data}
          columns={columns}
          loading={loading}
          pagination={false}
          summary={() => (
            <Table.Summary.Row className="sum-row">
              <Table.Summary.Cell colSpan={4} className="text-center">
                รวม
              </Table.Summary.Cell>
              <Table.Summary.Cell className="text-right">
                {(totals.totalUnit / 1000).toLocaleString("en-US", { minimumFractionDigits: 3 })}
              </Table.Summary.Cell>
              <Table.Summary.Cell className="text-right">
                {money2(totals.totalPrice)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
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
    <div className="page-show" id="sale-daily">
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

export default CustomerReportCustomerPrintPreview;
