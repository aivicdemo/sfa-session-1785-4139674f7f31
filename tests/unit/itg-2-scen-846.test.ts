import { calculateConversionRate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析機能', () => {
  // SCEN-846
  test('同じ入力条件で成約率計算を2回実行したとき、同じ結果が返される', () => {
    const input_params = {
      target_period: '2024-01',
      sales_rep_id: 'A',
      product_category: 'X'
    };

    const result_first = calculateConversionRate(input_params);
    const result_second = calculateConversionRate(input_params);

    expect(result_first.conversion_rate).toBe(25.0);
    expect(result_first.initial_contact_count).toBe(100);
    expect(result_first.closed_count).toBe(25);

    expect(result_second.conversion_rate).toBe(25.0);
    expect(result_second.initial_contact_count).toBe(100);
    expect(result_second.closed_count).toBe(25);

    expect(result_first.conversion_rate).toBe(result_second.conversion_rate);
    expect(result_first.initial_contact_count).toBe(result_second.initial_contact_count);
    expect(result_first.closed_count).toBe(result_second.closed_count);
    expect(result_first.target_period).toBe(result_second.target_period);
    expect(result_first.sales_rep_id).toBe(result_second.sales_rep_id);
    expect(result_first.product_category).toBe(result_second.product_category);
  });
});