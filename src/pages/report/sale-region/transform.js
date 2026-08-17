import { UNSPECIFIED_REGION } from "context/constant";

/* ใช้ร่วมกันระหว่างหน้าแสดงผลกับหน้าพิมพ์
   ตัวเลขบนจอกับบนกระดาษจะได้ตรงกันเสมอ */

/**
 * จัดกลุ่มยอดขายตามภาค แล้วแทรกแถวรวมของแต่ละภาค + รวมทั้งสิ้นท้ายสุด
 *
 * @param {Array} items ข้อมูลดิบจาก API (1 แถว = 1 ลูกค้า ในภาคหนึ่ง)
 */
export const buildRegionRows = (items = []) => {
  const byRegion = {};
  let grandWeight = 0;
  let grandAmount = 0;
  let grandCustomers = 0;

  items.forEach((item) => {
    const rkey = item.region || UNSPECIFIED_REGION;
    if (!byRegion[rkey]) {
      byRegion[rkey] = { rows: [], weight: 0, amount: 0 };
    }

    const weight = Number(item?.total_weight) || 0;
    const amount = Number(item?.total_amount) || 0;

    byRegion[rkey].rows.push(item);
    byRegion[rkey].weight += weight;
    byRegion[rkey].amount += amount;

    grandWeight += weight;
    grandAmount += amount;
    grandCustomers += 1;
  });

  /* เรียงภาคตามยอดเงินมากไปน้อย แต่ดัน "(ยังไม่ได้ระบุ)" ไว้ท้ายสุดเสมอ
     ไม่ให้กลุ่มที่ยังกรอกข้อมูลไม่ครบไปแย่งพื้นที่ด้านบน */
  const regions = Object.keys(byRegion).sort((a, b) => {
    if (a === UNSPECIFIED_REGION) return 1;
    if (b === UNSPECIFIED_REGION) return -1;
    return byRegion[b].amount - byRegion[a].amount;
  });

  const rows = [];
  const chart = [];

  regions.forEach((rk) => {
    const g = byRegion[rk];
    const pct = grandAmount ? (g.amount / grandAmount) * 100 : 0;

    // หัวกลุ่มของภาค
    rows.push({
      key: `${rk}#HEAD`,
      isRegionHead: true,
      region: rk,
      customers: g.rows.length,
      total_weight: g.weight,
      total_amount: g.amount,
      pct,
    });

    g.rows.forEach((r, i) => {
      rows.push({
        ...r,
        key: `${rk}@${r.cusno ?? i}`,
        index: i,
        pct: grandAmount ? ((Number(r.total_amount) || 0) / grandAmount) * 100 : 0,
      });
    });

    rows.push({
      key: `${rk}#SUM`,
      isSum: true,
      label: `รวม ${rk}`,
      total_weight: g.weight,
      total_amount: g.amount,
      pct,
    });

    chart.push({
      region: rk,
      customers: g.rows.length,
      weight: g.weight,
      amount: g.amount,
      pct,
    });
  });

  rows.push({
    key: "#GRAND",
    isSum: true,
    isGrand: true,
    label: "รวมทั้งสิ้น",
    total_weight: grandWeight,
    total_amount: grandAmount,
    pct: grandAmount ? 100 : 0,
  });

  const unspecified = byRegion[UNSPECIFIED_REGION];

  return {
    rows,
    chart,
    grandWeight,
    grandAmount,
    grandCustomers,
    regionCount: regions.filter((r) => r !== UNSPECIFIED_REGION).length,
    // ใช้เตือนบนหน้าจอว่ายอดเท่าไรที่ยังไม่มีภาค
    unspecifiedAmount: unspecified?.amount ?? 0,
    unspecifiedPct:
      grandAmount && unspecified ? (unspecified.amount / grandAmount) * 100 : 0,
    unspecifiedCustomers: unspecified?.rows?.length ?? 0,
  };
};

export default buildRegionRows;
