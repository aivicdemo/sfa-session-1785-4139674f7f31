import { findSimilarPatterns, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-2-1-1';

describe('推奨内容の根拠表示機能', () => {
  // SCEN-2773
  test('新規案件の顧客・商談条件が入力された場合、マッチした過去成功パターンが特定される', async () => {
    // 入力: 新規案件の顧客情報と商談条件
    const input_customer_industry = '製造業';
    const input_customer_employee_size = '500～1000名';
    const input_customer_region = '関東';
    const input_deal_stage = '提案前';
    const input_budget_size = '5000万円以上';
    const input_desired_implementation_period = '3ヶ月以内';
    const input_main_issue = '生産効率化';

    // AIRecommendationEngine.findSimilarPatterns のスタブ
    const stub_find_similar_patterns = jest.fn().mockResolvedValue([
      {
        pattern_id: 'pattern_a',
        industry: '製造業',
        employee_size: '500～1000名',
        region: '関東',
        deal_stage: '提案前',
        budget_size: '5000万円以上',
        implementation_period: '3ヶ月以内',
        main_issue: '生産効率化',
        similarity_score: 0.92,
      },
      {
        pattern_id: 'pattern_b',
        industry: '製造業',
        employee_size: '300～500名',
        region: '関東',
        deal_stage: '提案段階',
        budget_size: '3000万～5000万',
        implementation_period: '6ヶ月',
        main_issue: '生産効率化',
        similarity_score: 0.78,
      },
    ]);

    // AIRecommendationEngine.evaluatePatternRelevance のスタブ
    const stub_evaluate_pattern_relevance = jest.fn()
      .mockResolvedValueOnce({
        pattern_id: 'pattern_a',
        applicability_score: 0.95,
      })
      .mockResolvedValueOnce({
        pattern_id: 'pattern_b',
        applicability_score: 0.81,
      });

    // findSimilarPatterns を実行
    const result_similar_patterns = await findSimilarPatterns(
      {
        industry: input_customer_industry,
        employee_size: input_customer_employee_size,
        region: input_customer_region,
        deal_stage: input_deal_stage,
        budget_size: input_budget_size,
        implementation_period: input_desired_implementation_period,
        main_issue: input_main_issue,
      },
      stub_find_similar_patterns,
    );

    // 期待値: マッチした過去成功パターンが類似度スコアの降順で返却される
    expect(result_similar_patterns).toEqual([
      {
        pattern_id: 'pattern_a',
        industry: '製造業',
        employee_size: '500～1000名',
        region: '関東',
        deal_stage: '提案前',
        budget_size: '5000万円以上',
        implementation_period: '3ヶ月以内',
        main_issue: '生産効率化',
        similarity_score: 0.92,
      },
      {
        pattern_id: 'pattern_b',
        industry: '製造業',
        employee_size: '300～500名',
        region: '関東',
        deal_stage: '提案段階',
        budget_size: '3000万～5000万',
        implementation_period: '6ヶ月',
        main_issue: '生産効率化',
        similarity_score: 0.78,
      },
    ]);

    // evaluatePatternRelevance を各パターンに対して実行
    const result_applicability_pattern_a = await evaluatePatternRelevance(
      result_similar_patterns[0],
      {
        industry: input_customer_industry,
        employee_size: input_customer_employee_size,
        region: input_customer_region,
        deal_stage: input_deal_stage,
        budget_size: input_budget_size,
        implementation_period: input_desired_implementation_period,
        main_issue: input_main_issue,
      },
      stub_evaluate_pattern_relevance,
    );

    const result_applicability_pattern_b = await evaluatePatternRelevance(
      result_similar_patterns[1],
      {
        industry: input_customer_industry,
        employee_size: input_customer_employee_size,
        region: input_customer_region,
        deal_stage: input_deal_stage,
        budget_size: input_budget_size,
        implementation_period: input_desired_implementation_period,
        main_issue: input_main_issue,
      },
      stub_evaluate_pattern_relevance,
    );

    // 期待値: 適用可能性スコアが返却される
    expect(result_applicability_pattern_a).toEqual({
      pattern_id: 'pattern_a',
      applicability_score: 0.95,
    });

    expect(result_applicability_pattern_b).toEqual({
      pattern_id: 'pattern_b',
      applicability_score: 0.81,
    });

    // 期待結果の検証
    // ①マッチした過去成功パターンが類似度スコアの降順で表示される
    expect(result_similar_patterns[0].similarity_score).toBe(0.92);
    expect(result_similar_patterns[1].similarity_score).toBe(0.78);
    expect(result_similar_patterns[0].similarity_score > result_similar_patterns[1].similarity_score).toBe(true);

    // ②各パターンの適用可能性スコアが表示される
    expect(result_applicability_pattern_a.applicability_score).toBe(0.95);
    expect(result_applicability_pattern_b.applicability_score).toBe(0.81);

    // ③パターンAの根拠詳細: 入力値とマッチした項目の一致を確認
    const pattern_a = result_similar_patterns[0];
    expect(pattern_a.industry).toBe(input_customer_industry);
    expect(pattern_a.employee_size).toBe(input_customer_employee_size);
    expect(pattern_a.region).toBe(input_customer_region);
    expect(pattern_a.deal_stage).toBe(input_deal_stage);
    expect(pattern_a.budget_size).toBe(input_budget_size);
    expect(pattern_a.implementation_period).toBe(input_desired_implementation_period);
    expect(pattern_a.main_issue).toBe(input_main_issue);

    // スタブが正しく呼び出されたことを確認
    expect(stub_find_similar_patterns).toHaveBeenCalled();
    expect(stub_evaluate_pattern_relevance).toHaveBeenCalledTimes(2);
  });
});