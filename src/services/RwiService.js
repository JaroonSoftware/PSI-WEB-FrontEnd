import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  GET_STOCK: `${API_URL}/rwi/get-stock`,
  GET_IMPORT_WIREROD: `${API_URL}/rwi/get-import`,
  GET_VENDOR: `${API_URL}/setting/vendor?getAll=${true}`,
};

const RwiService = {
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
};

export default RwiService;
