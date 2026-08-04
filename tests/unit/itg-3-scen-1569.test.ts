import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1569: 推奨内容が空のとき、エラーが発生する', () => {
    const stubAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '',
        confidence: 0,
        patterns: [],
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerInfo = {
      customerId: 'CUST-001',
      industry: '製造業',
      budget: 5000000,
    };

    const dealCondition = {
      stage: '提案前',
      competitorCount: 2,
    };

    const result = visualizeRecommendationReasoning(
      customerInfo,
      dealCondition,
      stubAIEngine
    );

    expect(result).toEqual({
      success: false,
      error: {
        code: 'EMPTY_RECOMMENDATION_CONTENT',
        message: '推奨内容が空です。AIエンジンから有効な推奨が生成されませんでした。',
        httpStatus: 400,
      },
      displayMessage: '推奨内容に基づいた根拠説明を表示できません',
      reasoning: null,
    });
  });
});