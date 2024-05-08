import React, { forwardRef } from "react";
import { Card, Row, Col, Table } from "antd";
import { COLUMN } from "context/column";
import ReportHeader from "component/report/layout/ReportHeader";
import dayjs from "dayjs";
import { dateFormat } from "utils/utils";

const ProductLocationReport = forwardRef(({ printData }, ref) => {
  let { reportInfo, grandTotal } = printData;
  let currentDate = dayjs().format("DD/MM/YYYY");
  let currentTime = dayjs().format("HH:mm:ss");

  return (
    <div style={{ display: "none" }}>
      <Card ref={ref} title={null} style={{ marginBottom: "8px" }}>
        <ReportHeader />
        <Row style={{ marginTop: "10px" }}>
          <Col xs={16}>
            <h2 className="psi-title-report">รายงานตรวจสอบตาม Location</h2>
            <h2 style={{ fontSize: "14px" }}>
              Product : {reportInfo?.productCode} | Grand Total :{" "}
              {grandTotal?.toLocaleString()}
            </h2>
            <div style={{ fontSize: "14px" }}>
              รายงานตรวจสอบตั้งแต่วันที่{" "}
              {reportInfo && dateFormat(reportInfo?.dateQuery[0])} ถึง{" "}
              {reportInfo && dateFormat(reportInfo?.dateQuery[1])}
            </div>
          </Col>
          <Col xs={8}>
            วันที่พิมพ์ : {currentDate}
            <br />
            เวลาพิมพ์ : {currentTime}
          </Col>
        </Row>

        {printData.data &&
          Object.keys(printData?.data).map((key, index) => {
            let { data } = printData;
            data[key]["items"].push({
              procode: "totalWeight-" + index + 1,
              key: "totalWeight",
              weight: data[key]["totalWeight"],
            });
            return (
              <Table
                dataSource={data[key]["items"]}
                columns={COLUMN.PRODUCT_LOCATION_REPORT}
                className="report-table"
                pagination={false}
                size="small"
                rowKey="procode"
                bordered
                key={index}
              />
            );
          })}
      </Card>
    </div>
  );
});

export default ProductLocationReport;
