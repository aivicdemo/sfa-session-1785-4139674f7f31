import { generateSuccessPatternWeights } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けルール生成機能', () => {
  // SCEN-2761
  test('過去商談データが複数件の場合、全件から相関を集計した重み付けが生成される', () => {
    // テスト用の過去商談データ3件を準備
    const pastDealData = [
      {
        dealId: 'deal_A',
        result: 'success',
        customerScale: 'large',
        industry: 'manufacturing',
        proposalMethod: 'proposal_type',
      },
      {
        dealId: 'deal_B',
        result: 'success',
        customerScale: 'medium',
        industry: 'retail',
        proposalMethod: 'consulting_type',
      },
      {
        dealId: 'deal_C',
        result: 'success',
        customerScale: 'large',
        industry: 'manufacturing',
        proposalMethod: 'proposal_type',
      },
    ];

    // AIRecommendationEngineをスタブで初期化
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          dealId: 'deal_A',
          result: 'success',
          customerScale: 'large',
          industry: 'manufacturing',
          proposalMethod: 'proposal_type',
          similarityScore: 0.95,
        },
        {
          dealId: 'deal_B',
          result: 'success',
          customerScale: 'medium',
          industry: 'retail',
          proposalMethod: 'consulting_type',
          similarityScore: 0.75,
        },
        {
          dealId: 'deal_C',
          result: 'success',
          customerScale: 'large',
          industry: 'manufacturing',
          proposalMethod: 'proposal_type',
          similarityScore: 0.92,
        },
      ]),
    };

    // 新規案件の条件を準備
    const newDealCondition = {
      customerScale: 'large',
      industry: 'manufacturing',
    };

    // 成功パターン抽出・重み付けルール生成機能を実行
    const weightingRule = generateSuccessPatternWeights(
      newDealCondition,
      pastDealData,
      mockAIEngine
    );

    // 生成された重み付けルールの内容を検証
    // 出現回数の検証
    expect(weightingRule.patternCounts.customerScale.large).toBe(2);
    expect(weightingRule.patternCounts.industry.manufacturing).toBe(2);
    expect(weightingRule.patternCounts.proposalMethod.proposal_type).toBe(2);

    // 重み付けスコアを検証
    // 各パターンの出現頻度が全件（3件）に基づいて集計されていることを確認
    expect(weightingRule.weights.customerScale.large).toBeCloseTo(
      0.6666666666666666,
      5
    );
    expect(weightingRule.weights.industry.manufacturing).toBeCloseTo(
      0.6666666666666666,
      5
    );
    expect(weightingRule.weights.proposalMethod.proposal_type).toBeCloseTo(
      0.6666666666666666,
      5
    );

    // 生成されたルールが推奨パターンマスタに保存されていることを確認
    expect(weightingRule.totalDatasetSize).toBe(3);
    expect(weightingRule.ruleId).toBeDefined();
    expect(weightingRule.generatedAt).toBeDefined();
    expect(weightingRule.applicablePatterns).toContain('customerScale:large');
    expect(weightingRule.applicablePatterns).toContain(
      'industry:manufacturing'
    );
    expect(weightingRule.applicablePatterns).toContain(
      'proposalMethod:proposal_type'
    );

    // AIエンジンが正しく呼ばれたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
  });
});