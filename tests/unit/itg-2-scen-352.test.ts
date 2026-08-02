import { calculateDuplicateCandidateScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-352
  test("住所が欠けている場合、重複候補スコア計算で当該項目がスキップされる", () => {
    const recordA = {
      customer_id: "CUST001",
      customer_name: "山田太郎",
      phone_number: "090-1234-5678",
      address: null,
    };

    const recordB = {
      customer_id: "CUST002",
      customer_name: "山田太郎",
      phone_number: "090-1234-5678",
      address: "東京都渋谷区道玄坂1-2-3",
    };

    const result = calculateDuplicateCandidateScore(recordA, recordB);

    expect(result.score).toBe(0.95);
    expect(result.calculation_breakdown).toContainEqual({
      field: "address",
      status: "skipped",
      reason: "住所項目はnull値のためスキップ",
    });
    expect(result.calculation_breakdown).toContainEqual({
      field: "customer_name",
      match: true,
      weight: 0.4,
    });
    expect(result.calculation_breakdown).toContainEqual({
      field: "phone_number",
      match: true,
      weight: 0.55,
    });
  });
});