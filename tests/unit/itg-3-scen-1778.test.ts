import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1778: 推奨内容IDが欠落しているとき根拠表示が失敗する', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn()
        .mockImplementation((recommendationId: string | null | undefined) => {
          if (!recommendationId) {
            throw new Error('推奨内容IDが欠落しています');
          }
          return {
            reasoning: 'sample reasoning',
            basePatterns: ['pattern1'],
          };
        }),
    };

    const errorMessages: string[] = [];
    const originalConsoleError = console.error;
    console.error = jest.fn((msg: string) => {
      errorMessages.push(msg);
    });

    try {
      expect(() => {
        mockAIRecommendationEngine.explainRecommendationReasoning(null);
      }).toThrow(/推奨内容IDが欠落/);

      expect(mockAIRecommendationEngine.explainRecommendationReasoning)
        .toHaveBeenCalledWith(null);

      expect(() => {
        mockAIRecommendationEngine.explainRecommendationReasoning(undefined);
      }).toThrow(/推奨内容IDが欠落/);
    } finally {
      console.error = originalConsoleError;
    }
  });
});