import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  // GET_STOCK: `${API_URL}/rwi/get-stock`,
  GET_FACTORYREPORT: `${API_URL}/report/report-fg`,
};

const ReportService = {
  FactoryReport: (dateQuery) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_FACTORYREPORT,      
      data: dateQuery,
    });
  },
};

export default ReportService;
