import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件に推奨するAIエージェント機能', () => {
  // SCEN-2086
  test('提案内容と顧客対応パターンの標準プロセス照合分析 - 重複データ除去による合致スコア計算', async () => {
    // テストデータ: 顧客対応パターンレコード10件（うち重複3件）
    const customer_response_patterns = [
      {
        pattern_id: 'PAT-001',
        industry: '製造業',
        company_scale: '中堅',
        issue_category: 'DX推進',
        success_pattern_id: 'SUCCESS-001',
        match_weight: 1.0
      },
      {
        pattern_id: 'PAT-002',
        industry: '製造業',
        company_scale: '中堅',
        issue_category: 'DX推進',
        success_pattern_id: 'SUCCESS-001',
        match_weight: 1.0
      },
      {
        pattern_id: 'PAT-003',
        industry: '製造業',
        company_scale: '中堅',
        issue_category: 'DX推進',
        success_pattern_id: 'SUCCESS-001',
        match_weight: 1.0
      },
      {
        pattern_id: 'PAT-004',
        industry: '製造業',
        company_scale: '大手',
        issue_category: 'コスト削減',
        success_pattern_id: 'SUCCESS-002',
        match_weight: 0.8
      },
      {
        pattern_id: 'PAT-005',
        industry: 'IT',
        company_scale: '中堅',
        issue_category: 'セキュリティ',
        success_pattern_id: 'SUCCESS-003',
        match_weight: 0.7
      },
      {
        pattern_id: 'PAT-006',
        industry: '小売',
        company_scale: '中堅',
        issue_category: 'DX推進',
        success_pattern_id: 'SUCCESS-004',
        match_weight: 0.9
      },
      {
        pattern_id: 'PAT-007',
        industry: '金融',
        company_scale: '中堅',
        issue_category: 'DX推進',
        success_pattern_id: 'SUCCESS-005',
        match_weight: 0.85
      },
      {
        pattern_id: 'PAT-008',
        industry: '製造業',
        company_scale: '中堅',
        issue_category: 'DX推進',
        success_pattern_id: 'SUCCESS-001',
        match_weight: 1.0
      },
      {
        pattern_id: 'PAT-009',
        industry: '医療',
        company_scale: '大手',
        issue_category: 'システム統合',
        success_pattern_id: 'SUCCESS-006',
        match_weight: 0.75
      },
      {
        pattern_id: 'PAT-010',
        industry: '教育',
        company_scale: '中堅',
        issue_category: 'デジタル化',
        success_pattern_id: 'SUCCESS-007',
        match_weight: 0.65
      }
    ];

    // 新規案件の顧客・商談条件
    const new_deal_condition = {
      industry: '製造業',
      company_scale: '中堅',
      issue_category: 'DX推進'
    };

    // スタブ: AIRecommendationEngine.evaluatePatternRelevance()
    const mock_evaluate_pattern_relevance = jest.fn((patterns, deal_condition) => {
      // 重複を除去したユニークレコード数を計算
      const unique_patterns = Array.from(
        new Map(
          patterns.map(p => [
            `${p.industry}|${p.company_scale}|${p.issue_category}|${p.success_pattern_id}`,
            p
          ])
        ).values()
      );

      const unique_count = unique_patterns.length;
      const total_count = patterns.length;
      const duplicate_count = total_count - unique_count;

      // 照合対象パターンを抽出（新規案件条件に合致）
      const matched_unique_patterns = unique_patterns.filter(
        p =>
          p.industry === deal_condition.industry &&
          p.company_scale === deal_condition.company_scale &&
          p.issue_category === deal_condition.issue_category
      );

      const matched_count = matched_unique_patterns.length;
      
      // 合致スコア計算: 照合対象ユニークパターン数 / 総ユニークパターン数 * 100
      const relevance_score = Math.round((matched_count / unique_count) * 100);

      return {
        relevance_score: relevance_score,
        matched_pattern_count: matched_count,
        unique_pattern_count: unique_count,
        total_pattern_count: total_count,
        duplicate_count: duplicate_count,
        rationale: `照合対象パターン：${unique_count}件（重複${duplicate_count}件を除去）`
      };
    });

    // generateRecommendation()実行
    const recommendation_result = await generateRecommendation(
      new_deal_condition,
      customer_response_patterns,
      mock_evaluate_pattern_relevance
    );

    // 期待値: 重複3件を除去した7件のユニークレコードに基づいて計算
    const expected_unique_count = 7;
    const expected_total_count = 10;
    const expected_duplicate_count = 3;
    const expected_matched_count = 1; // 製造業・中堅・DX推進に合致するユニークパターンは1件
    const expected_relevance_score = Math.round((expected_matched_count / expected_unique_count) * 100); // (1/7)*100 = 14

    // 検証
    expect(recommendation_result.pattern_analysis.unique_pattern_count).toBe(expected_unique_count);
    expect(recommendation_result.pattern_analysis.total_pattern_count).toBe(expected_total_count);
    expect(recommendation_result.pattern_analysis.duplicate_count).toBe(expected_duplicate_count);
    expect(recommendation_result.pattern_analysis.matched_pattern_count).toBe(expected_matched_count);
    expect(recommendation_result.pattern_analysis.relevance_score).toBe(expected_relevance_score);
    
    // 根拠説明に重複除去が明記されていることを確認
    expect(recommendation_result.pattern_analysis.rationale).toMatch(/照合対象パターン：7件/);
    expect(recommendation_result.pattern_analysis.rationale).toMatch(/重複3件を除去/);

    // スタブ呼び出し確認
    expect(mock_evaluate_pattern_relevance).toHaveBeenCalledTimes(1);
    expect(mock_evaluate_pattern_relevance).toHaveBeenCalledWith(
      customer_response_patterns,
      new_deal_condition
    );
  });
});