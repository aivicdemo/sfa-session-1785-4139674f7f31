import {
  integrateDuplicateCandidates,
} from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-340
  test("重複候補が1件の場合、統合判定が実行され判定完了ステータスが返される", () => {
    const duplicateCandidates = [
      {
        candidate_id: "DUP-001",
        customer_id_1: "CUST-101",
        customer_id_2: "CUST-102",
        match_score: 0.95,
        match_reason: "company_name_phone_match",
        detected_at: new Date("2024-01-15T10:00:00Z"),
      },
    ];

    const result = integrateDuplicateCandidates(duplicateCandidates);

    expect(result.status).toBe("判定実行完了");
    expect(result.reason).toBe("単一重複候補に対する統合判定を実行");
    expect(result.candidates_count).toBe(1);
    expect(result.processed_at).toEqual(expect.any(Date));
  });
});