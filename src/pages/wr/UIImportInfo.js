import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Space, DatePicker, Select } from "antd";
import { PrinterFilled } from "@ant-design/icons";
import { dateFormat } from "utils/utils";
import RwiService from "services/RwiService";
import { useReactToPrint } from "react-to-print";
import DocImport from "component/print/DocImport";
import TableImportPrinted from "component/table/TableImportPrinted";

const UIImportReport = () => {
  const [dataList, setDataList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [dateQuery, setDateQuery] = useState([]);
  const [currentVendor, setCurrentVendor] = useState();
  const printRef = useRef();

  const { RangePicker } = DatePicker;

  useEffect(() => {
    fetchVendor();
  }, []);

  useEffect(() => {
    if (dateQuery) fetchWireRod();
  }, [dateQuery, currentVendor]);

  const printProcess = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrint = () => {
    if (dateQuery && dataList && dateQuery.length > 0 && dataList.length > 0) {
      printProcess();
    }
  };
  const fetchWireRod = () => {
    let startDate = dateQuery[0];
    let endDate = dateQuery[1];

    if (!startDate || !endDate) return setDataList([]);

    RwiService.getImportWireRod({ startDate, endDate, vendor: currentVendor })
      .then(({ data }) => {
        let { items } = data;

        let obj = {};

        items.forEach((i, idx) => {
          let key = i.vendor + "@" + i.productcode;
          // let key = i.pdate

          if (!obj[key]) {
            obj[key] = {
              items: [],
              venCode: i.vendor,
              venName: i.ven_name,
              totalWeight: 0,
              totalQuantity: 0,
              remaining: 0,
              productCode: i.productcode,
            };
          }

          obj[key]["items"].push({
            index: idx,
            key: i.lc_no + "@" + i.charge_no,
            ...i,
          });
          obj[key]["totalWeight"] += i.total_weight;
          obj[key]["totalQuantity"] += i.quantity;
          obj[key]["remaining"] += i.remaining;
        });

        let arrayItem = [];
        let totalKeys = Object.keys(obj);

        for (let k of totalKeys) {
          arrayItem = [...arrayItem, ...obj[k].items];
          arrayItem.push({
            key: k + "#SUM",
            venCode: obj[k].venCode,
            venName: obj[k].venName,
            total_weight: obj[k].totalWeight,
            quantity: obj[k].totalQuantity,
            productCode: obj[k].productCode,
            remaining: obj[k].remaining,
          });
        }

        setDataList(arrayItem);
      })
      .catch((err) => console.log(err));
  };

  const fetchVendor = () => {
    RwiService.getVendor()
      .then(({ data }) => {
        let vList = data?.items.map((item) => ({
          value: item.vendor,
          label: item.ven_name,
        }));

        setVendorList(vList);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Card className="card-dashboard">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "18px" }}>ข้อมูลการรับ Wire Rod</h1>
          <Space>
            <Button
              type="primary"
              key="print"
              onClick={handlePrint}
              icon={<PrinterFilled />}
            >
              พิมพ์
            </Button>
            <Select
              placeholder="ค้นหาแบบ ระบุผู้ขาย"
              style={{ width: 300 }}
              onChange={(value) => setCurrentVendor(value)}
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label.toLowerCase() ?? "").includes(
                  input.toLowerCase()
                )
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={vendorList}
            />

            <RangePicker
              name="timeQuery"
              onChange={(value) => {
                if (!value) value = [];
                setDateQuery(value);
              }}
              style={{ width: "230px" }}
              format={"DD/MM/YYYY"}
            />
          </Space>
        </div>

        <TableImportPrinted data={dataList} />

        {dataList && (
          <div style={{ display: "none" }}>
            <DocImport ref={printRef} printData={dataList} date={dateQuery} />
          </div>
        )}
      </Card>
    </>
  );
};

export default UIImportReport;
