import { calculateInferencePrecisionScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2389: 推論精度スコア算出機能 - 問題検出結果がnullのとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
    };

    const analysisResult = {
      detectionResult: null,
      proposalContent: {
        productId: 'PROD001',
        quantity: 100,
        proposalAmount: 500000,
      },
      customerConstraints: {
        budgetLimit: 1000000,
        purchaseFrequency: 'quarterly',
      },
    };

    expect(() => {
      calculateInferencePrecisionScore(analysisResult, mockAIRecommendationEngine);
    }).toThrow(/問題検出結果/);

    try {
      calculateInferencePrecisionScore(analysisResult, mockAIRecommendationEngine);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/問題検出結果がnullです/);
        expect((error as any).name).toBe('NullDetectionResultError');
        expect(error.stack).toContain('calculateInferencePrecisionScore');
      }
    }
  });
});