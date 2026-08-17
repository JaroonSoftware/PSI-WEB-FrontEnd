/* ใช้ร่วมกันระหว่างหน้าแสดงผล (pages/sale/sale-daily) กับหน้าพิมพ์
   เพื่อให้ตัวเลขบนจอกับบนกระดาษตรงกันเสมอ */

/**
 * จัดกลุ่มรายการขายตามวันที่ (gdsdate)
 * แล้วแทรกแถวรวมของแต่ละวัน + แถวรวมทั้งสิ้นท้ายสุด
 *
 * @param {Array} items ข้อมูลดิบจาก API
 * @returns {{ rows: Array, grandWeight: number, grandAmount: number }}
 */
export const buildSaleDailyRows = (items = []) => {
  const byDate = {};
  let grandWeight = 0;
  let grandAmount = 0;

  items.forEach((item, idx) => {
    const dkey = item.gdsdate;
    if (!byDate[dkey]) {
      byDate[dkey] = { rows: [], totalWeight: 0, totalAmount: 0 };
    }

    const weight = Number(item?.tot_unt) || 0;
    const amount = weight * (Number(item?.u_price) || 0);
    const safeAmount = Number.isFinite(amount) ? amount : 0;

    byDate[dkey].rows.push({
      index: idx,
      key: (item.lc_no || "") + "@" + (item.charge_no || "") + "#" + idx,
      ...item,
    });
    byDate[dkey].totalWeight += weight;
    byDate[dkey].totalAmount += safeAmount;
    grandWeight += weight;
    grandAmount += safeAmount;
  });

  const rows = [];
  Object.keys(byDate).forEach((dk) => {
    rows.push(...byDate[dk].rows);
    rows.push({
      key: dk + "#SUM",
      gdsdate: dk,
      tot_unt: byDate[dk].totalWeight,
      sum_amount: byDate[dk].totalAmount,
    });
  });

  rows.push({
    key: "#GRAND_SUM",
    isGrand: true,
    tot_unt: grandWeight,
    sum_amount: grandAmount,
  });

  return { rows, grandWeight, grandAmount };
};

/**
 * จัดแถวรายละเอียดลวด (คอยล์) ของใบกำกับหนึ่งใบ
 * จัดกลุ่มตามรหัสสินค้า แล้วแทรกแถว "รวม" ของแต่ละกลุ่ม + "รวมทั้งสิ้น" ท้ายสุด
 *
 * @param {Array} items ข้อมูลดิบจาก API
 * @returns {{ rows: Array, grandWeight: number, count: number }}
 */
export const buildInvoiceDetailRows = (items = []) => {
  const byCode = {};
  let grandWeight = 0;

  items.forEach((item, idx) => {
    const ckey = item.code ?? "-";
    if (!byCode[ckey]) byCode[ckey] = { rows: [], totalWeight: 0 };

    const weight = Number(item?.weight) || 0;

    byCode[ckey].rows.push({
      ...item,
      index: idx,
      key: `${ckey}@${item.charge_no ?? ""}@${item.coil_no ?? ""}#${idx}`,
    });
    byCode[ckey].totalWeight += weight;
    grandWeight += weight;
  });

  const codes = Object.keys(byCode);
  const rows = [];

  codes.forEach((ck) => {
    // ไล่ลำดับใหม่ให้เริ่มที่ 1 ในแต่ละกลุ่ม เหมือนฟอร์มเดิม
    byCode[ck].rows.forEach((r, i) => {
      r.index = i;
    });

    rows.push(...byCode[ck].rows);
    rows.push({
      key: `${ck}#SUM`,
      isSum: true,
      label: "รวม",
      code: ck,
      weight: byCode[ck].totalWeight,
    });
  });

  // มีมากกว่า 1 กลุ่มถึงจะมีความหมาย แต่ฟอร์มเดิมแสดงเสมอ
  rows.push({
    key: "#GRAND_SUM",
    isSum: true,
    isGrand: true,
    label: "รวมทั้งสิ้น",
    weight: grandWeight,
  });

  return { rows, grandWeight, count: items.length };
};

export default buildSaleDailyRows;
