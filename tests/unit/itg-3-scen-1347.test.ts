import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1347
  test('推奨根拠が存在するとき、その根拠が営業担当者向けに自然言語で説明される', async () => {
    const dealData = {
      customerId: 'cust_001',
      industry: '製造業',
      budgetAmount: 5000000,
      implementationDueDate: '2024-03-31',
      customerChallenge: '生産効率化',
    };

    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec_001',
        proposedApproach: 'アプローチA-1',
        recommendationText: '顧客の生産効率化課題に対し、導入事例が豊富な提案アプローチA-1を推奨',
        reasoningPatterns: {
          similarPatterns: 15,
          successRate: 78,
          averageContractValue: 112,
          dataSourcePeriod: '過去3年間',
          industryAverageSuccessRate: 56,
        },
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanationText: '貴社の顧客は製造業で予算500万円、3ヶ月以内導入希望という条件です。過去3年間の類似案件データから、同じ条件の成約事例が15件あり、成約率は業界平均56%を大きく上回る78%です。提案アプローチA-1を用いた案件では平均受注額が当初予算比112%となっており、顧客満足度も高い傾向にあります。このため、当該アプローチを強く推奨します。',
        reasoningSources: {
          similarPatterns: 15,
          successRate: 78,
          averageContractValue: 112,
        },
        readinessLevel: '営業向け',
      }),
    };

    const recommendation = await mockRecommendationEngine.generateRecommendation(dealData);

    expect(recommendation).toBeDefined();
    expect(recommendation.proposedApproach).toBe('アプローチA-1');
    expect(recommendation.recommendationText).toBe('顧客の生産効率化課題に対し、導入事例が豊富な提案アプローチA-1を推奨');
    expect(recommendation.reasoningPatterns.similarPatterns).toBe(15);
    expect(recommendation.reasoningPatterns.successRate).toBe(78);
    expect(recommendation.reasoningPatterns.averageContractValue).toBe(112);
    expect(recommendation.reasoningPatterns.industryAverageSuccessRate).toBe(56);

    const explanation = await mockRecommendationEngine.explainRecommendationReasoning({
      recommendationId: recommendation.recommendationId,
      targetAudience: '営業担当者',
    });

    expect(explanation).toBeDefined();
    expect(explanation.explanationText).toBe('貴社の顧客は製造業で予算500万円、3ヶ月以内導入希望という条件です。過去3年間の類似案件データから、同じ条件の成約事例が15件あり、成約率は業界平均56%を大きく上回る78%です。提案アプローチA-1を用いた案件では平均受注額が当初予算比112%となっており、顧客満足度も高い傾向にあります。このため、当該アプローチを強く推奨します。');
    expect(explanation.reasoningSources).toBeDefined();
    expect(explanation.reasoningSources.similarPatterns).toBe(15);
    expect(explanation.reasoningSources.successRate).toBe(78);
    expect(explanation.reasoningSources.averageContractValue).toBe(112);
    expect(explanation.readinessLevel).toBe('営業向け');

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(dealData);
    expect(mockRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});