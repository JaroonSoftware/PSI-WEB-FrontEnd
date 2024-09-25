import React, { useEffect, useState } from "react";
import { Card, Space, Table, DatePicker, Radio, Tabs, message } from "antd";
import RwiService from "services/RwiService";
import $ from 'jquery';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

$(function() {
  $('.table-row-light-remove').each(function() {
    $(this).find('td').first().attr('colspan', '5');
    $(this).find('td').slice(1, 5).remove();
  });
});


const UICustomerReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [reportData1, setReportData1] = useState([]);
  const [reportData2, setReportData2] = useState([]);
  const [tabType, setTabType] = useState(1);

  const handleTabChange = (key) => {
    setTabType(Number(key));
  };

  const fetchCustomer = (product, dateRange) => {
    let reqData = {
      PdCodeQuery: product,
      dateQuery: dateRange,
      type: tabType
    };

    if (dateRange && dateRange.length > 0 && product) {
      if (tabType == 1) {
        setIsLoading(true);
        RwiService.getCustomerReport(reqData)
          .then(({ data }) => {
            setReportData1(data.items);
          })
          .catch((err) => {
            message.error(
              `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
            );
          })
          .finally(() => setIsLoading(false));
      }
      else {
        setIsLoading(true);
        RwiService.getCustomerReport(reqData)
          .then(({ data }) => {
            setReportData2(data.items);
          })
          .catch((err) => {
            message.error(
              `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
            );
          })
          .finally(() => setIsLoading(false));
      }
    }
  };

  const onProductChange = (e) => {
    const selectedProduct = e.target.value;
    setProduct(selectedProduct);
    fetchCustomer(selectedProduct, dateRange);
  };

  const onDateChange = (value) => {
    setDateRange(value);
    fetchCustomer(product, value);
  };

  const tab1Columns = [
    {
      title: "ลำดับที่",
      dataIndex: "index",
      key: "index",
      width: "70px",
      align: "center",
      render: (_, __, idx) => idx + 1,
    },
    {
      title: "รหัสลูกค้า",
      dataIndex: "cusno",
      key: "cusno",
    },
    {
      title: "ชื่อลูกค้า",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เครดิต",
      dataIndex: "total_credit",
      key: "total_credit",
      align: "right",
    },
    {
      title: "ปริมาณ(ตัน)",
      dataIndex: "total_unit",
      key: "total_unit",
      align: "right",
      render: (value) => (value / 1000).toLocaleString("en-US", { minimumFractionDigits: 3 }),
    },
    {
      title: "จำนวนเงิน(บาท)",
      dataIndex: "total_price",
      key: "total_price",
      align: "right",
      render: (value) => value.toLocaleString("en-US", { minimumFractionDigits: 2 }),
    },
  ];

  const tab2Columns = [
    {
      title: "ลำดับที่",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record) => (record.isSummary ? "รวม" : record.index + 1),
    },
    {
      title: "ขนาด",
      dataIndex: "size",
      key: "size",
      align: "center",
      render: (value) => {
        const numValue = Number(value);
        return numValue.toLocaleString("en-US", { minimumFractionDigits: 2 });
      },
    },
    {
      title: "ชื่อลูกค้า",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "วันที่ขาย",
      dataIndex: "gdsdate",
      key: "gdsdate"
    },
    {
      title: "Invoice No.",
      dataIndex: "invno",
      key: "invno"
    },
    {
      title: "น้ำหนัก",
      dataIndex: "total_unit",
      key: "total_unit",
      render: (value) => {
        const numValue = Number(value);
        return numValue.toLocaleString("en-US")
      },
    },
    {
      title: "ราคา",
      dataIndex: "u_price",
      key: "u_price",
      render: (value) => {
        const numValue = Number(value);
        return numValue.toLocaleString("en-US", { minimumFractionDigits: 2 })
      },
    },
    {
      title: "จำนวนเงิน(บาท)",
      dataIndex: "total_price",
      key: "total_price",
      render: (value) => {
        const numValue = Number(value);
        return numValue.toLocaleString("en-US", { minimumFractionDigits: 2 })
      },
    },

    {
      title: "เครดิต",
      dataIndex: "credit",
      key: "credit"
    },
    {
      title: "ชื่อ Sale",
      dataIndex: "sale_name",
      key: "sale_name"
    },
  ];

  const addSummaryRow = (data) => {
    const preparedData = [];
    const customerGroups = {};

    data.forEach((item) => {
      if (!customerGroups[item.name]) {
        customerGroups[item.name] = [];
      }
      customerGroups[item.name].push(item);
    });

    Object.entries(customerGroups).forEach(([name, items]) => {
      items.forEach((item, index) => {
        preparedData.push({
          ...item,
          isSummary: false,
          index: preparedData.length,
        });
      });
      const totalWeight = items.reduce((sum, item) => sum + item.total_unit, 0);
      const totalAmountThb = items.reduce((sum, item) => sum + item.total_price, 0);

      preparedData.push({
        isSummary: true,
        size: "",
        total_unit: totalWeight,
        total_price: totalAmountThb,
        u_price: "",
        credit: "",
        sale_name: "",
      });
    });

    return preparedData;
  };

  const AllReportData2 = addSummaryRow(reportData2);


  return (
    <Card className="card-dashboard">
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        <TabPane tab="รายงานยอดขาย ลูกค้า1" key="1">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontSize: "18px" }}>รายงานสรุปยอดขาย (ลูกค้า)</h1>
            <Space>
              <Radio.Group onChange={onProductChange} value={product}>
                <Radio value="pcw">PCW</Radio>
                <Radio value="pcs">PCS</Radio>
              </Radio.Group>

              <RangePicker
                style={{ width: "230px" }}
                format={"DD/MM/YYYY"}
                onChange={onDateChange}
              />
            </Space>
          </div>
          <Table
            dataSource={reportData1}
            columns={tab1Columns}
            style={{ marginTop: "1rem" }}
            className="table-less-pd"
            pagination={false}
            size="small"
            bordered
            rowKey="cusno"
            loading={isLoading}
            summary={() => {

              let totalUnit = 0;
              let totalPrice = 0;

              reportData1.forEach(({ total_unit, total_price }) => {
                totalUnit += total_unit;
                totalPrice += total_price;
              });

              return (
                <Table.Summary.Row className="table-row-light">
                  <Table.Summary.Cell className="text-center" colSpan={4}>รวม</Table.Summary.Cell>
                  <Table.Summary.Cell className="text-right">
                    {(totalUnit / 1000).toLocaleString("en-US", { minimumFractionDigits: 3 })}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className="text-right">
                    {totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}

          />
        </TabPane>
        <TabPane tab="รายงานยอดขาย ลูกค้า2" key="2">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontSize: "18px" }}>รายงานยอดขาย (ขนาด)</h1>
            <Space>
              <Radio.Group onChange={onProductChange} value={product}>
                <Radio value="pcw">PCW</Radio>
                <Radio value="pcs">PCS</Radio>
              </Radio.Group>

              <RangePicker
                style={{ width: "230px" }}
                format={"DD/MM/YYYY"}
                onChange={onDateChange}
              />
            </Space>
          </div>
          {console.log("AllReportData2", AllReportData2)}
          <Table
            rowClassName={(record) => record.isSummary && "table-row-light-remove"}
            dataSource={AllReportData2}
            columns={tab2Columns}
            pagination={false}
            size="small"
            bordered
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default UICustomerReport;
