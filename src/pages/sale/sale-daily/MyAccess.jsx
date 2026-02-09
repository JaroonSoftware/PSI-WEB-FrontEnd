/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
// import { Badge } from "antd";
import {
  Collapse,
  Form,
  Flex,
  Row,
  Col,
  Space,
  Card,
  message,
  Input,
  DatePicker,
  Typography,
  Empty,
  Divider,
  Button,
  Table,
  Radio,
} from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { accessColumn } from "./model";
import { useNavigate } from "react-router-dom";

import "./MyPage.css";
import dayjs from "dayjs";
// import OptionService from "../../../service/ERP/Options.service";
// import dayjs from 'dayjs';
// import ReportService from "../../../../service/ERP/Report.service";
import RwiService from "services/RwiService";
import { formatMoney } from "../../../utils/utils";
import { TbFileExport } from "react-icons/tb";
// const opService = OptionService();
// const reportservice = ReportService();

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const UISaleDailyAccess = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [product, setProduct] = useState("pcw");
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);

  // const { Text } = Typography;

  // useEffect(() => {
  //   if (dateRange) {
  //     fetchStock();
  //   } else {
  //     setData([]);
  //   }
  // }, [dateRange]);

  const onDateChange = (date) => {
    setDateRange(date);
  };

  const onProductChange = (e) => {
    const selectedProduct = e.target.value;
    setProduct(selectedProduct);
  };

  const fetchStock = () => {
    let reqData = {
      pdCodeQuery: product,
      dateQuery: dateRange
    };

    const base = process.env.PUBLIC_URL || "";
    const date1 = dateRange?.[0]?.format("MM-DD-YYYY");
    const date2 = dateRange?.[1]?.format("MM-DD-YYYY");
    const url = `${base}/sale/daily-report-print/${product}/${date1}${date2 ? `/${date2}` : ""}`;
    const newWindow = window.open(url, "PSI_SALE_DAILY_PRINT");
    if (newWindow) {
      try { newWindow.focus(); } catch (e) {}
    }
    if (!newWindow) {
      message.warning("Popup ถูกบล็อก กรุณาอนุญาตป๊อปอัปสำหรับไซต์นี้");
      return;
    }

    // newWindow.location.href = `/psp-print/${recode?.psp_code}/${recode?.version}`;

    // if (dateRange && dateRange.length > 0) {
    // RwiService.getSaleDaily(reqData)
    //   .then(({ data }) => {
    //     let { items } = data;

    //     let obj = {};

    //     items.forEach((i, idx) => {
    //       let key = i.productcode;

    //       if (!obj[key]) {
    //         obj[key] = {
    //           items: [],
    //           venCode: i.vendor,
    //           venName: i.ven_name,
    //           totalSupWeight: 0,
    //           totalWeight: 0,
    //           totalQuantity: 0,
    //           remaining: 0,
    //           productCode: i.productcode,
    //         };
    //       }
    //       obj[key]["items"].push({
    //         index: idx,
    //         key: i.lc_no + "@" + i.charge_no,
    //         ...i,
    //       });
    //       obj[key]["totalSupWeight"] += i.total_sup_weight;
    //       obj[key]["totalWeight"] += i.total_weight;
    //       obj[key]["totalQuantity"] += i.quantity;
    //       obj[key]["remaining"] += i.remaining;
    //     });

    //     let arrayItem = [];
    //     let totalKeys = Object.keys(obj);

    //     for (let k of totalKeys) {
    //       arrayItem = [...arrayItem, ...obj[k].items];
    //       arrayItem.push({
    //         key: k + "#SUM",
    //         venCode: obj[k].venCode,
    //         venName: obj[k].venName,
    //         total_sup_weight: obj[k].totalSupWeight,
    //         total_weight: obj[k].totalWeight,
    //         quantity: obj[k].totalQuantity,
    //         productCode: obj[k].productCode,
    //         remaining: obj[k].remaining,
    //       });
    //     }
    //     setData(arrayItem);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // }
  };

  return (
    <div className="saledaily-report">
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Card bordered className="report-toolbar">
          <Row align="middle" gutter={[12, 12]}>
            <Col flex="auto">
              <Title level={4} style={{ margin: 0 }}>รายงานสรุปยอดขายรายวัน</Title>
              <Text type="secondary">เลือกประเภทสินค้าและช่วงวันที่ จากนั้นกดค้นหา</Text>
            </Col>
            <Col>
              <Space wrap>
                <Radio.Group onChange={onProductChange} value={product}>
                  <Radio value="pcw">PCW</Radio>
                  <Radio value="pcs">PCS</Radio>
                </Radio.Group>
                <RangePicker
                  style={{ width: 260 }}
                  format={"DD/MM/YYYY"}
                  onChange={onDateChange}
                  value={dateRange}
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={fetchStock}>
                  ค้นหา
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card className="table-card" style={{ height: "600px" }} bordered>
          {/* {(data && data.length > 0) ? (
            <Table
              size="small"
              rowKey={(record) => record.seq || record.key || `${record.productCode}-${record.index}`}
              columns={accessColumn}
              dataSource={data}
              scroll={{ x: "max-content" }}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" size={4}>
                  <Text>ยังไม่มีข้อมูล</Text>
                  <Text type="secondary">ขั้นตอนใช้งาน:</Text>
                  <Text>- เลือกประเภทสินค้า (PCW/PCS)</Text>
                  <Text>- เลือกช่วงวันที่ที่ต้องการ</Text>
                  <Text>- กดปุ่ม "ค้นหา" เพื่อแสดงรายงาน</Text>
                </Space>
              }
            /> 
          )} */}
        </Card>
      </Space>
    </div>
  );
};

export default UISaleDailyAccess;
