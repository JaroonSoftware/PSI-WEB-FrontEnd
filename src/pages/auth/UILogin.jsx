import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { LockOutlined, UserOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "context/auth/AuthContext";
import logo from "assets/image/logopsi.jpg";
import "./login.css";

const { Title, Text } = Typography;

const UILogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, checking, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/webpsi/factory-report";

  useEffect(() => {
    if (!checking && user) navigate(from, { replace: true });
  }, [checking, user, from, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await login(values);
      message.success(data?.message ?? "เข้าสู่ระบบสำเร็จ");
      navigate(from, { replace: true });
    } catch (err) {
      message.error(
        err?.response?.data?.message ?? "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="psi-login psi-login--report">
      <div className="psi-login-bg" />

      <Card className="psi-login-card" bordered={false}>
        <div className="psi-login-head">
          <div className="psi-login-logo">
            <img src={logo} alt="PSI" />
          </div>
          <Title level={3} className="psi-login-title">
            PENSIRI STEEL
          </Title>
          <Text className="psi-login-sub">ระบบรายงานและวิเคราะห์ข้อมูล</Text>
          <div className="psi-login-badge">ระบบรายงาน (WEB PSI)</div>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          className="psi-login-form"
          requiredMark={false}
        >
          <Form.Item
            label="ชื่อผู้ใช้"
            name="username"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
          >
            <Input
              prefix={<UserOutlined className="psi-login-icon" />}
              placeholder="username"
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label="รหัสผ่าน"
            name="password"
            rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="psi-login-icon" />}
              placeholder="password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            icon={<LoginOutlined />}
            className="psi-login-btn"
          >
            เข้าสู่ระบบ
          </Button>
        </Form>

        <div className="psi-login-foot">
          PSI ©2024-{new Date().getFullYear()} Created by Jaroon Software Co., Ltd.
        </div>
      </Card>
    </div>
  );
};

export default UILogin;
