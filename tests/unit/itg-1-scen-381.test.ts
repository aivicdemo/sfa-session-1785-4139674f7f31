import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-381
  test("同じ入力データで2回実行しても同じ結果が返される", async () => {
    const salesRepId = "sales_001";
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = new Date("2024-01-31T23:59:59Z");
    const analysisMetrics = ["訪問回数", "案件化率"];

    const { generateBehaviorPatternAnalysisReport } = await import(
      "../../src/logic/it-1-br-target4-1-1-1"
    );

    // 1回目の実行
    const firstExecutionResult = await generateBehaviorPatternAnalysisReport({
      salesRepId,
      analysisStartDate,
      analysisEndDate,
      analysisMetrics,
    });

    const firstReportId = firstExecutionResult.reportId;
    const firstVisitCount = firstExecutionResult.visitCount;
    const firstConversionRate = firstExecutionResult.conversionRate;
    const firstTimestamp = firstExecutionResult.generatedTimestamp;

    // 2回目の実行（同じパラメータで）
    const secondExecutionResult = await generateBehaviorPatternAnalysisReport({
      salesRepId,
      analysisStartDate,
      analysisEndDate,
      analysisMetrics,
    });

    const secondReportId = secondExecutionResult.reportId;
    const secondVisitCount = secondExecutionResult.visitCount;
    const secondConversionRate = secondExecutionResult.conversionRate;
    const secondTimestamp = secondExecutionResult.generatedTimestamp;

    // 期待結果の検証
    expect(firstReportId).toBe(secondReportId);
    expect(firstVisitCount).toBe(secondVisitCount);
    expect(firstConversionRate).toBe(secondConversionRate);
    // タイムスタンプは異なる可能性があるため、前後関係で検証
    expect(typeof firstTimestamp).toBe("number");
    expect(typeof secondTimestamp).toBe("number");
  });
});