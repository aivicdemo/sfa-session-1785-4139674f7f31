import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ自動推奨機能 - 照合ルールマスタ空き時のエラーハンドリング', () => {
  test('SCEN-2281: 照合ルールマスタが0件のとき、エラーコードCOLLATION_RULE_EMPTYが返却される', () => {
    const newDealData = {
      customerIndustry: '製造業',
      dealBudgetAmount: 5000000,
      implementationPeriodMonths: 3,
    };

    const emptyCollationRulesStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        isApplicable: false,
        score: 0,
        errorCode: 'COLLATION_RULE_EMPTY',
        errorMessage: '提案内容の適合性判定に必要な照合ルールが登録されていません。管理者に連絡してください',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      generateRecommendation: jest.fn(),
    };

    const result = generateRecommendation(
      newDealData,
      emptyCollationRulesStub
    );

    expect(result.errorCode).toBe('COLLATION_RULE_EMPTY');
    expect(result.errorMessage).toBe('提案内容の適合性判定に必要な照合ルールが登録されていません。管理者に連絡してください');
    expect(result.recommendation).toBeUndefined();
    expect(emptyCollationRulesStub.generateRecommendation).not.toHaveBeenCalled();
  });
});