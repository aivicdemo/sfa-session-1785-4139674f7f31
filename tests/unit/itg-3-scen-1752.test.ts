import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1752: 推奨IDが欠落しているとき根拠可視化が失敗する', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn(() => {
        throw new Error('推奨IDが指定されていません');
      }),
    };

    const testCases = [
      { recommendationId: undefined },
      { recommendationId: null },
    ];

    testCases.forEach((testCase) => {
      expect(() => {
        explainRecommendationReasoning(
          testCase.recommendationId as any,
          mockAIRecommendationEngine,
        );
      }).toThrow(/推奨ID/);
    });
  });
});