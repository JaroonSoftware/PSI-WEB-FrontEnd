import React from "react";
import { Table, Card } from "antd";

const UIWeeklyReport = () => {
  const dataSource = [
    {
      key: "1",
      charge_no: "Test",
      coil_no: "1",
      product: "2",
      weight: "3",
      diameter: "4",
      area: "5",
      yield_load: "6",
      yield_str: "7",
      tens_load: "8",
      tens_str: "9",
      reduction_area: "10",
      reverse_bonding: "11",
      indent_dept: "12",
      elong: "13",
      strain: "14",
      u_weight: "15",
      grade: "16",
      detail: "17",
      spec_o: "18",
      test_o: "19",
      day: "20",
    },
  ];

  const columns = [
    {
      title: "Charge No.",
      dataIndex: "charge_no",
      key: "charge_no",
    },
    {
      title: "Coil No.",
      dataIndex: "coil_no",
      key: "coil_no",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Diameter",
      dataIndex: "diameter",
      key: "diameter",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Tensile Load",
      dataIndex: "tens_load",
      key: "tens_load",
    },
    {
      title: "Tensile Strength",
      dataIndex: "tens_str",
      key: "tens_str",
    },
    {
      title: "Yield Load",
      dataIndex: "yield_load",
      key: "yield_load",
    },
    {
      title: "Yield Strength",
      dataIndex: "yield_str",
      key: "yield_str",
    },
    {
      title: "Reduction Area",
      dataIndex: "reduction_area",
      key: "reduction_area",
    },
    {
      title: "Reverse Bonding",
      dataIndex: "reverse_bonding",
      key: "reverse_bonding",
    },
    {
      title: "Indent Dept",
      dataIndex: "indent_dept",
      key: "indent_dept",
    },
    {
      title: "Elong",
      dataIndex: "elong",
      key: "elong",
    },
    {
      title: "Strain",
      dataIndex: "strain",
      key: "strain",
    },
    {
      title: "Unit Weight",
      dataIndex: "u_weight",
      key: "u_weight",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "ลักษณะลวด",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "Spec เก่า",
      dataIndex: "spec_o",
      key: "spec_o",
    },
    {
      title: "วันที่ test เก่า",
      dataIndex: "test_o",
      key: "test_o",
    },
    {
      title: "ระยะเวลา (วัน)",
      dataIndex: "day",
      key: "day",
    },
  ];
  return (
    <>
      <Card className="card-dashboard">
        <div>
          <h1 style={{ fontSize: "18px" }}>Weekly - Report</h1>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          style={{ marginTop: "1rem" }}
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
        />
        ;
      </Card>
    </>
  );
};
export default UIWeeklyReport;
