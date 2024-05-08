import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL, STORAGE } from "utils/utils";

const ENDPOINT = {
  TRANSPORT: {
    GET: ({ page, pageLimit, query, getAll }) =>
      `${API_URL}/setting/transport?page=${page}&limit=${pageLimit}&query=${query}&getAll=${getAll}`,
    ADD: `${API_URL}/setting/transport`,
    UPDATE: `${API_URL}/setting/transport`,
    DELETE: (transportId) =>
      `${API_URL}/setting/transport?transportId=${transportId}`,
    FIND_ONE_BY_TRNCODE: (trnCode) =>
      `${API_URL}/setting/transport/find?trnCode=${trnCode}`,
  },

  CUSTOMER: {
    GET: ({ page, pageLimit, query, getAll }) =>
      `${API_URL}/setting/customer?page=${page}&limit=${pageLimit}&query=${query}&getAll=${getAll}`,
    ADD: `${API_URL}/setting/customer`,
    UPDATE: `${API_URL}/setting/customer`,
    DELETE: (customerId) =>
      `${API_URL}/setting/customer?customerId=${customerId}`,
    FIND_ONE_BY_ALICODE: (aliCode) =>
      `${API_URL}/setting/customer/find?aliCode=${aliCode}`,
  },

  SELLER: {
    GET: ({ page, pageLimit, query, getAll }) =>
      `${API_URL}/setting/seller?page=${page}&limit=${pageLimit}&query=${query}&getAll=${getAll}`,
    ADD: `${API_URL}/setting/seller`,
    UPDATE: `${API_URL}/setting/seller`,
    DELETE: (sellerId) => `${API_URL}/setting/seller?saleId=${sellerId}`,
    FIND_ONE_BY_SALENO: (saleNo) =>
      `${API_URL}/setting/seller/find?saleNo=${saleNo}`,
  },

  VENDOR: {
    GET: ({ page, pageLimit, query, getAll }) =>
      `${API_URL}/setting/vendor?page=${page}&limit=${pageLimit}&query=${query}&getAll=${getAll}`,
    ADD: `${API_URL}/setting/vendor`,
    UPDATE: `${API_URL}/setting/vendor`,
    DELETE: (vendorCode) =>
      `${API_URL}/setting/vendor?vendorCode=${vendorCode}`,
  },

  PRODUCT_TYPE: {
    DEFAULT: `${API_URL}/setting/product-type`,
    DELETE: (typeCode) =>
      `${API_URL}/setting/product-type?typeCode=${typeCode}`,
  },

  PRODUCT_CODE: {
    GET: ({ typeCode, page, getAll }) =>
      `${API_URL}/setting/product-code?typeCode=${typeCode}&page=${page}&getAll=${getAll}`,
    DELETE: (productCode) =>
      `${API_URL}/setting/product-code?productCode=${productCode}`,
    DEFAULT: `${API_URL}/setting/product-code`,
    FIND_ONE_BY_PRODUCT_CODE: (productCode) =>
      `${API_URL}/setting/product-code/find?productCode=${productCode}`,
    GET_CODE_EXCLUDE_WR: `${API_URL}/setting/product-code/exclude/wr`,
  },
};

const SettingService = {
  // ====== Customer ====== //
  getAllCustomer: (pagination) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.CUSTOMER.GET(pagination),
    });
  },

  addCustomer: (data) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.CUSTOMER.ADD,
      data,
    });
  },

  updateCustomer: (data) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.CUSTOMER.UPDATE,
      data,
    });
  },

  delCustomerById: (customerId) => {
    return axios({
      method: METHOD.DELETE,
      url: ENDPOINT.CUSTOMER.DELETE(customerId),
    });
  },

  findOneByAliCode: (aliCode) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.CUSTOMER.FIND_ONE_BY_ALICODE(aliCode),
    });
  },
  // ========================== //

  // ====== Seller ====== //
  getAllSeller: (pagination) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.SELLER.GET(pagination),
    });
  },

  addSeller: (data) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.SELLER.ADD,
      data,
    });
  },

  updateSeller: (data) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.SELLER.UPDATE,
      data,
    });
  },

  delSellerById: (sellerId) => {
    return axios({
      method: METHOD.DELETE,
      url: ENDPOINT.SELLER.DELETE(sellerId),
    });
  },

  findOneBySaleNo: (saleNo) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.SELLER.FIND_ONE_BY_SALENO(saleNo),
    });
  },
  // ========================== //

  // ====== Vendor ====== //
  getVendor: (pagination) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.VENDOR.GET(pagination),
    });
  },

  addVendor: (data) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.VENDOR.ADD,
      data,
    });
  },

  updateVendor: (data) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.VENDOR.UPDATE,
      data,
    });
  },

  delVendorByCode: (vendorCode) => {
    return axios({
      method: METHOD.DELETE,
      url: ENDPOINT.VENDOR.DELETE(vendorCode),
    });
  },
  // ========================== //

  // ====== Transport ====== //
  getAllTransport: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.TRANSPORT.GET(pageConf),
    });
  },

  addTransport: (data) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.TRANSPORT.ADD,
      data,
    });
  },

  updateTransport: (data) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.TRANSPORT.UPDATE,
      data,
    });
  },

  delTransportById: (transportId) => {
    return axios({
      method: METHOD.DELETE,
      url: ENDPOINT.TRANSPORT.DELETE(transportId),
    });
  },

  findOneByTrnCode: (trnCode) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.TRANSPORT.FIND_ONE_BY_TRNCODE(trnCode),
    });
  },
  // ========================== //

  // ====== Product Type ====== //
  getAllProductType: () => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.PRODUCT_TYPE.DEFAULT,
    });
  },

  delProdctTypeById: (typeCode) => {
    return axios({
      method: METHOD.DELETE,
      url: ENDPOINT.PRODUCT_TYPE.DELETE(typeCode),
    });
  },

  addProductType: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.PRODUCT_TYPE.DEFAULT,
      data: reqData,
    });
  },

  editProductType: (reqData) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.PRODUCT_TYPE.DEFAULT,
      data: reqData,
    });
  },
  // ========================== //

  // ====== PRODUCT CODE ====== //
  getProductCode: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.PRODUCT_CODE.GET(pageConf),
    });
  },

  addProductCode: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.PRODUCT_CODE.DEFAULT,
      data: reqData,
    });
  },

  delProductCode: (productCode) => {
    return axios({
      method: METHOD.DELETE,
      url: ENDPOINT.PRODUCT_CODE.DELETE(productCode),
    });
  },

  editProductCode: (reqData) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.PRODUCT_CODE.DEFAULT,
      data: reqData,
    });
  },

  findOneByProductCode: (productCode) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.PRODUCT_CODE.FIND_ONE_BY_PRODUCT_CODE(productCode),
    });
  },

  getCodeExcludeWr: () => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.PRODUCT_CODE.GET_CODE_EXCLUDE_WR,
    });
  },
  // ========================== //
};

export default SettingService;
