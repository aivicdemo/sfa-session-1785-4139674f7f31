import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能', () => {
  // SCEN-637
  test('現在の商談条件に該当する成功パターンが0件のとき、適用可能なアプローチが見つからないエラーを返す', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealCondition = {
      industry: '製造業',
      budget: '500万円以下',
      decisionMaker: '複数',
      implementationPeriod: '6ヶ月以内',
    };

    const result = generateRecommendation(dealCondition, mockAIEngine);

    expect(result.statusCode).toBe(404);
    expect(result.errorCode).toBe('NO_APPLICABLE_APPROACH_FOUND');
    expect(result.errorMessage).toBe('適用可能な提案アプローチが見つかりません。営業担当者にご相談ください');
    expect(result.recommendationContent).toBeUndefined();
    expect(result.reasoningExplanation).toBeUndefined();
    expect(result.patternMatchInfo).toBeUndefined();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});