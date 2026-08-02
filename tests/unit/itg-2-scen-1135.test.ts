import { calculateDuplicateScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1135
  test("正規化後の複数フィールドが一致する場合、重複スコアが高くなる", () => {
    const customer_a = {
      company_name: "株式会社 テスト商事",
      address: "東京都渋谷区1-2-3",
      phone: "03-1234-5678",
    };

    const customer_b = {
      company_name: "（株）テスト商事",
      address: "東京都渋谷区1丁目2番3号",
      phone: "03-12345678",
    };

    const normalization_rules = [
      {
        field: "company_name",
        pattern: /株式会社|（株）/g,
        replacement: "",
      },
      {
        field: "address",
        pattern: /[丁目番号\-]/g,
        replacement: "",
      },
      {
        field: "phone",
        pattern: /[\-]/g,
        replacement: "",
      },
    ];

    const duplicate_score = calculateDuplicateScore(
      customer_a,
      customer_b,
      normalization_rules
    );

    expect(duplicate_score).toBeGreaterThanOrEqual(0.95);
  });
});