import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          padding: "5rem 23% 5rem 23%",
          // minHeight: "575px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center", height: "300px" }}>
          <div>
            <span
              style={{
                color: "#da2a35",
                fontSize: "68px",
                fontWeight: "bold",
              }}
            >
              404
            </span>
          </div>
          <span
            style={{ color: "#da2a35", fontSize: "28px", fontWeight: "bold" }}
          >
           PSI Page Not Found
          </span>
          <div style={{ marginTop: "1.5rem" }}>
            <Button
              type="primary"
              style={{
                fontWeight: "bold",
                backgroundColor: "#da2a35",
                borderColor: "#da2a35",
                color: "white",
                marginTop: "0.75rem",
              }}
              onClick={() => navigate(-1)}
            >
              Please, Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
