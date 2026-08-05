import { describe, test, expect } from '@jest/globals';
import { analyzeTeamSalesQualityAndDeterminePriorityWithoutBenchmark } from '../../src/logic/it-1-br-2-1-1';

describe('Team Sales Quality Statistics Analysis - Missing Benchmark Error Handling', () => {
  // SCEN-902
  test('should throw ComparisonBenchmarkNotSetError when comparison benchmark values are not configured', () => {
    const teamQualityStats = {
      conclusionRate: 0.45,
      proposalCount: 128,
      averageDealDurationDays: 32,
      followUpSuccessRate: 0.62,
      dataQualityScore: 0.88,
      processComplianceRate: 0.75,
    };

    expect(() =>
      analyzeTeamSalesQualityAndDeterminePriorityWithoutBenchmark(teamQualityStats)
    ).toThrow(/比較基準値/);
  });
});