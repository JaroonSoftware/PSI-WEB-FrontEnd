import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  KeyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Button, Popconfirm, Space, Tag } from "antd";
import { useAuth } from "../../context/auth/AuthContext";
import ChangePasswordModal from "../auth/ChangePasswordModal";
import React, { useState, useEffect } from "react";
const { Header } = Layout;

const NavHeader = ({ collapsed, setCollapsed }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { user, logout } = useAuth();
  const [openChangePwd, setOpenChangePwd] = useState(false);

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

      <Space size={12} style={{ marginRight: 16 }}>
        {process.env.NODE_ENV === "development" && (
          <span
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              color: "#0ea2d2",
            }}
          >
            {process.env.NODE_ENV}
          </span>
        )}

        {user && (
          <>
            <Tag
              icon={<UserOutlined />}
              color="blue"
              style={{ fontWeight: 600, marginInlineEnd: 0 }}
            >
              {user?.fullname || user?.username}
            </Tag>
            <Button
              size="small"
              icon={<KeyOutlined />}
              onClick={() => setOpenChangePwd(true)}
            >
              เปลี่ยนรหัสผ่าน
            </Button>

            <Popconfirm
              title="ออกจากระบบ"
              description="ต้องการออกจากระบบใช่หรือไม่?"
              okText="ออกจากระบบ"
              cancelText="ยกเลิก"
              onConfirm={logout}
            >
              <Button danger size="small" icon={<LogoutOutlined />}>
                ออกจากระบบ
              </Button>
            </Popconfirm>
          </>
        )}
      </Space>

      <ChangePasswordModal
        open={openChangePwd}
        onClose={() => setOpenChangePwd(false)}
      />
    </Header>
  );
};

export default NavHeader;
