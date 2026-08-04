import { calculateInferenceConfidenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推論精度スコア算出', () => {
  // SCEN-2392
  test('信頼度評価の基準参照データが空のとき、エラーが発生する', () => {
    const dealCondition = {
      customerId: 'CUST-001',
      customerIndustry: 'IT',
      customerScale: 'medium',
      dealAmount: 5000000,
      dealStage: 'proposal',
      proposalContent: 'Cloud migration solution',
    };

    const emptyConfidenceBaselineData = null;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0,
        applicablePatterns: [],
      }),
    };

    expect(() =>
      calculateInferenceConfidenceScore(
        dealCondition,
        emptyConfidenceBaselineData,
        mockAIRecommendationEngine,
      ),
    ).toThrow(/信頼度評価の基準参照データ/);

    try {
      calculateInferenceConfidenceScore(
        dealCondition,
        emptyConfidenceBaselineData,
        mockAIRecommendationEngine,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toContain(
          '信頼度評価の基準参照データが存在しません。スコア算出を実行できません',
        );
        expect((error as Error & { code?: string }).code).toBe(
          'CONFIDENCE_BASELINE_EMPTY',
        );
      }
    }
  });
});