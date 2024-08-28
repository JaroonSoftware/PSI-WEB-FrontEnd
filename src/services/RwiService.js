import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  GET_STOCK: `${API_URL}/rwi/get-stock`,
};

const RwiService = {
  getStock: () => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_STOCK,
    });
  },
};

export default RwiService;
