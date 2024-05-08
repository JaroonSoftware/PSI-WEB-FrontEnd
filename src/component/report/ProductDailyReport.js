import React, { forwardRef } from "react";
import { Card, Row, Col, Table } from "antd";
import { COLUMN } from "context/column";
import ReportHeader from "component/report/layout/ReportHeader";
import dayjs from "dayjs";
import { dateFormat } from "utils/utils";

const ProductDailyReport = forwardRef(({ printData }, ref) => {
  let { data } = printData;
  // let size = Object.keys(printData?.data).length;
  let currentDate = dayjs().format("DD/MM/YYYY");
  let currentTime = dayjs().format("HH:mm:ss");

  return (
    <div style={{ display: "none" }}>
      <Card ref={ref} title={null} style={{ marginBottom: "8px" }}>
        {printData.data &&
          Object.keys(printData?.data).map((key, index) => {
            let keyDate = key.split(":");

            data[key]["items"].push({
              procode: "tw-" + index,
              key: "totalWeight",
              weight: data[key]["totalWeight"],
            });

            return (
              <React.Fragment key={key + index}>
                <ReportHeader />
                <Row style={{ marginTop: "10px" }}>
                  <Col xs={16}>
                    <h2 className="psi-title-report">
                      รายงานการผลิตสินค้าสำเร็จรูปรายวัน
                    </h2>
                    <h2 style={{ fontSize: "14px" }}>
                      Product : {keyDate[1]} | {data[key]["productName"]}
                    </h2>
                    <div style={{ fontSize: "14px" }}>
                      รายงานการผลิตสินค้าสำเร็จรูปวันที่{" "}
                      {dateFormat(keyDate[0])}
                    </div>
                  </Col>
                  <Col xs={8}>
                    วันที่พิมพ์ : {currentDate}
                    <br />
                    เวลาพิมพ์ : {currentTime}
                  </Col>
                </Row>
                <Table
                  dataSource={data[key]["items"]}
                  columns={COLUMN.PRODUCT_DAILY_REPORT}
                  className="report-table"
                  pagination={false}
                  size="small"
                  rowKey="procode"
                  bordered
                  key={index}
                  style={{ pageBreakAfter: "always" }}
                />
              </React.Fragment>
            );
          })}
      </Card>
    </div>
  );
});

export default ProductDailyReport;
