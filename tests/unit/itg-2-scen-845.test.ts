import { extractFailurePatterns } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析エンジン', () => {
  // SCEN-845
  test('同じ入力条件で失敗パターン抽出を2回実行したとき、同じ結果が返される', () => {
    const input_condition = {
      start_date: new Date('2024-01-01T00:00:00Z'),
      end_date: new Date('2024-01-31T23:59:59Z'),
      failure_reason_category: '顧客対応遅延',
      sales_employee_id: 'EMP-001',
    };

    const result_set_a = extractFailurePatterns(input_condition);

    const result_set_b = extractFailurePatterns(input_condition);

    expect(result_set_a.failure_patterns.length).toBe(
      result_set_b.failure_patterns.length
    );

    for (let i = 0; i < result_set_a.failure_patterns.length; i++) {
      const pattern_a = result_set_a.failure_patterns[i];
      const pattern_b = result_set_b.failure_patterns[i];

      expect(pattern_a.occurrence_datetime).toBe(
        pattern_b.occurrence_datetime
      );
      expect(pattern_a.failure_reason_detail).toBe(
        pattern_b.failure_reason_detail
      );
      expect(pattern_a.related_sales_deal_id).toBe(
        pattern_b.related_sales_deal_id
      );
      expect(pattern_a.failure_response_status).toBe(
        pattern_b.failure_response_status
      );
    }

    expect(result_set_a).toEqual(result_set_b);
  });
});