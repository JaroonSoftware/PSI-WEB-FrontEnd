import dayjs from "dayjs";

export const API_URL = process.env.REACT_APP_API_URL;

export const ENV = process.env.NODE_ENV;

export const PUBLIC_IMAGE_URL = process.env.REACT_APP_ASSET_URL;

export const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
export const STORAGE = {
  GET: (key) => sessionStorage.getItem(key),
  SET: (key, value) => sessionStorage.setItem(key, value),
  CLEAR: () => sessionStorage.clear(),
};

export const padingZero = (num, totalLength) => {
  return String(num).padStart(totalLength, "0");
};

export const getDefaultValue = (value) => {
  let val = parseFloat(value).toFixed(3);
  let temp = val.split(".");
  let itg = parseInt(temp[0]).toLocaleString();
  let digit = temp[1];

  return value ? `${itg}.${digit}` : "0.00";
};

export const dateFormat = (date) => {
  if (!date) return dayjs().format("DD/MM/YYYY");
  return dayjs(date).format("DD/MM/YYYY");
};
