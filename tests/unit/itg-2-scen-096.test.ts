import { executeDuplicateDetectionAndMergeJudgment } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-096: 重複候補が1件の場合、その1件に対する統合判定を実行する", () => {
    // 入力データ: 重複候補が1件のシナリオ
    const duplicateCandidates = [
      {
        customer_id_a: "001",
        customer_name_a: "山田太郎",
        customer_email_a: "yamada@example.com",
        customer_id_b: "002",
        customer_name_b: "山田太郎",
        customer_email_b: "yamada.taro@example.com",
        match_score: 92,
        detection_reason: "名前とメールドメイン一致",
      },
    ];

    const execution_datetime = new Date("2024-01-15T10:00:00Z");

    // 関数実行
    const result = executeDuplicateDetectionAndMergeJudgment(
      duplicateCandidates,
      execution_datetime
    );

    // 期待結果の検証
    // 1. 統合判定結果オブジェクトが返却されること
    expect(result).toBeDefined();

    // 2. 対象顧客IDペアが正しく返却されること
    expect(result.target_customer_ids).toEqual(["001", "002"]);

    // 3. 判定ステータスが「統合待ち」であること
    expect(result.merge_judgment_status).toBe("統合待ち");

    // 4. マッチスコアが90以上であること
    expect(result.match_score).toBeGreaterThanOrEqual(90);
    expect(result.match_score).toBe(92);

    // 5. 判定実行日時がシステムに記録されていること
    expect(result.judgment_executed_datetime).toEqual(execution_datetime);

    // 6. 重複候補件数が1件のみであること
    expect(result.duplicate_candidate_count).toBe(1);
  });
});