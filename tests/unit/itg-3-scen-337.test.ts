import { verifyRecommendationAccuracyAcrossYearBoundary } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-337: 推奨精度検証機能 - 検証期間が年度をまたぐ場合、年度をまたいだ推奨が正常に計測される", () => {
    // Setup: Mock AIRecommendationEngine with cross-fiscal-year data
    const previousFiscalYearRecommendations = Array.from({ length: 10 }, (_, i) => ({
      recommendationId: `prev-rec-${i + 1}`,
      createdAt: new Date(`2024-${String(10 + Math.floor(i / 5)).padStart(2, "0")}-${String((i % 5) * 6 + 1).padStart(2, "0")}T10:00:00Z`),
      successScore: 85 + i,
      adoptionRate: 0.8,
    }));

    const currentFiscalYearRecommendations = Array.from({ length: 15 }, (_, i) => ({
      recommendationId: `curr-rec-${i + 1}`,
      createdAt: new Date(`2025-${String(4 + Math.floor(i / 5)).padStart(2, "0")}-${String((i % 5) * 6 + 1).padStart(2, "0")}T10:00:00Z`),
      successScore: 82 + i,
      adoptionRate: 0.75,
    }));

    const allRecommendations = [
      ...previousFiscalYearRecommendations,
      ...currentFiscalYearRecommendations,
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(allRecommendations),
    };

    const verificationPeriodStart = new Date("2024-10-01T00:00:00Z");
    const verificationPeriodEnd = new Date("2025-03-31T23:59:59Z");

    // Execute: Call accuracy verification function with fiscal year spanning period
    const result = verifyRecommendationAccuracyAcrossYearBoundary(
      {
        verificationPeriodStart,
        verificationPeriodEnd,
        engine: mockAIEngine,
      }
    );

    // Assert: Verify recommendations from both fiscal years were retrieved
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalled();

    // Assert: Verify total recommendation count is 25 (10 from previous + 15 from current)
    expect(result.totalRecommendationCount).toBe(25);

    // Assert: Verify metadata contains correct verification period
    expect(result.metadata.verificationPeriodStart).toBe("2024-10-01T00:00:00Z");
    expect(result.metadata.verificationPeriodEnd).toBe("2025-03-31T23:59:59Z");
    expect(result.metadata.targetRecommendationCount).toBe(25);

    // Assert: Verify year boundary crossing flag is set to success
    expect(result.metadata.yearBoundaryCrossingProcessed).toBe("success");

    // Assert: Verify accuracy score is calculated based on all 25 recommendations
    // Calculate expected accuracy: average of all successScores and adoptionRates
    const expectedAverageSuccessScore = (
      previousFiscalYearRecommendations.reduce((sum, rec) => sum + rec.successScore, 0) +
      currentFiscalYearRecommendations.reduce((sum, rec) => sum + rec.successScore, 0)
    ) / 25;
    const expectedAverageAdoptionRate = (
      previousFiscalYearRecommendations.reduce((sum, rec) => sum + rec.adoptionRate, 0) +
      currentFiscalYearRecommendations.reduce((sum, rec) => sum + rec.adoptionRate, 0)
    ) / 25;

    expect(result.accuracyMetrics.averageSuccessScore).toBeCloseTo(expectedAverageSuccessScore, 1);
    expect(result.accuracyMetrics.averageAdoptionRate).toBeCloseTo(expectedAverageAdoptionRate, 2);

    // Assert: Verify hierarchical fiscal year breakdown is present
    expect(result.fiscalYearBreakdown).toBeDefined();
    expect(result.fiscalYearBreakdown.previousFiscalYear.count).toBe(10);
    expect(result.fiscalYearBreakdown.currentFiscalYear.count).toBe(15);
    expect(result.fiscalYearBreakdown.combined.count).toBe(25);

    // Assert: Verify previous fiscal year metrics
    const prevFYAverageSuccess = previousFiscalYearRecommendations.reduce((sum, rec) => sum + rec.successScore, 0) / 10;
    expect(result.fiscalYearBreakdown.previousFiscalYear.averageSuccessScore).toBeCloseTo(prevFYAverageSuccess, 1);

    // Assert: Verify current fiscal year metrics
    const currFYAverageSuccess = currentFiscalYearRecommendations.reduce((sum, rec) => sum + rec.successScore, 0) / 15;
    expect(result.fiscalYearBreakdown.currentFiscalYear.averageSuccessScore).toBeCloseTo(currFYAverageSuccess, 1);

    // Assert: Verify combined period metrics match overall accuracy
    expect(result.fiscalYearBreakdown.combined.averageSuccessScore).toBeCloseTo(expectedAverageSuccessScore, 1);
  });
});