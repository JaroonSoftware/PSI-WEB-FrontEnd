import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { LockOutlined, KeyOutlined } from "@ant-design/icons";
import AuthService from "services/Auth.service";

/**
 * เปลี่ยนรหัสผ่านด้วยตัวเอง (ผู้ใช้กดเปิดเอง ปิดได้)
 */
const ChangePasswordModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    form.resetFields();
    onClose?.();
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await AuthService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success(data?.message ?? "เปลี่ยนรหัสผ่านสำเร็จ");
      handleClose();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "เปลี่ยนรหัสผ่านไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <span>
          <KeyOutlined style={{ color: "#1668dc", marginRight: 8 }} />
          เปลี่ยนรหัสผ่าน
        </span>
      }
      onCancel={handleClose}
      onOk={() => form.submit()}
      okText="บันทึกรหัสผ่านใหม่"
      cancelText="ยกเลิก"
      confirmLoading={loading}
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="รหัสผ่านเดิม"
          name="oldPassword"
          rules={[{ required: true, message: "กรุณากรอกรหัสผ่านเดิม" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่านเดิม" />
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

export default ChangePasswordModal;
