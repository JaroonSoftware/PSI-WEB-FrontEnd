import React, { forwardRef } from "react";
import { Card, Row, Col, Table } from "antd";
import logo from "assets/image/psi.jpg";
import dayjs from "dayjs";
import ReportHeader from "component/report/layout/ReportHeader";
import { COLUMN } from "context/column";
import { dateFormat } from "utils/utils";

const WRExportReport = forwardRef(({ printData }, ref) => {
  let { data, dateQuery } = printData;
  let currentDate = dayjs().format("DD/MM/YYYY");
  let currentTime = dayjs().format("HH:mm:ss");

  return (
    <div style={{ display: "none" }}>
      <Card ref={ref} title={null} style={{ marginBottom: "8px" }}>
        <ReportHeader />
        <Row style={{ marginTop: "10px" }}>
          <Col xs={16}>
            <h2 className="psi-title-report">รายงานการเบิก WIREROD</h2>
            <div style={{ fontSize: "14px" }}>
              รายงานการตัดสต็อกตั้งแต่ วันที่{" "}
              {dateQuery && dateFormat(dateQuery[0])} ถึง{" "}
              {dateQuery && dateFormat(dateQuery[1])}
            </div>
          </Col>
          <Col xs={8}>
            วันที่พิมพ์ : {currentDate}
            <br />
            เวลาพิมพ์ : {currentTime}
          </Col>
        </Row>

        <Table
          dataSource={data}
          columns={COLUMN.WIREROD_EXPORT_REPORT}
          className="report-table"
          pagination={false}
          size="small"
          rowKey="wr_code"
          bordered
        />

        <Row
          gutter={[0, 12]}
          style={{ textAlign: "center", marginTop: "2.5rem" }}
        >
          <Col span={12}>
            ลงชื่อ ............................................................
            (ผู้เบิก)
          </Col>
          <Col span={12}>
            ลงชื่อ ............................................................
            (ผู้จ่าย)
          </Col>
          <Col span={12}>
            วันที่
            ..................../..................../....................{" "}
          </Col>
          <Col span={12}>
            วันที่
            ..................../..................../....................{" "}
          </Col>
        </Row>
      </Card>
    </div>
  );
});

export default WRExportReport;
