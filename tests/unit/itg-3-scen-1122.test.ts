import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1122
  test('新規案件と過去成功パターンの業界が不一致で、類似度スコア計算時に0未満の値になるとき、エラーになる', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(-0.15),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDeal = {
      industry: 'financial_services',
      companySize: 'large',
      stage: 'proposal_review',
    };

    const successPattern = {
      patternId: 'SUCCESS-2024-001',
      industry: 'manufacturing',
    };

    expect(() => {
      findSimilarPatterns(newDeal, successPattern, mockAIRecommendationEngine);
    }).toThrow(/類似度スコアが無効です/);
  });
});