import { extractSalesProcessPatterns } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-776
  test('営業担当者が1件の商談記録を持つ場合、行動パターンが単一パターンとして抽出される', () => {
    const sales_rep_id = 'SR-A001';
    const deal_records = [
      {
        deal_id: 'DEAL-001',
        sales_rep_id: sales_rep_id,
        deal_type: '新規提案',
        execution_date: '2024-01-15',
        deal_amount: 500000,
        deal_status: '提案済み'
      }
    ];

    const result = extractSalesProcessPatterns({
      sales_rep_id: sales_rep_id,
      deal_records: deal_records
    });

    expect(result.patterns).toHaveLength(1);
    expect(result.patterns[0].pattern_name).toBe('新規提案');
    expect(result.patterns[0].occurrence_count).toBe(1);
    expect(result.patterns[0].confidence_score).toBe(100);
  });
});