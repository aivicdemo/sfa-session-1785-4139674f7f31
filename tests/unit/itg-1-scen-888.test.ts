import { describe, test, expect } from "@jest/globals";
import { analyzeTeamSalesQualityStatistics } from "../../src/logic/it-1-br-2-1-1";

describe("チーム営業品質統計分析機能", () => {
  // SCEN-888
  test("分析対象期間の開始日が終了日より後のとき、エラーになる", () => {
    const start_date = new Date("2024-12-31T00:00:00Z");
    const end_date = new Date("2024-12-25T00:00:00Z");

    expect(() =>
      analyzeTeamSalesQualityStatistics({
        start_date,
        end_date,
      })
    ).toThrow(/分析対象期間の開始日は終了日以前の日付/);
  });
});