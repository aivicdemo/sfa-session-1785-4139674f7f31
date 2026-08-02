import { validateQualityRules } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-432
  test('修正済みデータ品質再検証 - 修正済みデータの数値が範囲の上限にちょうど達する場合、検証に合格する', () => {
    const record_id = 'rec_001';
    const field_name = 'sales_amount';
    const corrected_value = 100000;
    const upper_limit = 100000;
    const lower_limit = 0;

    const result = validateQualityRules({
      record_id,
      field_name,
      corrected_value,
      upper_limit,
      lower_limit,
    });

    expect(result.validation_status).toBe('合格');
    expect(result.error_message).toBe('');
    expect(result.rule_judgement_result).toBe(true);
  });
});