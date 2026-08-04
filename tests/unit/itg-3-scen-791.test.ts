import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨信頼度スコア算出機能', () => {
  test('SCEN-791: 適用可能性スコアが入力されないとき、信頼度は基準スコアのみで算出される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicabilityScore: null,
      }),
    };

    const newProjectData = {
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerScale: 'mid-market',
      dealAmount: 5000000,
      dealStage: 'proposal',
      baseScore: 0.75,
    };

    const result = calculateRecommendationConfidenceScore(
      newProjectData,
      mockAIRecommendationEngine
    );

    expect(result.confidenceScore).toBe(0.75);
    expect(result.isCalculatedSuccessfully).toBe(true);
  });
});