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
} from "antd";
import { Button, Table, Radio } from "antd";
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

const UISaleDailyAccess = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [product, setProduct] = useState("");

  const [dateRange, setDateRange] = useState([dayjs()]);

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
    const newWindow = window.open(url, "_blank");
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
      <Space
        direction="vertical"
        size="middle"
        style={{ display: "flex", position: "relative" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "18px" }}>รายงานสรุปยอดขาย (ลูกค้า)</h1>
          <Space>

            <Radio.Group 
            onChange={onProductChange} 
            value={product}>                            
                            <Radio value="pcw">PCW</Radio>
                            <Radio value="pcs">PCS</Radio>
                          </Radio.Group>

              <RangePicker
                style={{ width: "230px" }}
                format={"DD/MM/YYYY"}
                onChange={onDateChange}
                value={dateRange}
              />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={fetchStock}
            >
              ค้นหา
            </Button>
          </Space>
        </div>
        <Card>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Table
                size="small"
                rowKey="seq"
                columns={accessColumn}
                dataSource={data}
                scroll={{ x: "max-content" }}
              />
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  );
};

export default UISaleDailyAccess;
