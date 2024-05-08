import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  DEFAULT_PRODUCT: `${API_URL}/product`,
  GET_PRODUCT: ({ page, pageLimit, query, qcStatus }) =>
    `${API_URL}/product?page=${page}&limit=${pageLimit}&query=${query}&status=${qcStatus}`,
  GET_QC_PRODUCT: ({ page, pageLimit, query, timeQuery, qcStatus }) =>
    `${API_URL}/product/qc?page=${page}&limit=${pageLimit}&query=${query}&timeQuery=${timeQuery}&status=${qcStatus}`,
  DELETE_PRODUCT: (proCode) => `${API_URL}/product?procode=${proCode}`,
  UPDATE_QC_PRODUCT: `${API_URL}/product/qc`,
  GET_REPORT: `${API_URL}/product/report`,
  GET_PRODUCT_READY_TO_SELL: ({ page, pageLimit, query, productCode }) =>
    `${API_URL}/product/ready2sell?page=${page}&limit=${pageLimit}&query=${query}&code=${productCode}`,
  GET_QC_GROUP: (pDate) => `${API_URL}/product/qc-group?pDate=${pDate}`,
};

const ProductService = {
  // ====== Product ====== //
  getProduct: (pagination) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_PRODUCT(pagination),
    });
  },

  getQcProduct: (pagination) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_QC_PRODUCT(pagination),
    });
  },

  addProduct: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.DEFAULT_PRODUCT,
      data: reqData,
    });
  },

  updateProduct: (reqData) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.DEFAULT_PRODUCT,
      data: reqData,
    });
  },

  deleteProduct: (procode) => {
    return axios({
      method: METHOD.DELETE,
      url: ENDPOINT.DELETE_PRODUCT(procode),
    });
  },

  updateQcProduct: (data) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.UPDATE_QC_PRODUCT,
      data,
    });
  },

  getReport: (data) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_REPORT,
      data,
    });
  },

  getProductReadyToSell: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_PRODUCT_READY_TO_SELL(pageConf),
    });
  },

  getQcGroup: (pDate) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_QC_GROUP(pDate),
    });
  },
};

export default ProductService;
