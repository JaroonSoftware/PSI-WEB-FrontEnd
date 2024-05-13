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
  InputNumber,
} from "antd";
import { CheckCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { delay, padingZero } from "utils/utils";
import dayjs from "dayjs";
import Swal from "sweetalert2";

// SERVICE
import WireRodService from "services/WireRodService";

const UIWrImportTemp = () => {
  const [lcList, setLcList] = useState([]);
  const [chargeList, setChargeList] = useState([]);
  const [coilList, setCoilList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [wrData, setWrData] = useState({});
  const [verifiedCharge, setVerifiedCharge] = useState(null);
  const [verifiedRec, setVerifiedRec] = useState(null);

  const [currentLc, setCurrentLc] = useState("");
  const [currentCharge, setCurrentCharge] = useState("");

  const [vendorList, setVendorList] = useState([]);
  const [productCodeList, setProductCodeList] = useState([]);

  const [isFinish, setIsFinish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRec, setIsLoadingRec] = useState(false);

  // === MODAL CONTROLLER === //
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const [isOpenEditingModal, setIsOpenEditingModal] = useState(false);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // === PAGE COIL CONFIG === //
  const [coilPage, setCoilPage] = useState(1);
  const [coilPageLimit, setCoilPageLimit] = useState(10);
  const [coilTotalItems, setCoilTotalItems] = useState(0);

  const [form] = Form.useForm();
  const [formEditWeight] = Form.useForm();

  const inputRef = useRef();
  const formRef = useRef(null);

  useEffect(() => {
    fetchLc();
  }, [page, pageLimit]);

  useEffect(() => {
    if (currentLc) fetchCharge();
  }, [currentLc]);

  useEffect(() => {
    if (currentLc && currentCharge) {
      setIsLoading(true);
      fetchCoil();
    }
  }, [currentCharge, coilPage, coilPageLimit]);

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

  const fetchLc = () => {
    WireRodService.getLc({ page, pageLimit })
      .then(({ data }) => {
        setLcList(data.items);
        setTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCharge = () => {
    let pageConf = { lcNo: currentLc, page: 1, pageLimit: 10 };
    WireRodService.getChargeByLc(pageConf)
      .then(({ data }) => {
        setChargeList(data?.items);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const handleChangeVendor = (vendorCode) => {
    const selectedItem = vendorList.find((x) => x.code === vendorCode);
    if (selectedItem) {
      form.setFieldValue("vendor_name", selectedItem?.ven_name);
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

  const fetchCoil = async () => {
    await delay(300);
    let pageConf = {
      lcNo: currentLc,
      chargeNo: currentCharge,
      page: coilPage,
      pageLimit: coilPageLimit,
    };

    WireRodService.getCoil(pageConf)
      .then(({ data }) => {
        setCoilList(data?.items);
        setCoilTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const resetFields = () => {
    form.resetFields();
  };

  const resetData = () => {
    setDataList([]);
    setWrData(null);
    setVerifiedCharge(null);
    setVerifiedRec(null);
    setIsFinish(false);
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

  const handleGenWrDetail = (values) => {
    if (!isFinish) {
      if (!verifiedRec) {
        return message.warning("กรุณากดปุ่มตรวจสอบ Rec No. ก่อนทำรายการต่อไป");
      }

      if (!verifiedCharge) {
        return message.warning(
          "กรุณากดปุ่มตรวจสอบ Charge No. ก่อนทำรายการต่อไป"
        );
      }

      let { coilQty } = values;
      let mainObj = {
        recVol: values?.rec_vol,
        recNo: values?.rec_no,
        lcNo: values?.lc_no,
        charge_no: values?.charge_no,
        vendor: values?.vendor_code,
        size: values?.size,
        grade: values?.gradecode,
        tot_coil: coilQty,
        tot_wig: values?.totalWeight,
        rcvDate: values?.import_date,
        tot_avg: values?.avgWeight,
        tot_end: values?.lweight,
        batch: values?.batch_heat,
      };

      // let nextData = Array.from({ length: coilQty }, (_, i) => {
      //   return { index: i, ...values, weight: values?.avgWeight };
      // });
      setWrData(mainObj);
      setDataList([...dataList, mainObj]);
      setIsFinish(true);
    } else {
      resetData();
    }
  };

  const handleSelectLc = (record) => {
    setCoilPage(1);
    setCoilPageLimit(10);
    setCoilTotalItems(0);
    setCurrentLc(record?.lc_no);
  };

  const handleEditCharge = (record) => {
    formEditWeight.setFieldValue("lc_no", record?.lc_no);
    formEditWeight.setFieldValue("charge_no", record?.charge_no);
    formEditWeight.setFieldValue("coil_no", record?.coil_no);
    formEditWeight.setFieldValue("size", +record?.size);
    formEditWeight.setFieldValue("grade", record?.grade);
    formEditWeight.setFieldValue("weight", record?.weight);
    formEditWeight.setFieldValue("lweight", record?.lweight);
    formEditWeight.setFieldValue("tot_acc", record?.tot_acc);
    formEditWeight.setFieldValue(
      "rcv_date",
      dayjs(record?.rcv_date).format("DD/MM/YYYY")
    );

    showEditWeightModal();
  };

  const showEditWeightModal = () => {
    setIsOpenEditingModal(true);
  };
  const handleCloseEditingModal = () => {
    setIsOpenEditingModal(false);
    formEditWeight.resetFields();
  };

  const handleOpenImportModal = () => {
    setIsOpenImportModal(true);
    form.setFieldValue("import_date", dayjs());
  };

  const onFinishEditWeight = (values) => {
    let reqData = {
      lcNo: values?.lc_no,
      chargeNo: values?.charge_no,
      coilNo: values?.coil_no,
      weight: values?.weight,
    };

    WireRodService.editWeight(reqData)
      .then(({ data }) => {
        handleCloseEditingModal();
        fetchCoil();
        message.success(`${data?.status} : ${data?.message}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImportWr = () => {
    if (dataList.length <= 0) {
      return message.warning("กรุณากรอกข้อมูล ก่อนบันทึกเข้าระบบ");
    }

    WireRodService.importWireRod({ wrData: wrData, itemList: dataList })
      .then(({ data }) => {
        handleCloseModal();
        fetchLc();
        message.success(`${data?.status} : ${data?.message}`);
      })
      .catch((err) => {
        message.error("ERROR : " + err?.response?.data?.message);
      });
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

  const handleVerifyCharge = async () => {
    if (verifiedCharge) return;

    let chargeUndefied = form.getFieldValue("charge_no");

    if (chargeUndefied) {
      setIsLoading(true);
      await delay(1000);

      WireRodService.verifyCharge(chargeUndefied)
        .then(({ data }) => {
          let { status } = data;
          if (status === 200) {
            message.success(`${data?.status} : ${data?.message}`);
            setVerifiedCharge(chargeUndefied);
            focusNextInput().focus();
          }
        })
        .catch((err) => {
          if (err?.response) message.error(err?.response?.data?.message);
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
          setVerifiedRec(recData);
          setDataList(data?.items);
        })
        .catch((err) => {
          if (err?.response) message.error(err?.response?.data?.message);
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

  const handleSave = (row) => {
    if (row?.weight && row?.weight >= 0) {
      const newData = [...dataList];
      const index = newData.findIndex((item) => row?.index === item?.index);
      const item = newData[index];

      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataList(newData);
    }
  };

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
      title: "COIL",
      dataIndex: "tot_coil",
      key: "tot_coil",
      align: "center",
    },
    {
      title: "น้ำหนัก Sup",
      dataIndex: "tot_wig",
      key: "tot_wig",
      align: "right",
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
      title: "WEIGHT (EDIT)",
      key: "weight",
      dataIndex: "weight",
      align: "center",
      width: "15%",
      render: (weight, record) => (
        <InputNumber
          min={0}
          type="number"
          style={{ textAlign: "right", width: "100%" }}
          value={weight}
          onChange={(value) => {
            let nextList = [...dataList];
            nextList[record?.index]["weight"] = value;
            setDataList(nextList);
          }}
        />
      ),
    },
  ];

  const mainColumn = [
    {
      title: "ลำดับ",
      key: "index",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
      align: "center",
      width: "5%",
    },
    {
      title: "LC NO.",
      dataIndex: "lc_no",
      key: "lc_no",
      render: (lc_no) => (
        <span style={{ color: "#29f", fontWeight: "bold" }}>{lc_no}</span>
      ),
      width: "15%",
    },
    {
      title: "VENDOR",
      key: "vendor",
      render: (record) => (
        <span style={{ color: "#ff6a6a", fontWeight: "600" }}>
          [{record?.vendor}] {record?.ven_name}
        </span>
      ),
      width: "55%",
    },
    {
      title: "TOTAL CHARGE",
      dataIndex: "total_charge",
      key: "total_charge",
      align: "right",
    },
    {
      title: "TOTAL COIL",
      dataIndex: "total_coil",
      key: "total_coil",
      align: "right",
      render: (total_coil) => total_coil?.toLocaleString(),
    },
  ];

  const chargeColumn = [
    {
      title: "ลำดับ",
      key: "index",
      render: (text, record, idx) => idx + 1,
      align: "center",
    },
    {
      title: "CHARGE NO.",
      key: "charge_no",
      dataIndex: "charge_no",
      width: "40%",
    },
    {
      title: "TOTAL COIL",
      key: "total_coil",
      dataIndex: "total_coil",
      align: "right",
    },
    {
      title: "SELECT",
      key: "select",
      align: "center",
      render: (record) => (
        <Button
          type="primary"
          style={{
            background: currentCharge === record?.charge_no ? "#23a123" : "",
          }}
          icon={<RightCircleOutlined />}
          onClick={() => {
            setCoilPage(1);
            setCurrentCharge(record?.charge_no);
          }}
        />
      ),
    },
  ];

  const coilColumn = [
    {
      title: "COIL NO.",
      key: "coil_no",
      dataIndex: "coil_no",
      width: "10%",
      align: "center",
      render: (coil_no) => coil_no,
    },
    {
      title: "SIZE",
      key: "size",
      dataIndex: "size",
      align: "center",
      render: (size) => +size,
    },
    {
      title: "GRADE",
      key: "grade",
      dataIndex: "grade",
      align: "center",
    },
    {
      title: "WEIGHT",
      key: "weight",
      dataIndex: "weight",
      align: "right",
    },
    {
      title: "TOT ACC",
      key: "tot_acc",
      dataIndex: "tot_acc",
      align: "right",
    },
    {
      title: "ISSUE DATE",
      key: "iss_dte",
      dataIndex: "iss_dte",
      align: "center",
      width: "25%",
      render: (iss_dte) =>
        iss_dte ? dayjs(iss_dte).format("DD/MM/YYYY") : "-",
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
      {!currentLc ? (
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
            dataSource={lcList}
            columns={mainColumn}
            onRow={(record) => ({
              onClick: () => handleSelectLc(record),
            })}
            pagination={false}
            size="small"
            bordered
            className="table-click-able"
            style={{ marginTop: "1rem" }}
            rowKey="lc_no"
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
      ) : (
        <Card className="card-dashboard" style={{ marginTop: "10px" }}>
          <Row gutter={[32, 16]}>
            <Col span={8}>
              <div style={{ marginBottom: "1rem" }}>
                <h1 style={{ fontSize: "18px", margin: "0px" }}>
                  <span style={{ color: "#333333" }}>Lc No. :</span> {currentLc}
                </h1>
              </div>
              <Table
                dataSource={chargeList}
                size="middle"
                bordered
                columns={chargeColumn}
                rowKey="charge_no"
              />
            </Col>
            <Col span={16}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h1 style={{ fontSize: "18px", margin: "0px" }}>
                  {currentCharge && (
                    <>
                      <span style={{ color: "#333333" }}>Charge No. :</span>
                      {currentCharge}
                    </>
                  )}
                </h1>

                <Button
                  type="primary"
                  onClick={() => {
                    setCurrentCharge("");
                    setCurrentLc("");
                    setCoilList([]);
                  }}
                >
                  BACK
                </Button>
              </div>

              <Table
                dataSource={coilList}
                size="middle"
                bordered
                className="table-click-able"
                pagination={false}
                loading={isLoading}
                columns={coilColumn}
                onRow={(record) => ({
                  onClick: () => handleEditCharge(record),
                })}
                rowKey="wr_code"
              />
              <Pagination
                showSizeChanger
                total={coilTotalItems}
                showTotal={(total) => `จำนวนทั้งหมด ${total?.toLocaleString()}`}
                defaultPageSize={10}
                defaultCurrent={1}
                current={coilPage}
                style={{ marginTop: "20px", textAlign: "right" }}
                onChange={(newPage) => setCoilPage(newPage)}
                onShowSizeChange={(current, limit) => setCoilPageLimit(limit)}
              />
            </Col>
          </Row>
        </Card>
      )}

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
          initialValues={{
            remember: true,
          }}
          onFinish={handleGenWrDetail}
          autoComplete="off"
          ref={formRef}
        >
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
                            <Input disabled={verifiedRec} />
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
                                    verifiedRec ? <CheckCircleOutlined /> : null
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
                              disabled={isFinish}
                              style={{ width: "100%" }}
                              format={"DD/MM/YYYY"}
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
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Select
                              disabled={isFinish}
                              onChange={handleChangeVendor}
                              options={vendorList.map((option) => ({
                                value: option?.code,
                                label: option?.code,
                              }))}
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
                            name="vendor_name"
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
                            name="product_id"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Select
                              disabled={isFinish}
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
                            <Input disabled={isFinish} />
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

                    <Col xs={22}>
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
                            <Input
                              ref={inputRef}
                              onKeyDown={handleKeyPress}
                              disabled={isFinish}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

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
                              disabled={isFinish}
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
                              disabled={isFinish}
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
                              disabled={isFinish}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={24} style={{ textAlign: "right" }}>
                      <Space>
                        {isFinish && (
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

                        <Button
                          type="primary"
                          style={{ marginRight: "10px", height: "40px" }}
                          htmlType="submit"
                        >
                          {!isFinish ? "สร้างรายการ (ENTER)" : "แก้ไขข้อมูล"}
                        </Button>

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
        </Form>

        <Table
          bordered
          dataSource={dataList}
          columns={editableColumn}
          pagination={false}
          scroll={{ x: 900 }}
          size="small"
          rowKey="index"
        />
      </Modal>

      <Modal
        title="แก้ไขรายการนำเข้า"
        open={isOpenEditingModal}
        onCancel={handleCloseEditingModal}
        width={800}
        footer={null}
        maskClosable={false}
      >
        <Form
          form={formEditWeight}
          id="editWeightForm"
          name="editWeightForm"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinishEditWeight}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="LC No." name="lc_no">
                <Input disabled />
              </Form.Item>

              <Form.Item label="Coil No." name="coil_no">
                <Input disabled />
              </Form.Item>

              <Form.Item label="ขนาด" name="size">
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="น้ำหนัก"
                name="weight"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Charge No." name="charge_no">
                <Input disabled />
              </Form.Item>

              <Form.Item label="เกรดวัตถุดิบ" name="grade">
                <Input disabled />
              </Form.Item>

              <Form.Item label="วันที่นำเข้า" name="rcv_date">
                <Input disabled />
              </Form.Item>

              <Form.Item label="น้ำหนักเฉลี่ย" name="tot_acc">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              htmlType="submit"
            >
              บันทึก
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UIWrImportTemp;
