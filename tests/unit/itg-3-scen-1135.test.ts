import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('商談条件マッチング機能 - 顧客契約金額が過去成功パターン上限と一致する場合', () => {
  test('SCEN-1135: 契約金額が過去成功パターン上限ちょうどのとき適用可能と判定する', () => {
    const pastSuccessPatternMaxAmount = 5000000;
    const dealConditionContractAmount = 5000000;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.85,
        isApplicable: true,
        patternId: 'pattern-success-001',
        reasoning: '契約金額が過去成功パターンの上限と一致',
      }),
    };

    const dealCondition = {
      customerId: 'customer-12345',
      customerIndustry: 'IT',
      customerScale: 'large',
      contractAmount: dealConditionContractAmount,
      dealStage: 'proposal',
    };

    const successPattern = {
      patternId: 'pattern-success-001',
      maxContractAmount: pastSuccessPatternMaxAmount,
      industryTarget: 'IT',
      scaleTarget: 'large',
      successRate: 0.78,
    };

    const result = evaluatePatternRelevance(dealCondition, successPattern, mockAIRecommendationEngine);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'customer-12345',
        contractAmount: 5000000,
      }),
      expect.objectContaining({
        patternId: 'pattern-success-001',
        maxContractAmount: 5000000,
      })
    );

    expect(result.relevanceScore).toBe(0.85);
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.8);
    expect(result.isApplicable).toBe(true);
    expect(result.patternId).toBe('pattern-success-001');
  });
});