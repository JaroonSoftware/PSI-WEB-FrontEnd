import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import NavHeader from "./NavHeader";
import ForceChangePassword from "../auth/ForceChangePassword";

const { Footer, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <ForceChangePassword />
      <Sidebar collapsed={collapsed} />
      <Layout>
        <NavHeader setCollapsed={setCollapsed} collapsed={collapsed} />
        <Content className="container">
          <Outlet />
        </Content>
        <Footer className="footer">
          PSI ©2024-{(new Date().getFullYear())} Created by{" "}
          <a
            href="https://www.facebook.com/jaroonsoft/"
            target="_blank"
            style={{ color: "#0ea2d2" }}
          >
            Jaroon Software Co., Ltd.
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
