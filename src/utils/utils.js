import dayjs from "dayjs";

/* ===== ที่อยู่ของ Backend API =====
   ลำดับการเลือก:
     1) ถ้ากำหนด REACT_APP_API_URL ใน .env ไว้ -> ใช้ค่านั้น
     2) ถ้าไม่ได้กำหนด -> ใช้ "โฮสต์เดียวกับที่เปิดเว็บอยู่" พอร์ต 5000

   ข้อดีของข้อ 2 : บิลด์ครั้งเดียวใช้ได้ทุกเครื่อง
     - เปิดที่ http://localhost/psi        -> ยิงไป http://localhost:5000
     - เปิดที่ http://192.168.0.252/psi    -> ยิงไป http://192.168.0.252:5000
   ไม่ต้องแก้ .env แล้วบิลด์ใหม่ทุกครั้งที่ย้ายเครื่อง */
const API_PORT = 5000;

const sameHostApi = () => {
  if (typeof window === "undefined") return `http://localhost:${API_PORT}`;
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:${API_PORT}`;
};

export const API_URL =
  (process.env.REACT_APP_API_URL || "").trim() || sameHostApi();

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
