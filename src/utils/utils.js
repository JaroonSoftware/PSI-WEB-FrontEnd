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

export const getDefaultValue = (value, digit) => {
  let val = parseFloat(value).toFixed(digit || 2);
  let temp = val.split(".");
  let itgVal = parseInt(temp[0]).toLocaleString();
  let digitVal = temp[1];

  return value ? `${itgVal}.${digitVal}` : "0.00";
};

export const dateFormat = (date) => {
  if (!date) return dayjs().format("DD/MM/YYYY");
  return dayjs(date).format("DD/MM/YYYY");
};

export const formatMoney = (amount, decimalCount) => {
    try {
        let decimal = ".", thousands = ",";
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" +
            thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
}
