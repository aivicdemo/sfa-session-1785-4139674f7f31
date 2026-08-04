import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・提案アプローチ推奨機能', () => {
  // SCEN-2837
  test('過去商談から抽出された成功パターンが1件の場合、当該パターンに基づく提案アプローチが新規案件に推奨される', async () => {
    // Arrange: テスト用の新規案件データを準備
    const new_deal_input = {
      customer_industry: '製造業',
      deal_size_million_yen: 5.0,
      decision_maker_count: 3,
      purchase_cycle_months: 3,
    };

    // テスト用の過去商談データ（成功事例1件）
    const past_success_pattern = {
      pattern_id: 'PAT-20240115-001',
      customer_industry: '製造業',
      deal_size_million_yen: 5.0,
      decision_maker_count: 3,
      purchase_cycle_months: 3,
      success_approach: '経営課題ヒアリング→ROI試算提示→3段階提案',
      success_rate: 0.85,
      case_count: 1,
    };

    // AIRecommendationEngine の findSimilarPatterns をスタブで設定
    const mock_find_similar_patterns = jest
      .fn()
      .mockResolvedValue([
        {
          pattern_id: past_success_pattern.pattern_id,
          similarity_score: 1.0,
          industry: past_success_pattern.customer_industry,
          deal_size_range: `${past_success_pattern.deal_size_million_yen}M`,
          decision_maker_count: past_success_pattern.decision_maker_count,
          purchase_cycle_months: past_success_pattern.purchase_cycle_months,
        },
      ]);

    // AIRecommendationEngine の generateRecommendation をスタブで設定
    const mock_generate_recommendation = jest
      .fn()
      .mockResolvedValue({
        recommendation_id: 'REC-20240115-001',
        recommended_approach: '経営課題ヒアリング→ROI試算提示→3段階提案',
        confidence_score: 85,
        reasoning_basis: {
          matched_pattern_id: past_success_pattern.pattern_id,
          matching_criteria: {
            industry_match: '製造業（完全一致）',
            deal_size_match: '500万円（完全一致）',
            decision_maker_count_match: '3名（完全一致）',
            purchase_cycle_match: '3ヶ月（完全一致）',
          },
          past_success_rate: 85,
          reasoning_narrative:
            '過去の製造業・500万円規模・決定者3名の案件において、「経営課題ヒアリング→ROI試算提示→3段階提案」アプローチが85%の成約率で成功しています。本案件は過去事例と完全にマッチしているため、同じアプローチを推奨します。',
        },
      });

    // スタブの AIRecommendationEngine オブジェクトを作成
    const stub_recommendation_engine = {
      findSimilarPatterns: mock_find_similar_patterns,
      generateRecommendation: mock_generate_recommendation,
    };

    // Act: 新規案件に対して推奨機能を実行
    const result = await generateRecommendation(
      new_deal_input,
      stub_recommendation_engine
    );

    // Assert: 推奨アプローチが正しいことを検証
    expect(result.recommended_approach).toBe(
      '経営課題ヒアリング→ROI試算提示→3段階提案'
    );

    // 推奨結果の信頼度スコアが適切な値であることを検証
    expect(result.confidence_score).toBe(85);

    // recommendationId が適切に記録されていることを確認
    expect(result.recommendation_id).toBe('REC-20240115-001');

    // 推奨アプローチの根拠に登録した成功パターンの詳細情報が含まれていることを検証
    expect(result.reasoning_basis.matched_pattern_id).toBe(
      'PAT-20240115-001'
    );
    expect(result.reasoning_basis.matching_criteria.industry_match).toBe(
      '製造業（完全一致）'
    );
    expect(result.reasoning_basis.matching_criteria.deal_size_match).toBe(
      '500万円（完全一致）'
    );
    expect(result.reasoning_basis.matching_criteria.decision_maker_count_match).toBe(
      '3名（完全一致）'
    );
    expect(result.reasoning_basis.matching_criteria.purchase_cycle_match).toBe(
      '3ヶ月（完全一致）'
    );

    // 過去の成約率が反映されていることを検証
    expect(result.reasoning_basis.past_success_rate).toBe(85);

    // 根拠の自然言語説明が含まれていることを検証
    expect(result.reasoning_basis.reasoning_narrative).toContain(
      '製造業・500万円規模・決定者3名'
    );
    expect(result.reasoning_basis.reasoning_narrative).toContain('85%');
    expect(result.reasoning_basis.reasoning_narrative).toContain(
      '経営課題ヒアリング→ROI試算提示→3段階提案'
    );

    // スタブが正しく呼ばれたことを確認
    expect(mock_find_similar_patterns).toHaveBeenCalledWith(new_deal_input);
    expect(mock_generate_recommendation).toHaveBeenCalled();
  });
});