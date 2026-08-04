import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能', () => {
  test('SCEN-2626: 成功パターンテンプレートが0件のとき、判定エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerCondition = {
      industry: '小売',
      budget: 5000000,
      challenge: '在庫管理',
    };

    const dealCondition = {
      productCategory: '在庫管理システム',
      proposalAmount: 4500000,
      implementationPeriod: 90,
    };

    expect(() => {
      evaluatePatternRelevance(
        customerCondition,
        dealCondition,
        mockAIRecommendationEngine
      );
    }).toThrow(/NO_PATTERN_TEMPLATE_FOUND/);
  });
});