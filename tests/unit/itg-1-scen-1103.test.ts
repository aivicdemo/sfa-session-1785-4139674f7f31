import {
  analyzeVSalesPersonBehaviorPatternAndProcessDeviation,
} from "../../src/logic/it-1-br-2-1-1";

describe(
  "Sales person behavior pattern and process deviation analysis - idempotent analysis",
  () => {
    // SCEN-1103
    test("should return identical analysis results when executed twice with same input data and parameters", () => {
      // Arrange: Test data for sales person A001 covering Jan-Mar 2024
      const salesPersonId = "A001";
      const analysisStartDate = new Date("2024-01-01T00:00:00Z");
      const analysisEndDate = new Date("2024-03-31T23:59:59Z");

      const behaviorData = {
        salesPersonId: salesPersonId,
        visitCount: 24,
        proposalDocumentCount: 18,
        dealClosedCount: 6,
        followUpEmailCount: 42,
        phoneCallCount: 36,
        averageDaysToClose: 28,
        totalProposalValue: 5200000,
      };

      const analysisParams = {
        salesPersonId: salesPersonId,
        analysisStartDate: analysisStartDate,
        analysisEndDate: analysisEndDate,
        analysisMetrics: [
          "behavior_pattern",
          "process_deviation_degree",
        ],
      };

      // Act: Execute first analysis
      const firstAnalysisResult =
        analyzeVSalesPersonBehaviorPatternAndProcessDeviation(
          behaviorData,
          analysisParams
        );

      // Act: Execute second analysis with identical inputs
      const secondAnalysisResult =
        analyzeVSalesPersonBehaviorPatternAndProcessDeviation(
          behaviorData,
          analysisParams
        );

      // Assert: Verify idempotency - both results must be identical
      expect(firstAnalysisResult.behaviorPatternScore).toBe(
        secondAnalysisResult.behaviorPatternScore
      );
      expect(firstAnalysisResult.standardProcessDeviationRate).toBe(
        secondAnalysisResult.standardProcessDeviationRate
      );
      expect(firstAnalysisResult.deviationClassification).toBe(
        secondAnalysisResult.deviationClassification
      );

      // Assert: Verify specific expected values from business rule calculation
      // Based on input metrics: behavior pattern score should be deterministic
      expect(firstAnalysisResult.behaviorPatternScore).toBeCloseTo(78.5, 1);
      expect(firstAnalysisResult.standardProcessDeviationRate).toBeCloseTo(
        12.34,
        2
      );
      expect(firstAnalysisResult.deviationClassification).toBe("軽度乖離");

      // Assert: Verify result structure consistency across both executions
      expect(firstAnalysisResult).toEqual(secondAnalysisResult);
      expect(typeof firstAnalysisResult.analyzedAt).toBe("string");
      expect(firstAnalysisResult.analysisTimeMs).toBe(
        secondAnalysisResult.analysisTimeMs
      );
      expect(firstAnalysisResult.analysisStatus).toBe("completed");
    });
  }
);