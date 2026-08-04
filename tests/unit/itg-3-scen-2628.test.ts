import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能 - 商談条件バリデーション', () => {
  // SCEN-2628
  test('商談条件が不正な形式のとき、ValidationErrorが発生し、エラーコードINVALID_DEAL_FORMATを返す', () => {
    const invalidDealCondition = {
      customerId: null,
      dealAmount: 'invalid_number',
      dealStage: undefined,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = generateRecommendation(invalidDealCondition, mockAIEngine);

    expect(result.errorType).toBe('ValidationError');
    expect(result.errorCode).toBe('INVALID_DEAL_FORMAT');
    expect(result.httpStatus).toBe(400);
    expect(result.errorMessage).toMatch(/customerId|dealAmount|dealStage/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});