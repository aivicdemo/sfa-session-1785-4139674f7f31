import { describe, test, expect } from "@jest/globals";
import { convertProcessStandardToSystemRequirements } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセス標準書のシステム要件変換機能", () => {
  // SCEN-130
  test("判定基準が0件の場合、変換処理がエラーになる", () => {
    const processId = "PROC-20240115-001";
    const requirementCategory = "SALES_PROCESS_STAGE";
    const judgmentCriteria: Array<{
      criteriaId: string;
      criteriaName: string;
      threshold: number;
    }> = [];
    const processName = "営業プロセス標準フロー";
    const stageDefinitions = [
      {
        stageId: "STAGE-01",
        stageName: "初回接触",
        requiredActions: ["顧客情報収集", "初期ニーズ把握"],
      },
      {
        stageId: "STAGE-02",
        stageName: "提案",
        requiredActions: ["提案資料作成", "提案実施"],
      },
    ];

    expect(() =>
      convertProcessStandardToSystemRequirements({
        processId,
        requirementCategory,
        judgmentCriteria,
        processName,
        stageDefinitions,
      })
    ).toThrow(/判定基準/);
  });
});