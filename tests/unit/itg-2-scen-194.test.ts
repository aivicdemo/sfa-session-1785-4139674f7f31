import { detectDuplicateCustomersAndExecuteMergeJudgment } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-194
  test("重複候補顧客が複数件のとき、全ペアに対して統合判定が実行される", () => {
    // Arrange: 重複候補となる3件の顧客レコード
    const duplicateCandidates = [
      {
        customer_id: 1001,
        customer_name: "田中太郎",
        phone_number: "090-1234-5678",
      },
      {
        customer_id: 1002,
        customer_name: "田中太郎",
        phone_number: "090-1234-5678",
      },
      {
        customer_id: 1003,
        customer_name: "田中太郎",
        phone_number: "090-1234-5678",
      },
    ];

    // Act: 統合判定プロセスを実行
    const result = detectDuplicateCustomersAndExecuteMergeJudgment({
      duplicate_candidates: duplicateCandidates,
    });

    // Assert: 全ペア（A-B、B-C、A-C）計3ペアに対して統合判定が実行されたことを確認
    expect(result.merge_judgments).toHaveLength(3);

    // 各ペアの統合判定レコードが生成されていることを確認
    expect(result.merge_judgments[0]).toEqual({
      merge_judgment_id: expect.any(String),
      customer_id_1: 1001,
      customer_id_2: 1002,
      judgment_status: "完了",
      judgment_reason: expect.any(String),
      created_at: expect.any(String),
    });

    expect(result.merge_judgments[1]).toEqual({
      merge_judgment_id: expect.any(String),
      customer_id_1: 1002,
      customer_id_2: 1003,
      judgment_status: "完了",
      judgment_reason: expect.any(String),
      created_at: expect.any(String),
    });

    expect(result.merge_judgments[2]).toEqual({
      merge_judgment_id: expect.any(String),
      customer_id_1: 1001,
      customer_id_2: 1003,
      judgment_status: "完了",
      judgment_reason: expect.any(String),
      created_at: expect.any(String),
    });

    // 全ペアのステータスが「完了」であることを確認
    result.merge_judgments.forEach((judgment) => {
      expect(judgment.judgment_status).toBe("完了");
      expect(judgment.judgment_reason).toBeTruthy();
    });

    // 処理されたペア数を確認（3ペア）
    expect(result.total_pairs_judged).toBe(3);
  });
});