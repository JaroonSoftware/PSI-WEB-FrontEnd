import React from "react";
import { Table, Row, Col } from "antd";
import logo from "assets/image/psi.jpg";

const DocRemainingStock = React.forwardRef(({ printData, columns }, ref) => {
    return (
        <div ref={ref}>
            <Row>
                <Col flex="120px" style={{ textAlign: "center" }}>
                    <img src={logo} style={{ width: "80px" }} />
                </Col>
                <Col
                    flex="auto"
                    style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        alignSelf: "center",
                        color: "black"
                    }}
                >
                    PENSIRI STEEL INDUSTRIES CO., LTD.
                </Col>
            </Row>
            <Row>
                <Col xs={24} style={{
                    fontSize: "22px",
                    textAlign: "center",
                    color: "black",
                    marginTop: "10px"
                }}>
                    รายงานสต็อกคงเหลือประจำวันที่
                </Col>
            </Row>
            <div className="print-table" >
                <Table
                    dataSource={printData}
                    columns={columns}
                    pagination={false}
                    size="small"
                    bordered
                    summary={(pageData) => {
                        let totalQuantity = 0;
                        let totalWeight = 0;
                        let totalRemaining = 0;
                        pageData.forEach(({ quantity, total_weight, remaining }) => {
                            totalQuantity += quantity;
                            totalWeight += total_weight;
                            totalRemaining += remaining;
                        });
                        return (
                            <Table.Summary.Row align="center" style={{ backgroundColor: "#fafafa" }}>
                                <Table.Summary.Cell index={0}>
                                    <b>สุทธิ</b>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} colSpan={6}></Table.Summary.Cell>
                                <Table.Summary.Cell index={2} colSpan={1}>
                                    <b>{totalQuantity?.toLocaleString()}</b>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3} colSpan={1}>
                                    <b>{totalRemaining?.toLocaleString()}</b>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={4} colSpan={1}>
                                    <b>{totalWeight?.toLocaleString()}</b>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        );
                    }}
                />
            </div>
        </div>
    );
});

export default DocRemainingStock;
