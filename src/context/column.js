import { DeleteOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import dayjs from "dayjs";

export const COLUMN = {
  WITHDRAW_VOL: (page, pageLimit, currentWidVol, handleChangeWidVol) => [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
    },
    {
      title: "เล่มที่ใบเบิก (WID VOL.)",
      dataIndex: "wid_vol",
      key: "wid_vol",
      width: "50%",
      render: (wid_vol) => (
        <span style={{ color: "#29f", fontWeight: "bold" }}>{wid_vol}</span>
      ),
    },
    {
      title: "จำนวน",
      dataIndex: "total_wid_no",
      key: "total_wid_no",
      align: "right",
      render: (total_wid_no) => total_wid_no?.toLocaleString(),
    },
    {
      title: "เลือก",
      key: "select",
      align: "center",
      render: (record) => (
        <Button
          type="primary"
          style={{
            background: currentWidVol === record?.wid_vol ? "#23a123" : "",
          }}
          icon={<RightCircleOutlined />}
          onClick={() => handleChangeWidVol(record?.wid_vol)}
        />
      ),
    },
  ],

  WITHDRAW_NO: (page, pageLimit) => [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
    },
    {
      title: "เลขที่ใบเบิก (WID NO.)",
      dataIndex: "wid_no",
      key: "wid_no",
      width: "50%",
    },
    {
      title: "วันที่เบิก",
      dataIndex: "iss_dte",
      key: "iss_dte",
      align: "center",
      render: (iss_dte) => dayjs(iss_dte).format("DD/MM/YYYY"),
    },
  ],

  EXPORT_COIL_AVAILABLE: [
    {
      title: "CHARGE NO.",
      key: "charge_no",
      dataIndex: "charge_no",
      width: "10%",
      align: "center",
      render: (charge_no) => (
        <span style={{ color: "#29f", fontWeight: "bold" }}>{charge_no}</span>
      ),
    },
    {
      title: "COIL NO.",
      key: "coil_no",
      dataIndex: "coil_no",
      width: "10%",
      align: "center",
      render: (coil_no) => coil_no,
    },
    {
      title: "LC NO.",
      dataIndex: "lc_no",
      key: "lc_no",
      align: "center",
    },
    {
      title: "SIZE",
      key: "size",
      dataIndex: "size",
      align: "center",
      render: (size) => +size,
    },
    {
      title: "GRADE",
      key: "grade",
      dataIndex: "grade",
      align: "center",
    },
    {
      title: "WEIGHT",
      key: "weight",
      dataIndex: "weight",
      align: "right",
    },
    {
      title: "TOT ACC",
      key: "tot_acc",
      dataIndex: "tot_acc",
      align: "right",
    },
    {
      title: "RCV DATE",
      key: "rcv_date",
      dataIndex: "rcv_date",
      align: "center",
      render: (rcv_date) =>
        rcv_date ? dayjs(rcv_date).format("DD/MM/YYYY") : "-",
    },
  ],

  RECIEVE_VOL: (page, pageLimit, currentRecVol, handleChangeWidVol) => [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
    },
    {
      title: "เล่มที่ใบรับ (REC VOL.)",
      dataIndex: "rec_vol",
      key: "rec_vol",
      render: (rec_vol) => (
        <span style={{ color: "#29f", fontWeight: "bold" }}>{rec_vol}</span>
      ),
    },
    {
      title: "จำนวน",
      dataIndex: "total_rec_no",
      key: "total_rec_no",
      align: "right",
      render: (total_rec_no) => total_rec_no?.toLocaleString(),
    },
    {
      title: "เลือก",
      key: "select",
      align: "center",
      render: (record) => (
        <Button
          type="primary"
          style={{
            background: currentRecVol === record?.rec_vol ? "#23a123" : "",
          }}
          icon={<RightCircleOutlined />}
          onClick={() => handleChangeWidVol(record?.rec_vol)}
        />
      ),
    },
  ],

  RECIEVE_NO: (page, pageLimit) => [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (text, record, idx) => (page - 1) * pageLimit + (idx + 1),
    },
    {
      title: "เลขที่ใบรับ (REC NO.)",
      dataIndex: "rec_no",
      key: "rec_no",
      width: "50%",
    },
    {
      title: "วันที่รับ",
      dataIndex: "rcv_date",
      key: "rcv_date",
      align: "center",
      render: (rcv_date) => dayjs(rcv_date).format("DD/MM/YYYY"),
    },
  ],

  CUSTOMER: [
    {
      title: "รหัสลูกค้า",
      dataIndex: "cusno",
      key: "cusno",
      width: "10%",
      align: "center",
    },
    {
      title: "ตัวย่อ",
      dataIndex: "ali",
      key: "ali",
      align: "center",
    },
    {
      title: "ชื่อลูกค้า",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let obj =
          status === "Y"
            ? { title: "Active", color: "green" }
            : { title: "Inactive", color: "red" };
        return <Tag color={obj?.color}>{obj?.title}</Tag>;
      },
    },
  ],

  TRANSPORT: [
    {
      title: "รหัส",
      dataIndex: "trncode",
      key: "trncode",
      width: "10%",
      align: "center",
    },
    {
      title: "ชื่อบริษัทขนส่ง",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let obj =
          status === "Y"
            ? { title: "Active", color: "green" }
            : { title: "Inactive", color: "red" };
        return <Tag color={obj.color}>{obj.title}</Tag>;
      },
    },
  ],

  SELLER: [
    {
      title: "รหัส",
      dataIndex: "saleno",
      key: "saleno",
      width: "10%",
      align: "center",
    },
    {
      title: "ชื่อ-นามสกุล",
      key: "namesale",
      render: ({ namesale, lastname }) => {
        let name = `${namesale} ${lastname ? lastname : ""}`;
        return name;
      },
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let obj =
          status === "Y"
            ? { title: "Active", color: "green" }
            : { title: "Inactive", color: "red" };
        return <Tag color={obj.color}>{obj.title}</Tag>;
      },
    },
  ],

  VENDOR: [
    {
      title: "รหัสคู่ค้า",
      dataIndex: "code",
      key: "code",
      width: "10%",
      align: "center",
    },
    {
      title: "ชื่อคู่ค้า",
      dataIndex: "ven_name",
      key: "ven_name",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "เบอร์ Fax",
      dataIndex: "fax",
      key: "tel",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let obj =
          status === "Y"
            ? { title: "Active", color: "green" }
            : { title: "Inactive", color: "red" };
        return <Tag color={obj.color}>{obj.title}</Tag>;
      },
    },
  ],

  PRODUCT: ({ page, pageLimit, handleDeleteProduct }) => [
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
      key: "pass",
      dataIndex: "pass",
      align: "center",
      render: (pass) => {
        let obj =
          pass === "Y"
            ? { title: "Pass", color: "green" }
            : { title: "Waiting", color: "#eb9e19" };
        return <Tag color={obj?.color}>{obj?.title}</Tag>;
      },
    },
    {
      title: "ACTION",
      dataIndex: "tool",
      key: "tool",
      align: "center",
      render: (_, record) =>
        record?.pass === "Y" ? (
          <Button
            className="less-padding"
            type="primary"
            danger
            icon={<DeleteOutlined />}
            disabled={true}
          />
        ) : (
          <Button
            className="less-padding"
            type="primary"
            danger
            onClick={(event) => handleDeleteProduct(event, record)}
            icon={<DeleteOutlined />}
          />
        ),
    },
  ],

  PRODUCT_DAILY_REPORT: [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "5%",
      render: (text, record, idx) => (record?.key ? "รวม" : idx + 1),
    },
    {
      title: "รหัสสินค้า",
      dataIndex: "code",
      key: "code",
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
    },
    {
      title: "Charge No.",
      dataIndex: "charge",
      key: "charge",
      align: "center",
    },
    {
      title: "Coil No.",
      dataIndex: "coilno",
      key: "coilno",
      align: "center",
    },
    {
      title: "กะ",
      dataIndex: "shift",
      key: "shift",
      align: "center",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (weight) => weight?.toLocaleString(),
    },
  ],

  PRODUCT_LOCATION_REPORT: [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "5%",
      render: (text, record, idx) => (record?.key ? "รวม" : idx + 1),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
    },
    {
      title: "Charge No.",
      dataIndex: "charge",
      key: "charge",
      align: "center",
    },
    {
      title: "Coil No.",
      dataIndex: "coilno",
      key: "coilno",
      align: "center",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (weight) => weight?.toLocaleString(),
    },
    {
      title: "วันที่ผลิด",
      dataIndex: "pdate",
      key: "pdate",
      align: "center",
      render: (pdate, record) =>
        !record?.key && dayjs(pdate).format("DD/MM/YYYY"),
    },
    {
      title: "Diam",
      dataIndex: "diam",
      key: "diam",
      align: "center",
    },
    {
      title: "Tensile",
      dataIndex: "tensile",
      key: "tensile",
      align: "center",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      align: "center",
    },
    {
      title: "Spec",
      key: "spec",
      align: "center",
      render: (record) => !record?.key && "ลวดดี",
    },
    {
      title: "Straight",
      dataIndex: "straight",
      key: "straight",
      align: "center",
    },
  ],

  WIREROD_EXPORT_REPORT: [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      width: "5%",
      render: (text, record, idx) => (record?.key ? "รวม" : idx + 1),
    },
    {
      title: "วันที่เบิก",
      dataIndex: "iss_dte",
      key: "iss_dte",
      align: "center",
      render: (iss_dte, record) =>
        !record?.key && dayjs(iss_dte).format("DD/MM/YYYY"),
    },
    {
      title: "เล่มที่-เลขที่",
      key: "wid",
      align: "center",
      render: (record) =>
        !record?.key && record?.wid_vol + "-" + record?.wid_no,
    },
    {
      title: "Charge No.",
      dataIndex: "charge_no",
      key: "chargeNo",
      align: "center",
    },
    {
      title: "Coil No.",
      dataIndex: "coil_no",
      key: "coilNo",
      align: "center",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      align: "center",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      align: "center",
    },
    {
      title: "LC No.",
      dataIndex: "lc_no",
      key: "lcNo",
      align: "center",
    },
    {
      title: "น้ำหนัก LC",
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (weight) => weight?.toLocaleString(),
    },
    {
      title: "น้ำหนักจริง",
      dataIndex: "lweight",
      key: "lweight",
      align: "center",
      render: (lweight) => lweight?.toLocaleString(),
    },
  ],

  WIREROD_IMPORT_REPORT: [
    {
      title: "รหัสสินค้า",
      dataIndex: "product_code",
      key: "productCode",
      align: "center",
      render: (productCode, record) =>
        record?.key ? <b>{record?.procode}</b> : productCode,
    },
    {
      title: <div style={{ textAlign: "center" }}>Size</div>,
      dataIndex: "size",
      key: "size",
      render: (productCode, record) => {
        if (record?.key)
          return {
            children: <b>{record?.sumVendorName}</b>,
            props: {
              colSpan: 4,
              align: "left",
            },
          };
        else {
          return {
            children: productCode,
            props: {
              colSpan: 1,
              align: "center",
            },
          };
        }
      },
    },
    {
      title: "LC No.",
      dataIndex: "lc_no",
      key: "lcNo",
      align: "center",
      render: (lcNo, record) => {
        if (record?.key)
          return {
            props: {
              colSpan: 0,
            },
          };
        else {
          return lcNo;
        }
      },
    },
    {
      title: "Charge No.",
      dataIndex: "charge_no",
      key: "chargeNo",
      align: "center",
      render: (chargeNo, record) => {
        if (record?.key)
          return {
            props: {
              colSpan: 0,
            },
          };
        else {
          return chargeNo;
        }
      },
    },
    {
      title: "Avg Weight / Last Weight",
      key: "avgWeight",
      align: "center",
      render: (record) => {
        if (record?.key)
          return {
            props: {
              colSpan: 0,
            },
          };
        else {
          return (
            record?.key !== "sumDate" &&
            record?.key !== "sumVendor" &&
            record?.avg_weight?.toLocaleString() +
              " / " +
              record?.last_weight?.toLocaleString()
          );
        }
      },
    },
    {
      title: "Coil Qty",
      dataIndex: "coil_qty",
      key: "coilQty",
      align: "center",
      render: (coilQty, record) =>
        record?.key ? <b>{record?.sumTotalCoil}</b> : coilQty,
    },
    {
      title: "LC Weight",
      dataIndex: "total_weight",
      key: "totalWeight",
      align: "center",
      render: (tot_weight, record) =>
        record?.key ? (
          <b>{tot_weight?.toLocaleString()}</b>
        ) : (
          tot_weight?.toLocaleString()
        ),
    },
  ],

  PRODUCT_PREPARING_LIST: [
    {
      title: "#",
      key: "index",
      align: "center",
      width: "5%",
      render: (text, record, idx) => (record?.key ? "รวม" : idx + 1),
    },
    {
      title: "CODE",
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (code) => code && <Tag color="red">{code}</Tag>,
    },
    {
      title: "CHARGE NO.",
      dataIndex: "charge",
      key: "charge",
      align: "center",
    },
    {
      title: "COIL NO.",
      dataIndex: "coilno",
      key: "coilno",
      align: "center",
    },
    {
      title: "DATE",
      dataIndex: "pdate",
      key: "pdate",
      align: "center",
      render: (pdate) => pdate && dayjs(pdate).format("DD/MM/YYYY"),
    },
    {
      title: "WEIGHT",
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (weight) => (+weight).toLocaleString(),
    },
    {
      title: "GRADE",
      dataIndex: "grade",
      key: "grade",
      align: "center",
    },
    {
      title: "LOCATION",
      dataIndex: "location",
      key: "location",
      align: "center",
    },
  ],
};
