import { validateModifiedDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-428
  test('修正済みデータが長さの上限にちょうど達する場合、検証に合格する', () => {
    const modified_data = {
      sales_person_name: '田中太郎',
      field_type: 'sales_person_name',
    };

    const quality_rule = {
      field_name: 'sales_person_name',
      max_length: 6,
      rule_type: 'max_length_validation',
    };

    const validation_result = validateModifiedDataQuality(modified_data, quality_rule);

    expect(validation_result.status).toBe('合格');
    expect(validation_result.message).toBe('文字数が上限値（6文字）以内です');
    expect(validation_result.field_name).toBe('sales_person_name');
    expect(validation_result.current_length).toBe(6);
    expect(validation_result.max_length_limit).toBe(6);
  });
});