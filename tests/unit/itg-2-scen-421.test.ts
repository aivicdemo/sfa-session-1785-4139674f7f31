import { validateCorrectedDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 修正済みデータ品質再検証', () => {
  // SCEN-421
  test('修正済みデータが1つの品質ルールを満たさない場合、不合格判定と該当項目が返される', () => {
    const corrected_data = {
      customer_name: '田中太郎',
      phone_number: '090-1234-5678',
      email_address: 'tanaka@example.com',
    };

    const quality_rules = [
      {
        rule_id: 'ルール1',
        rule_name: '顧客名の文字数チェック',
        validation_logic: (data: { customer_name: string }) =>
          data.customer_name.length >= 2 && data.customer_name.length <= 50,
        error_message: '顧客名が指定の文字数に該当しません',
        field_name: '顧客名',
      },
      {
        rule_id: 'ルール2',
        rule_name: '電話番号形式チェック',
        validation_logic: (data: { phone_number: string }) =>
          /^0\d{1}-\d{3}-\d{4}-\d{4}$/.test(data.phone_number),
        error_message: '電話番号が指定の形式に該当しません',
        field_name: '電話番号',
      },
    ];

    const result = validateCorrectedDataQuality(corrected_data, quality_rules);

    expect(result.validation_result_status).toBe('不合格');
    expect(result.failed_rule_id).toBe('ルール2');
    expect(result.failure_reason).toBe('電話番号が指定の形式に該当しません');
    expect(result.failed_field_name).toBe('電話番号');
  });
});