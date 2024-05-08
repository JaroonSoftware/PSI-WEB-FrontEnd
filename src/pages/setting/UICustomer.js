import {
  Card,
  Table,
  Button,
  Pagination,
  Space,
  Modal,
  Form,
  Input,
  Tag,
  Row,
  Col,
  Select,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SettingService from "services/SettingService";
import { COLUMN } from "context/column";

const UICustomer = ({ activeKey }) => {
  const [customerList, setCustomerList] = useState([]);
  const [current, setCurrent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [query, setQuery] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (activeKey === "2") fetchCustomer();
  }, [activeKey, page, pageLimit, query]);

  const fetchCustomer = () => {
    let pagination = { page, pageLimit, query };
    SettingService.getAllCustomer(pagination)
      .then(({ data }) => {
        setCustomerList(data?.items);
        setTotalItems(data?.total);
      })
      .catch(() => {});
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    form.resetFields();
  };
  const onFinish = (values) => {
    let reqData = {};
    if (!isEdit) {
      reqData = {
        ...values,
      };
      SettingService.addCustomer(reqData)
        .then(() => {
          Swal.fire({
            title: "สำเร็จ!",
            text: "เพิ่มสมาชิกสำเร็จ",
            icon: "success",
          });
          fetchCustomer();
          handleCancel();
        })
        .catch((err) => {
          Swal.fire({
            title: "ผิดพลาด!",
            text: err.response.data.message,
            icon: "error",
          });
        });
    } else {
      reqData = {
        ...values,
      };
      SettingService.updateCustomer(reqData)
        .then(() => {
          Swal.fire({
            title: "สำเร็จ!",
            text: "แก้ไขสำเร็จ",
            icon: "success",
          });
          fetchCustomer();
          handleCancel();
        })
        .catch((err) => {
          Swal.fire({
            title: "ผิดพลาด!",
            text: err.response.data.message,
            icon: "error",
          });
        });
    }
  };
  const handleDelete = (event, record) => {
    event.stopPropagation();
    Swal.fire({
      icon: "warning",
      title: "คำเตือน",
      text: `คุณต้องการลบ "${record?.name}" ใช่หรือไม่`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      customClass: {
        confirmButton: "confirm-button-class",
        title: "title-class",
        icon: "icon-class",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        SettingService.delCustomerById(record?.cusno)
          .then(() => {
            Swal.fire(
              "ดำเนินการสำเร็จ",
              `ลบข้อมูลลูกค้า "${record?.name}" สำเร็จ`,
              "success"
            );
            fetchCustomer();
          })

          .catch(() => {
            Swal.fire("ดำเนินการไม่สำเร็จ", `ผิดพลาด`, "error");
          });
      }
    });
  };

  const columns = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "5%",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
    },
    ...COLUMN.CUSTOMER,
    {
      title: "เครื่องมือ",
      dataIndex: "tool",
      key: "tool",
      align: "center",
      render: (text, record) => (
        <Space>
          <Button
            className="less-padding"
            type="primary"
            danger
            onClick={(event) => handleDelete(event, record)}
          >
            {<DeleteOutlined />}
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setIsModalOpen(true);
    setCurrent(record);
    setIsEdit(true);

    form.setFieldValue("customerId", record?.cusno);
    form.setFieldValue("customerName", record?.name);
    form.setFieldValue("code", record?.ali);
    form.setFieldValue("addr1", record?.add1);
    form.setFieldValue("addr2", record?.add2);
    form.setFieldValue("addr3", record?.add3);
    form.setFieldValue("zipCode1", record?.zip);
    form.setFieldValue("tel1", record?.tel1);
    form.setFieldValue("tel2", record?.tel2);
    form.setFieldValue("tel3", record?.tel3);
    form.setFieldValue("fax", record?.fax);
    form.setFieldValue("visitorName", record?.attn);
    form.setFieldValue("credit", record?.credit);
    form.setFieldValue("fac1", record?.fac1);
    form.setFieldValue("fac2", record?.fac2);
    form.setFieldValue("fac3", record?.fac3);
    form.setFieldValue("zipCode2", record?.zip2);
    form.setFieldValue("grade", record?.grade);
    form.setFieldValue("isDealer", record?.dealer);
    form.setFieldValue("status", record?.status);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <div style={{ margin: "0px 20px" }}>
      <Card className="card-dashboard" style={{ marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: "0", fontSize: "18px" }}>Customer</h1>
          <Space>
            <Input.Search
              placeholder="ค้นหา ชื่อลูกค้า"
              allowClear
              onSearch={(value) => {
                setQuery(value);
                setPage(1);
              }}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              style={{ width: "100%", maxWidth: "138px", margin: "0" }}
              onClick={showModal}
            >
              เพิ่มลูกค้า
            </Button>
          </Space>
        </div>

        <Table
          dataSource={customerList}
          columns={columns}
          onRow={(record) => ({
            onClick: () => handleEdit(record),
          })}
          scroll={{ x: 900 }}
          style={{ marginTop: "2rem" }}
          pagination={false}
          className="table-click-able"
          size="small"
          rowKey="cusno"
        />
        <Pagination
          showSizeChanger
          total={totalItems}
          showTotal={(total) => `จำนวนทั้งหมด ${total?.toLocaleString()}`}
          defaultPageSize={10}
          defaultCurrent={1}
          current={page}
          style={{ marginTop: "20px", textAlign: "right" }}
          onChange={(newPage) => setPage(newPage)}
          onShowSizeChange={(current, limit) => setPageLimit(limit)}
        />
      </Card>

      <Modal
        title={`${isEdit ? "แก้ไข" : "เพิ่ม"}ลูกค้า`}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={form}
          id="addCustomer"
          name="basic"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row className="form-modal" gutter={15}>
            <Col span={12}>
              <Form.Item
                label="รหัสลูกค้า"
                name="customerId"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <Input disabled={isEdit} placeholder="รหัสลูกค้า" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ตัวย่อ"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <Input placeholder="ตัวย่อ" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="ชื่อลูกค้า"
                name="customerName"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <Input placeholder="ชื่อลูกค้า" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ที่อยู่1" name="addr1">
                <Input placeholder="ที่อยู่1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ที่อยู่2" name="addr2">
                <Input placeholder="ที่อยู่2" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ที่อยู่3" name="addr3">
                <Input placeholder="ที่อยู่3" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="รหัสไปรษณีย์" name="zipCode1">
                <Input placeholder="รหัสไปรษณีย์" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="เบอร์โทร1" name="tel1">
                <Input placeholder="เบอร์โทร1" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="เบอร์โทร2" name="tel2">
                <Input placeholder="เบอร์โทร2" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="เบอร์โทร3" name="tel3">
                <Input placeholder="เบอร์โทร3" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="เบอร์แฟกซ์" name="fax">
                <Input placeholder="เบอร์แฟกซ์" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="ชื่อผู้ติดต่อ" name="visitorName">
                <Input placeholder="ชื่อผู้ติดต่อ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="เครดิต" name="credit">
                <Input type="number" placeholder="เครดิต" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="โรงงาน1" name="fac1">
                <Input placeholder="โรงงาน1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="โรงงาน2" name="fac2">
                <Input placeholder="โรงงาน2" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="โรงงาน3" name="fac3">
                <Input placeholder="โรงงาน3" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="รหัสไปรษณีย์2" name="zipCode2">
                <Input placeholder="รหัสไปรษณีย์2" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="เกรด" name="grade">
                <Select
                  placeholder="เกรด"
                  onChange={handleChange}
                  options={[
                    {
                      value: "1",
                      label: "1",
                    },
                    {
                      value: "2",
                      label: "2",
                    },
                    {
                      value: "3",
                      label: "3",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ผู้จำหน่าย" name="isDealer">
                <Select
                  placeholder="ผู้จำหน่าย"
                  onChange={handleChange}
                  options={[
                    {
                      value: "Y",
                      label: "Y",
                    },
                    {
                      value: "N",
                      label: "N",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            {isEdit ? (
              <Col span={24}>
                <Form.Item label="สถานะ" name="status">
                  <Select
                    options={[
                      {
                        value: "Y",
                        label: "Y",
                      },
                      {
                        value: "N",
                        label: "N",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            ) : (
              <></>
            )}
          </Row>

          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              htmlType="submit"
            >
              บันทึก
            </Button>

            <Button
              type="button"
              style={{ border: "1px solid #ccc" }}
              onClick={handleCancel}
            >
              ปิด
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UICustomer;
