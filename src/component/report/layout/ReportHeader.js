import { Row, Col } from "antd";
import logo from "assets/image/psi.jpg";

const ReportHeader = () => {
  return (
    <Row>
      <Col flex="80px">
        <img src={logo} style={{ width: "70px" }} />
      </Col>
      <Col
        flex="auto"
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          alignSelf: "center",
        }}
      >
        PENSIRI STREEL INDUSTRIES CO.,LTD.
      </Col>
    </Row>
  );
};

export default ReportHeader;
