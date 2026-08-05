import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type { ProcessStageRequirementSpec } from "../../src/logic/it-1/types";
import { generateProcessStageRequirementSpec } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-165: [normal] プロセス段階の要件仕様化機能 - プロセス段階に紐づく判定基準が1個の場合、単一判定基準が要件に正しく反映される
  test("should correctly reflect single evaluation criterion in process stage requirement specification", () => {
    const processStageInput = {
      stageId: "STAGE_001",
      stageName: "提案審査",
      evaluationCriteria: [
        {
          criteriaId: "CRITERIA_001",
          criteriaName: "提案金額が予算内か",
          evaluationLogic: "amount <= budget",
        },
      ],
    };

    const result = generateProcessStageRequirementSpec(processStageInput);

    expect(result).toBeDefined();
    expect(result.stageId).toBe("STAGE_001");
    expect(result.stageName).toBe("提案審査");
    expect(result.evaluationCriteria).toHaveLength(1);
    expect(result.evaluationCriteria[0].criteriaId).toBe("CRITERIA_001");
    expect(result.evaluationCriteria[0].criteriaName).toBe("提案金額が予算内か");
    expect(result.evaluationCriteria[0].evaluationLogic).toBe("amount <= budget");
    expect(result.requirementSpecContent).toContain("提案金額が予算内か");
    expect(result.requirementSpecContent).toContain("CRITERIA_001");
    expect(result.requirementSpecContent).toContain("amount <= budget");
  });
});