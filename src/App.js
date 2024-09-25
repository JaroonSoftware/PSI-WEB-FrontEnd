import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// === PAGE === //
import UISaleCustomerReport from "pages/sale/UISaleCustomerReport";
import UIImportReport from "pages/wr/UIImportReport";
import UIServiceLifeReport from "pages/wr/UIServiceLifeReport";
import UIReportSaleMonthly from "pages/sale/UISaleMonthlyReport";

// === WIREROD === //
import UIWireRod from "pages/wr/UIWireRod";
import UIImportInfo from "pages/wr/UIImportInfo";
import UIExportInfo from "pages/wr/UIExportInfo";
import UIStock from "pages/wr/UIStock";

// === SUMMARY === //
import UIMonthlyReport from "pages/report/UIMonthlyReport";
import UIWeeklyReport from "pages/report/UIWeeklyReport";
import UIFactoryReport from "pages/report/UIFactoryReport";
import UIQcReport from "pages/report/UIQcReport";
import UICustomerReport from "pages/report/UICustomerReport";

// === COMPONENT === //
import MainLayout from "component/layout/MainLayout";
import NotFound from "./component/404/404";

const App = () => {
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
          <Route path="customer-report" element={<UICustomerReport />} />

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
