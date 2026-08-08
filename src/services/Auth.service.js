import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

// ส่ง cookie ไปกับทุก request (JWT อยู่ใน httpOnly cookie)
axios.defaults.withCredentials = true;

const ENDPOINT = {
  LOGIN: `${API_URL}/auth/login`,
  LOGOUT: `${API_URL}/auth/logout`,
  ME: `${API_URL}/auth/me`,
};

const AuthService = {
  login: (data) =>
    axios({
      method: METHOD.POST,
      url: ENDPOINT.LOGIN,
      data: { ...data, app: "webpsi" },
      withCredentials: true,
    }),

  logout: () =>
    axios({ method: METHOD.POST, url: ENDPOINT.LOGOUT, withCredentials: true }),

  me: () =>
    axios({ method: METHOD.GET, url: ENDPOINT.ME, withCredentials: true }),
};

export default AuthService;
