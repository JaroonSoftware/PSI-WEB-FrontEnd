import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Pagination,
  Row,
  Col,
  DatePicker,
  Select,
  message,
  Space,
  Tag,
} from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  PrinterFilled,
  RightCircleOutlined,
} from "@ant-design/icons";
import { delay, padingZero } from "utils/utils";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import $ from "jquery";

// SERVICE
import WireRodService from "services/WireRodService";
import SettingService from "services/SettingService";
import { COLUMN } from "context/column";
import ModalWrReport from "component/Modal/ModalWrReport";
import { useReactToPrint } from "react-to-print";
import WRImportReport from "component/report/WRImportReport";
import { REPORT_TYPE } from "context/constant";

const UIWrImport = () => {
  const [WRList, setWRList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [verifiedCharge, setVerifiedCharge] = useState(null);
  const [verifiedRec, setVerifiedRec] = useState(null);

  const [vendorList, setVendorList] = useState([]);
  const [productCodeList, setProductCodeList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRec, setIsLoadingRec] = useState(false);

  // === MODAL CONTROLLER === //
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const [isOpenModalReport, setIsOpenModalReport] = useState(false);

  const [printData, setPrintData] = useState({});

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [query, setQuery] = useState("");
  const [timeQuery, setTimeQuery] = useState({});

  const [isEdit, setIsEdit] = useState(false);

  const [form] = Form.useForm();

  const inputRef = useRef();
  const formRef = useRef(null);
  const printRef = useRef();

  useEffect(() => {
    fetchImportWireRod();
  }, [page, pageLimit, query, timeQuery]);

  useEffect(() => {
    if (isOpenImportModal) {
      fetchVendor();
      fetchWrProductCode();
    }
  }, [isOpenImportModal]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isOpenImportModal && event.keyCode === 121) {
        console.log("DATA LIST TO SAVED ==> ", dataList);
        handleImportWr();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  const fetchImportWireRod = () => {
    let pageConf = {
      page,
      pageLimit,
      query,
      timeQuery: timeQuery?.dateString ? timeQuery?.dateString : "",
    };

    WireRodService.getImportWireRod(pageConf)
      .then(({ data }) => {
        setWRList(data?.items);
        setTotalItems(data?.total);
      })
      .catch((err) => console.log(err));
  };

  const fetchVendor = () => {
    let data = { getAll: true };
    SettingService.getVendor(data)
      .then(({ data }) => {
        setVendorList(data?.items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchWrProductCode = () => {
    let data = { typeCode: 18, getAll: true };
    SettingService.getProductCode(data)
      .then(({ data }) => {
        setProductCodeList(data?.items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeVendor = (vendorName) => {
    const selectedItem = vendorList.find((x) => x.ven_name === vendorName);

    if (selectedItem) {
      form.setFieldValue("vendor_code", selectedItem?.code);
    }
  };

  const handleChangeProductCode = (value) => {
    const selectedItem = productCodeList.find((x) => x.productcode === value);
    if (selectedItem) {
      form.setFieldValue("product_name", selectedItem?.productname);
      form.setFieldValue("size", selectedItem?.size);
      form.setFieldValue("gradecode", selectedItem?.gradecode);
    }
  };

  const resetFields = () => {
    form.resetFields();
  };

  const resetData = () => {
    setDataList([]);
    setVerifiedCharge(null);
    setVerifiedRec(null);
    setIsEdit(false);
  };

  const handleCloseModal = () => {
    setIsOpenImportModal(false);
    resetData();
    resetFields();
  };

  const handleResetData = () => {
    Swal.fire({
      icon: "warning",
      title: "คำเตือน",
      text: `คุณต้องการรีเซ็ตข้อมูลทั้งหมด ใช่หรือไม่ ?`,
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
        resetData();
        resetFields();
        form.setFieldValue("import_date", dayjs());
        message.success("SUCCESS : รีเซ็ตข้อมูลทั้งหมดเรียบร้อยแล้ว");
      }
    });
  };

  const handleCreateData = async (values) => {
    if (!verifiedRec) {
      return message.warning("กรุณากดปุ่มตรวจสอบ Rec No. ก่อนทำรายการต่อไป");
    }

    if (!verifiedCharge) {
      return message.warning("กรุณากดปุ่มตรวจสอบ Charge No. ก่อนทำรายการต่อไป");
    }

    let { coilQty } = values;
    let mainObj = {
      recVol: values?.rec_vol,
      recNo: values?.rec_no,
      lcNo: values?.lc_no,
      charge_no: values?.charge_no,
      vendor_code: values?.vendor_code,
      size: values?.size,
      grade: values?.gradecode,
      tot_coil: coilQty,
      tot_wig: values?.totalWeight,
      rcvDate: values?.import_date,
      tot_avg: values?.avgWeight,
      tot_end: values?.lweight,
      batch: values?.batch_heat,
      deleteAble: true,
    };

    setDataList([...dataList, mainObj]);

    // RESET FOR NEXT DATA
    setVerifiedCharge(null);
    form.resetFields([
      "charge_no",
      "coilQty",
      "totalWeight",
      "avgWeight",
      "lweight",
      "remark",
    ]);
    await delay(100);
    inputRef.current.focus();
  };

  const handleOpenImportModal = () => {
    setIsOpenImportModal(true);
    let current = dayjs();
    form.setFieldValue("import_date", current);
    form.setFieldValue(
      "rec_vol",
      "0" + (current.year() + 543).toString().substring(2)
    );
  };

  const handleImportWr = () => {
    if (!isEdit) {
      let importList = dataList.filter((i) => i?.deleteAble);

      if (importList.length <= 0) {
        return message.warning("กรุณากรอกข้อมูล ก่อนบันทึกเข้าระบบ");
      }

      WireRodService.importWireRod(importList)
        .then(({ data }) => {
          handleCloseModal();
          message.success(`${data?.status} : ${data?.message}`);
          fetchImportWireRod();
        })
        .catch((err) => {
          message.error("ERROR : " + err?.response?.data?.message);
        });
    } else {
      let reqData = {
        lcNo: form.getFieldValue("lc_no"),
        chargeNo: form.getFieldValue("charge_no"),
        totalWeight: form.getFieldValue("totalWeight"),
        vendorCode: form.getFieldValue("vendor_code"),
      };

      console.log(reqData);

      WireRodService.updateWirerod(reqData)
        .then(({ data }) => {
          message.success(`${data?.status} : ${data?.message}`);
          handleCloseModal();
          fetchImportWireRod();
        })
        .catch((err) => {
          message.error("ERROR : " + err?.response?.data?.message);
        });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (event?.target?.name === "charge_no") {
        event.preventDefault();
        handleVerifyCharge();
      } else if (event?.target?.name === "rec_no") {
        event.preventDefault();
        handleVerifyRec();
      } else {
        let next = focusNextInput();
        if (typeof next === "object") {
          event.preventDefault();
          next.focus();
        }
      }
    }
  };

  const focusNextInput = () => {
    const form = formRef.current;

    if (form) {
      const activeElement = document.activeElement;
      const formItems = form.getFieldsValue();

      let fieldRefs = Object.keys(formItems).map(
        (fieldName) => form.getFieldInstance(fieldName)?.input
      );

      fieldRefs = fieldRefs.filter(
        (item) => $(item).hasClass("ant-input-disabled") == false
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

  const handleVerifyCharge = async () => {
    if (verifiedCharge) return;

    let chargeUndefied = form.getFieldValue("charge_no");

    if (chargeUndefied) {
      setIsLoading(true);
      await delay(1000);

      if (dataList.length !== 0) {
        const idx = dataList.findIndex((i) => i.charge_no === chargeUndefied);

        if (idx >= 0) {
          setIsLoading(false);
          return message.error(
            `409 : Charge No. '${chargeUndefied}' ไม่สามารถเพิ่มข้อมูลซ้ำได้ !`
          );
        }
      }

      WireRodService.verifyCharge(chargeUndefied)
        .then(({ data }) => {
          let { status } = data;
          if (status === 200) {
            message.success(`[${data?.status}] : ${data?.message}`);
            setVerifiedCharge(chargeUndefied);
            focusNextInput().focus();
          }
        })
        .catch((err) => {
          if (err?.response)
            message.error(
              `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
            );
        })
        .finally(() => setIsLoading(false));
    } else {
      return message.warning("กรุณากรอก Charge No. ก่อนทำการตรวจสอบ");
    }
  };

  const handleVerifyRec = async () => {
    if (verifiedRec) return;

    let recVolUndefied = form.getFieldValue("rec_vol");
    let recNoUndefied = form.getFieldValue("rec_no");
    let recData = `${recVolUndefied}:${recNoUndefied}`;

    if (recVolUndefied && recNoUndefied) {
      setIsLoadingRec(true);
      await delay(1000);

      WireRodService.verifyRec(recVolUndefied, recNoUndefied)
        .then(({ data }) => {
          message.success(`[${data?.status}] : ${data?.message}`);
          setVerifiedRec(recData);
          setDataList(data?.items);
        })
        .catch((err) => {
          if (err?.response)
            message.error(
              `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
            );
        })
        .finally(() => setIsLoadingRec(false));
    } else {
      return message.warning(
        "กรุณากรอก 'เล่มที่ใบรับ' และ 'เลขที่ใบรับ' ก่อนทำการตรวจสอบ"
      );
    }
  };

  const handleChangeValue = (e) => {
    let coilQty = form.getFieldValue("coilQty");
    let totalWeight = form.getFieldValue("totalWeight");

    if (coilQty > 0 && totalWeight > 0) {
      let a = parseInt(totalWeight / coilQty);
      let b = totalWeight % a;

      if (!isNaN(b)) {
        form.setFieldValue("avgWeight", a);
        form.setFieldValue("lweight", a + b);
      }
    } else {
      form.setFieldValue("avgWeight", 0);
      form.setFieldValue("lweight", 0);
    }
  };

  const handleDelCharge = (chargeNo) => {
    const nextData = dataList.filter((item) => item?.charge_no !== chargeNo);
    setDataList(nextData);
  };

  const onChangeDate = (date, dateString) => {
    setTimeQuery({ date, dateString });
    setPage(1);
  };

  //   const handleViewImportData = (record) => {
  //     setIsOpenImportModal(true);
  //     form.setFieldValue("rcv_date", dayjs(record?.rcv_date));
  //     form.setFieldValue("rec_vol", currentRecVol);
  //     form.setFieldValue("rec_no", record?.rec_no);
  //   };

  const handleEditWr = (record) => {
    console.log(record);
    setIsOpenImportModal(true);
    setIsEdit(true);
    setVerifiedRec(`${record?.rec_vol}:${record?.rec_no}`);
    setVerifiedCharge(record?.charge_no);
    form.setFieldsValue({
      rec_vol: record?.rec_vol,
      rec_no: record?.rec_no,
      lc_no: record?.lc_no,
      charge_no: record?.charge_no,
      vendor_code: record?.vendor,
      ven_name: record?.ven_name,
      product_code: record?.product_code,
      product_name: record?.product_name,
      size: record?.size,
      gradecode: record?.grade,
      coilQty: record?.tot_coil,
      totalWeight: record?.tot_wig,
      import_date: dayjs(record?.rcv_date),
      avgWeight: record?.tot_avg?.toLocaleString(),
      lweight: record?.tot_end?.toLocaleString(),
      batch_heat: record?.batch_heat,
      deleteAble: true,
    });
  };

  const handleCloseModalReport = () => {
    setPrintData({});
    setIsOpenModalReport(false);
  };
  const getReportData = async (reportData) => {
    setPrintData(reportData);
    await delay(200);
    printProcess();
  };

  const printProcess = useReactToPrint({
    content: () => printRef.current,
  });

  const mainColumn = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "5%",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
    },
    {
      title: "รหัสขนาด",
      dataIndex: "product_code",
      key: "product_code",
      align: "center",
      render: (product_code) => <Tag color="red">{product_code}</Tag>,
    },
    {
      title: "เกรด",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "ขนาด",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "LC NO.",
      dataIndex: "lc_no",
      key: "lc_no",
    },
    {
      title: "CHARGE NO.",
      dataIndex: "charge_no",
      key: "charge_no",
    },
    {
      title: "COIL QTY",
      dataIndex: "tot_coil",
      key: "tot_coil",
    },
    {
      title: "น้ำหนัก (Kgs.)",
      dataIndex: "tot_wig",
      key: "tot_wig",
      render: (tot_wig) => tot_wig?.toLocaleString(),
    },
    {
      title: "ผู้จำหน่าย",
      dataIndex: "vendor",
      key: "vendor",
      align: "center",
    },
    {
      title: "RECIEVE DATE",
      key: "rcv_date",
      dataIndex: "rcv_date",
      align: "center",
      render: (rcv_date) => dayjs(rcv_date).format("DD/MM/YYYY"),
    },
  ];

  const editableColumn = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (text, record, idx) => idx + 1,
    },
    {
      title: "SIZE",
      dataIndex: "size",
      key: "size",
      align: "center",
    },
    {
      title: "CHARGE NO.",
      dataIndex: "charge_no",
      key: "charge_no",
      align: "center",
    },
    {
      title: "COIL QTY",
      dataIndex: "tot_coil",
      key: "tot_coil",
      align: "center",
    },
    {
      title: "น้ำหนัก Sup",
      dataIndex: "tot_wig",
      key: "tot_wig",
      align: "center",
      render: (tot_wig) => tot_wig?.toLocaleString(),
    },
    {
      title: "น้ำหนัก / Coil",
      key: "weight-end",
      align: "center",
      render: (record) =>
        `${record?.tot_avg?.toLocaleString()} / ${record?.tot_end?.toLocaleString()}`,
    },
    {
      title: "GRADE",
      dataIndex: "grade",
      key: "grade",
      align: "center",
    },
    {
      title: "REMOVE",
      align: "center",
      key: "operation",
      dataIndex: "operation",
      render: (_, record) => (
        <Button
          disabled={!record?.deleteAble}
          className="bt-icon"
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelCharge(record?.charge_no)}
        />
      ),
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
          <h1 style={{ margin: "0", fontSize: "18px" }}>รายการนำเข้า</h1>

          <Space>
            <DatePicker onChange={onChangeDate} value={timeQuery?.date} />

            <Input.Search
              placeholder="ค้นหา Lc No."
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
              onClick={handleOpenImportModal}
            >
              เพิ่มรายการนำเข้า
            </Button>
          </Space>
        </div>

        <Table
          dataSource={WRList}
          columns={mainColumn}
          onRow={(record) => ({
            onClick: () => handleEditWr(record),
          })}
          style={{ marginTop: "1rem" }}
          pagination={false}
          size="middle"
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

      {/* ======= MODAL SECTION ======= */}
      <Modal
        title="รายการนำเข้าข้อมูลวัตถุดิบ WIREROD"
        open={isOpenImportModal}
        onCancel={handleCloseModal}
        width={1000}
        maskClosable={false}
        footer={null}
      >
        <Form
          form={form}
          id="importWireRod"
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleCreateData}
          autoComplete="off"
          ref={formRef}
        >
          <Row
            style={{ marginBottom: "1rem", marginTop: "1rem" }}
            gutter={[16, 16]}
          >
            <Col span={24}>
              <Card
                style={{ minHeight: "300px", marginBottom: "1rem" }}
                className="card-no-padding"
              >
                <Row gutter={[16, 0]}>
                  <Col span={12}>
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
                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>เล่มที่ใบรับ</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="rec_vol"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your data!",
                                  },
                                ]}
                                style={{ marginBottom: "0px" }}
                              >
                                <Input
                                  onKeyDown={handleKeyPress}
                                  disabled={verifiedRec}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>เลขที่ใบรับ</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="rec_no"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your data!",
                                  },
                                ]}
                                style={{ marginBottom: "0px" }}
                              >
                                <Input
                                  onKeyDown={handleKeyPress}
                                  name="rec_no"
                                  disabled={verifiedRec}
                                  addonAfter={
                                    <Button
                                      className="bt-verified"
                                      type="primary"
                                      onClick={handleVerifyRec}
                                      loading={isLoadingRec}
                                      style={{
                                        backgroundColor:
                                          verifiedRec && "rgb(35, 161, 35)",
                                      }}
                                      icon={
                                        verifiedRec ? (
                                          <CheckCircleOutlined />
                                        ) : null
                                      }
                                    >
                                      ตรวจสอบ
                                    </Button>
                                  }
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>วันที่นำเข้า</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="import_date"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your data!",
                                  },
                                ]}
                                style={{ marginBottom: "0px" }}
                              >
                                <DatePicker
                                  // disabled={isEdit}
                                  style={{ width: "100%" }}
                                  format={"DD/MM/YYYY"}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>บริษัท/ห้าง/ร้าน</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="ven_name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your data!",
                                  },
                                ]}
                                style={{ marginBottom: "0px" }}
                              >
                                <Select
                                  showSearch
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    (
                                      option?.label.toLowerCase() ?? ""
                                    ).includes(input.toLowerCase())
                                  }
                                  filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? "")
                                      .toLowerCase()
                                      .localeCompare(
                                        (optionB?.label ?? "").toLowerCase()
                                      )
                                  }
                                  onChange={handleChangeVendor}
                                  options={vendorList.map((option) => ({
                                    value: option?.ven_name,
                                    label: option?.ven_name,
                                  }))}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>รหัสผู้จำหน่าย</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="vendor_code"
                                style={{ marginBottom: "0px" }}
                              >
                                <Input disabled />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>รหัสวัตถุดิบ</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="product_code"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your data!",
                                  },
                                ]}
                                style={{ marginBottom: "0px" }}
                              >
                                <Select
                                  disabled={isEdit}
                                  onChange={handleChangeProductCode}
                                  options={productCodeList.map((option) => ({
                                    value: option?.productcode,
                                    label: option?.productcode,
                                  }))}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>ชื่อวัตถุดิบ</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="product_name"
                                style={{ marginBottom: "0px" }}
                              >
                                <Input disabled />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>ขนาด</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="size"
                                style={{ marginBottom: "0px" }}
                              >
                                <Input disabled />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>เกรดวัตถุดิบ</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="gradecode"
                                style={{ marginBottom: "0px" }}
                              >
                                <Input disabled />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>LC No.</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="lc_no"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your data!",
                                  },
                                ]}
                                style={{ marginBottom: "0px" }}
                              >
                                <Input
                                  onKeyDown={handleKeyPress}
                                  disabled={isEdit}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card
                      title="รายละเอียดวัตถุดิบ"
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
                                name="charge_no"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your data!",
                                  },
                                ]}
                                style={{ marginBottom: "0px" }}
                              >
                                <Input
                                  ref={inputRef}
                                  onKeyDown={handleKeyPress}
                                  name="charge_no"
                                  disabled={verifiedCharge}
                                  addonAfter={
                                    <Button
                                      className="bt-verified"
                                      type="primary"
                                      onClick={handleVerifyCharge}
                                      loading={isLoading}
                                      style={{
                                        backgroundColor:
                                          verifiedCharge && "rgb(35, 161, 35)",
                                      }}
                                      icon={
                                        verifiedCharge ? (
                                          <CheckCircleOutlined />
                                        ) : null
                                      }
                                    >
                                      ตรวจสอบ
                                    </Button>
                                  }
                                />
                              </Form.Item>{" "}
                            </Col>
                          </Row>
                        </Col>

                        {/* <Col xs={22}>
                      <Row>
                        <Col xs={8}>Batch/Heat</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="batch_heat"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input ref={inputRef} onKeyDown={handleKeyPress} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col> */}

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>จำนวน Coil</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="coilQty"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your data!",
                                  },
                                ]}
                                style={{ marginBottom: "0px" }}
                              >
                                <Input
                                  style={{ textAlign: "left", width: "100%" }}
                                  onKeyDown={handleKeyPress}
                                  onChange={handleChangeValue}
                                  name="coilQty"
                                  maxLength={2}
                                  disabled={isEdit}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>น้ำหนัก Sup</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="totalWeight"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your data!",
                                  },
                                ]}
                                style={{ marginBottom: "0px" }}
                              >
                                <Input
                                  onKeyDown={handleKeyPress}
                                  onChange={handleChangeValue}
                                  name="totalWeight"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>น้ำหนักเฉลี่ย</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="avgWeight"
                                style={{ marginBottom: "0px" }}
                              >
                                <Input onKeyDown={handleKeyPress} disabled />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>น้ำหนักสุดท้าย</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="lweight"
                                style={{ marginBottom: "0px" }}
                              >
                                <Input onKeyDown={handleKeyPress} disabled />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={22}>
                          <Row>
                            <Col xs={8}>หมายเหตุ</Col>
                            <Col xs={16}>
                              <Form.Item
                                name="remark"
                                style={{ marginBottom: "0px" }}
                              >
                                <Input
                                  onKeyDown={handleKeyPress}
                                  disabled={isEdit}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>

                        <Col
                          xs={24}
                          style={{ textAlign: "right", marginTop: "15px" }}
                        >
                          <Space>
                            {!isEdit && (
                              <Button
                                type="primary"
                                style={{
                                  marginRight: "10px",
                                  height: "40px",
                                  backgroundColor: "#eb9e19",
                                }}
                                onClick={handleResetData}
                              >
                                รีเซ็ตข้อมูล
                              </Button>
                            )}
                            {!isEdit && (
                              <Button
                                type="primary"
                                style={{ marginRight: "10px", height: "40px" }}
                                htmlType="submit"
                              >
                                สร้างรายการ (ENTER)
                              </Button>
                            )}
                            <Button
                              type="primary"
                              style={{
                                marginRight: "10px",
                                height: "40px",
                                backgroundColor: "#23a123",
                              }}
                              onClick={handleImportWr}
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
            </Col>

            {!isEdit && (
              <Col span={24}>
                <Table
                  bordered
                  dataSource={dataList}
                  columns={editableColumn}
                  pagination={false}
                  scroll={{ x: 900 }}
                  size="small"
                  rowKey="index"
                />
              </Col>
            )}
          </Row>
        </Form>
      </Modal>

      {printData?.reportType === REPORT_TYPE.BY_DATE && (
        <WRImportReport ref={printRef} printData={printData} />
      )}

      <ModalWrReport
        isOpen={isOpenModalReport}
        onClose={handleCloseModalReport}
        getReportData={getReportData}
        from="IMPORT"
      />
    </>
  );
};

export default UIWrImport;
