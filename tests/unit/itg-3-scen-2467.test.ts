import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2467
  test('推奨根拠の可視化機能 - 根拠の信頼度スコアが高い順に根拠情報が表示される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        proposedApproach: 'アップセル提案',
        rationales: [
          {
            id: 'rationale-a',
            content: '過去同業種案件で成功率87%',
            confidenceScore: 0.95,
            evidenceType: 'historical_success_rate'
          },
          {
            id: 'rationale-b',
            content: '類似顧客規模での実績3件',
            confidenceScore: 0.72,
            evidenceType: 'similar_customer_count'
          },
          {
            id: 'rationale-c',
            content: '提案アプローチが業界トレンドに合致',
            confidenceScore: 0.88,
            evidenceType: 'industry_trend_alignment'
          }
        ]
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        rationales: [
          {
            id: 'rationale-a',
            content: '過去同業種案件で成功率87%',
            confidenceScore: 0.95,
            evidenceType: 'historical_success_rate'
          },
          {
            id: 'rationale-b',
            content: '類似顧客規模での実績3件',
            confidenceScore: 0.72,
            evidenceType: 'similar_customer_count'
          },
          {
            id: 'rationale-c',
            content: '提案アプローチが業界トレンドに合致',
            confidenceScore: 0.88,
            evidenceType: 'industry_trend_alignment'
          }
        ]
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('')
    };

    const customerData = {
      customerId: 'cust-123',
      industry: 'IT',
      companySize: 'medium',
      currentRevenue: 50000000
    };

    const dealData = {
      dealId: 'deal-456',
      dealStage: 'proposal_stage',
      productCategory: 'enterprise_solution',
      estimatedValue: 5000000
    };

    const rationales = evaluatePatternRelevance(
      mockAIEngine,
      customerData,
      dealData
    );

    const sortedRationales = rationales.sort((a, b) => b.confidenceScore - a.confidenceScore);

    expect(sortedRationales).toHaveLength(3);

    expect(sortedRationales[0]).toEqual({
      id: 'rationale-a',
      content: '過去同業種案件で成功率87%',
      confidenceScore: 0.95,
      evidenceType: 'historical_success_rate'
    });

    expect(sortedRationales[1]).toEqual({
      id: 'rationale-c',
      content: '提案アプローチが業界トレンドに合致',
      confidenceScore: 0.88,
      evidenceType: 'industry_trend_alignment'
    });

    expect(sortedRationales[2]).toEqual({
      id: 'rationale-b',
      content: '類似顧客規模での実績3件',
      confidenceScore: 0.72,
      evidenceType: 'similar_customer_count'
    });

    expect(sortedRationales[0].confidenceScore).toBe(0.95);
    expect(sortedRationales[1].confidenceScore).toBe(0.88);
    expect(sortedRationales[2].confidenceScore).toBe(0.72);

    expect(sortedRationales[0].content).toBeDefined();
    expect(sortedRationales[0].content.length).toBeGreaterThan(0);
    expect(sortedRationales[1].content).toBeDefined();
    expect(sortedRationales[1].content.length).toBeGreaterThan(0);
    expect(sortedRationales[2].content).toBeDefined();
    expect(sortedRationales[2].content.length).toBeGreaterThan(0);
  });
});