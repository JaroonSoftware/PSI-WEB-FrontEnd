import React, { useEffect, useState } from "react";
import { Card, Space, Table, DatePicker, message, Row, Col } from "antd";
import RwiService from "services/RwiService";
import { getFixedQcRow, REPORT_TYPE } from "context/constant";
import { dateFormat, getDefaultValue } from "utils/utils";

const UIQcReport = () => {
  const [qcList, setQcList] = useState([]);
  const [noQcList, setNoQcList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const { RangePicker } = DatePicker;

  const fetchQcReport = (value) => {
    let reqData = { dateQuery: value };

    setIsLoading(true);
    RwiService.getQcReport(reqData)
      .then(({ data }) => {
        reportFactory(data);
      })
      .catch((err) => {
        setQcList([]);
        message.error(
          `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
        );
      })
      .finally(() => setIsLoading(false));
  };

  const reportFactory = (data) => {
    if (data.length <= 0)
      return message.error("[404] : ไม่มีข้อมูลสินค้าตามเงื่อนไขที่เลือก");

    let obj = {};
    let objNoTest = {};

    data.forEach((item) => {
      if (item.pass === "Y") {
        const key = `${item?.pdate}:${item?.shift}:${item?.code}-${item?.testdate}`;
        if (!obj[key])
          obj[key] = {
            items: [],
            size: item?.size,
            shift: item?.shift,
            pDate: item?.pdate,
            code: item?.code,
            testDate: item?.testdate,
          };
        obj[key]["items"].push(item);
      } else {
        const key = `${item?.pdate}:${item?.shift}:${item?.code}`;
        if (!objNoTest[key])
          objNoTest[key] = {
            items: [],
            size: item?.size,
            shift: item?.shift,
            pDate: item?.pdate,
            code: item?.code,
          };
        objNoTest[key]["items"].push(item);
      }
    });
    // console.log(obj);
    console.log(objNoTest);
    setQcList(obj);
    setNoQcList(objNoTest);
  };

  const qcReportColumn = (code) => [
    {
      title: "CHARGE NO.",
      dataIndex: "charge",
      key: "charge",
      align: "center",
      onCell: (_, index) => {
        if (index === 0) {
          return {
            rowSpan: 3,
          };
        }
        if (index === 1 || index === 2) {
          return {
            rowSpan: 0,
          };
        }
        return {};
      },
    },
    {
      title: "COIL NO.",
      dataIndex: "coilno",
      key: "coilno",
      align: "center",
    },
    {
      title: "WEIGHT",
      dataIndex: "weight",
      key: "weight",
      align: "center",
    },
    {
      title: <div style={{ textAlign: "center" }}>DIAMETER (mm.)</div>,
      dataIndex: "diameter",
      key: "diameter",
      onCell: (_, index) => {
        if (index === 0 || index === 2) {
          return {
            align: "right",
          };
        }
        if (index === 1) {
          return {
            align: "left",
          };
        }
        return {
          align: "center",
        };
      },
    },
    {
      title: "AREA sq.mm.",
      dataIndex: "area",
      key: "area",
      align: "center",
      render: (area) => (area ? area : ""),
    },
    {
      title: "TENSILE LOAD (Kgf.)",
      dataIndex: "tens_ld",
      key: "tens_ld",
      align: "center",
      render: (tens_ld) => (tens_ld ? tens_ld : ""),
    },
    {
      title: "TENSILE STRENGTH (Kgf/sq.mm)",
      dataIndex: "tensile",
      key: "tensile",
      align: "center",
      render: (tensile) => (tensile ? tensile : ""),
    },
    {
      title: "YIELD LOAD (Kgf.)",
      dataIndex: "yield_ld",
      key: "yield_ld",
      align: "center",
      render: (yield_ld) => (yield_ld ? yield_ld : ""),
    },
    {
      title: "YIELD STRENGTH (Kgf/sq.mm)",
      dataIndex: "yield_str",
      key: "yield_str",
      align: "center",
      render: (yield_str) => (yield_str ? yield_str : ""),
    },
    // {
    //   title: "REDUCTION AREA",
    //   dataIndex: "re_area",
    //   key: "re_area",
    //   align: "center",
    //   render: (re_area) => (re_area ? re_area : ""),
    // },
    {
      title: "REVERSE BENDING",
      dataIndex: "reverse",
      key: "reverse",
      align: "center",
      render: (reverse) => (reverse ? reverse : ""),
    },
    {
      title: code !== "PCW43" ? "INDENT DEPTH" : "WAVE HEIGHT",
      dataIndex: "indent",
      key: "indent",
      align: "center",
      render: (indent) => (indent ? indent : ""),
    },
    {
      title: "ELONG",
      dataIndex: "elong",
      key: "elong",
      align: "center",
      render: (elong) => (elong ? elong : ""),
    },
    {
      title: "CAMBER",
      dataIndex: "camber",
      key: "camber",
      align: "center",
      render: (camber) => (camber ? camber : ""),
    },
    {
      title: "UNIT WEIGHT",
      dataIndex: "u_weight",
      key: "u_weight",
      align: "center",
      render: (u_weight) => (u_weight ? u_weight : ""),
    },
    {
      title: "ลักษณะลวด",
      key: "pass",
      dataIndex: "pass",
      align: "center",
      render: (pass) =>
        pass === "Y" ? "ลวดดี" : pass === "N" ? "No Test" : "",
    },
  ];

  return (
    <>
      <Card className="card-dashboard">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "18px" }}>QC Report</h1>

          <Space>
            <RangePicker
              name="timeQuery"
              onChange={(value) => {
                if (!value) {
                  setNoQcList([]);
                  setQcList([]);
                } else {
                  fetchQcReport(value);
                }
              }}
              style={{ width: "230px" }}
              format={"DD/MM/YYYY"}
            />
          </Space>
        </div>

        {qcList.length <= 0 && (
          <Table
            dataSource={[]}
            columns={qcReportColumn()}
            style={{ marginTop: "1rem" }}
            className="table-less-pd"
            pagination={false}
            size="small"
            bordered
            rowKey="procode"
            loading={isLoading}
            scroll={{ x: 800 }}
          />
        )}

        {Object.keys(qcList).map((key) => {
          return (
            <Card
              key={key}
              style={{ marginTop: "1.5rem", borderColor: "#0ea2d2" }}
            >
              <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <h3>
                  FINISHED PRODUCT P.C. WIRE{" "}
                  {getDefaultValue(qcList[key]["size"], 2)} mm.
                </h3>
                <h3>MECHANICAL PROPERTIES TESTING REPORT</h3>
              </div>

              <Row gutter={8} style={{ marginBottom: "0.5rem" }}>
                <Col xs={6}>
                  <b>PENSIRI STEEL INDUSTRIES CO.,LTD</b>
                </Col>
                <Col xs={12} style={{ textAlign: "center" }}>
                  <b>PRODUCTION DATE</b> : {dateFormat(qcList[key]["pDate"])} -{" "}
                  <b>SHIFT</b> :{" "}
                  {qcList[key]["shift"] === "D" ? "DAY" : "NIGHT"}
                </Col>
                <Col xs={6} style={{ textAlign: "right" }}>
                  <b> TESTING DATE </b>: {dateFormat(qcList[key]["testDate"])}
                </Col>
              </Row>

              <Table
                dataSource={[
                  ...getFixedQcRow(qcList[key]["code"]),
                  ...qcList[key]["items"],
                ]}
                columns={qcReportColumn(qcList[key]["code"])}
                className="table-less-pd"
                pagination={false}
                size="small"
                bordered
                rowKey="procode"
                scroll={{ x: 800 }}
              />
            </Card>
          );
        })}

        {Object.keys(noQcList).map((key) => {
          return (
            <Card
              key={key}
              style={{ marginTop: "1.5rem", borderColor: "#da2a35" }}
            >
              <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <h3>
                  FINISHED PRODUCT P.C. WIRE{" "}
                  {getDefaultValue(noQcList[key]["size"], 2)} mm.
                </h3>
                <h3>MECHANICAL PROPERTIES TESTING REPORT</h3>
              </div>

              <Row gutter={8} style={{ marginBottom: "0.5rem" }}>
                <Col xs={6}>
                  <b>PENSIRI STEEL INDUSTRIES CO.,LTD</b>
                </Col>
                <Col xs={12} style={{ textAlign: "center" }}>
                  <b>PRODUCTION DATE</b> : {dateFormat(noQcList[key]["pDate"])}{" "}
                  - <b>SHIFT</b> :{" "}
                  {noQcList[key]["shift"] === "D" ? "DAY" : "NIGHT"}
                </Col>
                <Col xs={6} style={{ textAlign: "right" }}>
                  <b> TESTING DATE </b>: -
                </Col>
              </Row>

              <Table
                dataSource={[
                  ...getFixedQcRow(noQcList[key]["code"]),
                  ...noQcList[key]["items"],
                ]}
                columns={qcReportColumn(noQcList[key]["code"])}
                className="table-less-pd"
                pagination={false}
                size="small"
                bordered
                rowKey="procode"
                scroll={{ x: 800 }}
              />
            </Card>
          );
        })}
      </Card>
    </>
  );
};
export default UIQcReport;
