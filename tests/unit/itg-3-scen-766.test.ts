import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化', () => {
  test('SCEN-766: evaluatePatternRelevance が適用可能スコア 0.85 を返すとき、スコア値が適用判定に使用される', () => {
    // 前提: AIRecommendationEngine.evaluatePatternRelevance のモック設定
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // テスト入力: 商談条件（顧客業種、商品カテゴリ、予算規模等）
    const dealCondition = {
      customerIndustry: 'IT',
      productCategory: 'クラウドソリューション',
      budgetScale: 5000000,
      dealStage: '初期段階',
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
    };

    const successPatterns = [
      {
        patternId: 'PAT-001',
        name: 'IT企業向けクラウド標準提案',
        relevanceScore: 0.85,
        description: 'IT業界の中堅企業に対するクラウド導入提案',
        recommendedApproach: 'TCO削減とスケーラビリティの両立提案',
      },
      {
        patternId: 'PAT-002',
        name: '低予算向けシンプル導入',
        relevanceScore: 0.62,
        description: '予算制約がある企業向けの段階的導入提案',
        recommendedApproach: '最小限の機能から開始する提案',
      },
    ];

    // 推奨生成ロジック実行
    const result = generateRecommendation(
      dealCondition,
      successPatterns,
      mockAIRecommendationEngine
    );

    // 期待結果: スコア値 0.85 が適用判定閾値（0.7以上）の判定により適用可能と判定される
    const applicabilityThreshold = 0.7;

    // evaluatePatternRelevance が呼び出されたことを確認
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();

    // 返却されたスコア値が 0.85
    const evaluatedScore = mockAIRecommendationEngine.evaluatePatternRelevance();
    expect(evaluatedScore).toBe(0.85);

    // スコア値が閾値を満たしているか確認
    expect(evaluatedScore >= applicabilityThreshold).toBe(true);

    // 対応する成功パターン（PAT-001）が推奨候補に選定されていることを確認
    expect(result.recommendedPatterns).toContainEqual(
      expect.objectContaining({
        patternId: 'PAT-001',
        name: 'IT企業向けクラウド標準提案',
        relevanceScore: 0.85,
      })
    );

    // 推奨結果に選定されたパターンのID・名称・推奨内容が含まれていることを確認
    expect(result.recommendedPatterns[0].patternId).toBe('PAT-001');
    expect(result.recommendedPatterns[0].name).toBe('IT企業向けクラウド標準提案');
    expect(result.recommendedPatterns[0].recommendedApproach).toBe(
      'TCO削減とスケーラビリティの両立提案'
    );

    // スコア値が判定ロジック内で正しく参照されていることを確認
    expect(result.applicabilityJudgment).toEqual({
      score: 0.85,
      meetsThreshold: true,
      threshold: applicabilityThreshold,
    });
  });
});