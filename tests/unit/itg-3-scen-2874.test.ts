import { validateRecommendationContent } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨内容の検証判定機能', () => {
  // SCEN-2874
  test('改善指導の優先度が0のとき、エラーを返す', () => {
    const improvementGuidance = {
      guidanceId: 'guidance-001',
      priority: 0,
      content: 'テスト改善指導',
      targetArea: 'proposal_quality',
    };

    const aiEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        approachType: 'standard',
        confidenceScore: 85,
        rootCause: 'past_success_pattern',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      validateRecommendationContent(improvementGuidance, aiEngine);
    }).toThrow(/改善指導の優先度/);

    try {
      validateRecommendationContent(improvementGuidance, aiEngine);
    } catch (error: any) {
      expect(error.code).toBe('INVALID_PRIORITY_ZERO');
      expect(error.message).toContain('改善指導の優先度は 0 より大きい値である必要があります');
      expect(error.statusCode).toBe(400);
    }
  });
});