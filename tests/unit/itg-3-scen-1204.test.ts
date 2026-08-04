import { evaluateProposalSuitability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1204
  test('提案妥当性判定機能 - AIエージェント推奨根拠が利用不可の場合に代替ロジックで妥当性判定が実行される', () => {
    // Arrange: スタブ化されたAIRecommendationEngine（エラーを返す）
    const failingAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error('AI service unavailable')),
      findSimilarPatterns: jest.fn().mockRejectedValue(new Error('AI service unavailable')),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(new Error('AI service unavailable')),
      evaluatePatternRelevance: jest.fn().mockRejectedValue(new Error('AI service unavailable')),
    };

    // 推奨パターンマスタに統計的に上位の成功パターン（成功率80%以上）が3件以上存在することを確認
    const recommendationPatternMaster = [
      {
        pattern_id: 'PAT_MFG_001',
        success_rate: 0.85,
        customer_industry: 'manufacturing',
        deal_stage: 'initial_contact',
        budget_range_min: 3000000,
        budget_range_max: 8000000,
        success_factors: ['Initial needs analysis', 'Cost-benefit alignment', 'Stakeholder engagement'],
        pattern_description: 'Manufacturing sector with early-stage deal success',
      },
      {
        pattern_id: 'PAT_MFG_002',
        success_rate: 0.82,
        customer_industry: 'manufacturing',
        deal_stage: 'initial_contact',
        budget_range_min: 4000000,
        budget_range_max: 10000000,
        success_factors: ['Technical requirement matching', 'Timeline clarity', 'Implementation readiness'],
        pattern_description: 'Manufacturing with operational alignment focus',
      },
      {
        pattern_id: 'PAT_MFG_003',
        success_rate: 0.80,
        customer_industry: 'manufacturing',
        deal_stage: 'initial_contact',
        budget_range_min: 2000000,
        budget_range_max: 7000000,
        success_factors: ['ROI demonstration', 'Process optimization fit', 'Change management support'],
        pattern_description: 'Manufacturing with efficiency improvement angle',
      },
    ];

    // 新規案件データ
    const newDealData = {
      customer_industry: 'manufacturing',
      deal_stage: 'initial_contact',
      budget_size: 5000000,
    };

    // Act: 提案妥当性判定機能を実行
    const result = evaluateProposalSuitability(
      newDealData,
      recommendationPatternMaster,
      failingAIEngine,
    );

    // Assert
    // 1. AIエージェント呼び出しが失敗したこと（代替ロジックが発動したことの確認）
    expect(failingAIEngine.explainRecommendationReasoning).toHaveBeenCalled();

    // 2. 代替ロジックが発動し、推奨パターンマスタから統計的に上位の成功パターンが選出されたこと
    expect(result.fallback_triggered).toBe(true);
    expect(result.fallback_reason).toMatch(/AI service unavailable/);

    // 3. 推奨パターンIDが返却される（統計的に上位=成功率が高いパターンが選出）
    expect(result.recommended_pattern_id).toBe('PAT_MFG_001');

    // 4. パターン適用スコア（0-100）が返却される
    expect(result.pattern_applicability_score).toBe(85);

    // 5. 簡略版の根拠説明が返却される
    expect(result.recommendation_reasoning).toBeDefined();
    expect(result.recommendation_reasoning.pattern_id).toBe('PAT_MFG_001');
    expect(result.recommendation_reasoning.applicability_score).toBe(85);
    expect(result.recommendation_reasoning.success_factors).toEqual([
      'Initial needs analysis',
      'Cost-benefit alignment',
      'Stakeholder engagement',
    ]);
    expect(result.recommendation_reasoning.success_factors.length).toBeLessThanOrEqual(3);

    // 6. 簡略版フォーマットの構成確認（パターンID、適用可能性スコア、主要な成功要因3項目まで）
    expect(Object.keys(result.recommendation_reasoning)).toEqual(
      expect.arrayContaining([
        'pattern_id',
        'applicability_score',
        'success_factors',
      ]),
    );

    // 7. 外部AI呼び出しの再試行が実行されないこと（代替動作が即座に完了）
    expect(failingAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);

    // 8. 推奨内容と根拠説明が返却されていること
    expect(result).toHaveProperty('recommended_pattern_id');
    expect(result).toHaveProperty('pattern_applicability_score');
    expect(result).toHaveProperty('recommendation_reasoning');
  });
});