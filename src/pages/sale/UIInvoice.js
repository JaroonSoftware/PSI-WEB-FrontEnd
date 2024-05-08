import React, { useEffect, useState, useRef } from "react";
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
  Divider,
  Tag,
  message,
  Tabs,
} from "antd";
import { PlusOutlined, RightCircleOutlined } from "@ant-design/icons";
import SaleOrderService from "services/SaleOrderService";
import dayjs from "dayjs";
import { delay } from "utils/utils";
import ProductService from "services/ProductService";
import ProductPreparing from "component/Card/ProductPreparing";
import { useReactToPrint } from "react-to-print";
import { COLUMN } from "context/column";

const UIInvoice = () => {
  const [bokVolList, setBokVolList] = useState([]);
  const [volList, setVolList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [productList, setProuctList] = useState([]);

  const [currentBokVol, setCurrentBokVol] = useState(null);
  const [currentVolId, setCurrentVolId] = useState(null);
  const [currentItem, setCurrentItem] = useState({});
  const [requirement, setRequirement] = useState({});

  const [selectedList, setSelectedList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [timeQuery, setTimeQuery] = useState({});

  // === SUB PAGE CONFIG === //
  const [subPage, setSubPage] = useState(1);
  const [subPageLimit, setSubPageLimit] = useState(10);
  const [subTotalItems, setSubTotalItems] = useState(0);

  // === PRE ORDER PAGE CONFIG === //
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageLimit, setOrderPageLimit] = useState(10);
  const [orderTotalItems, setOrderTotalItems] = useState(0);
  const [orderQuery, setOrderQuery] = useState("");

  // === PRODUCT PAGE CONFIG === //
  const [productPage, setProductPage] = useState(1);
  const [productPageLimit, setProductPageLimit] = useState(10);
  const [productTotalItems, setProductTotalItems] = useState(0);
  const [productQuery, setProductQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const printRef = useRef();
  const { Option } = Select;

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
    if (currentBokVol && currentVolId) fetchInvoiceDetail();
  }, [currentVolId]);

  useEffect(() => {
    if (isModalOpen) fetchPreOrder();
  }, [isModalOpen, orderPage, orderPageLimit, orderQuery]);

  useEffect(() => {
    if (isModalOpenAdd) fetchProduct();
  }, [isModalOpenAdd, productPage, productPageLimit, productQuery]);

  const fetchProduct = () => {
    let pageConf = {
      page: productPage,
      pageLimit: productPageLimit,
      query: productQuery,
      productCode: requirement?.code,
    };
    ProductService.getProductReadyToSell(pageConf)
      .then(({ data }) => {
        console.log(data);
        setProuctList(data?.items);
        setProductTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBokVol = () => {
    let pageConf = {
      page,
      pageLimit,
      timeQuery: timeQuery?.dateString ? timeQuery?.dateString : "",
    };

    SaleOrderService.getInvoiceBokVol(pageConf)
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
    setVolList([]);
    await delay(300);
    SaleOrderService.getInvoiceBokNo(pageConf)
      .then(({ data }) => {
        setVolList(data?.items);
        setSubTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const fetchInvoiceDetail = () => {
    SaleOrderService.getInvoiceDetail(currentVolId)
      .then(({ data }) => {
        if (data) {
          console.log(data);
          let { invoice, list } = data;
          let temp = invoice[0];

          form.setFieldsValue({
            bok_no: temp?.bok_no,
            vol_no: temp?.vol_no,
            cusname: temp?.cusname,
            gdspay: temp?.gdspay,
            address: temp?.add1 + " " + temp?.add2 + " " + temp?.add3,
            gds_date: temp?.gdsdate && dayjs(temp?.gdsdate),
            shipping_address: "ยังไม่เปิดใช้งาน",
            shipping_cost: "ยังไม่เปิดใช้งาน",
          });

          if (list.length > 0) {
            let sum = list.reduce((n, { weight }) => n + weight, 0);
            list = [...list, { key: "sum", weight: sum }];
          }

          setCurrentItem({ invoice, list });
          setIsModalOpenEdit(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchPreOrder = () => {
    let pageConf = {
      page: orderPage,
      pageLimit: orderPageLimit,
      query: orderQuery,
    };
    SaleOrderService.getPreOrder(pageConf)
      .then(({ data }) => {
        console.log(data);
        setOrderList(data?.items);
        setOrderTotalItems(data?.total);
      })
      .catch((err) => console.log(err));
  };

  const handleChangeBokVol = (bokVol) => {
    setSubPage(1);
    setSubTotalItems(0);
    setVolList([]);
    setCurrentBokVol(bokVol);
  };

  const checkDupItem = (proCode) => {
    let isDup = false;
    selectedList.forEach((item) => {
      if (item?.procode === proCode) isDup = true;
    });
    return isDup;
  };

  const handleAddProduct = (record) => {
    console.log("PRODUCT DATA ==>", record);
    // setCoilData(record);
    setSelectedList((prev) => [...prev, record]);
    // handleCloseModal();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOpenAddModal = (record) => {
    formAdd.setFieldsValue({
      bok_no: record?.bok_no,
      vol_no: record?.vol_no,
      quntityReq: record?.quantity,
      odate: record?.odate && dayjs(record?.odate).format("DD/MM/YYYY"),
      code: record?.code,
      customer_no: record?.customer_no,
      customer_name: record?.customer_name,
      gdsdate: dayjs(),
    });

    setRequirement(record);
    setIsModalOpenAdd(true);
  };

  const handleCloseModalAdd = () => {
    setIsModalOpenAdd(false);

    setRequirement(null);
    setSelectedList([]);

    setProductPage(1);
    setProductQuery("");
    setProductPageLimit(10);

    formAdd.resetFields();
  };

  // const handleSelect = (record) => {
  //   console.log(record);
  //   setIsModalOpenEdit(true);

  //   form.setFieldValue("bok_no", record?.bok_no);
  //   form.setFieldValue("vol_no", record?.vol_no);
  //   form.setFieldValue("cusname", record?.cusname);
  //   form.setFieldValue("gdspay", record?.gdspay);
  //   form.setFieldValue("gds_date", dayjs());
  // };

  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
    setIsEdit(false);
    setCurrentVolId(null);
    form.resetFields();
  };

  const handleSubmitEdit = (values) => {
    console.log(values);
  };

  const resetPageData = () => {
    setPage(1);
    setSubPage(1);
    setSubTotalItems(0);
    setCurrentBokVol(null);
    setBokVolList([]);
    setVolList([]);
  };

  const onChange = (date, dateString) => {
    setTimeQuery({ date, dateString });
    resetPageData();
  };

  const handleCreateInvoice = () => {
    if (selectedList.length <= 0) {
      return message.warning("กรุณาเลือกสินค้า ก่อนบันทึกเข้าระบบ");
    }

    let reqData = {
      mainData: {
        bokNo: requirement?.bok_no,
        volNo: requirement?.vol_no,
        gdsPay: formAdd.getFieldValue("gdspay"),
        gdsDate: formAdd.getFieldValue("gdsdate"),
        cusNo: requirement?.customer_no,
        oDate: requirement?.odate,
        trnCode: requirement?.trncode,
        orderNo: requirement?.ord_no,
        quantity: requirement?.quantity,
        ali: requirement?.ali,
        noCar: requirement?.nocar,
        uPrice: requirement?.u_price,
        saleNo: requirement?.saleno,
        discount: requirement?.discount,
        credit: requirement?.credit,
        code: requirement?.code,
      },
      productList: selectedList,
    };
    console.log("REQUIRED", requirement);
    console.log(reqData);

    SaleOrderService.createInvoice(reqData)
      .then(({ data }) => {
        message.success(`[${data?.status}] : ${data?.message}`);
        handleCloseModalAdd();
        fetchBokVol();
        fetchPreOrder();
        if (currentBokVol) fetchBokNo();
      })
      .catch((err) => {
        if (err?.response)
          message.error(
            `[${err?.response?.data?.status}] : ${err?.response?.data?.message}`
          );
      });
  };

  const printProcess = useReactToPrint({
    content: () => printRef.current,
  });

  const bokVolColumn = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "10%",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
    },
    {
      title: "เล่มที่ใบส่งของ (BOK VOL.)",
      dataIndex: "bok_no",
      key: "bok_no",
      render: (bok_no) => (
        <span style={{ color: "#29f", fontWeight: "bold" }}>{bok_no}</span>
      ),
    },
    {
      title: "จำนวน",
      dataIndex: "total_vol_no",
      key: "total_vol_no",
      align: "right",
      render: (total_vol_no) => total_vol_no?.toLocaleString(),
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

  const volNoColumn = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "10%",
      render: (text, record, idx) => (subPage - 1) * subPageLimit + (idx + 1),
    },
    {
      title: "เลขที่ใบส่งของ (VOL NO.)",
      dataIndex: "vol_no",
      key: "vol_no",
    },
    {
      title: "รหัสสินค้า",
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (code) => <Tag color="red">{code}</Tag>,
    },
    {
      title: "วันที่ออกใบส่งของ",
      key: "gdsDate",
      dataIndex: "gdsDate",
      align: "center",
      render: (gdsDate) => dayjs(gdsDate).format("DD/MM/YYYY"),
    },
    {
      title: "ใบกำกับภาษี",
      key: "taxInvoice",
      dataIndex: "taxInvoice",
      align: "center",
      render: (taxInvoice) => {
        let obj = taxInvoice
          ? { title: "ออกแล้ว", color: "green" }
          : { title: "ยังไม่ออก", color: "#da2a35" };
        return <Tag color={obj?.color}>{obj?.title}</Tag>;
      },
    },
  ];

  const orderColumn = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "10%",
      render: (text, record, idx) =>
        (orderPage - 1) * orderPageLimit + (idx + 1),
    },
    {
      title: "หมายเลขคำสั่งซื้อ",
      key: "ord_no",
      dataIndex: "ord_no",
      align: "center",
    },
    {
      title: "รหัสสินค้า",
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (code) =>
        code ? (
          <Tag color="red">{code}</Tag>
        ) : (
          <Tag color="purple">ไม่มีข้อมูล</Tag>
        ),
    },
    {
      title: "วันที่สั่งซื้อ",
      key: "odate",
      dataIndex: "odate",
      align: "center",
      render: (odate) => dayjs(odate).format("DD/MM/YYYY"),
    },
    {
      title: "เล่มที่ (BOK VOL.)",
      dataIndex: "bok_no",
      key: "bok_no",
      align: "center",
    },
    {
      title: "เลขที่ (VOL NO.)",
      dataIndex: "vol_no",
      key: "vol_no",
      align: "center",
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (quantity) => (+quantity).toLocaleString(),
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

  const editColumn = [
    {
      title: "CUSTOMER CODE",
      dataIndex: "cusno",
      key: "cusno",
    },
    {
      title: "P.O.No.",
      dataIndex: "order_no",
      key: "order_no",
    },
    {
      title: "CODE",
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (code) => <Tag color="red">{code}</Tag>,
    },
    {
      title: "QUANITY",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (quantity) => (+quantity).toLocaleString(),
    },
    {
      title: "ORDER DATE",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (date) => date && dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "TRANSPORT",
      dataIndex: "trn_name",
      key: "trn_name",
    },
  ];

  const productColumn = [
    {
      title: "CHARGE NO.",
      dataIndex: "charge",
      key: "charge",
    },
    {
      title: "COIL NO.",
      dataIndex: "coilno",
      key: "coilno",
    },
    {
      title: "TYPE",
      dataIndex: "group",
      key: "group",
      align: "center",
    },
    {
      title: "CODE",
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (code) => <Tag color="red">{code}</Tag>,
    },
    {
      title: "GRADE",
      dataIndex: "grade",
      key: "grade",
      align: "center",
    },
    {
      title: "DATE",
      dataIndex: "pdate",
      key: "pdate",
      align: "center",
      render: (pdate) => pdate && dayjs(pdate).format("DD/MM/YYYY"),
    },
    {
      title: "WEIGHT",
      dataIndex: "weight",
      key: "weight",
      align: "center",
    },
    {
      title: "ACTION",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Button
          type="primary"
          style={{
            background: !checkDupItem(record?.procode) ? "#da2a35" : "#d9d9d9",
          }}
          disabled={checkDupItem(record?.procode)}
          icon={<PlusOutlined />}
          onClick={() => handleAddProduct(record)}
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
          <h1 style={{ fontSize: "18px" }}>ใบส่งของ</h1>
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
              onClick={showModal}
            >
              เพิ่มใบส่งของ
            </Button>
          </Space>
        </div>

        <Row gutter={[32, 16]}>
          <Col span={12}>
            <Table
              dataSource={bokVolList}
              columns={bokVolColumn}
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
              dataSource={volList}
              columns={volNoColumn}
              size="small"
              bordered
              rowKey="id"
              style={{ marginTop: "1rem" }}
              pagination={false}
              loading={isLoading}
              onRow={(record) => ({
                onClick: () => {
                  setCurrentVolId(record?.id);
                  setIsEdit(true);
                },
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
        title="ใบอนุมัติที่ออกใบส่องของได้"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        maskClosable={false}
        destroyOnClose
      >
        <Table
          dataSource={orderList}
          columns={orderColumn}
          onRow={(record) => ({
            onClick: () => handleOpenAddModal(record),
          })}
          style={{ marginTop: "1rem" }}
          className="table-click-able"
          pagination={false}
          size="middle"
          bordered
        />

        <Pagination
          showSizeChanger
          total={orderTotalItems}
          showTotal={(total) => `จำนวนทั้งหมด ${total?.toLocaleString()}`}
          defaultPageSize={10}
          defaultCurrent={1}
          current={orderPage}
          style={{ marginTop: "20px", textAlign: "right" }}
          onChange={(newPage) => setOrderPage(newPage)}
          onShowSizeChange={(current, limit) => setOrderPageLimit(limit)}
        />
        {/* <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            style={{ height: "40px", marginTop: "10px" }}
            htmlType="submit"
            onClick={handleCancel}
          >
            ปิด
          </Button>
        </div> */}
      </Modal>

      <Modal
        title="เลือกลวดที่ต้องการตัดจ่าย"
        open={isModalOpenAdd}
        onCancel={handleCloseModalAdd}
        footer={null}
        width={800}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={formAdd}
          id="AddInvoice"
          name="basic"
          layout="vertical"
          initialValues={{ remember: true, f_invno: "1" }}
          autoComplete="off"
          onFinish={() => {}}
        >
          <Row gutter={[16, 16]}>
            <Col xs={6}>
              <Form.Item
                label="เล่มที่"
                name="bok_no"
                style={{ marginBottom: "0px" }}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={6}>
              <Form.Item
                label="เลขที่"
                name="vol_no"
                style={{ marginBottom: "0px" }}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={6}>
              <Form.Item
                label="น้ำหนักสั่งซื้อ (kg)"
                name="quntityReq"
                style={{ marginBottom: "0px" }}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={6}>
              <Form.Item
                label="วันที่สั่งซื้อ"
                name="odate"
                style={{ marginBottom: "0px" }}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={6}>
              <Form.Item
                label="รหัสสินค้า"
                name="code"
                style={{ marginBottom: "0px" }}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={6}>
              <Form.Item
                label="รหัสลูกค้า"
                name="customer_no"
                style={{ marginBottom: "0px" }}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={12}>
              <Form.Item
                label="ชื่อลูกค้า"
                name="customer_name"
                style={{ marginBottom: "0px" }}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={6}>
              <Form.Item
                label="ใบจ่ายเลขที่"
                name="gdspay"
                style={{ marginBottom: "0px" }}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={6}>
              <Form.Item
                label="วันที่จ่าย"
                name="gdsdate"
                style={{ marginBottom: "0px" }}
              >
                <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
              </Form.Item>
            </Col>

            <Col xs={6}>
              <Form.Item
                label="สถานะ"
                name="f_invno"
                style={{ marginBottom: "0px" }}
              >
                <Select
                  defaultValue="รอจ่ายใหม่"
                  options={[
                    {
                      value: "1",
                      label: "รอจ่ายใหม่",
                    },
                    {
                      value: "0",
                      label: "จ่ายแล้ว",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider style={{ marginTop: "24px", marginBottom: "0px" }} />

        <div style={{ display: "flex", justifyContent: "end" }}>
          <Space>
            <Input.Search
              placeholder="ค้นหารายการ"
              allowClear
              style={{ width: 250, marginTop: "20px", marginBottom: "10px" }}
              onSearch={(value) => {
                setProductQuery(value);
                setProductPage(1);
              }}
            />

            <Button
              type="primary"
              style={{
                marginLeft: "10px",
                height: "40px",
                backgroundColor: "#23a123",
              }}
              onClick={handleCreateInvoice}
            >
              บันทึกข้อมูล
            </Button>
          </Space>
        </div>

        <Table
          dataSource={productList}
          columns={productColumn}
          pagination={false}
          size="small"
          bordered
          rowKey="procode"
        />
        <Pagination
          showSizeChanger
          total={productTotalItems}
          showTotal={(total) => `จำนวนทั้งหมด ${total?.toLocaleString()}`}
          defaultPageSize={10}
          defaultCurrent={1}
          current={productPage}
          style={{ marginTop: "20px", textAlign: "right" }}
          onChange={(newPage) => setProductPage(newPage)}
          onShowSizeChange={(current, limit) => setProductPageLimit(limit)}
        />
      </Modal>

      {currentItem?.list?.length > 0 && (
        <ProductPreparing ref={printRef} printData={currentItem} />
      )}

      <Modal
        title="แก้ไขใบส่งของ"
        open={isModalOpenEdit}
        onCancel={handleCancelEdit}
        footer={[
          <Button
            type="primary"
            key="print"
            style={{
              marginRight: "5px",
              height: "40px",
            }}
            onClick={printProcess}
          >
            ปริ้นใบจัดเตรียม
          </Button>,
          <Button
            type="primary"
            htmlType="submit"
            form="editInvoice"
            key="submit"
            style={{
              marginRight: "10px",
              height: "40px",
              backgroundColor: "#23a123",
            }}
          >
            บันทึกข้อมูล
          </Button>,
        ]}
        width={1000}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={form}
          id="editInvoice"
          name="basic"
          layout="vertical"
          initialValues={{ remember: true, f_invno: "1" }}
          autoComplete="off"
          onFinish={handleSubmitEdit}
        >
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={8}>
                <Form.Item
                  label="เล่มที่"
                  name="bok_no"
                  style={{ marginBottom: "0px" }}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item
                  label="เลขที่"
                  name="vol_no"
                  style={{ marginBottom: "0px" }}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item
                  label="สถานะ"
                  name="f_invno"
                  style={{ marginBottom: "0px" }}
                >
                  <Select
                    defaultValue="ตัดจ่ายแล้ว"
                    options={[
                      {
                        value: "1",
                        label: "ตัดจ่ายแล้ว",
                      },
                      {
                        value: "0",
                        label: "ยังไม่ตัดจ่าย",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item
                  label="ชื่อลูกค้า"
                  name="cusname"
                  style={{ marginBottom: "0px" }}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={16}>
                <Form.Item
                  label="ที่อยู่"
                  name="address"
                  style={{ marginBottom: "0px" }}
                >
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={12}>
                <Form.Item
                  label="วันที่จ่าย"
                  name="gds_date"
                  style={{ marginBottom: "0px" }}
                >
                  <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  label="ใบจ่ายเลขที่"
                  name="gdspay"
                  style={{ marginBottom: "0px" }}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  label="สถานที่จัดส่ง"
                  name="shipping_address"
                  style={{ marginBottom: "0px" }}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  label="ค่าขนส่ง"
                  name="shipping_cost"
                  style={{ marginBottom: "0px" }}
                >
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} style={{ marginTop: "10px" }}>
                <Tabs
                  defaultActiveKey="1"
                  items={[
                    {
                      label: "คำสั่งซื้อ",
                      key: "1",
                      children: (
                        <Table
                          dataSource={currentItem?.invoice}
                          columns={editColumn}
                          pagination={false}
                          style={{ width: "1000px" }}
                          size="middle"
                          rowKey="id"
                        />
                      ),
                    },
                    {
                      label: "สินค้าที่ส่ง",
                      key: "2",
                      children: (
                        <Table
                          className="report-table"
                          dataSource={currentItem?.list}
                          columns={COLUMN.PRODUCT_PREPARING_LIST}
                          pagination={false}
                          style={{ width: "1000px" }}
                          size="middle"
                          rowKey="procode"
                        />
                      ),
                    },
                  ]}
                />
              </Col>
            </Row>
          </Card>
        </Form>
      </Modal>
    </>
  );
};

export default UIInvoice;
