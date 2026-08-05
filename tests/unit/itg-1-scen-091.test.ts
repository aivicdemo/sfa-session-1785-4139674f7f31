import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateSalesPersonAnalysisReport } from "../../src/logic/it-1-br-2-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-091
  test("営業担当者行動パターン分析レポート生成機能 - 月次営業会議完了後に営業担当者1人の分析レポートが正常に生成される", async () => {
    const salesPersonId = "TEST_SALES_001";
    const salesPersonName = "山田太郎";
    const targetMonth = "2024-01";
    const conferenceDate = "2024-01-31";
    const visitCount = 12;
    const proposalSuccessRate = 75;
    const avgMeetingDurationMinutes = 45;

    const mockAnalysisResponse = {
      salesPersonId,
      visitCount,
      proposalSuccessRate,
      avgMeetingDurationMinutes,
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockAnalysisResponse), {
      status: 200,
    });

    const input = {
      salesPersonId,
      targetMonth,
      conferenceCompletionDate: conferenceDate,
      conferenceCompleted: true,
    };

    const result = await generateSalesPersonAnalysisReport(input);

    expect(result).toBeDefined();
    expect(result.reportId).toBeDefined();
    expect(result.reportId).toMatch(/^RPT_/);
    expect(result.salesPersonId).toBe(salesPersonId);
    expect(result.targetPeriod).toBe(targetMonth);
    expect(result.status).toBe("完成");
    expect(result.generatedAt).toBeDefined();
    expect(new Date(result.generatedAt).toISOString()).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(result.analysisResult.visitCount).toBe(visitCount);
    expect(result.analysisResult.proposalSuccessRate).toBe(proposalSuccessRate);
    expect(result.analysisResult.avgMeetingDurationMinutes).toBe(
      avgMeetingDurationMinutes
    );
    expect(result.conferenceCompletedFlag).toBe(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[0]).toMatch(/analysis/i);
  });
});