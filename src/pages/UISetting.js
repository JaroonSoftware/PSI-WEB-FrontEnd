import React, { useState } from "react";
import { Tabs } from "antd";
import UICustomer from "./setting/UICustomer";
import UISeller from "./setting/UISeller";
import UITransport from "./setting/UITransport";
import UIVendor from "./setting/UIVendor";
import UIProductType from "./setting/UIProductType";

const UISetting = () => {
  const [activeKey, setActiveKey] = useState("1");

  const onChange = (key) => {
    setActiveKey(key);
  };

  const items = [
    {
      key: "1",
      label: "Product Type",
      children: <UIProductType activeKey={activeKey} />,
    },
    {
      key: "2",
      label: "Customer",
      children: <UICustomer activeKey={activeKey} />,
    },
    {
      key: "3",
      label: "Seller",
      children: <UISeller activeKey={activeKey} />,
    },
    {
      key: "4",
      label: "Vendor",
      children: <UIVendor activeKey={activeKey} />,
    },
    {
      key: "5",
      label: "Transport",
      children: <UITransport activeKey={activeKey} />,
    },
  ];

  return (
    <>
      <h1 style={{ margin: "0", fontSize: "18px" }}>ตั้งค่าระบบ</h1>
      <Tabs
        style={{ marginTop: "20px" }}
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />
    </>
  );
};

export default UISetting;
