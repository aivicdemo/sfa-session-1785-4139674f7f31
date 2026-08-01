import { analyzeProcessDeviationAndCorrelation } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-852
  test("営業プロセス標準書が未入力の場合、ERR_PROCESS_STANDARD_MISSING エラーを発生させる", () => {
    const nullProcessStandard = null;
    const salesData = {
      revenue: 5000000,
      dealCount: 25,
      conversionRate: 0.64,
    };

    expect(() =>
      analyzeProcessDeviationAndCorrelation(nullProcessStandard, salesData)
    ).toThrow(/営業プロセス標準書/);
  });
});