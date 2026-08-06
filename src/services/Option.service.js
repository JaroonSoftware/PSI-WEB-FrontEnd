import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  GET_STOCK: `${API_URL}/rwi/get-stock`,
  OPTION_FG: `${API_URL}/option/options-fg`,
  TRANSPORT: `${API_URL}/setting/transport?page=1&limit=999&query=&status=Y&getAll=false`,
  FUEL_BANDS: `${API_URL}/setting/freight/bands`,
  SELLER: `${API_URL}/setting/seller?page=1&limit=999&query=&status=Y&getAll=false`,
};

const OptionService = {
  TRANSPORT: () => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.TRANSPORT,
    });
  },

  FUEL_BANDS: () => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.FUEL_BANDS,
    });
  },

  SELLER: () => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.SELLER,
    });
  },

  OPTION_FG: () => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.OPTION_FG,
    });
  },
};

export default OptionService;
