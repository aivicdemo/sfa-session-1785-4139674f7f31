import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1432
  test('適用可能性スコアが0のとき、推奨が表示されない', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const successPatterns = [
      {
        id: 'pattern_001',
        industry: '製造業',
        budgetRange: { min: 300, max: 1000 },
        stage: '要件定義',
        approachName: 'Factory_Automation_Approach',
      },
      {
        id: 'pattern_002',
        industry: '製造業',
        budgetRange: { min: 500, max: 2000 },
        stage: '導入',
        approachName: 'Cost_Optimization_Approach',
      },
    ];

    mockAIEngine.evaluatePatternRelevance.mockImplementation((pattern) => {
      if (pattern.id === 'pattern_001') {
        return { score: 0, reason: '予算段階がマッチしない' };
      }
      return { score: 75, reason: '顧客条件と高度にマッチ' };
    });

    mockAIEngine.generateRecommendation.mockResolvedValue({
      recommendedApproaches: [
        {
          patternId: 'pattern_002',
          approachName: 'Cost_Optimization_Approach',
          relevanceScore: 75,
          reasoning: '顧客条件と高度にマッチ',
        },
      ],
      filteredOutPatterns: [
        {
          patternId: 'pattern_001',
          reason: 'スコアが0のため除外',
        },
      ],
      noRecommendationAvailable: false,
    });

    const newDealInput = {
      industry: '製造業',
      budgetAmount: 500,
      currentStage: '要件定義',
      customerSize: 'large',
    };

    const result = await generateRecommendation(newDealInput, mockAIEngine);

    expect(result.recommendedApproaches).toHaveLength(1);
    expect(result.recommendedApproaches[0].patternId).toBe('pattern_002');
    expect(result.recommendedApproaches[0].approachName).toBe(
      'Cost_Optimization_Approach'
    );
    expect(result.recommendedApproaches[0].relevanceScore).toBe(75);

    const pattern_001_in_recommendations = result.recommendedApproaches.find(
      (rec) => rec.patternId === 'pattern_001'
    );
    expect(pattern_001_in_recommendations).toBeUndefined();

    expect(result.filteredOutPatterns).toContainEqual({
      patternId: 'pattern_001',
      reason: 'スコアが0のため除外',
    });

    expect(result.noRecommendationAvailable).toBe(false);
  });
});