import { calculateSizeCompatibilityScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-710
  test("[edge] 提案資料と顧客ニーズの適合度スコア化機能 - 顧客規模が空のとき、規模適合スコア計算が適切に処理される", () => {
    const customer_needs = {
      customer_id: "CUST_001",
      company_size: "",
      created_at: new Date("2024-01-15T11:00:00Z"),
    };

    const proposal_material = {
      proposal_id: "PROP_001",
      supported_company_size: "中堅企業",
      created_at: new Date("2024-01-15T11:00:00Z"),
    };

    const result = calculateSizeCompatibilityScore(
      customer_needs,
      proposal_material
    );

    expect(result.score).toBe(0);
    expect(result.reason).toContain("顧客規模が入力されていません");
    expect(result.error_occurred).toBe(false);
  });
});