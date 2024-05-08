import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Input } from "antd";
import { COLUMN } from "context/column";
import SettingService from "services/SettingService";
import dayjs from "dayjs";
import {
  SELECTOR_CUSTOMER,
  SELECTOR_SELLER,
  SELECTOR_TRANSPORT,
} from "context/constant";

const ModalDataSelector = ({
  isOpen,
  onClose,
  isLoading,
  currentRender,
  onSelect,
}) => {
  const [dataList, setDataList] = useState([]);
  const [dataDisplay, setDataDisplay] = useState([]);
  const [context, setContext] = useState({
    title: "",
    placeholder: "",
    key: "",
    column: [],
  });

  useEffect(() => {
    if (currentRender) {
      switch (currentRender) {
        case SELECTOR_CUSTOMER:
          return fetchAllCustomer();
        case SELECTOR_TRANSPORT:
          return fetchAllTransport();
        case SELECTOR_SELLER:
          return fetchAllSeller();
      }
    }
  }, []);

  const fetchAllCustomer = () => {
    setContext({
      title: "รายการ Customer",
      placeholder: "ค้นหา รหัสลูกค้า",
      key: "cusno",
      column: COLUMN.CUSTOMER,
    });
    SettingService.getAllCustomer({ query: "", getAll: true })
      .then(({ data }) => {
        setDataList(data?.items);
        setDataDisplay(data?.items);
      })
      .catch((err) => console.log(err));
  };

  const fetchAllTransport = () => {
    setContext({
      title: "รายการ Transport",
      placeholder: "ค้นหา ชื่อบริษัทขนส่ง",
      key: "trncode",
      column: COLUMN.TRANSPORT,
    });

    SettingService.getAllTransport({ query: "", getAll: true })
      .then(({ data }) => {
        setDataList(data?.items);
        setDataDisplay(data?.items);
      })
      .catch((err) => console.log(err));
  };

  const fetchAllSeller = () => {
    setContext({
      title: "รายการ Seller",
      placeholder: "ค้นหา รหัสพนักงานขาย",
      key: "saleno",
      column: COLUMN.SELLER,
    });

    SettingService.getAllSeller({ query: "", getAll: true })
      .then(({ data }) => {
        setDataList(data?.items);
        setDataDisplay(data?.items);
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setDataList([]);
    onClose();
  };

  const handleSearch = ({ target: { value } }) => {
    let temp = [...dataList];
    if (currentRender === SELECTOR_CUSTOMER) {
      temp = temp.filter((item) =>
        item?.cusno?.toLowerCase().includes(value.toLowerCase())
      );
    } else if (currentRender === SELECTOR_TRANSPORT) {
      temp = temp.filter((item) =>
        item?.name?.toLowerCase().includes(value.toLowerCase())
      );
    } else if (currentRender === SELECTOR_SELLER) {
      temp = temp.filter((item) =>
        item?.saleno?.toLowerCase().includes(value.toLowerCase())
      );
    }

    setDataDisplay(temp);
  };

  const columnsCharge = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (text, record, idx) => idx + 1,
    },
    ...context.column,
    {
      title: "ACTION",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => onSelect(record)}
          style={{ background: "#da2a35" }}
        >
          เลือก
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={context.title}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={800}
    >
      <div style={{ textAlign: "right" }}>
        <Input.Search
          placeholder={context.placeholder}
          allowClear
          onChange={handleSearch}
          style={{ width: "231px", marginBottom: "10px" }}
        />
      </div>
      <Table
        dataSource={dataDisplay}
        columns={columnsCharge}
        style={{ marginTop: "10px" }}
        loading={isLoading}
        bordered
        className="table-less-padding"
        rowKey={context.key}
      />
    </Modal>
  );
};

export default ModalDataSelector;
