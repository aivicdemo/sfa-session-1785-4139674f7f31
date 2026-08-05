import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { determineSalesRepExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-116
  test('抽出対象営業担当者の範囲が複数名で重複データを含む場合、重複が排除され正しく確定される', () => {
    const sales_rep_input_list = [
      { sales_rep_id: 'SR001', sales_rep_name: '営業担当者A' },
      { sales_rep_id: 'SR002', sales_rep_name: '営業担当者B' },
      { sales_rep_id: 'SR001', sales_rep_name: '営業担当者A' }
    ];

    const extraction_period_start = '2024-01-01';
    const extraction_period_end = '2024-01-31';

    const result = determineSalesRepExtractionRange({
      sales_rep_list: sales_rep_input_list,
      extraction_period_start: extraction_period_start,
      extraction_period_end: extraction_period_end
    });

    expect(result.confirmed_sales_rep_list).toHaveLength(2);
    expect(result.confirmed_sales_rep_list[0]).toEqual({
      sales_rep_id: 'SR001',
      sales_rep_name: '営業担当者A'
    });
    expect(result.confirmed_sales_rep_list[1]).toEqual({
      sales_rep_id: 'SR002',
      sales_rep_name: '営業担当者B'
    });
    expect(result.extraction_period_start).toBe('2024-01-01');
    expect(result.extraction_period_end).toBe('2024-01-31');
    expect(result.duplicate_count).toBe(1);
    expect(result.is_range_confirmed).toBe(true);
  });
});