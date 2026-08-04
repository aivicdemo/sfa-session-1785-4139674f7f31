import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 顧客マスタ検証', () => {
  // SCEN-120
  test('顧客マスタに存在しない顧客IDが与えられた場合に推論が実行されない', async () => {
    const nonExistentCustomerId = 'CUST-999999';
    const dealConditions = {
      productCategory: '営業支援ツール',
      caseAmount: 5000000,
      dealStage: '提案'
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const mockCustomerRepository = {
      findById: jest.fn().mockResolvedValue(null)
    };

    expect(() =>
      generateRecommendation(
        nonExistentCustomerId,
        dealConditions,
        mockCustomerRepository,
        mockAIEngine
      )
    ).toThrow(/顧客ID/);

    expect(mockCustomerRepository.findById).toHaveBeenCalledWith(
      nonExistentCustomerId
    );
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});