import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンの適用可能性評価機能', () => {
  // SCEN-2479
  test('抽出した成功パターンが新規案件に適用可能なとき、スコアが1.0に近い値で返却される', () => {
    const newOpportunitiesData = {
      industry: '製造業',
      dealStage: '提案段階',
      budgetScale: 5000000,
    };

    const extractedSuccessPattern = {
      pastCaseId: 'CASE-2401',
      industry: '製造業',
      contractAmount: 4800000,
      salesPeriodDays: 45,
    };

    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.95),
    };

    const result = evaluatePatternRelevance(
      newOpportunitiesData,
      extractedSuccessPattern,
      aiRecommendationEngineStub
    );

    expect(result).toBe(0.95);
    expect(result).toBeGreaterThanOrEqual(0.8);
    expect(result).toBeLessThanOrEqual(1.0);
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith(
      newOpportunitiesData,
      extractedSuccessPattern
    );
  });
});