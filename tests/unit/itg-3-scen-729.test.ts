import { validateCustomerDataIntegrity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-729: [error] 推奨生成前データ完全性判定機能 - 顧客名が空文字列（ホワイトスペースのみ）のとき推奨生成不可と判定される
  test('顧客名が空文字列のときデータ完全性判定がisValid=falseを返し、エラーコードがCUSTOMER_NAME_EMPTYである', () => {
    const input_customer_data = {
      customer_name: '',
      customer_industry: 'Manufacturing',
      customer_scale: 'Large',
    };

    const result = validateCustomerDataIntegrity(input_customer_data);

    expect(result.is_valid).toBe(false);
    expect(result.error_code).toBe('CUSTOMER_NAME_EMPTY');
    expect(result.validation_message).toBe('顧客名は必須項目です');
    expect(result.can_generate_recommendation).toBe(false);
  });
});