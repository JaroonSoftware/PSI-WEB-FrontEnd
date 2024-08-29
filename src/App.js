import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// === PAGE === //
import UIWireRod from "pages/wr/UIWireRod";
import UISaleCustomerReport from "pages/sale/UISaleCustomerReport";
import UIImportInfo from "pages/wr/UIImportInfo";
import UIExportInfo from "pages/wr/UIExportInfo";
import UIStock from "pages/wr/UIStock";
import UIImportReport from "pages/wr/UIImportReport";
import UIServiceLifeReport from "pages/wr/UIServiceLifeReport";
import UIReportSaleMonthly from "pages/sale/UISaleMonthlyReport";
import UIMonthlyReport from "pages/report/UIMonthlyReport";
import UIWeeklyReport from "pages/report/UIWeeklyReport";
import UIFactoryReport from "pages/report/UIFactoryReport";

// === COMPONENT === //
import MainLayout from "component/layout/MainLayout";
import NotFound from "./component/404/404";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/psi" element={<Navigate to="/psi/wirerod" />} />
        <Route path="/psi" element={<MainLayout />}>
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
          <Route path="qc-report" element={<UIMonthlyReport />} />

          <Route path="sale/report-monthly" element={<UIReportSaleMonthly />} />
          <Route
            path="sale/report-customer"
            element={<UISaleCustomerReport />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
