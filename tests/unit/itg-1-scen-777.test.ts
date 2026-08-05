import { classifyIssueBySeverityAndPriority } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-777: 問題検出結果の重要度・優先度分類機能 - 中重要度・中優先度の問題は対応対象として段階的対応が必要と判定される", () => {
    // Arrange: 重要度が「中」、優先度が「中」の問題オブジェクトを生成
    const detectedIssue = {
      issue_id: "issue_001",
      severity: "medium",
      priority: "medium",
      description: "提案内容が標準プロセスから軽微に乖離している",
      detected_at: new Date("2024-01-15T10:30:00Z"),
    };

    // Act: 分類機能に問題オブジェクトを入力
    const classificationResult = classifyIssueBySeverityAndPriority(
      detectedIssue
    );

    // Assert: 対応対象フラグが true であり、対応戦略が「段階的対応」として返される
    expect(classificationResult.isTargetForAction).toBe(true);
    expect(classificationResult.actionStrategy).toBe("段階的対応");
  });
});