import { detectDuplicateCustomersWithoutNormalization } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-360
  test("正規化ルールが欠けている場合、正規化処理がスキップされ非正規化データで判定される", () => {
    const normalizationRules = {};

    const testCustomerData = {
      companyName: " 株式会社A ",
      phoneNumber: "03-1234-5678",
      email: " user@example.com ",
    };

    const result = detectDuplicateCustomersWithoutNormalization(
      testCustomerData,
      normalizationRules
    );

    expect(result.normalizationApplied).toBe(false);
    expect(result.duplicateJudgmentData).toEqual({
      companyName: " 株式会社A ",
      phoneNumber: "03-1234-5678",
      email: " user@example.com ",
    });
    expect(result.isNormalizedFormat).toBe(false);
  });
});