import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Pagination,
  Space,
  Input,
  Row,
  Col,
  Button,
  Modal,
  message,
  Steps,
  Form,
  DatePicker,
  Tag,
} from "antd";
import { PlusOutlined, PrinterFilled } from "@ant-design/icons";
import SaleOrderService from "services/SaleOrderService";
import dayjs from "dayjs";
import SettingService from "services/SettingService";
import { render } from "@testing-library/react";

const UITaxInvoice = () => {
  const [taxList, setTaxList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [invoiceList, setInvoiceList] = useState([]);
  const [currentCus, setCurrentCus] = useState(null);
  const [selectedList, setSelectedList] = useState([]);

  const [currentStep, setCurrentStep] = useState(0);

  // === MODAL === //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [query, setQuery] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    fetchInvoiceTax();
  }, [page, pageLimit, query]);

  useEffect(() => {
    if (isModalOpen && !isEdit) {
      if (currentStep === 0) {
        fetchCustomer();
        setSelectedList([]);
      }
      if (currentStep === 1 && currentCus) fetchInvoice();
      if (currentStep === 2) {
        form.setFieldsValue({
          cus_name: currentCus?.cus_name,
          add1: currentCus?.add1,
          add2: currentCus?.add2,
          add3: currentCus?.add3,
          zip: currentCus?.zip,
          invoiceDate: dayjs(),
        });
      }
    }
  }, [isModalOpen, currentStep]);

  const fetchInvoiceTax = () => {
    SaleOrderService.getTaxInvoice({ page, pageLimit, query })
      .then(({ data }) => {
        setTaxList(data?.items);
        setTotalItems(data.total);
      })
      .catch((err) => console.log(err));
  };

  const fetchCustomer = () => {
    SaleOrderService.getTaxCustomer()
      .then(({ data }) => {
        setCustomerList(data?.items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchInvoice = () => {
    SaleOrderService.getInvoiceByCusNo(currentCus?.cus_no)
      .then(({ data }) => {
        setInvoiceList(data?.items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkDupItem = (id) => {
    let isDup = false;
    selectedList.forEach((item) => {
      if (item?.id === id) isDup = true;
    });
    return isDup;
  };

  const addOrderToInvoiceTax = (record) => {
    console.log("PRODUCT DATA ==>", record);
    setSelectedList((prev) => [...prev, record]);
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const resetData = () => {
    setCurrentStep(0);
    setIsEdit(false);
    form.resetFields();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetData();
  };

  const handleSelectCus = (record) => {
    setCurrentCus(record);
    next();
  };

  const handleSubmitInvoice = () => {
    let invoiceDate = form.getFieldValue("invoiceDate");
    let invoiceNo = form.getFieldValue("invoiceNo");

    if (invoiceDate && invoiceNo) {
      let reqData = {
        invoiceDate,
        invoiceNo,
        productList: selectedList,
      };

      if (!isEdit) {
        SaleOrderService.createInvoiceTax(reqData)
          .then(({ data }) => {
            message.success(`${data?.status} : ${data?.message}`);
            handleCloseModal();
            fetchInvoiceTax();
          })
          .catch((err) =>
            message.error("ERROR : " + err?.response?.data?.message)
          );
      } else {
        SaleOrderService.updateInvoiceTax(reqData)
          .then(({ data }) => {
            message.success(`${data?.status} : ${data?.message}`);
            handleCloseModal();
            fetchInvoiceTax();
          })
          .catch((err) =>
            message.error("ERROR : " + err?.response?.data?.message)
          );
      }
    }
  };

  const handleViewTaxInfo = (invoiceId) => {
    SaleOrderService.getTaxDetail(invoiceId)
      .then(({ data }) => {
        console.log(data);
        setIsEdit(true);
        form.setFieldsValue({
          cus_name: data[0]?.cus_name,
          add1: data[0]?.add1,
          add2: data[0]?.add2,
          add3: data[0]?.add3,
          zip: data[0]?.zip,
          invoiceDate: dayjs(data[0]?.idate),
          invoiceNo: data[0]?.invno,
        });

        setSelectedList(data);
        setIsModalOpen(true);
      })
      .catch((err) => console.log(err));
  };

  const renderTaxDetail = () => {
    return (
      <Form
        form={form}
        id="importTaxInvoice"
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={() => {}}
        autoComplete="off"
      >
        <Row
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
          gutter={[16, 16]}
        >
          <Col xs={24}>
            <div style={{ marginBottom: "10px" }}>
              <Row>
                <Col xs={4}>ชื่อลูกค้า</Col>
                <Col xs={12}>
                  <Form.Item
                    name="cus_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your data!",
                      },
                    ]}
                    style={{ marginBottom: "0px" }}
                  >
                    <Input disabled={true} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <Row>
                <Col xs={4}>ที่อยู่</Col>
                <Col xs={10}>
                  <Form.Item
                    name="add1"
                    rules={[
                      {
                        required: true,
                        message: "Please input your data!",
                      },
                    ]}
                    style={{ marginBottom: "0px" }}
                  >
                    <Input disabled={true} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <Row>
                <Col xs={4}></Col>
                <Col xs={10}>
                  <Form.Item
                    name="add2"
                    rules={[
                      {
                        required: true,
                        message: "Please input your data!",
                      },
                    ]}
                    style={{ marginBottom: "0px" }}
                  >
                    <Input disabled={true} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <Row gutter={[16, 16]}>
                <Col xs={4}></Col>
                <Col xs={10}>
                  <Form.Item
                    name="add3"
                    rules={[
                      {
                        required: true,
                        message: "Please input your data!",
                      },
                    ]}
                    style={{ marginBottom: "0px" }}
                  >
                    <Input disabled={true} />
                  </Form.Item>
                </Col>
                <Col xs={4}>
                  <Form.Item
                    name="zip"
                    rules={[
                      {
                        required: true,
                        message: "Please input your data!",
                      },
                    ]}
                    style={{ marginBottom: "0px" }}
                  >
                    <Input disabled={true} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Table
              style={{ marginTop: "1.5rem" }}
              dataSource={selectedList}
              columns={selectedColumn}
              pagination={false}
              size="middle"
              rowKey="id"
            />

            <div style={{ marginTop: "1.5rem" }}>
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <Form.Item
                    label="วันที่ออกใบกำกับภาษี"
                    name="invoiceDate"
                    rules={[
                      {
                        required: true,
                        message: "Please input your data!",
                      },
                    ]}
                    style={{ marginBottom: "0px" }}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format={"DD/MM/YYYY"}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item
                    label="หมายเลขใบกำกับภาษี"
                    name="invoiceNo"
                    rules={[
                      {
                        required: true,
                        message: "Please input your data!",
                      },
                    ]}
                    style={{ marginBottom: "0px" }}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item
                    label="สถานที่จัดส่ง"
                    name="delivery_location"
                    rules={[
                      {
                        required: true,
                        message: "Please input your data!",
                      },
                    ]}
                    style={{ marginBottom: "0px" }}
                  >
                    <Input disabled={true} placeholder="ยังไม่เปิดใช้งาน" />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item
                    label="ค่าขนส่ง"
                    name="shipping_cost"
                    rules={[
                      {
                        required: true,
                        message: "Please input your data!",
                      },
                    ]}
                    style={{ marginBottom: "0px" }}
                  >
                    <Input disabled={true} placeholder="ยังไม่เปิดใช้งาน" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  const mainColumn = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "5%",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
    },
    {
      title: "INVOICE NO.",
      key: "invno",
      dataIndex: "invno",
      width: "10%",
    },

    {
      title: "INVOICE DATE",
      key: "idate",
      dataIndex: "idate",
      width: "10%",
      render: (idate) => dayjs(idate).format("DD/MM/YYYY"),
    },
    {
      title: "CUSTOMER NAME",
      key: "cusname",
      dataIndex: "cusname",
      width: "50%",
    },
  ];

  const customerColumn = [
    {
      title: "รหัสลูกค้า",
      dataIndex: "cus_no",
      key: "cus_no",
    },
    {
      title: "ชื่อลูกค้า",
      dataIndex: "cus_name",
      key: "cus_name",
    },
    {
      title: "จำนวนใบส่งของทั้งหมด",
      dataIndex: "total_invno",
      key: "total_invno",
      align: "center",
    },
  ];

  const invoiceColumn = [
    {
      title: "รหัสสินค้า",
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (code) => <Tag color="red">{code}</Tag>,
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (quantity) => (+quantity).toLocaleString(),
    },
    {
      title: "ชื่อลูกค้า",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เลขที่ใบส่งของ",
      dataIndex: "gdspay",
      key: "gdspay",
      align: "center",
    },
    {
      title: "วันที่ออกใบส่งของ",
      key: "gdsdate",
      dataIndex: "gdsdate",
      align: "center",
      render: (gdsdate) => gdsdate && dayjs(gdsdate).format("DD/MM/YYYY"),
    },
    {
      title: "เลือก",
      dataIndex: "select",
      key: "select",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          style={{
            background: !checkDupItem(record?.id) ? "#da2a35" : "#d9d9d9",
          }}
          disabled={checkDupItem(record?.id)}
          icon={<PlusOutlined />}
          onClick={() => addOrderToInvoiceTax(record)}
        />
      ),
    },
  ];

  const selectedColumn = [
    {
      title: "รหัสสินค้า",
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (code) => <Tag color="red">{code}</Tag>,
    },
    {
      title: "รหัสลูกค้า",
      dataIndex: "cus_no",
      key: "cus_no",
      align: "center",
    },
    {
      title: "ทะเบียนขนส่ง",
      dataIndex: "nocar",
      key: "nocar",
      align: "center",
    },
    {
      title: "บริษัทขนส่ง",
      dataIndex: "trn_name",
      key: "trn_name",
      align: "center",
    },
    {
      title: "เล่มที่ / เลขที่",
      key: "vol",
      align: "center",
      render: (record) => record?.bok_no + " / " + record?.vol_no,
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (quantity) => (+quantity).toLocaleString(),
    },
    {
      title: "ราคา/หน่วย",
      dataIndex: "price",
      key: "price",
      align: "center",
    },
    {
      title: "ราคาทั้งหมด",
      key: "totalPrice",
      align: "center",
      render: (record) => {
        let totalPrice = +record?.price * +record?.quantity;
        return totalPrice?.toLocaleString();
      },
    },
  ];

  const steps = [
    {
      title: "เลือกลูกค้า",
      content: (
        <Table
          dataSource={customerList}
          columns={customerColumn}
          onRow={(record) => ({
            onClick: () => handleSelectCus(record),
          })}
          className="table-click-able"
          rowKey="cus_no"
        />
      ),
    },
    {
      title: "เลือกใบส่งของ",
      content: (
        <Table
          dataSource={invoiceList}
          columns={invoiceColumn}
          pagination={false}
          size="middle"
          rowKey="id"
        />
      ),
    },
    {
      title: "ออกใบกำกับภาษี",
      content: renderTaxDetail(),
    },
  ];

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
          <h1 style={{ fontSize: "18px" }}>ใบกำกับภาษี</h1>
          <Space>
            <Input.Search
              placeholder="ค้นหา เลขที่ใบกำกับภาษี"
              allowClear
              onSearch={(value) => {
                setQuery(value);
                setPage(1);
              }}
              style={{ width: 220 }}
            />

            <Button
              type="primary"
              icon={<PrinterFilled />}
              style={{
                width: "100%",
                maxWidth: "138px",
                margin: "0",
                backgroundColor: "#ffc107",
              }}
            >
              รายงาน
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ width: "100%", margin: "0" }}
              onClick={() => setIsModalOpen(true)}
            >
              เพิ่มใบกำกับภาษี
            </Button>
          </Space>
        </div>

        <Table
          dataSource={taxList}
          columns={mainColumn}
          onRow={(record) => ({
            onClick: () => handleViewTaxInfo(record?.invno),
          })}
          style={{ marginTop: "1rem" }}
          pagination={false}
          size="middle"
          rowKey="invno"
          className="table-click-able"
        />

        <Pagination
          showSizeChanger
          total={totalItems}
          showTotal={(total) => `จำนวนทั้งหมด ${total?.toLocaleString()}`}
          defaultPageSize={10}
          defaultCurrent={1}
          current={page}
          style={{ marginTop: "20px", textAlign: "right" }}
          onChange={(newPage) => setPage(newPage)}
          onShowSizeChange={(current, limit) => setPageLimit(limit)}
        />
      </Card>

      <Modal
        title={isEdit ? "แก้ไขใบกำกับภาษี" : "ออกใบกำกับภาษี"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={1000}
        destroyOnClose
        maskClosable={false}
      >
        {!isEdit ? (
          <>
            <Steps
              style={{ margin: "1rem 0rem 1.5rem 0rem" }}
              current={currentStep}
              items={steps.map((item) => ({
                key: item.title,
                title: item.title,
              }))}
            />
            <div>{steps[currentStep].content}</div>
          </>
        ) : (
          renderTaxDetail()
        )}

        <Space
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {currentStep > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prev}>
              ย้อนกลับ
            </Button>
          )}

          {currentStep > 0 && currentStep < steps.length - 1 && (
            <Button
              disabled={selectedList.length === 0}
              type="primary"
              onClick={next}
            >
              ถัดไป
            </Button>
          )}

          {(currentStep === steps.length - 1 || isEdit) && (
            <Button type="primary" onClick={handleSubmitInvoice}>
              บันทึกข้อมูล
            </Button>
          )}
        </Space>
      </Modal>
    </>
  );
};
export default UITaxInvoice;
