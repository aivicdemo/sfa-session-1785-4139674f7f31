import { calculateDuplicateCandidateScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データ重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-353
  test("住所が空文字列である場合、重複候補スコア計算で当該項目がスキップされる", () => {
    const recordA = {
      customer_id: "A001",
      name: "田中太郎",
      phone: "090-1234-5678",
      address: "",
    };

    const recordB = {
      customer_id: "B001",
      name: "田中太郎",
      phone: "090-1234-5678",
      address: "東京都渋谷区",
    };

    const result = calculateDuplicateCandidateScore(recordA, recordB);

    expect(result.score).toBe(100);
    expect(result.matched_fields).toContain("name");
    expect(result.matched_fields).toContain("phone");
    expect(result.matched_fields).not.toContain("address");
    expect(result.field_contributions).toEqual({
      name: 50,
      phone: 50,
      address: 0,
    });
    expect(result.excluded_fields).toContain("address");
  });
});