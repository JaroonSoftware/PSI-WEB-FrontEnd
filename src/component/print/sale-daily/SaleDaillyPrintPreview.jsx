import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import logo from "../../../assets/image/logopsi.jpg";
import "./sale-daily.css";

import dayjs from "dayjs";
import { accessColumn } from "./model";

// import ProductSpecificationService from "../../../service/ProductSpecification.service";
import RwiService from "../../../services/RwiService";
import { Button, Card, Space, Table, Typography, Steps, Flex } from "antd";
import { PiPrinterFill } from "react-icons/pi";
// import { capitalizeFirst } from "../../../utils/utils";
// const pspService = ProductSpecificationService();
function SaleDaillyPrintPreview() {
  const { product, date1, date2 } = useParams();
  const componentRef = useRef(null);
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Print This Document",
    onBeforePrint: () => {
      handleBeforePrint();
      handleCheckMultiPages();
    },
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const [header, setHeader] = useState({});
  const [data, setData] = useState([]);

  const handleBeforePrint = (e) => {
    // const newElement = document.createElement('div');
    // newElement.id = 'new-container'; // Optional: Set an ID for the new container
    // newElement.innerHTML = 'TEST';
    // Render the new component into the new container
    // Replace the old container with the new container
    // componentRef.current.innerHTML = 'TEST';
  };

  const handleCheckMultiPages = () => {
    const limitPage = 930;

    const head = document.getElementById("form-head");
    // const step = document.getElementById("form-body-step");
    const parm = document.getElementById("form-body-main");

    // const othr = document.getElementById("form-body-other");

    const getHeight = (el) =>
      el
        ? Number(
            window
              .getComputedStyle(el)
              .getPropertyValue("height")
              ?.replace("px", ""),
          )
        : 0;

    let headHieght = getHeight(head);
    // let stepHieght = Number(
    //   window
    //     .getComputedStyle(step)
    //     .getPropertyValue("height")
    //     ?.replace("px", "")
    // );
    let parmHieght = getHeight(parm);

    // let othrHieght = Number(window.getComputedStyle(othr).getPropertyValue('height')?.replace("px", ""));
    // console.log( {headHieght, stepHieght, parmHieght, othrHieght} );
    if (headHieght + parmHieght > limitPage) {
      if (parm) parm.style.pageBreakBefore = "always";
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
      <div className="sale-daily-page-form" ref={componentRef}>
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
            <tr id="form-body-main">
              <td>
                <BodyDataMain />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const HeaderData = () => {
    return (
      <div className="head-data" style={{ marginBottom: 0, paddingBottom: 0 }}>
        <div
          className="text-center"
          style={{ marginBottom: 0, paddingBottom: 0 }}
        >
          <Typography.Title level={5} className="uppercase mb-0.5">
            ข้อมูลการขายของ PCW ประจำวันที่ 06/01/2568 ถึง 06/02/2568
          </Typography.Title>
        </div>        
      </div>
    );
  };

  const BodyDataMain = () => {
    return (
      <div className="body-data">
          <Table
            size="small"
            bordered
            rowKey="seq"
            rowClassName={(record) => (record?.isGrand ? 'grand-row' : (record?.sum_amount !== undefined ? 'sum-row' : ''))}
            columns={accessColumn}
            dataSource={data}
            scroll={{ x: "max-content" }}
            pagination={false}
          />
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
      <div className="head-page">
        <div className="print-logo">
          <img src={logo} alt="Company logo" />
        </div>
        <div className="print-head">
          <p className="th-text">
            PENSIRI STEEL INDUSTRIES CO.,LTD
          </p>
          <p className="ts-text">
            154/23 หมู่ 2 ตำบล บึง อำเภอ ศรีราชา จังหวัด ชลบุรี รหัสไปรษณีย์ 20230
          </p>
          <p className="ts-text">
            Tel. 038-064-613 -614 Fax.038-064-567
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
      let reqData = {
        pdCodeQuery: product,
        dateQuery: [date1, date2],
      };

      RwiService.getSaleDaily(reqData)
        .then(({ data }) => {
          const { items } = data;

          // Group by sale date (gdsdate) and compute daily totals
          const byDate = {};
          let grandWeight = 0;
          let grandAmount = 0;
          items.forEach((item, idx) => {
            const dkey = item.gdsdate;
            if (!byDate[dkey]) {
              byDate[dkey] = {
                rows: [],
                totalWeight: 0,
                totalAmount: 0,
              };
            }
            const weight = Number(item?.tot_unt) || 0;
            const amount = weight * (Number(item?.u_price) || 0);
            byDate[dkey].rows.push({
              index: idx,
              key: (item.lc_no || "") + "@" + (item.charge_no || idx),
              ...item,
            });
            byDate[dkey].totalWeight += weight;
            byDate[dkey].totalAmount += Number.isFinite(amount) ? amount : 0;
            grandWeight += weight;
            grandAmount += Number.isFinite(amount) ? amount : 0;
          });

          // Flatten into array with a summary row after each date, then grand total
          const orderedDates = Object.keys(byDate);
          const arrayItem = [];
          orderedDates.forEach((dk) => {
            arrayItem.push(...byDate[dk].rows);
            arrayItem.push({
              key: dk + "#SUM",
              gdsdate: dk,
              tot_unt: byDate[dk].totalWeight,
              sum_amount: byDate[dk].totalAmount,
            });
          });

          // Grand total row
          arrayItem.push({
            key: "#GRAND_SUM",
            isGrand: true,
            tot_unt: grandWeight,
            sum_amount: grandAmount,
          });

          setData(arrayItem);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    init();
  }, [product]);

  return (
    <div className="page-show" id="sale-daily">
      <div className="title-preview">
        <Button
          className="bn-center  bg-blue-400"
          onClick={handlePrint}
          icon={<PiPrinterFill style={{ fontSize: "1.1rem" }} />}
        >
          PRINT
        </Button>
      </div>
      <div className="print-layout-page"><PrintComponent /></div>
      <div className="hidden"><div ref={printRef}></div></div>
    </div>
  );
}

export default SaleDaillyPrintPreview;
