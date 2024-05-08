import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Modal,
  Button,
  Input,
  Table,
  Form,
  Space,
  Pagination,
  Tag,
} from "antd";
import { DeleteOutlined, EditOutlined, RedoOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import SettingService from "services/SettingService";

const UIProductType = ({ activeKey }) => {
  const [typeList, setTypeList] = useState([]);
  const [codeList, setCodeList] = useState([]);
  const [currentItem, setCurrentItem] = useState({});

  const [isEditType, setIsEditType] = useState(false);
  const [isEditCode, setIsEditCode] = useState(false);

  const [isOpenModalType, setIsOpenModalType] = useState(false);
  const [isOpenModalList, setIsOpenModalList] = useState(false);
  const [isOpenModalCode, setIsOpenModalCode] = useState(false);

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [form] = Form.useForm();
  const [formCode] = Form.useForm();

  useEffect(() => {
    if (activeKey === "1") fetchProductType();
  }, [activeKey]);

  useEffect(() => {
    if (currentItem?.typecode) {
      fetchProductCode();
    }
  }, [currentItem, page]);

  const fetchProductType = () => {
    SettingService.getAllProductType()
      .then(({ data }) => {
        setTypeList(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchProductCode = () => {
    let pageConf = { typeCode: currentItem?.typecode, page };
    SettingService.getProductCode(pageConf)
      .then(({ data }) => {
        setCodeList(data?.items);
        setTotalItems(data?.total);
      })
      .catch((err) => console.log(err));
  };

  const handleEditType = (e, item) => {
    e.stopPropagation();
    form.setFieldValue("typeName", item?.typename);
    setCurrentItem(item);
    setIsOpenModalType(true);
    setIsEditType(true);
  };

  const handleClose = () => {
    setCurrentItem({});
    setIsEditType(false);
    setIsOpenModalType(false);
    form.resetFields();
  };

  const handleCloseModalList = () => {
    setIsOpenModalList(false);
    setCurrentItem({});
  };

  const handleCloseModalCode = () => {
    setIsOpenModalCode(false);
    setIsEditCode(false);
    formCode.resetFields();
  };

  const handleDelete = (e, item) => {
    e.stopPropagation();
    let prefix = checkIsActive(item?.status) ? "delete" : "restore";
    Swal.fire({
      title: `Are you sure to ${prefix} '${item.typename}'?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${prefix} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        SettingService.delProdctTypeById(item?.typecode)
          .then(() => {
            fetchProductType();
            Swal.fire({
              title: `${prefix.toUpperCase()} !`,
              text: `Your data has been ${prefix}.`,
              icon: "success",
            });
          })
          .catch((err) =>
            Swal.fire({
              title: "Something went wrong!",
              text: "CAN'T DELETE PRODUCT CODE",
              icon: "error",
            })
          );
      }
    });
  };

  const handleSubmitProductType = (formValue) => {
    let { typeName } = formValue;
    let reqData = { typeName };
    if (!isEditType) {
      SettingService.addProductType(reqData)
        .then(() => {
          Swal.fire({
            title: "Success!",
            text: "Added new product code",
            icon: "success",
          });
          fetchProductType();
          handleClose();
        })
        .catch((err) => console.log(err));
    } else {
      reqData["typeCode"] = currentItem?.typecode;
      SettingService.editProductType(reqData)
        .then(() => {
          Swal.fire({
            title: "Success!",
            text: "Edit product code success",
            icon: "success",
          });
          fetchProductType();
          handleClose();
        })
        .catch((err) => console.log(err));
    }
  };

  const checkIsActive = (status) => {
    return status === "true" ? true : false;
  };

  const handleOpenList = (item) => {
    setPage(1);
    setCurrentItem(item);
    setIsOpenModalList(true);
  };

  const handleDeleteCode = (e, productCode) => {
    e.stopPropagation();
    Swal.fire({
      title: `Are you sure to delete '${productCode}'?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, delete it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        SettingService.delProductCode(productCode)
          .then(() => {
            Swal.fire({
              title: "Success!",
              text: "Edit product code success",
              icon: "success",
            });
            fetchProductCode();
            handleCloseModalCode();
          })
          .catch((err) => {
            Swal.fire(
              "Something went wrong!",
              err?.response?.data?.message,
              "error"
            );
          });
      }
    });
  };

  const handleEditCode = (record) => {
    setIsOpenModalCode(true);
    setIsEditCode(true);
    formCode.setFieldValue("productCode", record?.productcode);
    formCode.setFieldValue("productName", record?.productname);
    formCode.setFieldValue("gradeCode", record?.gradecode);
    formCode.setFieldValue("size", record?.size);
    formCode.setFieldValue("scale", record?.scale);
  };

  const handleSubmitProductCode = (formValue) => {
    if (!isEditCode) {
      let reqData = {
        typeCode: currentItem?.typecode?.toString(),
        ...formValue,
      };

      SettingService.addProductCode(reqData)
        .then(() => {
          Swal.fire({
            title: "Success!",
            text: "Add product code success",
            icon: "success",
          });
          fetchProductCode();
          handleCloseModalCode();
        })
        .catch((err) =>
          Swal.fire(
            "Something went wrong!",
            err?.response?.data?.message,
            "error"
          )
        );
    } else {
      SettingService.editProductCode(formValue)
        .then((res) => {
          Swal.fire({
            title: "Success!",
            text: "Edit product code success",
            icon: "success",
          });
          fetchProductCode();
          handleCloseModalCode();
        })
        .catch((err) =>
          Swal.fire(
            "Something went wrong!",
            err?.response?.data?.message,
            "error"
          )
        );
    }
  };

  const productCodeColumn = [
    {
      title: "รหัสสินค้า",
      align: "center",
      width: "15%",
      key: "productcode",
      dataIndex: "productcode",
      render: (productcode) => <Tag color="red">{productcode}</Tag>,
    },
    {
      title: "ชื่อสินค้า",
      width: "55%",
      key: "productname",
      dataIndex: "productname",
    },
    {
      title: "รหัสขนาด",
      align: "center",
      key: "gradecode",
      dataIndex: "gradecode",
      width: "10%",
      render: (gradecode) => (gradecode ? gradecode : "-"),
    },
    {
      title: "ขนาด",
      align: "center",
      key: "size",
      dataIndex: "size",
    },
    {
      title: "หน่วย",
      key: "scale",
      align: "center",
      dataIndex: "scale",
    },
    {
      title: "เครื่องมือ",
      align: "center",
      width: "10%",
      key: "tools",
      render: ({ productcode }) => (
        <Space>
          <Button
            danger
            type="primary"
            style={{ margin: "0" }}
            icon={<DeleteOutlined />}
            onClick={(e) => handleDeleteCode(e, productcode)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: "0", fontSize: "18px" }}></h1>
        <Button
          type="primary"
          style={{ margin: "0" }}
          onClick={() => setIsOpenModalType(true)}
        >
          เพิ่มประเภทสินค้า
        </Button>
      </div>

      <Row style={{ marginTop: "2rem" }} gutter={[16, 16]}>
        {typeList.length > 0 &&
          typeList.map((item, idx) => {
            return (
              <Col md={4} sm={8} key={idx}>
                <Card
                  className="border-less-card"
                  onClick={() => handleOpenList(item)}
                >
                  <div
                    style={{
                      backgroundColor:
                        !checkIsActive(item?.status) && "#939393",
                    }}
                    className="card-container"
                  >
                    <Button
                      className="bt-delete-pdcode"
                      style={{
                        backgroundColor:
                          !checkIsActive(item?.status) && "#46ab46",
                      }}
                      icon={
                        item?.status === "true" ? (
                          <DeleteOutlined />
                        ) : (
                          <RedoOutlined />
                        )
                      }
                      onClick={(e) => handleDelete(e, item)}
                    />
                    {item.typename}
                    <div
                      className="bt-edit-pdcode"
                      onClick={(e) => handleEditType(e, item)}
                    >
                      <h4>Edit</h4>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
      </Row>

      {/* ADD / EDIT PRODUCT TYPE */}
      <Modal
        open={isOpenModalType}
        title={`${isEditType ? "Edit" : "Add"} Product Type`}
        onCancel={handleClose}
        maskClosable={false}
        destroyOnClose
        footer={[
          <Button key="back" onClick={handleClose}>
            Close
          </Button>,
          <Button
            form="addProductType"
            key="submit"
            htmlType="submit"
            type="primary"
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form}
          id="addProductType"
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleSubmitProductType}
          autoComplete="off"
          // requiredMark={"optional"}
        >
          <Form.Item
            label="Type Name"
            name="typeName"
            rules={[
              {
                required: true,
                message: "Typecode is required.",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL SHOW PRODUCT CODE */}
      <Modal
        open={isOpenModalList}
        title={`รหัสสินค้า ${currentItem?.typename}`}
        onCancel={handleCloseModalList}
        footer={null}
        width={800}
        maskClosable={false}
        destroyOnClose
      >
        <Button
          type="primary"
          style={{ float: "right", marginBottom: "1rem" }}
          onClick={() => setIsOpenModalCode(true)}
        >
          เพิ่มรหัสสินค้า
        </Button>

        <Table
          className="table-less-pd pagination-center table-click-able"
          style={{ marginTop: "1rem" }}
          size="middle"
          dataSource={codeList}
          columns={productCodeColumn}
          pagination={false}
          rowKey="productcode"
          onRow={(record) => ({
            onClick: () => handleEditCode(record),
          })}
        />
        <Pagination
          total={totalItems}
          defaultPageSize={10}
          defaultCurrent={1}
          current={page}
          style={{ marginTop: "20px", textAlign: "center" }}
          onChange={(newPage) => setPage(newPage)}
        />
      </Modal>

      {/* ADD / EDIT PRODUCT CODE */}
      <Modal
        open={isOpenModalCode}
        title={`${isEditCode ? "Edit" : "Add"} Product Code`}
        onCancel={handleCloseModalCode}
        maskClosable={false}
        destroyOnClose
        footer={[
          <Button key="back" onClick={handleCloseModalCode}>
            Close
          </Button>,
          <Button
            form="addProductCode"
            key="submit"
            htmlType="submit"
            type="primary"
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={formCode}
          id="addProductCode"
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleSubmitProductCode}
          autoComplete="off"
          // requiredMark={"optional"}
        >
          <Form.Item
            label="รหัสสินค้า"
            name="productCode"
            rules={[
              {
                required: true,
                message: "Product code is required.",
              },
            ]}
          >
            <Input disabled={isEditCode} />
          </Form.Item>

          <Form.Item
            label="ชื่อสินค้า"
            name="productName"
            rules={[
              {
                required: true,
                message: "Product name is required.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="รหัสขนาด"
            name="gradeCode"
            rules={[
              {
                required: true,
                message: "Grade code is required.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="ขนาด"
            name="size"
            rules={[
              {
                required: true,
                message: "Size is required.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="หน่วย"
            name="scale"
            rules={[
              {
                required: true,
                message: "Scale is required.",
              },
            ]}
          >
            <Input placeholder="mm." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UIProductType;
