import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2817
  test('過去商談データの成功率がちょうど50%のとき、重み付けスコアが中立値に設定される', () => {
    // モックデータ: 成功案件5件、失敗案件5件、計10件（成功率50%）
    const mockPatternData = {
      successCount: 5,
      failureCount: 5,
      totalCount: 10,
      successRate: 0.5,
      patterns: [
        {
          dealId: 'deal_001',
          customerId: 'cust_001',
          industry: 'manufacturing',
          dealSize: 1000000,
          outcome: 'success',
        },
        {
          dealId: 'deal_002',
          customerId: 'cust_002',
          industry: 'manufacturing',
          dealSize: 1200000,
          outcome: 'success',
        },
        {
          dealId: 'deal_003',
          customerId: 'cust_003',
          industry: 'manufacturing',
          dealSize: 950000,
          outcome: 'success',
        },
        {
          dealId: 'deal_004',
          customerId: 'cust_004',
          industry: 'manufacturing',
          dealSize: 1100000,
          outcome: 'success',
        },
        {
          dealId: 'deal_005',
          customerId: 'cust_005',
          industry: 'manufacturing',
          dealSize: 1050000,
          outcome: 'success',
        },
        {
          dealId: 'deal_006',
          customerId: 'cust_006',
          industry: 'manufacturing',
          dealSize: 800000,
          outcome: 'failure',
        },
        {
          dealId: 'deal_007',
          customerId: 'cust_007',
          industry: 'manufacturing',
          dealSize: 900000,
          outcome: 'failure',
        },
        {
          dealId: 'deal_008',
          customerId: 'cust_008',
          industry: 'manufacturing',
          dealSize: 750000,
          outcome: 'failure',
        },
        {
          dealId: 'deal_009',
          customerId: 'cust_009',
          industry: 'manufacturing',
          dealSize: 850000,
          outcome: 'failure',
        },
        {
          dealId: 'deal_010',
          customerId: 'cust_010',
          industry: 'manufacturing',
          dealSize: 700000,
          outcome: 'failure',
        },
      ],
    };

    // AIRecommendationEngine のスタブ化
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockPatternData.patterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest
        .fn()
        .mockResolvedValue(0.5),
    };

    // 新規案件の顧客・商談条件
    const newDealCondition = {
      customerId: 'cust_new_001',
      industry: 'manufacturing',
      dealSize: 1000000,
      proposalApproach: 'direct_engagement',
    };

    // テスト実行：重み付けスコア計算処理を実行
    const result = evaluatePatternRelevance(
      newDealCondition,
      mockPatternData.patterns,
      mockAIEngine,
    );

    // 検証：返却された重み付けスコアが中立値（0.5）であること
    expect(result).toBe(0.5);

    // 成功率50%が利用可能な提案アプローチの信頼度に関して、
    // 推奨と非推奨のいずれにも傾かない状態を示していることを確認
    expect(result).toBeGreaterThanOrEqual(0.45);
    expect(result).toBeLessThanOrEqual(0.55);
  });
});