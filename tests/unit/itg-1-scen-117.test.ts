import { describe, test, expect, beforeEach } from '@jest/globals';
import { determineSalesRepExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-117
  test('抽出対象営業担当者のリストが逆順で並ぶ場合、正しい順序に並び替えられて確定される', () => {
    const input_sales_rep_ids = ['E003', 'E001', 'E002'];
    const extraction_start_date = '2024-01-01T00:00:00Z';
    const extraction_end_date = '2024-01-31T23:59:59Z';

    const result = determineSalesRepExtractionRange({
      sales_rep_ids: input_sales_rep_ids,
      period_start: extraction_start_date,
      period_end: extraction_end_date,
    });

    expect(result.confirmed_sales_rep_ids).toEqual(['E001', 'E002', 'E003']);
    expect(result.period_start).toBe(extraction_start_date);
    expect(result.period_end).toBe(extraction_end_date);
    expect(result.status).toBe('confirmed');
  });
});