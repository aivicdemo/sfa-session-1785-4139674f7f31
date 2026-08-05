import { analyzeMultipleSalesPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-647
  test('複数の提案パターンが同一の乖離度を持つとき、すべてが正確に記録される', () => {
    // テストデータ: 同一の乖離度（0.45）を持つ提案パターンA・Bを生成
    const proposal_pattern_a = {
      proposal_id: 'PROP-001',
      sales_rep_id: 'REP-101',
      customer_id: 'CUST-201',
      proposal_date: '2024-01-15T10:30:00Z',
      contact_count: 3,
      customer_response_score: 0.75,
      deviation_score: 0.45,
      contract_flag: 1
    };

    const proposal_pattern_b = {
      proposal_id: 'PROP-002',
      sales_rep_id: 'REP-102',
      customer_id: 'CUST-202',
      proposal_date: '2024-01-16T14:20:00Z',
      contact_count: 3,
      customer_response_score: 0.75,
      deviation_score: 0.45,
      contract_flag: 1
    };

    const input_patterns = [proposal_pattern_a, proposal_pattern_b];

    // 自動分析機能を実行
    const analysis_result = analyzeMultipleSalesPatterns(input_patterns);

    // 返却されたレポート内の「提案パターン分析結果」セクションを確認
    expect(analysis_result).toBeDefined();
    expect(analysis_result.report_section).toBe('proposal_pattern_analysis_result');

    // 提案パターンA・B双方が乖離度 = 0.45として別々のレコードで格納されていることを検証
    expect(analysis_result.records).toHaveLength(2);

    // 各レコードの検証
    const record_a = analysis_result.records[0];
    expect(record_a.proposal_id).toBe('PROP-001');
    expect(record_a.sales_rep_id).toBe('REP-101');
    expect(record_a.customer_id).toBe('CUST-201');
    expect(record_a.proposal_date).toBe('2024-01-15T10:30:00Z');
    expect(record_a.contact_count).toBe(3);
    expect(record_a.customer_response_score).toBe(0.75);
    expect(record_a.deviation_score).toBe(0.45);
    expect(record_a.contract_flag).toBe(1);

    const record_b = analysis_result.records[1];
    expect(record_b.proposal_id).toBe('PROP-002');
    expect(record_b.sales_rep_id).toBe('REP-102');
    expect(record_b.customer_id).toBe('CUST-202');
    expect(record_b.proposal_date).toBe('2024-01-16T14:20:00Z');
    expect(record_b.contact_count).toBe(3);
    expect(record_b.customer_response_score).toBe(0.75);
    expect(record_b.deviation_score).toBe(0.45);
    expect(record_b.contract_flag).toBe(1);

    // 集計統計において「乖離度0.45の提案パターン件数 = 2」と正確にカウントされている
    expect(analysis_result.aggregation_statistics).toBeDefined();
    expect(analysis_result.aggregation_statistics.deviation_score_045_count).toBe(2);
    expect(analysis_result.aggregation_statistics.total_records).toBe(2);
  });
});