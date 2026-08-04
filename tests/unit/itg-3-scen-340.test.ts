import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-340
  test('推奨精度が0%の場合、精度スコアとして正常に計測される', () => {
    const dealCondition = {
      customerId: 'CUST-001',
      projectAmount: 5000000,
      industry: 'manufacturing',
      dealStage: 'proposal',
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0,
        applicabilityLevel: 'inapplicable',
        confidence: 0,
      }),
    };

    const result = evaluatePatternRelevance(dealCondition, mockAIEngine);

    expect(result.relevanceScore).toBe(0);
    expect(typeof result.relevanceScore).toBe('number');
    expect(result.applicabilityLevel).toBe('inapplicable');
    expect(result.accuracy).toBe(0);
  });
});