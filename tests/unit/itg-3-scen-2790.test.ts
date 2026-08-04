import { extractSuccessPatternsWithWeighting } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2790
  test('失敗パターンが0件のとき、エラーを返す', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealCondition = {
      customerId: 'CUST-20250115-001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      budgetAmount: 5000000,
      dealStage: 'initial_contact',
      dealValue: 2500000,
      timelineMonths: 6,
    };

    const result = extractSuccessPatternsWithWeighting(
      newDealCondition,
      mockAIEngine
    );

    expect(result).toEqual({
      errorCode: 'NO_FAILURE_PATTERNS_FOUND',
      statusCode: 400,
      errorMessage: '失敗パターンが不足しているため、重み付けロジックを実行できません',
      processInterrupted: true,
    });

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});