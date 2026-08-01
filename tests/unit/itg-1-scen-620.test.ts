import {
  generateSalesActivityPatternReport,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-620
  test("[edge] フォローアップ成功率が0の場合、正常に集計される", () => {
    const salesRepresentativeId = "rep-001";
    const followUpCount = 5;
    const followUpSuccessCount = 0;

    const reportInput = {
      salesRepresentativeId: salesRepresentativeId,
      followUpCount: followUpCount,
      followUpSuccessCount: followUpSuccessCount,
    };

    const generatedReport = generateSalesActivityPatternReport(reportInput);

    const followUpSuccessRate = generatedReport.followUpSuccessRate;
    const reportFollowUpCount = generatedReport.followUpCount;
    const reportFollowUpSuccessCount = generatedReport.followUpSuccessCount;

    expect(followUpSuccessRate).toBe(0);
    expect(reportFollowUpCount).toBe(5);
    expect(reportFollowUpSuccessCount).toBe(0);
  });
});