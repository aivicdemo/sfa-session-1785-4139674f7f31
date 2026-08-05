import { describe, test, expect, beforeEach } from "@jest/globals";
import { analyzeMonthlyMonitoringAggregation } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-286
  test("月次モニタリング集計期間の開始日が終了日より後の場合、処理が中断される", () => {
    const aggregation_start_date = new Date("2024-01-31T00:00:00Z");
    const aggregation_end_date = new Date("2024-01-01T00:00:00Z");

    expect(() =>
      analyzeMonthlyMonitoringAggregation({
        aggregation_start_date,
        aggregation_end_date,
      })
    ).toThrow(/集計開始日は集計終了日以前の日付を指定してください/);
  });
});