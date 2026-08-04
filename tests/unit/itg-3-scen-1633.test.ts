import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1633: [normal] 推奨妥当性スコア算出機能 - 購買金額が0の履歴データを含む場合、スコア算出に正しく反映される', () => {
    // テストデータ: 購買金額0円を含む顧客購買履歴データセット
    const purchaseHistoryWithZero = [
      {
        deal_id: 'deal_001',
        customer_id: 'cust_a',
        purchase_amount: 100000,
        purchase_date: '2024-01-10',
      },
      {
        deal_id: 'deal_002',
        customer_id: 'cust_a',
        purchase_amount: 250000,
        purchase_date: '2024-02-15',
      },
      {
        deal_id: 'deal_003',
        customer_id: 'cust_a',
        purchase_amount: 0, // 購買金額0円のレコード
        purchase_date: '2024-03-20',
      },
      {
        deal_id: 'deal_004',
        customer_id: 'cust_a',
        purchase_amount: 150000,
        purchase_date: '2024-04-05',
      },
      {
        deal_id: 'deal_005',
        customer_id: 'cust_a',
        purchase_amount: 300000,
        purchase_date: '2024-05-12',
      },
    ];

    // 購買金額0円を除いたデータセット
    const purchaseHistoryWithoutZero = [
      {
        deal_id: 'deal_001',
        customer_id: 'cust_a',
        purchase_amount: 100000,
        purchase_date: '2024-01-10',
      },
      {
        deal_id: 'deal_002',
        customer_id: 'cust_a',
        purchase_amount: 250000,
        purchase_date: '2024-02-15',
      },
      {
        deal_id: 'deal_004',
        customer_id: 'cust_a',
        purchase_amount: 150000,
        purchase_date: '2024-04-05',
      },
      {
        deal_id: 'deal_005',
        customer_id: 'cust_a',
        purchase_amount: 300000,
        purchase_date: '2024-05-12',
      },
    ];

    // AIRecommendationEngine のスタブ: 固定の関連性スコア（0.75）を返す
    const stubAIEngine = {
      evaluatePatternRelevance: jest.fn(() => ({
        relevance_score: 0.75,
        confidence: 0.82,
      })),
    };

    // 顧客データと商談条件
    const customerData = {
      customer_id: 'cust_a',
      customer_name: 'Customer A',
      industry: 'manufacturing',
      company_size: 'large',
    };

    const dealCondition = {
      deal_id: 'deal_006',
      customer_id: 'cust_a',
      product_category: 'solution_b',
      estimated_amount: 200000,
      target_close_date: '2024-06-30',
    };

    // 推奨妥当性スコア算出機能を呼び出し（0円を含む場合）
    const resultWithZero = evaluatePatternRelevance(
      customerData,
      dealCondition,
      purchaseHistoryWithZero,
      stubAIEngine
    );

    // 推奨妥当性スコア算出機能を呼び出し（0円を除く場合）
    const resultWithoutZero = evaluatePatternRelevance(
      customerData,
      dealCondition,
      purchaseHistoryWithoutZero,
      stubAIEngine
    );

    // 購買金額0円のレコードが計算対象に含まれていることを確認
    // 分母が異なる（5件 vs 4件）ため、スコアが異なることを検証
    expect(resultWithZero).toBeDefined();
    expect(resultWithZero).toHaveProperty('overall_score');
    expect(resultWithZero).toHaveProperty('data_quality_score');
    expect(resultWithZero).toHaveProperty('pattern_match_score');
    expect(resultWithZero).toHaveProperty('records_processed');
    expect(resultWithZero).toHaveProperty('zero_amount_records_count');

    // 0円レコードが1件として計上されていることを確認
    expect(resultWithZero.zero_amount_records_count).toBe(1);

    // 処理対象レコード数: 0円を含む場合は5件
    expect(resultWithZero.records_processed).toBe(5);

    // 0円を除いた場合の処理対象レコード数: 4件
    expect(resultWithoutZero.records_processed).toBe(4);

    // スコアが異なることを確認（0円を含む場合のスコアが低下）
    expect(resultWithZero.overall_score).toBeLessThan(resultWithoutZero.overall_score);

    // スコアの具体値を検証
    // 0円を含む場合のスコア: (0.75 * 4 + 0.0) / 5 = 0.60
    // 0円を除く場合のスコア: (0.75 * 4) / 4 = 0.75
    expect(resultWithZero.overall_score).toBe(0.60);
    expect(resultWithoutZero.overall_score).toBe(0.75);

    // スコア算出ログに0円レコードの処理記録が残っていることを確認
    expect(resultWithZero).toHaveProperty('processing_log');
    expect(resultWithZero.processing_log).toContain('0円の購買履歴レコード：1件を処理対象に含める');

    // AIRecommendationEngine のスタブが呼び出されたことを確認
    expect(stubAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});