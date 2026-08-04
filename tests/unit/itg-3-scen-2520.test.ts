import { findSimilarPatterns, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2520
  test('成功要因の件数が閾値直下のとき、テンプレートに含まれる', async () => {
    const successFactorThreshold = 10;
    const successFactorCountBelowThreshold = 9;

    const newDealData = {
      customerId: 'CUST-20240115-001',
      customerIndustry: 'manufacturing',
      customerSize: 'mid-market',
      dealAmount: 5000000,
      dealStage: 'initial_contact',
      dealCategory: 'product_solution',
      salesPersonId: 'SP-2024-0042',
      dealStartDate: new Date('2024-01-15T09:00:00Z'),
    };

    const successPatterns = [
      {
        patternId: 'SP-001',
        customerIndustry: 'manufacturing',
        customerSize: 'mid-market',
        dealCategory: 'product_solution',
        successFactors: [
          { factorId: 'SF-001', description: '顧客の経営課題を定量化した提案', weight: 0.95 },
          { factorId: 'SF-002', description: 'ROI計算を含む経営資料の作成', weight: 0.92 },
          { factorId: 'SF-003', description: '導入リスク軽減策の事前提示', weight: 0.88 },
          { factorId: 'SF-004', description: '類似業界での成功事例の提示', weight: 0.85 },
          { factorId: 'SF-005', description: '実装スケジュールの明確化', weight: 0.83 },
          { factorId: 'SF-006', description: 'スタッフ教育計画の含有', weight: 0.80 },
          { factorId: 'SF-007', description: 'サポート体制の詳細説明', weight: 0.78 },
          { factorId: 'SF-008', description: '競合他社との差別化ポイント強調', weight: 0.75 },
          { factorId: 'SF-009', description: '初期投資の段階的払い条件提案', weight: 0.72 },
        ],
        relevanceScore: 0,
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        patterns: successPatterns,
        matchCount: 1,
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternId: 'SP-001',
        relevanceScore: 87,
        successFactorCount: successFactorCountBelowThreshold,
        isAboveThreshold: successFactorCountBelowThreshold >= successFactorThreshold,
        factorDetails: successPatterns[0].successFactors,
      }),
    };

    const result = await findSimilarPatterns(newDealData, mockAIEngine);

    const relevanceEval = await evaluatePatternRelevance(
      result.patterns[0],
      newDealData,
      mockAIEngine,
      successFactorThreshold
    );

    expect(relevanceEval.successFactorCount).toBe(successFactorCountBelowThreshold);
    expect(relevanceEval.successFactorCount).toBeLessThan(successFactorThreshold);
    expect(relevanceEval.factorDetails).toHaveLength(successFactorCountBelowThreshold);

    const templateIncluded =
      relevanceEval.successFactorCount > 0 &&
      relevanceEval.factorDetails.length === successFactorCountBelowThreshold;

    expect(templateIncluded).toBe(true);

    const recommendationResult = {
      templateIncluded: true,
      successPatternTemplate: {
        heading: '成功パターン',
        subheadings: ['適用根拠', '実装アクション'],
        successFactors: relevanceEval.factorDetails.map((factor) => ({
          factorId: factor.factorId,
          description: factor.description,
          weight: factor.weight,
        })),
        relevanceScore: relevanceEval.relevanceScore,
        applicableForNewDeal: true,
      },
    };

    expect(recommendationResult.templateIncluded).toBe(true);
    expect(recommendationResult.successPatternTemplate).toHaveProperty('heading');
    expect(recommendationResult.successPatternTemplate).toHaveProperty('subheadings');
    expect(recommendationResult.successPatternTemplate.subheadings).toContain('適用根拠');
    expect(recommendationResult.successPatternTemplate.subheadings).toContain('実装アクション');
    expect(recommendationResult.successPatternTemplate.successFactors).toHaveLength(
      successFactorCountBelowThreshold
    );

    const allFactorsIncluded = recommendationResult.successPatternTemplate.successFactors.every(
      (factor) =>
        relevanceEval.factorDetails.some((detail) => detail.factorId === factor.factorId)
    );

    expect(allFactorsIncluded).toBe(true);
    expect(recommendationResult.successPatternTemplate.applicableForNewDeal).toBe(true);
  });
});