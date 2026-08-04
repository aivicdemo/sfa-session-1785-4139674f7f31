import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1655
  test('推奨スコア算出機能 - 商談IDが null のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidInput = {
      dealId: null,
      customerInfo: {
        industry: 'IT',
        scale: 'large',
      },
      proposalContent: {
        title: 'クラウド導入提案',
        value: 5000000,
      },
    };

    expect(() =>
      calculateRecommendationScore(invalidInput, mockAIRecommendationEngine)
    ).toThrow(/商談ID/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});