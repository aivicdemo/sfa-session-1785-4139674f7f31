import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨内容の根拠表示機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-603
  test('[normal] 推奨内容の根拠表示機能 - 該当する提案アプローチが0件のとき根拠情報は表示されない', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproaches: [],
        reasoning: null,
        confidenceScore: 0,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(null),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const testInputData = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社テスト',
      industry: '製造業',
      companyScale: '中堅企業',
      dealAmount: 5000000,
      dealStage: '初期提案段階',
      customerChallenges: ['コスト削減'],
    };

    const result = await generateRecommendationWithReasoning(
      testInputData,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      recommendedApproaches: [],
      reasoningText: null,
      reasoningExplanation: null,
      confidenceScore: 0,
      hasRecommendation: false,
    });

    expect(result.recommendedApproaches).toHaveLength(0);
    expect(result.reasoningText).toBeNull();
    expect(result.reasoningExplanation).toBeNull();
    expect(result.confidenceScore).toBe(0);
    expect(result.hasRecommendation).toBe(false);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-20240115-001',
        industry: '製造業',
      })
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-20240115-001',
        customerName: '株式会社テスト',
      })
    );
  });
});