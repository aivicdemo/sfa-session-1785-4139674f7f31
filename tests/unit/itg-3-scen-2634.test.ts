import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2634
  test('推奨根拠フォーマットが不正のとき、可視化エラーが発生する', () => {
    const mockRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoning: undefined,
        evidence: null,
      }),
    };

    const invalidReasoningData = {
      reasoning: undefined,
      evidence: null,
    };

    expect(() => {
      explainRecommendationReasoning(invalidReasoningData, mockRecommendationEngine);
    }).toThrow(/RecommendationReasoningFormatError/);
  });
});