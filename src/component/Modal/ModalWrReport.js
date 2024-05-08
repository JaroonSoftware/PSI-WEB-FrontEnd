import React, { useState, useRef } from "react";
import {
  Col,
  Row,
  Radio,
  Space,
  Modal,
  Button,
  DatePicker,
  message,
} from "antd";
import dayjs from "dayjs";
import WireRodService from "services/WireRodService";
import { REPORT_TYPE } from "context/constant";

const ModalWrReport = ({ isOpen, onClose, getReportData, from }) => {
  const [reportType, setReportType] = useState(REPORT_TYPE.BY_DATE);
  const [dateValue, setDateValue] = useState([dayjs(), dayjs()]);
  const [isLoading, setIsLoading] = useState(false);

  const { RangePicker } = DatePicker;

  const handleChangeData = (value) => {
    setDateValue(value);
  };

  const reportFactory = async (data, dateQuery) => {
    if (data.length <= 0)
      return message.error("[404] : ไม่มีข้อมูลสินค้าตามเงื่อนไขที่เลือก");
    let reportData = {};

    if (reportType === REPORT_TYPE.BY_DATE) {
      if (from === "EXPORT") {
        let items = [];
        let totalWeight = 0;
        let totalLWeight = 0;

        data.forEach((item) => {
          totalWeight += item?.weight;
          totalLWeight += item?.lweight;
          item["id"] = `${item?.lc_no}:${item?.charge_no}`;
        });

        let summaryItems = {
          key: "sum",
          weight: totalWeight,
          lweight: totalLWeight,
        };

        reportData = { data: [...items, summaryItems], reportType, dateQuery };
      } else if (from === "IMPORT") {
        let obj = {};

        data.forEach((item) => {
          const dateKey = item?.rcv_date;

          if (!obj[dateKey]) {
            obj[dateKey] = { items: [], sumDate: 0 };
          }

          obj[dateKey]["items"].push(item);
          obj[dateKey]["sumDate"] += item?.total_weight;
        });

        // data.forEach((item) => {
        //   const dateKey = item?.rcv_date;
        //   const vendorKey = item?.vendor;
        //   const productKey = item?.product_code;
        //   const totalWeight = item?.total_weight;

        //   if (!obj[dateKey]) {
        //     obj[dateKey] = {};
        //   }

        //   if (!obj[dateKey][vendorKey]) {
        //     obj[dateKey][vendorKey] = { vendorWeight: 0 };
        //   }

        //   if (!obj[dateKey][vendorKey][productKey]) {
        //     obj[dateKey][vendorKey][productKey] = {
        //       items: [],
        //       totalWeight: 0,
        //     };
        //   }

        //   obj[dateKey][vendorKey][productKey]["items"].push(item);
        //   obj[dateKey][vendorKey][productKey]["totalWeight"] += totalWeight;
        //   obj[dateKey][vendorKey]["vendorWeight"] += totalWeight;
        // });

        reportData = { data: obj, reportType, dateQuery };
      }
      getReportData(reportData);
    }
  };

  const handleRunReport = () => {
    if (!dateValue[0] || !dateValue[1])
      return message.warning("กรุณาเลือก 'วันที่' ก่อนทำรายการต่อไป");

    setIsLoading(true);

    if (reportType === REPORT_TYPE.BY_DATE) {
      let reqData = { reportType, dateQuery: dateValue };
      let usedFunc =
        from === "EXPORT"
          ? WireRodService.getWRExportReport
          : WireRodService.getWRImportReport;

      usedFunc(reqData)
        .then(({ data }) => {
          reportFactory(data, dateValue);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
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
          <Radio value={"byDate"}>เรียกรายงาน ช่วงเวลา</Radio>

          <Row style={{ padding: "0px 22px" }} gutter={[16, 4]}>
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

export default ModalWrReport;
