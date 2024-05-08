import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/reset.css";
import "./assets/css/styles.scss";
import "./assets/css/index.css";
import { ConfigProvider } from "antd";
import locale from "antd/locale/th_TH";
// import buddhistEra from "dayjs/plugin/buddhistEra";
// import dayjs from "dayjs";
// dayjs.extend(buddhistEra);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ConfigProvider locale={locale}>
    <App />
  </ConfigProvider>
);

reportWebVitals();
