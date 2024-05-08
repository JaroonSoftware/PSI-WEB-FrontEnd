import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Layout, Button } from "antd";
import React, { useState, useEffect } from "react";
const { Header } = Layout;

const NavHeader = ({ collapsed, setCollapsed }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setCollapsed(screenWidth < 500);
  }, [screenWidth, setCollapsed]);

  return (
    <Header className="nav-header">
      <Button
        type="text"
        icon={
          collapsed ? (
            <MenuUnfoldOutlined style={{ color: "#3a3f4e" }} />
          ) : (
            <MenuFoldOutlined style={{ color: "#3a3f4e" }} />
          )
        }
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />

      {process.env.NODE_ENV === "development" && (
        <span
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
            color: "#da2a35",
          }}
        >
          {process.env.NODE_ENV}
        </span>
      )}
    </Header>
  );
};

export default NavHeader;
