import { evaluateRecommendationTrustScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2455
  test('推奨精度スコア算出機能 - AIエージェント外部API呼び出し成功時に信頼度スコアが正常に算出される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.85,
        confidenceScore: 0.92,
        matchedPatternsCount: 3,
      }),
    };

    const newCaseData = {
      customerIndustry: 'IT',
      caseAmount: 5000000,
      decisionMakerCount: 2,
    };

    const result = evaluateRecommendationTrustScore(newCaseData, mockAIEngine);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(newCaseData);

    expect(result.finalTrustScore).toBe(0.7820);
    expect(result.relevanceScore).toBe(0.85);
    expect(result.confidenceScore).toBe(0.92);
    expect(result.patternMatchCount).toBe(3);
    expect(result.trustLevel).toBe('HIGH');
  });
});