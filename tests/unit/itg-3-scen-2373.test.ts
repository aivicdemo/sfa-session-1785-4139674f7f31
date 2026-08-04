import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2373
  test('信頼度スコア50.0の場合、中立的な値として正確に算出される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        confidenceScore: 50.0,
        confidenceLevel: 'NEUTRAL',
      }),
    };

    const proposalData = {
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      proposalContent: {
        approach: 'standard_proposal',
        targetAmount: 100000,
        timeline: 30,
      },
      historicalPatterns: [
        {
          customerId: 'CUST-002',
          dealId: 'DEAL-002',
          similarity: 0.85,
          outcome: 'success',
        },
      ],
    };

    const result = evaluatePatternRelevance(proposalData, mockAIEngine);

    expect(result.confidenceScore).toBe(50.0);
    expect(result.confidenceLevel).toBe('NEUTRAL');
    expect(result.confidenceScore).not.toBeGreaterThan(50);
    expect(result.confidenceScore).not.toBeLessThan(50);
  });
});