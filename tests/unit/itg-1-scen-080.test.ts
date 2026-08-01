import { validateLearningDataForInference } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-080: [edge] AIエージェント推論実行前の学習データ量・品質検証機能 - 学習データが最小要件を1件上回る場合、推論実行が許可される
  test("学習データが最小要件を1件上回る場合、推論実行が許可される", () => {
    // 前提: 学習データの最小要件が100件
    const minimum_required_count = 100;

    // 学習データベースに最小要件を1件上回るデータ件数（101件）を格納
    const actual_learning_data_count = 101;

    // 学習データ品質検証：全データが品質基準を満たす状態
    const quality_check_result = true;

    // 推論実行許可判定メソッドを呼び出す
    const result = validateLearningDataForInference({
      actual_count: actual_learning_data_count,
      minimum_required_count: minimum_required_count,
      quality_check_passed: quality_check_result,
      audit_log_entries: [],
    });

    // 期待結果:
    // 1. 推論実行許可判定メソッドが true を返す
    expect(result.is_inference_permitted).toBe(true);

    // 2. AIエージェントの推論実行ステータスが『実行許可』に遷移
    expect(result.inference_status).toBe("実行許可");

    // 3. 監査ログに『学習データ件数: 101件、最小要件: 100件、判定結果: 許可』と記録されること
    expect(result.audit_log_entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          learning_data_count: 101,
          minimum_required_count: 100,
          judgment_result: "許可",
        }),
      ])
    );

    // 4. ログエントリが最低1件以上存在すること
    expect(result.audit_log_entries.length).toBeGreaterThanOrEqual(1);
  });
});