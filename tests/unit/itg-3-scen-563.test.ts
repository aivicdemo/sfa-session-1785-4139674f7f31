import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - 複数商談条件の推奨生成', () => {
  // SCEN-563
  test('新規案件の商談条件がすべて満たされるパターンのみを推奨対象として、統合導入支援パッケージを推奨根拠スコア0.88以上で返却する', async () => {
    // 新規案件データの準備
    const newDealData = {
      dealId: 'NEW-DEAL-001',
      customerId: 'CUST-2024-001',
      dealName: '統合システム導入案件',
      budgetAmount: 5000000,
      implementationPeriodDays: 90,
      requiresSystemIntegration: true,
    };

    // 商談条件3つの定義
    const dealConditions = [
      {
        conditionId: 'COND-001',
        type: 'BUDGET',
        description: '予算規模が500万円以上',
        threshold: 5000000,
        operator: 'GTE',
      },
      {
        conditionId: 'COND-002',
        type: 'IMPLEMENTATION_PERIOD',
        description: '導入期間が3ヶ月以内',
        threshold: 90,
        operator: 'LTE',
      },
      {
        conditionId: 'COND-003',
        type: 'SYSTEM_INTEGRATION',
        description: 'システム連携が必須',
        threshold: true,
        operator: 'EQ',
      },
    ];

    // AIRecommendationEngineのスタブ化
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PATTERN-A',
          matchScore: 0.92,
          satisfiedConditions: [
            { conditionId: 'COND-001', met: true },
            { conditionId: 'COND-002', met: true },
            { conditionId: 'COND-003', met: true },
          ],
          successExampleCount: 8,
          description: 'すべての条件を満たす統合導入パターン',
        },
        {
          patternId: 'PATTERN-B',
          matchScore: 0.75,
          satisfiedConditions: [
            { conditionId: 'COND-001', met: true },
            { conditionId: 'COND-002', met: true },
            { conditionId: 'COND-003', met: false },
          ],
          successExampleCount: 5,
          description: '予算と期間のみ満たすパターン',
        },
      ]),
      evaluatePatternRelevance: jest.fn((pattern) => {
        if (pattern.patternId === 'PATTERN-A') {
          return Promise.resolve({ relevanceScore: 0.9 });
        }
        return Promise.resolve({ relevanceScore: 0.65 });
      }),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '統合導入支援パッケージ',
        confidenceScore: 0.88,
        reasoning:
          '予算規模500万円以上・導入期間3ヶ月以内・システム連携必須のすべての商談条件に対応する成功パターン（パターンA）に基づいて推奨',
        applicablePatterns: ['PATTERN-A'],
        excludedPatterns: ['PATTERN-B'],
      }),
    };

    // 推奨生成機能を実行
    const result = await generateRecommendation(
      newDealData,
      dealConditions,
      mockAIEngine
    );

    // 返却された推奨結果の検証
    expect(result.recommendedApproach).toBe('統合導入支援パッケージ');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.88);
    expect(result.reasoning).toContain('予算規模500万円以上');
    expect(result.reasoning).toContain('導入期間3ヶ月以内');
    expect(result.reasoning).toContain('システム連携必須');
    expect(result.reasoning).toContain('パターンA');
    expect(result.applicablePatterns).toContain('PATTERN-A');
    expect(result.excludedPatterns).toContain('PATTERN-B');
    expect(result.applicablePatterns).not.toContain('PATTERN-B');

    // モック呼び出しの検証
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealData,
      dealConditions
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(2);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealData,
      dealConditions,
      expect.arrayContaining([
        expect.objectContaining({ patternId: 'PATTERN-A' }),
      ])
    );
  });
});