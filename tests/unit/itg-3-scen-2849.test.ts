import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2849: 推奨内容の成約実績相関判定機能 - 中程度相関スコアの場合は条件付き承認と決定される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: '顧客の課題解決型提案',
        confidenceScore: 85,
        correlationScore: 0.65,
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PAT-001',
          industry: '製造業',
          budgetRange: '5000万円',
          decisionMakersCount: 3,
          successRate: 0.68,
        },
        {
          patternId: 'PAT-002',
          industry: '製造業',
          budgetRange: '5000万円',
          decisionMakersCount: 3,
          successRate: 0.62,
        },
        {
          patternId: 'PAT-003',
          industry: '製造業',
          budgetRange: '5000万円',
          decisionMakersCount: 3,
          successRate: 0.65,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockReturnValue('過去3件の類似事例との分析により推奨'),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.65),
    };

    const customerInfo = {
      industry: '製造業',
      budgetAmount: 50000000,
      decisionMakersCount: 3,
      companyName: 'テスト製造会社',
      contactPersonName: '営業太郎',
    };

    const dealConditions = {
      dealId: 'DEAL-2024-001',
      dealStage: 'proposal',
      productCategory: 'enterprise_solution',
      estimatedContractValue: 50000000,
      expectedClosingDate: '2024-03-31',
    };

    const result = generateRecommendation(customerInfo, dealConditions, mockAIEngine);

    expect(result.correlationScore).toBe(0.65);
    expect(result.judgmentResult).toBe('CONDITIONAL_APPROVAL');
    expect(result.judgmentReason).toContain('成約実績との相関が中程度のため、営業判断による適用可否検討が必要');
    expect(result.requiredApprovalFlag).toBe(true);
  });
});