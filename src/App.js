import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// === PAGE === //
import UIQc from "pages/qc/UIQc";
import UIWrExport from "pages/wr/UIWrExport";
import UIPrint from "pages/UIPrint";

// === COMPONENT === //
import MainLayout from "component/layout/MainLayout";
import NotFound from "./component/404/404";

import UIWrImport from "pages/wr/UIImport";
import UIWireRod from "pages/wr/UIWireRod";
// import UIWrImportDeprecated from "./pages/wr/UIWrImportDeprecated";   // SHOW BY REC.VOL AND REC.NO
// import UIWrImportTemp from "pages/wr/UIWrImportTemp";                 // SHOW BY LC NO.

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/psi/product" />} />
        <Route path="/psi" element={<MainLayout />}>
          <Route path="wirerod" element={<UIWireRod />} />
          <Route path="qc" element={<UIQc />} />
          <Route path="sale-order" element={() => {}} />
          <Route path="invoice" element={() => {}} />
          <Route path="tax-invoice" element={() => {}} />
          <Route path="wr/import" element={<UIWrImport />} />
          <Route path="wr/export" element={<UIWrExport />} />
          <Route path="wr/print" element={<UIPrint />} />
          <Route path="setting" element={() => {}} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
