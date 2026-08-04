import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-2129: 新規案件IDがnullのとき、エラーが発生する', () => {
    const stubAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newProjectId = null;
    const customerConditions = {
      industry: '製造業',
      companySize: '中堅企業',
      annualRevenue: 50000000,
    };
    const dealConditions = {
      dealAmount: 1000000,
      dealStage: '提案段階',
      priority: 'high',
    };

    expect(() => {
      generateRecommendation(
        newProjectId,
        customerConditions,
        dealConditions,
        stubAIRecommendationEngine
      );
    }).toThrow(/案件ID/);
  });
});