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

const UISeller = ({ activeKey }) => {
  const [selletList, setSellerList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // === MODAL === //
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [query, setQuery] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    if (activeKey === "3") fetchSeller();
  }, [activeKey, page, pageLimit, query]);

  const fetchSeller = () => {
    let pagination = { page, pageLimit, query };
    SettingService.getAllSeller(pagination)
      .then(({ data }) => {
        setSellerList(data?.items);
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
      SettingService.addSeller(reqData)
        .then(() => {
          Swal.fire({
            title: "สำเร็จ!",
            text: "เพิ่มผู้ขายสำเร็จ",
            icon: "success",
          });
          fetchSeller();
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

      SettingService.updateSeller(reqData)
        .then(() => {
          Swal.fire({
            title: "สำเร็จ!",
            text: "แก้ไขสำเร็จ",
            icon: "success",
          });
          fetchSeller();
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
      text: `คุณต้องการลบ "${record?.namesale}" ใช่หรือไม่`,
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
        SettingService.delSellerById(record?.saleno)
          .then(() => {
            Swal.fire(
              "ดำเนินการสำเร็จ",
              `ลบข้อมูลผู้ขาย "${record?.namesale}" สำเร็จ`,
              "success"
            );
            fetchSeller();
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
    ...COLUMN.SELLER,
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
    setIsEdit(true);

    form.setFieldValue("sellerId", record?.saleno);
    form.setFieldValue("firstname", record?.namesale);
    form.setFieldValue("lastname", record?.lastname);
    form.setFieldValue("tel", record?.tel);
    form.setFieldValue("remark", record?.remark);
    form.setFieldValue("status", record?.status);
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
          <h1 style={{ margin: "0", fontSize: "18px" }}>Seller</h1>
          <Space>
            <Input.Search
              placeholder="ค้นหา ชื่อพนักงานขาย"
              allowClear
              onSearch={(value) => {
                setQuery(value);
                setPage(1);
              }}
            />
            <Button
              type="primary"
              style={{ width: "100%", maxWidth: "138px", margin: "0" }}
              onClick={showModal}
            >
              เพิ่มพนักงานขาย
            </Button>
          </Space>
        </div>

        <Table
          dataSource={selletList}
          columns={columns}
          onRow={(record) => ({
            onClick: () => handleEdit(record),
          })}
          scroll={{ x: 900 }}
          style={{ marginTop: "2rem" }}
          pagination={false}
          className="table-click-able"
          size="small"
          rowKey="saleno"
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
        title={`${isEdit ? "แก้ไข" : "เพิ่ม"}พนักงานขาย`}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={form}
          id="addSeller"
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
                label="รหัสพนักงาน"
                name="sellerId"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <Input disabled={isEdit} placeholder="รหัสพนักงานขาย" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="เบอร์โทรศัพท์" name="tel">
                <Input placeholder="เบอร์โทรศัพท์" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="ชื่อ"
                name="firstname"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <Input placeholder="ชื่อ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="นามสกุล"
                name="lastname"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <Input placeholder="นามสกุล" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="หมายเหตุ" name="remark">
                <Input placeholder="หมายเหตุ" />
              </Form.Item>
            </Col>
            {isEdit ? (
              <Col span={24}>
                <Form.Item
                  label="สถานะ"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: "Please input your data!",
                    },
                  ]}
                >
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
              style={{
                border: "1px solid #ccc",
              }}
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

export default UISeller;
