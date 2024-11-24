import React, { forwardRef, useEffect, useState } from "react";
import { Card, Row, Col, Table } from "antd";
import { COLUMN } from "context/column";
import ReportHeader from "component/report/layout/ReportHeader";
import dayjs from "dayjs";
import { dateFormat, delay } from "utils/utils";

const WRImportReport = forwardRef(({ printData }, ref) => {
  let { data } = printData;
  // let size = Object.keys(printData?.data).length;
  let currentDate = dayjs().format("DD/MM/YYYY");
  let currentTime = dayjs().format("HH:mm:ss");

  const createTemp = (arr) => {
    let temp = { sumDateWeight: 0, sumDateCoil: 0 };
    arr.forEach((t) => {
      if (!temp[t.vendor]) {
        temp[t.vendor] = { totalCoil: 0, totalWeight: 0 };
      }

      if (!temp[t.vendor][t.product_code]) {
        temp[t.vendor][t.product_code] = { totalCoil: 0, totalWeight: 0 };
      }

      temp[t.vendor]["totalWeight"] += t.total_weight;
      temp[t.vendor]["totalCoil"] += t.coil_qty;
      temp["sumDateWeight"] += t.total_weight;
      temp["sumDateCoil"] += t.coil_qty;
    });

    return temp;
  };

  return (
    <div style={{ display: "none" }}>
      <Card ref={ref} title={null} style={{ marginBottom: "8px" }}>
        {data &&
          Object.keys(data).map((dateKey, index) => {
            let arrayUsed = [...data[dateKey]["items"]];
            let temp = createTemp(arrayUsed);

            let current = {
              vendor: arrayUsed[0].vendor,
              name: arrayUsed[0].ven_name,
            };
            let currentIndex = 0;

            arrayUsed.forEach((t) => {
              if (current.vendor !== t.vendor && !t?.key) {
                arrayUsed.splice(currentIndex, 0, {
                  key: "sumVendor",
                  procode: `รวม [${current.vendor}]`,
                  sumVendorName: current.name,
                  total_weight: temp[current.vendor]["totalWeight"],
                  sumTotalCoil: temp[current.vendor]["totalCoil"],
                });
                current = { vendor: t.vendor, name: t.ven_name };
              }

              currentIndex++;
            });

            arrayUsed = [
              ...arrayUsed,
              {
                key: "sumVendor",
                procode: `รวม [${current.vendor}]`,
                sumVendorName: current.name,
                total_weight: temp[current.vendor]["totalWeight"],
                sumTotalCoil: temp[current.vendor]["totalCoil"],
              },
              {
                procode: "สุทธิ",
                key: "sumDate",
                total_weight: temp["sumDateWeight"],
                sumTotalCoil: temp["sumDateCoil"],
              },
            ];

            return (
              <React.Fragment key={dateKey}>
                <ReportHeader />
                <Row style={{ marginTop: "10px" }}>
                  <Col xs={16}>
                    <h2 className="psi-title-report">
                      รายงานใบบันทึกรับวัตถุดิบ
                    </h2>
                    <div style={{ fontSize: "14px" }}>
                      รายงานใบบันทึกรับวัตถุดิบวันที่ {dateFormat(dateKey)}
                    </div>
                  </Col>
                  <Col xs={8}>
                    วันที่พิมพ์ : {currentDate}
                    <br />
                    เวลาพิมพ์ : {currentTime}
                  </Col>
                </Row>
                <Table
                  dataSource={arrayUsed}
                  columns={COLUMN.WIREROD_IMPORT_REPORT}
                  style={{ pageBreakAfter: "always" }}
                  className="report-table"
                  pagination={false}
                  size="small"
                  rowKey="id"
                />
              </React.Fragment>
            );
          })}
      </Card>
    </div>
  );
});

export default WRImportReport;
