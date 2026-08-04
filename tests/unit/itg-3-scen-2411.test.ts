import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-3-3-2-1';

describe('推論精度スコア算出機能', () => {
  // SCEN-2411
  test('提案アプローチのデータ構造が不正のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 'invalid_string',
        confidentLevel: null,
        patternId: undefined,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const invalidProposalApproach = {
      relevanceScore: 'invalid_string',
      confidentLevel: null,
      patternId: undefined,
      content: 'sample proposal',
    };

    expect(() =>
      evaluateInferenceAccuracy(invalidProposalApproach, mockAIRecommendationEngine)
    ).toThrow(/提案アプローチのデータ構造が不正です/);
  });
});