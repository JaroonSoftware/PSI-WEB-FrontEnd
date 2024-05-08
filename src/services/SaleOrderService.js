import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  GET_SALE_ORDER_DETAIL: ({ bokVol, bokNo }) =>
    `${API_URL}/sale-order/order-detail?bokVol=${bokVol}&bokNo=${bokNo}`,
  CHANGE_STATUS: ({ bokVol, bokNo, status }) =>
    `${API_URL}/sale-order/change-status?bokVol=${bokVol}&bokNo=${bokNo}&status=${status}`,
  CREATE_ORDER: `${API_URL}/sale-order`,
  UPDATE_ORDER: `${API_URL}/sale-order`,

  P_ORDER: {
    GET_PRE_ORDER: ({ page, pageLimit, query }) =>
      `${API_URL}/sale-order/p-order?page=${page}&limit=${pageLimit}&query=${query}`,
    VERIFY_VOL: (bokVol, bokNo) =>
      `${API_URL}/sale-order/p-order/verify-vol?bokVol=${bokVol}&bokNo=${bokNo}`,
    GET_BOK_VOL: ({ page, pageLimit, timeQuery }) =>
      `${API_URL}/sale-order/p-order/bok-vol?page=${page}&limit=${pageLimit}&timeQuery=${timeQuery}`,
    GET_BOK_NO: ({ bokVol, page, pageLimit, timeQuery }) =>
      `${API_URL}/sale-order/p-order/vol-no?bokVol=${bokVol}&page=${page}&limit=${pageLimit}&timeQuery=${timeQuery}`,
  },

  INVOICE: {
    CREATE: `${API_URL}/sale-order/invoice`,
    GET_BOK_VOL: ({ page, pageLimit, timeQuery }) =>
      `${API_URL}/sale-order/invoice/bok-vol?page=${page}&limit=${pageLimit}&timeQuery=${timeQuery}`,
    GET_VOL_NO: ({ bokVol, page, pageLimit, timeQuery }) =>
      `${API_URL}/sale-order/invoice/vol-no?bokVol=${bokVol}&page=${page}&limit=${pageLimit}&timeQuery=${timeQuery}`,
    GET_INVOICE_DETAIL: (id) => `${API_URL}/sale-order/invoice/detail/${id}`,
  },

  TAX: {
    GET: ({ page, pageLimit, query }) =>
      `${API_URL}/sale-order/invoice/tax?page=${page}&limit=${pageLimit}&query=${query}`,
    CREATE: `${API_URL}/sale-order/invoice/tax`,
    GET_CUSTOMER: `${API_URL}/sale-order/invoice/tax-customer`,
    GET_INVOICE_BY_CUSTOMER_ID: (cusNo) =>
      `${API_URL}/sale-order/invoice/tax-customer/${cusNo}`,
    GET_TAX_DETAIL: (id) => `${API_URL}/sale-order/invoice/tax/detail/${id}`,
    UPDATE_INVOICE_TAX: `${API_URL}/sale-order/invoice/tax`,
  },
};

const SaleOrderService = {
  // GET REC VOL
  getPOrderBokVol: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.P_ORDER.GET_BOK_VOL(pageConf),
    });
  },

  // GET REC NO (BY REC VOL)
  getPOrderBokNo: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.P_ORDER.GET_BOK_NO(pageConf),
    });
  },

  // VERIFY BOK VOL. & BOK NO.
  verifyVol: (bokVol, bokNo) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.P_ORDER.VERIFY_VOL(bokVol, bokNo),
    });
  },

  getOrderDetail: (reqData) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_SALE_ORDER_DETAIL(reqData),
    });
  },

  changeStatus: (reqData) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.CHANGE_STATUS(reqData),
    });
  },

  createOrder: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.CREATE_ORDER,
      data: reqData,
    });
  },

  updateOrder: (reqData) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.UPDATE_ORDER,
      data: reqData,
    });
  },

  getPreOrder: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.P_ORDER.GET_PRE_ORDER(pageConf),
    });
  },

  // [GET] INVOICE BOK VOL.
  getInvoiceBokVol: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.INVOICE.GET_BOK_VOL(pageConf),
    });
  },

  // [GET] INVOICE VOL NO. (BY BOK VOL)
  getInvoiceBokNo: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.INVOICE.GET_VOL_NO(pageConf),
    });
  },

  // [GET] INVOICE DETAIL
  getInvoiceDetail: (id) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.INVOICE.GET_INVOICE_DETAIL(id),
    });
  },

  // [POST] CREATE INVOICE
  createInvoice: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.INVOICE.CREATE,
      data: reqData,
    });
  },

  // [GET] GET ALL INVOICE TAX
  getTaxInvoice: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.TAX.GET(pageConf),
    });
  },

  // [GET] GET CUSTOMER TO CREATE INVOICE TAX
  getTaxCustomer: () => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.TAX.GET_CUSTOMER,
    });
  },

  // [GET] GET INVOICE BY CUSTOMER ID
  getInvoiceByCusNo: (cusNo) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.TAX.GET_INVOICE_BY_CUSTOMER_ID(cusNo),
    });
  },

  // [POST] CREATE INVOICE TAX
  createInvoiceTax: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.TAX.CREATE,
      data: reqData,
    });
  },

  // [GET] TAX DETAIL
  getTaxDetail: (id) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.TAX.GET_TAX_DETAIL(id),
    });
  },

  // [PATCH] UPDATE INVOICE TAX
  updateInvoiceTax: (reqData) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.TAX.UPDATE_INVOICE_TAX,
      data: reqData,
    });
  },
};

export default SaleOrderService;
