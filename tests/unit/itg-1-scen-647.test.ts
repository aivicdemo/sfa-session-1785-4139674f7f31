import { generateSalesActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-647
  test("[normal] 業務上の最大規模（1000件以上の営業活動）を処理する場合、正確に計算される", () => {
    // テストデータ準備: 1000件以上の営業活動データ
    const salesActivities = [];
    
    // 営業担当者A: 325件の訪問、成約75件
    for (let i = 0; i < 325; i++) {
      salesActivities.push({
        salesPersonId: "A",
        activityDateTime: new Date("2024-01-01T09:00:00Z").getTime() + i * 3600000,
        activityType: "visit",
        amount: 1250000,
        successFlag: i < 75 ? true : false
      });
    }
    
    // 営業担当者B: 320件の訪問、成約64件
    for (let i = 0; i < 320; i++) {
      salesActivities.push({
        salesPersonId: "B",
        activityDateTime: new Date("2024-01-01T10:00:00Z").getTime() + i * 3600000,
        activityType: "visit",
        amount: 1100000,
        successFlag: i < 64 ? true : false
      });
    }
    
    // 営業担当者C: 355件の訪問、成約85件
    for (let i = 0; i < 355; i++) {
      salesActivities.push({
        salesPersonId: "C",
        activityDateTime: new Date("2024-01-01T11:00:00Z").getTime() + i * 3600000,
        activityType: "visit",
        amount: 1400000,
        successFlag: i < 85 ? true : false
      });
    }
    
    const input = {
      salesActivities: salesActivities,
      analysisStartDate: "2024-01-01",
      analysisEndDate: "2024-01-31"
    };
    
    const startTime = Date.now();
    const report = generateSalesActivityPatternAnalysisReport(input);
    const endTime = Date.now();
    
    // レポート生成完了確認
    expect(report).toBeDefined();
    expect(report.reportId).toBeDefined();
    expect(report.generatedDateTime).toBeDefined();
    
    // 処理件数が1000件以上であることを確認
    expect(report.totalProcessedActivities).toBe(1000);
    
    // 営業担当者ごとの集計値検証
    const reportDataA = report.salesPersonAnalysisList.find((item: any) => item.salesPersonId === "A");
    expect(reportDataA).toBeDefined();
    expect(reportDataA.visitCount).toBe(325);
    expect(Math.round(reportDataA.successRate * 1000) / 1000).toBe(0.231);
    expect(Math.round(reportDataA.averageContractAmount * 100) / 100).toBe(1250000);
    
    const reportDataB = report.salesPersonAnalysisList.find((item: any) => item.salesPersonId === "B");
    expect(reportDataB).toBeDefined();
    expect(reportDataB.visitCount).toBe(320);
    expect(Math.round(reportDataB.successRate * 1000) / 1000).toBe(0.2);
    expect(Math.round(reportDataB.averageContractAmount * 100) / 100).toBe(1100000);
    
    const reportDataC = report.salesPersonAnalysisList.find((item: any) => item.salesPersonId === "C");
    expect(reportDataC).toBeDefined();
    expect(reportDataC.visitCount).toBe(355);
    expect(Math.round(reportDataC.successRate * 1000) / 1000).toBe(0.239);
    expect(Math.round(reportDataC.averageContractAmount * 100) / 100).toBe(1400000);
    
    // 合計値検証
    expect(report.totalVisitCount).toBe(1000);
    expect(report.totalSuccessfulContracts).toBe(224);
    
    // 行動パターン分類結果検証
    const patternA = reportDataA.behaviorPattern;
    expect(patternA).toBeDefined();
    expect(["high_visit_type", "high_contract_rate_type", "balanced_type"].includes(patternA)).toBe(true);
    
    const patternB = reportDataB.behaviorPattern;
    expect(patternB).toBeDefined();
    expect(["high_visit_type", "high_contract_rate_type", "balanced_type"].includes(patternB)).toBe(true);
    
    const patternC = reportDataC.behaviorPattern;
    expect(patternC).toBeDefined();
    expect(["high_visit_type", "high_contract_rate_type", "balanced_type"].includes(patternC)).toBe(true);
    
    // 処理完了時間が60秒以内であることを確認
    const processingTime = endTime - startTime;
    expect(processingTime).toBeLessThan(60000);
    
    // レポート内の統計情報が正確であることを確認
    expect(report.averageSuccessRateAcrossTeam).toBeDefined();
    expect(report.averageSuccessRateAcrossTeam).toBeGreaterThan(0);
    expect(report.averageSuccessRateAcrossTeam).toBeLessThanOrEqual(1);
  });
});