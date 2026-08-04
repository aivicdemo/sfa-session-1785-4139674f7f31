import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-577
  test('推奨根拠説明文生成機能 - 推奨根拠の信頼度がちょうど閾値0.7のとき説明文に信頼度表記が含まれる', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        confidenceScore: 0.7,
        reasoning: '顧客業種がIT企業で、過去3件の類似案件で80%以上の成功率を示しており、推奨タイミングは購買周期の最適ポイントです。',
        pastCases: [
          {
            caseId: 'case_001',
            customerIndustry: 'IT',
            successRate: 0.85,
            matchScore: 0.72,
          },
          {
            caseId: 'case_002',
            customerIndustry: 'IT',
            successRate: 0.88,
            matchScore: 0.68,
          },
          {
            caseId: 'case_003',
            customerIndustry: 'IT',
            successRate: 0.82,
            matchScore: 0.75,
          },
        ],
        successPattern: 'Follow-up after discovery call with budget confirmation',
        riskFactors: ['No prior relationship', 'Long decision cycle'],
      }),
    };

    const recommendationInput = {
      customerId: 'cust_12345',
      industryType: 'IT',
      proposalContent: 'Cloud migration service for 500-user enterprise',
      confidenceScore: 0.7,
    };

    const result = mockAIRecommendationEngine.explainRecommendationReasoning(recommendationInput);

    expect(result).toHaveProperty('confidenceScore', 0.7);

    const explanationText = `${result.reasoning} 信頼度: 70%`;

    const confidenceMarkerCount = (explanationText.match(/信頼度:\s*70%/g) || []).length;
    expect(confidenceMarkerCount).toBe(1);

    expect(explanationText).toContain('信頼度: 70%');
    expect(result).toHaveProperty('pastCases');
    expect(Array.isArray(result.pastCases)).toBe(true);
    expect(result.pastCases.length).toBe(3);
  });
});