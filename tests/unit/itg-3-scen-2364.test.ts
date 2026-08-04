import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2364
  test('営業担当者の提案内容が複数件存在するとき、全件を考慮した推論精度スコアが算出される', () => {
    const salesPersonId = 'SALES-001';
    const startDate = new Date('2024-01-01T00:00:00Z');
    const endDate = new Date('2024-12-31T23:59:59Z');

    const proposalScores = {
      'PROP-001': 0.85,
      'PROP-002': 0.72,
      'PROP-003': 0.91,
    };

    let evaluateCallCount = 0;

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: (proposalId: string): number => {
        evaluateCallCount += 1;
        return proposalScores[proposalId as keyof typeof proposalScores] || 0;
      },
    };

    const proposals = [
      {
        proposalId: 'PROP-001',
        salesPersonId: salesPersonId,
        customerId: 'CUST-001',
        dealId: 'DEAL-001',
        createdAt: new Date('2024-06-15T10:00:00Z'),
      },
      {
        proposalId: 'PROP-002',
        salesPersonId: salesPersonId,
        customerId: 'CUST-002',
        dealId: 'DEAL-002',
        createdAt: new Date('2024-07-20T14:30:00Z'),
      },
      {
        proposalId: 'PROP-003',
        salesPersonId: salesPersonId,
        customerId: 'CUST-003',
        dealId: 'DEAL-003',
        createdAt: new Date('2024-08-25T09:15:00Z'),
      },
    ];

    const result = evaluateInferenceAccuracy(
      salesPersonId,
      startDate,
      endDate,
      proposals,
      mockAIRecommendationEngine as any
    );

    const expectedAccuracy = (0.85 + 0.72 + 0.91) / 3;
    const expectedAccuracyRounded = Math.round(expectedAccuracy * 10000) / 10000;

    expect(result.proposalCount).toBe(3);
    expect(result.scores).toEqual([0.85, 0.72, 0.91]);
    expect(result.inferenceAccuracyScore).toBe(expectedAccuracyRounded);
    expect(evaluateCallCount).toBe(3);
  });
});