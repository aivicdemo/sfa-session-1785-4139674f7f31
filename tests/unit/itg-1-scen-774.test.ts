import { classifyProblemSeverityAndPriority } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-774: 検出された問題が1件の場合、重要度と優先度で分類される", () => {
    // Arrange
    const detectedProblem = {
      problem_id: "prob_001",
      problem_type: "営業プロセス違反",
      detected_at: "2024-01-15T09:30:00Z",
      sales_staff_id: "staff_123",
      description: "標準プロセスのステップ2が実行されていない",
      impact_score: 7.5,
      frequency_count: 3,
    };

    // Act
    const classification_result = classifyProblemSeverityAndPriority(
      detectedProblem
    );

    // Assert
    // 重要度の分類が存在し、「高・中・低」のいずれかであることを確認
    expect(classification_result).toHaveProperty("severity");
    expect(["high", "medium", "low"]).toContain(classification_result.severity);

    // 優先度の分類が存在し、「緊急・高・中・低」のいずれかであることを確認
    expect(classification_result).toHaveProperty("priority");
    expect(["urgent", "high", "medium", "low"]).toContain(
      classification_result.priority
    );

    // 問題IDが結果に含まれていることを確認
    expect(classification_result).toHaveProperty("problem_id");
    expect(classification_result.problem_id).toBe("prob_001");

    // 分類された結果が具体的な値を持つことを確認
    expect(typeof classification_result.severity).toBe("string");
    expect(typeof classification_result.priority).toBe("string");
  });
});