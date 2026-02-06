import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  GET_SALE_DAILY: `${API_URL}/rwi/get-sale-daily`,
  GET_STOCK: `${API_URL}/rwi/get-stock`,
  GET_IMPORT_WIREROD: `${API_URL}/rwi/get-import`,
  GET_VENDOR: `${API_URL}/setting/vendor?getAll=${true}`,
  GET_QC_REPORT: `${API_URL}/rwi/qc-report`,
  GET_CUSTOMER_REPORT: `${API_URL}/rwi/product/export`,
};

const RwiService = {
  getSaleDaily: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_SALE_DAILY,
      data: reqData,
    });
  },

  getStock: (dateQuery) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_STOCK,
      data: { dateQuery },
    });
  },

  getImportWireRod: (data) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_IMPORT_WIREROD,
      data,
    });
  },

  getVendor: (dateQuery) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_VENDOR,
      data: dateQuery,
    });
  },

  getQcReport: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_QC_REPORT,
      data: reqData,
    });
  },
  getCustomerReport: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_CUSTOMER_REPORT,
      data: reqData,
    });
  },
};

export default RwiService;
