import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Table,
  Pagination,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
  message,
} from "antd";
import ProductService from "services/ProductService";
import dayjs from "dayjs";
import { delay, getDefaultValue } from "utils/utils";
import { qcOption } from "context/constant";
import TagQc from "component/tag/TagQc";

const UIProduct = () => {
  const [itemList, setItemList] = useState([]);
  const [qcProduct, setQcProduct] = useState();

  // === MODAL CONTROLLER === //
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === PAGE CONFIG === //
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [query, setQuery] = useState("");
  const [timeQuery, setTimeQuery] = useState({});
  const [qcStatus, setQcStatus] = useState("");

  const [form] = Form.useForm();
  const formRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchProductList();
  }, [page, pageLimit, query, timeQuery, qcStatus]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isModalOpen && event.keyCode === 121) {
        handleSubmitQc();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  const fetchProductList = () => {
    let pageConf = {
      page,
      pageLimit,
      query,
      timeQuery: timeQuery?.dateString ? timeQuery?.dateString : "",
      qcStatus: qcStatus ? qcStatus : "",
    };
    ProductService.getQcProduct(pageConf)
      .then(({ data }) => {
        setItemList(data?.items);
        setTotalItems(data?.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSelect = async (record) => {
    console.log(record);
    let { pdate, procode } = record;

    ProductService.getQcGroup(pdate)
      .then(async ({ data }) => {
        console.log(data);
        let { items, total } = data;

        let idx = items.findIndex((p) => p.procode === procode);

        setIsModalOpen(true);

        await delay(100);
        inputRef.current.focus();

        setQcProduct({ items, totalItems: total, idx, pDate: pdate });

        form.setFieldValue("productCode", items[idx]?.code);
        form.setFieldValue("chargeNo", items[idx]?.charge);
        form.setFieldValue("coilNo", items[idx]?.coilno);
        form.setFieldValue("weight", items[idx]?.weight);
        form.setFieldValue(
          "import_date",
          dayjs(items[idx]?.pdate).format("DD/MM/YYYY")
        );
        form.setFieldValue("qc_date", dayjs());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setQcProduct();
    form.resetFields();
  };

  const onChangeDate = (date, dateString) => {
    setTimeQuery({ date, dateString });
    setPage(1);
  };

  const onChangeQuery = (value) => {
    setQuery(value);
    setPage(1);
  };

  const handleChangeValue = () => {
    let uWeight = form.getFieldValue("uWeight");
    let area = 0;

    if (uWeight > 0) {
      // diameter = (Math.sqrt(uWeight / 6.16).toFixed(2))
      // area = diameter^2 * 0.78571
      let diameterValue = Math.sqrt(uWeight / 6.16);
      area = Math.pow(diameterValue, 2) * 0.78571;
      if (!isNaN(diameterValue) && !isNaN(area)) {
        form.setFieldsValue({
          diameter: getDefaultValue(diameterValue),
          area: getDefaultValue(area),
        });
      }
    } else {
      form.setFieldsValue({ diameter: null, area: null });
    }

    let breakingLoad = form.getFieldValue("breakingLoad");
    if (breakingLoad > 0 && area > 0) {
      // Tensile Strength = Breaking Load / Area
      let tensileStr = breakingLoad / area;
      if (!isNaN(tensileStr)) {
        form.setFieldValue("tensileStr", getDefaultValue(tensileStr));
      }
    } else {
      form.setFieldValue("tensileStr", null);
    }

    let yieldLoad = form.getFieldValue("yieldLoad");
    if (yieldLoad > 0 && area > 0) {
      // Yield Strength = Yield Load / Area
      let yieldStr = yieldLoad / area;
      if (!isNaN(yieldStr)) {
        form.setFieldValue("yieldStr", getDefaultValue(yieldStr));
      }
    } else {
      form.setFieldValue("yieldStr", null);
    }

    let reverseBending = form.getFieldValue("reverseBending");
    if (reverseBending > 0 && area > 0) {
      // Reduction Of Area = (Area – ((Reverse Bending^2)0.78571)) / Area * 100
      let reductionOfArea =
        ((area - Math.pow(reverseBending, 2) * 0.78571) / area) * 100;

      if (!isNaN(reductionOfArea)) {
        form.setFieldValue("reductionOfArea", getDefaultValue(reductionOfArea));
      }
    } else {
      form.setFieldValue("reductionOfArea", null);
    }
  };

  const handleSubmitQc = () => {
    form
      .validateFields()
      .then((values) => {
        let data = {
          procode: qcProduct.items[qcProduct?.idx]?.procode,
          uWeight: values?.uWeight,
          camber: values?.camber,
          indentDept: values?.indentDept,
          breakingLoad: values?.breakingLoad,
          yieldLoad: values?.yieldLoad,
          reverseBending: values?.reverseBending,
          eLong: values?.elong,
          diameter: values?.diameter,
          area: values?.area,
          tensileStr: values?.tensileStr,
          yieldStr: values?.yieldStr,
          reductionArea: values?.reductionOfArea,
          testDate: values?.qc_date,
        };

        let { idx } = qcProduct;
        let nextPage = idx + 2;

        ProductService.updateQcProduct(data)
          .then(() => {
            message.success("Data has been saved!");
            if (nextPage <= qcProduct.totalItems) {
              handleChangePageQC(nextPage);
            } else {
              handleCancel();
            }
            fetchProductList();
          })
          .catch((err) => {
            message.error("ERROR : " + err?.response?.data?.message);
          });
      })
      .catch((err) => {
        return message.error("Failed : Please input your data !");
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      let next = focusNextInput();
      if (typeof next === "object") {
        event.preventDefault();
        next.focus();
      }
    }
  };

  const focusNextInput = () => {
    const form = formRef.current;

    if (form) {
      const activeElement = document.activeElement;
      const formItems = form.getFieldsValue();

      const fieldRefs = Object.keys(formItems).map(
        (fieldName) => form.getFieldInstance(fieldName)?.input
      );

      const currentIndex = fieldRefs.indexOf(activeElement);
      // console.log("currentIndex ==> ", currentIndex);
      // console.log(fieldRefs.length - 1);

      if (currentIndex !== -1 && currentIndex < fieldRefs.length - 1) {
        const nextField = fieldRefs[currentIndex + 1];
        return nextField;
      } else if (currentIndex === fieldRefs.length - 1) {
        return 0;
      }
    }
  };

  const handleChangePageQC = (page) => {
    setQcProduct((prev) => ({ ...prev, idx: page - 1 }));
    form.resetFields();
    form.setFieldValue("productCode", qcProduct?.items[page - 1]?.code);
    form.setFieldValue("chargeNo", qcProduct?.items[page - 1]?.charge);
    form.setFieldValue("coilNo", qcProduct?.items[page - 1]?.coilno);
    form.setFieldValue("weight", qcProduct?.items[page - 1]?.weight);
    form.setFieldValue(
      "import_date",
      dayjs(qcProduct?.items[page - 1]?.pdate).format("DD/MM/YYYY")
    );
    form.setFieldValue("qc_date", dayjs());
  };

  const mainColumn = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
    },
    {
      title: "CHARGE NO.",
      key: "chargeNo",
      dataIndex: "charge",
    },
    {
      title: "COIL NO.",
      key: "coilNo",
      dataIndex: "coilno",
    },
    {
      title: "PRODUCT CODE",
      key: "productCode",
      dataIndex: "code",
      align: "center",
      render: (code) => <Tag color="red">{code}</Tag>,
    },
    {
      title: "DATE",
      key: "pdate",
      dataIndex: "pdate",
      align: "center",
      render: (pdate) => dayjs(pdate).format("DD/MM/YYYY"),
    },
    {
      title: "WEIGHT",
      key: "weight",
      dataIndex: "weight",
      align: "right",
      render: (weight) => weight?.toLocaleString(),
    },
    {
      title: "LOCATION",
      key: "location",
      dataIndex: "location",
      align: "center",
    },
    {
      title: "QC STATUS",
      dataIndex: "pass",
      key: "pass",
      align: "center",
      render: (pass) => <TagQc status={pass} />,
    },
  ];

  return (
    <Card className="card-dashboard">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "18px" }}>ตรวจสอบสินค้า (QC)</h1>
        <Space>
          <Select
            onChange={(value) => setQcStatus(value)}
            options={qcOption}
            placeholder="เลือกสถานะ QC"
            style={{ width: "100%" }}
            allowClear
          />

          <DatePicker onChange={onChangeDate} value={timeQuery?.date} />

          <Input.Search
            placeholder="ค้นหา Charge No."
            allowClear
            onSearch={onChangeQuery}
            style={{ width: 200 }}
          />
        </Space>
      </div>

      <Table
        dataSource={itemList}
        columns={mainColumn}
        onRow={(record) => ({
          onClick: () => handleSelect(record),
        })}
        scroll={{ x: 900 }}
        style={{ marginTop: "1rem" }}
        pagination={false}
        size="middle"
        className="table-click-able"
        rowKey="procode"
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

      <Modal
        title={
          <div>
            ตรวจสอบสินค้า
            <Tag
              color="red"
              style={{
                marginLeft: "10px",
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              {dayjs(qcProduct?.pDate).format("DD/MM/YYYY")} - [
              {qcProduct?.idx + 1}/{qcProduct?.totalItems}]
            </Tag>
            <TagQc status={qcProduct?.items[qcProduct?.idx].pass} />
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <Button
            type="primary"
            htmlType="submit"
            form="editProduct"
            key="submit"
            style={{
              marginRight: "10px",
              height: "40px",
              backgroundColor: "#23a123",
            }}
          >
            บันทึก (F10)
          </Button>
        }
        width={1400}
        destroyOnClose
        maskClosable={false}
      >
        <Form
          form={form}
          id="editProduct"
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleSubmitQc}
          autoComplete="off"
          ref={formRef}
        >
          <Card style={{ marginBottom: "1.25rem" }} className="card-no-padding">
            <Row gutter={[16, 0]}>
              <Col span={8}>
                <Card
                  title={null}
                  bordered={false}
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                    padding: "24px",
                  }}
                >
                  <Row gutter={[8, 16]}>
                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>รหัสสินค้า</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="productCode"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>Charge No.</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="chargeNo"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>Coil No.</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="coilNo"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col span={8}>
                <Card
                  bordered={false}
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                    borderLeft: "1px solid #f0f0f0",
                    borderRadius: "0px",
                  }}
                >
                  <Row gutter={[8, 16]} style={{ padding: "24px 32px" }}>
                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>Weight</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="weight"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>Diameter</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="diameter"
                            style={{ marginBottom: "0px" }}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>Area</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="area"
                            style={{ marginBottom: "0px" }}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>Tensile Strength</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="tensileStr"
                            style={{ marginBottom: "0px" }}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>Yield Strength</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="yieldStr"
                            style={{ marginBottom: "0px" }}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col span={8}>
                <Card
                  bordered={false}
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                    borderLeft: "1px solid #f0f0f0",
                    borderRadius: "0px",
                  }}
                >
                  <Row gutter={[8, 16]} style={{ padding: "24px 32px" }}>
                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>Reduction Of Area</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="reductionOfArea"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input disabled onKeyDown={handleKeyPress} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>วันที่ผลิต</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="import_date"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>วันที่ทดสอบ</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="qc_date"
                            rules={[
                              {
                                required: true,
                                message: "Please input your data!",
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              format={"DD/MM/YYYY"}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={22}>
                      <Row>
                        <Col xs={9}>ขายให้กับลูกค้า</Col>
                        <Col xs={15}>
                          <Form.Item
                            name="sale"
                            style={{ marginBottom: "0px" }}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>

          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={6}>
                <Row>
                  <Col xs={9}>Unit Weight</Col>
                  <Col xs={15}>
                    <Form.Item
                      name="uWeight"
                      rules={[
                        {
                          required: true,
                          message: "Please input your data!",
                        },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <Input
                        ref={inputRef}
                        onKeyDown={handleKeyPress}
                        onChange={handleChangeValue}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col xs={6}>
                <Row>
                  <Col xs={9}>Camber</Col>
                  <Col xs={15}>
                    <Form.Item
                      name="camber"
                      rules={[
                        {
                          required: true,
                          message: "Please input your data!",
                        },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <Input onKeyDown={handleKeyPress} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col xs={6}>
                <Row>
                  <Col xs={9}>Indent Dept</Col>
                  <Col xs={15}>
                    <Form.Item
                      name="indentDept"
                      rules={[
                        {
                          required: true,
                          message: "Please input your data!",
                        },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <Input onKeyDown={handleKeyPress} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col xs={6}>
                <Row>
                  <Col xs={9}>Breaking Load</Col>
                  <Col xs={15}>
                    <Form.Item
                      name="breakingLoad"
                      rules={[
                        {
                          required: true,
                          message: "Please input your data!",
                        },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <Input
                        onKeyDown={handleKeyPress}
                        onChange={handleChangeValue}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col xs={6}>
                <Row>
                  <Col xs={9}>Yield Load</Col>
                  <Col xs={15}>
                    <Form.Item
                      name="yieldLoad"
                      rules={[
                        {
                          required: true,
                          message: "Please input your data!",
                        },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <Input
                        onKeyDown={handleKeyPress}
                        onChange={handleChangeValue}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col xs={6}>
                <Row>
                  <Col xs={9}>Reverse Bending</Col>
                  <Col xs={15}>
                    <Form.Item
                      name="reverseBending"
                      rules={[
                        {
                          required: true,
                          message: "Please input your data!",
                        },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <Input
                        onKeyDown={handleKeyPress}
                        onChange={handleChangeValue}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col xs={6}>
                <Row>
                  <Col xs={9}>Elong</Col>
                  <Col xs={15}>
                    <Form.Item
                      name="elong"
                      rules={[
                        {
                          required: true,
                          message: "Please input your data!",
                        },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <Input onKeyDown={handleKeyPress} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} style={{ textAlign: "center" }}>
                <Pagination
                  simple
                  current={qcProduct?.idx + 1}
                  total={qcProduct?.totalItems}
                  defaultPageSize={1}
                  onChange={(page) => handleChangePageQC(page)}
                />
              </Col>
            </Row>
          </Card>
        </Form>
      </Modal>
    </Card>
  );
};

export default UIProduct;
