import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Table,
  Pagination,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
  message,
  Tag,
} from "antd";
import { REPORT_TYPE, qcOption, sectionOption } from "context/constant";
import { DeleteOutlined, PrinterFilled } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { COLUMN } from "context/column";
import { delay } from "utils/utils";
import dayjs from "dayjs";
import Swal from "sweetalert2";

// ==== COMPONENT ==== //
import { EditableCell, EditableRow } from "component/table/TableEditAble";
import ModalProductReport from "component/Modal/ModalProductReport";
import ProductLocationReport from "component/report/ProductLocationReport";
import ProductDailyReport from "component/report/ProductDailyReport";

// ==== SERVICE ==== //
import SettingService from "services/SettingService";
import ProductService from "services/ProductService";

const UIProduct = () => {
  const [productList, setProductList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [codeList, setCodeList] = useState([]);
  const [currentType, setCurrentType] = useState();
  const [orderList, setOrderList] = useState([]);
  const [currentEditData, setCurrentEditData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [printData, setPrintData] = useState({});

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [query, setQuery] = useState("");
  const [qcStatus, setQcStatus] = useState("");

  // === MODAL === //
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalReport, setIsOpenModalReport] = useState(false);

  const [form] = Form.useForm();

  // ==== REF ==== //
  const formRef = useRef(null);
  const coilInputRef = useRef();
  const weightInputRef = useRef();
  const locationReportRef = useRef();
  const dailyReportRef = useRef();

  useEffect(() => {
    fetchProductList();
  }, [page, pageLimit, query, qcStatus]);

  useEffect(() => {
    if (isOpenModal) fetchProductType();
  }, [isOpenModal]);

  useEffect(() => {
    if (currentType) {
      fetchProductCode();
    }
  }, [currentType]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isOpenModal && event.keyCode === 121) {
        console.log("ORDER LIST TO SAVED ==> ", orderList);
        handleSubmitData();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  const fetchProductList = () => {
    let pageConf = {
      page,
      pageLimit,
      query,
      qcStatus: qcStatus ? qcStatus : "",
    };
    ProductService.getProduct(pageConf)
      .then(({ data }) => {
        setProductList(data?.items);
        setTotalItems(data?.total);
      })
      .catch((err) => console.log(err));
  };

  const fetchProductType = () => {
    SettingService.getAllProductType()
      .then(({ data }) => {
        setTypeList(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchProductCode = () => {
    let pageConf = { typeCode: currentType, getAll: true };
    SettingService.getProductCode(pageConf)
      .then(({ data }) => {
        setCodeList(data?.items);
        setTotalItems(data?.total);
      })
      .catch((err) => message.warning(err));
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
    form.setFieldValue("pdate", dayjs());
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setIsEdit(false);
    setOrderList([]);
    form.resetFields();
  };

  const handleChangeSection = (value) => {
    console.log(value);
  };

  const handleSelectProductType = (value) => {
    setCurrentType(value);
    form.resetFields(["productCode", "size"]);
  };

  const handleSelectProductCode = (value) => {
    const selectedItem = codeList.find((x) => x.productcode === value);

    if (selectedItem) {
      form.setFieldValue("size", selectedItem?.size);
    }
  };

  const handleSubmitData = () => {
    if (!isEdit) {
      if (orderList.length <= 0) {
        return message.warning("Nothing changed, Data is empty.");
      }

      ProductService.addProduct(orderList)
        .then((res) => {
          message.success("Data has been saved!");
          handleCloseModal();
          fetchProductList();
        })
        .catch((err) => {
          console.log(err);
          message.error("Something went wrong !");
        });
    } else {
      form
        .validateFields()
        .then((values) => {
          ProductService.updateProduct({
            procode: currentEditData?.procode,
            ...values,
          })
            .then((res) => {
              message.success("Data has been updated!");
              handleCloseModal();
              fetchProductList();
            })
            .catch((err) => message.error(err));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddData = async (values) => {
    let isDup = false;
    let currentId = `${values?.chargeNo}-${values?.coilNo}`;
    let resetArray = ["weight"];

    orderList.forEach((item) => {
      if (item?.id == currentId) isDup = true;
    });

    if (isDup) {
      resetArray.push("coilNo");
      message.error(
        `Charge: ${values.chargeNo} | Coil: ${values.coilNo} - Duplicated`
      );
    } else {
      let group = typeList.find((x) => x.typecode === values?.productGroup);

      let newData = {
        ...values,
        id: currentId,
        productGroup: group?.typename,
      };
      // console.log("NEW DATA ==> ", newData);

      setOrderList((current) => [...current, newData]);

      let currentCoil = +form.getFieldValue("coilNo");

      if (isNaN(currentCoil)) {
        resetArray.push("coilNo");
        coilInputRef.current.focus();
        form.resetFields(resetArray);
        message.success(
          `Charge: ${values.chargeNo} | Coil: ${values.coilNo} - Added`
        );
      } else {
        form.setFieldValue("coilNo", currentCoil + 1);
        form.resetFields(resetArray);
        message.success(
          `Charge: ${values.chargeNo} | Coil: ${values.coilNo} - Added`
        );
        await delay(100);
        weightInputRef.current.focus();
      }
    }
  };

  const handleDelete = (id) => {
    let nextOrder = [...orderList].filter((i) => i.id !== id);
    setOrderList(nextOrder);
  };

  const handleEditProduct = (record) => {
    setIsOpenModal(true);
    setCurrentEditData(record);
    setIsEdit(true);

    form.setFieldValue("productCode", record?.code);
    form.setFieldValue("chargeNo", record?.charge);
    form.setFieldValue("coilNo", record?.coilno);
    form.setFieldValue("weight", record?.weight);
    form.setFieldValue("productGroup", record?.group);
    form.setFieldValue("location", record?.location);
    form.setFieldValue("size", record?.size);
    form.setFieldValue("pdate", dayjs(record?.pdate));
    form.setFieldValue("timeSection", record?.shift);

    // form.setFieldValue("pdate", dayjs(record?.pdate).format("DD/MM/YYYY"));
  };

  const components = {
    body: { row: EditableRow, cell: EditableCell },
  };

  const handleSave = (row) => {
    // console.log(row);
    if (row?.weight && row?.weight >= 0) {
      const newData = [...orderList];
      const index = newData.findIndex((item) => row?.id === item?.id);
      const item = newData[index];

      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setOrderList(newData);
    }
  };

  const handleDeleteProduct = (event, record) => {
    event.stopPropagation();
    Swal.fire({
      icon: "warning",
      title: "คำเตือน",
      text: `คุณต้องการลบ ใช่หรือไม่`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      customClass: {
        confirmButton: "confirm-button-class",
        title: "title-class",
        icon: "icon-class",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let procode = record?.procode;
        ProductService.deleteProduct(procode)
          .then(() => {
            message.success("Data has been deleted!");
            fetchProductList();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      let next = focusNextInput();
      if (typeof next === "object") {
        event.preventDefault();
        next.focus();
      }
    }
  };

  const focusNextInput = () => {
    const form = formRef.current;

    if (form) {
      const activeElement = document.activeElement;
      const formItems = form.getFieldsValue();

      const fieldRefs = Object.keys(formItems).map(
        (fieldName) => form.getFieldInstance(fieldName)?.input
      );

      const currentIndex = fieldRefs.indexOf(activeElement);
      // console.log("currentIndex ==> ", currentIndex);
      // console.log(fieldRefs.length - 1);

      if (currentIndex !== -1 && currentIndex < fieldRefs.length - 1) {
        const nextField = fieldRefs[currentIndex + 1];
        return nextField;
      } else if (currentIndex === fieldRefs.length - 1) {
        return 0;
      }
    }
  };

  const printLocationReport = useReactToPrint({
    content: () => locationReportRef.current,
  });

  const printDailyReport = useReactToPrint({
    content: () => dailyReportRef.current,
  });

  const getReportData = async (reportData) => {
    setPrintData(reportData);
    await delay(200);

    switch (reportData.reportType) {
      case REPORT_TYPE.DAILY:
        return printDailyReport();
      case REPORT_TYPE.LOCATION:
        return printLocationReport();
    }
  };

  const handleCloseModalReport = () => {
    setPrintData({});
    setIsOpenModalReport(false);
  };

  const editableColumn = [
    {
      title: "ลำดับ",
      key: "index",
      render: (text, record, idx) => (page - 1) * 10 + (idx + 1),
      align: "center",
    },
    {
      title: "CHARGE NO.",
      key: "chargeNo",
      dataIndex: "chargeNo",
    },
    {
      title: "COIL NO.",
      key: "coilNo",
      dataIndex: "coilNo",
    },
    {
      title: "GROUP",
      key: "group",
      dataIndex: "productGroup",
      align: "center",
    },
    {
      title: "PRODUCT CODE",
      key: "productCode",
      dataIndex: "productCode",
      align: "center",
      render: (code) => <Tag color="red">{code}</Tag>,
    },
    {
      title: "DATE",
      key: "pdate",
      dataIndex: "pdate",
      align: "center",
      render: (pdate) => dayjs(pdate).format("DD/MM/YYYY"),
    },
    {
      title: "WEIGHT (EDIT)",
      key: "weight",
      dataIndex: "weight",
      align: "right",
      editable: true,
      width: "15%",
      render: (weight) => weight?.toLocaleString(),
    },
    {
      title: "LOCATION",
      key: "location",
      dataIndex: "location",
      align: "center",
    },
    {
      key: "operation",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => (
        <Button
          className="bt-icon"
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record?.id)}
        />
      ),
    },
  ];

  const subColumn = editableColumn.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

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
          <h1 style={{ fontSize: "18px" }}>รายการสินค้า</h1>
          <Space>
            <Select
              onChange={(value) => setQcStatus(value)}
              options={qcOption}
              placeholder="เลือกสถานะ QC"
              style={{ width: "100%" }}
              allowClear
            />

            <Input.Search
              placeholder="ค้นหา Charge No."
              allowClear
              onSearch={(value) => {
                setQuery(value);
                setPage(1);
              }}
              style={{ width: 200 }}
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
              onClick={() => setIsOpenModalReport(true)}
            >
              รายงาน
            </Button>

            <Button
              type="primary"
              style={{ width: "100%", maxWidth: "138px", margin: "0" }}
              onClick={handleOpenModal}
            >
              เพิ่มสินค้า
            </Button>
          </Space>
        </div>

        <Table
          dataSource={productList}
          columns={COLUMN.PRODUCT({ page, pageLimit, handleDeleteProduct })}
          onRow={(record) => ({
            onClick: () => handleEditProduct(record),
          })}
          scroll={{ x: 900 }}
          style={{ marginTop: "1rem" }}
          pagination={false}
          className="table-click-able"
          size="small"
          rowKey="procode"
        />
        <Pagination
          showSizeChanger
          total={totalItems}
          showTotal={(total) => `จำนวนทั้งหมด ${total?.toLocaleString()}`}
          defaultPageSize={10}
          defaultCurrent={1}
          current={page}
          pageSize={pageLimit}
          style={{ marginTop: "20px", textAlign: "right" }}
          onChange={(newPage) => setPage(newPage)}
          onShowSizeChange={(current, limit) => setPageLimit(limit)}
        />
      </Card>

      {printData?.reportType === REPORT_TYPE.DAILY ? (
        <ProductDailyReport ref={dailyReportRef} printData={printData} />
      ) : printData?.reportType === REPORT_TYPE.LOCATION ? (
        <ProductLocationReport ref={locationReportRef} printData={printData} />
      ) : null}

      <ModalProductReport
        isOpen={isOpenModalReport}
        onClose={handleCloseModalReport}
        getReportData={getReportData}
      />

      {/* ======= MODAL SECTION ======= */}
      <Modal
        open={isOpenModal}
        title={!isEdit ? "เพิ่มรายการสินค้า" : "แก้ไขรายการสินค้า"}
        onCancel={handleCloseModal}
        width={1100}
        maskClosable={false}
        footer={null}
      >
        <Form
          form={form}
          id="addProduct"
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleAddData}
          autoComplete="off"
          ref={formRef}
        >
          <Card
            style={{ minHeight: "300px", marginBottom: "1rem" }}
            className="card-no-padding"
          >
            <Row gutter={[16, 0]}>
              <Col span={13}>
                <Card
                  title={null}
                  bordered={false}
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                    padding: "24px",
                  }}
                >
                  <Row gutter={[8, 16]}>
                    <Col xs={20}>
                      <Row>
                        <Col xs={8}>ช่วงเวลา</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="timeSection"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Select
                              onChange={handleChangeSection}
                              options={sectionOption}
                              placeholder="เลือกช่วงเวลา"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={20}>
                      <Row>
                        <Col xs={8}>รหัสสินค้า</Col>
                        <Col xs={6}>
                          <Form.Item
                            name="productGroup"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Select
                              onChange={handleSelectProductType}
                              options={typeList.map((option) => ({
                                value: option?.typecode,
                                label: option?.typename,
                              }))}
                              placeholder="ประเภท"
                              style={{ width: "100%" }}
                              disabled={isEdit}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={10} style={{ paddingLeft: "8px" }}>
                          <Form.Item
                            name="productCode"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Select
                              onChange={handleSelectProductCode}
                              options={codeList.map((option) => ({
                                value: option?.productcode,
                                label: option?.productcode,
                              }))}
                              placeholder="รหัสสินค้า"
                              style={{ width: "100%" }}
                              disabled={!currentType}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={20}>
                      <Row>
                        <Col xs={8}>ขนาด</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="size"
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
                    </Col>

                    <Col xs={20}>
                      <Row>
                        <Col xs={8}>วันที่ผลิต</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="pdate"
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
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col span={11}>
                <Card
                  title="รายละเอียดสินค้า"
                  bordered={false}
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                    borderLeft: "1px solid #f0f0f0",
                    borderRadius: "0px",
                  }}
                >
                  <Row gutter={[8, 16]} style={{ padding: "24px 32px" }}>
                    <Col xs={22}>
                      <Row>
                        <Col xs={8}>Charge No.</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="chargeNo"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input onKeyDown={handleKeyPress} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={8}>Coil No.</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="coilNo"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input
                              ref={coilInputRef}
                              onKeyDown={handleKeyPress}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={8}>Weight</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="weight"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input
                              ref={weightInputRef}
                              onKeyDown={handleKeyPress}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={8}>Location</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="location"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input onKeyDown={handleKeyPress} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={24} style={{ textAlign: "right" }}>
                      <Space>
                        {!isEdit && (
                          <Button
                            type="primary"
                            style={{ marginRight: "10px", height: "40px" }}
                            htmlType="submit"
                          >
                            เพิ่มข้อมูล (ENTER)
                          </Button>
                        )}
                        <Button
                          type="primary"
                          style={{
                            marginRight: "10px",
                            height: "40px",
                            backgroundColor: "#23a123",
                          }}
                          onClick={() => handleSubmitData()}
                        >
                          บันทึก (F10)
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </Form>

        {!isEdit && (
          <Table
            components={components}
            bordered
            dataSource={orderList}
            rowClassName={() => "editable-row"}
            columns={subColumn}
            pagination={false}
            scroll={{ x: 900 }}
            size="small"
            rowKey="id"
          />
        )}
      </Modal>
    </>
  );
};

export default UIProduct;
