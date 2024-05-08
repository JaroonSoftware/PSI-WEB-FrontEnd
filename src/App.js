import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// === PAGE === //
import UIProduct from "pages/product/UIProduct";
import UIQc from "pages/qc/UIQc";
import UISaleOrder from "pages/sale/UISaleOrder";
import UIWrExport from "pages/wr/UIWrExport";
import UIPrint from "pages/UIPrint";

// === COMPONENT === //
import MainLayout from "component/layout/MainLayout";
import NotFound from "./component/404/404";
import UISetting from "pages/UISetting";
import UIInvoice from "pages/sale/UIInvoice";
import UITaxInvoice from "pages/account/UITaxInvoice";

import UIWrImport from "pages/wr/UIImport";
// import UIWrImportDeprecated from "./pages/wr/UIWrImportDeprecated";   // SHOW BY REC.VOL AND REC.NO
// import UIWrImportTemp from "pages/wr/UIWrImportTemp";                 // SHOW BY LC NO.

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/psi/product" />} />
        <Route path="/psi" element={<MainLayout />}>
          <Route path="product" element={<UIProduct />} />
          <Route path="qc" element={<UIQc />} />
          <Route path="sale-order" element={<UISaleOrder />} />
          <Route path="invoice" element={<UIInvoice />} />
          <Route path="tax-invoice" element={<UITaxInvoice />} />
          <Route path="wr/import" element={<UIWrImport />} />
          <Route path="wr/export" element={<UIWrExport />} />
          <Route path="wr/print" element={<UIPrint />} />
          <Route path="setting" element={<UISetting />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
