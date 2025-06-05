import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  GET_STOCK: `${API_URL}/rwi/get-stock`,
  OPTION_FG: `${API_URL}/option/options-fg`,
};

const OptionService = {
  OPTION_FG: () => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.OPTION_FG,
    });
  },
};

export default OptionService;
