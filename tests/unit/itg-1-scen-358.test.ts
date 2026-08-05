import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { evaluateSystemHealthCheck } from '../../src/logic/it-1-br-2-1-1';

describe('System Health Check Pass/Fail Judgment - Sales Data Quality Score', () => {
  let mockHealthCheckContext: {
    dataQualityScore: number;
    passThreshold: number;
  };

  beforeEach(() => {
    mockHealthCheckContext = {
      dataQualityScore: 0,
      passThreshold: 80,
    };
  });

  afterEach(() => {
    mockHealthCheckContext = {
      dataQualityScore: 0,
      passThreshold: 80,
    };
  });

  // SCEN-358
  it('should return NG status when sales data quality score is just below pass threshold', () => {
    mockHealthCheckContext.dataQualityScore = 79;
    mockHealthCheckContext.passThreshold = 80;

    const result = evaluateSystemHealthCheck({
      dataQualityScore: mockHealthCheckContext.dataQualityScore,
      passThreshold: mockHealthCheckContext.passThreshold,
    });

    expect(result).toEqual({
      status: 'NG',
      score: 79,
      passThreshold: 80,
      result: 'failed',
    });
  });
});