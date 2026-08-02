import { validateCorrectedDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 修正済みデータ品質再検証', () => {
  test('SCEN-433: 修正済みデータの数値が範囲の上限を超える場合、該当項目を改善必要項目として明示する', () => {
    const corrected_data = {
      customer_name: 'テスト顧客A',
      sales_amount: 150000,
    };

    const validation_rule = {
      field_name: '売上金額',
      rule_type: 'range',
      max_value: 100000,
    };

    const result = validateCorrectedDataQuality(corrected_data, validation_rule);

    expect(result.status).toBe('改善必要');
    expect(result.field_name).toBe('売上金額');
    expect(result.detected_value).toBe(150000);
    expect(result.limit_value).toBe(100000);
    expect(result.error_detail).toBe('項目名：売上金額、検出値：150000、上限値：100000');
  });
});