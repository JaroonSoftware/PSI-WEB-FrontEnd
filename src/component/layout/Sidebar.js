import React, { useState, useEffect } from "react";
import { Menu, Layout } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { nav } from "../../nav";

const { Sider } = Layout;

const NavBar = ({ collapsed }) => {
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="navbar-container">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="sm"
        collapsedWidth={screenWidth < 500 ? 0 : 80}
      >
        <h1
          style={{
            textAlign: "center",
            margin: "0",
            padding: "10px 10px",
            backgroundColor: "#0fa0d5",
            fontSize: "22px",
            color: "white",
          }}
        >
          PSI (Report)
        </h1>
        <Menu className="navbar-custom">
          <div
            style={{
              minHeight: "120px",
              padding: "20px 40px",
              marginBottom: "10px",
              display: !collapsed ? "block" : "none",
              backgroundColor: "#f3f3f3",
            }}
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/014/429/580/original/man-avatar-icon-flat-vector.jpg"
              width="100%"
              height="auto"
              style={{ borderRadius: "12px" }}
            />

            <div style={{ marginTop: "25px", textAlign: "center" }}>
              <span
                style={{
                  color: "#3a3f4e",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Chayapat Niropas
              </span>
            </div>
            <div style={{ marginTop: "25px", textAlign: "center" }}>
              <span
                style={{
                  color: "#0fa0d5",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                system admin
              </span>
            </div>
          </div>

          {collapsed && (
            <div style={{ padding: "14px", backgroundColor: "#f3f3f3" }}>
              <img
                src="https://static.vecteezy.com/system/resources/previews/014/429/580/original/man-avatar-icon-flat-vector.jpg"
                width="100%"
                height="auto"
                style={{ borderRadius: "12px" }}
              />
            </div>
          )}

          {nav.map((item) => {
            if (item.type === "sub") {
              return (
                <>
                  {collapsed ? (
                    <div style={{ margin: "1.25rem 0rem" }} />
                  ) : (
                    <Menu.Item key={item.key} className="nav-sub">
                      {item.label}
                    </Menu.Item>
                  )}
                </>
              );
            } else {
              return item.path === location.pathname ? (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  className="ant-menu-item-selected"
                >
                  <NavLink to={item.path}>{item.label}</NavLink>
                </Menu.Item>
              ) : (
                <Menu.Item key={item.key} icon={item.icon}>
                  <NavLink to={item.path}>{item.label}</NavLink>
                </Menu.Item>
              );
            }
          })}
        </Menu>
      </Sider>
    </div>
  );
};

export default NavBar;
