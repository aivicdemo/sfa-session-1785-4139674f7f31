import { calculateDivergenceScore, determineCorrectionPriority } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-267
  test('成約実績0件の営業担当者について、商談進捗と提案内容の乖離度から改善指導内容が判定される', () => {
    // Setup: 成約実績0件の営業担当者Aのテストデータ
    const sales_rep_id = 'SR001';
    const closed_deals_count = 0;

    // 商談データ
    const deals = [
      {
        deal_id: 'DEAL001',
        sales_rep_id: sales_rep_id,
        progress_rate: 80,
        proposal_type: 'high_tier_plan',
      },
      {
        deal_id: 'DEAL002',
        sales_rep_id: sales_rep_id,
        progress_rate: 60,
        proposal_type: 'standard_plan',
      },
    ];

    // 顧客属性データ
    const customers = [
      {
        customer_id: 'CUST001',
        budget_size: 'medium',
        adoption_intent: 'low',
      },
      {
        customer_id: 'CUST002',
        budget_size: 'small',
        adoption_intent: 'medium',
      },
    ];

    // 商談と顧客の対応関係
    const deal_customer_map = [
      { deal_id: 'DEAL001', customer_id: 'CUST001' },
      { deal_id: 'DEAL002', customer_id: 'CUST002' },
    ];

    // Action: 行動パターン分析エンジンを実行し、商談進捗と提案内容の乖離度を計算
    const divergence_score_result = calculateDivergenceScore({
      deals: deals,
      customers: customers,
      deal_customer_map: deal_customer_map,
    });

    // Assert: 乖離度が計算されている
    expect(divergence_score_result.divergence_percentage).toBe(75);
    expect(divergence_score_result.deal_count).toBe(2);

    // Action: 改善指導優先順位判定ロジックを実行
    const priority_result = determineCorrectionPriority({
      sales_rep_id: sales_rep_id,
      closed_deals_count: closed_deals_count,
      divergence_percentage: divergence_score_result.divergence_percentage,
      average_progress_rate: 70,
    });

    // Assert: 判定結果を確認
    expect(priority_result.correction_content).toBe('顧客属性に対する提案内容の適切性向上が必須');
    expect(priority_result.priority_level).toBe('high');
    expect(priority_result.reason).toBe('成約実績0件で、商談進捗度70%に対し顧客予算規模と提案内容の乖離度が75%以上');
  });
});