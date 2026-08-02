import { calculateConversionRate } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-837
  test("成約件数が1件で総商談件数が2件のとき、成約率は50%で返される", () => {
    const closed_deals = 1;
    const total_deals = 2;
    const expected_conversion_rate = 50;

    const result = calculateConversionRate(closed_deals, total_deals);

    expect(result).toBe(expected_conversion_rate);
  });
});