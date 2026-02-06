import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

// import logo from "../../../assets/images/logo_nsf.png";
import "./psp.css";

import dayjs from "dayjs";
// import {
//   parameterColumnPrint,
//   parameterMicroColumnPrint,
//   parameterMetalColumnPrint,
// } from "../../../pages/product-specification/model";

// import ProductSpecificationService from "../../../service/ProductSpecification.service";
import { Button, Card, Space, Table, Typography, Steps, Flex } from "antd";
import { PiPrinterFill } from "react-icons/pi";
// import { capitalizeFirst } from "../../../utils/utils";
// const pspService = ProductSpecificationService();
function PspPrintPreview() {
  const { code, version } = useParams();
  const componentRef = useRef(null);
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    onBeforePrint: () => handleBeforePrint(),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const [header, setHeader] = useState({});

  const [psyItems, setPsyItems] = useState([]);
  const [micro_para, setMicro_para] = useState([]);
  const [parametersTreatment, setParametersTreatment] = useState([]);
  const [metal_para, setMetal_para] = useState([]);

  const handleBeforePrint = (e) => {
    // const newElement = document.createElement('div');
    // newElement.id = 'new-container'; // Optional: Set an ID for the new container
    // newElement.innerHTML = 'TEST';
    // Render the new component into the new container
    // Replace the old container with the new container
    // componentRef.current.innerHTML = 'TEST';
  };

  const splitSteps = (steps, perRow = 3) => {
    const rows = [];
    for (let i = 0; i < steps.length; i += perRow) {
      rows.push(steps.slice(i, i + perRow));
    }
    return rows;
  };

  const handleCheckMultiPages = () => {
    const limitPage = 930;

    const head = document.getElementById("form-head");
    // const step = document.getElementById("form-body-step");
    const parm = document.getElementById("form-body-parm");
    const micro = document.getElementById("form-body-micro");

    // const othr = document.getElementById("form-body-other");

    let headHieght = Number(
      window
        .getComputedStyle(head)
        .getPropertyValue("height")
        ?.replace("px", "")
    );
    // let stepHieght = Number(
    //   window
    //     .getComputedStyle(step)
    //     .getPropertyValue("height")
    //     ?.replace("px", "")
    // );
    let parmHieght = Number(
      window
        .getComputedStyle(parm)
        .getPropertyValue("height")
        ?.replace("px", "")
    );
    let microHieght = Number(
      window
        .getComputedStyle(micro)
        .getPropertyValue("height")
        ?.replace("px", "")
    );

    // let othrHieght = Number(window.getComputedStyle(othr).getPropertyValue('height')?.replace("px", ""));
    // console.log( {headHieght, stepHieght, parmHieght, othrHieght} );
    if (headHieght + parmHieght + microHieght > limitPage) {
      parm.style.pageBreakBefore = "always";
      headHieght = 0;
      //   stepHieght = 0;
    }

    // if( headHieght + stepHieght + parmHieght + othrHieght > limitPage ){
    //     othr.style.pageBreakBefore = 'always';
    // }

    printRef.current = componentRef.current;

    return printRef.current;
  };

  const PrintComponent = () => {
    return (
      <div className="psp-page-form" ref={componentRef}>
        <table style={{ width: "100%", fontFamily: "inherit" }}>
          <thead>
            <tr>
              <th>
                <PrintHeaderPage />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr id="form-head">
              <td>
                <HeaderData />
              </td>
            </tr>
            <tr id="form-body-parm">
              <td>
                <BodyDataPhysical />
              </td>
            </tr>
            <tr id="form-body-micro">
              <td>
                <BodyDataMicro />
              </td>
            </tr>
            <tr id="form-body-metal">
              <td>
                <BodyDataMetal />
              </td>
            </tr>
            <tr id="form-body-treatment" >
              <td>
                <BodyDataTreatment />
              </td>
            </tr>
            <tr id="form-body-last">
              <td>
                <LastData />
              </td>
            </tr>
            {/* <tr id="form-body-other">
                        <td><BodyDataOther /></td>
                    </tr>  */}
          </tbody>
        </table>
        <FooterForm />
      </div>
    );
  };

  const HeaderData = () => {
    return (
      <div className="head-data" style={{ marginBottom: 0, paddingBottom:0 }}>
        <div className="text-center" style={{ marginBottom: 0, paddingBottom:0 }}>
          <Typography.Title level={5} className="uppercase mb-0.5">
            PRODUCT SPECIFICATION
          </Typography.Title>
        </div>
        <div className="flex">
          <div className="flex w-1/2 flex-col">
          <Space className="w-full items-baseline">
            <Typography.Text strong style={{ display: "block", width: 140,fontSize:12 }}>
              Product name:
            </Typography.Text>
            <Typography.Text style={{ fontSize: 12 }}>{header.spname}</Typography.Text>
          </Space>
          </div>
          <div className="flex w-1/2 flex-col">
          <Space className="w-full items-baseline">
            <Typography.Text strong style={{ display: "block", width: 140,fontSize:12 }}>
              PSP No:
            </Typography.Text>
            <Typography.Text style={{ fontSize: 12 }}>{header.psp_code}</Typography.Text>
          </Space>
          </div>
        </div>
        <div className="flex">
          <div className="flex w-1/2 flex-col">
            <Space className="w-full items-baseline">
              <Typography.Text strong style={{ display: "block", width: 140 ,fontSize:12 }}>
                Product code:
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>{header.product_code}</Typography.Text>
            </Space>
            <Space className="w-full items-baseline">
              <Typography.Text strong style={{ display: "block", width: 140 ,fontSize:12 }}>
                Sample code:
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>{header.spcode}</Typography.Text>
            </Space>
          </div>
          <div className="flex w-1/2 flex-col">
            <Space className="w-full items-baseline">
              <Typography.Text strong style={{ display: "block", width: 140 ,fontSize:12 }}>
                Version:
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>{header.version}</Typography.Text>
              <Typography.Text strong style={{ fontSize:12 }}>
                / Status:
              </Typography.Text>
              {header?.sp_status && (
                <Typography.Text style={{ fontSize: 12 }}>
                  {/* {capitalizeFirst(header.sp_status)} */}
                </Typography.Text>
              )}
            </Space>
            <Space className="w-full items-baseline">
              <Typography.Text strong style={{ display: "block", width: 140 ,fontSize:12 }}>
                PSP Date:
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>
                {dayjs(header?.spdate).format("DD/MM/YYYY")}
              </Typography.Text>
            </Space>
          </div>
        </div>
        <div className="flex">
          <div className="flex w-full flex-col">
            <Space className="w-full items-baseline" >
              <Typography.Text strong style={{ display: "block", width: 140 ,fontSize:12 }}>
                Packaging type/size:
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>{header.pkname}</Typography.Text>
            </Space>
            <Space className="w-full items-baseline">
              <Typography.Text strong style={{ display: "block", width: 140 ,fontSize:12 }}>
                Product description:
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>{header.product_description}</Typography.Text>
            </Space>
            <Space className="w-full items-baseline">
              <Typography.Text strong style={{ display: "block", width: 140 ,fontSize:12 }}>
                Ingredients: <br></br>(in descending order)
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>{header.ingredients}</Typography.Text>
              {/* <Space direction="vertical"></Space> */}
            </Space>
            <Space className="w-full items-baseline">
              <Flex>
                <Typography.Text
                  strong
                  style={{ display: "block", width: 140 ,fontSize:12 }}
                >
                  Allergen information:
                </Typography.Text>
                <Typography.Text
                  style={{
                    fontSize: 12,
                    fontWeight: 400,
                    fontStyle: "italic",
                    marginLeft: 8,
                  }}
                >
                  {header.allergenic_info || " - "}
                </Typography.Text>
              </Flex>
            </Space>
            <Space className="w-full items-baseline">
              {header.allergenic && (
                <Flex vertical>
                  <Typography.Text style={{ fontSize: 12 }}>{header.allergenic}</Typography.Text>
                </Flex>
              )}
            </Space>
          </div>
        </div>
      </div>
    );
  };

  const LastData = () => {
    return (
      <div>
        <div className="flex">
          <div className="flex w-full flex-col">
            <Space className="w-full items-baseline">
              <Typography.Text strong style={{ display: "block", width: 140 ,fontSize:12 }}>
                Storage Conditions:
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>{header.storage_conditions}</Typography.Text>
            </Space>
            <Space className="w-full items-baseline">
              <Typography.Text strong style={{ display: "block", width: 140 ,fontSize:12 }}>
                Shelf life:
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>
                {header.shelf_life} {header.shelf_life_unit}
              </Typography.Text>
            </Space>
            <Space className="w-full items-baseline">
              <Typography.Text strong style={{ display: "block", fontSize: 12 }}>
                GMO Status:
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>{header.gmo_status}</Typography.Text>
            </Space>
            <Space className="w-full items-baseline">
              <Typography.Text strong style={{ display: "block", fontSize: 12 }}>
                Halal Status:
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>{header.halal_status}</Typography.Text>
            </Space>
            {/* {remark_para?.map((item, idx) => (
              <Space key={idx} className="w-full items-baseline">
                <Typography.Text style={{ display: "block", fontSize: 11 }}>
                  {item.remark_name}
                </Typography.Text>
              </Space>
            )) || <></>} */}
            {(header?.remark_print && (
              <Space className="w-full items-baseline">
                <Typography.Text
                  strong
                  style={{ display: "block", width: 140 ,fontSize:12 }}
                >
                  Remark
                </Typography.Text>
                <Typography.Text style={{ fontSize: 12 }}>{header?.remark_print}</Typography.Text>
              </Space>
            )) || <></>}
          </div>
        </div>
      </div>
    );
  };

  const BodyDataPhysical = () => {
    return (
      <div className="body-data">
        <Card
          title={
            <div>
              <Typography.Text strong className="uppercase text-white">
                Physical & Chemical Specification
              </Typography.Text>
            </div>
          }
          bordered={false}
        >
          {/* <Table
            columns={parameterColumnPrint}
            dataSource={psyItems}
            pagination={false}
            bordered={false}
            rowKey="id"
            showHeader={false}
          /> */}
        </Card>
      </div>
    );
  };

  const BodyDataMicro = () => {
    return (
      <div className="body-data">
        <Card
          title={
            <div>
              <Typography.Text strong className="uppercase text-white">
                Microbiological Specification
              </Typography.Text>
            </div>
          }
          bordered={false}
        >
          {/* <Table
            columns={parameterMicroColumnPrint}
            dataSource={micro_para}
            pagination={false}
            bordered={false}
            rowKey="id"
            showHeader={false}
          /> */}
          <span style={{ fontSize: "12px" }}>{header.micro_description}</span>
        </Card>
      </div>
    );
  };

  const BodyDataMetal = () => {
    return (
      <div className="body-data">
        <Card
          title={
            <div>
              <Typography.Text strong className="uppercase text-white">
                Heavy Metal Specification
              </Typography.Text>
            </div>
          }
          bordered={false}          
        >
          <span style={{ fontSize: "12px" }}>{metal_para}</span><br></br>
          <span style={{ fontSize: "12px" }}>{header.metal_description}</span>
          {/* <Table
            columns={parameterMetalColumnPrint}
            dataSource={metal_para}
            pagination={false}
            bordered={false}
            rowKey="id"
            showHeader={false}
          /> */}
        </Card>
      </div>
    );
  };

  const BodyDataTreatment = () => {
    return (
      <div className="body-data" style={{ margin:0, padding:0 }}>
        <Card
          title={
            <div>
              <Typography.Text strong className="uppercase text-white">
                Treatment & Processing
              </Typography.Text>
            </div>
          }
          bordered={false}
        >
          <div >
            {(() => {
              // สร้าง array ของ step object พร้อมเลขในวงกลม (CSS)
              const stepsWithCircle = parametersTreatment.map((item, idx) => ({
                ...item,
                icon: (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#1890ff",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 10,
                      marginLeft: 16,
                      marginTop: 0,
                      paddingTop: 0,
                      border: "2px solid #1890ff",
                      boxSizing: "border-box",
                    }}
                  >
                    {idx + 1}
                  </span>
                ),
                title: (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      minWidth: 40, // ลดความกว้างขั้นต่ำ
                      marginLeft: 0, // ลดช่องว่างระหว่างเลขกับข้อความ
                       marginTop: 4,
                      paddingTop: 0,
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#222",
                    }}
                  >
                    {item.title}
                  </span>
                ),
              }));
              // แบ่งเป็นแถวละ 5
              return splitSteps(
                stepsWithCircle,
                Math.ceil(stepsWithCircle.length / 2)
              ).map((row, idx) => (
                <Steps
                  key={idx}
                  type="navigation"
                  size="small"
                  current={-1}
                   className="site-navigation-steps compact"
                  items={row}
                  showArrow={false}
                  style={{
                    marginBottom: 0,
                    paddingBottom: 0,
                    marginLeft: 0,
                    marginRight: 0,
                  }}
                />
              ));
            })()}
          </div>
        </Card>
      </div>
    );
  };

  const FooterForm = () => {
    return (
      <div className="print-foot" style={{ height: 34 }}>
          <div className="print-title flex justify-start">
            <Flex className="mb-0">
              <Typography.Text className="text-sm" strong>
                This is a computer-generated document and requires no signature.
              </Typography.Text>
              
            </Flex>
          </div>
      </div>
    );
  };

  const PrintHeaderPage = () => {
    return (
      <div className="flex w-full head-page" style={{ height: 80 }}>
        <div className="print-logo">
          {/* <img src={logo} alt="" style={{ paddingInline: 6 }} /> */}
        </div>
        <div className="print-head">
          <p className="th-text" style={{ textAlign: "left", marginBottom: 2 }}>
            NINE STAR FOOD COMPANY LIMITED
          </p>
          <p className="ts-text" style={{ textAlign: "left", marginBottom: 2 }}>
            99/9 Moo 8 Tambon Kongdin Amphoe Klaeng Rayong 22160 Thailand
          </p>
          <p className="ts-text" style={{ textAlign: "left" }}>
            Tel. +66 (0)81-837-3092, +66 (0)85-367-4408
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (componentRef.current) {
      const computedStyle = window.getComputedStyle(componentRef.current);
      const heightWithUnit = computedStyle.getPropertyValue("height");

      console.log("Component height:", heightWithUnit);
    }
  }, []);

  useEffect(() => {
    const init = () => {
      // alert(version)
      // pspService.get(code).then(async (res) => {
      //   const { result } = res.data;

      //   setHeader(result[version]);
      //   setPsyItems(result[version].phy_para);
      //   setMicro_para(result[version].micro_para);
      //   // alert(result[version].metal_para);
      //   let MetalArr = [];
      //   MetalArr = result[version].metal_para.map(
      //     (item) => item.metal_name + " : " + item.limit_number
      //   );
      //   // MetalArr = [...new Set(result[version].metal_para.split(","))].map((srt) =>
      //   //   capitalizeFirst(srt)
      //   // );
      //   // alert(MetalArr);
      //   // result[version].metal_para
      //   setMetal_para(MetalArr.join(", "));

      //   setParametersTreatment(result[version].treatment_process);

      //   // console.log(result[version].parametersTreatment);
      // });
    };
    init();
  }, [code]);

  return (
    <div className="page-show" id="psp">
      <div className="title-preview">
        <Button
          className="bn-center  bg-blue-400"
          onClick={() => {
            handlePrint(null, () => handleCheckMultiPages());
          }}
          icon={<PiPrinterFill style={{ fontSize: "1.1rem" }} />}
        >
          PRINT
        </Button>
      </div>
      <div className="print-layout-page">
        {/* <PrintComponent /> */}
      </div>
      <div className="hidden">
        {/* <div ref={printRef}></div> */}
      </div>
    </div>
  );
}

export default PspPrintPreview;
