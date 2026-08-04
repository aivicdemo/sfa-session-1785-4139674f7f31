import { evaluateProposalWithConstraints } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  // SCEN-1314
  test('顧客制約条件データが0件のとき、照合判定が保留状態で返却される', () => {
    const proposalInput = {
      customerId: 'CUST-001',
      customerName: 'テスト顧客株式会社',
      productCategoryRequested: 'クラウドサービス',
      estimatedValue: 5000000,
      proposedApproach: '段階的導入によるコスト最適化提案',
      recommendationConfidenceScore: 85,
      recommendationReasoning: [
        '過去3年の類似顧客事例から成功率92%',
        '顧客のIT成熟度が高い',
        '予算枠が十分',
      ],
    };

    const constraintRecords: Array<{
      customerId: string;
      purchaseCategory: string;
      maxAmount: number;
      minPurchaseFrequency: number;
    }> = [];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '段階的導入によるコスト最適化提案',
        confidenceScore: 85,
        reasoning: proposalInput.recommendationReasoning,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { patternId: 'PAT-2022-001', matchScore: 0.92, description: '同規模顧客の成功事例' },
      ]),
    };

    const result = evaluateProposalWithConstraints(
      proposalInput,
      constraintRecords,
      mockAIRecommendationEngine,
    );

    expect(result.matchingStatus).toBe('PENDING');
    expect(result.message).toMatch(/顧客制約条件が登録されていないため/);
    expect(result.message).toMatch(/照合判定を保留/);
    expect(result.message).toMatch(/制約条件の登録後に改めて実行/);
    expect(result.proposalContent).toBeDefined();
    expect(result.proposalContent.recommendedApproach).toBe('段階的導入によるコスト最適化提案');
    expect(result.proposalContent.confidenceScore).toBe(85);
    expect(result.proposalContent.reasoning).toEqual(proposalInput.recommendationReasoning);
    expect(result.constraintMatchingResult).toBeUndefined();
    expect(result.isReexecuteButtonActive).toBe(true);
    expect(result.showConstraintMatchingResult).toBe(false);
  });
});