import { validateCorrectedDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-429
  test('修正済みデータが長さの上限未満である場合、検証に合格する', () => {
    const field_max_length = 100;
    const corrected_data = 'a'.repeat(99);
    const validation_rules = {
      field_name: 'customer_name',
      max_length: field_max_length,
      required: true,
      data_type: 'string',
    };

    const result = validateCorrectedDataQuality(corrected_data, validation_rules);

    expect(result.validation_status).toBe('合格');
    expect(result.error_message).toBe('');
    expect(result.approval_status).toBe('承認待ち');
  });
});