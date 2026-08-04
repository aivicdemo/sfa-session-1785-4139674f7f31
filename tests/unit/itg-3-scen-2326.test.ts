import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - 重複レコード除外', () => {
  // SCEN-2326
  test('過去商談データに重複レコードが含まれるとき重複が除外されて成功パターンが抽出される', () => {
    // 同一の商談内容を持つ重複レコード3件を準備
    const duplicateDealRecords = [
      {
        deal_id: 'DEAL-001',
        customer_name: 'ABC Corporation',
        product_category: 'Enterprise Software',
        contract_amount: 5000000,
        deal_period_days: 90,
        deal_status: 'won',
        created_at: new Date('2024-01-15T09:00:00Z'),
      },
      {
        deal_id: 'DEAL-002',
        customer_name: 'ABC Corporation',
        product_category: 'Enterprise Software',
        contract_amount: 5000000,
        deal_period_days: 90,
        deal_status: 'won',
        created_at: new Date('2024-01-20T10:30:00Z'),
      },
      {
        deal_id: 'DEAL-003',
        customer_name: 'ABC Corporation',
        product_category: 'Enterprise Software',
        contract_amount: 5000000,
        deal_period_days: 90,
        deal_status: 'won',
        created_at: new Date('2024-01-25T14:15:00Z'),
      },
    ];

    // AIRecommendationEngineのスタブ設定
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'REC-001',
        approach: 'Standard Enterprise Approach',
        confidence_score: 92,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue({
        patterns: duplicateDealRecords,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: 'Based on 1 historical success pattern',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevance_score: 88,
      }),
    };

    // 成功パターン抽出・照合機能を実行
    const result = extractSuccessPatterns(
      duplicateDealRecords,
      aiEngineStub,
    );

    // 抽出されたパターンのレコード数を検証
    expect(result.extracted_patterns.length).toBe(1);

    // 抽出されたパターンの内容を検証
    expect(result.extracted_patterns[0]).toEqual({
      customer_name: 'ABC Corporation',
      product_category: 'Enterprise Software',
      contract_amount: 5000000,
      deal_period_days: 90,
      deal_status: 'won',
      success_flag: true,
    });

    // 推奨パターンマスタに登録されるパターン数を検証
    expect(result.patterns_stored_in_master).toBe(1);

    // 登録されたパターンが重複排除後の1件のみであることを検証
    expect(result.master_pattern_record).toEqual({
      pattern_id: expect.any(String),
      customer_name: 'ABC Corporation',
      product_category: 'Enterprise Software',
      contract_amount: 5000000,
      deal_period_days: 90,
      success_flag: true,
      created_timestamp: expect.any(Date),
    });

    // 入力データとの一致を検証
    expect(result.master_pattern_record.customer_name).toBe(
      duplicateDealRecords[0].customer_name,
    );
    expect(result.master_pattern_record.product_category).toBe(
      duplicateDealRecords[0].product_category,
    );
    expect(result.master_pattern_record.contract_amount).toBe(
      duplicateDealRecords[0].contract_amount,
    );
    expect(result.master_pattern_record.deal_period_days).toBe(
      duplicateDealRecords[0].deal_period_days,
    );
    expect(result.master_pattern_record.success_flag).toBe(true);
  });
});