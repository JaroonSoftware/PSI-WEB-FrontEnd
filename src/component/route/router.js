
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// === PAGE === //
import UIImportReport from "../../pages/wr/UIImportReport";
import UIServiceLifeReport from "../../pages/wr/UIServiceLifeReport";
import UIReportSaleMonthly from "../../pages/sale/UISaleMonthlyReport";

// === WIREROD === //
import UIWireRod from "../../pages/wr/UIWireRod";
import UIImportInfo from "../../pages/wr/UIImportInfo";
import UIExportInfo from "../../pages/wr/UIExportInfo";
import UIStock from "../../pages/wr/UIStock";

// === SUMMARY === //
import UIMonthlyReport from "../../pages/report/UIMonthlyReport";
import UIWeeklyReport from "../../pages/report/UIWeeklyReport";
import UIFactoryReport from "../../pages/report/UIFactoryReport";
import UIQcReport from "../../pages/report/UIQcReport";
import UICustomerReport from "../../pages/sale/UICustomerReport";

// === COMPONENT === //
import MainLayout from "../../component/layout/MainLayout";
import NotFound from "../../component/404/404";

import { PrintRouter } from "./print.route";

import { UISaleDaily, UISaleDailyAccess } from "../../pages/sale/sale-daily";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/webpsi" element={<Navigate to="/webpsi/wirerod" />} />
        <Route path="/webpsi" element={<MainLayout />}>
          <Route path="wirerod" element={<UIWireRod />} />
          <Route path="wirerod/import" element={<UIImportInfo />} />
          <Route path="wirerod/export" element={<UIExportInfo />} />
          <Route path="wirerod/stock" element={<UIStock />} />
          <Route path="wirerod/import-report" element={<UIImportReport />} />
          <Route
            path="wirerod/life-time-report"
            element={<UIServiceLifeReport />}
          />

          <Route path="factory-report" element={<UIFactoryReport />} />
          <Route path="weekly-report" element={<UIWeeklyReport />} />
          <Route path="monthly-report" element={<UIMonthlyReport />} />
          <Route path="yearly-report" element={<UIMonthlyReport />} />
          <Route path="qc-report" element={<UIQcReport />} />
          <Route path="sale/report-monthly" element={<UIReportSaleMonthly />} />
          <Route path="sale/customer-report" element={<UICustomerReport />} />
          <Route path="sale/daily-report" element={<UISaleDaily />}>
            <Route index element={<UISaleDailyAccess />} />
          </Route>
        </Route>
          {PrintRouter}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

