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
  DatePicker,
  Select,
  message,
  Tag,
} from "antd";
import SaleOrderService from "services/SaleOrderService";
import {
  CheckCircleOutlined,
  RightCircleOutlined,
  PrinterFilled,
} from "@ant-design/icons";
import { delay } from "utils/utils";
import SettingService from "services/SettingService";
import $ from "jquery";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import ModalDataSelector from "component/Modal/ModalDataSelector";
import {
  SELECTOR_CUSTOMER,
  SELECTOR_SELLER,
  SELECTOR_TRANSPORT,
} from "context/constant";

const UISaleOrder = () => {
  const [bokVolList, setBokVolList] = useState([]);
  const [bokNoList, setBokNoList] = useState([]);
  const [currentBokVol, setCurrentBokVol] = useState(null);
  const [currentBokNo, setCurrentBokNo] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [dataDetail, setDataDetail] = useState({});

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [timeQuery, setTimeQuery] = useState({});

  // === SUB PAGE CONFIG === //
  const [subPage, setSubPage] = useState(1);
  const [subPageLimit, setSubPageLimit] = useState(10);
  const [subTotalItems, setSubTotalItems] = useState(0);

  // === MODAL CONTROLLER === //
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalList, setIsOpenModalList] = useState(false);
  const [isOpenModalSelect, setIsOpenModalSelect] = useState(false);

  const [currentRender, setCurrentRender] = useState("");

  const [verifiedBok, setVerifiedBok] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBok, setIsLoadingBok] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form] = Form.useForm();
  const [formAddProduct] = Form.useForm();

  const formRef = useRef(null);
  const formAddProductRef = useRef(null);
  const inputRef = useRef();

  useEffect(() => {
    fetchBokVol();
  }, [page, pageLimit, timeQuery]);

  useEffect(() => {
    if (currentBokVol) {
      setIsLoading(true);
      fetchBokNo();
    }
  }, [currentBokVol, subPage, subPageLimit]);

  useEffect(() => {
    if (currentBokVol && currentBokNo) fetchBokDetail();
  }, [currentBokNo]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isOpenModal && event.keyCode === 121) {
        console.log("DATA LIST TO SAVED ==> ", dataList);
        handleSaveBok();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  const fetchBokVol = () => {
    let pageConf = {
      page,
      pageLimit,
      timeQuery: timeQuery?.dateString ? timeQuery?.dateString : "",
    };

    SaleOrderService.getPOrderBokVol(pageConf)
      .then(({ data }) => {
        setBokVolList(data?.items);
        setTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBokNo = async () => {
    let pageConf = {
      bokVol: currentBokVol,
      page: subPage,
      pageLimit: subPageLimit,
      timeQuery: timeQuery?.dateString ? timeQuery?.dateString : "",
    };

    await delay(300);
    SaleOrderService.getPOrderBokNo(pageConf)
      .then(({ data }) => {
        setBokNoList(data?.items);
        setSubTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const fetchBokDetail = () => {
    SaleOrderService.getOrderDetail({
      bokVol: currentBokVol,
      bokNo: currentBokNo,
    })
      .then(({ data }) => {
        if (data) {
          let { mainDetail, items } = data;

          form.setFieldsValue({
            aliCode: mainDetail?.aliCode,
            bokVol: currentBokVol,
            bokNo: currentBokNo,
            oDate: mainDetail?.oDate && dayjs(mainDetail?.oDate),
            inDate: mainDetail?.inDate && dayjs(mainDetail?.inDate),
            lateDate: mainDetail?.lateDate && dayjs(mainDetail?.lateDate),
            carNo: mainDetail?.carNo,
            saleNo: mainDetail?.saleNo,
            saleName: mainDetail?.saleName,
            cusNo: mainDetail?.cusNo,
            cusName: mainDetail?.cusName,
            trnCode: mainDetail?.trnCode,
            trnName: mainDetail?.trnName,
          });

          setDataList(items);
          setDataDetail(mainDetail);
          setIsOpenModal(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
    let current = dayjs();
    form.setFieldsValue({
      oDate: current,
      inDate: current,
      lateDate: current,
      bokVol: "0" + (current.year() + 543).toString().substring(2),
    });
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setIsEdit(false);
    setDataList([]);
    setCurrentBokNo(null);
    setDataDetail({});
    setVerifiedBok(null);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsOpenModalList(false);
  };

  const handleChangeBokVol = (bokVol) => {
    setSubPage(1);
    setSubTotalItems(0);
    setBokNoList([]);
    setCurrentBokVol(bokVol);
  };

  const resetPageData = () => {
    setPage(1);
    setSubPage(1);
    setSubTotalItems(0);
    setCurrentBokVol(null);
    setBokVolList([]);
    setBokNoList([]);
  };

  const onChange = (date, dateString) => {
    setTimeQuery({ date, dateString });
    resetPageData();
  };

  const resetFields = () => {
    form.resetFields();
  };

  const focusNextInput = (type) => {
    const form = !type ? formRef.current : formAddProductRef.current;

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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (event?.target?.name === "bok_no") {
        event.preventDefault();
        handleVerifyBok();
      } else {
        let next = focusNextInput();
        event.preventDefault();
        if (typeof next === "object") {
          next.focus();
        }
      }
    }
  };

  const handleVerifyBok = async () => {
    if (verifiedBok || isEdit) return;

    let bokVolUndefied = form.getFieldValue("bokVol");
    let bokNoUndefied = form.getFieldValue("bokNo");
    let bokData = `${bokVolUndefied}:${bokNoUndefied}`;

    if (bokVolUndefied && bokNoUndefied) {
      setIsLoadingBok(true);
      await delay(1000);

      SaleOrderService.verifyVol(bokVolUndefied, bokNoUndefied)
        .then(({ data }) => {
          message.success(`[${data?.status}] : ${data?.message}`);
          setVerifiedBok(bokData);
        })
        .catch((err) => {
          if (err?.response)
            message.error(
              `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
            );
        })
        .finally(() => setIsLoadingBok(false));
    } else {
      return message.warning(
        "กรุณากรอก 'เล่มที่ใบอนุมัติจ่าย' และ 'เลขที่ใบอนุมัติจ่าย' ก่อนทำการตรวจสอบ"
      );
    }
  };

  const handleSearchCustomer = (aliCode) => {
    if (aliCode) {
      SettingService.findOneByAliCode(aliCode)
        .then(({ data }) => {
          let { detail } = data;

          form.setFieldValue("cusNo", detail?.cusno);
          form.setFieldValue("cusName", detail?.name);

          message.success(`[${data?.status}] : ${data?.message}`);
        })
        .catch((err) => {
          if (err?.response)
            message.error(
              `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
            );
        });
    } else {
      setIsOpenModalSelect(true);
      setCurrentRender(SELECTOR_CUSTOMER);
    }
  };

  const handleSearchTransport = (trnCode) => {
    if (trnCode) {
      SettingService.findOneByTrnCode(trnCode)
        .then(({ data }) => {
          let { detail } = data;

          form.setFieldValue("trnName", detail?.name);

          message.success(`[${data?.status}] : ${data?.message}`);
        })
        .catch((err) => {
          if (err?.response)
            message.error(
              `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
            );
        });
    } else {
      setIsOpenModalSelect(true);
      setCurrentRender("TRANSPORT_SELECT");
    }
  };

  const handleSearchSeller = (saleNo) => {
    if (saleNo) {
      SettingService.findOneBySaleNo(saleNo)
        .then(({ data }) => {
          let { detail } = data;

          let firstName = detail?.namesale ? detail?.namesale : "-";
          let lastName = detail?.lastname ? detail?.lastname : "-";
          form.setFieldValue("saleName", `${firstName} ${lastName}`);

          message.success(`[${data?.status}] : ${data?.message}`);
        })
        .catch((err) => {
          if (err?.response)
            message.error(
              `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
            );
        });
    } else {
      setIsOpenModalSelect(true);
      setCurrentRender("SELLER_SELECT");
    }
  };

  const handleSearchProductCode = (productCode) => {
    SettingService.findOneByProductCode(productCode)
      .then(({ data }) => {
        let { detail } = data;

        formAddProduct.setFieldValue("productName", detail?.productname);
        formAddProduct.setFieldValue("productType", detail?.producttype);

        message.success(`[${data?.status}] : ${data?.message}`);
        focusNextInput("ADD").focus();
      })
      .catch((err) => {
        if (err?.response)
          message.error(
            `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
          );
      });
  };

  const handleSelectData = (record) => {
    if (currentRender === SELECTOR_CUSTOMER) {
      form.setFieldValue("aliCode", record?.ali);
      form.setFieldValue("cusNo", record?.cusno);
      form.setFieldValue("cusName", record?.name);
    } else if (currentRender === SELECTOR_TRANSPORT) {
      form.setFieldValue("trnCode", record?.trncode);
      form.setFieldValue("trnName", record?.name);
    } else if (currentRender === SELECTOR_SELLER) {
      let firstName = record?.namesale ? record?.namesale : "-";
      let lastName = record?.lastname ? record?.lastname : "-";
      form.setFieldValue("saleName", `${firstName} ${lastName}`);
      form.setFieldValue("saleNo", record?.saleno);
    }

    setIsOpenModalSelect(false);
    setCurrentRender(null);
  };

  const resetData = () => {
    setDataList([]);
    setVerifiedBok(null);
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
        message.success("SUCCESS : รีเซ็ตข้อมูลทั้งหมดเรียบร้อยแล้ว");
      }
    });
  };

  const handlEditData = (record) => {
    setCurrentBokNo(record?.vol_no);
    setIsEdit(true);
  };

  const handleCancelBok = () => {
    let text = dataDetail?.status === "C" ? "ยกเลิกอนุมัติจ่าย" : "อนุมัติจ่าย";
    Swal.fire({
      icon: "warning",
      title: "คำเตือน",
      text: `คุณต้องการที่จะเปลี่ยน 'สถานะ' เป็น ${text} ใช่หรือไม่ ?`,
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
        SaleOrderService.changeStatus({
          bokVol: currentBokVol,
          bokNo: currentBokNo,
          status: dataDetail?.status,
        })
          .then(({ data }) => {
            message.success(`[${data?.status}] : ${data?.message}`);
            fetchBokDetail();
            fetchBokNo();
          })
          .catch((err) => {
            message.error(
              `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
            );
          });
      }
    });
  };

  const handleAddProduct = async (values) => {
    setDataList((prev) => [...prev, values]);
    // setIsOpenModalList(false);
    formAddProduct.resetFields([
      "productType",
      "productCode",
      "productName",
      "quantity",
      "uPrice",
    ]);
    await delay(100);
    inputRef.current.focus();
  };

  const handleSaveBok = async () => {
    if (!isEdit && !verifiedBok)
      return message.warning("กรุณากดปุ่มตรวจสอบ Bok Vol. ก่อนทำรายการต่อไป");

    if (dataList.length == 0)
      return message.warning("กรุณาเพิ่มรายการสินค้า ก่อนทำการบันทึกเข้าระบบ");

    if (!isEdit) {
      form
        .validateFields()
        .then((values) => {
          let temp = [];
          dataList.forEach((item) => {
            temp.push({ ...item, ...values });
          });

          SaleOrderService.createOrder(temp)
            .then(({ data }) => {
              message.success(`[${data?.status}] : ${data?.message}`);
              handleCloseModal();
              fetchBokVol();
              if (currentBokVol) fetchBokNo();
            })
            .catch((err) => {
              message.error(
                `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
              );
            });
        })
        .catch((err) => console.log(err));
    } else {
      form
        .validateFields()
        .then((values) => {
          console.log(values);
          let temp = [];

          dataList.forEach((item) => {
            temp.push({
              id: item?.id,
              oDate: values?.values,
              aliCode: values?.aliCode,
              cusNo: values?.cusNo,
              trnCode: values?.trnCode,
              carNo: values?.carNo,
              inDate: values?.inDate,
              lateDate: values?.lateDate,
              saleNo: values?.saleNo,
            });
          });

          SaleOrderService.updateOrder(temp)
            .then(({ data }) => {
              message.success(`[${data?.status}] : ${data?.message}`);
              handleCloseModal();
              fetchBokVol();
              if (currentBokVol) fetchBokNo();
            })
            .catch((err) => {
              message.error(
                `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
              );
            });
        })
        .catch((err) => console.log(err));
    }
  };

  const mainColumn = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "10%",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
    },
    {
      title: "เล่มที่ใบอนุมัติจ่าย (BOK VOL.)",
      dataIndex: "bok_no",
      key: "bok_no",
      render: (bok_no) => (
        <span style={{ color: "#29f", fontWeight: "bold" }}>{bok_no}</span>
      ),
    },
    {
      title: "จำนวน",
      dataIndex: "total_bok_no",
      key: "total_bok_no",
      align: "right",
      render: (total_bok_no) => total_bok_no?.toLocaleString(),
    },
    {
      title: "เลือก",
      key: "select",
      align: "center",
      render: (record) => (
        <Button
          type="primary"
          style={{
            background: currentBokVol === record?.bok_no ? "#23a123" : "",
          }}
          icon={<RightCircleOutlined />}
          onClick={() => handleChangeBokVol(record?.bok_no)}
        />
      ),
    },
  ];

  const mainColumn2 = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "10%",
      render: (text, record, idx) => (subPage - 1) * subPageLimit + (idx + 1),
    },
    {
      title: "เลขที่ใบอนุมัติจ่าย (BOK NO.)",
      dataIndex: "vol_no",
      key: "vol_no",
    },
    {
      title: "วันที่ใบอนุมัติจ่าย",
      key: "odate",
      dataIndex: "odate",
      align: "center",
    },
    {
      title: "สถานะ",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (status) => {
        let obj =
          status === "C"
            ? { title: "ปิดจ่าย", color: "green" }
            : { title: "ยังไม่ปิดจ่าย", color: "#da2a35" };
        return <Tag color={obj?.color}>{obj?.title}</Tag>;
      },
    },
  ];

  const addColumn = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (text, record, idx) => (page - 1) * 10 + (idx + 1),
    },
    {
      title: "หมายเลขคำสั่งซื้อ",
      dataIndex: "orderNo",
      key: "orderNo",
      align: "center",
    },
    {
      title: "วันที่",
      dataIndex: "orderDate",
      key: "orderDate",
      align: "center",
      render: (orderDate) =>
        orderDate ? dayjs(orderDate).format("DD/MM/YYYY") : "",
    },
    {
      title: "รหัสสินค้า",
      dataIndex: "productCode",
      key: "productCode",
      align: "center",
      render: (productCode) => <Tag color="red">{productCode}</Tag>,
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (quantity) => quantity?.toLocaleString(),
    },
    {
      title: "ราคาขาย",
      dataIndex: "uPrice",
      key: "uPrice",
      align: "center",
      render: (uPrice) => uPrice?.toLocaleString(),
    },
    // {
    //   title: "รวม",
    //   key: "totalPrice",
    //   align: "center",
    //   render: (record) => (record?.quantity * +record?.u_price)?.toLocaleString(),
    // },
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
          <h1 style={{ fontSize: "18px" }}>ใบอนุมัติจ่าย</h1>
          <Space>
            <DatePicker onChange={onChange} value={timeQuery?.date} />
            {/* <Button
              icon={<PrinterFilled />}
              type="primary"
              style={{ width: "100%", maxWidth: "138px", margin: "0" }}
            >
              พิมพ์
            </Button>
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
            </Button> */}
            <Button
              type="primary"
              style={{ width: "100%", maxWidth: "138px", margin: "0" }}
              onClick={handleOpenModal}
            >
              เพิ่มใบอนุมัติจ่าย
            </Button>
          </Space>
        </div>

        <Row gutter={[32, 16]}>
          <Col span={12}>
            <Table
              dataSource={bokVolList}
              columns={mainColumn}
              size="small"
              bordered
              rowKey="bok_no"
              style={{ marginTop: "1rem" }}
              pagination={false}
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
              dataSource={bokNoList}
              columns={mainColumn2}
              size="small"
              bordered
              rowKey="vol_no"
              style={{ marginTop: "1rem" }}
              pagination={false}
              loading={isLoading}
              onRow={(record) => ({
                onClick: () => handlEditData(record),
              })}
              className="table-click-able"
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
              onShowSizeChange={(current, limit) => {
                setSubPageLimit(limit);
              }}
            />
          </Col>
        </Row>
      </Card>

      <Modal
        title={isEdit ? "แก้ไขใบอนุมัติจ่าย" : "เพิ่มใบอนุมัติจ่าย"}
        open={isOpenModal}
        onCancel={handleCloseModal}
        width={1100}
        footer={null}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={form}
          id="saleOrderForm"
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
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
                        <Col xs={8}>เล่มที่ใบอนุมัติจ่าย</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="bokVol"
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
                              disabled={isEdit || verifiedBok}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={8}>เลขที่ใบอนุมัติจ่าย</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="bokNo"
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
                              name="bok_no"
                              disabled={isEdit || verifiedBok}
                              addonAfter={
                                <Button
                                  className="bt-verified"
                                  type="primary"
                                  onClick={handleVerifyBok}
                                  loading={isLoadingBok}
                                  style={{
                                    backgroundColor:
                                      verifiedBok ||
                                      (isEdit && "rgb(35, 161, 35)"),
                                  }}
                                  icon={
                                    verifiedBok || isEdit ? (
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
                        <Col xs={8}>วันที่</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="oDate"
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
                        <Col xs={8}>ตัวย่อ</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="aliCode"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input.Search
                              placeholder="ค้นหาตัวย่อลูกค้า"
                              onSearch={(value, event) => {
                                event.preventDefault();
                                handleSearchCustomer(value);
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={22}>
                      <Row>
                        <Col xs={8}>รหัสลูกค้า</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="cusNo"
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
                    <Col xs={22}>
                      <Row>
                        <Col xs={8}>ชื่อลูกค้า</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="cusName"
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
                  </Row>
                </Card>
              </Col>

              <Col span={12}>
                <Card
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
                        <Col xs={8}>รหัสบริษัทขนส่ง</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="trnCode"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input.Search
                              placeholder="ค้นหารหัสบริษัทขนส่ง"
                              onSearch={(value, event) => {
                                event.preventDefault();
                                handleSearchTransport(value);
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={8}>ชื่อบริษัทขนส่ง</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="trnName"
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

                    <Col xs={22}>
                      <Row>
                        <Col xs={8}>ทะเบียนรถ</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="carNo"
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
                        <Col xs={8}>In Date</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="inDate"
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
                        <Col xs={8}>Late Date</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="lateDate"
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
                        <Col xs={8}>รหัสพนักงานขาย</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="saleNo"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input.Search
                              placeholder="ค้นหารหัสพนักงานขาย"
                              onSearch={(value, event) => {
                                event.preventDefault();
                                handleSearchSeller(value);
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={8}>ชื่อพนักงานขาย</Col>
                        <Col xs={16}>
                          <Form.Item
                            name="saleName"
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

                    <Col
                      xs={24}
                      style={{ textAlign: "right", marginTop: "15px" }}
                    >
                      <Space>
                        {!isEdit ? (
                          <>
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
                              onClick={() => {
                                setIsOpenModalList(true);
                                formAddProduct.setFieldValue(
                                  "orderDate",
                                  dayjs()
                                );
                              }}
                            >
                              เพิ่มรายการ
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="primary"
                            danger
                            style={{ marginRight: "10px", height: "40px" }}
                            onClick={handleCancelBok}
                          >
                            {dataDetail?.status === "C"
                              ? "ยกเลิกอนุมัติจ่าย"
                              : "อนุมัติจ่าย"}
                          </Button>
                        )}

                        <Button
                          type="primary"
                          style={{
                            marginRight: "10px",
                            height: "40px",
                            backgroundColor: "#23a123",
                          }}
                          onClick={handleSaveBok}
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
          columns={addColumn}
          pagination={false}
          scroll={{ x: 900 }}
          size="small"
          rowKey="id"
        />
      </Modal>

      <Modal
        title="เพิ่มรายการสินค้าที่ต้องการขาย"
        open={isOpenModalList}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={formAddProduct}
          id="formAddProduct"
          name="formAddProduct"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleAddProduct}
          autoComplete="off"
          ref={formAddProductRef}
        >
          <Card>
            <Row gutter={[8, 16]}>
              <Col xs={24}>
                <Row>
                  <Col xs={8}>Order No.</Col>
                  <Col xs={16}>
                    <Form.Item
                      name="orderNo"
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

              <Col xs={24}>
                <Row>
                  <Col xs={8}>Order Date.</Col>
                  <Col xs={16}>
                    <Form.Item
                      name="orderDate"
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

              <Col xs={24}>
                <Row>
                  <Col xs={8}>รหัสสินค้า</Col>
                  <Col xs={16}>
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
                      <Input.Search
                        ref={inputRef}
                        placeholder="ค้นหารหัสสินค้า"
                        allowClear
                        onSearch={(value, event) => {
                          event.preventDefault();
                          handleSearchProductCode(value);
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col xs={24}>
                <Row>
                  <Col xs={8}>ประเภทสินค้า</Col>
                  <Col xs={16}>
                    <Form.Item
                      name="productType"
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

              <Col xs={24}>
                <Row>
                  <Col xs={8}>ชื่อเต็มสินค้า</Col>
                  <Col xs={16}>
                    <Form.Item
                      name="productName"
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

              <Col xs={24}>
                <Row>
                  <Col xs={8}>จำนวน</Col>
                  <Col xs={16}>
                    <Form.Item
                      name="quantity"
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
                </Row>
              </Col>

              <Col xs={24}>
                <Row>
                  <Col xs={8}>ราคาขาย</Col>
                  <Col xs={16}>
                    <Form.Item
                      name="uPrice"
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
                </Row>
              </Col>
            </Row>
          </Card>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="primary"
              style={{ height: "40px", marginTop: "10px" }}
              htmlType="submit"
            >
              ยืนยัน
            </Button>
          </div>
        </Form>
      </Modal>

      {isOpenModalSelect && (
        <ModalDataSelector
          isOpen={isOpenModalSelect}
          onClose={() => {
            setCurrentRender("");
            setIsOpenModalSelect(false);
          }}
          currentRender={currentRender}
          onSelect={(record) => handleSelectData(record)}
        />
      )}
    </>
  );
};

export default UISaleOrder;
