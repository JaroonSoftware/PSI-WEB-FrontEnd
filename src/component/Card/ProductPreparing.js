import React, { forwardRef } from "react";
import { Card, Row, Col, Table } from "antd";
import logo from "assets/image/psi.jpg";
import dayjs from "dayjs";
import ReportHeader from "component/report/layout/ReportHeader";
import { COLUMN } from "context/column";
import { dateFormat } from "utils/utils";

const ProductPreparing = forwardRef(({ printData }, ref) => {
  let { invoice, list } = printData;
  let currentDate = dayjs().format("DD/MM/YYYY");
  let currentTime = dayjs().format("HH:mm:ss");
  console.log(printData);

  return (
    <div style={{ display: "none" }}>
      <Card ref={ref} title={null} style={{ marginBottom: "8px" }}>
        <ReportHeader />
        <Row style={{ marginTop: "10px" }}>
          <Col xs={16}>
            <h2 className="psi-title-report">ใบจัดเตรียมสินค้า</h2>
            <div style={{ fontSize: "14px" }}>
              ชื่อลูกค้า {invoice[0]?.cusname}
            </div>
            <div style={{ fontSize: "14px" }}>
              ใบอนุมัติจ่าย {invoice[0]?.gdspay}
            </div>
          </Col>
          <Col xs={8}>
            วันที่พิมพ์ : {currentDate}
            <br />
            เวลาพิมพ์ : {currentTime}
          </Col>
        </Row>

        <Table
          dataSource={list}
          columns={COLUMN.PRODUCT_PREPARING_LIST}
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
          <Col span={8}>
            <Row>
              <Col span={24}>
                ลงชื่อ .........................................................
              </Col>
              <Col span={24}> (ผู้จัดสินค้า) </Col>
            </Row>
          </Col>

          <Col span={8}>
            <Row>
              <Col span={24}>
                ลงชื่อ .........................................................
              </Col>
              <Col span={24}> (ผู้จัดสินค้าขึ้นรถ) </Col>
            </Row>
          </Col>

          <Col span={8}>
            <Row>
              <Col span={24}>
                ลงชื่อ .........................................................
              </Col>
              <Col span={24}> (พนักงานขับรถ) </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
});

export default ProductPreparing;
