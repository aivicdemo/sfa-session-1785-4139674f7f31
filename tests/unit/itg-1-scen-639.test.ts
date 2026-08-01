import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateSalesRepActionPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-639
  test("過去3ヶ月間の営業活動ログが0件の場合、エラーまたはデフォルト値が返される", async () => {
    const salesRepId = "SR001";
    const systemCurrentDate = new Date("2024-01-15T09:00:00Z");
    const threeMonthsAgo = new Date("2023-10-15T09:00:00Z");

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 200,
        data: {
          sales_rep_id: salesRepId,
          activity_logs: [],
          query_period_start: threeMonthsAgo.toISOString(),
          query_period_end: systemCurrentDate.toISOString(),
          activity_count: 0,
        },
      }),
      { status: 200 }
    );

    const result = await generateSalesRepActionPatternReport(
      salesRepId,
      systemCurrentDate
    );

    const expectedAnalysisPatterns = [];
    const expectedAnalysisPeriod = "過去3ヶ月";
    const expectedAnalysisStatus = "データ不足";

    expect(result.analysis_patterns).toEqual(expectedAnalysisPatterns);
    expect(result.analysis_period).toBe(expectedAnalysisPeriod);
    expect(result.analysis_date).toBe(systemCurrentDate.toISOString());
    expect(result.analysis_status).toBe(expectedAnalysisStatus);
  });
});