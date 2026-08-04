import { evaluateProposalFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1228: 提案適合スコアが100を超えるとき、エラーを返す', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 101,
        feasible: false
      })
    };

    const dealCondition = {
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      customerIndustry: 'manufacturing',
      customerSize: 'enterprise'
    };

    const result = evaluateProposalFeasibility(dealCondition, mockAIRecommendationEngine);

    expect(result).toEqual({
      isError: true,
      errorCode: 'INVALID_SCORE_RANGE',
      errorMessage: '提案適合スコアが100を超えています。スコアは0～100の範囲内である必要があります。',
      errorDetail: {
        invalidScore: 101
      }
    });
  });
});