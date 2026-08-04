import { validateRecommendationContent } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2866
  test('営業現場文脈適合スコアが負の値のとき、エラーを返す', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(-0.5),
    };

    const recommendationPattern = {
      patternId: 'pattern-001',
      customerId: 'cust-001',
      proposalApproach: 'approach-tech-stack',
      successCriteria: 'revenue-increase-20pct',
      targetIndustry: 'IT',
    };

    expect(() =>
      validateRecommendationContent(recommendationPattern, mockAIRecommendationEngine)
    ).toThrow(/営業現場文脈適合スコア/);
  });
});