import axios from "axios";
import { METHOD } from "context/constant";
import { API_URL } from "utils/utils";

const ENDPOINT = {
  GET_IMPORT_WIREROD: ({ page, pageLimit, query, timeQuery }) =>
    `${API_URL}/wirerod/import?page=${page}&limit=${pageLimit}&query=${query}&timeQuery=${timeQuery}`,
  IMPORT_WIREROD: `${API_URL}/wirerod/import`,
  EXPORT_WIREROD: `${API_URL}/wirerod/export`,
  UPDATE_WIREROD: `${API_URL}/wirerod/import`,

  //  ==== DEPRECATED ==== ///
  // GET_LC: ({ page, pageLimit }) =>
  //   `${API_URL}/wirerod/lc?page=${page}&limit=${pageLimit}`,
  // GET_CHARGE_BY_LC: ({ lcNo, page, pageLimit }) =>
  //   `${API_URL}/wirerod/charge-by-lc?lcNo=${lcNo}&page=${page}&limit=${pageLimit}`,

  GET_CHARGE: ({ page, pageLimit, query }) =>
    `${API_URL}/wirerod/charge?page=${page}&limit=${pageLimit}&query=${query}`,
  GET_COIL: ({ lcNo, chargeNo, page, pageLimit }) =>
    `${API_URL}/wirerod/coil?lcNo=${lcNo}&chargeNo=${chargeNo}&page=${page}&limit=${pageLimit}`,

  GET_COIL_AVAILABLE: ({ page, pageLimit, query }) =>
    `${API_URL}/wirerod/coil-available?page=${page}&limit=${pageLimit}&query=${query}`,

  VERIFY_CHARGE: (chargeNo) =>
    `${API_URL}/wirerod/verify-charge?chargeNo=${chargeNo}`,
  VERIFY_REC: (recVol, recNo) =>
    `${API_URL}/wirerod/verify-rec?recVol=${recVol}&recNo=${recNo}`,

  GET_WID_VOL: ({ page, pageLimit, chargeQuery }) =>
    `${API_URL}/wirerod/wid-vol?page=${page}&limit=${pageLimit}&chargeNo=${chargeQuery}`,
  GET_WID_NO: ({ widVol, page, pageLimit, chargeQuery }) =>
    `${API_URL}/wirerod/wid-no?widVol=${widVol}&page=${page}&limit=${pageLimit}&chargeNo=${chargeQuery}`,
  GET_WR_EXPORT_DETAIL: ({ widVol, widNo }) =>
    `${API_URL}/wirerod/export-detail?widVol=${widVol}&widNo=${widNo}`,

  GET_EXPORT_REPORT: `${API_URL}/wirerod/export/report`,
  GET_IMPORT_REPORT: `${API_URL}/wirerod/import/report`,

  //  ==== DEPRECATED ==== ///
  // GET_REC_VOL: ({ page, pageLimit }) =>
  //   `${API_URL}/wirerod/rec-vol?page=${page}&limit=${pageLimit}`,
  // GET_REC_NO: ({ recVol, page, pageLimit }) =>
  //   `${API_URL}/wirerod/rec-no?recVol=${recVol}&page=${page}&limit=${pageLimit}`,
  // GET_WR_IMPORT_DETAIL: ({ recVol, recNo }) =>
  //   `${API_URL}/wirerod/import-detail?recVol=${recVol}&recNo=${recNo}`,
  //  =================== ///

  PRINT_WR_TAGS: `${API_URL}/wirerod/print`,
};

const WireRodService = {
  // GET IMPORT WIREROD
  getImportWireRod: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_IMPORT_WIREROD(pageConf),
    });
  },

  // IMPORT WIREROD
  importWireRod: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.IMPORT_WIREROD,
      data: reqData,
    });
  },

  // EXPORT WIREROD
  exportWireRod: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.EXPORT_WIREROD,
      data: reqData,
    });
  },

  getAllCharge: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_CHARGE(pageConf),
    });
  },

  getCoil: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_COIL(pageConf),
    });
  },

  getCoilAvailable: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_COIL_AVAILABLE(pageConf),
    });
  },

  verifyCharge: (chargeNo) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.VERIFY_CHARGE(chargeNo),
    });
  },

  verifyRec: (recVol, recNo) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.VERIFY_REC(recVol, recNo),
    });
  },

  // GET WID VOL
  getWidVol: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_WID_VOL(pageConf),
    });
  },

  // GET WID NO (BY WID VOL)
  getWidNo: (pageConf) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_WID_NO(pageConf),
    });
  },

  // GET WIREROD EXPORT DETAIL (BY WID VOL. & WID NO.)
  getWrExportDetail: (reqData) => {
    return axios({
      method: METHOD.GET,
      url: ENDPOINT.GET_WR_EXPORT_DETAIL(reqData),
    });
  },

  printAddTagsDate: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.PRINT_WR_TAGS,
      data: reqData,
    });
  },

  getWRExportReport: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_EXPORT_REPORT,
      data: reqData,
    });
  },

  getWRImportReport: (reqData) => {
    return axios({
      method: METHOD.POST,
      url: ENDPOINT.GET_IMPORT_REPORT,
      data: reqData,
    });
  },

  // EDIT WIREROD (WEIGHT)
  updateWirerod: (reqData) => {
    return axios({
      method: METHOD.PATCH,
      url: ENDPOINT.UPDATE_WIREROD,
      data: reqData,
    });
  },

  // ==== DEPRECATED (WR IMPORT REC VOL NO VERSION)
  // // GET REC VOL
  // getRecVol: (pageConf) => {
  //   return axios({
  //     method: METHOD.GET,
  //     url: ENDPOINT.GET_REC_VOL(pageConf),
  //   });
  // },

  // // GET REC NO (BY REC VOL)
  // getRecNo: (pageConf) => {
  //   return axios({
  //     method: METHOD.GET,
  //     url: ENDPOINT.GET_REC_NO(pageConf),
  //   });
  // },

  // // GET WIREROD IMPORT DETAIL (BY REC VOL. & REC NO.)
  // getWrImportDetail: (reqData) => {
  //   return axios({
  //     method: METHOD.GET,
  //     url: ENDPOINT.GET_WR_IMPORT_DETAIL(reqData),
  //   });
  // },

  // ==== DEPRECATED (WR IMPORT LC NO VERSION)

  // getLc: (pageConf) => {
  //   return axios({
  //     method: METHOD.GET,
  //     url: ENDPOINT.GET_LC(pageConf),
  //   });
  // },

  // getChargeByLc: (pageConf) => {
  //   return axios({
  //     method: METHOD.GET,
  //     url: ENDPOINT.GET_CHARGE_BY_LC(pageConf),
  //   });
  // },
};

export default WireRodService;
