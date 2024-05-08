import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import NavHeader from "./NavHeader";

const { Footer, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <NavHeader setCollapsed={setCollapsed} collapsed={collapsed} />
        <Content className="container">
          <Outlet />
        </Content>
        <Footer className="footer">
          PSI ©2024 Created by{" "}
          <a
            href="https://www.facebook.com/jaroonsoft/"
            target="_blank"
            style={{ color: "#da2a35" }}
          >
            Jaroon Software Co., Ltd.
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
