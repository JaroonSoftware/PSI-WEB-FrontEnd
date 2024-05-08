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

      // temp[t.vendor][t.product_code]["totalWeight"] += t.total_weight;
      // temp[t.vendor][t.product_code]["totalCoil"] += t.coil_qty;

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
            console.log(dateKey);

            let arrayUsed = [...data[dateKey]["items"]];
            let temp = createTemp(arrayUsed);

            let current = {
              vendor: arrayUsed[0].vendor,
              name: arrayUsed[0].ven_name,
            };
            let lastIndex = data[dateKey]["items"].length - 1;
            let currentIndex = 0;

            let currentCode = arrayUsed[0].product_code;
            console.log("======================");

            console.log(temp);
            console.log(temp[currentCode]);

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

              // if (
              //   !t?.key &&
              //   (current.vendor !== t.vendor || currentCode !== t.product_code)
              // ) {
              //   console.log(currentCode, t.product_code);
              //   // currentCode !== t.product_code &&
              //   console.log("SS ==> ", temp[current.vendor][currentCode]);
              //   arrayUsed.splice(currentIndex, 0, {
              //     key: "sumProduct",
              //     procode: `รวม [${currentCode}]`,
              //     total_weight: temp[current.vendor][currentCode]?.totalWeight,
              //     sumTotalCoil: temp[current.vendor][currentCode]?.totalCoil,
              //   });

              //   currentCode = t.product_code;
              // }

              currentIndex++;
            });

            arrayUsed = [
              ...arrayUsed,
              // {
              //   key: "sumProduct",
              //   procode: `รวม [${currentCode}]`,
              //   total_weight: temp[current.vendor][currentCode]?.totalWeight,
              //   sumTotalCoil: temp[current.vendor][currentCode]?.totalCoil,
              // },
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
                  // bordered
                />
              </React.Fragment>
            );
          })}
      </Card>
    </div>
  );
});

export default WRImportReport;
