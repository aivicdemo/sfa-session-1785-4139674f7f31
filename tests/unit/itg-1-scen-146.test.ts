import { describe, test, expect } from "@jest/globals";
import { generateSalesBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-146
  test("標準プロセスのステップ情報が欠落しているとき、エラーが発生する", () => {
    const sales_id = "sales_001";
    const period_start = "2024-01-01";
    const period_end = "2024-01-31";

    const incomplete_process_definition = {
      process_id: "proc_001",
      steps: [
        {
          step_id: "step_001",
          step_name: null,
          order: 1,
        },
      ],
    };

    expect(() =>
      generateSalesBehaviorAnalysisReport(
        sales_id,
        period_start,
        period_end,
        incomplete_process_definition
      )
    ).toThrow(/ステップ名/);

    try {
      generateSalesBehaviorAnalysisReport(
        sales_id,
        period_start,
        period_end,
        incomplete_process_definition
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.name).toBe("ValidationError");
        expect(error.message).toContain(
          "標準プロセスのステップ情報が欠落しています。ステップ名を確認してください"
        );
      }
    }

    const error_result = (() => {
      try {
        generateSalesBehaviorAnalysisReport(
          sales_id,
          period_start,
          period_end,
          incomplete_process_definition
        );
        return null;
      } catch (err: unknown) {
        if (err instanceof Error && "code" in err) {
          return (err as Error & { code: string }).code;
        }
        return null;
      }
    })();

    expect(error_result).toBe("ERR_PROCESS_STEP_MISSING");
  });
});