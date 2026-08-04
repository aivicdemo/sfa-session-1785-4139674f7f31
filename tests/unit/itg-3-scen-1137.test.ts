import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('商談条件マッチング機能 - 顧客の契約金額が過去成功パターン金額の上限直上のとき適用不可と判定', () => {
  test('SCEN-1137: 契約金額が成功パターン上限直上（1,000万円）の場合、適用不可と判定される', () => {
    const contractAmount = 10000000;
    const successPatternAmountLimit = 10000000;
    const successPatternId = 'pattern_001';
    const customerIndustry = 'IT';
    const customerSize = 'large';

    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: successPatternId,
          industry: customerIndustry,
          customerSize: customerSize,
          amountLimit: successPatternAmountLimit,
          successRate: 0.85,
          description: 'IT large customer pattern'
        }
      ]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternId: successPatternId,
        relevanceScore: 0.0,
        applicabilityFlag: false,
        reasoning: '契約金額が過去成功パターンの上限値（1,000万円）に達しており、適用対象外です'
      }),
      explainRecommendationReasoning: jest.fn()
    };

    const customerData = {
      contractAmount: contractAmount,
      industry: customerIndustry,
      size: customerSize
    };

    const result = evaluatePatternRelevance(
      customerData,
      aiRecommendationEngineStub
    );

    expect(result.applicabilityFlag).toBe(false);
    expect(result.relevanceScore).toBeLessThanOrEqual(0.0);
    expect(result.reasoning).toMatch(/契約金額/);
    expect(result.reasoning).toMatch(/1,000万円/);
    expect(result.reasoning).toMatch(/適用対象外/);
  });
});