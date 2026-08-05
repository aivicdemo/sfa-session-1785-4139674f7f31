import { describe, test, expect } from "@jest/globals";
import { analyzeAndJudgeSalesPersonImprovement } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-279: 営業担当者IDがnullのとき処理が中断される", () => {
    const invalidInput = {
      salesPersonId: null,
      behaviorPatternData: {
        contactFrequency: 5,
        proposalSuccessRate: 0.65,
        followUpIntervalDays: 3,
      },
      standardProcessSteps: [
        { stepName: "初回接触", completionRate: 0.85 },
        { stepName: "提案", completionRate: 0.78 },
        { stepName: "交渉", completionRate: 0.72 },
        { stepName: "成約", completionRate: 0.68 },
      ],
      contractResultData: {
        totalContracts: 10,
        successfulContracts: 7,
        contractRate: 0.7,
      },
    };

    expect(() =>
      analyzeAndJudgeSalesPersonImprovement(invalidInput)
    ).toThrow(/INVALID_SALES_PERSON_ID/);
  });
});