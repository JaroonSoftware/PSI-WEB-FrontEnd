import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  // GET_STOCK: `${API_URL}/rwi/get-stock`,
  GET_FACTORYREPORT: `${API_URL}/report/report-fg`,
  GET_MONTHLY_FINISH_BY_SIZE: `${API_URL}/report/monthly-finish-by-size`,
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
};

export default ReportService;
