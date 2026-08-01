import { generateSalesProcessAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-348
  test("営業プロセスの遅延検知が乖離度に含まれる", () => {
    const salesRepId = "sales_rep_A";
    const reportGenerationDate = new Date("2024-01-31T23:59:59Z");
    
    // 営業担当者Aのテストデータ準備
    // 標準営業プロセス期間：45日
    // 実績期間：60日（遅延日数：15日）
    const standardProcessDaysRequired = 45;
    const actualProcessDaysRequired = 60;
    const processDelayDays = actualProcessDaysRequired - standardProcessDaysRequired;
    const expectedDelayPercentage = (processDelayDays / standardProcessDaysRequired) * 100;

    const analysisData = {
      salesRepId: salesRepId,
      reportDate: reportGenerationDate,
      analysisInputs: {
        dealsClosed: [
          {
            dealId: "deal_001",
            initialContactDate: new Date("2024-01-01T09:00:00Z"),
            contractSignedDate: new Date("2024-03-01T17:00:00Z"),
            actualDaysToClose: 60,
            standardDaysToClose: 45,
            proposalCount: 2,
            customerResponseRate: 0.75,
            followUpFrequency: 3,
          },
          {
            dealId: "deal_002",
            initialContactDate: new Date("2023-12-15T10:00:00Z"),
            contractSignedDate: new Date("2024-02-13T16:00:00Z"),
            actualDaysToClose: 60,
            standardDaysToClose: 45,
            proposalCount: 2,
            customerResponseRate: 0.80,
            followUpFrequency: 3,
          },
        ],
        standardProcessStepsCompleted: [
          {
            stepName: "初回接触",
            completionRate: 1.0,
            averageDaysFromStart: 2,
            standardDaysFromStart: 1,
          },
          {
            stepName: "提案",
            completionRate: 1.0,
            averageDaysFromStart: 20,
            standardDaysFromStart: 10,
          },
          {
            stepName: "交渉",
            completionRate: 1.0,
            averageDaysFromStart: 45,
            standardDaysFromStart: 30,
          },
          {
            stepName: "成約",
            completionRate: 1.0,
            averageDaysFromStart: 60,
            standardDaysFromStart: 45,
          },
        ],
        successfulDealsCount: 2,
        totalDealsAttempted: 2,
      },
    };

    const result = generateSalesProcessAnalysisReport(analysisData);

    expect(result).toBeDefined();
    expect(result.salesRepId).toBe(salesRepId);
    expect(result.reportDate).toEqual(reportGenerationDate);

    // レポート内の『乖離度』セクションを確認
    expect(result.deviationAnalysis).toBeDefined();
    expect(result.deviationAnalysis.processDelayDetection).toBeDefined();

    // 営業プロセスの遅延検知が乖離度に含まれているか検証
    expect(result.deviationAnalysis.processDelayDetection.delayDays).toBe(
      processDelayDays
    );
    expect(result.deviationAnalysis.processDelayDetection.delayDays).toBe(15);

    // 遅延日数がパーセンテージまたは指数値として乖離度スコアに反映されているか確認
    // 期待値：遅延日数15日がパーセンテージで33.3%（四捨五入）
    const calculatedDelayPercentage = Math.round(expectedDelayPercentage * 10) / 10;
    expect(result.deviationAnalysis.processDelayDetection.delayPercentage).toBe(
      calculatedDelayPercentage
    );
    expect(result.deviationAnalysis.processDelayDetection.delayPercentage).toBe(
      33.3
    );

    // 乖離度スコア全体に遅延が反映されているか確認
    expect(result.deviationAnalysis.totalDeviationScore).toBeDefined();
    expect(typeof result.deviationAnalysis.totalDeviationScore).toBe("number");
    expect(result.deviationAnalysis.totalDeviationScore).toBeGreaterThan(0);

    // 乖離度の内訳説明に『営業プロセス遅延検知：15日』という項目が明示されているか確認
    expect(result.deviationAnalysis.deviationBreakdown).toBeDefined();
    expect(Array.isArray(result.deviationAnalysis.deviationBreakdown)).toBe(
      true
    );

    const processDelayBreakdownItem = result.deviationAnalysis.deviationBreakdown.find(
      (item: { category: string; delayDays?: number }) =>
        item.category === "営業プロセス遅延検知"
    );
    expect(processDelayBreakdownItem).toBeDefined();
    expect(processDelayBreakdownItem.delayDays).toBe(15);

    // レポートメタデータの確認
    expect(result.generatedAt).toEqual(reportGenerationDate);
    expect(result.analysisMetadata).toBeDefined();
    expect(result.analysisMetadata.dealsAnalyzed).toBe(2);
    expect(result.analysisMetadata.successRate).toBe(1.0);
  });
});