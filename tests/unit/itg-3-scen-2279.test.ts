import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ自動推奨機能', () => {
  test('SCEN-2279: 提案アプローチの候補が0件のとき、推奨実行がエラーになる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newProposalCondition = {
      customer_name: 'ABC Corporation',
      industry: 'Technology',
      company_size: 'Large',
      issue_content: 'Digital transformation initiative',
      budget: 5000000,
      timeline_months: 6,
    };

    expect(() =>
      generateRecommendation(newProposalCondition, mockAIRecommendationEngine)
    ).toThrow(/過去の成功パターン/);
  });
});