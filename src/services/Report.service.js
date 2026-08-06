import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  // GET_STOCK: `${API_URL}/rwi/get-stock`,
  GET_FACTORYREPORT: `${API_URL}/report/report-fg`,
  GET_MONTHLY_FINISH_BY_SIZE: `${API_URL}/report/monthly-finish-by-size`,
  GET_DELIVERY_REMAINING_BY_PO: `${API_URL}/report/delivery-remaining-by-po`,
  GET_FREIGHT_SUMMARY: `${API_URL}/report/freight-summary`,
  GET_CUSTOMER_YEARLY_SALES: `${API_URL}/report/customer-yearly-sales`,
};

const ReportService = {
  FactoryReport: (dateQuery) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_FACTORYREPORT,      
      data: dateQuery,
    });
  },

  MonthlyFinishBySize: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_MONTHLY_FINISH_BY_SIZE,
      data: reqData,
    });
  },

  DeliveryRemainingByPO: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_DELIVERY_REMAINING_BY_PO,
      data: reqData,
    });
  },

  FreightSummary: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_FREIGHT_SUMMARY,
      data: reqData,
    });
  },

  CustomerYearlySales: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_CUSTOMER_YEARLY_SALES,
      data: reqData,
    });
  },
};

export default ReportService;
