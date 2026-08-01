import { recordCustomerResponse } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-297
  test("顧客反応が0件の状態で記録処理が実行される", () => {
    const input = {
      customerResponseRecords: [],
      standardizationRules: {
        responsePatterns: [
          { pattern: "positive", keywords: ["興味", "検討中"] },
          { pattern: "negative", keywords: ["不要", "見送り"] },
          { pattern: "neutral", keywords: ["確認中", "検討"] },
        ],
      },
    };

    const result = recordCustomerResponse(input);

    expect(result.recordedCount).toBe(0);
    expect(result.standardizedRecords).toEqual([]);
    expect(result.systemLog).toContain("顧客反応件数: 0件。標準化対象なし");
    expect(result.status).toBe("success");
  });
});