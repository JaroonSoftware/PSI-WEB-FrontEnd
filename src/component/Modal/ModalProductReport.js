import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Radio,
  Space,
  Modal,
  Button,
  Select,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";
import { REPORT_TYPE } from "context/constant";

const ModalProductReport = ({ isOpen, onClose, getReportData }) => {
  const [codeList, setCodeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState(REPORT_TYPE.DAILY);
  const [reportInfo, setReportInfo] = useState({
    dateQuery: [dayjs(), dayjs()],
    qcStatus: "N",
    productCode: null,
  });

  const { RangePicker } = DatePicker;

  useEffect(() => {
    if (isOpen) fetchCodeExcludeWr();
  }, [isOpen]);

  const fetchCodeExcludeWr = () => {
    SettingService.getCodeExcludeWr()
      .then(({ data }) => {
        let temp = [];
        data.forEach((item) => {
          temp.push({ value: item?.productcode, label: item?.productcode });
        });
        setCodeList(temp);
      })
      .catch((err) => console.log(err));
  };

  const handleChangeData = (value, type) => {
    setReportInfo((prev) => ({ ...prev, [type]: value }));
  };

  const reportFactory = async (data, reportInfo) => {
    if (data.length <= 0)
      return message.error("[404] : ไม่มีข้อมูลสินค้าตามเงื่อนไขที่เลือก");

    let obj = {};
    let grandTotal = 0;

    if (reportType === REPORT_TYPE.DAILY) {
      data.forEach((item) => {
        const key = `${item?.pdate}:${item?.code}`;
        if (!obj[key]) obj[key] = { items: [], totalWeight: 0, grandTotal: 0 };
        obj[key]["items"].push(item);
        obj[key]["totalWeight"] += item?.weight;
      });
    } else if (reportType === REPORT_TYPE.LOCATION) {
      data.forEach((item) => {
        const location = item?.location;
        if (!obj[location]) obj[location] = { items: [], totalWeight: 0 };
        obj[location]["items"].push(item);
        obj[location]["totalWeight"] += item?.weight;
        grandTotal += item?.weight;
      });
    }
    console.log(obj);
    getReportData({ data: obj, reportType, reportInfo, grandTotal });
  };

  const handleRunReport = () => {
    let reqData = {};
    let tempInfo = { ...reportInfo };

    if (reportType === REPORT_TYPE.DAILY) {
      delete tempInfo["qcStatus"];
      delete tempInfo["productCode"];
    } else if (reportType === REPORT_TYPE.LOCATION) {
      if (!tempInfo["productCode"])
        return message.warning("กรุณาเลือก 'รหัสสินค้า' ก่อนทำรายการต่อไป");
    }
    reqData = { reportType, reportInfo: tempInfo };

    setIsLoading(true);
    ProductService.getReport(reqData)
      .then(({ data }) => {
        reportFactory(data, tempInfo);
      })
      .catch((err) => {
        message.error(
          `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      title="รายงานสินค้า"
      open={isOpen}
      onCancel={onClose}
      width={400}
      maskClosable={false}
      destroyOnClose={true}
      footer={null}
    >
      <Radio.Group
        style={{ padding: "6px 10px" }}
        onChange={({ target: { value } }) => setReportType(value)}
        value={reportType}
      >
        <Space direction="vertical">
          <Radio value={REPORT_TYPE.DAILY}>
            รายงานการผลิต สินค้าสำเร็จรูปรายวัน
          </Radio>

          {reportType === REPORT_TYPE.DAILY && (
            <Row style={{ padding: "0px 22px 6px 22px" }} gutter={[16, 4]}>
              <Col span={24}>
                <h4 style={{ fontSize: "14px" }}>• ช่วงเวลา</h4>
              </Col>

              <Col span={24}>
                <RangePicker
                  name="dateQuery"
                  defaultValue={[dayjs(), dayjs()]}
                  onChange={(value) => handleChangeData(value, "dateQuery")}
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                />
              </Col>
            </Row>
          )}

          <Radio value={REPORT_TYPE.LOCATION}>
            รายงานสต็อกคงเหลือตาม Location
          </Radio>

          {reportType === REPORT_TYPE.LOCATION && (
            <Row style={{ padding: "0px 22px 6px 22px" }} gutter={[16, 4]}>
              <Col span={24}>
                <h4 style={{ fontSize: "14px" }}>• ช่วงเวลา</h4>
              </Col>

              <Col span={24}>
                <RangePicker
                  name="dateQuery"
                  defaultValue={[dayjs(), dayjs()]}
                  onChange={(value) => handleChangeData(value, "dateQuery")}
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                />
              </Col>

              <Col span={12}>
                <h4 style={{ fontSize: "14px", marginTop: "6px" }}>• สถานะ</h4>
                <Select
                  name="qcStatus"
                  style={{ width: "90%" }}
                  onChange={(value) => handleChangeData(value, "qcStatus")}
                  defaultValue="N"
                  options={[
                    { value: "N", label: "ยังไม่ทดสอบ" },
                    { value: "Y", label: "ทดสอบแล้ว" },
                  ]}
                />
              </Col>

              <Col span={12}>
                <h4 style={{ fontSize: "14px", marginTop: "6px" }}>
                  • รหัสสินค้า
                </h4>
                <Select
                  name="productCode"
                  placeholder="เลือกรหัสสินค้า"
                  onChange={(value) => handleChangeData(value, "productCode")}
                  style={{ width: "100%" }}
                  options={codeList}
                />
              </Col>
            </Row>
          )}

          <Radio value={REPORT_TYPE.STOCK_CARD} disabled>รายงาน Stock Card </Radio>
        </Space>
      </Radio.Group>

      <Button
        type="primary"
        style={{
          width: "100%",
          marginTop: "1.25rem",
          backgroundColor: "#da2a35",
        }}
        onClick={handleRunReport}
        loading={isLoading}
      >
        ยืนยัน
      </Button>
    </Modal>
  );
};

export default ModalProductReport;
