import { Route } from "react-router-dom";

import {
  PspPrintPreview,
} from "../print";

export const PrintRouter = (
  <>
    <Route path="/webpsi/sale/daily-report-print/:product/:date1/:date2?" element={<PspPrintPreview />} />
  </>
);
