import { validateCorrectedData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-422
  test('修正済みデータが複数の品質ルールを満たさない場合、不合格判定と全ての該当項目が返される', () => {
    const corrected_data = {
      customer_name: '',
      email_address: 'invalid-email-format',
      phone_number: '09012345ABC'
    };

    const quality_rules = [
      {
        rule_id: 'REQUIRED_FIELD_CHECK',
        rule_type: 'mandatory',
        target_field: 'customer_name',
        validation_logic: (value: string) => value.length > 0,
        error_message: '顧客名は必須項目です'
      },
      {
        rule_id: 'EMAIL_FORMAT_VALIDATION',
        rule_type: 'format',
        target_field: 'email_address',
        validation_logic: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        error_message: 'メールアドレス形式が不正です'
      },
      {
        rule_id: 'PHONE_NUMBER_FORMAT_VALIDATION',
        rule_type: 'format',
        target_field: 'phone_number',
        validation_logic: (value: string) => /^\d+$/.test(value),
        error_message: '電話番号は数字のみで構成される必要があります'
      }
    ];

    const result = validateCorrectedData(corrected_data, quality_rules);

    expect(result.status).toBe('failed');
    expect(result.failedRules).toEqual([
      'REQUIRED_FIELD_CHECK',
      'EMAIL_FORMAT_VALIDATION',
      'PHONE_NUMBER_FORMAT_VALIDATION'
    ]);
    expect(result.failedRules).toHaveLength(3);
    expect(result.details).toEqual([
      {
        rule_id: 'REQUIRED_FIELD_CHECK',
        field_name: 'customer_name',
        error_message: '顧客名は必須項目です'
      },
      {
        rule_id: 'EMAIL_FORMAT_VALIDATION',
        field_name: 'email_address',
        error_message: 'メールアドレス形式が不正です'
      },
      {
        rule_id: 'PHONE_NUMBER_FORMAT_VALIDATION',
        field_name: 'phone_number',
        error_message: '電話番号は数字のみで構成される必要があります'
      }
    ]);
  });
});