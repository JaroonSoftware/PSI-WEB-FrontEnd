import React from "react";
import { Modal, Table, Button, Pagination, Input } from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";

const ModalSelectCharge = ({
  isOpen,
  onClose,
  chargeList,
  isLoading,
  page,
  pageLimit,
  setPage,
  setPageLimit,
  totalItems,
  handleSelectCharge,
  handleSearch,
}) => {
  const columnsCharge = [
    {
      title: "ลำดับ",
      key: "index",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
      align: "center",
      width: "10%",
    },
    {
      title: "CHARGE NO.",
      key: "charge_no",
      dataIndex: "charge_no",
    },
    {
      title: "LC NO.",
      key: "lc_no",
      dataIndex: "lc_no",
    },
    {
      title: "RECIEVE DATE",
      key: "rcv_date",
      dataIndex: "rcv_date",
      align: "center",
      render: (rcv_date) => dayjs(rcv_date).format("DD/MM/YYYY"),
    },
    {
      title: "TOTAL COIL",
      key: "tot_coil",
      dataIndex: "tot_coil",
      align: "right",
    },
    {
      title: "ACTION",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => handleSelectCharge(record)}
          style={{
            background: "#da2a35",
          }}
        >
          เลือก
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="รายการ Charge"
      open={isOpen}
      onCancel={onClose}
      footer={
        <Button type="primary" onClick={onClose}>
          ปิด
        </Button>
      }
      width={800}
      maskClosable={false}
      destroyOnClose
    >
      <div style={{ textAlign: "right" }}>
        <Input.Search
          placeholder="ค้นหา Charge No."
          allowClear
          onSearch={handleSearch}
          style={{ width: "231px", marginBottom: "10px" }}
        />
      </div>
      <Table
        dataSource={chargeList}
        columns={columnsCharge}
        style={{ marginTop: "10px" }}
        pagination={false}
        size="small"
        bordered
        rowKey={(r) => `${r?.lc_no}-${r.charge_no}`}
      />
      <Pagination
        showSizeChanger
        total={totalItems}
        showTotal={(total) => `จำนวนทั้งหมด ${total?.toLocaleString()}`}
        defaultCurrent={1}
        defaultPageSize={10}
        current={page}
        pageSize={pageLimit}
        style={{ marginTop: "20px", textAlign: "right" }}
        onChange={(newPage) => setPage(newPage)}
        onShowSizeChange={(current, limit) => setPageLimit(limit)}
      />
    </Modal>
  );
};

export default ModalSelectCharge;
