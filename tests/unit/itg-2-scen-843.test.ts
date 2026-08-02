import { analyzeExecutionStatus } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析エンジン", () => {
  // SCEN-843
  test("分析対象期間が未指定のとき、エラーコード ANALYSIS_PERIOD_REQUIRED を含む ValidationError 例外が発生する", () => {
    const input_null = {
      period_start: null,
      period_end: null,
    };

    expect(() => analyzeExecutionStatus(input_null)).toThrow(/ANALYSIS_PERIOD_REQUIRED/);
  });
});