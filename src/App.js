import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// === PAGE === //
import UIPrint from "pages/UIPrint";

// === COMPONENT === //
import MainLayout from "component/layout/MainLayout";
import NotFound from "./component/404/404";

import UIWireRod from "pages/wr/UIWireRod";
import UIReportCustomer from "pages/sale/UIReportCustomer";
import UIIncomeInfo from "pages/wr/UIIncomeInfo";
import UIExpenseInfo from "pages/wr/UIExpenseInfo";
import UIStock from "pages/wr/UIStock";
import UIIncomeReport from "pages/wr/UIIncomeReport";
import UIServiceLifeReport from "pages/wr/UIServiceLifeReport";
// import UIWrImportDeprecated from "./pages/wr/UIWrImportDeprecated";   // SHOW BY REC.VOL AND REC.NO
// import UIWrImportTemp from "pages/wr/UIWrImportTemp";                 // SHOW BY LC NO.

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/psi/wirerod" />} />
        <Route path="/psi" element={<MainLayout />}>
          <Route path="wirerod" element={<UIWireRod />} />
          <Route path="income" element={<UIIncomeInfo />} />
          <Route path="expense" element={<UIExpenseInfo />} />
          <Route path="stock" element={<UIStock />} />
          <Route path="income-report" element={<UIIncomeReport />} />
          <Route path="service-life" element={<UIServiceLifeReport />} />
          <Route path="wr/print" element={<UIPrint />} />
          <Route path="sale/report-customer" element={<UIReportCustomer />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
