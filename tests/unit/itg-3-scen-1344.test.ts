import { evaluatePatternRelevanceForNewDeal } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への推奨機能', () => {
  // SCEN-1344
  test('パターン適用可能スコアが閾値より1単位低いとき、推奨対象外と判定される', () => {
    const threshold = 75.0;
    const scoreFromEngine = 74.9;

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: scoreFromEngine,
        isApplicable: false,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealInput = {
      customerInfo: {
        industry: '製造業',
        employeeCount: 500,
        budget: 50000000,
      },
      dealConditions: {
        proposalContent: 'DX推進支援',
      },
      relevanceThreshold: threshold,
    };

    const result = evaluatePatternRelevanceForNewDeal(
      newDealInput,
      mockAIRecommendationEngine
    );

    expect(result.isRecommended).toBe(false);
    expect(result.isExcluded).toBe(true);
    expect(result.score).toBe(74.9);
    expect(result.exclusionReason).toMatch(/74\.9/);
    expect(result.exclusionReason).toMatch(/75\.0/);
    expect(result.userMessage).toBe(
      'この案件に該当する推奨パターンが見つかりませんでした'
    );
  });
});