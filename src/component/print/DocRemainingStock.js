import React, { useEffect, useState } from "react";
import { Table, Row, Col, Card } from "antd";
import logo from "assets/image/psi.jpg";
import { dateFormat } from "utils/utils";

const DocRemainingStock = React.forwardRef(
  ({ printData, columns, date }, ref) => {
    const [list, setList] = useState([]);

    useEffect(() => {
      if (Array.isArray(printData) && printData.length) {
        const sumTotal = {
          key: "#SUM_TOTAL",
          totalQuantity: 0,
          totalWeight: 0,
          totalRemaining: 0,
          totalSupWeight: 0,
        };

        printData.forEach(
          ({ vendor, quantity, total_weight, remaining, total_sup_weight }) => {
            if (vendor) {
              sumTotal["totalQuantity"] += quantity;
              sumTotal["totalWeight"] += total_weight;
              sumTotal["totalRemaining"] += remaining;
              sumTotal["totalSupWeight"] += total_sup_weight;
            }
          }
        );

        setList([...printData, sumTotal]);
      } else {
        setList([]);
      }
    }, [printData]);

    return (
      <div>
        <Card ref={ref}>
          <Row>
            <Col flex="120px" style={{ textAlign: "center" }}>
              <img src={logo} style={{ width: "80px" }} />
            </Col>
            <Col
              flex="auto"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                alignSelf: "center",
                color: "black",
              }}
            >
              PENSIRI STEEL INDUSTRIES CO., LTD.
            </Col>
          </Row>
          <Row>
            <Col
              xs={24}
              style={{
                fontSize: "16px",
                textAlign: "center",
                color: "black",
                marginTop: "5px",
              }}
            >
              รายงานสต็อกคงเหลือประจำวันที่ {dateFormat(date)}
            </Col>
          </Row>

          <Table
            dataSource={list}
            columns={columns}
            style={{ marginTop: "1.5rem" }}
            pagination={false}
            size="small"
            bordered
            className="antd-custom-border-table table-less-pd table-less-font"
          />
        </Card>
      </div>
    );
  }
);

export default DocRemainingStock;
