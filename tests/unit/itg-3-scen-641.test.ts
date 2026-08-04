import { validateDealConditionAndMatchCustomerConstraints } from '../../src/logic/it-1-br-3-3-2-1';

describe('顧客条件照合機能 - 商談条件バリデーション', () => {
  test('SCEN-641: 商談条件が空のとき、照合対象がないエラーを返す', () => {
    // Arrange: 空の商談条件を生成
    const emptyDealCondition = {
      customerId: undefined,
      productInfo: undefined,
      budget: undefined,
      industry: undefined,
    };

    // AIRecommendationEngineのスタブを準備（呼ばれないはず）
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act & Assert: 空の商談条件で照合機能を実行
    expect(() => {
      validateDealConditionAndMatchCustomerConstraints(
        emptyDealCondition,
        aiRecommendationEngineStub
      );
    }).toThrow(/照合対象の商談条件/);

    // Assert: AIRecommendationEngineが呼ばれていないことを確認
    expect(aiRecommendationEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});