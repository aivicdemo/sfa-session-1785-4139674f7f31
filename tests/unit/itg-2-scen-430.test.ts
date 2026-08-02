import { validateCorrectedDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-430: [edge] 修正済みデータ品質再検証 - 修正済みデータの数値が範囲の下限にちょうど達する場合、検証に合格する
  test('修正済みデータが下限値にちょうど一致する場合、検証に合格する', () => {
    const corrected_data = {
      sales_amount: 100000,
      customer_id: 'C001',
      transaction_date: '2024-01-15',
    };

    const quality_rules = [
      {
        field_name: 'sales_amount',
        rule_type: 'range',
        min_value: 100000,
        max_value: 1000000,
      },
    ];

    const result = validateCorrectedDataQuality(corrected_data, quality_rules);

    expect(result.validation_status).toBe('合格');
    expect(result.error_details).toEqual([]);
    expect(result.corrected_values.sales_amount).toBe(100000);
  });
});