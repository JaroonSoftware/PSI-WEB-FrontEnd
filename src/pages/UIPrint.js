import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Pagination,
  Space,
  Col,
  Row,
  InputNumber,
  message,
} from "antd";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import {
  ClearOutlined,
  PrinterFilled,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import WireRodService from "services/WireRodService";
import ModalSelectCharge from "../component/Modal/ModalSelectCharge";
import WirerodQRCard from "../component/Card/WirerodQRCard";
import $ from "jquery";

const UIPrint = () => {
  const [chargeData, setChargeData] = useState("");
  const [coilData, setCoilData] = useState("");
  const [chargeList, setChargeList] = useState([]);
  const [coilList, setCoilList] = useState([]);
  const [printData, setPrintData] = useState([]);

  // MODAL
  const [isShowModal, setIsModalVisible] = useState(false);
  const [isModalChargeVisible, setIsModalChargeVisible] = useState(false);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [query, setQuery] = useState("");

  const [pageCharge, setChargePage] = useState(1);
  const [pageChargeLimit, setPageChargeLimit] = useState(10);
  const [totalChargeItems, setTotalChargeItems] = useState(0);

  const printRef = useRef();

  useEffect(() => {
    if (isModalChargeVisible) fetchCharge();
  }, [isModalChargeVisible, pageCharge, pageChargeLimit, query]);

  useEffect(() => {
    if (chargeData) fetchCoil();
  }, [chargeData]);

  const fetchCharge = () => {
    let pageConf = {
      page: pageCharge,
      pageLimit: pageChargeLimit,
      query,
    };

    WireRodService.getAllCharge(pageConf)
      .then(({ data }) => {
        setChargeList(data?.items);
        setTotalChargeItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCoil = () => {
    WireRodService.getCoil({
      page,
      pageLimit: chargeData?.tot_coil,
      chargeNo: chargeData?.charge_no,
      lcNo: chargeData?.lc_no,
    })
      .then(({ data }) => {
        setCoilList(data?.items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPaginatedData = () => {
    const startIndex = (page - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;
    return printData.slice(startIndex, endIndex);
  };

  const printDataWithPagination = getPaginatedData();

  const handleSearch = (keyWord) => {
    setQuery(keyWord);
    setChargePage(1);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleOpenChargeModal = () => {
    setIsModalChargeVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalChargeVisible(false);
    setIsModalVisible(false);
  };

  const handleSelectCharge = (record) => {
    // console.log("Charge DATA ==>", record);
    setChargeData(record);
    handleCloseModal();
  };

  const handleSelectCoil = (record) => {
    // console.log("Coil DATA ==>", record);
    setCoilData(record);
    setPrintData((prevPrintData) => [
      ...prevPrintData,
      {
        wr_code: record?.wr_code,
        size: record?.size,
        lc_no: record?.lc_no,
        coil_no: record?.coil_no,
        weight: record?.weight,
        grade: record?.grade,
        tot_acc: coilData?.tot_acc,
        charge_no: chargeData?.charge_no,
      },
    ]);
    handleCloseModal();
  };

  const handleDeletePrintData = (index) => {
    const updatedPrintData = [...printData];
    updatedPrintData.splice(index, 1);
    setPrintData(updatedPrintData);
  };

  const handleClearPrintData = () => {
    setPrintData([]);
  };

  const checkDupItem = (wrCode) => {
    let isDup = false;
    printData.forEach((item) => {
      if (item?.wr_code === wrCode) isDup = true;
    });
    return isDup;
  };

  const checkHaveAll = () => {
    let temp = [];
    coilList.forEach((i) => {
      if (checkDupItem(i.wr_code)) temp.push(i);
    });

    return temp.length === coilList.length;
  };

  const handleSelectAllCoil = () => {
    let nextData = [...printData];
    coilList.forEach((c) => {
      const i = printData.findIndex((p) => p.wr_code === c.wr_code);

      if (i < 0) {
        nextData.push({
          wr_code: c?.wr_code,
          size: c?.size,
          lc_no: c?.lc_no,
          coil_no: c?.coil_no,
          weight: c?.weight,
          grade: c?.grade,
          tot_acc: coilData?.tot_acc,
          charge_no: chargeData?.charge_no,
        });
      }
    });
    // console.log(nextData);
    setPrintData(nextData);
  };

  const focusNextInput = () => {
    const activeElement = document.activeElement;
    const inputList = $(".editable").toArray();
    let fieldRefs = inputList.map((item) => {
      let dom = $(item);
      if (dom.prop("tagName") === "DIV") {
        return dom.find("input")[0];
      }
      return item;
    });

    const currentIndex = fieldRefs.indexOf(activeElement);
    // console.log("currentIndex ==> ", currentIndex);

    if (currentIndex !== -1 && currentIndex < fieldRefs.length - 1) {
      const nextField = fieldRefs[currentIndex + 1];
      return nextField;
    } else if (currentIndex === fieldRefs.length - 1) {
      return 0;
    }
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

  const printProcess = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrint = () => {
    WireRodService.printAddTagsDate(printData)
      .then(() => {
        message.success("Process on going!");
        printProcess();
      })
      .catch(() => message.error("Something went wrong !"));
  };

  const columnsScan = [
    {
      title: "COIL NO.",
      dataIndex: "coil_no",
      key: "coil_no",
      align: "center",
    },
    {
      title: "GRADE",
      dataIndex: "grade",
      key: "grade",
      align: "center",
    },
    {
      title: "SIZE",
      dataIndex: "size",
      key: "size",
      align: "center",
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
            background: !checkDupItem(record?.wr_code) ? "#da2a35" : "#d9d9d9",
          }}
          disabled={checkDupItem(record?.wr_code)}
          icon={<PlusOutlined />}
          onClick={() => handleSelectCoil(record)}
        />
      ),
    },
  ];

  const columnsPrint = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (text, record, idx) => (page - 1) * 10 + (idx + 1),
    },
    {
      title: "CHARGE NO.",
      dataIndex: "charge_no",
      key: "charge_no",
    },
    {
      title: "COIL NO.",
      dataIndex: "coil_no",
      key: "coil_no",
    },

    {
      title: "LC NO.",
      dataIndex: "lc_no",
      key: "lc_no",
    },

    {
      title: "GRADE",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "SIZE",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "SUPPLIER COIL NO.",
      dataIndex: "sup_coil_no",
      key: "sup_coil_no",
      align: "center",
      width: "15%",
      render: (sup_coil_no, record) => (
        <Input
          className="editable"
          onKeyDown={handleKeyPress}
          style={{ textAlign: "right", width: "100%" }}
          value={sup_coil_no}
          onChange={({ target: { value } }) => {
            let nextList = [...printData];
            let idx = printData.findIndex(
              (item) => item?.wr_code === record?.wr_code
            );
            nextList[idx]["sup_coil_no"] = value;
            setPrintData(nextList);
          }}
        />
      ),
    },
    {
      title: "WEIGHT",
      dataIndex: "cWeight",
      key: "cWeight",
      align: "center",
      width: "15%",
      render: (cWeight, record) => (
        <InputNumber
          className="editable"
          onKeyDown={handleKeyPress}
          placeholder={`Max : ${chargeData?.tot_wig}`}
          min={0}
          max={chargeData?.tot_wig}
          type="number"
          style={{ textAlign: "right", width: "100%" }}
          value={cWeight}
          onChange={(value) => {
            let nextList = [...printData];
            let idx = printData.findIndex(
              (item) => item?.wr_code === record?.wr_code
            );
            nextList[idx]["cWeight"] = value;
            setPrintData(nextList);
          }}
        />
      ),
    },
    // {
    //   title: "LC WEIGHT (Kgs)",
    //   dataIndex: "tot_acc",
    //   key: "tot_acc",
    // },
    {
      title: "ACTION",
      key: "action",
      align: "center",
      render: (text, record, idx) => (
        <Button
          type="primary"
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDeletePrintData(idx)}
        />
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ margin: "0", fontSize: "18px" }}>พิมพ์ใบรายการ</h1>
      </div>
      <Row
        style={{
          background: "white",
          borderRadius: "10px",
          minHeight: "650px",
        }}
      >
        <Col xxl={8}>
          <Card
            title={null}
            bordered={false}
            style={{ background: "transparent", boxShadow: "none" }}
            className="align-self-center card-less-padding"
          >
            <Row gutter={[8, 4]}>
              <Col xs={12}>
                <Row>
                  <Col xs={10}>Charge No.</Col>
                  <Col xs={14}>
                    <Input disabled={true} value={chargeData?.charge_no} />
                  </Col>
                </Row>
              </Col>
              <Col xs={12}>
                <Button
                  // className="button-primary"
                  type="primary"
                  style={{ width: "80px", background: "#da2a35" }}
                  onClick={handleOpenChargeModal}
                >
                  เลือก
                </Button>
              </Col>

              <Col xs={12}>
                <Row>
                  <Col xs={10}>LC No.</Col>
                  <Col xs={14}>
                    <Input disabled={true} value={chargeData?.lc_no} />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} />

              <Col xs={12}>
                <Row>
                  <Col xs={10}>Total Coil</Col>
                  <Col xs={14}>
                    <Input disabled={true} value={chargeData?.tot_coil} />
                  </Col>
                </Row>
              </Col>
              <Col xs={12}>
                {chargeData && (
                  <Button
                    // className="button-primary"
                    type="primary"
                    onClick={handleSelectAllCoil}
                    style={{
                      background: checkHaveAll() ? "#d9d9d9" : "#da2a35",
                    }}
                    disabled={checkHaveAll()}
                  >
                    เลือกทั้งหมด
                  </Button>
                )}
              </Col>

              <Col xs={12}>
                <Row>
                  <Col xs={10}>Total Weight</Col>
                  <Col xs={14}>
                    <Input disabled={true} value={chargeData?.tot_wig} />
                  </Col>
                </Row>
              </Col>

              <Col xs={12}>
                <Row>
                  <Col xs={10}>Avg. Weight</Col>
                  <Col xs={14}>
                    <Input disabled={true} value={chargeData?.tot_avg} />
                  </Col>
                </Row>
              </Col>

              <Col xs={12}>
                <Row>
                  <Col xs={10}>Grade</Col>
                  <Col xs={14}>
                    <Input disabled={true} value={chargeData?.grade} />
                  </Col>
                </Row>
              </Col>

              <Col xs={12}>
                <Row>
                  <Col xs={10}>Size</Col>
                  <Col xs={14}>
                    <Input disabled={true} value={chargeData?.size} />
                  </Col>
                </Row>
              </Col>

              <Col xs={12}>
                <Row>
                  <Col xs={10}>Vendor</Col>
                  <Col xs={14}>
                    <Input disabled={true} value={chargeData?.vendor} />
                  </Col>
                </Row>
              </Col>
              <Col xs={12}>
                <Row>
                  <Col xs={24}>
                    <Input disabled={true} value={chargeData?.ven_name} />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row gutter={[16, 8]} style={{ marginTop: "1rem" }}>
              <Col xs={24}>
                <Table
                  dataSource={coilList}
                  columns={columnsScan}
                  scroll={{ y: 400 }}
                  pagination={false}
                  size="small"
                  rowKey="wr_code"
                />
              </Col>
              {/* <Col xs={24}>
                <Input placeholder="แสกนบาร์โค้ดที่นี่.." />
              </Col> */}
            </Row>
          </Card>
        </Col>
        <Col xxl={16}>
          <Card
            title="รายการวัตถุดิบ ที่กำลังเตรียม"
            bordered={false}
            style={{
              background: "transparent",
              boxShadow: "none",
              borderLeft: "1px solid #f0f0f0",
              borderRadius: "0px",
            }}
          >
            <Table
              dataSource={printDataWithPagination}
              columns={columnsPrint}
              scroll={{ x: 900 }}
              style={{ marginTop: "10px", minHeight: "550px" }}
              pagination={false}
              size="small"
              rowKey="wr_code"
            />
            <Row style={{ marginTop: "10px" }}>
              <Col xl={12}>
                <Space>
                  <Button
                    icon={<ClearOutlined />}
                    size="large"
                    className="button-danger"
                    style={{ width: "95px" }}
                    onClick={handleClearPrintData}
                  >
                    เคลียร์
                  </Button>
                  <Button
                    icon={<SearchOutlined />}
                    size="large"
                    className="button-sec"
                    onClick={handleOpenModal}
                    disabled={printData?.length == 0}
                  >
                    Preview
                  </Button>
                </Space>
              </Col>

              <Col xl={12}>
                <Pagination
                  className="mt-0"
                  showSizeChanger
                  total={printData?.length}
                  showTotal={(total) =>
                    `จำนวนทั้งหมด ${total?.toLocaleString()}`
                  }
                  defaultCurrent={1}
                  defaultPageSize={10}
                  current={page}
                  style={{ textAlign: "right" }}
                  onChange={(newPage) => setPage(newPage)}
                  onShowSizeChange={(current, limit) => setPageLimit(limit)}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <ModalSelectCharge
        isOpen={isModalChargeVisible}
        onClose={handleCloseModal}
        chargeList={chargeList}
        handleSearch={handleSearch}
        handleSelectCharge={handleSelectCharge}
        page={pageCharge}
        pageLimit={pageChargeLimit}
        setPage={setChargePage}
        setPageLimit={setPageChargeLimit}
        totalItems={totalChargeItems}
      />

      <Modal
        title="Preview"
        width={700}
        open={isShowModal}
        onCancel={handleCloseModal}
        footer={
          <Button
            icon={<PrinterFilled />}
            size="large"
            className="button-primary"
            onClick={handlePrint}
          >
            พิมพ์
          </Button>
        }
      >
        <WirerodQRCard ref={printRef} printData={printData} />
      </Modal>
    </>
  );
};

export default UIPrint;
