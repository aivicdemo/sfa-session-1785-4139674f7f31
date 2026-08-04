import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1889
  test('AIRecommendationEngine の evaluatePatternRelevance が 0 未満のスコアを返すとき推奨生成に失敗する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(-0.5),
    };

    const newCaseData = {
      customerName: 'テスト顧客A',
      industry: 'IT',
      budget: '500万円',
    };

    const mockRecommendationMaster = [
      {
        id: 'cache-001',
        pattern: 'similar_case_1',
        recommendedApproach: 'クラウド導入支援',
        successRate: 0.75,
      },
      {
        id: 'cache-002',
        pattern: 'similar_case_2',
        recommendedApproach: 'デジタル変革コンサル',
        successRate: 0.68,
      },
    ];

    const result = generateRecommendation(
      newCaseData,
      mockAIEngine,
      mockRecommendationMaster
    );

    expect(result).toHaveProperty('error');
    expect(result.error).toMatch(/スコア|評価|適合性/);
    expect(result).toHaveProperty('fallbackMessage');
    expect(result.fallbackMessage).toMatch(/一時的な遅延|類似案件/);
    expect(result).toHaveProperty('cachedRecommendations');
    expect(Array.isArray(result.cachedRecommendations)).toBe(true);
    expect(result.cachedRecommendations.length).toBeGreaterThan(0);
    expect(result.cachedRecommendations[0]).toHaveProperty('recommendedApproach');
  });
});