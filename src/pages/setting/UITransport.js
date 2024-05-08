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

const UITransport = ({ activeKey }) => {
  const [transportList, setTransportList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(1);
  const [query, setQuery] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    if (activeKey === "5") fetchTransport();
  }, [activeKey, page, pageLimit, query]);

  const fetchTransport = () => {
    let pageConf = { page, pageLimit, query };
    SettingService.getAllTransport(pageConf)
      .then(({ data }) => {
        setTransportList(data?.items);
        setTotalItems(data?.total);
      })
      .catch((err) => console.log(err));
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
      SettingService.addTransport(reqData)
        .then(() => {
          Swal.fire({
            title: "สำเร็จ!",
            text: "เพิ่มขนส่งสำเร็จ",
            icon: "success",
          });
          fetchTransport();
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
      SettingService.updateTransport(reqData)
        .then(() => {
          Swal.fire({
            title: "สำเร็จ!",
            text: "แก้ไขสำเร็จ",
            icon: "success",
          });
          fetchTransport();
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
        SettingService.delTransportById(record?.trncode)
          .then(() => {
            fetchTransport();
            Swal.fire(
              "ดำเนินการสำเร็จ",
              `ลบข้อมูลขนส่ง "${record?.name}" สำเร็จ`,
              "success"
            );
          })
          .catch((err) => console.log(err));
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
    ...COLUMN.TRANSPORT,
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

    form.setFieldValue("transportId", record?.trncode);
    form.setFieldValue("name", record?.name);
    form.setFieldValue("tel", record?.tel);
    form.setFieldValue("addr1", record?.addr1);
    form.setFieldValue("addr2", record?.addr2);
    form.setFieldValue("addr3", record?.addr3);
    form.setFieldValue("fax", record?.fax);
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
          <h1 style={{ margin: "0", fontSize: "18px" }}>Transport</h1>

          <Space>
            <Input.Search
              placeholder="ค้นหา ชื่อบริษัทขนส่ง"
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
              เพิ่มบริษัทขนส่ง
            </Button>
          </Space>
        </div>

        <Table
          dataSource={transportList}
          columns={columns}
          onRow={(record) => ({
            onClick: () => {
              handleEdit(record);
              setIsEdit(true);
            },
          })}
          scroll={{ x: 900 }}
          style={{ marginTop: "2rem" }}
          pagination={false}
          className="table-click-able"
          size="small"
          rowKey="trncode"
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
        title={`${isEdit ? "แก้ไข" : "เพิ่ม"}ขนส่ง`}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={form}
          id="addTransport"
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
                label="รหัสบริษัทขนส่ง"
                name="transportId"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <Input disabled={isEdit} placeholder="รหัสบริษัทขนส่ง" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ชื่อ"
                name="name"
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
              <Form.Item label="เบอร์โทรศัพท์" name="tel">
                <Input placeholder="เบอร์โทรศัพท์" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="เบอร์แฟกซ์" name="fax">
                <Input placeholder="เบอร์แฟกซ์" />
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

export default UITransport;
