import { describe, test, expect } from "@jest/globals";
import {
  generateBehaviorPatternAnalysisReport,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-166
  test("標準プロセスとの乖離パターンが正常に記録される", () => {
    // Arrange: 標準プロセス定義
    const standardProcess = [
      { stepOrder: 1, stepName: "初回訪問" },
      { stepOrder: 2, stepName: "提案資料送付" },
      { stepOrder: 3, stepName: "見積提示" },
      { stepOrder: 4, stepName: "契約締結" },
    ];

    // Arrange: 営業担当者Aの実行行動履歴（標準プロセスと異なる順序）
    const executedActions = [
      {
        actionOrder: 1,
        actionName: "初回訪問",
        executedAt: "2024-01-15T10:00:00Z",
      },
      {
        actionOrder: 2,
        actionName: "見積提示",
        executedAt: "2024-01-15T11:30:00Z",
      },
      {
        actionOrder: 3,
        actionName: "提案資料送付",
        executedAt: "2024-01-15T12:00:00Z",
      },
      {
        actionOrder: 4,
        actionName: "契約締結",
        executedAt: "2024-01-15T14:00:00Z",
      },
    ];

    // Arrange: 入力パラメータ
    const input = {
      salesRepId: "A",
      standardProcessSteps: standardProcess,
      executedActionHistory: executedActions,
      analysisDate: "2024-01-15",
    };

    // Act
    const report = generateBehaviorPatternAnalysisReport(input);

    // Assert: 乖離パターン情報が正確に記録されている
    expect(report).toEqual({
      salesRepId: "A",
      analysisDate: "2024-01-15",
      deviationPatterns: [
        {
          deviationType: "プロセスステップ順序逆転",
          deviationDescription: "提案資料送付と見積提示の実行順序が標準プロセスと相違",
          impactLevel: "中",
          detectionCount: 1,
          detectedAt: "2024-01-15T12:00:00Z",
          standardSequence: ["初回訪問", "提案資料送付", "見積提示", "契約締結"],
          actualSequence: ["初回訪問", "見積提示", "提案資料送付", "契約締結"],
        },
      ],
      complianceScore: 75,
      totalActions: 4,
      conformingActions: 3,
      deviatingActions: 1,
    });
  });
});