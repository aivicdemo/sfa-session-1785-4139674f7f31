import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-1124: [error] 成功パターン抽出・照合機能 - 提案アプローチの生成結果が null のとき、推奨生成処理がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(null),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newCaseProp = {
      industry: 'IT',
      projectScale: 10000000,
      decisionMakers: 3,
      aiRecommendationEngine: mockAIEngine,
    };

    expect(() => generateRecommendation(newCaseProp)).toThrow(/提案アプローチ/);
  });
});