import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2320: [edge] 成功パターン抽出・照合機能 - 新規案件と過去成功パターンの類似度スコアが適用可能閾値直下のとき提案アプローチが推奨されない
  test('類似度スコアが適用可能閾値直下（0.549）のとき推奨フラグがfalseになり推奨アプローチがnullになること', () => {
    const newDealData = {
      customerSize: 'medium_enterprise',
      industry: 'manufacturing',
      dealStage: 'pre_proposal',
      budget: 50000000,
    };

    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        patternId: 'past_001',
        customerSize: 'medium_enterprise',
        industry: 'manufacturing',
        approachType: 'solution_oriented',
        successRate: 0.72,
      },
      {
        patternId: 'past_002',
        customerSize: 'medium_enterprise',
        industry: 'manufacturing',
        approachType: 'value_focused',
        successRate: 0.68,
      },
    ]);

    const mockEvaluatePatternRelevance = jest.fn().mockReturnValue({
      relevanceScore: 0.549,
      matchedFactors: ['customerSize', 'industry'],
      unmatchedFactors: ['dealStage'],
    });

    const mockAiRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    const result = generateRecommendation(
      newDealData,
      mockAiRecommendationEngine,
      0.55
    );

    expect(result.relevanceScore).toBe(0.549);
    expect(result.isRecommended).toBe(false);
    expect(result.recommendedApproach).toBeNull();
    expect(result.message).toMatch(/類似の成功パターンが見つかりませんでした/);
    expect(result.logEntry).toMatch(/relevanceScore: 0.549/);
    expect(result.logEntry).toMatch(/threshold: 0.55/);
    expect(result.logEntry).toMatch(/recommendation: rejected/);
  });
});