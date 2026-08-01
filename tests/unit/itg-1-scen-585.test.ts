import { determineProblemSeverity } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-585
  test("[normal] 問題検出結果の重要度・対応必要性判定機能 - 提案内容と顧客対応パターンの分析結果が含まれている検出結果は判定対象となる", () => {
    const detectionResult = {
      detectionId: "DET-20240115-001",
      timestamp: new Date("2024-01-15T10:30:00Z"),
      proposalContent: {
        productName: "プレミアム営業支援パッケージ",
        proposalAmount: 1500000,
        proposalDateTime: new Date("2024-01-15T09:00:00Z"),
        proposalDescription: "AI機能強化とデータ分析機能を含む",
      },
      customerResponsePattern: {
        responseType: "email_inquiry",
        responseDateTime: new Date("2024-01-15T09:45:00Z"),
        respondentName: "田中太郎",
        responseContent: "詳細な説明をいただきたい",
      },
      deviationFromStandardProcess: 0.25,
      successPatternAlignment: 0.85,
      analysisConfidence: 0.92,
    };

    const result = determineProblemSeverity(detectionResult);

    expect(result).toEqual({
      detectionId: "DET-20240115-001",
      severity: "MEDIUM",
      requiresAction: true,
      rationale:
        "提案内容と顧客対応パターンの両方が検出され、標準プロセスからの乖離度が25%で、成功パターンへの適合度が85%のため、対応が必要です",
      priority: 2,
      recommendedActionType: "follow_up_guidance",
      targetAudience: "sales_manager",
    });
  });
});