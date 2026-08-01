import { validateLearningDataAndApproveInference } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-078: [normal] AIエージェント推論実行前の学習データ量・品質検証機能 - 学習データが最小要件をちょうど満たし品質が良好な場合、推論実行が許可される", () => {
    // Arrange: テスト用の学習データセットを準備
    const learning_data_records = Array.from({ length: 500 }, (_, i) => ({
      record_id: `RECORD_${String(i + 1).padStart(5, "0")}`,
      data_quality_score: 0.85,
      timestamp: new Date("2024-01-15T10:00:00Z").toISOString(),
    }));

    const validation_input = {
      learning_data_records,
      minimum_record_count: 500,
      quality_score_threshold: 0.8,
      audit_log_enabled: true,
    };

    // Act: AIエージェント推論実行前検証モジュールを実行
    const validation_result = validateLearningDataAndApproveInference(
      validation_input
    );

    // Assert: 推論実行許可判定が許可を返し、監査ログが記録される
    expect(validation_result.approval_status).toBe("APPROVED");
    expect(validation_result.record_count).toBe(500);
    expect(validation_result.average_quality_score).toBe(0.85);
    expect(validation_result.quality_threshold_met).toBe(true);
    expect(validation_result.quantity_threshold_met).toBe(true);
    expect(validation_result.audit_log_entry).toMatch(/学習データ検証完了/);
    expect(validation_result.audit_log_entry).toMatch(/データ件数=500件/);
    expect(validation_result.audit_log_entry).toMatch(/平均品質スコア=0.85/);
    expect(validation_result.audit_log_entry).toMatch(/判定=許可/);
  });
});