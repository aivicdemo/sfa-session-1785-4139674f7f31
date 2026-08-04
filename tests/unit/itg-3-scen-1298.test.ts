import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1298
  test('[edge] 推奨根拠説明生成機能 - OpenAI API再試行が最大3回実行され、3回目の失敗後に簡略版が返却される', async () => {
    let apiCallCount = 0;
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(async () => {
        apiCallCount += 1;
        const error = new Error('API timeout');
        (error as any).code = 'ETIMEDOUT';
        throw error;
      }),
    };

    const mockPatternMaster = {
      getTopSuccessPatterns: jest.fn(() => [
        {
          patternId: 'pat_001',
          description: '顧客規模1000名以上の製造業において、Q1〜Q2の予算承認後に提案を実行すると採用率が高い',
          frequency: 0.85,
          adoptionRate: 0.78,
        },
        {
          patternId: 'pat_002',
          description: '競合他社導入事例との比較提案により意思決定サイクルが短縮される傾向',
          frequency: 0.72,
          adoptionRate: 0.71,
        },
      ]),
    };

    const dealCondition = {
      customerId: 'cust_12345',
      customerName: '株式会社サンプル',
      industry: '製造業',
      companySize: 1200,
      dealId: 'deal_98765',
      dealStage: '提案段階',
      proposedAt: '2024-01-15',
      productCategory: 'ERP',
      budgetAmount: 5000000,
    };

    const result = await explainRecommendationReasoning(
      dealCondition,
      mockAIEngine,
      mockPatternMaster,
    );

    expect(apiCallCount).toBe(3);
    expect(result).toEqual({
      source: 'pattern_master_fallback',
      explanation:
        '顧客規模1000名以上の製造業において、Q1〜Q2の予算承認後に提案を実行すると採用率が高い。競合他社導入事例との比較提案により意思決定サイクルが短縮される傾向。',
      confidence: 0.78,
      basedOnPatterns: [
        {
          patternId: 'pat_001',
          adoptionRate: 0.78,
        },
        {
          patternId: 'pat_002',
          adoptionRate: 0.71,
        },
      ],
    });
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    expect(mockPatternMaster.getTopSuccessPatterns).toHaveBeenCalledTimes(1);
  });
});