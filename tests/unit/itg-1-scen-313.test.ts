import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-313
  test("指定期間内に営業活動ログが0件の場合、行動パターンスコアが計算されない", () => {
    const salesRepId = "SR-001";
    const startDate = new Date("2024-01-01T00:00:00Z");
    const endDate = new Date("2024-01-31T23:59:59Z");

    const activityLogs: Array<{
      salesRepId: string;
      activityDate: Date;
      activityType: string;
    }> = [];

    const result = generateBehaviorPatternAnalysisReport({
      salesRepId,
      startDate,
      endDate,
      activityLogs,
    });

    expect(result.visitCountScore).toBeNull();
    expect(result.proposalCountScore).toBeNull();
    expect(result.closingRateScore).toBeNull();
    expect(result.followUpFrequencyScore).toBeNull();
    expect(result.status).toBe("データ不足");
    expect(result.isScoreCalculationSkipped).toBe(true);
  });
});