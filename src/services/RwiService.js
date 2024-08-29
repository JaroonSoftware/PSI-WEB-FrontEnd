import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  GET_STOCK: `${API_URL}/rwi/get-stock`,
};

const RwiService = {
  getStock: (dateQuery) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_STOCK,
      data: { dateQuery },
    });
  },
};

export default RwiService;
