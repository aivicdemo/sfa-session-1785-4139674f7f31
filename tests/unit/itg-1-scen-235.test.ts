import { describe, test, expect } from "@jest/globals";
import { calculateProcessComplianceScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-235: [error] 標準プロセス遵守度スコア計算機能 - 商談記録に含まれるステップが標準プロセス定義に存在しないときエラーになる
  test("標準プロセスに存在しないステップが商談記録に含まれる場合、エラーをスロー", () => {
    const standardProcessDefinition = {
      steps: [
        {
          stepId: "step_001",
          stepName: "初期接触",
          sequence: 1,
        },
        {
          stepId: "step_002",
          stepName: "提案",
          sequence: 2,
        },
        {
          stepId: "step_003",
          stepName: "契約",
          sequence: 3,
        },
      ],
    };

    const dealRecord = {
      dealId: "deal_001",
      steps: [
        {
          stepName: "初期接触",
          executedAt: "2024-01-15T10:00:00Z",
        },
        {
          stepName: "提案",
          executedAt: "2024-01-16T14:30:00Z",
        },
        {
          stepName: "見積提示",
          executedAt: "2024-01-17T09:15:00Z",
        },
        {
          stepName: "契約",
          executedAt: "2024-01-18T11:00:00Z",
        },
      ],
    };

    expect(() =>
      calculateProcessComplianceScore(dealRecord, standardProcessDefinition)
    ).toThrow(/見積提示/);
  });
});