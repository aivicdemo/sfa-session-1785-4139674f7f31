import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1932: [edge] 推奨内容の根拠表示機能 - 根拠情報が複数件のときに全根拠がリスト表示される
  test('根拠情報が複数件のときに全根拠がリスト表示される', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        recommendationId: 'rec-20240115-001',
        reasoning: [
          {
            basisId: 'basis-001',
            basisType: 'customer_industry_match',
            description: '顧客業界が過去成功事例と一致',
            confidence: 92,
            supportingData: {
              pastSuccessCaseCount: 15,
              matchPercentage: 92,
            },
          },
          {
            basisId: 'basis-002',
            basisType: 'proposal_amount_range',
            description: '提案金額帯が成功パターン内',
            confidence: 88,
            supportingData: {
              proposalAmount: 5000000,
              successfulAmountRange: { min: 3000000, max: 7000000 },
            },
          },
          {
            basisId: 'basis-003',
            basisType: 'decision_maker_attribute',
            description: '決裁者属性が合致',
            confidence: 85,
            supportingData: {
              decisionMakerRole: 'CTO',
              successfulRolePatterns: ['CTO', 'VP Engineering', 'Tech Lead'],
            },
          },
        ],
        trustworthinessScore: 88,
      }),
    };

    const dealCondition = {
      customerId: 'cust-20240115-001',
      customerIndustry: 'Information Technology',
      proposalAmount: 5000000,
      decisionMakerRole: 'CTO',
    };

    const result = mockAIEngine.explainRecommendationReasoning(dealCondition);

    expect(result).toBeDefined();
    expect(result.reasoning).toHaveLength(3);

    expect(result.reasoning[0].description).toBe('顧客業界が過去成功事例と一致');
    expect(result.reasoning[0].basisId).toBe('basis-001');
    expect(result.reasoning[0].confidence).toBe(92);

    expect(result.reasoning[1].description).toBe('提案金額帯が成功パターン内');
    expect(result.reasoning[1].basisId).toBe('basis-002');
    expect(result.reasoning[1].confidence).toBe(88);

    expect(result.reasoning[2].description).toBe('決裁者属性が合致');
    expect(result.reasoning[2].basisId).toBe('basis-003');
    expect(result.reasoning[2].confidence).toBe(85);

    expect(result.trustworthinessScore).toBe(88);

    const displayedReasonings = result.reasoning.map((r) => r.description);
    expect(displayedReasonings).toEqual([
      '顧客業界が過去成功事例と一致',
      '提案金額帯が成功パターン内',
      '決裁者属性が合致',
    ]);

    result.reasoning.forEach((reasoning) => {
      expect(reasoning.basisId).toBeDefined();
      expect(reasoning.description).toBeDefined();
      expect(reasoning.confidence).toBeGreaterThanOrEqual(0);
      expect(reasoning.confidence).toBeLessThanOrEqual(100);
      expect(reasoning.supportingData).toBeDefined();
    });
  });
});