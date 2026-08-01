import { generateSalesRepBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-343
  test("[normal] 行動パターンスコアが昇順で正しくソートされる", () => {
    const input = {
      salesReps: [
        {
          id: "rep_A",
          name: "営業担当者A",
          behaviorPatternScore: 75,
        },
        {
          id: "rep_B",
          name: "営業担当者B",
          behaviorPatternScore: 45,
        },
        {
          id: "rep_C",
          name: "営業担当者C",
          behaviorPatternScore: 60,
        },
      ],
    };

    const report = generateSalesRepBehaviorAnalysisReport(input);

    expect(report.salesReps).toEqual([
      {
        id: "rep_B",
        name: "営業担当者B",
        behaviorPatternScore: 45,
      },
      {
        id: "rep_C",
        name: "営業担当者C",
        behaviorPatternScore: 60,
      },
      {
        id: "rep_A",
        name: "営業担当者A",
        behaviorPatternScore: 75,
      },
    ]);
  });
});