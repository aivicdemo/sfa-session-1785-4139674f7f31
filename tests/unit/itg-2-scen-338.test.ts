import { determineConductGuidanceTarget } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-338
  test("同じ入力データで改善指導判定を2回実行した場合、同じ結果が得られる", () => {
    const sales_data_1st_pass = {
      customer_name: "山田太郎",
      sales_amount: 100000,
      product_code: "PROD-001",
      contract_date: "2024-01-15",
    };

    const sales_data_2nd_pass = {
      customer_name: "山田太郎",
      sales_amount: 100000,
      product_code: "PROD-001",
      contract_date: "2024-01-15",
    };

    const result_1st = determineConductGuidanceTarget(sales_data_1st_pass);
    const result_2nd = determineConductGuidanceTarget(sales_data_2nd_pass);

    expect(result_1st.is_guidance_target).toBe(result_2nd.is_guidance_target);
    expect(result_1st.guidance_items).toEqual(result_2nd.guidance_items);
    expect(result_1st.judgment_score).toBe(result_2nd.judgment_score);
  });
});