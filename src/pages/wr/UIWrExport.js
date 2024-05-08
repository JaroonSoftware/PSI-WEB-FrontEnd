import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Input,
  Pagination,
  Row,
  Col,
  Space,
  DatePicker,
  Form,
  message,
} from "antd";
import { DeleteOutlined, PlusOutlined, PrinterFilled } from "@ant-design/icons";
import { delay } from "utils/utils";
import ModalWrReport from "component/Modal/ModalWrReport";

// SERVICE
import WireRodService from "services/WireRodService";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { COLUMN } from "context/column";
import PrintExportReport from "component/report/WRExportReport";
import { useReactToPrint } from "react-to-print";
import { REPORT_TYPE } from "context/constant";

const UIWrExport = () => {
  const [widVolList, setWidVolList] = useState([]);
  const [widNoList, setWidNoList] = useState([]);
  const [coilList, setCoilList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [currentWidVol, setCurrentWidVol] = useState(null);
  const [currentWidNo, setCurrentWidNo] = useState(null);
  const [printData, setPrintData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // === MODAL === //
  const [isOpenExportModal, setIsOpenExportModal] = useState(false);
  const [isOpenModalReport, setIsOpenModalReport] = useState(false);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // === PAGE CONFIG === //
  const [subPage, setSubPage] = useState(1);
  const [subPageLimit, setSubPageLimit] = useState(10);
  const [subTotalItems, setSubTotalItems] = useState(0);

  // === PAGE COIL CONFIG === //
  const [coilPage, setCoilPage] = useState(1);
  const [coilPageLimit, setCoilPageLimit] = useState(10);
  const [coilTotalItems, setCoilTotalItems] = useState(0);
  const [query, setQuery] = useState("");
  const [chargeQuery, setChargeQuery] = useState("");

  const [form] = Form.useForm();
  const printRef = useRef();

  useEffect(() => {
    fetchWidVol();
  }, [page, pageLimit, chargeQuery]);

  useEffect(() => {
    if (currentWidVol) {
      setIsLoading(true);
      fetchWidNo();
    }
  }, [currentWidVol, subPage, subPageLimit, chargeQuery]);

  useEffect(() => {
    if (isOpenExportModal) fetchCoil();
  }, [isOpenExportModal, coilPage, coilPageLimit, query]);

  useEffect(() => {
    if (currentWidNo) fetchExportData();
  }, [currentWidNo]);

  const fetchWidVol = () => {
    let pageConf = { page, pageLimit, chargeQuery };

    WireRodService.getWidVol(pageConf)
      .then(({ data }) => {
        setWidVolList(data?.items);
        setTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchWidNo = async () => {
    let pageConf = {
      widVol: currentWidVol,
      page: subPage,
      pageLimit: subPageLimit,
      chargeQuery,
    };

    await delay(300);
    WireRodService.getWidNo(pageConf)
      .then(({ data }) => {
        setWidNoList(data?.items);
        setSubTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const fetchCoil = () => {
    let pageConf = {
      page: coilPage,
      pageLimit: coilPageLimit,
      query,
      chargeQuery,
    };

    WireRodService.getCoilAvailable(pageConf)
      .then(({ data }) => {
        setCoilList(data?.items);
        setCoilTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchExportData = () => {
    let reqData = { widVol: currentWidVol, widNo: currentWidNo };
    WireRodService.getWrExportDetail(reqData)
      .then(({ data }) => {
        setSelectedList(data?.items);
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = (keyWord) => {
    setQuery(keyWord);
    setCoilPage(1);
  };

  const handleDelete = (wrCode) => {
    const newData = selectedList.filter((item) => item?.wr_code !== wrCode);
    setSelectedList(newData);
  };

  const checkDupItem = (wrCode) => {
    let isDup = false;
    selectedList.map((item) => {
      if (item?.wr_code === wrCode) isDup = true;
      return item;
    });
    return isDup;
  };

  const resetFields = () => {
    form.resetFields();
  };

  const resetData = () => {
    setCoilList([]);
    setSelectedList([]);
    setCurrentWidNo("");
    setQuery("");
    setCoilPage(1);
    setCoilTotalItems(0);
  };

  const handleOpenExportModal = () => {
    setIsOpenExportModal(true);
    let current = dayjs();
    form.setFieldValue("export_date", current);
    form.setFieldValue(
      "wid_vol",
      "0" + (current.year() + 543).toString().substring(2)
    );
  };

  const handleCloseModal = () => {
    resetData();
    resetFields();
    setIsOpenExportModal(false);
  };

  const handleExportWr = (values) => {
    // ==== CALL API TO CREATE SR HERE ==== //
    // console.log("selectedList ==> ", selectedList);

    if (selectedList.length <= 0) {
      return message.warning("กรุณาเลือกข้อมูล ก่อนทำการบันทึกเข้าระบบ");
    }

    let reqData = {
      widVol: values?.wid_vol,
      widNo: values?.wid_no,
      exportDate: values?.export_date,
      itemList: selectedList,
    };

    WireRodService.exportWireRod(reqData)
      .then(({ data }) => {
        handleCloseModal();
        fetchWidVol();
        if (currentWidVol) fetchWidNo();
        message.success(`${data?.status} : ${data?.message}`);
      })
      .catch((err) => message.error("ERROR : " + err?.response?.data?.message));
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
        resetFields();
        setSelectedList([]);
        form.setFieldValue("export_date", dayjs());
        message.success("SUCCESS : รีเซ็ตข้อมูลทั้งหมดเรียบร้อยแล้ว");
      }
    });
  };

  const handleViewExportData = (record) => {
    setCurrentWidNo(record?.wid_no);
    setIsOpenExportModal(true);
    form.setFieldValue("export_date", dayjs(record?.iss_dte));
    form.setFieldValue("wid_vol", currentWidVol);
    form.setFieldValue("wid_no", record?.wid_no);
  };

  const handleChangeWidVol = (widVol) => {
    setSubPage(1);
    setSubTotalItems(0);
    setCurrentWidVol(widVol);
  };

  const printProcess = useReactToPrint({
    content: () => printRef.current,
  });

  const getReportData = async (reportData) => {
    setPrintData(reportData);
    await delay(200);
    printProcess();
  };

  const handleCloseModalReport = () => {
    setPrintData({});
    setIsOpenModalReport(false);
  };

  const exportCoilColumn = [
    ...COLUMN.EXPORT_COIL_AVAILABLE,
    {
      title: "ADD",
      key: "select",
      align: "center",
      render: (record) => (
        <Button
          type="primary"
          style={{
            background: !checkDupItem(record?.wr_code) ? "#da2a35" : "#d9d9d9",
          }}
          icon={<PlusOutlined />}
          disabled={checkDupItem(record?.wr_code)}
          onClick={() => {
            setSelectedList([...selectedList, record]);
          }}
        />
      ),
    },
  ];

  const selectedCoilColumn = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "5%",
      render: (text, record, idx) => idx + 1,
    },
    ...COLUMN.EXPORT_COIL_AVAILABLE,
    {
      title: "REMOVE",
      align: "center",
      key: "operation",
      dataIndex: "operation",
      render: (_, record) => (
        <Button
          disabled={currentWidNo}
          className="bt-icon"
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record?.wr_code)}
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
          <h1 style={{ margin: "0", fontSize: "18px" }}>รายการเบิก</h1>

          <Space>
            <Input.Search
              placeholder="ค้นหา Charge"
              allowClear
              onSearch={(value) => setChargeQuery(value)}
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
              onClick={handleOpenExportModal}
            >
              เพิ่มรายการเบิก
            </Button>
          </Space>
        </div>

        <Row gutter={[32, 16]}>
          <Col span={12}>
            <Table
              dataSource={widVolList}
              columns={COLUMN.WITHDRAW_VOL(
                page,
                pageLimit,
                currentWidVol,
                handleChangeWidVol
              )}
              pagination={false}
              size="small"
              bordered
              rowKey="wid_vol"
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
              dataSource={widNoList}
              columns={COLUMN.WITHDRAW_NO(subPage, subPageLimit)}
              pagination={false}
              size="small"
              bordered
              rowKey="wid_vol"
              style={{ marginTop: "1rem" }}
              loading={isLoading}
              className="table-click-able"
              onRow={(record) => ({
                onClick: () => handleViewExportData(record),
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

      {/* ======= EXPORT MODAL ======= */}
      <Modal
        title="รายการเบิกสินค้า WIREROD"
        open={isOpenExportModal}
        onCancel={handleCloseModal}
        width={1200}
        maskClosable={false}
        destroyOnClose
        footer={null}
      >
        {!currentWidNo && (
          <Card className="card-dashboard" style={{ marginTop: "10px" }}>
            <div style={{ textAlign: "right" }}>
              <Input.Search
                placeholder="ค้นหา Charge No."
                allowClear
                onSearch={handleSearch}
                style={{ width: "231px", marginBottom: "10px" }}
              />
            </div>

            <Table
              dataSource={coilList}
              columns={exportCoilColumn}
              pagination={false}
              rowKey="wr_code"
              size="small"
              bordered
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
          </Card>
        )}

        <Form
          form={form}
          id="exportWireRod"
          name="exportWrForm"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={handleExportWr}
          autoComplete="off"
        >
          <Row
            style={{ marginBottom: "1rem", marginTop: "1rem" }}
            gutter={[16, 16]}
          >
            <Col span={6}>
              <Form.Item
                label="วันที่เบิก"
                name="export_date"
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
                  disabled={currentWidNo}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="เล่มที่ใบเบิก"
                name="wid_vol"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
                style={{ marginBottom: "0px" }}
              >
                <Input disabled={currentWidNo} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="เลขที่ใบเบิก"
                name="wid_no"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
                style={{ marginBottom: "0px" }}
              >
                <Input disabled={currentWidNo} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Table
                dataSource={selectedList}
                columns={selectedCoilColumn}
                pagination={false}
                rowKey="wr_code"
                size="small"
                bordered
              />
            </Col>

            {!currentWidNo && (
              <Col xs={24} style={{ textAlign: "right" }}>
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
                    style={{
                      marginRight: "10px",
                      height: "40px",
                      backgroundColor: "#23a123",
                    }}
                    htmlType="submit"
                  >
                    บันทึก (F10)
                  </Button>
                </Space>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>

      {printData?.reportType === REPORT_TYPE.BY_DATE && (
        <PrintExportReport ref={printRef} printData={printData} />
      )}

      <ModalWrReport
        isOpen={isOpenModalReport}
        onClose={handleCloseModalReport}
        getReportData={getReportData}
        from="EXPORT"
      />
    </>
  );
};

export default UIWrExport;
