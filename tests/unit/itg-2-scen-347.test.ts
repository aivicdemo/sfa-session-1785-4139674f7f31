import { calculateDuplicateScoreWithSkippedFields } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データ重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-347
  test("電話番号が空文字列である場合、重複候補スコア計算で当該項目がスキップされる", () => {
    const recordA = {
      customer_id: "CUST001",
      name: "田中太郎",
      email: "tanaka@example.com",
      phone: "09012345678",
      address: "東京都渋谷区1-1-1",
    };

    const recordB = {
      customer_id: "CUST002",
      name: "田中太郎",
      email: "tanaka@example.com",
      phone: "",
      address: "東京都渋谷区1-1-1",
    };

    const result = calculateDuplicateScoreWithSkippedFields(recordA, recordB);

    expect(result.score).toBe(0.75);
    expect(result.scoreBreakdown).toEqual({
      name: 1.0,
      email: 1.0,
      phone: 0,
      address: 1.0,
    });
    expect(result.skippedFields).toContain("phone");
    expect(result.fieldDetails).toEqual(
      expect.objectContaining({
        phone: "skipped",
      })
    );
  });
});