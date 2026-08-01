import { describe, test, expect } from "@jest/globals";
import { validateAndJudgeApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-720
  test("ワークショップ完了日時が設定されていないとき、承認基準判定が実行されない", () => {
    const input = {
      salesProjectId: "PRJ-2024-001",
      workshopCompletedAt: null,
      successFactors: [
        {
          factorId: "SF-001",
          description: "顧客との定期的な接触",
          frequency: 5,
          impactScore: 85,
        },
      ],
      failureFactors: [
        {
          factorId: "FF-001",
          description: "提案資料の不備",
          frequency: 2,
          impactScore: 60,
        },
      ],
      analysisData: {
        totalCasesAnalyzed: 50,
        successCount: 35,
        failureCount: 15,
      },
      evaluatorId: "USR-2024-001",
      evaluationTimestamp: new Date("2024-01-15T14:30:00Z"),
    };

    expect(() => validateAndJudgeApprovalCriteria(input)).toThrow(
      /ワークショップ完了日時/
    );
  });
});