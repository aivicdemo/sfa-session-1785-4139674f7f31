import { describe, test, expect } from "@jest/globals";
import { removeDuplicatesFromCandidates } from "../../src/logic/it-1-br-2-2-1-1";

// SCEN-1096
describe("顧客データ重複判定・統合エンジン - 重複排除機能", () => {
  test("重複候補リストに重複データが含まれるとき、重複が排除される", () => {
    // 準備: 重複候補リストのテストデータ
    // レコードA: customer_id=A, name="顧客太郎"
    // レコードB: customer_id=B, name="顧客太郎" (レコードAと既に重複判定済み)
    // レコードC: customer_id=C, name="顧客太郎" (レコードBとは新規の重複候補)
    const duplicate_candidates = [
      {
        duplicate_candidate_id: 1,
        master_customer_id: "A",
        duplicate_customer_id: "B",
        confidence_score: 0.95,
        is_merged: true,
        merge_date: "2024-01-10T10:00:00Z",
      },
      {
        duplicate_candidate_id: 2,
        master_customer_id: "B",
        duplicate_customer_id: "C",
        confidence_score: 0.92,
        is_merged: false,
        merge_date: null,
      },
      {
        duplicate_candidate_id: 3,
        master_customer_id: "A",
        duplicate_customer_id: "C",
        confidence_score: 0.88,
        is_merged: false,
        merge_date: null,
      },
    ];

    // 実行: 重複排除機能を実行
    const result = removeDuplicatesFromCandidates(duplicate_candidates);

    // 検証: 返却された重複候補リストを確認
    // 期待値: 既に重複判定済み（is_merged=true）のレコードAとBの組み合わせが除外される
    // 新規の重複候補のみ（レコードBとC、レコードAとC）が2件として返却される
    expect(result.remaining_candidates).toHaveLength(2);
    expect(result.remaining_candidates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          duplicate_candidate_id: 2,
          master_customer_id: "B",
          duplicate_customer_id: "C",
          is_merged: false,
        }),
        expect.objectContaining({
          duplicate_candidate_id: 3,
          master_customer_id: "A",
          duplicate_customer_id: "C",
          is_merged: false,
        }),
      ])
    );

    // 重複数が削減されたことを確認
    expect(result.removed_count).toBe(1);
    expect(result.original_count).toBe(3);
    expect(result.final_count).toBe(2);
  });
});