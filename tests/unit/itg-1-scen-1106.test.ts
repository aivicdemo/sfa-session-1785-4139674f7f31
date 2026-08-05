import { generateSalesPersonBehaviorPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-1106
  test("[error] 営業担当者IDが欠落しているとき、エラーが発生すること", () => {
    expect(() =>
      generateSalesPersonBehaviorPatternReport({
        salesPersonId: null as any,
        analysisStartDate: "2024-01-01",
        analysisEndDate: "2024-01-31",
      })
    ).toThrow(/営業担当者ID/);
  });
});