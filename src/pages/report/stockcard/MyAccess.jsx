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
  Select,
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

const UIStockCardAccess = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [product, setProduct] = useState("pcw42");
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [loading, setLoading] = useState(false);

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

  const onProductChange = (value) => {
    setProduct(value);
  };

  const fetchStock = async () => {
    if (!dateRange?.[0] || !dateRange?.[1]) {
      message.warning("กรุณาเลือกช่วงวันที่");
      return;
    }

    const date1 = dateRange?.[0]?.format("YYYY-MM-DD");
    const date2 = dateRange?.[1]?.format("YYYY-MM-DD");

    const reqData = {
      pdCodeQuery: product,
      dateQuery: [date1, date2],
    };

    setLoading(true);
    try {
      const resp = await RwiService.getStockCard(reqData);
      setData(resp?.data?.items || []);
      if (!resp?.data?.items || resp.data.items.length === 0) {
        message.info("ไม่พบข้อมูลในช่วงวันที่ที่เลือก");
      }
    } catch (err) {
      console.log(err);
      message.error("ดึงข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const openPrint = () => {
    if (!dateRange?.[0] || !dateRange?.[1]) {
      message.warning("กรุณาเลือกช่วงวันที่");
      return;
    }

    const base =
      process.env.PUBLIC_URL ||
      (window.location.pathname.startsWith("/webpsi") ? "/webpsi" : "");
    const date1 = dateRange?.[0]?.format("YYYY-MM-DD");
    const date2 = dateRange?.[1]?.format("YYYY-MM-DD");
    const url = `${base}/stockcard-report-print/${product}/${date1}${date2 ? `/${date2}` : ""}`;
    const newWindow = window.open(url, "PSI_STOCKCARD_PRINT");
    if (newWindow) {
      try {
        newWindow.focus();
      } catch (e) {}
    }
    if (!newWindow) {
      message.warning("Popup ถูกบล็อก กรุณาอนุญาตป๊อปอัปสำหรับไซต์นี้");
    }
  };

  return (
    <div className="stockcard-report">
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Card bordered className="report-toolbar">
          <Row align="middle" gutter={[12, 12]}>
            <Col flex="auto">
              <Title level={4} style={{ margin: 0 }}>รายงานสต๊อกการ์ด</Title>
              <Text type="secondary">เลือกประเภทสินค้าและช่วงวันที่ จากนั้นกดค้นหา</Text>
            </Col>
            <Col>
              <Space wrap>
                <Select
                  style={{ width: 160 }}
                  value={product}
                  onChange={onProductChange}
                  options={[
                    // { value: "all", label: "ทั้งหมด" },
                    { value: "pcw42", label: "PCW42" },
                    { value: "pcw43", label: "PCW43" },
                    { value: "pcw52", label: "PCW52" },
                    { value: "pcw72", label: "PCW72" },
                    { value: "pcw92", label: "PCW92" },
                    { value: "crd", label: "CRD" },
                  ]}
                />
                <RangePicker
                  style={{ width: 260 }}
                  format={"DD/MM/YYYY"}
                  onChange={onDateChange}
                  value={dateRange}
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={fetchStock}>
                  ค้นหา
                </Button>
                <Button
                  icon={<TbFileExport />}
                  onClick={openPrint}
                  disabled={!data || data.length === 0}
                >
                  Print
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card className="table-card" style={{ height: "600px" }} bordered>
          {data && data.length > 0 ? (
            <Table
              size="small"
              rowKey={(record) => record.key || `${record.productcode || ""}-${record.trx_date || ""}-${record.doc_no || ""}`}
              columns={accessColumn}
              dataSource={data}
              loading={loading}
              scroll={{ x: "max-content", y: 480 }}
              pagination={false}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" size={4}>
                  <Text>ยังไม่มีข้อมูล</Text>
                  <Text type="secondary">ขั้นตอนใช้งาน:</Text>
                  <Text>- เลือกประเภทสินค้า</Text>
                  <Text>- เลือกช่วงวันที่ที่ต้องการ</Text>
                  <Text>- กดปุ่ม "ค้นหา" เพื่อแสดงรายงาน</Text>
                </Space>
              }
            />
          )}
        </Card>
      </Space>
    </div>
  );
};

export default UIStockCardAccess;
