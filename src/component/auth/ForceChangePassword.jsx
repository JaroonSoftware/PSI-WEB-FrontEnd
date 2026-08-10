import React, { useState } from "react";
import { Modal, Form, Input, Alert, Button, message } from "antd";
import { LockOutlined, SafetyOutlined } from "@ant-design/icons";
import AuthService from "services/Auth.service";
import { useAuth } from "context/auth/AuthContext";

/**
 * บังคับตั้งรหัสผ่านใหม่เมื่อเข้าใช้งานครั้งแรก
 * (หรือหลังผู้ดูแลระบบรีเซ็ตรหัสให้)
 * ปิดหน้าต่างไม่ได้จนกว่าจะตั้งรหัสใหม่สำเร็จ
 */
const ForceChangePassword = () => {
  const { user, refresh, logout } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const open = !!user?.mustChangePassword;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await AuthService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success(data?.message ?? "เปลี่ยนรหัสผ่านสำเร็จ");
      form.resetFields();
      await refresh();
    } catch (err) {
      message.error(
        err?.response?.data?.message ?? "เปลี่ยนรหัสผ่านไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <span>
          <SafetyOutlined style={{ color: "#1668dc", marginRight: 8 }} />
          ตั้งรหัสผ่านใหม่ก่อนเริ่มใช้งาน
        </span>
      }
      closable={false}
      maskClosable={false}
      keyboard={false}
      centered
      destroyOnClose
      footer={[
        <Button key="logout" danger onClick={logout}>
          ออกจากระบบ
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          บันทึกรหัสผ่านใหม่
        </Button>,
      ]}
    >
      <Alert
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
        message="เพื่อความปลอดภัย กรุณาตั้งรหัสผ่านของคุณเอง"
        description={`บัญชี "${
          user?.username ?? ""
        }" ยังใช้รหัสผ่านที่ผู้ดูแลระบบตั้งให้ กรุณาเปลี่ยนก่อนใช้งาน`}
      />

      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="รหัสผ่านเดิม"
          name="oldPassword"
          rules={[{ required: true, message: "กรุณากรอกรหัสผ่านเดิม" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="รหัสผ่านที่ผู้ดูแลระบบให้มา"
            autoFocus
          />
        </Form.Item>

        <Form.Item
          label="รหัสผ่านใหม่"
          name="newPassword"
          rules={[
            { required: true, message: "กรุณากรอกรหัสผ่านใหม่" },
            { min: 4, message: "อย่างน้อย 4 ตัวอักษร" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="อย่างน้อย 4 ตัวอักษร"
          />
        </Form.Item>

        <Form.Item
          label="ยืนยันรหัสผ่านใหม่"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "กรุณายืนยันรหัสผ่านใหม่" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("รหัสผ่านใหม่ไม่ตรงกัน"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ForceChangePassword;
