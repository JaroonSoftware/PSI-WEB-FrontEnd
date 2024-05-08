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
} from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
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

const UIWrImportDeprecated = () => {
  const [recVolList, setRecVolList] = useState([]);
  const [recNoList, setRecNoList] = useState([]);

  const [dataList, setDataList] = useState([]);
  const [verifiedCharge, setVerifiedCharge] = useState(null);
  const [verifiedRec, setVerifiedRec] = useState(null);

  const [vendorList, setVendorList] = useState([]);
  const [productCodeList, setProductCodeList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRec, setIsLoadingRec] = useState(false);

  // === MODAL CONTROLLER === //
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const [isOpenEditingModal, setIsOpenEditingModal] = useState(false);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // === SUB PAGE CONFIG === //
  const [subPage, setSubPage] = useState(1);
  const [subPageLimit, setSubPageLimit] = useState(10);
  const [subTotalItems, setSubTotalItems] = useState(0);

  const [currentRecVol, setCurrentRecVol] = useState(null);
  const [currentRecNo, setCurrentRecNo] = useState(null);

  const [form] = Form.useForm();
  const [formEditWeight] = Form.useForm();

  const inputRef = useRef();
  const formRef = useRef(null);

  useEffect(() => {
    fetchRecVol();
  }, [page, pageLimit]);

  useEffect(() => {
    if (currentRecVol) {
      setIsLoading(true);
      fetchRecNo();
    }
  }, [currentRecVol, subPage, subPageLimit]);

  useEffect(() => {
    if (currentRecNo) fetchImportDetail();
  }, [currentRecNo]);

  useEffect(() => {
    if (isOpenImportModal && !currentRecNo) {
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

  const fetchRecVol = () => {
    let pageConf = { page, pageLimit };

    WireRodService.getRecVol(pageConf)
      .then(({ data }) => {
        setRecVolList(data?.items);
        setTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchRecNo = async () => {
    let pageConf = {
      recVol: currentRecVol,
      page: subPage,
      pageLimit: subPageLimit,
    };

    await delay(300);
    WireRodService.getRecNo(pageConf)
      .then(({ data }) => {
        setRecNoList(data?.items);
        setSubTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
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

  const fetchImportDetail = () => {
    let reqData = { recVol: currentRecVol, recNo: currentRecNo };
    WireRodService.getWrImportDetail(reqData)
      .then(({ data }) => {
        console.log(data);
        setDataList(data?.items);
      })
      .catch((err) => console.log(err));
  };

  const handleChangeRecVol = (recVol) => {
    setSubPage(1);
    setSubTotalItems(0);
    setCurrentRecVol(recVol);
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

  const resetFields = () => {
    form.resetFields();
  };

  const resetData = () => {
    setDataList([]);
    setVerifiedCharge(null);
    setVerifiedRec(null);
    setCurrentRecNo(null);
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

  const handleCreateData = (values) => {
    if (!verifiedRec)
      return message.warning("กรุณากดปุ่มตรวจสอบ Rec No. ก่อนทำรายการต่อไป");

    if (!verifiedCharge)
      return message.warning("กรุณากดปุ่มตรวจสอบ Charge No. ก่อนทำรายการต่อไป");

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
        // fetchCoil();
        message.success(`${data?.status} : ${data?.message}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImportWr = () => {
    let importList = dataList.filter((i) => i?.deleteAble);

    if (importList.length <= 0) {
      return message.warning("กรุณากรอกข้อมูล ก่อนบันทึกเข้าระบบ");
    }

    WireRodService.importWireRod(importList)
      .then(({ data }) => {
        handleCloseModal();
        // fetchLc();
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

  const handleViewImportData = (record) => {
    setCurrentRecNo(record?.rec_no);
    setIsOpenImportModal(true);
    form.setFieldValue("rcv_date", dayjs(record?.rcv_date));
    form.setFieldValue("rec_vol", currentRecVol);
    form.setFieldValue("rec_no", record?.rec_no);
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
            <Input.Search
              placeholder="ค้นหา Lc"
              allowClear
              onSearch={() => {}}
              style={{ width: 200 }}
            />

            <DatePicker />

            <Button
              type="primary"
              style={{ width: "100%", maxWidth: "138px", margin: "0" }}
              onClick={handleOpenImportModal}
            >
              เพิ่มรายการนำเข้า
            </Button>
          </Space>
        </div>

        <Row gutter={[32, 16]}>
          <Col span={12}>
            <Table
              dataSource={recVolList}
              columns={COLUMN.RECIEVE_VOL(
                page,
                pageLimit,
                currentRecVol,
                handleChangeRecVol
              )}
              pagination={false}
              size="small"
              bordered
              rowKey="rec_vol"
              style={{ marginTop: "1rem" }}
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
          </Col>

          <Col span={12}>
            <Table
              dataSource={recNoList}
              columns={COLUMN.RECIEVE_NO(subPage, subPageLimit)}
              pagination={false}
              size="small"
              bordered
              rowKey="rec_no"
              style={{ marginTop: "1rem" }}
              loading={isLoading}
              className="table-click-able"
              onRow={(record) => ({
                onClick: () => handleViewImportData(record),
              })}
            />

            <Pagination
              showSizeChanger
              total={subTotalItems}
              showTotal={(total) => `จำนวนทั้งหมด ${total?.toLocaleString()}`}
              defaultPageSize={10}
              defaultCurrent={1}
              current={subPage}
              style={{ marginTop: "20px", textAlign: "right" }}
              onChange={(newPage) => setSubPage(newPage)}
              onShowSizeChange={(current, limit) => setSubPageLimit(limit)}
            />
          </Col>
        </Row>
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
            {!currentRecNo ? (
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
                                  <Input onKeyDown={handleKeyPress} />
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
                                            verifiedCharge &&
                                            "rgb(35, 161, 35)",
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
                                  <Input onKeyDown={handleKeyPress} />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>

                          <Col
                            xs={24}
                            style={{ textAlign: "right", marginTop: "15px" }}
                          >
                            <Space>
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

                              <Button
                                type="primary"
                                style={{ marginRight: "10px", height: "40px" }}
                                htmlType="submit"
                              >
                                สร้างรายการ (ENTER)
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
              </Col>
            ) : (
              <>
                <Col span={6}>
                  <Form.Item
                    label="วันที่รับ"
                    name="rcv_date"
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
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="เล่มที่ใบรับ"
                    name="rec_vol"
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
                <Col span={6}>
                  <Form.Item
                    label="เลขที่ใบรับ"
                    name="rec_no"
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
              </>
            )}

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
          </Row>
        </Form>
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
          initialValues={{ remember: true }}
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

export default UIWrImportDeprecated;
