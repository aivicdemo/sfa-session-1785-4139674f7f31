import {
  calculateCorrelationWithDeviationAndSalesResults,
} from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-291: 成約実績データが存在しないのに乖離度が 0 のとき、相関計算ができず処理が中断される", () => {
    // 入力データ: 成約実績データが空、乖離度が 0
    const deviationScore = 0;
    const salesResultsData: Array<{
      dealId: string;
      amount: number;
      closedAt: string;
    }> = [];

    // 相関計算処理を実行
    expect(() => {
      calculateCorrelationWithDeviationAndSalesResults(
        deviationScore,
        salesResultsData
      );
    }).toThrow(/成約実績/);
  });
});