import { generateSalesPersonBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-323
  test("標準プロセスからの乖離度が0%より大きく改善の対象外となる場合、正常に判定される", () => {
    const salesPersonId = "SALES-001";
    const deviationPercentage = 15;
    const improvementTargetFlag = false;

    const input = {
      salesPersonId: salesPersonId,
      deviationPercentage: deviationPercentage,
      improvementTargetFlag: improvementTargetFlag,
    };

    const result = generateSalesPersonBehaviorAnalysisReport(input);

    expect(result.deviationStatus).toBe("改善対象外");
    expect(result.improvementTargetFlag).toBe(false);
    expect(result.reportGenerationStatus).toBe("正常完了");
    expect(result.recordedDeviationValue).toBe(15);
  });
});