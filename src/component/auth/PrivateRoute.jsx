import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "context/auth/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f6f8",
        }}
      >
        <Spin size="large" tip="กำลังตรวจสอบสิทธิ์..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/webpsi/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
