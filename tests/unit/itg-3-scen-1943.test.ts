import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1943
  test('複数根拠がスコア降順でソートされて表示される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '顧客XYZ社向けの提案内容',
        evidenceList: [
          {
            id: 'evidence_A',
            description: '根拠A: 過去の類似案件での成功パターン',
            relevanceScore: 0.95,
            dataSource: 'past_case_001'
          },
          {
            id: 'evidence_B',
            description: '根拠B: 顧客の業種別購買傾向',
            relevanceScore: 0.72,
            dataSource: 'customer_trend_data'
          },
          {
            id: 'evidence_C',
            description: '根拠C: 営業担当者の成功パターン',
            relevanceScore: 0.88,
            dataSource: 'salesperson_success_pattern'
          }
        ]
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const customerData = {
      customerId: 'CUST_12345',
      industry: 'manufacturing',
      scale: 'mid_enterprise',
      previousPurchaseHistory: ['product_A', 'product_B']
    };

    const dealCondition = {
      dealId: 'DEAL_67890',
      stage: 'proposal',
      proposalAmount: 5000000,
      timeline: '2024-Q2'
    };

    const result = await generateRecommendation(
      mockAIRecommendationEngine,
      customerData,
      dealCondition
    );

    const sortedEvidenceList = result.evidenceList.sort(
      (a, b) => b.relevanceScore - a.relevanceScore
    );

    expect(sortedEvidenceList).toEqual([
      {
        id: 'evidence_A',
        description: '根拠A: 過去の類似案件での成功パターン',
        relevanceScore: 0.95,
        dataSource: 'past_case_001'
      },
      {
        id: 'evidence_C',
        description: '根拠C: 営業担当者の成功パターン',
        relevanceScore: 0.88,
        dataSource: 'salesperson_success_pattern'
      },
      {
        id: 'evidence_B',
        description: '根拠B: 顧客の業種別購買傾向',
        relevanceScore: 0.72,
        dataSource: 'customer_trend_data'
      }
    ]);

    expect(sortedEvidenceList[0].relevanceScore).toBe(0.95);
    expect(sortedEvidenceList[1].relevanceScore).toBe(0.88);
    expect(sortedEvidenceList[2].relevanceScore).toBe(0.72);

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      customerData,
      dealCondition
    );
  });
});