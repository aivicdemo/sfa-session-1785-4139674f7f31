import { generateSalesProcessAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-347
  test("営業プロセス実行状況のステップ完了状況が乖離度計算に正しく反映される", () => {
    const salesRepresentativeA = {
      id: "rep_A",
      name: "営業担当者A",
      completedSteps: 8,
      totalSteps: 10,
    };

    const salesRepresentativeB = {
      id: "rep_B",
      name: "営業担当者B",
      completedSteps: 6,
      totalSteps: 10,
    };

    const salesRepresentativeC = {
      id: "rep_C",
      name: "営業担当者C",
      completedSteps: 10,
      totalSteps: 10,
    };

    const processExecutionDataList = [
      salesRepresentativeA,
      salesRepresentativeB,
      salesRepresentativeC,
    ];

    const report = generateSalesProcessAnalysisReport(processExecutionDataList);

    expect(report).toEqual({
      analysisResults: [
        {
          representativeId: "rep_A",
          representativeName: "営業担当者A",
          completedSteps: 8,
          totalSteps: 10,
          deviationPercentage: 20,
        },
        {
          representativeId: "rep_B",
          representativeName: "営業担当者B",
          completedSteps: 6,
          totalSteps: 10,
          deviationPercentage: 40,
        },
        {
          representativeId: "rep_C",
          representativeName: "営業担当者C",
          completedSteps: 10,
          totalSteps: 10,
          deviationPercentage: 0,
        },
      ],
    });
  });
});