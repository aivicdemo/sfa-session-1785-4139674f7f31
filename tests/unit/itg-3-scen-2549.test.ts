import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2549
  test('推奨根拠が複数件のとき、すべての根拠が可視化される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasonings: [
          {
            id: 'reason-0',
            explanation: '顧客業種が過去成功事例と一致',
            confidence: 0.92,
            supportingData: 'Manufacturing sector with 500-1000 employees',
          },
          {
            id: 'reason-1',
            explanation: '予算規模が類似',
            confidence: 0.88,
            supportingData: 'Budget range ¥50M-100M matches historical average',
          },
          {
            id: 'reason-2',
            explanation: '導入時期が最適',
            confidence: 0.85,
            supportingData: 'Q2 timing aligns with customer fiscal year planning',
          },
        ],
        totalReasonings: 3,
        generatedAt: new Date('2024-06-15T09:30:00Z').toISOString(),
      }),
    };

    const recommendationId = 'rec-12345';
    const dealContext = {
      customerId: 'cust-999',
      customerIndustry: 'Manufacturing',
      budgetRange: '50M-100M',
      proposalTiming: 'Q2',
    };

    const result = await explainRecommendationReasoning(
      recommendationId,
      dealContext,
      mockAIEngine
    );

    expect(result.reasonings).toHaveLength(3);

    expect(result.reasonings[0]).toEqual({
      id: 'reason-0',
      explanation: '顧客業種が過去成功事例と一致',
      confidence: 0.92,
      supportingData: 'Manufacturing sector with 500-1000 employees',
    });

    expect(result.reasonings[1]).toEqual({
      id: 'reason-1',
      explanation: '予算規模が類似',
      confidence: 0.88,
      supportingData: 'Budget range ¥50M-100M matches historical average',
    });

    expect(result.reasonings[2]).toEqual({
      id: 'reason-2',
      explanation: '導入時期が最適',
      confidence: 0.85,
      supportingData: 'Q2 timing aligns with customer fiscal year planning',
    });

    expect(result.totalReasonings).toBe(3);

    expect(result.reasonings.map((r) => r.id)).toEqual([
      'reason-0',
      'reason-1',
      'reason-2',
    ]);

    expect(result.reasonings.map((r) => r.explanation)).toEqual([
      '顧客業種が過去成功事例と一致',
      '予算規模が類似',
      '導入時期が最適',
    ]);

    mockAIEngine.explainRecommendationReasoning.mockClear();
  });
});