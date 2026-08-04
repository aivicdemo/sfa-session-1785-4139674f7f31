import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - AIRecommendationEngine再試行ロジック', () => {
  let mockAIRecommendationEngine: any;
  let callCount: number;
  let callTimestamps: number[];

  beforeEach(() => {
    jest.useFakeTimers();
    callCount = 0;
    callTimestamps = [];

    mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(async () => {
        callCount++;
        callTimestamps.push(Date.now());

        if (callCount === 1 || callCount === 2) {
          const error = new Error('API request timeout');
          (error as any).code = 'ECONNABORTED';
          throw error;
        }

        if (callCount === 3) {
          return {
            recommendationPatternId: 'PAT-20240115-001',
            confidenceScore: 82,
            proposalApproach: 'Multi-stage approach with executive alignment',
            successFactors: ['Customer decision speed', 'Budget alignment', 'Stakeholder buy-in'],
            reasoning: 'Similar to past success case with customer size 500-1000 employees in tech industry'
          };
        }

        throw new Error('Unexpected call count');
      })
    };
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // SCEN-570
  test('AIRecommendationEngine呼び出しがタイムアウトするとき再試行が行われる', async () => {
    const newProjectData = {
      customerId: 'CUST-20240115-001',
      customerIndustry: 'Technology',
      customerSize: 750,
      dealAmount: 500000,
      dealStage: 'Discovery',
      customerChallenges: ['Digital transformation', 'Cost optimization'],
      timeline: 90
    };

    const resultPromise = generateRecommendation(newProjectData, mockAIRecommendationEngine);

    await jest.advanceTimersByTimeAsync(1000);
    await jest.advanceTimersByTimeAsync(2000);
    await jest.advanceTimersByTimeAsync(100);

    const result = await resultPromise;

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    
    expect(result).toEqual({
      recommendationPatternId: 'PAT-20240115-001',
      confidenceScore: 82,
      proposalApproach: 'Multi-stage approach with executive alignment',
      successFactors: ['Customer decision speed', 'Budget alignment', 'Stakeholder buy-in'],
      reasoning: 'Similar to past success case with customer size 500-1000 employees in tech industry'
    });

    expect(callTimestamps.length).toBe(3);
    const firstToSecondInterval = callTimestamps[1] - callTimestamps[0];
    const secondToThirdInterval = callTimestamps[2] - callTimestamps[1];

    expect(firstToSecondInterval).toBeGreaterThanOrEqual(1000);
    expect(firstToSecondInterval).toBeLessThan(1100);
    expect(secondToThirdInterval).toBeGreaterThanOrEqual(2000);
    expect(secondToThirdInterval).toBeLessThan(2100);
  });
});