import { Route } from "react-router-dom";

import {
  PspPrintPreview,
  MonthlyFinishPrintPreview,
  StockCardPrintPreview,
  PendingReportPrintPreview,
  CustomerSalesPrintPreview,
  CustomerReportCustomerPrintPreview,
  CustomerReportSizePrintPreview,
} from "../print";

export const PrintRouter = (
  <>
    <Route path="/webpsi/sale/daily-report-print/:product/:date1/:date2?" element={<PspPrintPreview />} />
    <Route path="/webpsi/monthly/finish-product-print/:year" element={<MonthlyFinishPrintPreview />} />
    <Route path="/webpsi/stockcard-report-print/:product/:date1/:date2?" element={<StockCardPrintPreview />} />
    <Route path="/webpsi/pending-report-print/:status/:date1/:date2?" element={<PendingReportPrintPreview />} />
    <Route path="/webpsi/sale/customer-report-sales-print/:product/:date1/:date2?" element={<CustomerSalesPrintPreview />} />
    <Route path="/webpsi/sale/customer-report-customer-print/:product/:date1/:date2?" element={<CustomerReportCustomerPrintPreview />} />
    <Route path="/webpsi/sale/customer-report-size-print/:product/:date1/:date2?" element={<CustomerReportSizePrintPreview />} />
  </>
);
